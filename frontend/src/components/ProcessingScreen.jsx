import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Image, AlignLeft, Cpu, CheckCircle2 } from "lucide-react";

export default function ProcessingScreen({ filename, inputType = "document", onComplete }) {
  const [progress, setProgress] = useState(0);

  // Define steps dynamically based on inputType
  const steps = [
    "Preparing Document",
    "Reading Content",
    ...(inputType === "image" ? ["Extracting Text (OCR)"] : []),
    "Detecting Legal Clauses",
    "Running Risk Analysis",
    "Simplifying Legal Language",
    "Generating AI Summary",
    "Completed"
  ];

  // Calculate current active step based on progress percentage
  const getActiveStepIndex = () => {
    const totalSteps = steps.length;
    const stepRange = 100 / totalSteps;
    const index = Math.floor(progress / stepRange);
    return Math.min(index, totalSteps - 1);
  };

  const activeStepIndex = getActiveStepIndex();
  const statusText = progress === 100 ? "Completed" : steps[activeStepIndex] + "...";

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600); // Small buffer for visual satisfaction
          return 100;
        }

        // Slightly random increments
        const increment = Math.floor(Math.random() * 8) + 4; // Increments of 4-12%
        return Math.min(prevProgress + increment, 100);
      });
    }, 250);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
      {/* Document Scanning Animation */}
      <div className="relative w-44 h-56 glass rounded-2xl border border-slate-200/50 dark:border-indigo-500/20 shadow-xl flex flex-col items-center justify-center mb-8 overflow-hidden">
        {/* Scanning laser beam */}
        <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(20,184,166,0.8)] animate-scan pointer-events-none z-10" />

        {inputType === "image" ? (
          <Image size={56} className="text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
        ) : inputType === "text" ? (
          <AlignLeft size={56} className="text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
        ) : (
          <FileText size={56} className="text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
        )}
        
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

      {/* Analysis Pipeline Checklist */}
      <div className="mt-8 w-full glass rounded-3xl p-5 border border-slate-200/50 dark:border-slate-800/80 text-left shadow-sm">
        <span className="font-outfit text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-4">
          Analysis Pipeline Status
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-medium">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStepIndex || progress === 100;
            const isActive = idx === activeStepIndex && progress < 100;
            
            return (
              <div 
                key={step} 
                className={`flex items-center gap-2.5 transition-all duration-300 ${
                  isCompleted ? "text-emerald-500 dark:text-emerald-400" :
                  isActive ? "text-indigo-600 dark:text-teal-400 font-semibold" :
                  "text-slate-400 dark:text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 dark:border-teal-400 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-800 flex-shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
