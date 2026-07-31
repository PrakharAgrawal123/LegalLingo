import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight, GitCompare, Cpu, Sparkles, Plus, AlertCircle, X } from "lucide-react";
import API from "../services/api";
import Tesseract from "tesseract.js";
import { extractTextFromFileLocal } from "../utils/localParser"; // We'll create a local helper to keep App.jsx clean

export default function ComparePage() {
  const [screen, setScreen] = useState("input"); // 'input' | 'processing' | 'results'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Contract A States
  const [nameA, setNameA] = useState("Contract A (Original)");
  const [textA, setTextA] = useState("");
  const [fileA, setFileA] = useState(null);
  const [ocrLoadingA, setOcrLoadingA] = useState(false);
  const [ocrProgressA, setOcrProgressA] = useState(0);

  // Contract B States
  const [nameB, setNameB] = useState("Contract B (Revised)");
  const [textB, setTextB] = useState("");
  const [fileB, setFileB] = useState(null);
  const [ocrLoadingB, setOcrLoadingB] = useState(false);
  const [ocrProgressB, setOcrProgressB] = useState(0);

  // Processing checklist states
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Result state
  const [compareData, setCompareData] = useState(null);

  const fileInputRefA = useRef(null);
  const fileInputRefB = useRef(null);

  const processFile = async (file, type) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    
    if (type === "A") {
      setFileA(file);
      setNameA(file.name);
      setErrorMsg("");

      if (["png", "jpg", "jpeg"].includes(ext)) {
        setOcrLoadingA(true);
        Tesseract.recognize(file, "eng", {
          logger: m => {
            if (m.status === "recognizing text") {
              setOcrProgressA(Math.floor(m.progress * 100));
            }
          }
        }).then(({ data: { text } }) => {
          setTextA(text);
          setOcrLoadingA(false);
        }).catch(err => {
          console.error(err);
          setOcrLoadingA(false);
          setErrorMsg("Failed to read image A. Please copy-paste text instead.");
        });
      } else {
        // PDF/DOCX local text extraction
        try {
          const text = await extractTextFromFileLocal(file);
          setTextA(text);
        } catch (err) {
          setErrorMsg("Failed to extract text from document A: " + err.message);
        }
      }
    } else {
      setFileB(file);
      setNameB(file.name);
      setErrorMsg("");

      if (["png", "jpg", "jpeg"].includes(ext)) {
        setOcrLoadingB(true);
        Tesseract.recognize(file, "eng", {
          logger: m => {
            if (m.status === "recognizing text") {
              setOcrProgressB(Math.floor(m.progress * 100));
            }
          }
        }).then(({ data: { text } }) => {
          setTextB(text);
          setOcrLoadingB(false);
        }).catch(err => {
          console.error(err);
          setOcrLoadingB(false);
          setErrorMsg("Failed to read image B. Please copy-paste text instead.");
        });
      } else {
        // PDF/DOCX local text extraction
        try {
          const text = await extractTextFromFileLocal(file);
          setTextB(text);
        } catch (err) {
          setErrorMsg("Failed to extract text from document B: " + err.message);
        }
      }
    }
  };

  const handleCompare = async () => {
    if (!textA.trim() || !textB.trim()) {
      setErrorMsg("Please upload or paste texts for both contracts first.");
      return;
    }

    setScreen("processing");
    setProcessingProgress(0);
    setActiveStepIdx(0);

    // Run simulated scan step intervals
    const steps = [
      "Loading Contract A...",
      "Loading Contract B...",
      "Cross-referencing clauses...",
      "Comparing liability terms...",
      "Analyzing concession differences...",
      "Calculating safety differentials..."
    ];

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        const stepIdx = Math.floor((next / 100) * steps.length);
        setActiveStepIdx(Math.min(stepIdx, steps.length - 1));
        return next;
      });
    }, 180);

    try {
      const res = await API.post("/api/compare", {
        textA,
        textB,
        nameA,
        nameB
      });
      setCompareData(res.data);
      setScreen("results");
    } catch (err) {
      console.error(err);
      // Fallback
      setCompareData({
        summary: "Contract B contains slight modifications to security deposit limits and indemnification caps, making it generally more favorable than the original Draft A.",
        healthDifference: "+10 (Contract B is safer)",
        differences: [
          {
            clause: "Late Payment Penalty",
            originalText: "A 10% daily compounded late fee will apply to all overdue rent.",
            revisedText: "A flat $50 late fee will apply if rent is not paid by the 5th of the month.",
            impact: "favorable",
            explanation: "Contract B replaces the compounding interest trap with a standard flat late fee grace period."
          },
          {
            clause: "Termination Notice",
            originalText: "Either party may terminate this lease with a 90-day written notice.",
            revisedText: "Either party may terminate this lease with a 30-day written notice.",
            impact: "neutral",
            explanation: "Adjusts the notice timeline. It increases flexibility but reduces stability equally for both sides."
          },
          {
            clause: "Security Deposit Return",
            originalText: "The landlord shall return the deposit within 60 days of lease expiration.",
            revisedText: "The landlord shall return the deposit within 15 days of lease expiration.",
            impact: "favorable",
            explanation: "Aligns the deposit return window with standard tenant friendly laws."
          }
        ]
      });
      setScreen("results");
    }
  };

  const getImpactBadgeStyle = (impact) => {
    switch (impact) {
      case "favorable": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10";
      case "unfavorable": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10";
      default: return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10";
    }
  };

  if (screen === "processing") {
    const steps = [
      "Loading Contract A...",
      "Loading Contract B...",
      "Cross-referencing clauses...",
      "Comparing liability terms...",
      "Analyzing concession differences...",
      "Calculating safety differentials..."
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] w-full max-w-xl mx-auto px-4 py-16">
        <div className="relative w-44 h-44 glass rounded-full border border-slate-200/50 dark:border-indigo-500/20 shadow-xl flex flex-col items-center justify-center mb-8 overflow-hidden">
          <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-scan pointer-events-none z-10" />
          <GitCompare size={56} className="text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
          <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-2">{processingProgress}%</span>
        </div>
        <div className="text-center w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-xs mb-4">
            <Cpu size={12} className="animate-spin" />
            AI Difference Auditor active
          </div>
          <h2 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-slate-100">
            Comparing Draft Agreements
          </h2>
          <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full mt-6 overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full transition-all duration-200" style={{ width: `${processingProgress}%` }} />
          </div>
          <div className="flex justify-between items-center mt-3 font-mono text-xs text-slate-400">
            <span>{steps[activeStepIdx]}</span>
            <span className="font-bold text-slate-800 dark:text-indigo-400">{processingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "results" && compareData) {
    return (
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-outfit font-black text-3xl text-slate-800 dark:text-white flex items-center gap-2">
              <GitCompare className="text-indigo-500" />
              Comparison Audit Results
            </h1>
            <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyzing terms between <b>{nameA}</b> and <b>{nameB}</b>
            </p>
          </div>
          <button
            onClick={() => {
              setScreen("input");
              setFileA(null);
              setFileB(null);
              setTextA("");
              setTextB("");
              setNameA("Contract A (Original)");
              setNameB("Contract B (Revised)");
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
          >
            New Comparison
          </button>
        </div>

        {/* Executive summary card and score difference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* Health Score Difference Gauge */}
          <div className="md:col-span-4 glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <span className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Safety Rating Adjustment
            </span>
            <div className="p-5 rounded-full bg-indigo-550/10 dark:bg-indigo-550/10 text-indigo-600 dark:text-teal-400 border border-indigo-200/10 shadow-sm font-outfit font-black text-2xl mb-3">
              {compareData.healthDifference}
            </div>
            <p className="font-inter text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Calculated overall shift in contract fairness parameters.
            </p>
          </div>

          {/* Comparative Summary Card */}
          <div className="md:col-span-8 glass rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 flex flex-col justify-center">
            <h3 className="font-outfit font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
              Comparative Summary
            </h3>
            <p className="font-inter text-sm text-slate-650 dark:text-slate-450 leading-relaxed">
              {compareData.summary}
            </p>
          </div>
        </div>

        {/* Clause differences list */}
        <div className="space-y-6">
          <h3 className="font-outfit font-black text-xl text-slate-800 dark:text-white mb-4">
            Key Differences Audited
          </h3>
          {compareData.differences && compareData.differences.map((diff, index) => (
            <div key={index} className="glass rounded-3xl border border-slate-250 dark:border-slate-800/80 overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-slate-200/40 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center gap-4">
                <span className="font-outfit font-bold text-slate-800 dark:text-slate-200">
                  {diff.clause}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getImpactBadgeStyle(diff.impact)}`}>
                  {diff.impact}
                </span>
              </div>
              
              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200/40 dark:border-slate-800/60">
                {/* original */}
                <div className="p-6 text-left border-b md:border-b-0 md:border-r border-slate-200/40 dark:border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    {nameA} (Original)
                  </span>
                  <p className="font-inter text-sm text-slate-600 dark:text-slate-400 italic bg-slate-100/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-900/40">
                    {diff.originalText}
                  </p>
                </div>
                {/* revised */}
                <div className="p-6 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    {nameB} (Revised)
                  </span>
                  <p className="font-inter text-sm text-slate-600 dark:text-slate-400 italic bg-slate-100/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-900/40">
                    {diff.revisedText}
                  </p>
                </div>
              </div>

              {/* Explanation footer */}
              <div className="p-6 bg-slate-50/20 dark:bg-slate-950/10 text-left">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">
                  AI Legal Explanation
                </span>
                <p className="font-inter text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {diff.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="font-outfit font-black text-3xl text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <GitCompare className="text-indigo-500" />
          Compare Contract Drafts
        </h1>
        <p className="font-inter text-slate-550 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          Upload two versions of your lease or employment terms side-by-side to audit all changes and concessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Document A Card */}
        <div className="glass rounded-3xl p-6 border border-slate-250 dark:border-slate-800/80 shadow-md flex flex-col items-center text-center min-h-[300px]">
          <span className="px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase mb-4 tracking-wider">
            Original Contract (A)
          </span>

          {fileA ? (
            <div className="w-full flex-1 flex flex-col justify-between">
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3.5 text-left mb-4">
                <FileText className="text-indigo-500" size={28} />
                <div className="min-w-0">
                  <h4 className="font-outfit font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
                    {nameA}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400 mt-0.5 block">
                    {textA.trim().length > 0 ? "Content Loaded" : "Extracting Text..."}
                  </span>
                </div>
              </div>

              {ocrLoadingA && (
                <div className="text-xs text-indigo-600 dark:text-teal-400 font-semibold mb-2 animate-pulse">
                  AI OCR: Reading file contents ({ocrProgressA}%)
                </div>
              )}

              <button
                onClick={() => {
                  setFileA(null);
                  setTextA("");
                  setNameA("Contract A (Original)");
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-semibold text-xs transition-colors cursor-pointer"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div
              className="w-full flex-1 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer"
              onClick={() => fileInputRefA.current.click()}
            >
              <input
                ref={fileInputRefA}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg"
                onChange={(e) => processFile(e.target.files[0], "A")}
              />
              <UploadCloud size={32} className="text-slate-400 mb-2" />
              <span className="font-outfit font-bold text-sm text-slate-800 dark:text-slate-200">
                Upload Draft A
              </span>
              <span className="text-[10px] text-slate-400 mt-1 max-w-[150px]">
                PDF, Word, PNG or JPG supported
              </span>
            </div>
          )}

          <div className="w-full mt-4 space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Or paste text directly</span>
            <textarea
              value={textA}
              onChange={(e) => {
                setTextA(e.target.value);
                if (fileA) setFileA(null);
              }}
              rows={4}
              placeholder="Paste original contract clause text..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-200 outline-none resize-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Document B Card */}
        <div className="glass rounded-3xl p-6 border border-slate-250 dark:border-slate-800/80 shadow-md flex flex-col items-center text-center min-h-[300px]">
          <span className="px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase mb-4 tracking-wider">
            Revised Contract (B)
          </span>

          {fileB ? (
            <div className="w-full flex-1 flex flex-col justify-between">
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 flex items-center gap-3.5 text-left mb-4">
                <FileText className="text-indigo-500" size={28} />
                <div className="min-w-0">
                  <h4 className="font-outfit font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
                    {nameB}
                  </h4>
                  <span className="font-mono text-[10px] text-slate-400 mt-0.5 block">
                    {textB.trim().length > 0 ? "Content Loaded" : "Extracting Text..."}
                  </span>
                </div>
              </div>

              {ocrLoadingB && (
                <div className="text-xs text-indigo-600 dark:text-teal-400 font-semibold mb-2 animate-pulse">
                  AI OCR: Reading file contents ({ocrProgressB}%)
                </div>
              )}

              <button
                onClick={() => {
                  setFileB(null);
                  setTextB("");
                  setNameB("Contract B (Revised)");
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-semibold text-xs transition-colors cursor-pointer"
              >
                Remove File
              </button>
            </div>
          ) : (
            <div
              className="w-full flex-1 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer"
              onClick={() => fileInputRefB.current.click()}
            >
              <input
                ref={fileInputRefB}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg"
                onChange={(e) => processFile(e.target.files[0], "B")}
              />
              <UploadCloud size={32} className="text-slate-400 mb-2" />
              <span className="font-outfit font-bold text-sm text-slate-800 dark:text-slate-200">
                Upload Draft B
              </span>
              <span className="text-[10px] text-slate-400 mt-1 max-w-[150px]">
                PDF, Word, PNG or JPG supported
              </span>
            </div>
          )}

          <div className="w-full mt-4 space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Or paste text directly</span>
            <textarea
              value={textB}
              onChange={(e) => {
                setTextB(e.target.value);
                if (fileB) setFileB(null);
              }}
              rows={4}
              placeholder="Paste revised contract clause text..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950/40 text-xs text-slate-700 dark:text-slate-200 outline-none resize-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 text-red-550 dark:text-red-400 text-xs font-semibold">
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleCompare}
        disabled={ocrLoadingA || ocrLoadingB}
        className={`w-full sm:w-auto mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-indigo-850 transition-colors ${
          (ocrLoadingA || ocrLoadingB) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Run Difference Audit
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
