// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            // El token JWT que devuelve Google
            const googleToken = credentialResponse.credential;

            /* * OPCIONAL: Validación rápida en Frontend por UX.
             * La validación real y estricta ocurre en tu backend Django.
             */
            const decodedGoogleToken = jwtDecode(googleToken);
            if (!decodedGoogleToken.email.endsWith('@udh.edu.pe')) {
                setErrorMessage('Acceso Denegado. Solo se permiten correos institucionales (@udh.edu.pe).');
                return;
            }

            // Petición a tu backend (Django REST Framework - users_service)
            // Ajusta la URL a tu endpoint real
            const response = await axios.post('http://localhost:8000/api/users/auth/google/', {
                token: googleToken
            });

            // Si el backend valida que el usuario existe y es del dominio, devuelve tu propio JWT
            const { access, refresh, role } = response.data;

            // Almacenamos el JWT y el rol (las reglas indican expiración de 8 horas, 
            // el backend debe configurar el tiempo de vida del token)
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userRole', role);

            // Redirección exitosa
            navigate('/dashboard'); // O la ruta principal según el rol

        } catch (error) {
            // Manejo del "Acceso Denegado" (2º Regla de Negocio)
            if (error.response && error.response.status === 403) {
                setErrorMessage('Acceso Denegado. Su cuenta no ha sido registrada por el Administrador.');
            } else {
                setErrorMessage('Ocurrió un error al intentar iniciar sesión. Contacte a soporte.');
            }
        }
    };

    const handleError = () => {
        setErrorMessage('Fallo en la autenticación con Google.');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Gestión de Activos TI</h2>
                <p style={styles.subtitle}>Acceso exclusivo para personal autorizado</p>
                
                {errorMessage && (
                    <div style={styles.errorBox}>
                        {errorMessage}
                    </div>
                )}

                <div style={styles.buttonContainer}>
                    {/* Botón oficial de Google - Cumple la regla de no tener registro manual */}
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false} // Desactivado para forzar la selección de cuenta
                        text="signin_with"
                        shape="rectangular"
                        theme="outline"
                    />
                </div>
            </div>
        </div>
    );
};

// Estilos básicos (puedes reemplazarlos por Tailwind CSS o CSS Modules)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f6',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginBottom: '30px',
        fontSize: '14px',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid #f87171',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    }
};

export default Login;