import React from 'react';
import { FaShoppingCart, FaReceipt } from 'react-icons/fa';
import PedidoItem from './PedidoItem';

const PedidoList = ({ pedidos, loading, usuarios, onView, onCancel }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando pedidos...</p>
            </div>
        );
    }

    if (pedidos.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaReceipt size={48} />
                </div>
                <h3 className="management-empty-title">No hay pedidos registrados</h3>
                <p className="management-empty-text">Comienza creando el primer pedido en el sistema</p>
            </div>
        );
    }

    // Calcular estadísticas
    const totalVentas = pedidos
        .filter(p => p.estado.toUpperCase() !== 'CANCELADO')
        .reduce((sum, p) => sum + parseFloat(p.total), 0);

    const pedidosActivos = pedidos.filter(p =>
        p.estado.toUpperCase() === 'PENDIENTE' ||
        p.estado.toUpperCase() === 'PROCESANDO'
    ).length;

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="management-table-title">Lista de Pedidos</h2>
                        <p className="management-table-subtitle">
                            {pedidos.length} {pedidos.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total Ventas</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--success)' }}>
                                S/ {totalVentas.toFixed(2)}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Pedidos Activos</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--warning)' }}>
                                {pedidosActivos}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Tipo Pago</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pedidos.map((pedido) => (
                            <PedidoItem
                                key={pedido.idPedido}
                                pedido={pedido}
                                usuarios={usuarios}
                                onView={onView}
                                onCancel={onCancel}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoList;