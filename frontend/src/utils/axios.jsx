import axios from "axios";

const url =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://wittywander-backend.onrender.com/api";

const API = axios.create({
  baseURL: url,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = "application/json";
    config.headers["Cache-Control"] = "no-cache";
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
