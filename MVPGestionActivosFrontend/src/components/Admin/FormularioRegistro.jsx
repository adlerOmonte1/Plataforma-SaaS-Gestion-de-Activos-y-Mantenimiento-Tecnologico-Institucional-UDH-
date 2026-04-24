import React, { useState } from 'react';
import api from '../../services/api';

const FormularioRegistro = () => {
    const estadoInicial = {
        email: '',
        nombres: '',
        apellidos: '',
        rol: '', // Vacío por defecto para forzar la selección
        area_asignada: ''
    };

    const [formData, setFormData] = useState(estadoInicial);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Mockup de áreas
    const areasDisponibles = [
        { id: 1, nombre: 'Soporte Técnico' },
        { id: 2, nombre: 'Redes y Telecomunicaciones' },
        { id: 3, nombre: 'Desarrollo de Software' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancelar = () => {
        setFormData(estadoInicial);
        setMensaje({ texto: '', tipo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje({ texto: 'Procesando...', tipo: 'info' });

        try {
            // 👇 NUEVA LÓGICA: Limpiamos los datos antes de enviarlos a Django
            const datosAEnviar = { ...formData };
            
            if (datosAEnviar.rol !== 'SUPERVISOR') {
                datosAEnviar.area_asignada = null; // Borramos el área si no es supervisor
            }

            // Usamos 'datosAEnviar' en lugar de 'formData'
            const response = await api.post('/users/registrar/', datosAEnviar);
            
            setMensaje({ texto: response.data.mensaje || 'Usuario registrado correctamente.', tipo: 'exito' });
            setFormData(estadoInicial);
            
        } catch (error) {
            let errorMsg = "Ocurrió un error al registrar.";
            if (error.response?.data?.email) {
                errorMsg = `Error: ${error.response.data.email[0]}`;
            } else if (error.response?.data?.area_asignada) {
                errorMsg = error.response.data.area_asignada[0];
            }
            
            setMensaje({ texto: errorMsg, tipo: 'error' });
        }
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
            <h2 style={{ marginTop: 0, color: '#1f2937', fontSize: '20px', marginBottom: '20px' }}>
                Registro de Nuevo Usuario
            </h2>
            
            {mensaje.texto && (
                <div style={{ 
                    padding: '12px', marginBottom: '20px', borderRadius: '4px', fontSize: '14px',
                    backgroundColor: mensaje.tipo === 'error' ? '#fef2f2' : (mensaje.tipo === 'info' ? '#e0f2fe' : '#f0fdf4'), 
                    color: mensaje.tipo === 'error' ? '#dc2626' : (mensaje.tipo === 'info' ? '#0369a1' : '#166534'),
                    border: `1px solid ${mensaje.tipo === 'error' ? '#f87171' : (mensaje.tipo === 'info' ? '#7dd3fc' : '#86efac')}`
                }}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Correo Institucional */}
                <div>
                    <label style={labelStyle}>Correo electrónico institucional *</label>
                    <input 
                        type="email" name="email" value={formData.email} onChange={handleChange} 
                        placeholder="usuario@udh.edu.pe" required 
                        style={{...inputStyle, borderColor: mensaje.texto.includes('dominio') || mensaje.texto.includes('registrado') ? '#dc2626' : '#d1d5db'}} 
                    />
                </div>

                {/* 2. Nombres Completos */}
                <div>
                    <label style={labelStyle}>Nombres completos *</label>
                    <input 
                        type="text" name="nombres" value={formData.nombres} onChange={handleChange} 
                        placeholder="Ingrese nombres completos" required style={inputStyle} 
                    />
                </div>

                {/* 3. Apellidos Completos */}
                <div>
                    <label style={labelStyle}>Apellidos completos *</label>
                    <input 
                        type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} 
                        placeholder="Ingrese apellidos completos" required style={inputStyle} 
                    />
                </div>

                {/* 4. Asignación de Rol */}
                <div>
                    <label style={labelStyle}>Asignación de Rol del sistema *</label>
                    <select name="rol" value={formData.rol} onChange={handleChange} required style={inputStyle}>
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="TECNICO">Técnico</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="SOLICITANTE">Usuarios (Solicitante)</option>
                        <option value="JEFE_TI">Administrador (Jefe TI)</option>
                    </select>
                </div>

                {/* 5. Área Asignada (Solo visible para Supervisores) */}
                {formData.rol === 'SUPERVISOR' && (
                    <div>
                        <label style={labelStyle}>Área Asignada *</label>
                        <select name="area_asignada" value={formData.area_asignada} onChange={handleChange} required style={inputStyle}>
                            <option value="" disabled>Seleccione un área</option>
                            {areasDisponibles.map(area => (
                                <option key={area.id} value={area.id}>{area.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 6. Botones de Acción */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" style={btnSubmitStyle}>Registrar Usuario</button>
                    <button type="button" onClick={handleCancelar} style={btnCancelStyle}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

// --- Estilos extraídos para mantener el código limpio ---
const labelStyle = { display: 'block', fontWeight: 'bold', fontSize: '14px', color: '#374151', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

const btnSubmitStyle = { padding: '12px 24px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const btnCancelStyle = { padding: '12px 24px', backgroundColor: 'white', color: '#0f172a', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

export default FormularioRegistro;