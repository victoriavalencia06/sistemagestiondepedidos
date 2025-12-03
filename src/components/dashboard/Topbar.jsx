import React, { useState, useContext, useEffect, useRef } from "react";
import {
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaBars,
    FaShoppingCart,
    FaCog,
    FaEnvelope
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ onLogout, collapsed, onToggle, currentScreen, userName }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user } = useContext(AuthContext);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    // Función para obtener el nombre del rol
    const getRoleName = () => {
        const userRole = user?.idRol?.toString();
        switch (userRole) {
            case "1": return "Administrador";
            case "2": return "Cliente";
            case "3": return "Empleado";
            default: return "Usuario";
        }
    };

    // Función para obtener el nombre del usuario
    const getUserName = () => {
        return userName || user?.nombre || user?.email?.split('@')[0] || "Usuario";
    };

    // Función para obtener el email
    const getUserEmail = () => {
        return user?.email || "usuario@sistemapedidos.com";
    };

    const handleLogout = () => {
        setShowUserMenu(false);
        onLogout();
    };

    return (
        <header className="dashboard-topbar">
            <div className="topbar-left">
                <button className="menu-toggle-btn" onClick={onToggle} title="Menú">
                    <FaBars />
                </button>
                <div className="topbar-brand">
                    <div className="brand-dot small">
                        <FaShoppingCart className="brand-icon" />
                    </div>
                    <span className="brand-name">Gestión Pedidos</span>
                </div>
                <h1 className="current-page-title">
                    {getCurrentPageTitle(currentScreen)}
                </h1>
            </div>

            <div className="topbar-right">
                {/* Dropdown de usuario */}
                <div className="dropdown" ref={dropdownRef}>
                    <button
                        className="icon-btn"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        title="Perfil de usuario"
                        aria-expanded={showUserMenu}
                        aria-haspopup="true"
                    >
                        <FaUserCircle />
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                className="dropdown-backdrop show"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className={`dropdown-menu ${showUserMenu ? 'show' : ''}`}>
                                {/* Header del dropdown */}
                                <div className="dropdown-header">
                                    <div className="dropdown-header-content">
                                        <FaUserCircle className="dropdown-header-icon" />
                                        <div className="dropdown-user-info">
                                            <div className="dropdown-user-name">
                                                {getUserName()}
                                            </div>
                                            <div className="dropdown-user-role">
                                                {getRoleName()}
                                            </div>
                                            <div className="dropdown-user-email">
                                                {getUserEmail()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    className="dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt className="dropdown-item-icon" />
                                    <span className="dropdown-item-text">Cerrar Sesión</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// Función helper para obtener el título de la página actual
function getCurrentPageTitle(currentScreen) {
    const titles = {
        'dashboard': 'Dashboard',
        'pedidos': 'Pedidos',
        'productos': 'Productos',
        'usuarios': 'Usuarios',
        'categorias': 'Categorías',
        'inventario': 'Inventario',
        'reportes': 'Reportes',
        'configuracion': 'Configuración',
    };
    return titles[currentScreen] || 'Dashboard';
}