import React from 'react';
import { FaChartBar, FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const ReporteItem = ({ reporte, onView, onEdit, onDelete }) => { 
    return (
        <tr>
            <td>
                <strong>#{reporte.idReporte}</strong>
            </td>

            <td>
                <div className="reporte-titulo">
                    <FaChartBar style={{ marginRight: 8, color: '#B05A2C' }} />
                    {reporte.titulo}
                </div>
            </td>

            <td>
                <div className="reporte-usuario">
                    {reporte.usuario?.nombre || `ID: ${reporte.idUsuario}`}
                </div>
            </td>

            <td>
                {reporte.idPedido && (
                    <div className="reporte-pedido">
                        Pedido #{reporte.idPedido}
                    </div>
                )}
            </td>

            <td>
                {reporte.tipo && (
                    <span className="reporte-tipo">
                        {reporte.tipo}
                    </span>
                )}
            </td>

            <td>
                <span className={`status-badge ${reporte.estado ? 'status-active' : 'status-inactive'}`}>
                    {reporte.estado ? 'Activo' : 'Inactivo'}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onView(reporte)}
                        className="btn-management btn-management-info"
                        title="Ver detalles"
                    >
                        <FaEye />
                        Ver
                    </button>

                    <button
                        onClick={() => onEdit(reporte)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>

                    {reporte.estado == 1 && (
                        <button
                            onClick={() => onDelete(reporte.idReporte)}
                            className="btn-management btn-management-danger"
                        >
                            <FaTrash />
                            Desactivar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ReporteItem;