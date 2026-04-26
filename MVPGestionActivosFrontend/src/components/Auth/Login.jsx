import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    // 👇 1. Volvemos a incluir el estado para controlar la ventana
    const [showModal, setShowModal] = useState(false); 
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
            const mensajeError = error.response?.data?.error || 'Ocurrió un error al intentar iniciar sesión. Inténtelo de nuevo.';
            setErrorMessage(mensajeError);
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
                        <p style={{ margin: 0 }}>{errorMessage}</p>
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

                {/* 👇 2. Enlace de "Olvidé mi contraseña" subrayado */}
                <div style={{ marginTop: '25px' }}>
                    <span 
                        style={styles.forgotPasswordLink} 
                        onClick={() => setShowModal(true)}
                    >
                        ¿Olvidé mi contraseña?
                    </span>
                </div>
            </div>

            {/* 👇 3. VENTANA EMERGENTE (MODAL) BASADO EN TU CAPTURA */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        {/* Icono de escudo */}
                        <div style={{ fontSize: '45px', marginBottom: '15px' }}>🛡️</div> 
                        
                        <h2 style={{ margin: '0 0 15px 0', color: '#0f172a', fontSize: '22px' }}>
                            Soporte Técnico
                        </h2>
                        
                        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px', padding: '0 10px' }}>
                            Contactar con el administrador para la recuperación de contraseña o habilitación de acceso.
                        </p>
                        
                        <p style={{ fontWeight: '500', color: '#1f2937', fontSize: '15px', marginBottom: '25px' }}>
                            soporteti@udh.edu.pe
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button 
                                style={styles.btnDark} 
                                onClick={() => window.location.href = "mailto:soporteti@udh.edu.pe?subject=Solicitud de Soporte - Sistema TI"}
                            >
                                Contactar Soporte
                            </button>
                            <button 
                                style={styles.btnOutline} 
                                onClick={() => setShowModal(false)}
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ESTILOS ---
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '380px', textAlign: 'center' },
    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { color: '#666', marginBottom: '30px', fontSize: '14px' },
    errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', border: '1px solid #f87171' },
    buttonContainer: { display: 'flex', justifyContent: 'center', marginTop: '10px' },
    
    // Estilo para el texto subrayado
    forgotPasswordLink: { color: '#4b5563', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer', transition: 'color 0.2s' },

    // Estilos del Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '40px 30px', borderRadius: '12px', width: '90%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    
    // Botones del modal
    btnDark: { backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' },
    btnOutline: { backgroundColor: 'white', color: '#0f172a', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' }
};

export default Login;