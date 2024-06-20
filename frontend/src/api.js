import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const apiUrl = "https://d47dbdb5-e357-4c58-a469-8d17bcc06416-dev.e1-eu-north-azure.choreoapis.dev/pythonnotesapp/backend/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;