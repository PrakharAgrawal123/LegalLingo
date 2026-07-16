import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        console.warn("Failed to fetch user session:", err);
        // Clear corrupt tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/api/auth/login", { email, password });
      const { access_token, refresh_token, user: userData } = res.data;
      
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      setUser(userData);
      toast.success("Welcome back to LegalLingo!");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed. Please check your credentials.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      const res = await API.post("/api/auth/register", {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { access_token, refresh_token, user: userData } = res.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      setUser(userData);
      toast.success("Account created successfully!");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Try again.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const res = await API.post("/api/auth/google", { id_token: idToken });
      const { access_token, refresh_token, user: userData } = res.data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      setUser(userData);
      toast.success("Logged in successfully with Google!");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Google authentication failed.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Best effort backend logout call
      await API.post("/api/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      toast.success("Logged out successfully.");
    }
  };

  const updateProfile = async (fullName) => {
    try {
      const res = await API.put("/api/auth/update-profile", { fullName });
      setUser(res.data);
      toast.success("Profile updated successfully!");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Profile update failed.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await API.put("/api/auth/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to change password.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await API.delete("/api/auth/delete-account");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      toast.success("Your account has been deleted.");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to delete account.";
      toast.error(errorMsg);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
