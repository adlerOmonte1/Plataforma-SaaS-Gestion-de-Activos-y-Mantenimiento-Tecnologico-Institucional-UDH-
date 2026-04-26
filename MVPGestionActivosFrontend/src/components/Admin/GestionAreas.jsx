import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const GestionAreas = () => {
    const [areas, setAreas] = useState([]);
    const [vistaActual, setVistaActual] = useState('lista'); 
    const [alerta, setAlerta] = useState({ visible: false, texto: '', tipo: '' });
    
    const formularioVacio = { codigo: '', nombre_area: '', descripcion: '', sede_bloque: 'Sede 1' };
    const [formData, setFormData] = useState(formularioVacio);
    const [idEdicion, setIdEdicion] = useState(null);

    // Cargar áreas al inicio
    useEffect(() => {
        cargarAreas();
    }, []);

    const cargarAreas = async () => {
        try {
            const res = await api.get('/users/areas/');
            setAreas(res.data);
        } catch (error) {
            mostrarAlerta("Error al cargar las áreas", "error");
        }
    };

    const mostrarAlerta = (texto, tipo) => {
        setAlerta({ visible: true, texto, tipo });
        setTimeout(() => setAlerta({ visible: false, texto: '', tipo: '' }), 4000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (vistaActual === 'crear') {
                await api.post('/users/areas/', formData);
                mostrarAlerta("El área ha sido registrada exitosamente.", "exito");
            } else if (vistaActual === 'editar') {
                await api.put(`/users/areas/${idEdicion}/`, formData);
                mostrarAlerta("El área ha sido actualizada exitosamente.", "exito");
            }
            setVistaActual('lista');
            setFormData(formularioVacio);
            cargarAreas();
        } catch (error) {
            mostrarAlerta(error.response?.data?.codigo?.[0] || "Error al guardar el área", "error");
        }
    };

    const abrirEdicion = (area) => {
        setFormData({
            codigo: area.codigo, nombre_area: area.nombre_area, 
            descripcion: area.descripcion || '', sede_bloque: area.sede_bloque
        });
        setIdEdicion(area.id);
        setVistaActual('editar');
    };

    const handleInactivar = async (id) => {
        if(window.confirm("¿Estás seguro de inactivar esta área?")) {
            try {
                const res = await api.delete(`/users/areas/${id}/`);
                mostrarAlerta(res.data.mensaje, "exito");
                cargarAreas();
            } catch (error) {
                mostrarAlerta("Error al inactivar", "error");
            }
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Alerta tipo Toast (Esquina superior derecha) */}
            {alerta.visible && (
                <div style={{...styles.toast, backgroundColor: alerta.tipo === 'error' ? '#fee2e2' : 'white', color: alerta.tipo === 'error' ? '#dc2626' : '#1f2937'}}>
                    <span style={{ fontWeight: 'bold' }}>{alerta.tipo === 'exito' ? 'Éxito' : 'Error'}</span>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#4b5563' }}>{alerta.texto}</p>
                </div>
            )}

            {/* --- VISTA: LISTA DE ÁREAS --- */}
            {vistaActual === 'lista' && (
                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={styles.title}>Gestión de Áreas Institucionales</h2>
                        <button onClick={() => { setVistaActual('crear'); setFormData(formularioVacio); }} style={styles.btnDark}>
                            + Nueva Área
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', textAlign: 'left' }}>
                                <th style={styles.th}>CÓDIGO</th>
                                <th style={styles.th}>NOMBRE DEL ÁREA</th>
                                <th style={styles.th}>SEDE/BLOQUE</th>
                                <th style={styles.th}>ESTADO</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={styles.td}><b>{a.codigo}</b></td>
                                    <td style={styles.td} className="text-gray-600">{a.nombre_area}</td>
                                    <td style={styles.td} className="text-gray-500">{a.sede_bloque}</td>
                                    <td style={styles.td}>
                                        <span style={a.is_active ? styles.badgeActive : styles.badgeInactive}>
                                            {a.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => abrirEdicion(a)} style={styles.actionBtn}>Editar</button>
                                        <button onClick={() => handleInactivar(a.id)} style={{...styles.actionBtn, marginLeft: '10px'}} disabled={!a.is_active}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- VISTA: FORMULARIO CREAR/EDITAR --- */}
            {(vistaActual === 'crear' || vistaActual === 'editar') && (
                <div style={{...styles.card, maxWidth: '600px'}}>
                    <h2 style={styles.title}>
                        {vistaActual === 'crear' ? 'Registro de Nueva Área Institucional' : 'Edición de Área Institucional'}
                    </h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={styles.label}>Nombre del Área *</label>
                            <input type="text" name="nombre_area" value={formData.nombre_area} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Código de Área {vistaActual === 'editar' && '(Solo lectura)'} *</label>
                            <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required disabled={vistaActual === 'editar'} style={{...styles.input, backgroundColor: vistaActual === 'editar' ? '#f3f4f6' : 'white'}} />
                        </div>
                        <div>
                            <label style={styles.label}>Descripción o propósito (opcional)</label>
                            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" style={styles.input} />
                        </div>
                        <div>
                            <label style={styles.label}>Sede o Bloque *</label>
                            <select name="sede_bloque" value={formData.sede_bloque} onChange={handleChange} required style={styles.input}>
                                <option value="Sede 1">Sede 1</option>
                                <option value="Sede 2">Sede 2</option>
                                <option value="Sede 3">Sede 3</option>
                            </select>
                        </div>
                        
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" style={styles.btnDark}>
                                {vistaActual === 'crear' ? 'Guardar Área' : 'Actualizar Área'}
                            </button>
                            <button type="button" onClick={() => setVistaActual('lista')} style={styles.btnCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0' },
    title: { margin: '0 0 20px 0', color: '#111827', fontSize: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#374151', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
    btnDark: { padding: '10px 20px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { padding: '10px 20px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px' },
    th: { padding: '12px 8px', fontWeight: 'bold', fontSize: '12px' },
    td: { padding: '15px 8px', color: '#4b5563' },
    badgeActive: { backgroundColor: '#111827', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    badgeInactive: { backgroundColor: '#e5e7eb', color: '#6b7280', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    actionBtn: { background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' },
    toast: { position: 'absolute', top: '-10px', right: '0', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', zIndex: 1000, width: '250px' }
};

export default GestionAreas;