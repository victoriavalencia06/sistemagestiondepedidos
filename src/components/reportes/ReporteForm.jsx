import React, { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { 
    FaChartBar, 
    FaSave, 
    FaPlus, 
    FaTimes, 
    FaExclamationCircle,
    FaUser,
    FaShoppingCart
} from 'react-icons/fa';
import { alertConfirm } from "../../utils/alerts";
import usuarioService from '../../services/usuarioService';
import pedidoService from '../../services/pedidoService';
import { AuthContext } from '../../context/AuthContext';
import { TIPOS_REPORTE } from '../../constants/reporteConstants';

const ReporteForm = ({ reporte, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            idUsuario: '',
            idPedido: '',
            titulo: '',
            descripcion: '',
            tipo: '',
            estado: true
        }
    });

    const { user } = useContext(AuthContext);
    
    const [usuarios, setUsuarios] = useState([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [loadingPedidos, setLoadingPedidos] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    
    // Prevención de múltiples envíos
    const [isProcessing, setIsProcessing] = useState(false);
    const isSubmittingRef = useRef(false);

    // Cargar usuarios
    useEffect(() => {
        const loadUsuarios = async () => {
            setLoadingUsuarios(true);
            try {
                const data = await usuarioService.get();
                
                if (user?.idRol === 2) { // Cliente
                    const usuarioActual = data.find(u => u.idUsuario === user.idUsuario);
                    setUsuarios(usuarioActual ? [usuarioActual] : []);
                    
                    if (!reporte) {
                        setValue('idUsuario', user.idUsuario);
                    }
                } else {
                    const clientes = data.filter(u => u.estado == 1 && u.idRol == 2);
                    setUsuarios(clientes);
                }
            } catch (error) {
                console.error('Error cargando usuarios:', error);
            } finally {
                setLoadingUsuarios(false);
            }
        };

        loadUsuarios();
    }, [user, reporte, setValue]);

    // Cargar usuario seleccionado
    useEffect(() => {
        const loadSelectedUsuario = async () => {
            if (reporte?.idUsuario) {
                try {
                    const usuarioData = await usuarioService.getById(reporte.idUsuario);
                    setSelectedUsuario(usuarioData);
                } catch (error) {
                    console.error('Error cargando usuario:', error);
                }
            }
        };

        loadSelectedUsuario();
    }, [reporte]);

    // Cargar pedidos cuando se selecciona un usuario
    const selectedUserId = watch('idUsuario');
    
    useEffect(() => {
        const loadPedidosPorUsuario = async () => {
            if (!selectedUserId) {
                setPedidosFiltrados([]);
                return;
            }

            setLoadingPedidos(true);
            try {
                const data = await pedidoService.get();
                const pedidosUsuario = data.filter(p => p.idUsuario == selectedUserId);
                setPedidosFiltrados(pedidosUsuario);
            } catch (error) {
                console.error('Error cargando pedidos:', error);
                setPedidosFiltrados([]);
            } finally {
                setLoadingPedidos(false);
            }
        };

        if (!reporte || (reporte && selectedUserId && selectedUserId !== reporte.idUsuario)) {
            loadPedidosPorUsuario();
        }
    }, [selectedUserId, reporte]);

    // Resetear formulario cuando cambia el reporte
    useEffect(() => {
        if (reporte) {
            reset({
                idUsuario: reporte.idUsuario || '',
                idPedido: reporte.idPedido || '',
                titulo: reporte.titulo || '',
                descripcion: reporte.descripcion || '',
                tipo: reporte.tipo || '',
                estado: reporte.estado ?? true
            });
            
            // Si hay pedido en el reporte, cargarlo
            if (reporte.idPedido && pedidosFiltrados.length === 0) {
                pedidoService.getById(reporte.idPedido)
                    .then(pedido => {
                        setPedidosFiltrados([pedido]);
                    })
                    .catch(console.error);
            }
        }
    }, [reporte, reset]);

    const handleFormSubmit = async (data) => {
        // Prevenir múltiples envíos
        if (isSubmittingRef.current) return;
        
        try {
            setIsProcessing(true);
            isSubmittingRef.current = true;
            
            const payload = {
                idUsuario: Number(data.idUsuario) || 0,
                idPedido: data.idPedido ? Number(data.idPedido) : null,
                titulo: data.titulo.trim(),
                descripcion: data.descripcion?.trim() || null,
                tipo: data.tipo || null,
                estado: data.estado
            };

            // Si es creación, no enviamos estado (el backend lo maneja)
            if (!reporte) {
                delete payload.estado;
            }

            await onSubmit(payload);
        } finally {
            setIsProcessing(false);
            isSubmittingRef.current = false;
        }
    };

    const handleCancel = async () => {
        if (watch('titulo') || watch('descripcion') || watch('tipo')) {
            const result = await alertConfirm(
                "¿Salir sin guardar?",
                "Los cambios no guardados se perderán."
            );
            if (!result.isConfirmed) return;
        }

        onCancel();
    };

    const isUserReadOnly = user?.idRol === 2 && !reporte;
    const isFormSubmitting = isSubmitting || isProcessing;

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaChartBar style={{ marginRight: 8 }} />
                    {reporte ? 'Editar Reporte' : 'Crear Nuevo Reporte'}
                </h2>
                <p className="management-form-subtitle">
                    {reporte
                        ? 'Actualiza la información del reporte existente'
                        : 'Completa la información para crear un nuevo reporte'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="management-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="idUsuario" className="form-label required">
                            <FaUser style={{ marginRight: 6 }} />
                            Usuario
                        </label>
                        {reporte ? (
                            <>
                                <input type="hidden" {...register('idUsuario')} />
                                
                                <div className="usuario-display" style={{
                                    padding: '10px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9',
                                    color: '#333',
                                    minHeight: '42px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    {selectedUsuario ? (
                                        <>
                                            {selectedUsuario.nombre}
                                            {selectedUsuario.email && ` (${selectedUsuario.email})`}
                                        </>
                                    ) : (
                                        `Cargando usuario ID: ${reporte.idUsuario}...`
                                    )}
                                </div>
                            </>
                        ) : (
                            <select
                                id="idUsuario"
                                className={`form-control ${errors.idUsuario ? 'error' : ''}`}
                                disabled={isFormSubmitting || loadingUsuarios || isUserReadOnly}
                                {...register('idUsuario', {
                                    required: 'El usuario es requerido'
                                })}
                            >
                                <option value="">Seleccionar usuario...</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                        {usuario.nombre} {usuario.email ? ` (${usuario.email})` : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.idUsuario && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idUsuario.message}
                            </div>
                        )}
                        {isUserReadOnly && (
                            <small className="form-hint">
                                Usted es el usuario asignado a este reporte
                            </small>
                        )}
                        {reporte && (
                            <small className="form-hint">
                                Nota: El usuario no se puede modificar en la edición
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="idPedido" className="form-label">
                            <FaShoppingCart style={{ marginRight: 6 }} />
                            Pedido Asociado
                        </label>
                        <select
                            id="idPedido"
                            className={`form-control ${errors.idPedido ? 'error' : ''}`}
                            disabled={isFormSubmitting || loadingPedidos || !selectedUserId}
                            {...register('idPedido')}
                        >
                            <option value="">Seleccionar pedido (opcional)...</option>
                            {pedidosFiltrados.map((pedido) => (
                                <option key={pedido.idPedido} value={pedido.idPedido}>
                                    Pedido #{pedido.idPedido} 
                                    {pedido.fecha ? ` - ${new Date(pedido.fecha).toLocaleDateString()}` : ''}
                                    {pedido.total ? ` - S/ ${pedido.total.toFixed(2)}` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.idPedido && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idPedido.message}
                            </div>
                        )}
                        <small className="form-hint">
                            {selectedUserId 
                                ? `Mostrando pedidos del usuario seleccionado (${pedidosFiltrados.length} encontrados)`
                                : 'Seleccione un usuario primero para ver sus pedidos'
                            }
                        </small>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="titulo" className="form-label required">
                        Título del Reporte
                    </label>
                    <input
                        type="text"
                        id="titulo"
                        className={`form-control ${errors.titulo ? 'error' : ''}`}
                        placeholder="Ej: Reporte de ventas, Queja por servicio, Problema técnico..."
                        disabled={isFormSubmitting}
                        {...register('titulo', {
                            required: 'El título es requerido',
                            minLength: {
                                value: 3,
                                message: 'El título debe tener al menos 3 caracteres'
                            },
                            maxLength: {
                                value: 150,
                                message: 'El título no puede exceder 150 caracteres'
                            }
                        })}
                    />
                    {errors.titulo && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.titulo.message}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        className={`form-control ${errors.descripcion ? 'error' : ''}`}
                        placeholder="Describe los detalles, hallazgos, quejas, sugerencias o información relevante..."
                        rows={5}
                        disabled={isFormSubmitting}
                        {...register('descripcion', {
                            maxLength: {
                                value: 2000,
                                message: 'La descripción no puede exceder 2000 caracteres'
                            }
                        })}
                    />
                    {errors.descripcion && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.descripcion.message}
                        </div>
                    )}
                    <small className="form-hint">Opcional - Máximo 2000 caracteres</small>
                </div>

                <div className="form-group">
                    <label htmlFor="tipo" className="form-label">
                        Tipo de Reporte
                    </label>
                    <select
                        id="tipo"
                        className={`form-control ${errors.tipo ? 'error' : ''}`}
                        disabled={isFormSubmitting}
                        {...register('tipo')}
                    >
                        <option value="">Seleccionar tipo (opcional)...</option>
                        {TIPOS_REPORTE.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                    {errors.tipo && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.tipo.message}
                        </div>
                    )}
                    <small className="form-hint">
                        Seleccione el tipo de reporte. Opcional.
                    </small>
                </div>

                {reporte && (
                    <div className="form-group">
                        <label className="form-label">Estado del Reporte</label>
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="estado"
                                    disabled={isFormSubmitting}
                                    {...register('estado')}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="switch-label">
                                {watch('estado') ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                        <small className="form-hint">
                            Un reporte inactivo no estará disponible para consulta
                        </small>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-management btn-management-secondary"
                        disabled={isFormSubmitting}
                    >
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn-management"
                        disabled={isFormSubmitting}
                    >
                        {isFormSubmitting ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16 }} />
                                {reporte ? 'Actualizando...' : 'Creando...'}
                            </>
                        ) : reporte ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Reporte
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReporteForm;