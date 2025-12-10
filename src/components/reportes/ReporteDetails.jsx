import React from 'react';
import { 
    FaChartBar, 
    FaCalendarAlt, 
    FaEdit, 
    FaTrash, 
    FaTimes,
    FaUser,
    FaShoppingCart,
    FaFileAlt
} from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getTipoReporteLabel } from '../../constants/reporteConstants';

const ReporteDetails = ({ reporte, onClose, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        try {
            const date = new Date(dateString);
            return format(date, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    if (!reporte) return null;

    return (
        <div className="management-details-card">
            <div className="details-card-header">
                <div className="details-card-title">
                    <FaChartBar style={{ marginRight: 12 }} />
                    {reporte.titulo}
                </div>
                <button onClick={onClose} className="btn-close" aria-label="Cerrar">
                    <FaTimes />
                </button>
            </div>

            <div className="details-card-body">
                <div className="details-card-info">
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">ID del Reporte</div>
                            <div className="info-value">#{reporte.idReporte}</div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-label">
                                <FaUser style={{ marginRight: 6 }} />
                                Usuario
                            </div>
                            <div className="info-value">
                                {reporte.usuario?.nombre || `ID: ${reporte.idUsuario}`}
                            </div>
                        </div>
                        
                        {reporte.idPedido && (
                            <div className="info-item">
                                <div className="info-label">
                                    <FaShoppingCart style={{ marginRight: 6 }} />
                                    Pedido
                                </div>
                                <div className="info-value">
                                    Pedido #{reporte.idPedido}
                                    {reporte.pedido?.total && ` - S/ ${reporte.pedido.total.toFixed(2)}`}
                                </div>
                            </div>
                        )}
                        
                        <div className="info-item">
                            <div className="info-label">
                                <FaCalendarAlt style={{ marginRight: 6 }} />
                                Fecha Generación
                            </div>
                            <div className="info-value">
                                {formatDate(reporte.fechaGeneracion)}
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-label">
                                <FaFileAlt style={{ marginRight: 6 }} />
                                Tipo
                            </div>
                            <div className="info-value">
                                {getTipoReporteLabel(reporte.tipo)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="details-card-description">
                    <div className="description-label">Descripción</div>
                    <div className="description-content">
                        {reporte.descripcion || 'No hay descripción disponible.'}
                    </div>
                </div>
            </div>

            <div className="details-card-footer">
                <button
                    onClick={onEdit}
                    className="btn-management btn-management-secondary"
                >
                    <FaEdit style={{ marginRight: 6 }} /> Editar Reporte
                </button>
                
                <button
                    onClick={onClose}
                    className="btn-management btn-management-outline"
                >
                    <FaTimes style={{ marginRight: 6 }} /> Cerrar
                </button>
            </div>
        </div>
    );
};

export default ReporteDetails;