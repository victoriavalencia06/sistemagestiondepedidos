import React from 'react';
import { FaTag } from 'react-icons/fa';
import CategoriaItem from './CategoriaItem';

const CategoriaList = ({ categorias, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando categorías...</p>
            </div>
        );
    }

    if (categorias.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaTag size={48} />
                </div>
                <h3 className="management-empty-title">No hay categorías registradas</h3>
                <p className="management-empty-text">Comienza creando la primera categoría en el sistema</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Categorías</h2>
                <p className="management-table-subtitle">
                    {categorias.length} {categorias.length === 1 ? 'categoría registrada' : 'categorías registradas'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre de la Categoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categorias.map((categoria) => (
                            <CategoriaItem
                                key={categoria.idCategoria}
                                categoria={categoria}
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

export default CategoriaList;