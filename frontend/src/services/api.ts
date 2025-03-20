import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const userApi = axios.create({
  baseURL: `${API_URL}/api/user`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const vendorApi = axios.create({
  baseURL: `${API_URL}/api/vendor`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
