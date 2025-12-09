import React from 'react';
import { FaUserTag } from 'react-icons/fa';

const RolItem = ({ rol }) => {
    return (
        <tr>
            <td>
                <strong>#{rol.idRol}</strong>
            </td>

            <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="role-badge">
                        <FaUserTag />
                        {rol.nombre}
                    </div>
                </div>
            </td>

            <td>
                <span className={`status-badge ${rol.estado == 1 ? 'status-active' : 'status-inactive'}`}>
                    {rol.estado == 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
        </tr>
    );
};

export default RolItem;
