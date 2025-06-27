import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:8000/api",
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
