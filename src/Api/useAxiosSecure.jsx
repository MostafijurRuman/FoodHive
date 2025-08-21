import axios from "axios";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Custom Hook for axios with security interceptors
const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Central logout handler with useCallback to prevent unnecessary re-renders
  const handleLogout = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.removeItem("user"); // optional
      await logout(); // logout in client also
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      // Force redirect even if logout API fails
      navigate("/login");
    }
  }, [logout, navigate]);

  // Setup response interceptor for authentication handling
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.response.use(
      (res) => res, // Return successful responses as-is
      async (error) => {
        const originalRequest = error.config;

        // Handle 403 Forbidden - attempt token refresh
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            console.log("Attempting to refresh token...");
            await axios.post("http://localhost:5000/refresh", {}, { withCredentials: true });
            console.log("Token refreshed successfully");
            // Retry the original request
            return axiosSecure(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        // Handle 401 Unauthorized - immediate logout
        if (error.response?.status === 401) {
          console.log("Unauthorized access detected - logging out");
          handleLogout();
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [handleLogout]); // Include handleLogout in dependencies

  return axiosSecure;
};

export default useAxiosSecure;