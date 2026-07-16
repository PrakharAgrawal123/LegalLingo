import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function Hero({ onGetStarted }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 16 }
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center w-full">
      {/* SaaS mesh grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-indigo-500/5 dark:bg-indigo-650/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-20 -right-20 w-[450px] h-[450px] bg-teal-400/5 dark:bg-teal-550/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200/40 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-750 dark:text-indigo-300 font-bold text-[10px] uppercase tracking-widest mb-8 shadow-sm backdrop-blur-sm"
      >
        <Sparkles size={11} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
        AI-Powered Contract Clarity
      </motion.div>

      {/* Hero content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl flex flex-col items-center"
      >
        <motion.h1
          variants={itemVariants}
          className="font-outfit font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08] text-slate-900 dark:text-white"
        >
          Unravel Legal Jargon <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-teal-300 bg-clip-text text-transparent">
            Instantly & Confidently
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 font-inter text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          Don't sign blind. Upload lease agreements, employment offers, or SaaS contracts. Get a simplified summary, risk flags, and negotiating chips in under 10 seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 border border-indigo-500/20 hover:border-indigo-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 group"
          >
            Start Analyzing
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <motion.a
            href="#demo"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-350 font-semibold text-sm hover:bg-slate-100/80 dark:hover:bg-slate-900/60 transition-colors flex items-center justify-center gap-2"
          >
            See a Demo
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Floating Demo Cards Showcase */}
      <motion.div
        id="demo"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="w-full max-w-5xl mt-24 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Connection line decorator */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
          <RefreshCw size={20} className="text-indigo-600 dark:text-teal-400 animate-spin-slow" />
        </div>

        {/* Card 1: Original Legalese with red highlight glow */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-76 shadow-xl border border-red-500/10 dark:border-red-500/15 overflow-hidden text-left bg-gradient-to-br from-white to-red-500/[0.01] dark:from-[#080d21] dark:to-red-950/[0.01]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10">
                Complex Contract Clause
              </span>
              <AlertCircle size={14} className="text-red-550 animate-pulse" />
            </div>
            <h3 className="font-outfit font-black text-lg text-slate-800 dark:text-slate-100 mb-2">
              Auto-Escalation & Forfeiture
            </h3>
            <p className="font-inter text-slate-500 dark:text-slate-400 text-xs leading-relaxed italic">
              "Upon expiration of the initial lease term, this agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 90 days prior ... rent shall automatically increase by 15% ... deposit shall be immediately forfeited to the Landlord as liquidated damages..."
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
            📄 Residential Lease Agreement, Page 12
          </div>
        </motion.div>

        {/* Card 2: AI Simplified with green/teal highlight glow */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-76 shadow-xl border border-teal-500/25 dark:border-teal-500/20 overflow-hidden text-left bg-gradient-to-br from-white to-teal-500/[0.01] dark:from-[#080d21] dark:to-teal-950/[0.01]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-teal-550/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-550/15">
                LegalLingo Translation
              </span>
              <ShieldCheck size={14} className="text-teal-500" />
            </div>
            <h3 className="font-outfit font-black text-lg text-slate-800 dark:text-slate-100 mb-2">
              Simplified Explanation
            </h3>
            <div className="space-y-3">
              <p className="font-inter text-slate-650 dark:text-slate-300 text-xs leading-relaxed">
                ⚠️ <strong className="text-red-500 font-bold">Risky:</strong> Rent jumps by **15% automatically** each year without warning unless you terminate 90 days in advance.
              </p>
              <p className="font-inter text-slate-650 dark:text-slate-300 text-xs leading-relaxed">
                ⚠️ <strong className="text-red-500 font-bold">Risky:</strong> The landlord keeps your **entire security deposit** if you vacate early, regardless of reason.
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-teal-650 dark:text-teal-400">💡 Recommended Fix: Limit increase to 4%</span>
            <span className="text-slate-400 font-normal">Processed in 1.4s</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
