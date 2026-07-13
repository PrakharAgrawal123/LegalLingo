import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Cpu, Sparkles, AlertTriangle } from "lucide-react";

export default function ProcessingScreen({ filename, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing analyzer...");

  const statusSteps = [
    { threshold: 0, text: "Reading document structure..." },
    { threshold: 20, text: "Extracting legal terms and definitions..." },
    { threshold: 45, text: "Running risk analysis engine..." },
    { threshold: 70, text: "Translating legalese to simple English..." },
    { threshold: 90, text: "Finalizing reports and highlights..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small buffer for visual satisfaction
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4; // Increments of 4-12%
        const nextProgress = Math.min(prevProgress + increment, 100);

        // Update status text based on current progress
        const currentStep = [...statusSteps]
          .reverse()
          .find((step) => nextProgress >= step.threshold);
        if (currentStep) {
          setStatusText(currentStep.text);
        }

        return nextProgress;
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-24 flex flex-col items-center justify-center">
      {/* Document Scanning Animation */}
      <div className="relative w-44 h-56 glass rounded-2xl border border-slate-200/50 dark:border-indigo-500/20 shadow-xl flex flex-col items-center justify-center mb-8 overflow-hidden">
        {/* Scanning laser beam */}
        <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-scan pointer-events-none z-10" />

        <FileText size={56} className="text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-col items-center">
          <div className="w-2/3 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">{progress}%</span>
        </div>

        {/* Float design accents */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-indigo-500/30 animate-pulse" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500/30 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="text-center w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-xs mb-4">
          <Cpu size={12} className="animate-spin" />
          AI Engine Processing
        </div>
        <h2 className="font-outfit font-extrabold text-xl text-slate-800 dark:text-slate-100 truncate max-w-sm mx-auto">
          {filename}
        </h2>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full mt-6 overflow-hidden border border-slate-100 dark:border-slate-800">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
            className="h-full bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full"
          />
        </div>

        {/* Percentage text */}
        <div className="flex justify-between items-center mt-3 font-mono text-xs text-slate-400">
          <span>{statusText}</span>
          <span className="font-bold text-slate-800 dark:text-indigo-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
