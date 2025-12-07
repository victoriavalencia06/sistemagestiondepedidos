import React from 'react';
import { FaShoppingCart, FaEye, FaTimesCircle, FaMoneyBill, FaUser } from 'react-icons/fa';
import { getTipoPagoLabel, getEstadoLabel } from '../../constants/pedidoConstants';

const PedidoItem = ({ pedido, onView, onCancel }) => {
    const getEstadoColor = (estado) => {
        switch (estado.toUpperCase()) {
            case 'PENDIENTE': return 'status-warning';
            case 'PROCESANDO': return 'status-info';
            case 'COMPLETADO': case 'ENTREGADO': return 'status-success';
            case 'CANCELADO': return 'status-inactive';
            default: return 'status-active';
        }
    };

    return (
        <tr>
            <td>
                <strong>#{pedido.idPedido}</strong>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {pedido.codigo}
                </div>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        marginRight: '12px'
                    }}>
                        <FaUser />
                    </div>
                    <div>
                        <div>{pedido.usuario?.nombre || 'Cliente'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                            {pedido.usuario?.email || ''}
                        </div>
                    </div>
                </div>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMoneyBill style={{ color: 'var(--muted)' }} />
                    {getTipoPagoLabel(pedido.tipoPago)}
                </div>
            </td>

            <td>
                <strong>S/ {parseFloat(pedido.total).toFixed(2)}</strong>
            </td>

            <td>
                <span className={`status-badge ${getEstadoColor(pedido.estado)}`}>
                    {getEstadoLabel(pedido.estado)}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onView(pedido)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEye />
                        Ver Detalle
                    </button>

                    {pedido.estado.toUpperCase() === 'PENDIENTE' && (
                        <button
                            onClick={() => onCancel(pedido.idPedido)}
                            className="btn-management btn-management-danger"
                        >
                            <FaTimesCircle />
                            Cancelar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PedidoItem;