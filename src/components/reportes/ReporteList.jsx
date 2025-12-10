import React from 'react';
import { FaSearch, FaChartBar } from 'react-icons/fa';
import ReporteItem from './ReporteItem';

const ReporteList = ({ 
    reportes, 
    loading, 
    onView, 
    onEdit, 
    onDelete,
    searchTerm,
    onSearchChange
}) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando reportes...</p>
            </div>
        );
    }

    if (reportes.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaChartBar size={48} />
                </div>
                <h3 className="management-empty-title">No hay reportes registrados</h3>
                <p className="management-empty-text">
                    {searchTerm 
                        ? 'No se encontraron reportes con la búsqueda aplicada' 
                        : 'Comienza creando el primer reporte en el sistema'}
                </p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Reportes</h2>
                <p className="management-table-subtitle">
                    {reportes.length} {reportes.length === 1 ? 'reporte encontrado' : 'reportes encontrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Usuario</th>
                            <th>Pedido</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportes.map((reporte) => (
                            <ReporteItem
                                key={reporte.idReporte}
                                reporte={reporte}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteList;