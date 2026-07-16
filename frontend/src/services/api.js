import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Refresh on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        // Call refresh token endpoint
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        
        const { access_token } = response.data;
        
        // Save new access token
        localStorage.setItem("accessToken", access_token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        
        // Clear tokens and redirect to login page
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Only redirect if we are not already on a login/register/reset page to prevent loops
        const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
        const currentPath = window.location.pathname;
        const isPublicPath = publicPaths.some(path => currentPath.startsWith(path)) || currentPath === "/";
        
        if (!isPublicPath) {
          window.location.href = "/login?session_expired=true";
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
