import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Trash2, LogOut, ArrowRight, ShieldAlert, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, updateProfile, changePassword, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form hooks
  const profileForm = useForm({ defaultValues: { fullName: user?.fullName } });
  const passwordForm = useForm();

  const onUpdateProfile = async (data) => {
    try {
      await updateProfile(data.fullName);
    } catch (err) {}
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword(data.oldPassword, data.newPassword);
      passwordForm.reset();
    } catch (err) {}
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {}
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="absolute top-20 -left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-10 w-80 h-80 bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="mb-8 text-left">
        <h1 className="font-outfit font-extrabold text-3xl text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="font-inter text-slate-500 dark:text-slate-400 text-sm mt-1">
          Update your profile settings and secure your account.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Settings */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-md text-left">
          <h3 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <User size={18} className="text-indigo-500" />
            Profile Details
          </h3>

          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Your full name"
                  {...profileForm.register("fullName", { required: "Name is required" })}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
                />
              </div>
              {profileForm.formState.errors.fullName && (
                <p className="text-xs text-red-505 pl-1">{profileForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm cursor-pointer transition-colors"
            >
              Save Changes
            </motion.button>
          </form>
        </div>

        {/* Password Settings (Omit if logged in via Google) */}
        {user?.provider === "email" ? (
          <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-md text-left">
            <h3 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Lock size={18} className="text-indigo-500" />
              Update Password
            </h3>

            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
              {/* Old Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Current Password
                </label>
                <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register("oldPassword", { required: "Current password is required" })}
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                  New Password
                </label>
                <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    {...passwordForm.register("newPassword", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Confirm New Password
                </label>
                <div className="relative rounded-2xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-1 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...passwordForm.register("confirmNewPassword", { required: "Confirm password is required" })}
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none border-none text-slate-700 dark:text-slate-200 text-sm font-inter placeholder-slate-400"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm cursor-pointer transition-colors"
              >
                Change Password
              </motion.button>
            </form>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-md text-left bg-indigo-500/5 border-indigo-500/10">
            <h3 className="font-outfit font-extrabold text-lg text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Lock size={18} className="text-indigo-550 dark:text-teal-400" />
              Password Settings Protected
            </h3>
            <p className="font-inter text-sm text-slate-550 dark:text-slate-400">
              You are signed in with **Google OAuth 2.0**. Password credentials are managed by Google.
            </p>
          </div>
        )}

        {/* Security / Dangerous actions */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-md text-left border-red-500/10 dark:border-red-500/10 bg-red-500/5">
          <h3 className="font-outfit font-extrabold text-lg text-red-500 mb-2 flex items-center gap-2">
            <ShieldAlert size={18} />
            Danger Zone
          </h3>
          <p className="font-inter text-sm text-slate-500 dark:text-slate-400 mb-6">
            Deleting your account will delete all profile information and contract audit history from our servers. This action is irreversible.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white/50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-100 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <LogOut size={14} />
              Sign Out
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Trash2 size={14} />
              Delete Account
            </motion.button>
          </div>

          {/* Delete Confirmation Dialog */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-red-200/40 dark:border-red-900/40 space-y-4 overflow-hidden"
              >
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertTriangle className="text-red-550 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <h5 className="font-outfit font-bold text-slate-800 dark:text-white text-sm">
                      Are you absolutely sure?
                    </h5>
                    <p className="font-inter text-xs text-slate-650 dark:text-slate-400 mt-1 leading-relaxed">
                      Confirming this action will immediately delete your record and files.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
