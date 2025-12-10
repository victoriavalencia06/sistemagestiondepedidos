import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaPlus, FaExclamationCircle, FaSearch, FaChartBar } from 'react-icons/fa';
import ReporteList from '../components/reportes/ReporteList';
import ReporteForm from '../components/reportes/ReporteForm';
import ReporteDetails from '../components/reportes/ReporteDetails';
import reporteService from '../services/reporteService';
import '../assets/css/Management.css';
import { alertSuccess, alertError, alertConfirm } from "../utils/alerts";

const Reportes = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editingReporte, setEditingReporte] = useState(null);
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Cargar reportes
    const loadReportes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await reporteService.get();
            setReportes(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los reportes');
            console.error('Error cargando reportes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReportes();
    }, [loadReportes]);

    // Filtrado y búsqueda
    // Filtrado y búsqueda - SOLO MUESTRA REPORTES ACTIVOS (estado = 1)
    const filteredReportes = useMemo(() => {
        let result = [...reportes];

        // SOLO mostrar reportes ACTIVOS
        result = result.filter(r => r.estado == 1);

        // Búsqueda por término
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.titulo?.toLowerCase().includes(term) ||
                (r.descripcion && r.descripcion.toLowerCase().includes(term)) ||
                (r.usuario?.nombre && r.usuario.nombre.toLowerCase().includes(term))
            );
        }

        return result;
    }, [reportes, searchTerm]);

    // Paginación
    const currentPageReportes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredReportes.slice(startIndex, endIndex);
    }, [filteredReportes, currentPage, itemsPerPage]);

    const totalItems = filteredReportes.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Ajustar página actual
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Handlers
    const handleCreate = () => {
        setEditingReporte(null);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleView = (reporte) => {
        setSelectedReporte(reporte);
        setShowDetails(true);
        setShowForm(false);
    };

    const handleEdit = (reporte) => {
        setEditingReporte(reporte);
        setShowForm(true);
        setShowDetails(false);
    };

    const handleDelete = async (id) => {
        const result = await alertConfirm(
            "¿Desactivar reporte?",
            "El reporte se marcará como inactivo. ¿Está seguro?"
        );

        if (!result.isConfirmed) return;

        try {
            await reporteService.delete(id);
            alertSuccess("Reporte desactivado", "El reporte fue desactivado correctamente.");
            await loadReportes();
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    const handleFormSubmit = async (reporteData) => {
        try {
            if (editingReporte) {
                await reporteService.update(editingReporte.idReporte, reporteData);
                alertSuccess("Actualizado", "El reporte fue actualizado correctamente.");
            } else {
                await reporteService.create(reporteData);
                alertSuccess("Creado", "El reporte fue registrado exitosamente.");
            }

            setShowForm(false);
            setEditingReporte(null);
            await loadReportes();
        } catch (err) {
            alertError("Error en formulario", err.message);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setShowDetails(false);
        setEditingReporte(null);
        setSelectedReporte(null);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Componente de paginación
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="management-pagination">
                <div className="pagination-info">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} reportes
                </div>

                <div className="pagination-controls">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        &lt;
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                className="pagination-number"
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                            <button
                                className="pagination-number"
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">
                    <FaChartBar style={{ marginRight: 8 }} />
                    Gestión de Reportes
                </h1>

                {!showForm && !showDetails && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Reporte
                    </button>
                )}
            </div>

            {!showForm && !showDetails && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por título, usuario..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="alert-message alert-error">
                    <FaExclamationCircle />
                    {error}
                </div>
            )}

            {showDetails ? (
                <ReporteDetails
                    reporte={selectedReporte}
                    onClose={handleCancel}
                    onEdit={() => {
                        setEditingReporte(selectedReporte);
                        setShowDetails(false);
                        setShowForm(true);
                    }}
                    onDelete={() => handleDelete(selectedReporte.idReporte)}
                />
            ) : showForm ? (
                <ReporteForm
                    reporte={editingReporte}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <ReporteList
                        reportes={currentPageReportes}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                    <Pagination />
                </>
            )}
        </div>
    );
};

export default Reportes;