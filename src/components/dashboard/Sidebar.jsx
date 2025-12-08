import React, { useContext } from "react";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaCog,
  FaTag
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({
  currentScreen,
  onNavigate,
  collapsed,
  isMobileOpen,
  onCloseMobile
}) {
  const { user } = useContext(AuthContext);

  // Función para obtener los menús según el rol
  const getMenuItems = () => {
    const userRole = user?.idRol?.toString();

    switch (userRole) {
      case "1": // Administrador
        return [
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, path: "/dashboard/home" },
          { id: "pedidos", label: "Pedidos", icon: FaShoppingCart, path: "/dashboard/pedidos" },
          { id: "categorias", label: "Categorias", icon: FaTag, path: "/dashboard/categorias" },
          { id: "productos", label: "Productos", icon: FaBox, path: "/dashboard/productos" },
          { id: "usuarios", label: "Usuarios", icon: FaUsers, path: "/dashboard/usuarios" },
        ];

      case "2": // Cliente
        return [
          { id: "dashboard", label: "Mi Panel", icon: FaTachometerAlt, path: "/dashboard/home" },
          { id: "pedidos", label: "Mis Pedidos", icon: FaShoppingCart, path: "/dashboard/pedidos" },
        ];

      case "3": // Empleado
        return [
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, path: "/dashboard/home" },
          { id: "pedidos", label: "Pedidos", icon: FaShoppingCart, path: "/dashboard/pedidos" },
          { id: "productos", label: "Productos", icon: FaBox, path: "/dashboard/productos" },
        ];

      default:
        return [
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt, path: "/dashboard/home" }
        ];
    }
  };

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

  const menuItems = getMenuItems();
  const roleName = getRoleName();

  return (
    <>
      <div className={`
        dashboard-sidebar 
        ${collapsed ? "collapsed" : ""}
        ${isMobileOpen ? "mobile-open" : ""}
      `}>

        {/* Badge con el rol del usuario */}
        {(!collapsed || isMobileOpen) && (
          <div className="dashboard-badge">{roleName}</div>
        )}

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                title={collapsed && !isMobileOpen ? item.label : ""}
              >
                <Icon className="sidebar-icon" />
                {(!collapsed || isMobileOpen) && (
                  <span className="sidebar-label">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="sidebar-footer">
          {(!collapsed || isMobileOpen) && (
            <div className="small text-muted">
              Gestión de Pedidos
            </div>
          )}
        </div>
      </div>

      {/* Overlay para móviles */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? "mobile-open" : ""}`}
        onClick={onCloseMobile}
      />
    </>
  );
}