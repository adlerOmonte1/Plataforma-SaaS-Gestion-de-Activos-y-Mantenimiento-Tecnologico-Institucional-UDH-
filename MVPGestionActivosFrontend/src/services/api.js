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
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    console.warn("Sesión expirada. Disparando alerta...");
                    
                    window.dispatchEvent(new Event('sessionExpired'));
                    break;

                case 403:

                    alert("Acceso Denegado: Tu rol actual no tiene permisos para esta acción.");
                    break;

                case 500:
                    alert("Error interno del servidor. Por favor, contacta al Jefe de TI.");
                    break;
                    
                default:
                    break;
            }
        } else if (error.request) {

            console.error("El servidor no responde. Verifica tu conexión.");
        }

        return Promise.reject(error);
    }
);
export default api;