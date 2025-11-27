import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token if needed in the future
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
