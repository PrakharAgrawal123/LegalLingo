import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Sun, Moon, Menu, X, Sparkles } from "lucide-react";

export default function Navbar({ theme, toggleTheme, screen, setScreen, resetApp }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", action: () => { resetApp(); setIsOpen(false); } },
    { name: "Features", action: () => { resetApp(); setIsOpen(false); setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: 'smooth' }), 100); } },
    { name: "FAQ", action: () => { resetApp(); setIsOpen(false); setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: 'smooth' }), 100); } },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-white/80 dark:bg-[#070b19]/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-800/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={resetApp} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 shadow-sm border border-indigo-200/10">
              <Scale size={24} />
            </div>
            <span className="font-outfit font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-600 dark:from-white dark:via-indigo-200 dark:to-teal-300 bg-clip-text text-transparent">
              LegalLingo
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors duration-200 cursor-pointer relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 dark:after:bg-teal-400 after:transition-all after:duration-300"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop Right Panel (Theme Toggle + CTA) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
                >
                  {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* CTA Button */}
            {screen === "landing" ? (
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative overflow-hidden group px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium text-sm transition-all duration-300 shadow-md cursor-pointer border border-indigo-500/20"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles size={15} />
                  Analyze Free
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={resetApp}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 font-medium text-sm transition-all duration-200 shadow-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                New Upload
              </motion.button>
            )}
          </div>

          {/* Mobile Buttons (Theme Toggle + Hamburguer) */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-slate-950/20 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 cursor-pointer"
              aria-label="Open menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full bg-white dark:bg-[#090e1f] border-b border-slate-200 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="w-full text-left py-2 px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-teal-400 font-medium text-base transition-all cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                {screen === "landing" ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-medium text-center shadow-md cursor-pointer"
                  >
                    Analyze Free Contract
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      resetApp();
                    }}
                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium text-center cursor-pointer"
                  >
                    New Upload
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
