// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Auth/Login';

// 👇 1. Importamos tus nuevos componentes
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  // Usamos el nombre exacto con el prefijo
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* --- RUTA PÚBLICA --- */}
          <Route path="/" element={<Login />} />

          {/* --- RUTAS PROTEGIDAS --- */}
          
          {/* Nivel 1: El guardia verifica que el usuario tenga un token.
              Si lo tiene, lo deja pasar al Dashboard. */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Nivel 2: Ejemplo para el futuro. 
              El guardia verifica el token Y que el rol sea exactamente JEFE_TI. 
              (Puedes descomentar esto cuando crees esa vista más adelante) */}
          {/* <Route element={<ProtectedRoute rolesPermitidos={['JEFE_TI']} />}>
            <Route path="/inventario/editar" element={<VistaEdicionInventario />} />
          </Route> 
          */}

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;