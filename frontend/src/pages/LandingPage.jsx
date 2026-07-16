import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import UploadZone from "../components/UploadZone";
import Features from "../components/Features";
import toast from "react-hot-toast";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUploadStart = (filename, templateKey, inputType = "document", fileOrTextContent = null) => {
    if (!user) {
      toast.error("Please sign in to analyze your contracts.");
      navigate("/login");
      return;
    }

    // Set pending analysis in localStorage to transfer details to the protected Dashboard page
    const pendingData = {
      filename,
      templateKey,
      inputType,
    };
    
    // For files, we will read the text/mock key or store content
    if (inputType === "text") {
      pendingData.text = fileOrTextContent;
    } else if (fileOrTextContent) {
      // Store reference or create mock details since we can't save binary files directly in localStorage
      pendingData.fileDetails = {
        name: fileOrTextContent.name,
        size: fileOrTextContent.size,
        type: fileOrTextContent.type,
      };
    }

    localStorage.setItem("pendingAnalysis", JSON.stringify(pendingData));
    
    // Navigate to dashboard where processing and analysis happens
    navigate("/dashboard");
  };

  const onGetStarted = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full animate-fade-in"
    >
      <Hero onGetStarted={onGetStarted} />
      <UploadZone onUploadStart={handleUploadStart} />
      <Features />
    </motion.div>
  );
}

// Wrapper to export with motion
import { motion } from "framer-motion";
