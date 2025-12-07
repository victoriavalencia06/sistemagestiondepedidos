// src/components/productos/ProductoItem.jsx
import React from "react";
import { FaBox, FaTag, FaEdit, FaTrash } from "react-icons/fa";

const ProductoItem = ({ producto, onEdit, onDelete }) => {
    return (
        <tr>
            <td><strong>#{producto.idProducto}</strong></td>

            <td>
                <div className="role-badge">
                    <FaBox /> {producto.nombre}
                </div>
            </td>

            <td>${producto.precio.toFixed(2)}</td>
            <td>{producto.stock}</td>

            <td>
                <span className={`status-badge ${producto.estado ? "status-active" : "status-inactive"}`}>
                    {producto.estado ? "Activo" : "Inactivo"}
                </span>
            </td>

            <td>
                <div className="role-actions">
                    <button onClick={() => onEdit(producto)} className="btn-management btn-management-secondary">
                        <FaEdit /> Editar
                    </button>

                    {producto.estado && (
                        <button
                            onClick={() => onDelete(producto.idProducto)}
                            className="btn-management btn-management-danger"
                        >
                            <FaTrash /> Desactivar
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ProductoItem;
