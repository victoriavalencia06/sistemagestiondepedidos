import React from 'react';
import { FaEye, FaTimesCircle, FaMoneyBill, FaUser } from 'react-icons/fa';
import { getTipoPagoLabel, getEstadoLabel } from '../../constants/pedidoConstants';

const PedidoItem = ({ pedido, usuarios, onView, onCancel }) => {
    // Obtener información del usuario del mapa
    const usuarioInfo = usuarios && usuarios[pedido.idUsuario] 
        ? usuarios[pedido.idUsuario]
        : {
            nombre: `Cliente #${pedido.idUsuario}`,
            email: ''
        };

    const getEstadoColor = (estado) => {
        switch (estado.toUpperCase()) {
            case 'PENDIENTE': return 'status-warning';
            case 'PROCESANDO': return 'status-info';
            case 'COMPLETADO': return 'status-success';
            case 'ENTREGADO': return 'status-delivered';
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
    <div className="role-badge">
        <FaUser />
        {usuarioInfo.nombre}
    </div>
</div>

            </td>

            <td>
                <div>
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