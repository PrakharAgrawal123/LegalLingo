import React from "react";
import { Link } from "react-router-dom";
import { Scale, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed to LegalLingo newsletter!");
    e.target.reset();
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto w-full relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          
          {/* Column 1: App Info & Newsletter (5 columns span) */}
          <div className="md:col-span-5 space-y-6 text-left">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:rotate-6 transition-transform duration-300">
                <Scale size={18} />
              </div>
              <span className="font-outfit font-extrabold text-lg tracking-tight text-slate-850 dark:text-slate-100">
                LegalLingo
              </span>
            </Link>
            
            <p className="font-inter text-slate-500 dark:text-slate-450 text-xs leading-relaxed max-w-sm">
              Simplifying legal complexity. We leverage intelligent semantic scans to identify risky clauses, generate explanations, and deliver negotiation playbooks.
            </p>

            {/* Newsletter form */}
            <div className="space-y-2.5 max-w-sm">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Stay updated on legal AI
              </span>
              <form onSubmit={handleSubscribe} className="relative flex items-center p-1 rounded-2xl border border-slate-250 dark:border-slate-800/80 bg-white dark:bg-slate-950/50 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
                <Mail size={14} className="absolute left-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full pl-9 pr-24 py-2 bg-transparent border-none outline-none text-xs font-inter text-slate-700 dark:text-slate-200 placeholder-slate-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] tracking-wide transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Join
                  <Send size={10} />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Product (2 columns) */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Product
            </h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-550 dark:text-slate-400">
              <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Capabilities</a></li>
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Start Analysis</Link></li>
              <li><a href="#demo" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Interactive Demo</a></li>
              <li><span className="text-slate-350 dark:text-slate-600 flex items-center gap-1.5">Security <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400/90 px-1 rounded">SOC2</span></span></li>
            </ul>
          </div>

          {/* Column 3: Resources (2 columns) */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Resources
            </h5>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-550 dark:text-slate-400">
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">FAQ</a></li>
              <li><a href="#docs" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Documentation</a></li>
              <li><a href="#guides" className="hover:text-indigo-600 dark:hover:text-teal-400 transition-colors">Legal Playbooks</a></li>
              <li><span className="text-slate-350 dark:text-slate-600">Privacy Shield</span></li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials (3 columns) */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Connect
            </h5>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-semibold">
              Questions? Reach out to support at <br />
              <a href="mailto:support@legallingo.com" className="text-indigo-650 dark:text-teal-400 hover:underline">
                support@legallingo.com
              </a>
            </p>
            {/* Social Icons (using inline SVGs for compatibility) */}
            <div className="flex gap-2 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/60 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450 hover:text-indigo-600 dark:hover:text-teal-400 transition-all shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/60 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450 hover:text-indigo-600 dark:hover:text-teal-400 transition-all shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/60 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450 hover:text-indigo-600 dark:hover:text-teal-400 transition-all shadow-sm"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Tag Banner */}
        <div className="w-full bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 sm:p-5 mb-8 text-left">
          <p className="font-inter text-[11px] sm:text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed font-semibold">
            ⚖️ Disclaimer: LegalLingo is an AI-generated analysis tool designed to simplify legalese. This summary is NOT formal legal advice, a substitute for legal representation, or a replacement for an attorney. Please consult a qualified lawyer before signing any contract.
          </p>
        </div>

        {/* Bottom copy */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-6 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-inter">
          <p>&copy; {new Date().getFullYear()} LegalLingo Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 font-bold text-slate-400 dark:text-slate-500">
            <a href="#privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-indigo-500 transition-colors">Terms of Use</a>
            <a href="#cookies" className="hover:text-indigo-500 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
