import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const WelcomeCard = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const getRoleMessage = () => {
        const userRole = user?.idRol?.toString();
        switch (userRole) {
            case "1": return 'Que tengas un excelente día gestionando el sistema.';
            case "2": return '¡Esperamos que encuentres todo lo que necesitas!';
            case "3": return 'Que tengas un gran día de trabajo.';
            default: return '¡Bienvenido al sistema de gestión de pedidos!';
        }
    };

    const getDisplayName = () => {
        return user?.nombre || user?.email?.split('@')[0] || 'Usuario';
    };

    // Formatear fecha
    const formatDate = () => {
        const date = new Date();
        const day = date.getDate();
        const monthYear = date.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });

        return { day, monthYear };
    };

    const { day, monthYear } = formatDate();

    return (
        <div className="welcome-card">
            <div className="welcome-content">
                <div className="welcome-avatar">
                    <FaUserCircle className="welcome-avatar-icon" />
                </div>

                <div className="welcome-texts">
                    <h3 className="welcome-title">
                        {getGreeting()}, {getDisplayName()}!
                    </h3>

                    <p className="welcome-subtitle">
                        {getRoleMessage()}
                    </p>
                </div>
            </div>

            <div className="welcome-date-container">
                <div className="date-day">{day}</div>
                <div className="date-month">{monthYear}</div>
            </div>
        </div>
    );
};

export default WelcomeCard;