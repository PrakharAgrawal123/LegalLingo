import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, HelpCircle, FileText, ChevronDown } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Eye className="text-teal-600 dark:text-teal-400" size={24} />,
      title: "Legalese Translator",
      desc: "Instantly translate paragraphs of dense, confusing contracts into clear, plain English summaries. No legal degree required.",
      color: "bg-teal-500/10 border-teal-500/10"
    },
    {
      icon: <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />,
      title: "Automated Risk Scanner",
      desc: "Color-coded tagging filters clauses by hazard level: Red (Unfavorable/Risky), Yellow (Needs Caution), and Green (Standard/Safe).",
      color: "bg-indigo-500/10 border-indigo-500/10 animate-pulse-slow"
    },
    {
      icon: <FileText className="text-purple-600 dark:text-purple-400" size={24} />,
      title: "Negotiation Playbook",
      desc: "Get copy-paste counter-offers for high-risk clauses based on standard legal boundaries. Negotiate terms with absolute confidence.",
      color: "bg-purple-500/10 border-purple-500/10"
    }
  ];

  const faqs = [
    {
      q: "How does LegalLingo simplify contracts?",
      a: "LegalLingo uses semantic processing to break down contracts clause-by-clause, comparing them against standardized rules. It parses legal jargon and identifies anomalies, generating a clean summary."
    },
    {
      q: "Which document formats are supported?",
      a: "We support PDF, DOCX, TXT, and Markdown files. Simply drag your file into the analyzer zone to initiate the scan."
    },
    {
      q: "Is my document data private?",
      a: "Yes. All file scanning is simulated client-side or handled with strict end-to-end encryption. Your documents are never saved, shared, or utilized to train AI models."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <div id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20 border-t border-slate-200/50 dark:border-slate-800/40">
      
      {/* Features Header */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold text-indigo-600 dark:text-teal-400 uppercase tracking-widest bg-indigo-50 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-indigo-150 dark:border-slate-850">
          Core Capabilities
        </span>
        <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
          Everything You Need to Sign Confidently
        </h2>
        <p className="font-inter text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
          We identify loopholes and verify hidden penalties so you don't get trapped by fine print.
        </p>
      </div>

      {/* Grid Features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.05)" }}
            className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className={`p-3 rounded-2xl w-fit border mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="font-inter text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <div id="faq" className="max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-2">
            Quick answers to help you understand LegalLingo.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm"
            >
              <h4 className="font-outfit font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle size={16} className="text-indigo-500 flex-shrink-0" />
                {faq.q}
              </h4>
              <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed pl-6">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
