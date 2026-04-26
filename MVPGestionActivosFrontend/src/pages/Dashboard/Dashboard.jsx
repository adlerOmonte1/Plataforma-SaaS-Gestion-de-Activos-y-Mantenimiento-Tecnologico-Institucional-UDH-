import React, { useState, useEffect } from 'react';

// 👇 IMPORTANTE: Asegúrate de que esta ruta coincida con donde guardaste tu formulario
import FormularioRegistro from '../../components/Admin/FormularioRegistro'; 
import GestionAreas from '../../components/Admin/GestionAreas';



// --- SUB-COMPONENTES ---
const ResumenAdmin = () => <h2>Panel de Administrador (Jefe TI)</h2>;
const SupervisorDashboard = () => <h2>Panel de Supervisor</h2>;
const TecnicoDashboard = () => <h2>Panel de Técnico</h2>;
const SolicitanteDashboard = () => <h2>Panel de Solicitante</h2>;


const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  
  // Nuevo estado para controlar qué opción del menú lateral está activa
  const [vistaActiva, setVistaActiva] = useState('inicio'); 

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

  // =========================================================================
  // 1. VISTA EXCLUSIVA PARA ADMINISTRADOR (Con Menú Lateral)
  // =========================================================================
  if (userRole === 'JEFE_TI') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        
        {/* --- MENÚ LATERAL (SIDEBAR) --- */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Panel Admin</h2>
          <ul style={styles.menuList}>
            <li style={styles.menuItem}>
              <button 
                onClick={() => setVistaActiva('inicio')} 
                style={vistaActiva === 'inicio' ? styles.menuBtnActive : styles.menuBtn}
              >
                Resumen
              </button>
            </li>
            <li style={styles.menuItem}>
              <button 
                onClick={() => setVistaActiva('registrar')} 
                style={vistaActiva === 'registrar' ? styles.menuBtnActive : styles.menuBtn}
              >
                Registrar Personal
              </button>
            </li>
            <li style={styles.menuItem}>
              <button 
                onClick={() => setVistaActiva('areas')} 
                style={vistaActiva === 'areas' ? styles.menuBtnActive : styles.menuBtn}
              >
                Gestión de Áreas
              </button>
            </li>
          </ul>
        </aside>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <main style={{ flex: 1, backgroundColor: '#ffffff' }}>
          
          {/* Header Superior del Admin */}
          <header style={{ ...styles.header, padding: '24px 40px', backgroundColor: '#ffffff', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: '#111827' }}>Sistema de Gestión de Activos TI</h1>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Cerrar Sesión
              </button>
            </div>
          </header>

          {/* Área dinámica donde cambia el contenido según el menú */}
          <div style={{ padding: '40px' }}>
            {vistaActiva === 'inicio' && <ResumenAdmin />}
            {vistaActiva === 'registrar' && <FormularioRegistro />}
            {vistaActiva === 'areas' && <GestionAreas />}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // 2. VISTA PARA LOS DEMÁS ROLES (Mantiene tu diseño original centrado)
  // =========================================================================
  const renderDashboardContent = () => {
    switch (userRole) {
      case 'SUPERVISOR': return <SupervisorDashboard />;
      case 'TECNICO': return <TecnicoDashboard />;
      case 'SOLICITANTE': return <SolicitanteDashboard />;
      default: return <h2>Rol no reconocido o sesión no iniciada</h2>;
    }
  };

  return (
    <div style={styles.container}>
      <header style={{ ...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '600', color: '#111827' }}>Sistema de Gestión de Activos TI</h1>
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>
      
      <main style={styles.content}>
        {renderDashboardContent()}
      </main>
    </div>
  );
};

// --- ESTILOS ---
const styles = {
  // Estilos generales (para todos los roles no-admin)
  container: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
    color: '#1f2937',
  },
  header: {
    borderBottom: '1px solid #e5e7eb', // Borde gris muy suave
    paddingBottom: '20px',
    marginBottom: '30px',
  },
  content: {
    padding: '40px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px', // Bordes más redondeados y amigables
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Sombra muy sutil
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#ee3939',
    color: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },

  // SIDEBAR DEL ADMIN (Diseño minimalista y neutro)
  sidebar: {
    width: '260px',
    backgroundColor: '#f9fafb', // Gris muy claro y profesional
    color: '#1f2937',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e5e7eb', // Separador sutil en vez de sombra fuerte
  },
  sidebarTitle: {
    padding: '30px 24px',
    margin: 0,
    borderBottom: '1px solid #e5e7eb',
    fontSize: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase', // Toque moderno
    letterSpacing: '0.05em'
  },
  menuList: {
    listStyle: 'none',
    padding: '20px 12px', // Espacio para que los botones respiren
    margin: 0
  },
  menuItem: {
    marginBottom: '8px'
  },
  menuBtn: {
    width: '100%',
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: 'transparent',
    color: '#4b5563', // Gris medio
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  menuBtnActive: {
    width: '100%',
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#ffffff', // Botón activo en blanco puro
    color: '#111827', // Texto oscuro para contrastar
    border: '1px solid #e5e7eb', // Borde sutil
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', // Ligera elevación
  }
};

export default Dashboard;