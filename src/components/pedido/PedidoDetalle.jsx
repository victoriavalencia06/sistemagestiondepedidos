// ../components/pedido/PedidoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaShoppingCart, FaArrowLeft, FaCheckCircle, FaTimesCircle,
    FaTruck, FaCalendar, FaUser, FaMoneyBill,
    FaBox, FaExclamationCircle, FaHistory, FaPrint
} from 'react-icons/fa';
import pedidoService from '../../services/pedidoService';
import { alertSuccess, alertError, alertConfirm } from "../../utils/alerts";
import { getTipoPagoLabel, getEstadoLabel, ESTADOS_PEDIDO } from '../../constants/pedidoConstants';
import '../../assets/css/PedidoDetalle.css';

const PedidoDetalle = ({ pedido: pedidoProp = null, pedidoId: pedidoIdProp = null, loading: loadingProp = false, onClose = null, onCancel = null, onEstadoChange = null }) => {
    const { id: idParam } = useParams();

    const [pedido, setPedido] = useState(pedidoProp);
    const [loading, setLoading] = useState(!!(!pedidoProp && !loadingProp));
    const [error, setError] = useState('');
    const [cambiandoEstado, setCambiandoEstado] = useState(false);

    // id real: prioriza prop, luego param
    const id = pedidoIdProp || idParam;

    useEffect(() => {
        if (pedidoProp) {
            setPedido(pedidoProp);
            setLoading(false);
            setError('');
            return;
        }

        if (loadingProp) {
            setLoading(true);
        }

        if (!id) {
            setError('No se especificó el pedido');
            setLoading(false);
            return;
        }

        const loadPedido = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await pedidoService.getById(id);
                setPedido(data);
            } catch (err) {
                setError(err.message || 'Error al cargar el pedido');
                console.error('Error cargando pedido:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPedido();
    }, [id, pedidoProp, pedidoIdProp, loadingProp]);

    // Estados siguientes permitidos según el estado actual
    const getEstadosPermitidos = (estadoActual) => {
        const map = {
            'PENDIENTE': ['PROCESANDO', 'CANCELADO'],
            'PROCESANDO': ['COMPLETADO', 'ENTREGADO'],
            'COMPLETADO': ['ENTREGADO'],
            'ENTREGADO': [], // No se puede cambiar
            'CANCELADO': [], // No se puede cambiar
        };

        if (!estadoActual) return [];
        return ESTADOS_PEDIDO.filter(e =>
            map[estadoActual.toUpperCase()]?.includes(e.value.toUpperCase())
        );
    };

    const getEstadoColor = (estado) => {
        if (!estado) return 'status-active';
        switch (estado.toUpperCase()) {
            case 'PENDIENTE': return 'status-warning';
            case 'PROCESANDO': return 'status-info';
            case 'COMPLETADO': return 'status-success';
            case 'ENTREGADO': return 'status-delivered';
            case 'CANCELADO': return 'status-inactive';
            default: return 'status-active';
        }
    };

    const getEstadoIcon = (estado) => {
        if (!estado) return <FaHistory />;
        switch (estado.toUpperCase()) {
            case 'PROCESANDO': return <FaTruck />;
            case 'COMPLETADO': return <FaCheckCircle />;
            case 'ENTREGADO': return <FaCheckCircle />;
            case 'CANCELADO': return <FaTimesCircle />;
            default: return <FaHistory />;
        }
    };

    const handleCambiarEstado = async (nuevoEstado) => {
        if (!pedido) return;
        const confirmMessages = {
            'PROCESANDO': '¿Marcar pedido como EN PROCESO? Esto indica que el pedido está siendo preparado.',
            'COMPLETADO': '¿Marcar pedido como COMPLETADO? Esto indica que el pedido está listo para entrega.',
            'ENTREGADO': '¿Confirmar ENTREGA del pedido? Esto finalizará el proceso.',
            'CANCELADO': '¿CANCELAR pedido? Esto revertirá el stock de productos.'
        };

        const result = await alertConfirm(
            `Cambiar estado a ${getEstadoLabel(nuevoEstado)}`,
            confirmMessages[nuevoEstado] || `¿Cambiar estado del pedido a ${getEstadoLabel(nuevoEstado)}?`
        );

        if (!result.isConfirmed) return;

        setCambiandoEstado(true);
        try {
            const data = { estado: nuevoEstado };
            await pedidoService.update(pedido.idPedido, data);

            alertSuccess("Estado actualizado", `El pedido ahora está: ${getEstadoLabel(nuevoEstado)}`);

            // Recargar pedido localmente (por si el service devuelve campos actualizados)
            const updated = await pedidoService.getById(pedido.idPedido);
            setPedido(updated);

            if (typeof onEstadoChange === 'function') {
                try { await onEstadoChange(); } catch (e) { /* ignorar si el padre no implementa */ }
            }
        } catch (err) {
            alertError("Error", err.message || "No se pudo cambiar el estado");
        } finally {
            setCambiandoEstado(false);
        }
    };

    // Función para imprimir
    const handlePrint = () => {
        window.print();
    };

    const handleCancelarDesdeDetalle = async () => {
        if (!pedido) return;
        if (typeof onCancel === 'function') {
            return onCancel(pedido.idPedido);
        }
        const result = await alertConfirm(
            "¿Cancelar pedido?",
            "Esta acción anulará el pedido y revertirá el stock de productos. ¿Desea continuar?"
        );
        if (!result.isConfirmed) return;
        try {
            await pedidoService.cancelar(pedido.idPedido);
            alertSuccess("Pedido cancelado", "El pedido fue anulado y el stock revertido.");
            const updated = await pedidoService.getById(pedido.idPedido);
            setPedido(updated);
            if (typeof onEstadoChange === 'function') {
                try { await onEstadoChange(); } catch (e) { }
            }
        } catch (err) {
            alertError("Error", err.message || 'No se pudo cancelar el pedido');
        }
    };

    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando pedido...</p>
            </div>
        );
    }

    if (error || !pedido) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaExclamationCircle size={48} />
                </div>
                <h3 className="management-empty-title">
                    {error || 'Pedido no encontrado'}
                </h3>
            </div>
        );
    }

    const estadosPermitidos = getEstadosPermitidos(pedido.estado);
    const fechaPedido = pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString('es-ES') : '';

    return (
        <div className="management-container">
            {/* Contenedor principal con estilo café */}
            <div className="pedido-detalle-container">
                {/* Encabezado - Botón volver a la izquierda, título e imprimir a la derecha */}
                <div className="pedido-header">
                    <div className="pedido-header-info">
                        <h2 className="pedido-title">
                            <FaShoppingCart style={{ marginRight: 10 }} />
                            Pedido #{pedido.idPedido}
                        </h2>
                        <p className="pedido-subtitle">
                            Código: <strong>{pedido.codigo}</strong> • Fecha: {fechaPedido}
                        </p>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="btn-management btn-imprimir-pedido"
                    >
                        <FaPrint style={{ marginRight: 6 }} /> Imprimir
                    </button>
                </div>

                {/* Grid de información con inputs café */}
                <div className="pedido-info-grid">
                    {/* Cliente */}
                    <div className="pedido-field-group">
                        <label className="pedido-field-label">
                            <FaUser size={14} /> Cliente
                        </label>
                        <div className="pedido-input-cafe">
                            <div className="pedido-cliente-nombre">{pedido.usuario?.nombre || 'Cliente'}</div>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="pedido-field-group">
                        <label className="pedido-field-label">
                            <FaHistory size={14} /> Estado
                        </label>
                        <div className="pedido-input-cafe">
                            <span className={`pedido-badge-estado ${getEstadoColor(pedido.estado)}`}>
                                {getEstadoLabel(pedido.estado)}
                            </span>
                        </div>
                    </div>

                    {/* Tipo de Pago */}
                    <div className="pedido-field-group">
                        <label className="pedido-field-label">
                            <FaMoneyBill size={14} /> Tipo de Pago
                        </label>
                        <div className="pedido-input-cafe">
                            {getTipoPagoLabel(pedido.tipoPago)}
                        </div>
                    </div>

                    {/* Fecha */}
                    <div className="pedido-field-group">
                        <label className="pedido-field-label">
                            <FaCalendar size={14} /> Fecha
                        </label>
                        <div className="pedido-input-cafe">
                            {fechaPedido}
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="pedido-total-box">
                    <div className="pedido-total-label">Total del Pedido</div>
                    <div className="pedido-total-monto">S/ {parseFloat(pedido.total || 0).toFixed(2)}</div>
                    <div className="pedido-total-detail">
                        {pedido.detalles?.length || 0} producto{pedido.detalles?.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Cambio de estado */}
                {estadosPermitidos.length > 0 && (
                    <div className="pedido-estado-actions">
                        <h3 className="pedido-section-title">Cambiar Estado</h3>
                        <div className="estado-buttons-grid">
                            {estadosPermitidos.map((estado) => (
                                <button
                                    key={estado.value}
                                    onClick={() => handleCambiarEstado(estado.value)}
                                    disabled={cambiandoEstado}
                                    className="btn-estado-cafe"
                                >
                                    <span className="btn-estado-icon">
                                        {getEstadoIcon(estado.value)}
                                    </span>
                                    <span className="btn-estado-text">{estado.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="pedido-estado-note">
                            * Solo se permiten transiciones específicas de estado
                        </p>
                    </div>
                )}

                {/* Productos */}
                <div className="pedido-productos-section">
                    <h3 className="pedido-section-title">
                        <FaBox style={{ marginRight: 8 }} /> Productos ({pedido.detalles?.length || 0})
                    </h3>
                    <div className="table-responsive">
                        <table className="pedido-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio Unit.</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.detalles?.map((detalle, index) => (
                                    <tr key={detalle.idDetallePedido || index}>
                                        <td>
                                            <div className="pedido-producto-item">
                                                <span className="pedido-producto-icon">
                                                    <FaBox size={12} />
                                                </span>
                                                <span className="pedido-producto-nombre">
                                                    {detalle.producto?.nombre || `Producto #${detalle.idProducto}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="pedido-precio">S/ {parseFloat(detalle.producto?.precio || 0).toFixed(2)}</td>
                                        <td className="pedido-cantidad">{detalle.cantidad}</td>
                                        <td className="pedido-subtotal">
                                            <strong>S/ {parseFloat(detalle.subtotal || 0).toFixed(2)}</strong>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="pedido-total-label-cell">TOTAL:</td>
                                    <td className="pedido-total-cell">
                                        S/ {parseFloat(pedido.total || 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Nota y acciones */}
                <div className="pedido-nota-box">
                    <div className="pedido-nota-icon">
                        <FaExclamationCircle size={18} />
                    </div>
                    <div className="pedido-nota-content">
                        <p className="pedido-nota-text">
                            <strong>Nota:</strong> Los pedidos son inmutables por razones de auditoría.
                            Solo se permite cambiar el estado según el flujo establecido.
                        </p>
                        {pedido.estado?.toUpperCase() === 'PENDIENTE' && (
                            <button
                                onClick={handleCancelarDesdeDetalle}
                                className="btn-cancelar-pedido"
                            >
                                <FaTimesCircle style={{ marginRight: 8 }} /> Cancelar Pedido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalle;