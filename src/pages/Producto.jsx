// src/pages/Producto.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaBox, FaExclamationCircle } from 'react-icons/fa';
import ProductoList from '../components/producto/ProductoList';
import ProductoForm from '../components/producto/ProductoForm';
import productoService from '../services/productoService';
import '../assets/css/Management.css';
import { alertSuccess, alertError, alertConfirm } from "../utils/alerts";

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProducto, setEditingProducto] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Constante para definir stock bajo
    const STOCK_BAJO_LIMITE = 5;

    // Filtrado y paginación
    const filteredProductos = useMemo(() => {
        let result = [...productos];
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(term) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(term)) ||
                (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(term))
            );
        }
        return result;
    }, [productos, searchTerm]);

    const currentPageProductos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProductos.slice(startIndex, endIndex);
    }, [filteredProductos, currentPage, itemsPerPage]);

    const totalItems = filteredProductos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Cargar productos
    const loadProductos = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await productoService.get();
            setProductos(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los productos');
            console.error('Error cargando productos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProductos();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Handlers
    const handleCreate = () => {
        setEditingProducto(null);
        setShowForm(true);
    };

    const handleEdit = (producto) => {
        setEditingProducto(producto);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await alertConfirm(
            "¿Desactivar producto?",
            "Esta acción no lo eliminará permanentemente, solo lo marcará como inactivo."
        );

        if (!result.isConfirmed) return;

        try {
            await productoService.delete(id);
            await loadProductos();
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    const handleFormSubmit = async (productoData) => {
        try {
            if (editingProducto) {
                await productoService.update(editingProducto.idProducto || editingProducto.id, productoData);
                alertSuccess("Actualizado", "El producto fue actualizado correctamente.");
            } else {
                await productoService.create(productoData);
                alertSuccess("Creado", "El producto fue registrado exitosamente.");
            }

            setShowForm(false);
            setEditingProducto(null);
            await loadProductos();
        } catch (err) {
            alertError("Error en formulario", err.message);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingProducto(null);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Componente de paginación
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

    // Calcular estadísticas - CORREGIDO
    const stats = useMemo(() => {
        const totalProductos = productos.length;
        const productosActivos = productos.filter(p => p.estado === 1 || p.estado === true).length;

        // CORRECCIÓN: Solo productos con stock bajo y ACTIVOS
        const productosStockBajo = productos.filter(p =>
            (p.estado === 1 || p.estado === true) &&
            p.stock > 0 &&
            p.stock <= STOCK_BAJO_LIMITE
        ).length;

        // CORRECCIÓN: Solo productos con stock 0 y ACTIVOS
        const productosAgotados = productos.filter(p =>
            (p.estado === 1 || p.estado === true) &&
            p.stock === 0
        ).length;

        return {
            totalProductos,
            productosActivos,
            productosStockBajo,
            productosAgotados
        };
    }, [productos]);

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">
                    <FaBox style={{ marginRight: 8 }} />
                    Gestión de Productos
                </h1>

                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Producto
                    </button>
                )}
            </div>

            {!showForm && (
                <>
                    {/* Tarjetas de estadísticas */}
                    <div className="stats-cards">
                        <div className="stats-card stats-card-total">
                            <div className="stats-icon-circle stats-icon-circle-total">
                                <FaBox size={20} />
                            </div>
                            <h3 className="stats-card-value">{stats.totalProductos}</h3>
                            <p className="stats-card-label">Total Productos</p>
                        </div>

                        <div className="stats-card stats-card-activos">
                            <div className="stats-icon-circle stats-icon-circle-activos">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>✓</span>
                            </div>
                            <h3 className="stats-card-value">{stats.productosActivos}</h3>
                            <p className="stats-card-label">Activos</p>
                        </div>

                        <div className="stats-card stats-card-bajo-stock">
                            <div className="stats-icon-circle stats-icon-circle-bajo-stock">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>!</span>
                            </div>
                            <h3 className="stats-card-value">{stats.productosStockBajo}</h3>
                            <p className="stats-card-label">Stock Bajo (≤ {STOCK_BAJO_LIMITE})</p>
                        </div>

                        <div className="stats-card stats-card-agotados">
                            <div className="stats-icon-circle stats-icon-circle-agotados">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>×</span>
                            </div>
                            <h3 className="stats-card-value">{stats.productosAgotados}</h3>
                            <p className="stats-card-label">Agotados</p>
                        </div>
                    </div>

                    <div className="management-filters">
                        <div className="search-input">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, descripción o categoría..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                </>
            )}

            {error && (
                <div className="alert-message alert-error">
                    <FaExclamationCircle />
                    {error}
                </div>
            )}

            {showForm ? (
                <ProductoForm
                    producto={editingProducto}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <ProductoList
                        productos={currentPageProductos}
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

export default Producto;