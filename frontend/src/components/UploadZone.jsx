import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadZone({ onUploadStart, onUploadComplete }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    setErrorMsg("");

    // Support PDF, DOCX, TXT, MD
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown"
    ];
    
    // Accept standard extension fallbacks or simple text files
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isDoc = validTypes.includes(file.type) || ["pdf", "docx", "txt", "md"].includes(fileExtension);

    if (!isDoc) {
      setErrorMsg("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    // Determine mock template key based on name
    let templateKey = "rent_agreement";
    const nameLower = file.name.toLowerCase();
    if (nameLower.includes("offer") || nameLower.includes("employee") || nameLower.includes("job") || nameLower.includes("work")) {
      templateKey = "employment_contract";
    } else if (nameLower.includes("saas") || nameLower.includes("term") || nameLower.includes("service") || nameLower.includes("cloud")) {
      templateKey = "saas_terms";
    }

    onUploadStart(file.name, templateKey);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Quick select presets
  const samples = [
    { name: "Residential Lease Agreement", key: "rent_agreement", filename: "Residential_Lease_Agreement_Draft.pdf", badge: "Rent Contract" },
    { name: "Senior Dev Offer Letter", key: "employment_contract", filename: "Offer_Letter_Senior_Engineer.pdf", badge: "Employment" },
    { name: "SaaS Terms of Service", key: "saas_terms", filename: "SaaS_Service_Agreement_v4.pdf", badge: "Service Terms" }
  ];

  return (
    <div id="upload-section" className="w-full max-w-4xl mx-auto px-4 py-16 scroll-mt-20 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-white">
          Upload Your Contract
        </h2>
        <p className="font-inter text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Drag and drop your file below to identify unfair clauses and translate complex terms.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        animate={{
          borderColor: isDragActive ? "rgba(99, 102, 241, 1)" : "rgba(148, 163, 184, 0.3)",
          backgroundColor: isDragActive ? "rgba(99, 102, 241, 0.05)" : "rgba(255, 255, 255, 0.01)"
        }}
        transition={{ duration: 0.2 }}
        className={`w-full h-80 rounded-3xl border-2 border-dashed glass flex flex-col items-center justify-center relative overflow-hidden px-6 text-center cursor-pointer ${
          isDragActive ? "animate-border-pulse" : ""
        }`}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleChange}
        />

        <motion.div 
          animate={{ y: isDragActive ? -10 : 0 }}
          className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm"
        >
          <UploadCloud size={36} className={isDragActive ? "animate-bounce" : ""} />
        </motion.div>

        <h3 className="font-outfit font-semibold text-lg text-slate-800 dark:text-slate-200">
          {isDragActive ? "Drop your file here!" : "Drag & Drop your contract here"}
        </h3>
        <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs">
          Supports PDF, DOCX, TXT, or MD up to 10MB
        </p>

        <span className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200/10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-colors">
          Browse File
        </span>

        {/* Glow Accent */}
        <div className="absolute -bottom-10 w-1/2 h-10 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
      </motion.div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium"
        >
          <AlertCircle size={16} />
          {errorMsg}
        </motion.div>
      )}

      {/* Preset Samples Selector */}
      <div className="w-full mt-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800" />
          <span className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-widest">
            Don't have a document handy?
          </span>
          <div className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {samples.map((sample) => (
            <motion.button
              key={sample.key}
              whileHover={{ scale: 1.02, y: -2, border: "1px solid rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onUploadStart(sample.filename, sample.key)}
              className="glass p-4 rounded-2xl text-left border border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {sample.badge}
                </span>
                <FileText size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h4 className="font-outfit font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                {sample.name}
              </h4>
              <span className="text-[11px] text-indigo-600 dark:text-teal-400 font-semibold mt-2 inline-flex items-center gap-1">
                Load Sample
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
