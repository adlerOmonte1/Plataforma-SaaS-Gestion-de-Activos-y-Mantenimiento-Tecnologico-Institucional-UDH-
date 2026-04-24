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
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>⏱️</div>
        <h2 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Sesión Expirada</h2>
        <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '20px' }}>
          Por motivos de seguridad, tu sesión ha caducado tras 8 horas de inactividad o el token es inválido. Por favor, vuelve a iniciar sesión.
        </p>
        <button onClick={handleLoginRedirect} style={styles.button}>
          Volver al Login
        </button>
      </div>
    </div>
  );
};

// Estilos muy similares a los que ya usaste en tu otro modal
const styles = {
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo un poco más oscuro
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 // Muy alto para que tape TODO
  },
  modalContent: {
    backgroundColor: 'white', padding: '30px', borderRadius: '8px',
    width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
  },
  button: {
    backgroundColor: '#0369a1', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px'
  }
};

export default SessionExpiredModal;