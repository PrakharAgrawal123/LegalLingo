import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { Scale, Mail, ArrowRight, ArrowLeft, Key } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [resetLink, setResetLink] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/api/auth/forgot-password", { email: data.email });
      setSuccess(true);
      toast.success("Password reset request processed!");
      
      // If server returned the reset link/token (for local testing)
      if (res.data?.reset_link) {
        setResetLink(res.data.reset_link);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to process request.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 -left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md glass rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-2xl relative"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200/10 shadow-sm mb-4">
            <Key size={32} />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter your email and we'll help you configure a new password
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-left">
              <p className="font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                If the email is registered, a password reset request has been logged.
              </p>
              
              {resetLink && (
                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-teal-400 uppercase tracking-widest block mb-2">
                    🛠️ Developer Local Reset Link
                  </span>
                  <a
                    href={resetLink}
                    className="text-xs text-indigo-600 dark:text-teal-400 font-semibold hover:underline break-all"
                  >
                    {resetLink}
                  </a>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 dark:text-red-400 font-semibold pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            <Link
              to="/login"
              className="w-full py-3 text-slate-550 dark:text-slate-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
