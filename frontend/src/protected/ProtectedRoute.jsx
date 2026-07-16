import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Scale } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b19] flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200/10 shadow-lg animate-pulse-slow">
            <Scale size={42} className="animate-spin-slow" />
          </div>
          <span className="font-outfit font-extrabold text-lg text-slate-800 dark:text-slate-200 animate-pulse">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and store the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
