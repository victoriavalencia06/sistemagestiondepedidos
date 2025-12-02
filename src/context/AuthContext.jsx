import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario al iniciar la app (si hay token)
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("api_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await authService.me();
                setUser(data);
            } catch (error) {
                console.error("Error al obtener usuario:", error);
                localStorage.removeItem("api_token");
            }

            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        return data;
    };

    const register = async (nombre, email, password, password_confirmation) => {
        const data = await authService.register(
            nombre,
            email,
            password,
            password_confirmation
        );
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
