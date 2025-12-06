import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';
import '../assets/css/Dashboard.css';

// Componentes del dashboard
import WelcomeCard from '../components/dashboard/WelcomeCard';

// Paginas
import Categoria from '../pages/Categoria';
import Pedidos from '../pages/Pedidos';
import Productos from '../pages/Productos';
import Usuarios from '../pages/Usuarios';
import NotFound from '../components/NotFound';

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // En móvil, cerrar sidebar automáticamente
            if (mobile && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }

            // En desktop, resetear estado móvil
            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileMenuOpen]);

    // Componente principal del dashboard
    const DashboardContent = () => (
        <div className="dashboard-content-wrapper">
            {/* Welcome Card */}
            <div className="row mb-4">
                <div className="col-12">
                    <WelcomeCard user={user} />
                </div>
            </div>
        </div>
    );

    // Mapa de páginas
    const pagesMap = {
        dashboard: <DashboardContent />,
        pedidos: <Pedidos />,
        categoria: <Categoria />,
        productos: <Productos />,
        usuarios: <Usuarios />,
    };

    // Navegación
    const handleNavigate = (screenId) => {
        if (pagesMap[screenId]) {
            setCurrentScreen(screenId);
        } else {
            setCurrentScreen(`not-found:${screenId}`);
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

    // Renderizar contenido
    const renderContent = () => {
        if (currentScreen.startsWith('not-found:')) {
            const missing = currentScreen.split(':')[1];
            return <NotFound currentScreen={missing} onBack={() => setCurrentScreen('dashboard')} />;
        }

        return pagesMap[currentScreen] || <NotFound currentScreen={currentScreen} onBack={() => setCurrentScreen('dashboard')} />;
    };

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
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;