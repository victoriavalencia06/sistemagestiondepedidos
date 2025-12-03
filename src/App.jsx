import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Páginas
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            {/* Página principal pública */}
            <Route
                path="/"
                element={!user ? <Home /> : <Navigate to="/dashboard" replace />}
            />

            {/* Dashboard solo si estás logueado */}
            <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" replace />}
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
