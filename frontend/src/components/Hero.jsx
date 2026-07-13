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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 -right-20 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-200/50 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-semibold text-xs mb-8 shadow-sm backdrop-blur-sm"
      >
        <Sparkles size={13} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
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
          className="font-outfit font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-slate-900 dark:text-white"
        >
          Unravel Legal Jargon <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-teal-300 bg-clip-text text-transparent">
            Instantly and Safely
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 font-inter text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed"
        >
          Don't sign blind. Upload lease agreements, employment offers, or SaaS agreements. Get a simplified summary, risk flags, and negotiating chips in under 10 seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-600 dark:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/20 border border-indigo-500/20 hover:border-indigo-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 group"
          >
            Start Analyzing
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <motion.a
            href="#demo"
            whileHover={{ scale: 1.03 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-100/80 dark:hover:bg-slate-900/60 transition-colors flex items-center justify-center gap-2"
          >
            See a Demo
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Floating Demo Cards Showcase */}
      <motion.div
        id="demo"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="w-full max-w-5xl mt-20 relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Connection line decorator */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-300/20 dark:border-indigo-400/20 shadow-md backdrop-blur-md">
          <RefreshCw size={22} className="text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
        </div>

        {/* Card 1: Original Legalese */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-72 shadow-xl border border-slate-200/40 dark:border-slate-800/60 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/10">
                Complex Contract Clause
              </span>
              <AlertCircle size={15} className="text-red-500 animate-pulse" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
              Auto-Escalation & Forfeiture
            </h3>
            <p className="font-inter text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic">
              "Upon expiration of the initial lease term, this agreement shall automatically renew ... monthly rent shall automatically increase by 15% of the preceding month's rent ... deposit shall be immediately forfeited to the Landlord as liquidated damages..."
            </p>
          </div>
          <div className="text-xs text-slate-400 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
            Residential Lease Agreement, Page 12
          </div>
        </motion.div>

        {/* Card 2: AI Simplified */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-72 shadow-xl border border-teal-500/20 dark:border-teal-500/10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-teal-500/15 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/10">
                LegalLingo Translation
              </span>
              <ShieldCheck size={15} className="text-teal-500" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              Simplified Explanation
            </h3>
            <div className="space-y-2">
              <p className="font-inter text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                ⚠️ <strong className="text-red-500">Risky:</strong> Rent jumps by 15% automatically each year without warning unless you terminate 90 days in advance.
              </p>
              <p className="font-inter text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                ⚠️ <strong className="text-red-500">Risky:</strong> The landlord keeps your entire security deposit if you vacate early, regardless of reason.
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-3 flex justify-between items-center text-xs">
            <span className="text-teal-600 dark:text-teal-400 font-semibold">Recommended Fix: Limit increase to 4%</span>
            <span className="text-slate-400">Processed in 1.4s</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
