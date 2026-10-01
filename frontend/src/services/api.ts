import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('isim_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.accessToken) {
                config.headers['Authorization'] = 'Bearer ' + user.accessToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Automatically log out if token is invalid or expired
            localStorage.removeItem('isim_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
