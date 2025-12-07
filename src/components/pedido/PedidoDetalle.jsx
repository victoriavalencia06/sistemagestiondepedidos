import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaShoppingCart, FaArrowLeft, FaCheckCircle, FaTimesCircle,
    FaTruck, FaPrint, FaCalendar, FaUser, FaMoneyBill,
    FaBox, FaExclamationCircle, FaHistory
} from 'react-icons/fa';
import pedidoService from '../../services/pedidoService';
import { alertSuccess, alertError, alertConfirm } from "../../utils/alerts";
import { getTipoPagoLabel, getEstadoLabel, ESTADOS_PEDIDO } from '../../constants/pedidoConstants';
import '../assets/css/Management.css';

const PedidoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cambiandoEstado, setCambiandoEstado] = useState(false);

    // Estados siguientes permitidos según el estado actual
    const getEstadosPermitidos = (estadoActual) => {
        const estados = {
            'PENDIENTE': ['PROCESANDO', 'CANCELADO'],
            'PROCESANDO': ['COMPLETADO', 'ENTREGADO'],
            'COMPLETADO': ['ENTREGADO'],
            'ENTREGADO': [], // No se puede cambiar
            'CANCELADO': [], // No se puede cambiar
        };

        return ESTADOS_PEDIDO.filter(e =>
            estados[estadoActual.toUpperCase()]?.includes(e.value.toUpperCase())
        );
    };

    // Cargar pedido
    useEffect(() => {
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
    }, [id]);

    // Cambiar estado del pedido
    const handleCambiarEstado = async (nuevoEstado) => {
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

            // Recargar pedido
            const updated = await pedidoService.getById(id);
            setPedido(updated);
        } catch (err) {
            alertError("Error", err.message || "No se pudo cambiar el estado");
        } finally {
            setCambiandoEstado(false);
        }
    };

    // Imprimir comprobante
    const handleImprimir = () => {
        alertSuccess("Imprimir", "Funcionalidad de impresión en desarrollo");
        // Aquí iría la lógica para generar PDF
    };

    // Volver a lista
    const handleVolver = () => {
        navigate('/pedidos');
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
                <button onClick={handleVolver} className="btn-management">
                    <FaArrowLeft style={{ marginRight: 6 }} /> Volver a pedidos
                </button>
            </div>
        );
    }

    const estadosPermitidos = getEstadosPermitidos(pedido.estado);
    const fechaPedido = new Date(pedido.fechaPedido).toLocaleString('es-ES');

    return (
        <div className="management-container">
            {/* Header con botón volver */}
            <div className="management-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={handleVolver} className="btn-management btn-management-secondary">
                        <FaArrowLeft />
                    </button>
                    <h1 className="management-title">
                        <FaShoppingCart style={{ marginRight: 8 }} />
                        Pedido #{pedido.idPedido}
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleImprimir} className="btn-management">
                        <FaPrint style={{ marginRight: 6 }} /> Imprimir
                    </button>
                </div>
            </div>

            {/* Información del pedido */}
            <div className="management-form-container" style={{ marginBottom: '24px' }}>
                <div className="management-form-header">
                    <h2 className="management-form-title">
                        <FaShoppingCart style={{ marginRight: 8 }} />
                        Información del Pedido
                    </h2>
                    <p className="management-form-subtitle">
                        Código: {pedido.codigo} • Creado el {fechaPedido}
                    </p>
                </div>

                <div className="form-row">
                    {/* Información del cliente */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaUser style={{ marginRight: 6 }} />
                            Cliente
                        </label>
                        <div style={{
                            padding: '12px',
                            background: 'var(--primary-light)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontWeight: 'bold' }}>{pedido.usuario?.nombre || 'Cliente'}</div>
                            <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                                {pedido.usuario?.email || ''}
                            </div>
                        </div>
                    </div>

                    {/* Estado actual */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaHistory style={{ marginRight: 6 }} />
                            Estado Actual
                        </label>
                        <div style={{
                            padding: '12px',
                            background: 'var(--card-bg)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            <span className={`status-badge ${getEstadoColor(pedido.estado)}`} style={{ fontSize: '14px' }}>
                                {getEstadoLabel(pedido.estado)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    {/* Tipo de pago */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaMoneyBill style={{ marginRight: 6 }} />
                            Tipo de Pago
                        </label>
                        <div style={{
                            padding: '12px',
                            background: 'var(--card-bg)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            {getTipoPagoLabel(pedido.tipoPago)}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="form-group">
                        <label className="form-label">
                            Total
                        </label>
                        <div style={{
                            padding: '12px',
                            background: 'var(--success-light)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
                                S/ {parseFloat(pedido.total).toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones de cambio de estado */}
                {estadosPermitidos.length > 0 && (
                    <div className="form-group">
                        <label className="form-label">
                            Cambiar Estado
                        </label>
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            padding: '12px',
                            background: 'var(--card-bg)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            {estadosPermitidos.map((estado) => (
                                <button
                                    key={estado.value}
                                    onClick={() => handleCambiarEstado(estado.value)}
                                    disabled={cambiandoEstado}
                                    className="btn-management"
                                    style={{
                                        flex: '1',
                                        minWidth: '160px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {getEstadoIcon(estado.value)}
                                    {estado.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                            * Solo se permiten transiciones específicas de estado
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de productos */}
            <div className="management-table-container">
                <div className="management-table-header">
                    <h2 className="management-table-title">
                        <FaBox style={{ marginRight: 8 }} />
                        Productos del Pedido
                    </h2>
                    <p className="management-table-subtitle">
                        {pedido.detalles?.length || 0} producto{pedido.detalles?.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.detalles?.map((detalle, index) => (
                                <tr key={detalle.idDetallePedido || index}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className="role-badge">
                                                <FaBox />
                                                {detalle.producto?.nombre || `Producto #${detalle.idProducto}`}
                                            </div>
                                        </div>
                                    </td>
                                    <td>S/ {parseFloat(detalle.producto?.precio || 0).toFixed(2)}</td>
                                    <td>{detalle.cantidad}</td>
                                    <td>
                                        <strong>S/ {parseFloat(detalle.subtotal || 0).toFixed(2)}</strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    TOTAL:
                                </td>
                                <td style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    S/ {parseFloat(pedido.total).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Nota sobre inmutabilidad */}
            <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'var(--warning-light)',
                border: '1px solid var(--warning)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'var(--text)'
            }}>
                <FaExclamationCircle style={{ marginRight: '8px', color: 'var(--warning)' }} />
                <strong>Nota:</strong> Los pedidos son inmutables por razones de auditoría. Solo se permite cambiar el estado según el flujo establecido.
            </div>
        </div>
    );
};

// Funciones auxiliares
const getEstadoColor = (estado) => {
    switch (estado.toUpperCase()) {
        case 'PENDIENTE': return 'status-warning';
        case 'PROCESANDO': return 'status-info';
        case 'COMPLETADO': case 'ENTREGADO': return 'status-success';
        case 'CANCELADO': return 'status-inactive';
        default: return 'status-active';
    }
};

const getEstadoIcon = (estado) => {
    switch (estado.toUpperCase()) {
        case 'PROCESANDO': return <FaTruck />;
        case 'COMPLETADO': return <FaCheckCircle />;
        case 'ENTREGADO': return <FaCheckCircle />;
        case 'CANCELADO': return <FaTimesCircle />;
        default: return <FaHistory />;
    }
};

export default PedidoDetalle;