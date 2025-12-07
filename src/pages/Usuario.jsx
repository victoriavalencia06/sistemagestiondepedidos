import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaSearch, FaUser, FaExclamationCircle } from 'react-icons/fa';
import UsuarioList from '../components/usuario/UsuarioList';
import UsuarioForm from '../components/usuario/UsuarioForm';
import usuarioService from '../services/usuarioService';
import '../assets/css/Management.css';
import { alertSuccess, alertError, alertConfirm } from "../utils/alerts";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Filtrado y paginación
    const filteredUsuarios = useMemo(() => {
        let result = [...usuarios];
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.nombre.toLowerCase().includes(term) ||
                u.apellido.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                (u.telefono && u.telefono.includes(term)) ||
                (u.rol && u.rol.toLowerCase().includes(term))
            );
        }
        return result;
    }, [usuarios, searchTerm]);

    const currentPageUsuarios = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsuarios.slice(startIndex, endIndex);
    }, [filteredUsuarios, currentPage, itemsPerPage]);

    const totalItems = filteredUsuarios.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Cargar usuarios
    const loadUsuarios = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await usuarioService.get();
            setUsuarios(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los usuarios');
            console.error('Error cargando usuarios:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Handlers
    const handleCreate = () => {
        setEditingUsuario(null);
        setShowForm(true);
    };

    const handleEdit = (usuario) => {
        setEditingUsuario(usuario);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await alertConfirm(
            "¿Desactivar usuario?",
            "Esta acción no lo eliminará permanentemente, solo lo marcará como inactivo y no podrá acceder al sistema."
        );

        if (!result.isConfirmed) return;

        try {
            await usuarioService.delete(id);
            alertSuccess("Usuario desactivado", "El usuario ahora está inactivo.");
            await loadUsuarios();
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    const handleFormSubmit = async (usuarioData) => {
        try {
            if (editingUsuario) {
                await usuarioService.update(editingUsuario.idUsuario, usuarioData);
                alertSuccess("Actualizado", "El usuario fue actualizado correctamente.");
            } else {
                await usuarioService.create(usuarioData);
                alertSuccess("Creado", "El usuario fue registrado exitosamente.");
            }

            setShowForm(false);
            setEditingUsuario(null);
            await loadUsuarios();
        } catch (err) {
            alertError("Error en formulario", err.message);
            throw err;
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUsuario(null);
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
                <h1 className="management-title">
                    <FaUser style={{ marginRight: 8 }} />
                    Gestión de Usuarios
                </h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-management">
                        <FaPlus style={{ marginRight: 6 }} /> Nuevo Usuario
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="management-filters">
                    <div className="search-input">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email, teléfono..."
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
                <UsuarioForm
                    usuario={editingUsuario}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    <UsuarioList
                        usuarios={currentPageUsuarios}
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

export default Usuarios;