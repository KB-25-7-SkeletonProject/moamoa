import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

function getCurrentUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.sessionStorage.getItem("moamoa-user");
  if (!rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);
    return typeof user?.id === "string" && user.id ? user.id : null;
  } catch {
    return null;
  }
}

api.interceptors.request.use(config => {
  const userId = getCurrentUserId();

  if (userId) {
    config.headers.Authorization = `Bearer ${userId}`;
  }

  return config;
});

export default api;
