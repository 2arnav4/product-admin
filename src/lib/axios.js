import axios from "axios";
import { getToken, clearToken } from "./auth";


export class ApiError extends Error {
    constructor(message, status, isCanceled = false) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.isCanceled = isCanceled
    }
}

// CreateAXIOS instance
const api = axios.create({
    baseURL: "https://dummyjson.com",
    timeout: 10000,
});

// Request Interceptor 
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(new ApiError("Request was canceled", 0, true));
        }

        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                clearToken();
                redirectToLogin();
            }
            const message = data?.message ?? `Request failed with status ${status}`;
            return Promise.reject(new ApiError(message, status));
        }

        return Promise.reject(
            new ApiError("Network error. Check your connection and retry.", 0)
        );
    }
);

function redirectToLogin() {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
}

export default api;