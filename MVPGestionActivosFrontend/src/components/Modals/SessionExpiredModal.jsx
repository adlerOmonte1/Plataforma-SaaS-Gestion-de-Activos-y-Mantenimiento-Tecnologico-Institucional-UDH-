// src/components/Modals/SessionExpiredModal.jsx
import React, { useState, useEffect } from 'react';

const SessionExpiredModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => window.removeEventListener('sessionExpired', handleSessionExpired);
  }, []);

  const handleLoginRedirect = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    
    window.location.replace('/');
  };

  if (!isOpen) return null; 

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        
        {/* Contenedor del ícono del reloj */}
        <div style={styles.iconContainer}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            style={styles.icon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <h2 style={styles.title}>Sesión Expirada</h2>
        
        <p style={styles.text}>
          Por motivos de seguridad, su sesión ha sido cerrada automáticamente debido al límite de tiempo o inactividad.
        </p>

        <button 
          onClick={handleLoginRedirect} 
          style={styles.button}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1f2937'} // Hover effect
          onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
        >
          Ir al inicio de sesión
        </button>

      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(107, 114, 128, 0.65)', // Fondo grisáceo semi-transparente como en la foto
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999
  },
  modalContent: {
    backgroundColor: 'white', 
    padding: '40px 32px', 
    borderRadius: '8px',
    width: '90%', 
    maxWidth: '420px', 
    textAlign: 'center', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Sombreado más suave y moderno
    fontFamily: 'system-ui, -apple-system, sans-serif' // Fuente limpia
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc', // Fondo gris/azulado muy claro
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 24px auto'
  },
  icon: {
    width: '28px',
    height: '28px',
    color: '#111827' // Color oscuro para el ícono
  },
  title: {
    margin: '0 0 16px 0', 
    color: '#111827', // Color oscuro para el título
    fontSize: '22px',
    fontWeight: '600'
  },
  text: {
    color: '#6b7280', // Texto en gris medio
    fontSize: '15px', 
    lineHeight: '1.5',
    margin: '0 auto 32px auto',
    maxWidth: '350px'
  },
  button: {
    backgroundColor: '#111827', // Color azul oscuro casi negro del botón
    color: 'white', 
    border: 'none', 
    padding: '12px 20px',
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: '600', 
    width: '100%', 
    fontSize: '15px',
    transition: 'background-color 0.2s ease'
  }
};

export default SessionExpiredModal;