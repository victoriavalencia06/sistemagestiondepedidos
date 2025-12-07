import React from 'react';
import { FaUser, FaEdit, FaTrash, FaEnvelope, FaUserTag } from 'react-icons/fa';

const UsuarioItem = ({ usuario, onEdit, onDelete }) => {
    // Función para obtener el nombre del rol basado en idRol
    const getRoleName = (idRol) => {
        const roles = {
            1: "Administrador",
            2: "Cliente",
            3: "Empleado"
        };
        return roles[idRol] || `Rol ${idRol}`;
    };

    const roleName = getRoleName(usuario.idRol);

    return (
        <tr>
            <td>
                <strong>#{usuario.idUsuario}</strong>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUser style={{ marginRight: '6px' }} />
                        <div>
                            <div>{usuario.nombre}</div>
                        </div>
                    </div>
                </div>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {roleName}
                </div>
            </td>

            <td>
                <span className={`status-badge ${usuario.estado == 1 ? 'status-active' : 'status-inactive'}`}>
                    {usuario.estado == 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button
                        onClick={() => onEdit(usuario)}
                        className="btn-management btn-management-secondary"
                    >
                        <FaEdit />
                        Editar
                    </button>

                    {usuario.estado == 1 && (
                        <button
                            onClick={() => onDelete(usuario.idUsuario)}
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

export default UsuarioItem;