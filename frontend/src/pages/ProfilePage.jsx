import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { motion } from "framer-motion";
import { User, Mail, Calendar, ShieldCheck, FileText, ArrowRight, ShieldAlert, Cpu, RefreshCw, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/api/history");
        setHistory(res.data);
      } catch (err) {
        console.warn("Failed to fetch history:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewAnalysis = (item) => {
    // Save to localStorage or state to simulate reloading in dashboard
    localStorage.setItem("activeAnalysis", JSON.stringify(item));
    toast.success(`Loading analysis for ${item.name}`);
    navigate("/dashboard");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/15";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/15";
    return "text-red-500 bg-red-500/10 border-red-500/15";
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-20 -left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-10 w-96 h-96 bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title */}
      <div className="mb-8 text-left">
        <h1 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-white">
          My Account
        </h1>
        <p className="font-inter text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal details, profile, and document history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Profile Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-md flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Avatar */}
            <div className="relative mb-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full border-2 border-indigo-500/20 object-cover shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-outfit font-bold text-3xl flex items-center justify-center shadow-md border-2 border-white/10">
                  {initials}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070b19]" />
            </div>

            <h2 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">
              {user?.fullName || "User Account"}
            </h2>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 uppercase tracking-widest border border-slate-200/20">
              {user?.provider === "google" ? "Google User" : "Email Member"}
            </span>

            {/* Profile Info Details */}
            <div className="w-full mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 space-y-4 text-sm text-left">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">Joined {formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  Status: {user?.isVerified ? "Verified Account" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/80 text-center shadow-sm">
              <span className="font-outfit font-black text-2xl text-indigo-600 dark:text-teal-400 block">
                {history.length}
              </span>
              <span className="font-inter text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Total Uploads
              </span>
            </div>
            <div className="glass rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/80 text-center shadow-sm">
              <span className="font-outfit font-black text-2xl text-indigo-600 dark:text-teal-400 block">
                {history.filter(h => h.healthScore < 70).length}
              </span>
              <span className="font-inter text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                Risky Audits
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: History List (8 Cols) */}
        <div className="lg:col-span-8 glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 shadow-md">
          <h3 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            Document History
          </h3>

          {fetching ? (
            <div className="py-16 flex justify-center items-center">
              <RefreshCw size={24} className="text-indigo-500 animate-spin" />
            </div>
          ) : history.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <th className="pb-3 pl-2">Filename</th>
                    <th className="pb-3 hidden sm:table-cell">Analyzed on</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-sm font-medium">
                  {history.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 pl-2 font-outfit max-w-[150px] sm:max-w-xs truncate text-slate-800 dark:text-slate-200">
                        {item.name}
                      </td>
                      <td className="py-4 text-xs text-slate-500 hidden sm:table-cell">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getScoreColor(item.healthScore)}`}>
                          {item.healthScore}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          onClick={() => handleViewAnalysis(item)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-teal-400 hover:bg-slate-50 transition-all text-xs flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm"
                        >
                          View
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-4">
              <FileText size={36} className="text-slate-350 dark:text-slate-650 mx-auto" />
              <p className="font-inter text-slate-550 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                No analyses found yet. Upload a legal agreement on the landing page to start tracking!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Upload Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
