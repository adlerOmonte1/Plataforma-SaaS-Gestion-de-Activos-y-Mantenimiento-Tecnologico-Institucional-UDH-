// src/services/api.js
import axios from 'axios';

// Instancia base de Axios
const api = axios.create({
    // Usamos process.env para Create React App. 
    // Si la variable no existe, usa localhost por defecto.
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para inyectar el token JWT en cada petición
api.interceptors.request.use(
    (config) => {
        // Obtenemos el token que guardamos durante el Login
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // Si hay token, lo enviamos en las cabeceras bajo el estándar Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;