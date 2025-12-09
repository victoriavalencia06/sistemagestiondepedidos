import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaExclamationCircle, FaUserTag } from 'react-icons/fa';
import RolList from '../components/roles/RolList';
import rolService from '../services/rolService';
import '../assets/css/Management.css';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Filtrado y paginación
    const filteredRoles = useMemo(() => {
        let result = [...roles];
        if (searchTerm.trim() !== '') {
            result = result.filter(r =>
                (r.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return result;
    }, [roles, searchTerm]);

    const currentPageRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredRoles.slice(startIndex, endIndex);
    }, [filteredRoles, currentPage, itemsPerPage]);

    const totalItems = filteredRoles.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Cargar roles
    const loadRoles = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await rolService.get();
            setRoles(data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar los roles');
            console.error('Error cargando roles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h1 className="management-title">
                    <FaUserTag style={{ marginRight: 8 }} />
                    Gestión de Roles
                </h1>
            </div>

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

            {error && (
                <div className="alert-message alert-error">
                    <FaExclamationCircle />
                    {error}
                </div>
            )}

            <RolList
                roles={currentPageRoles}
                loading={loading}
            />

        </div>
    );
};

export default Roles;
