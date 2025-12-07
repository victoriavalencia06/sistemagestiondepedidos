import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaBox, FaSave, FaPlus, FaTimes, FaExclamationCircle, FaDollarSign, FaLayerGroup, FaClipboardList } from 'react-icons/fa';
import { alertConfirm } from "../../utils/alerts";
import categoriaService from '../../services/categoriaService';

const ProductoForm = ({ producto, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            idCategoria: '',
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            estado: true
        }
    });

    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(false);

    // Cargar categorías activas
    useEffect(() => {
        const loadCategorias = async () => {
            setLoadingCategorias(true);
            try {
                const data = await categoriaService.get();
                // Filtrar solo categorías activas
                const categoriasActivas = data.filter(cat => cat.estado == 1);
                setCategorias(categoriasActivas);
            } catch (error) {
                console.error('Error cargando categorías:', error);
            } finally {
                setLoadingCategorias(false);
            }
        };

        loadCategorias();
    }, []);

    // Resetear formulario cuando cambia el producto
    useEffect(() => {
        if (producto) {
            reset({
                idCategoria: producto.idCategoria || producto.categoria?.idCategoria || '',
                nombre: producto.nombre || '',
                descripcion: producto.descripcion || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
                estado: producto.estado ?? true
            });
        } else {
            reset({
                idCategoria: '',
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                estado: true
            });
        }
    }, [producto, reset]);

    const handleFormSubmit = async (data) => {
        const payload = {
            idCategoria: parseInt(data.idCategoria),
            nombre: data.nombre.trim(),
            descripcion: data.descripcion.trim() || null,
            precio: parseFloat(data.precio),
            stock: data.stock ? parseInt(data.stock) : null,
            estado: data.estado
        };

        // Si estamos editando y vamos a desactivar, mostrar confirmación
        if (producto && !data.estado) {
            const result = await alertConfirm(
                "¿Desactivar producto?",
                "Un producto inactivo no estará disponible para ventas."
            );

            if (!result.isConfirmed) {
                return;
            }
        }

        await onSubmit(payload);
    };

    const handleCancel = async () => {
        if (producto?.nombre) {
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
                    <FaBox style={{ marginRight: 8 }} />
                    {producto ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h2>
                <p className="management-form-subtitle">
                    {producto
                        ? 'Actualiza la información del producto existente'
                        : 'Completa la información para crear un nuevo producto'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="management-form">
                {/* Primera fila: Categoría y Nombre */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="idCategoria" className="form-label required">
                            <FaLayerGroup style={{ marginRight: 6 }} />
                            Categoría
                        </label>
                        <select
                            id="idCategoria"
                            className={`form-control ${errors.idCategoria ? 'error' : ''}`}
                            disabled={isSubmitting || loadingCategorias}
                            {...register('idCategoria', {
                                required: 'La categoría es requerida'
                            })}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.idCategoria && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idCategoria.message}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label required">
                            Nombre del Producto
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            className={`form-control ${errors.nombre ? 'error' : ''}`}
                            placeholder="Ej: Café Americano, Sandwich de Jamón, Torta de Chocolate..."
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
                </div>

                {/* Segunda fila: Precio y Stock */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="precio" className="form-label required">
                            <FaDollarSign style={{ marginRight: 6 }} />
                            Precio (S/)
                        </label>
                        <input
                            type="number"
                            id="precio"
                            step="0.01"
                            min="0"
                            className={`form-control ${errors.precio ? 'error' : ''}`}
                            placeholder="0.00"
                            disabled={isSubmitting}
                            {...register('precio', {
                                required: 'El precio es requerido',
                                min: {
                                    value: 0,
                                    message: 'El precio no puede ser negativo'
                                },
                                valueAsNumber: true
                            })}
                        />
                        {errors.precio && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.precio.message}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="stock" className="form-label">
                            Stock Inicial
                        </label>
                        <input
                            type="number"
                            id="stock"
                            min="0"
                            className={`form-control ${errors.stock ? 'error' : ''}`}
                            placeholder="0"
                            disabled={isSubmitting}
                            {...register('stock', {
                                min: {
                                    value: 0,
                                    message: 'El stock no puede ser negativo'
                                },
                                valueAsNumber: true
                            })}
                        />
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                            Opcional. Si no se especifica, se asigna 0.
                        </div>
                        {errors.stock && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.stock.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tercera fila: Descripción (ocupa toda la fila) */}
                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">
                        <FaClipboardList style={{ marginRight: 6 }} />
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        className="form-control"
                        placeholder="Descripción detallada del producto (opcional)"
                        rows={3}
                        disabled={isSubmitting}
                        {...register('descripcion', {
                            maxLength: {
                                value: 500,
                                message: 'La descripción no puede exceder 500 caracteres'
                            }
                        })}
                    />
                    {errors.descripcion && (
                        <div className="form-error">
                            <FaExclamationCircle style={{ marginRight: 6 }} />
                            {errors.descripcion.message}
                        </div>
                    )}
                </div>

                {/* Estado (solo cuando se edita) */}
                {producto ? (
                    <div className="form-group">
                        <label className="form-label">Estado del Producto</label>
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
                                Activar/Desactivar producto
                            </span>
                        </div>

                        <div className="inline-warning" role="status">
                            <strong>Atención:</strong> Un producto inactivo no estará disponible para ventas.
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
                        disabled={isSubmitting || loadingCategorias}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16 }} />
                                Procesando...
                            </>
                        ) : producto ? (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Actualizar Producto
                            </>
                        ) : (
                            <>
                                <FaPlus style={{ marginRight: 6 }} /> Crear Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductoForm;