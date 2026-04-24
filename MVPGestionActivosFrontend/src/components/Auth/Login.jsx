// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // 👈 Nuevo estado para controlar la ventana emergente
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            const decodedGoogleToken = jwtDecode(googleToken);
            
            if (!decodedGoogleToken.email.endsWith('@udh.edu.pe')) {
                setErrorMessage('Acceso Denegado. Solo se permiten correos institucionales (@udh.edu.pe).');
                return;
            }

            const response = await axios.post('http://localhost:8000/api/users/auth/google/', {
                token: googleToken
            });

            const { access, refresh, role } = response.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userRole', role);

            navigate('/dashboard');

        } catch (error) {
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
                
                {/* --- CAJA DE ERROR MODIFICADA --- */}
                {errorMessage && (
                    <div style={styles.errorBox}>
                        <p style={{ margin: '0 0 10px 0' }}>{errorMessage}</p>
                        
                        {/* Si el error contiene la palabra "registrada", mostramos el botón de soporte */}
                        {errorMessage.includes('registrada') && (
                            <button 
                                style={styles.supportButton} 
                                onClick={() => setShowModal(true)}
                            >
                                Contactar Soporte
                            </button>
                        )}
                    </div>
                )}

                <div style={styles.buttonContainer}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false}
                        text="signin_with"
                        shape="rectangular"
                        theme="outline"
                    />
                </div>
            </div>

            {/* --- VENTANA EMERGENTE (MODAL) --- */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {/* Ilustración de seguridad (Emoji grande) */}
                        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🛡️</div> 
                        
                        <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Soporte Técnico</h3>
                        <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '10px' }}>
                            Por favor, póngase en contacto al siguiente email para solicitar el registro de su cuenta o el cambio de contraseña:
                        </p>
                        
                        {/* El correo destacado */}
                        <p style={{ fontWeight: 'bold', color: '#0369a1', fontSize: '16px', marginBottom: '20px', backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '5px' }}>
                            soporteti@gmail.com
                        </p>
                        
                        <button 
                            style={styles.closeButton} 
                            onClick={() => setShowModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ACTUALIZADOS ---
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { color: '#666', marginBottom: '30px', fontSize: '14px' },
    
    // Caja de error
    errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #f87171' },
    
    // Botón de contactar soporte
    supportButton: { backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginTop: '5px', transition: 'background-color 0.3s' },
    
    buttonContainer: { display: 'flex', justifyContent: 'center', marginTop: '10px' },

    // --- ESTILOS PARA EL MODAL ---
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white', padding: '30px', borderRadius: '8px', 
        width: '90%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)'
    },
    closeButton: {
        backgroundColor: '#4b5563', color: 'white', border: 'none', padding: '8px 20px', 
        borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%'
    }
};

export default Login;