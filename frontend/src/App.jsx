import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadZone from "./components/UploadZone";
import ProcessingScreen from "./components/ProcessingScreen";
import Dashboard from "./components/Dashboard";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { mockContracts } from "./data/mockData";

export default function App() {
  const [screen, setScreen] = useState("landing"); // 'landing' | 'processing' | 'dashboard'
  const [theme, setTheme] = useState("dark"); // Default to dark mode for a premium tech vibe
  const [fileMeta, setFileMeta] = useState({ name: "", key: "" });
  const [analysisData, setAnalysisData] = useState(null);

  // Sync theme with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleUploadStart = (filename, templateKey) => {
    setFileMeta({ name: filename, key: templateKey });
    setScreen("processing");
    setAnalysisData(null);

    // Call backend API
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("templateKey", templateKey);

    fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setAnalysisData(data);
      })
      .catch((err) => {
        console.warn("Backend API not reachable. Using fallback local data.", err);
        // Load fallback local mock data
        setAnalysisData(mockContracts[templateKey] || mockContracts.rent_agreement);
      });
  };

  const handleUploadComplete = () => {
    setScreen("dashboard");
  };

  const resetApp = () => {
    setFileMeta({ name: "", key: "" });
    setAnalysisData(null);
    setScreen("landing");
  };

  const onGetStarted = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Select document data based on the API response, falling back to local mock data
  const documentData = analysisData || mockContracts[fileMeta.key] || mockContracts.rent_agreement;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b19] text-slate-800 dark:text-slate-200 flex flex-col font-sans transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Background ambient glow shapes for visual interest */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 to-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Sticky Glass Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        screen={screen}
        setScreen={setScreen}
        resetApp={resetApp}
      />

      {/* Main screens container with exit/enter transitions */}
      <main className="flex-1 flex flex-col w-full">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col w-full"
            >
              {/* Hero header */}
              <Hero onGetStarted={onGetStarted} />
              
              {/* Upload Contract Dropzone */}
              <UploadZone
                onUploadStart={handleUploadStart}
                onUploadComplete={handleUploadComplete}
              />
              
              {/* Core capabilities & FAQs */}
              <Features />
            </motion.div>
          )}

          {screen === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex items-center justify-center min-h-[60vh] w-full"
            >
              <ProcessingScreen
                filename={fileMeta.name}
                onComplete={handleUploadComplete}
              />
            </motion.div>
          )}

          {screen === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="flex-1 w-full"
            >
              <Dashboard
                data={documentData}
                filename={fileMeta.name || documentData.name}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle legal disclaimer footer */}
      <Footer resetApp={resetApp} />
    </div>
  );
}
