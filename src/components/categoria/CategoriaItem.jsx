import React from 'react';
import { FaTag, FaEdit, FaTrash } from 'react-icons/fa';

const CategoriaItem = ({ categoria, onEdit, onDelete }) => {
    return (
        <tr>
            <td>
                <strong>#{categoria.idCategoria}</strong>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaTag />
                        {categoria.nombre}
                    </div>
                </div>
            </td>

            <td>
                <span className={`status-badge ${categoria.estado == 1 ? 'status-active' : 'status-inactive'}`}>
                    {categoria.estado == 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(categoria)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>

                    {categoria.estado == 1 && (
                        <button
                            onClick={() => onDelete(categoria.idCategoria)}
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

export default CategoriaItem;
