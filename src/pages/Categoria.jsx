import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import CategoriaList from '../components/categoria/CategoriaList';
import CategoriaForm from '../components/categoria/CategoriaForm';
import categoriaService from '../services/categoriaService';
import '../assets/css/Management.css';
import { alertSuccess, alertError, alertConfirm } from "../utils/alerts";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Filtrado y paginación
    const filteredCategorias = useMemo(() => {
        let result = [...categorias];
        if (searchTerm.trim() !== '') {
            result = result.filter(c =>
                c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [categorias, searchTerm]);

    const currentPageCategorias = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCategorias.slice(startIndex, endIndex);
    }, [filteredCategorias, currentPage, itemsPerPage]);

    const totalItems = filteredCategorias.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Cargar categorías
    const loadCategorias = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await categoriaService.get();
            setCategorias(data);
        } catch (err) {
            setError(err.message || 'Error al cargar las categorías');
            console.error('Error cargando categorías:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategorias();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Handlers
    const handleCreate = () => {
        setEditingCategoria(null);
        setShowForm(true);
    };

    const handleEdit = (categoria) => {
        setEditingCategoria(categoria);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await alertConfirm(
            "¿Desactivar categoría?",
            "Esta acción no la eliminará permanentemente, solo la marcará como inactiva."
        );

        if (!result.isConfirmed) return;

        try {
            await categoriaService.delete(id);
            alertSuccess("Categoría desactivada", "La categoría ahora está inactiva.");
            await loadCategorias();
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    const handleFormSubmit = async (categoriaData) => {
        try {
            if (editingCategoria) {
                await categoriaService.update(editingCategoria.idCategoria, categoriaData);
                alertSuccess("Actualizado", "La categoría fue actualizada correctamente.");
            } else {
                await categoriaService.create(categoriaData);
                alertSuccess("Creado", "La categoría fue registrada exitosamente.");
            }

            setShowForm(false);
            setEditingCategoria(null);
            await loadCategorias();
        } catch (err) {
            alertError("Error en formulario", err.message);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategoria(null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Componente de paginación simple
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="management-pagination">
                <div className="pagination-info">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
                </div>

                <div className="pagination-controls">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    <div className="pagination-numbers">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
                <h1 className="management-title">Gestión de Categorías</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nueva Categoría
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
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

            {showForm ? (
                <CategoriaForm
                    categoria={editingCategoria}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <CategoriaList
                        categorias={currentPageCategorias}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <Pagination />
                </>
            )}
        </div>
    );
};

export default Categorias;