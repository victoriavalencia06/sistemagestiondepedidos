import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Header = ({
    onOpenLogin,
    onOpenRegister,
    currentUser,
    onLogout,
    isMenuOpen,
    onToggleMenu
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        
        if (element) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 100;
            
            // Usar scrollIntoView que es más fiable
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            if (isMobile) {
                onToggleMenu(false);
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            onLogout();
        }
    };

    return (
        <header>
            <div className="container">
                <div className="header-content">
                    <div className="logo">Café & Dulces</div>

                    <div
                        className="hamburger"
                        onClick={() => onToggleMenu(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
                        <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menú</a></li>
                        <li><a href="#sobre-nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('sobre-nosotros'); }}>Sobre nosotros</a></li>
                        <li><a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection('galeria'); }}>Galería</a></li>
                        <li><a href="#eventos" onClick={(e) => { e.preventDefault(); scrollToSection('eventos'); }}>Eventos</a></li>
                        <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
                    </ul>

                    {currentUser ? (
                        <div className="user-menu">
                            <div className="user-info">
                                <div className="user-avatar">
                                    {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span>{currentUser.name || 'Usuario'}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="login-btn" onClick={onOpenLogin}>
                                Iniciar sesión
                            </button>
                            <button className="register-btn" onClick={onOpenRegister}>
                                Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;