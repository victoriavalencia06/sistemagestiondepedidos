import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaTag, FaSave, FaPlus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { alertConfirm } from "../../utils/alerts";

const CategoriaForm = ({ categoria, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            nombre: '',
            estado: true
        }
    });

    // Resetear formulario cuando cambia la categoría
    useEffect(() => {
        if (categoria) {
            reset({
                nombre: categoria.nombre || '',
                estado: categoria.estado ?? true
            });
        } else {
            reset({
                nombre: '',
                estado: true
            });
        }
    }, [categoria, reset]);

    const handleFormSubmit = async (data) => {
        const payload = {
            nombre: data.nombre.trim(),
            estado: data.estado
        };

        await onSubmit(payload);
    };

    const handleCancel = async () => {
        if (categoria?.nombre) {
            const result = await alertConfirm(
                "¿Salir sin guardar?",
                "Los cambios no guardados se perderán."
            );
            if (!result.isConfirmed) return;
        }

        onCancel();
    };


    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaTag style={{ marginRight: 8 }} />
                    {categoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h2>
                <p className="management-form-subtitle">
                    {categoria
                        ? 'Actualiza la información de la categoría existente'
                        : 'Completa la información para crear una nueva categoría'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="management-form">
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label required">
                        Nombre de la Categoría
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ej: Electrónica, Ropa, Hogar..."
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

                {categoria ? (
                    <div className="form-group">
                        <label className="form-label">Estado de la Categoría</label>
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
                                Activar/Desactivar categoría
                            </span>
                        </div>

                        <div className="inline-warning" role="status">
                            <strong>Atención:</strong> Una categoría inactiva no estará disponible para los productos.
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16 }} />
                                Procesando...
                            </>
                        ) : categoria ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Categoría
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Categoría
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoriaForm;