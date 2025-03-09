import axios from "axios";
import authService from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and check token expiration
axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = authService.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token is expired, try to refresh
          const newToken = await authService.refreshAccessToken();
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          return config;
        }

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Token decode error:", error);
        authService.logout();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await authService.refreshAccessToken();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry the request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
