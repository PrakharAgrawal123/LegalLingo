import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Image, AlignLeft, AlertCircle, X } from "lucide-react";

export default function UploadZone({ onUploadStart, onUploadComplete }) {
  const [activeTab, setActiveTab] = useState("document"); // 'document' | 'image' | 'text'
  const [selectedFile, setSelectedFile] = useState(null); // Used for both document and image
  const [pastedText, setPastedText] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const tabs = [
    { id: "document", label: "Upload Document" },
    { id: "image", label: "Upload Image" },
    { id: "text", label: "Paste Text" }
  ];

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

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isDoc = ["pdf", "docx", "txt", "md"].includes(fileExtension);
    const isImg = ["png", "jpg", "jpeg"].includes(fileExtension);

    if (activeTab === "document" && isImg) {
      // Auto-switch to image tab if they dropped an image in the document tab
      setActiveTab("image");
      setSelectedFile(file);
    } else if (activeTab === "image" && isDoc) {
      // Auto-switch to document tab if they dropped a doc in the image tab
      setActiveTab("document");
      setSelectedFile(file);
    } else if (isDoc || isImg) {
      setSelectedFile(file);
    } else {
      setErrorMsg("Unsupported file format. Please upload PDF, DOCX, TXT, MD, PNG, JPG, or JPEG.");
    }
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

  const formatBytes = (bytes, decimals = 1) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const getFileTypeLabel = (file) => {
    if (!file) return "";
    const ext = file.name.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "PDF Document";
      case "docx": return "Word Document";
      case "txt": return "Text File";
      case "md": return "Markdown Document";
      case "png": return "PNG Image";
      case "jpg":
      case "jpeg": return "JPEG Image";
      default: return file.type || "Unknown File";
    }
  };

  const handleAnalyze = () => {
    if (activeTab === "text") {
      if (!pastedText.trim()) {
        setErrorMsg("Please paste some legal text to analyze.");
        return;
      }
      
      // Determine templateKey from pasted text keywords
      let templateKey = "rent_agreement";
      const textLower = pastedText.toLowerCase();
      if (textLower.includes("offer") || textLower.includes("employee") || textLower.includes("job") || textLower.includes("work") || textLower.includes("employment")) {
        templateKey = "employment_contract";
      } else if (textLower.includes("saas") || textLower.includes("term") || textLower.includes("service") || textLower.includes("cloud") || textLower.includes("subscription")) {
        templateKey = "saas_terms";
      }

      onUploadStart("Pasted_Contract_Text.txt", templateKey, "text", pastedText);
    } else {
      if (!selectedFile) {
        setErrorMsg("Please select or drop a file first.");
        return;
      }

      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      
      // Extra validation check just in case
      if (activeTab === "document" && !["pdf", "docx", "txt", "md"].includes(fileExtension)) {
        setErrorMsg("Please upload a PDF, DOCX, TXT, or MD file.");
        return;
      }
      if (activeTab === "image" && !["png", "jpg", "jpeg"].includes(fileExtension)) {
        setErrorMsg("Please upload a PNG, JPG, or JPEG image.");
        return;
      }

      // Guess templateKey based on name
      let templateKey = "rent_agreement";
      const nameLower = selectedFile.name.toLowerCase();
      if (nameLower.includes("offer") || nameLower.includes("employee") || nameLower.includes("job") || nameLower.includes("work") || nameLower.includes("employment")) {
        templateKey = "employment_contract";
      } else if (nameLower.includes("saas") || nameLower.includes("term") || nameLower.includes("service") || nameLower.includes("cloud") || nameLower.includes("subscription")) {
        templateKey = "saas_terms";
      }

      onUploadStart(selectedFile.name, templateKey, activeTab, selectedFile);
    }
  };

  // Quick select presets (clicking these goes straight to scanning to match original behavior)
  const samples = [
    { name: "Residential Lease Agreement", key: "rent_agreement", filename: "Residential_Lease_Agreement_Draft.pdf", badge: "Rent Contract" },
    { name: "Senior Dev Offer Letter", key: "employment_contract", filename: "Offer_Letter_Senior_Engineer.pdf", badge: "Employment" },
    { name: "SaaS Terms of Service", key: "saas_terms", filename: "SaaS_Service_Agreement_v4.pdf", badge: "Service Terms" }
  ];

  return (
    <div id="upload-section" className="w-full max-w-4xl mx-auto px-4 py-16 scroll-mt-20 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-white">
          Analyze Your Agreement
        </h2>
        <p className="font-inter text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Choose an input method below to instantly translate legal jargon and detect contract risks.
        </p>
      </div>

      {/* Segmented Tab Options */}
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl mb-8 w-full max-w-md relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedFile(null);
              setPastedText("");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl relative transition-colors duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeUploadTab"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Upload Card Container */}
      <div className="w-full min-h-[320px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {activeTab === "document" && (
            <motion.div
              key="document-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center"
            >
              {selectedFile ? (
                /* Document Details Preview */
                <div className="w-full space-y-6">
                  <div className="w-full p-6 rounded-3xl glass border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-4 rounded-2xl bg-indigo-550/10 dark:bg-indigo-500/15 text-indigo-650 dark:text-indigo-400 border border-indigo-200/10 shadow-sm flex-shrink-0">
                        <FileText size={32} />
                      </div>
                      <div className="text-left min-w-0">
                        <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-md">
                          {selectedFile.name}
                        </h4>
                        <p className="font-inter text-xs text-slate-550 dark:text-slate-455 mt-1 flex gap-2">
                          <span>{formatBytes(selectedFile.size)}</span>
                          <span>•</span>
                          <span className="text-indigo-600 dark:text-teal-400 font-semibold">{getFileTypeLabel(selectedFile)}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setErrorMsg("");
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/60 hover:bg-red-500/15 hover:text-red-500 text-slate-500 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg cursor-pointer text-center"
                  >
                    Analyze Document
                  </motion.button>
                </div>
              ) : (
                /* Document Dropzone */
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
                  <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
                    <UploadCloud size={36} />
                  </div>
                  <h3 className="font-outfit font-semibold text-lg text-slate-800 dark:text-slate-200">
                    Drag & Drop contract file here
                  </h3>
                  <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
                    Supports PDF, DOCX, TXT, MD, PNG, JPG, JPEG up to 10MB
                  </p>
                  <span className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200/10 hover:bg-indigo-600 hover:text-white transition-colors">
                    Browse Document
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "image" && (
            <motion.div
              key="image-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center"
            >
              {selectedFile ? (
                /* Image Preview Card */
                <div className="w-full space-y-6 flex flex-col items-center">
                  <div className="w-full p-6 rounded-3xl glass border border-slate-200/50 dark:border-slate-800/80 flex flex-col items-center justify-center gap-5">
                    <div className="relative w-full max-w-xs h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Contract Thumbnail"
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setErrorMsg("");
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-red-650 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <div className="text-center min-w-0">
                      <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {selectedFile.name}
                      </h4>
                      <p className="font-inter text-xs text-slate-500 mt-1 flex gap-2 justify-center">
                        <span>{formatBytes(selectedFile.size)}</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-teal-400 font-semibold">{getFileTypeLabel(selectedFile)}</span>
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(20, 184, 166, 0.45)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold shadow-lg cursor-pointer text-center"
                  >
                    Analyze Image (with OCR)
                  </motion.button>
                </div>
              ) : (
                /* Image Dropzone */
                <motion.div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  animate={{
                    borderColor: isDragActive ? "rgba(20, 184, 166, 1)" : "rgba(148, 163, 184, 0.3)",
                    backgroundColor: isDragActive ? "rgba(20, 184, 166, 0.05)" : "rgba(255, 255, 255, 0.01)"
                  }}
                  className={`w-full h-80 rounded-3xl border-2 border-dashed glass flex flex-col items-center justify-center relative overflow-hidden px-6 text-center cursor-pointer ${
                    isDragActive ? "animate-border-pulse" : ""
                  }`}
                  onClick={onButtonClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleChange}
                  />
                  <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
                    <Image size={36} />
                  </div>
                  <h3 className="font-outfit font-semibold text-lg text-slate-800 dark:text-slate-200">
                    Drag & Drop contract image here
                  </h3>
                  <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm">
                    Supports PDF, DOCX, TXT, MD, PNG, JPG, JPEG up to 10MB
                  </p>
                  <span className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/15 hover:bg-teal-555 hover:text-white transition-colors">
                    Browse Image
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "text" && (
            <motion.div
              key="text-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              <div className="w-full space-y-4">
                <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all duration-300 shadow-sm">
                  <textarea
                    value={pastedText}
                    onChange={(e) => {
                      setPastedText(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Paste the full text of your legal agreement, contract, lease, or specific clauses here..."
                    rows={8}
                    className="w-full p-5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 placeholder-slate-400 text-sm font-inter leading-relaxed resize-y min-h-[180px]"
                  />
                  <div className="flex justify-between items-center px-4 py-2 border-t border-slate-100 dark:border-slate-900/60 text-[10px] text-slate-450 font-semibold uppercase tracking-wider">
                    <span>Character count: {pastedText.length}</span>
                    <span>Word count: {pastedText.trim() === "" ? 0 : pastedText.trim().split(/\s+/).length}</span>
                  </div>
                </div>
                
                {pastedText.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-left"
                  >
                    <span className="font-outfit text-[11px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block mb-2">
                      Text Preview (First few lines)
                    </span>
                    <p className="font-inter text-xs text-slate-650 dark:text-slate-400 italic line-clamp-3 leading-relaxed">
                      {pastedText}
                    </p>
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={pastedText.trim().length === 0}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold shadow-lg text-center transition-all ${
                  pastedText.trim().length > 0
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white cursor-pointer"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                Analyze Pasted Text
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-red-650 dark:text-red-400 text-sm font-medium"
        >
          <AlertCircle size={16} />
          {errorMsg}
        </motion.div>
      )}

      {/* Preset Samples Selector */}
      <div className="w-full mt-12">
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
              onClick={() => onUploadStart(sample.filename, sample.key, "document", null)}
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
              <span className="text-[11px] text-indigo-650 dark:text-teal-400 font-semibold mt-2 inline-flex items-center gap-1">
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
