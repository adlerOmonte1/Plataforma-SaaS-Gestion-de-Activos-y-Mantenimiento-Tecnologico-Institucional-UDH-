import React, { useState, useEffect } from 'react';

// --- SUB-COMPONENTES ---
const AdminDashboard = () => <h2>Panel de Administrador (Jefe TI)</h2>;
const SupervisorDashboard = () => <h2>Panel de Supervisor</h2>;
const TecnicoDashboard = () => <h2>Panel de Técnico</h2>;
const SolicitanteDashboard = () => <h2>Panel de Solicitante</h2>;


const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.clear(); 
    sessionStorage.clear();

    window.location.replace('/');
    
  };

  // 2. Evaluamos qué pantalla mostrar
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'JEFE_TI':
        return <AdminDashboard />;
      case 'SUPERVISOR':
        return <SupervisorDashboard />;
      case 'TECNICO':
        return <TecnicoDashboard />;
      case 'SOLICITANTE':
        return <SolicitanteDashboard />;
      default:
        return <h2>Rol no reconocido o sesión no iniciada</h2>;
    }
  };

  return (
    <div style={styles.container}>
      {/* Añadimos flexbox al header para poner el botón a la derecha sin romper tu estilo */}
      <header style={{ ...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Sistema de Gestión de Activos TI</h1>
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>
      
      {/* 3. Dibujamos el contenido según el rol */}
      <main style={styles.content}>
        {renderDashboardContent()}
      </main>
    </div>
  );
};

// --- ESTILOS ---
const styles = {
  container: {
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
    color: '#333333',
  },
  header: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px',
    marginBottom: '30px',
  },
  content: {
    padding: '30px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  // 👈 Estilo simple para el botón (rojo institucional suave)
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  }
};

export default Dashboard;