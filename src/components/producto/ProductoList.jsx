// src/components/productos/ProductoList.jsx
import React from "react";
import { FaBox } from "react-icons/fa";
import ProductoItem from "./ProductoItem";

const ProductoList = ({ productos, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="management-loading">
                <div className="loading-spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="management-empty">
                <div className="management-empty-icon">
                    <FaBox size={48} />
                </div>
                <h3 className="management-empty-title">No hay productos registrados</h3>
                <p className="management-empty-text">Agrega un producto para comenzar</p>
            </div>
        );
    }

    return (
        <div className="management-table-container">
            <div className="management-table-header">
                <h2 className="management-table-title">Lista de Productos</h2>
                <p className="management-table-subtitle">
                    {productos.length} {productos.length === 1 ? "producto registrado" : "productos registrados"}
                </p>
            </div>

            <div className="table-responsive">
                <table className="management-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {productos.map((p) => (
                            <ProductoItem
                                key={p.idProducto}
                                producto={p}
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

export default ProductoList;
