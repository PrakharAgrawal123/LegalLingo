import React from "react";
import { Scale } from "lucide-react";

export default function Footer({ resetApp }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20 py-12 px-4 sm:px-6 lg:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Logo */}
        <div 
          onClick={resetApp} 
          className="flex items-center gap-2 cursor-pointer group mb-6"
        >
          <div className="p-1.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:rotate-6 transition-all duration-300">
            <Scale size={18} />
          </div>
          <span className="font-outfit font-bold text-sm tracking-tight text-slate-800 dark:text-slate-200">
            LegalLingo
          </span>
        </div>

        {/* Legal Disclaimer Tag */}
        <div className="max-w-2xl text-center bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 sm:p-5 mb-8">
          <p className="font-inter text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed font-semibold">
            ⚖️ Disclaimer: LegalLingo is an AI-generated analysis tool designed to simplify legalese. This summary is NOT formal legal advice, a substitute for legal representation, or a replacement for an attorney. Please consult a qualified lawyer before signing any contract.
          </p>
        </div>

        {/* Bottom links and copy */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-6 text-xs text-slate-400 font-inter">
          <p>&copy; {new Date().getFullYear()} LegalLingo Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#privacy" className="hover:text-indigo-500 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-indigo-500 transition-colors">Terms of Use</a>
            <a href="#contact" className="hover:text-indigo-500 transition-colors">Contact Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
