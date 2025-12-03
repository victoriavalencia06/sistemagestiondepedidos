import React, { useContext } from "react";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaCog,
  FaClipboardList,
  FaUserTie,
  FaUser
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
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
          { id: "pedidos", label: "Pedidos", icon: FaShoppingCart },
          { id: "productos", label: "Productos", icon: FaBox },
          { id: "usuarios", label: "Usuarios", icon: FaUsers },
          { id: "configuracion", label: "Configuración", icon: FaCog }
        ];

      case "2": // Cliente
        return [
          { id: "dashboard", label: "Mi Panel", icon: FaTachometerAlt },
          { id: "pedidos", label: "Mis Pedidos", icon: FaShoppingCart },
          { id: "productos", label: "Catálogo", icon: FaBox },
        ];

      case "3": // Empleado
        return [
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
          { id: "pedidos", label: "Pedidos", icon: FaShoppingCart },
          { id: "productos", label: "Productos", icon: FaBox },
        ];

      default:
        return [
          { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt }
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

  // Función para manejar clic en items
  const handleItemClick = (screenId) => {
    onNavigate(screenId);
    // En móvil, cerrar sidebar después de navegar
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

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
                onClick={() => handleItemClick(item.id)}
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