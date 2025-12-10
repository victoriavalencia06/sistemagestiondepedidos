import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/css/Dashboard.css';

// Paginas - Ya no las importamos aquí, se manejan por rutas
import NotFound from '../components/NotFound';

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            if (mobile && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }

            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);

    // Obtener pantalla actual de la URL
    const getCurrentScreen = () => {
        const path = location.pathname;
        if (path.includes('/dashboard/pedidos')) return 'pedidos';
        if (path.includes('/dashboard/categorias')) return 'categorias';
        if (path.includes('/dashboard/productos')) return 'productos';
        if (path.includes('/dashboard/usuarios')) return 'usuarios';
        if (path.includes('/dashboard/roles')) return 'roles';
        if (path.includes('/dashboard/reportes')) return 'reportes';
        if (path.includes('/dashboard/home')) return 'dashboard';
        return 'dashboard';
    };

    // Navegación usando React Router
    const handleNavigate = (screenId) => {
        switch(screenId) {
            case 'dashboard':
                navigate('/dashboard/home');
                break;
            case 'pedidos':
                navigate('/dashboard/pedidos');
                break;
            case 'categorias':
                navigate('/dashboard/categorias');
                break;
            case 'productos':
                navigate('/dashboard/productos');
                break;
            case 'usuarios':
                navigate('/dashboard/usuarios');
                break;
            case 'roles':
                navigate('/dashboard/roles');
                break;
            case 'reportes':
                navigate('/dashboard/reportes');
                break;
            default:
                navigate('/dashboard/home');
        }

        // En móvil, cerrar sidebar después de navegar
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeMobileSidebar = () => {
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    };

    const handleLogout = () => logout();

    // Determinar estado del sidebar
    const isSidebarCollapsed = isMobile ? !mobileMenuOpen : sidebarCollapsed;
    const currentScreen = getCurrentScreen();

    return (
        <div className={`dashboard-root ${isSidebarCollapsed && !isMobile ? "sidebar-collapsed" : ""}`}>
            <Sidebar
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                collapsed={isSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                onCloseMobile={closeMobileSidebar}
            />

            <div className="dashboard-main">
                <Topbar
                    onLogout={handleLogout}
                    collapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    currentScreen={currentScreen}
                    userName={user?.nombre}
                />

                <main className="dashboard-content">
                    {/* Outlet renderiza las subrutas definidas en App.js */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Dashboard;