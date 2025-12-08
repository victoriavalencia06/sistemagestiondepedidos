import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaShoppingCart, FaSave, FaPlus, FaTimes, FaExclamationCircle, FaTrash, FaSearch, FaBox, FaMoneyBill, FaUser } from 'react-icons/fa';
import { alertConfirm } from "../../utils/alerts";
import usuarioService from '../../services/usuarioService';
import productoService from '../../services/productoService';
import { TIPOS_PAGO, ESTADOS_PEDIDO } from '../../constants/pedidoConstants';

const PedidoForm = ({ onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            idUsuario: '',
            tipoPago: 'EFECTIVO',
            estado: 'PENDIENTE',
            detalles: []
        }
    });

    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);
    const [loadingProductos, setLoadingProductos] = useState(false);

    // Cargar usuarios y productos
    useEffect(() => {
        const loadUsuarios = async () => {
            setLoadingUsuarios(true);
            try {
                const data = await usuarioService.get();
                // Filtrar solo usuarios activos (estado == 1) Y con rol cliente (idRol == 2)
                const clientes = data.filter(u => u.estado == 1 && u.idRol == 2);
                setUsuarios(clientes);
            } catch (error) {
                console.error('Error cargando usuarios:', error);
            } finally {
                setLoadingUsuarios(false);
            }
        };

        const loadProductos = async () => {
            setLoadingProductos(true);
            try {
                const data = await productoService.get();
                // Filtrar productos activos con stock > 0 O stock null (sin control de stock)
                const productosDisponibles = data.filter(p =>
                    p.estado == 1 &&
                    (p.stock === null || p.stock === undefined || p.stock > 0)
                );
                setProductos(productosDisponibles);
            } catch (error) {
                console.error('Error cargando productos:', error);
            } finally {
                setLoadingProductos(false);
            }
        };

        loadUsuarios();
        loadProductos();
    }, []);

    // Agregar producto a detalles
    const agregarProducto = () => {
        if (!productoSeleccionado || cantidad < 1) return;

        // Validar que haya stock suficiente si el producto tiene control de stock
        if (productoSeleccionado.stock !== null && productoSeleccionado.stock !== undefined) {
            // Calcular stock disponible (restando lo ya agregado en el carrito)
            const productoEnCarrito = detalles.find(d => d.idProducto === productoSeleccionado.idProducto);
            const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
            const stockDisponible = productoSeleccionado.stock - cantidadEnCarrito;

            if (cantidad > stockDisponible) {
                alert('Stock insuficiente', `Solo hay ${stockDisponible} unidades disponibles de "${productoSeleccionado.nombre}"`);
                return;
            }
        }

        const productoExistente = detalles.find(d => d.idProducto === productoSeleccionado.idProducto);

        if (productoExistente) {
            // Actualizar cantidad si ya existe
            setDetalles(detalles.map(d =>
                d.idProducto === productoSeleccionado.idProducto
                    ? { ...d, cantidad: d.cantidad + cantidad }
                    : d
            ));
        } else {
            // Agregar nuevo producto
            const nuevoDetalle = {
                idProducto: productoSeleccionado.idProducto,
                cantidad: cantidad,
                producto: productoSeleccionado,
                subtotal: productoSeleccionado.precio * cantidad
            };
            setDetalles([...detalles, nuevoDetalle]);
        }

        // Resetear selección
        setProductoSeleccionado(null);
        setCantidad(1);
    };

    // Remover producto de detalles
    const removerProducto = (idProducto) => {
        setDetalles(detalles.filter(d => d.idProducto !== idProducto));
    };

    // Actualizar cantidad de producto en detalles
    const actualizarCantidad = (idProducto, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            removerProducto(idProducto);
            return;
        }

        const detalle = detalles.find(d => d.idProducto === idProducto);
        if (!detalle) return;

        // Validar stock si el producto tiene control
        if (detalle.producto.stock !== null && detalle.producto.stock !== undefined) {
            // Calcular la diferencia (cuánto se quiere aumentar)
            const diferencia = nuevaCantidad - detalle.cantidad;

            if (diferencia > 0) { // Si está aumentando la cantidad
                const otrosDetallesMismoProducto = detalles
                    .filter(d => d.idProducto === idProducto && d !== detalle);
                const cantidadEnOtrosDetalles = otrosDetallesMismoProducto
                    .reduce((sum, d) => sum + d.cantidad, 0);

                const stockDisponible = detalle.producto.stock - cantidadEnOtrosDetalles;

                if (nuevaCantidad > stockDisponible) {
                    alert('Stock insuficiente', `Solo hay ${stockDisponible} unidades disponibles de "${detalle.producto.nombre}"`);
                    return;
                }
            }
        }

        setDetalles(detalles.map(d =>
            d.idProducto === idProducto
                ? {
                    ...d,
                    cantidad: nuevaCantidad,
                    subtotal: d.producto.precio * nuevaCantidad
                }
                : d
        ));
    };

    // Calcular total
    const calcularTotal = () => {
        return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    };

    const handleFormSubmit = async (data) => {
        if (detalles.length === 0) {
            alert('Error', 'Debe agregar al menos un producto al pedido');
            return;
        }

        // Validar stock final antes de enviar
        const erroresStock = [];

        detalles.forEach(detalle => {
            if (detalle.producto.stock !== null && detalle.producto.stock !== undefined) {
                if (detalle.cantidad > detalle.producto.stock) {
                    erroresStock.push(
                        `"${detalle.producto.nombre}": Solicitado ${detalle.cantidad}, disponible ${detalle.producto.stock}`
                    );
                }
            }
        });

        if (erroresStock.length > 0) {
            alert('Stock insuficiente', `Los siguientes productos no tienen stock suficiente:\n\n${erroresStock.join('\n')}`);
            return;
        }

        const payload = {
            idUsuario: parseInt(data.idUsuario),
            tipoPago: data.tipoPago,
            estado: data.estado,
            detalles: detalles.map(d => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad
            }))
        };

        await onSubmit(payload);
    };

    const handleCancel = async () => {
        if (detalles.length > 0) {
            const result = await alertConfirm(
                "¿Salir sin guardar?",
                "El pedido no guardado se perderá."
            );
            if (!result.isConfirmed) return;
        }

        onCancel();
    };

    return (
        <div className="management-form-container">
            <div className="management-form-header">
                <h2 className="management-form-title">
                    <FaShoppingCart style={{ marginRight: 8 }} />
                    Crear Nuevo Pedido
                </h2>
                <p className="management-form-subtitle">
                    Complete la información para crear un nuevo pedido
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="management-form">
                {/* Primera fila: Usuario y Tipo de Pago */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="idUsuario" className="form-label required">
                            <FaUser style={{ marginRight: 6 }} />
                            Cliente
                        </label>
                        <select
                            id="idUsuario"
                            className={`form-control ${errors.idUsuario ? 'error' : ''}`}
                            disabled={isSubmitting || loadingUsuarios}
                            {...register('idUsuario', {
                                required: 'El cliente es requerido'
                            })}
                        >
                            <option value="">Seleccione un cliente</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                                    {usuario.nombre} ({usuario.email})
                                </option>
                            ))}
                        </select>
                        {errors.idUsuario && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.idUsuario.message}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoPago" className="form-label required">
                            <FaMoneyBill style={{ marginRight: 6 }} />
                            Tipo de Pago
                        </label>
                        <select
                            id="tipoPago"
                            className={`form-control ${errors.tipoPago ? 'error' : ''}`}
                            disabled={isSubmitting}
                            {...register('tipoPago', {
                                required: 'El tipo de pago es requerido'
                            })}
                        >
                            {TIPOS_PAGO.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                        {errors.tipoPago && (
                            <div className="form-error">
                                <FaExclamationCircle style={{ marginRight: 6 }} />
                                {errors.tipoPago.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Segunda fila: Estado (opcional, default PENDIENTE) */}
                <div className="form-group">
                    <label htmlFor="estado" className="form-label">
                        Estado del Pedido
                    </label>
                    <select
                        id="estado"
                        className="form-control"
                        disabled={isSubmitting}
                        {...register('estado')}
                    >
                        {ESTADOS_PEDIDO.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sección: Agregar productos */}
                <div className="form-section">
                    <h3 style={{ marginBottom: '16px', color: 'var(--text)' }}>
                        <FaBox style={{ marginRight: 8 }} />
                        Productos del Pedido
                    </h3>

                    {/* Selector de producto */}
                    <div className="form-row" style={{ marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label required">
                                <FaSearch style={{ marginRight: 6 }} />
                                Seleccionar Producto
                            </label>
                            <select
                                className="form-control"
                                value={productoSeleccionado?.idProducto || ''}
                                onChange={(e) => {
                                    const id = parseInt(e.target.value);
                                    const producto = productos.find(p => p.idProducto === id);
                                    setProductoSeleccionado(producto || null);
                                    // Resetear cantidad cuando cambia producto
                                    setCantidad(1);
                                }}
                                disabled={isSubmitting || loadingProductos}
                            >
                                <option value="">Seleccione un producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.idProducto} value={producto.idProducto}>
                                        {producto.nombre} - S/ {producto.precio}
                                        {producto.stock !== null && producto.stock !== undefined
                                            ? ` (Stock: ${producto.stock})`
                                            : ' (Sin control de stock)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={productoSeleccionado?.stock || 999}
                                className="form-control"
                                value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                disabled={isSubmitting || !productoSeleccionado}
                            />
                            {productoSeleccionado && productoSeleccionado.stock !== null && productoSeleccionado.stock !== undefined && (
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                                    Stock disponible: {productoSeleccionado.stock}
                                </div>
                            )}
                        </div>

                        <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={agregarProducto}
                                className="btn-management"
                                disabled={isSubmitting || !productoSeleccionado || cantidad < 1 ||
                                    (productoSeleccionado.stock !== null && productoSeleccionado.stock !== undefined &&
                                        productoSeleccionado.stock === 0)}
                                style={{ padding: '8px 16px' }}
                            >
                                <FaPlus /> Agregar
                            </button>
                        </div>
                    </div>

                    {/* Tabla de productos agregados */}
                    {detalles.length > 0 ? (
                        <div className="table-responsive" style={{ marginBottom: '20px' }}>
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((detalle) => (
                                        <tr key={detalle.idProducto}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="role-badge">
                                                        <FaBox />
                                                        {detalle.producto.nombre}
                                                        {detalle.producto.stock !== null && detalle.producto.stock !== undefined && (
                                                            <span style={{ fontSize: '11px', marginLeft: '8px', color: 'var(--muted)' }}>
                                                                (Stock: {detalle.producto.stock})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>S/ {detalle.producto.precio.toFixed(2)}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={detalle.producto.stock || 999}
                                                    value={detalle.cantidad}
                                                    onChange={(e) => actualizarCantidad(detalle.idProducto, parseInt(e.target.value) || 1)}
                                                    style={{
                                                        width: '80px',
                                                        padding: '4px 8px',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '4px'
                                                    }}
                                                    disabled={isSubmitting}
                                                />
                                            </td>
                                            <td>
                                                <strong>S/ {detalle.subtotal.toFixed(2)}</strong>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => removerProducto(detalle.idProducto)}
                                                    className="btn-management btn-management-danger"
                                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                                    disabled={isSubmitting}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            border: '2px dashed var(--border)',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            color: 'var(--muted)'
                        }}>
                            <FaBox size={32} style={{ marginBottom: '10px' }} />
                            <p>No hay productos agregados al pedido</p>
                        </div>
                    )}

                    {/* Resumen total */}
                    {detalles.length > 0 && (
                        <div style={{
                            backgroundColor: 'var(--primary-light)',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--text)' }}>Resumen del Pedido</h4>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--muted)' }}>
                                        {detalles.length} producto{detalles.length !== 1 ? 's' : ''} agregado{detalles.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: 'var(--muted)' }}>Total</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        S/ {calcularTotal().toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
                        disabled={isSubmitting || detalles.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16 }} />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <FaSave style={{ marginRight: 6 }} /> Crear Pedido
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PedidoForm;