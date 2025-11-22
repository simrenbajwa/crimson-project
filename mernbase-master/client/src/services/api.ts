// src/api.ts
import axios from "axios";

const API_BASE_URL =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()) ||
  "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important if you ever use cookies/session
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
