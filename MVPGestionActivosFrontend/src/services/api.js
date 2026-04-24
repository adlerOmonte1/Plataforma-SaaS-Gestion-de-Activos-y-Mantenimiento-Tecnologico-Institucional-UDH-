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
        // Todo salió bien (Código 200), dejamos pasar la respuesta intacta
        return response;
    },
    (error) => {
        // Verificamos si el error proviene de una respuesta del servidor
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 401:
                    // REGLA: Token expirado o inválido
                    console.warn("Sesión expirada. Disparando alerta...");
                    
                    // Disparamos un evento global que React podrá escuchar
                    window.dispatchEvent(new Event('sessionExpired'));
                    break;

                case 403:
                    // REGLA: Token válido, pero el Rol no permite esta acción
                    // (Ej. Un 'Solicitante' intentando borrar un ticket)
                    alert("Acceso Denegado: Tu rol actual no tiene permisos para esta acción.");
                    break;

                case 500:
                    // REGLA: El backend explotó por algún error de código o base de datos
                    alert("Error interno del servidor. Por favor, contacta al Jefe de TI.");
                    break;
                    
                default:
                    break;
            }
        } else if (error.request) {
            // El servidor de Django está apagado o no hay internet
            console.error("El servidor no responde. Verifica tu conexión.");
        }

        // Devolvemos el rechazo para que el componente (si quiere) maneje su propio catch()
        return Promise.reject(error);
    }
);
export default api;