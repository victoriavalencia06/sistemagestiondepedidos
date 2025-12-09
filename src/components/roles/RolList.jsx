import React from 'react';
import { FaUserTag } from 'react-icons/fa';
import RolItem from './RolItem';

const RolList = ({ roles, loading }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando roles...</p>
            </div>
        );
    }

    if (!roles || roles.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaUserTag size={48} />
                </div>
                <h3 className="management-empty-title">No hay roles registrados</h3>
                <p className="management-empty-text">No hay roles disponibles en el sistema.</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Roles</h2>
                <p className="management-table-subtitle">
                    {roles.length} {roles.length === 1 ? 'rol mostrado' : 'roles mostrados'}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {roles.map((rol) => (
                            <RolItem
                                key={rol.idRol}
                                rol={rol}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RolList;