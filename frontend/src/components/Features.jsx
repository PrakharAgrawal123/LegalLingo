import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, HelpCircle, FileText, ChevronDown, Award, Lock, ShieldAlert, ArrowUpRight, Upload, Search, MessagesSquare } from "lucide-react";

export default function Features() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: <Eye className="text-teal-650 dark:text-teal-400" size={22} />,
      title: "Legalese Translator",
      desc: "Instantly translate paragraphs of dense, confusing contracts into clear, plain English summaries. No legal degree required.",
      color: "bg-teal-500/10 border-teal-500/10"
    },
    {
      icon: <ShieldCheck className="text-indigo-650 dark:text-indigo-400" size={22} />,
      title: "Automated Risk Scanner",
      desc: "Color-coded tagging filters clauses by hazard level: Red (Unfavorable/Risky), Yellow (Needs Caution), and Green (Standard/Safe).",
      color: "bg-indigo-500/10 border-indigo-500/10"
    },
    {
      icon: <FileText className="text-purple-650 dark:text-purple-400" size={22} />,
      title: "Negotiation Playbook",
      desc: "Get copy-paste counter-offers for high-risk clauses based on standard legal boundaries. Negotiate terms with absolute confidence.",
      color: "bg-purple-500/10 border-purple-500/10"
    }
  ];

  const stats = [
    { value: "120,000+", label: "Contracts Audited", desc: "Leases, NDA, SaaS, Offers" },
    { value: "$4.2M+", label: "Penalties Avoided", desc: "Hidden fee exclusions" },
    { value: "98.4%", label: "Accuracy Rate", desc: "Tested by senior lawyers" },
    { value: "10x", label: "Faster Reviews", desc: "Seconds instead of hours" }
  ];

  const workflowSteps = [
    {
      step: "01",
      icon: <Upload size={20} className="text-indigo-500" />,
      title: "Upload Contract",
      desc: "Upload a PDF/Word file, snap a photo, or paste raw text clauses directly."
    },
    {
      step: "02",
      icon: <Search size={20} className="text-teal-400" />,
      title: "Run Semantic Scan",
      desc: "Our AI scans the document, flag risk levels, and simplifies the jargon."
    },
    {
      step: "03",
      icon: <MessagesSquare size={20} className="text-purple-400" />,
      title: "Negotiate & Close",
      desc: "Use counter-offer playbooks and consult our AI chat helper to lock in better terms."
    }
  ];

  const faqs = [
    {
      q: "How does LegalLingo simplify contracts?",
      a: "LegalLingo uses custom AI semantic processing to break down contracts clause-by-clause. It compares text against standard industry baselines to extract hidden penalties, auto-renewal trap loops, and unfavorable liability caps, explaining them in plain language."
    },
    {
      q: "Which document formats are supported?",
      a: "We support PDF, DOCX (Word), TXT, and Markdown files. You can also upload images (PNG, JPG, JPEG) to extract text via OCR, or directly paste text clauses into our modern editor."
    },
    {
      q: "Is my document data private and secure?",
      a: "Absolutely. Security is our priority. We employ 256-bit TLS encryption, SOC-2 compliant practices, and do not store your documents permanently. Your files are processed securely in memory and never used to train public AI models."
    },
    {
      q: "Can I use the simplified terms in court?",
      a: "No. LegalLingo is an educational simplification tool designed to assist with review. It does not provide formal legal representation, legal advice, or substitute the evaluation of a certified attorney."
    }
  ];

  const handleScrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20 border-t border-slate-200/50 dark:border-slate-800/40 text-left">
      
      {/* 1. Trust Banner / Credibility Section */}
      <div className="mb-24 text-center">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-6">
          🛡️ Trusted by modern professionals, startups, and tenants
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-55 dark:opacity-40">
          <span className="font-outfit font-black text-lg tracking-wider hover:opacity-100 transition-opacity">INITECH</span>
          <span className="font-outfit font-black text-lg tracking-wider hover:opacity-100 transition-opacity">ACME CORP</span>
          <span className="font-outfit font-black text-lg tracking-wider hover:opacity-100 transition-opacity">HOOLI</span>
          <span className="font-outfit font-black text-lg tracking-wider hover:opacity-100 transition-opacity">UMBRELLA</span>
          <span className="font-outfit font-black text-lg tracking-wider hover:opacity-100 transition-opacity">VEHEMENT</span>
        </div>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-450 dark:text-slate-500 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20">
            <Lock size={12} className="text-indigo-500" />
            256-bit TLS Encryption
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20">
            <Award size={12} className="text-teal-400" />
            SOC-2 Compliant Security
          </div>
        </div>
      </div>

      {/* 2. Core Capabilities */}
      <div className="mb-24">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-teal-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/20 px-3.5 py-1.5 rounded-full border border-indigo-200/20 shadow-sm">
            Core Capabilities
          </span>
          <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Everything You Need to Sign Confidently
          </h2>
          <p className="font-inter text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto text-sm leading-relaxed">
            We identify loopholes and verify hidden penalties so you don't get trapped by fine print.
          </p>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className={`p-3 rounded-2xl w-fit border mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-outfit font-black text-lg text-slate-800 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="font-inter text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Workflow Steps (Timeline) */}
      <div className="mb-28">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-600 dark:text-teal-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/20 px-3.5 py-1.5 rounded-full border border-indigo-200/20 shadow-sm">
            How It Works
          </span>
          <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Three Steps to Full Contract Safety
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-indigo-500/20 via-teal-500/25 to-purple-500/20 -z-10" />

          {workflowSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 relative group">
              {/* Step bubble */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#080d21] border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-250 group-hover:scale-105 transition-transform duration-300">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-850 px-1.5 py-0.5 rounded-md text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {step.step}
                </span>
              </div>
              
              <h4 className="font-outfit font-extrabold text-base text-slate-800 dark:text-slate-100">
                {step.title}
              </h4>
              <p className="font-inter text-xs text-slate-500 dark:text-slate-450 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Interactive Statistics */}
      <div className="mb-28 bg-gradient-to-tr from-indigo-650/[0.02] to-teal-500/[0.02] border border-slate-250/60 dark:border-slate-850/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <span className="font-outfit font-black text-3xl sm:text-4xl bg-gradient-to-tr from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-400 bg-clip-text text-transparent block">
                {stat.value}
              </span>
              <span className="font-outfit font-bold text-xs text-slate-850 dark:text-slate-100 block">
                {stat.label}
              </span>
              <span className="font-inter text-[10px] text-slate-400 dark:text-slate-500 block">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Animated Accordion FAQ Section */}
      <div id="faq" className="max-w-4xl mx-auto scroll-mt-20 mb-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-600 dark:text-teal-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/20 px-3.5 py-1.5 rounded-full border border-indigo-200/20 shadow-sm">
            Support
          </span>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="glass rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-slate-100/[0.15]"
                >
                  <span className="font-outfit font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <HelpCircle size={15} className="text-indigo-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 dark:text-slate-500"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="pb-5 pt-1 px-6 pl-11 border-t border-slate-150/40 dark:border-slate-900/40">
                        <p className="font-inter text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Bottom Glassmorphic Call-to-Action (CTA) Banner */}
      <motion.div
        whileHover={{ y: -4 }}
        className="glass rounded-3xl p-8 sm:p-12 border border-indigo-500/15 dark:border-indigo-500/20 shadow-2xl relative overflow-hidden text-center bg-gradient-to-tr from-white to-indigo-500/[0.01] dark:from-[#080d21] dark:to-indigo-950/[0.01]"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <h3 className="font-outfit font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
          Take the Risk Out of Signing
        </h3>
        <p className="font-inter text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto mt-4 leading-relaxed">
          Audit lease terms, check employee non-competes, and scan SaaS licensing clauses automatically in seconds.
        </p>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(99, 102, 241, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleScrollToUpload}
          className="mt-8 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md cursor-pointer border border-indigo-500/25 inline-flex items-center gap-1.5 transition-colors group"
        >
          Audit Your First Contract
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      </motion.div>

    </div>
  );
}
