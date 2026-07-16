import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Sun, Moon, Menu, X, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const navLinks = [
    { label: "Home", id: "home", action: () => navigate("/") },
    { label: "Features", id: "features", action: () => handleNavClick("features") },
    { label: "FAQ", id: "faq", action: () => handleNavClick("faq") }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 w-full ${
        scrolled
          ? "bg-white/70 dark:bg-[#070b19]/70 backdrop-blur-xl shadow-lg shadow-indigo-950/5 dark:shadow-black/20 border-b border-slate-200/50 dark:border-slate-800/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-2.5 bg-gradient-to-tr from-indigo-500/20 to-teal-500/10 dark:from-indigo-500/20 dark:to-teal-500/20 text-indigo-650 dark:text-teal-400 rounded-2xl border border-indigo-200/20 shadow-inner"
            >
              <Scale size={24} />
            </motion.div>
            <span className="font-outfit font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-indigo-100 dark:to-teal-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              LegalLingo
            </span>
          </Link>

          {/* Desktop Navigation with Animated Sliding Hover Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/60 dark:bg-slate-900/30 p-1.5 rounded-2xl border border-slate-200/20 backdrop-blur-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={link.action}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-xl"
              >
                <span className="relative z-10">{link.label}</span>
                {hoveredLink === link.id && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/40 dark:border-slate-700/30 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right (Theme Toggle + Auth Panel) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 text-slate-750 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-900" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Auth Panel */}
            {user ? (
              /* User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-slate-250 dark:border-slate-850 bg-white/40 dark:bg-slate-950/20 text-slate-850 dark:text-slate-200 cursor-pointer shadow-sm hover:bg-slate-100/50 dark:hover:bg-slate-900/30"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full border border-indigo-500/20 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-outfit font-black text-xs flex items-center justify-center border border-white/10 shadow-sm">
                      {initials}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate text-sm font-semibold">
                    {user.fullName.split(" ")[0]}
                  </span>
                </motion.button>

                {/* Dropdown Options List */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="absolute right-0 mt-3 w-52 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 shadow-2xl p-2 flex flex-col gap-1 z-50 text-left bg-white dark:bg-slate-950"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                          Signed in as
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block mt-0.5">
                          {user.email}
                        </span>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-indigo-50 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <LayoutDashboard size={14} className="text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-indigo-50 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <User size={14} className="text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-305 hover:bg-indigo-50 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <Settings size={14} className="text-slate-400" />
                        Settings
                      </Link>
                      <div className="h-[1px] bg-slate-100 dark:bg-slate-900 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer w-full text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Sign In / Sign Up actions */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-650 dark:text-slate-300 hover:text-indigo-650 dark:hover:text-teal-400 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/10 cursor-pointer border border-indigo-500/20"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-slate-950/20 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 bg-white/40 dark:bg-slate-950/20 cursor-pointer"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full bg-white dark:bg-[#070b19] border-b border-slate-200 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-650 transition-all font-semibold"
              >
                Home
              </Link>
              <button
                onClick={() => handleNavClick("features")}
                className="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-655 transition-all font-semibold cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick("faq")}
                className="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-655 transition-all font-semibold cursor-pointer"
              >
                FAQ
              </button>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-2.5">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left py-2 px-3.5 rounded-xl text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-600 font-semibold"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left py-2 px-3.5 rounded-xl text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-600 font-semibold"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-left py-2 px-3.5 rounded-xl text-slate-655 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-indigo-600 font-semibold"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3.5 rounded-xl text-red-505 hover:bg-red-500/5 transition-all font-bold cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-center hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-center shadow-md"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
