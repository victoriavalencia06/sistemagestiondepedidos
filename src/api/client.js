import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("api_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;