import React from 'react';
import { FaShoppingCart, FaReceipt } from 'react-icons/fa';
import PedidoItem from './PedidoItem';

const PedidoList = ({ pedidos, loading, usuarios, onView, onCancel, usuarioLogueado }) => {
    // Determinar si es cliente (idRol === 2)
    const esCliente = usuarioLogueado?.idRol === 2;

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
                <h3 className="management-empty-title">
                    {esCliente ? "No tienes pedidos registrados" : "No hay pedidos registrados"}
                </h3>
                <p className="management-empty-text">
                    {esCliente ? "Realiza tu primer pedido en el sistema" : "Comienza creando el primer pedido en el sistema"}
                </p>
            </div>
        );
    }

    // Calcular estadísticas (solo mostrar si NO es cliente)
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
                        <h2 className="management-table-title">
                            {esCliente ? "Mis Pedidos" : "Lista de Pedidos"}
                        </h2>
                        <p className="management-table-subtitle">
                            {pedidos.length} {pedidos.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
                            {esCliente && ` (Solo tus pedidos)`}
                        </p>
                    </div>
                    
                    {/* MOSTRAR ESTADÍSTICAS SOLO SI NO ES CLIENTE */}
                    {!esCliente && (
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
                    )}
                </div>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            {/* OCULTAR COLUMNA CLIENTE SI ES CLIENTE */}
                            {!esCliente && <th>Cliente</th>}
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
                                esCliente={esCliente}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PedidoList;