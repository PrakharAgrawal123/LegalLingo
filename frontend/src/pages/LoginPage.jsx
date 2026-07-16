import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      // AuthContext handles toast alerts
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate(from, { replace: true });
    } catch (err) {
      // AuthContext handles toast alerts
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Glow backgrounds */}
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
            <Scale size={32} />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign in to access your LegalLingo dashboard
          </p>
        </div>

        {/* Login Form */}
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

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-indigo-600 dark:text-teal-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 dark:text-red-400 font-semibold pl-1">
                {errors.password.message}
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
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Google OAuth Login */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login failed")}
            shape="pill"
            theme={document.documentElement.classList.contains("dark") ? "filled_black" : "outline"}
            width="100%"
          />
        </div>

        {/* Toggle Footer */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 dark:text-teal-400 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
