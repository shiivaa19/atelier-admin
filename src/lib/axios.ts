import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { NormalizedApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dummyjson.com";
const API_DELAY = process.env.NEXT_PUBLIC_API_DELAY;

// Centralized Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Request Interceptor
 * Automatically attaches Authorization bearer token if present in cookies.
 * Also appends &delay=... if test delay environment variable is configured.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject auth token from cookie if available
    const token = Cookies.get("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Support simulated API delay testing if env variable is set
    if (API_DELAY && !isNaN(Number(API_DELAY))) {
      config.params = {
        ...config.params,
        delay: Number(API_DELAY),
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Normalizes all error responses into a consistent shape.
 * Handles 401 Unauthorized by clearing session state and redirecting to /login.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // If request was cancelled by AbortController, let caller handle axios.isCancel
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData = error.response?.data;
    
    let message = "An unexpected error occurred. Please try again.";

    if (responseData?.message) {
      message = responseData.message;
    } else if (error.message === "Network Error") {
      message = "Network error. Please check your internet connection.";
    } else if (error.code === "ECONNABORTED") {
      message = "Request timed out. Please try again.";
    }

    // Auto-logout on 401 Unauthorized
    if (status === 401 && typeof window !== "undefined") {
      Cookies.remove("auth_token");
      Cookies.remove("auth_user");
      localStorage.removeItem("auth_user");
      
      // Preserve return URL if not already on login
      if (!window.location.pathname.startsWith("/login")) {
        const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${currentPath}`;
      }
    }

    const normalizedError: NormalizedApiError = {
      message,
      status,
      code: error.code,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;
