import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaSave, FaPlus, FaTimes, FaExclamationCircle, FaEnvelope, FaUserTag, FaLock } from 'react-icons/fa';
import { alertConfirm } from "../../utils/alerts";
import rolService from '../../services/rolService';

const UsuarioForm = ({ usuario, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            nombre: '',
            email: '',
            password: '',
            idRol: '',
            estado: true
        }
    });

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [showPassword, setShowPassword] = useState(!usuario); // Mostrar password solo en creación

    // Cargar roles activos
    useEffect(() => {
        const loadRoles = async () => {
            setLoadingRoles(true);
            try {
                const data = await rolService.get();
                // Filtrar solo roles activos
                const rolesActivos = Array.isArray(data)
                    ? data.filter(rol => rol.estado == 1 || rol.estado === true)
                    : [];
                setRoles(rolesActivos);
            } catch (error) {
                console.error('Error cargando roles:', error);
                // Roles por defecto en caso de error
                setRoles([
                    { idRol: 1, nombre: "Administrador", estado: true },
                    { idRol: 2, nombre: "Cliente", estado: true },
                    { idRol: 3, nombre: "Empleado", estado: true }
                ]);
            } finally {
                setLoadingRoles(false);
            }
        };

        loadRoles();
    }, []);

    // Resetear formulario cuando cambia el usuario
    useEffect(() => {
        if (usuario) {
            reset({
                nombre: usuario.nombre || '',
                email: usuario.email || '',
                password: '', // Password vacío en edición
                idRol: usuario.idRol || usuario.rol?.idRol || '',
                estado: usuario.estado ?? true
            });
            setShowPassword(false); // Ocultar password en edición
        } else {
            reset({
                nombre: '',
                email: '',
                password: '',
                idRol: '',
                estado: true
            });
            setShowPassword(true); // Mostrar password en creación
        }
    }, [usuario, reset]);

    const handleFormSubmit = async (data) => {
        const payload = {
            nombre: data.nombre.trim(),
            email: data.email.trim(),
            idRol: parseInt(data.idRol),
            estado: data.estado
        };

        // Solo incluir password si se está creando o si se modificó
        if (data.password && data.password.trim() !== '') {
            payload.password = data.password.trim();
        }

        await onSubmit(payload);
    };

    const handleCancel = async () => {
        if (usuario?.nombre) {
            const result = await alertConfirm(
                "¿Salir sin guardar?",
                "Los cambios no guardados se perderán."
            );
            if (!result.isConfirmed) return;
        }

        onCancel();
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaUser style={{ marginRight: 8 }} />
                    {usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h2>
                <p className="management-form-subtitle">
                    {usuario
                        ? 'Actualiza la información del usuario existente'
                        : 'Completa la información para crear un nuevo usuario'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="management-form">
                {/* Siempre mostrar nombre y email en dos columnas */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label required">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            className={`form-control ${errors.nombre ? 'error' : ''}`}
                            placeholder="Ej: Juan Pérez"
                            disabled={isSubmitting}
                            {...register('nombre', {
                                required: 'El nombre es requerido',
                                minLength: {
                                    value: 2,
                                    message: 'El nombre debe tener al menos 2 caracteres'
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'El nombre no puede exceder 100 caracteres'
                                }
                            })}
                        />
                        {errors.nombre && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.nombre.message}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label required">
                            <FaEnvelope style={{ marginRight: 6 }} />
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? 'error' : ''}`}
                            placeholder="ejemplo@correo.com"
                            disabled={isSubmitting || usuario?.email}
                            {...register('email', {
                                required: 'El email es requerido',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email inválido'
                                }
                            })}
                        />
                        {errors.email && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.email.message}
                            </div>
                        )}
                        {usuario?.email && (
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                                El email no se puede modificar
                            </div>
                        )}
                    </div>
                </div>

                {/* En creación: Password y Rol en dos columnas */}
                {!usuario ? (
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label required">
                                <FaLock style={{ marginRight: 6 }} />
                                Contraseña
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className={`form-control ${errors.password ? 'error' : ''}`}
                                    placeholder="Ingrese contraseña"
                                    disabled={isSubmitting}
                                    {...register('password', {
                                        required: 'La contraseña es requerida',
                                        minLength: {
                                            value: 6,
                                            message: 'La contraseña debe tener al menos 6 caracteres'
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--muted)'
                                    }}
                                >
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="form-error">
                                    <FaExclamationCircle style={{ marginRight: 6 }} />
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="idRol" className="form-label required">
                                <FaUserTag style={{ marginRight: 6 }} />
                                Rol
                            </label>
                            <select
                                id="idRol"
                                className={`form-control ${errors.idRol ? 'error' : ''}`}
                                disabled={isSubmitting || loadingRoles}
                                {...register('idRol', {
                                    required: 'El rol es requerido'
                                })}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.idRol} value={rol.idRol}>
                                        {rol.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.idRol && (
                                <div className="form-error">
                                    <FaExclamationCircle style={{ marginRight: 6 }} />
                                    {errors.idRol.message}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* En edición: Solo Rol y Opción para cambiar contraseña */
                    <>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="idRol" className="form-label required">
                                    <FaUserTag style={{ marginRight: 6 }} />
                                    Rol
                                </label>
                                <select
                                    id="idRol"
                                    className={`form-control ${errors.idRol ? 'error' : ''}`}
                                    disabled={isSubmitting || loadingRoles}
                                    {...register('idRol', {
                                        required: 'El rol es requerido'
                                    })}
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.idRol} value={rol.idRol}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.idRol && (
                                    <div className="form-error">
                                        <FaExclamationCircle style={{ marginRight: 6 }} />
                                        {errors.idRol.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    <FaLock style={{ marginRight: 6 }} />
                                    Cambiar Contraseña
                                </label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    {showPassword ? (
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <input
                                                type="text"
                                                id="password"
                                                className={`form-control ${errors.password ? 'error' : ''}`}
                                                placeholder="Ingrese nueva contraseña"
                                                disabled={isSubmitting}
                                                {...register('password', {
                                                    minLength: {
                                                        value: 6,
                                                        message: 'La contraseña debe tener al menos 6 caracteres'
                                                    }
                                                })}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePassword}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--muted)'
                                                }}
                                            >
                                                Ocultar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="btn-management btn-management-secondary"
                                            style={{ fontSize: '14px', padding: '8px 12px' }}
                                        >
                                            <FaLock style={{ marginRight: 6 }} />
                                            Cambiar contraseña
                                        </button>
                                    )}
                                </div>
                                {errors.password && (
                                    <div className="form-error">
                                        <FaExclamationCircle style={{ marginRight: 6 }} />
                                        {errors.password.message}
                                    </div>
                                )}
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                                    {showPassword ? 'Complete solo si desea cambiar la contraseña' : 'Opcional: puede cambiar la contraseña del usuario'}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Estado (solo cuando se edita) */}
                {usuario ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Usuario</label>
                        <div className="switch-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="estado"
                                    disabled={isSubmitting}
                                    {...register('estado')}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className="switch-label">
                                Activar/Desactivar usuario
                            </span>
                        </div>

                        <div className="inline-warning" role="status">
                            <strong>Atención:</strong> Un usuario inactivo no podrá acceder al sistema.
                        </div>
                    </div>
                ) : (
                    <input type="hidden" {...register('estado')} value="true" />
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-management btn-management-secondary"
                        disabled={isSubmitting}
                    >
                        <FaTimes style={{ marginRight: 6 }} /> Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn-management"
                        disabled={isSubmitting || loadingRoles}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16 }} />
                                Procesando...
                            </>
                        ) : usuario ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Usuario
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Usuario
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuarioForm;