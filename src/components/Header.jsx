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
            // Cerrar menú en móvil
            if (isMobile) {
                onToggleMenu(false);
            }
            
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
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
                    <button
                        className="hamburger"
                        onClick={() => onToggleMenu(!isMenuOpen)}
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className="logo">Café & Dulces</div>

                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
                        <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menú</a></li>
                        <li><a href="#sobre-nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('sobre-nosotros'); }}>Sobre nosotros</a></li>
                        <li><a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection('galeria'); }}>Galería</a></li>
                        <li><a href="#eventos" onClick={(e) => { e.preventDefault(); scrollToSection('eventos'); }}>Eventos</a></li>
                        <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
                        
                        {/* Botones de autenticación solo en menú móvil */}
                        {isMobile && !currentUser && (
                            <div className="mobile-auth-buttons">
                                <button className="login-btn" onClick={() => {
                                    onToggleMenu(false);
                                    onOpenLogin();
                                }}>
                                    Iniciar sesión
                                </button>
                                <button className="register-btn" onClick={() => {
                                    onToggleMenu(false);
                                    onOpenRegister();
                                }}>
                                    Registrarse
                                </button>
                            </div>
                        )}
                        
                        {/* User menu en móvil */}
                        {isMobile && currentUser && (
                            <div className="mobile-auth-buttons">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span>{currentUser.name || 'Usuario'}</span>
                                </div>
                                <button className="logout-btn" onClick={() => {
                                    onToggleMenu(false);
                                    handleLogout();
                                }} title="Cerrar sesión">
                                    <FaSignOutAlt /> Cerrar sesión
                                </button>
                            </div>
                        )}
                    </ul>

                    {/* Botones de auth solo en desktop */}
                    {!isMobile && (currentUser ? (
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
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;