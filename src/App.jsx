import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Páginas
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

// Componentes de páginas
import Pedido from "./pages/Pedido";
import Categoria from "./pages/Categoria";
import Producto from "./pages/Producto";
import Usuario from "./pages/Usuario";

// Componentes del dashboard
import WelcomeCard from "./components/dashboard/WelcomeCard";

export default function App() {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            {/* Página principal pública */}
            <Route
                path="/"
                element={!user ? <Home /> : <Navigate to="/dashboard" replace />}
            />

            {/* Dashboard con subrutas */}
            <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" replace />}
            >
                {/* Redirige /dashboard a /dashboard/home */}
                <Route index element={<Navigate to="/dashboard/home" replace />} />
                <Route path="home" element={<DashboardContent />} />
                <Route path="pedidos" element={<Pedido />} />
                <Route path="categorias" element={<Categoria />} />
                <Route path="productos" element={<Producto />} />
                <Route path="usuarios" element={<Usuario />} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

// Componente para el contenido del dashboard
function DashboardContent() {
    const { user } = useContext(AuthContext);
    return (
        <div className="dashboard-content-wrapper">
            <div className="row mb-4">
                <div className="col-12">
                    <WelcomeCard user={user} />
                </div>
            </div>
        </div>
    );
}