import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProcessingScreen from "../components/ProcessingScreen";
import Dashboard from "../components/Dashboard";
import API from "../services/api";
import { mockContracts } from "../data/mockData";
import { FileText, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [screen, setScreen] = useState("dashboard"); // 'processing' | 'dashboard' | 'empty'
  const [pending, setPending] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pendingStr = localStorage.getItem("pendingAnalysis");
    const activeStr = localStorage.getItem("activeAnalysis");

    if (pendingStr) {
      const parsed = JSON.parse(pendingStr);
      setPending(parsed);
      setScreen("processing");
      localStorage.removeItem("pendingAnalysis"); // Clear it
    } else if (activeStr) {
      const parsed = JSON.parse(activeStr);
      setAnalysisData(parsed);
      setScreen("dashboard");
    } else {
      setScreen("empty");
    }
  }, []);

  const handleUploadComplete = async () => {
    if (!pending) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("filename", pending.filename);
      formData.append("templateKey", pending.templateKey);
      formData.append("inputType", pending.inputType);

      if (pending.inputType === "text") {
        formData.append("text", pending.text);
      }

      const res = await API.post("/api/analyze", formData);
      setAnalysisData(res.data);
      setScreen("dashboard");
      
      // Save it as current active analysis
      localStorage.setItem("activeAnalysis", JSON.stringify(res.data));
    } catch (err) {
      console.warn("Failed to analyze contract via API, using fallback data:", err);
      const fallback = mockContracts[pending.templateKey] || mockContracts.rent_agreement;
      setAnalysisData(fallback);
      setScreen("dashboard");
      localStorage.setItem("activeAnalysis", JSON.stringify(fallback));
    } finally {
      setLoading(false);
    }
  };

  if (screen === "processing") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] w-full">
        <ProcessingScreen
          filename={pending?.filename || "Document.pdf"}
          inputType={pending?.inputType || "document"}
          onComplete={handleUploadComplete}
        />
      </div>
    );
  }

  if (screen === "empty") {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
          <FileText size={42} />
        </div>
        <h2 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-slate-105">
          No Contract Loaded
        </h2>
        <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
          Please upload a document or paste contract clauses on the home page to begin analyzing.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
        >
          Go to Home
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full">
      {analysisData && (
        <Dashboard
          data={analysisData}
          filename={analysisData.name}
        />
      )}
    </div>
  );
}
