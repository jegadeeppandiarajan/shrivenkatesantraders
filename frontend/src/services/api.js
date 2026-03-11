import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Store reference to be set from outside
let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("svt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData - browser will set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only trigger logout on 401 if user was actually logged in (had a token)
    // This prevents logout being triggered during failed login attempts
    if (error.response?.status === 401) {
      const hadToken = localStorage.getItem("svt_token");
      if (hadToken) {
        localStorage.removeItem("svt_token");
        // Trigger logout callback if set (clears Redux state)
        if (logoutCallback) {
          logoutCallback();
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;

