import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import AboutUs from '../components/AboutUs';
import GallerySection from '../components/GallerySection';
import EventsSection from '../components/EventsSection';
import Footer from '../components/Footer';
import Login from './auth/Login';
import Register from './auth/Register';
import '../index.css';

const Home = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Efecto para manejar scroll al cargar
    useEffect(() => {
        const handleAnchorClick = (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const element = document.getElementById(href.substring(1));
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        };

        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', handleAnchorClick);
        });

        return () => {
            anchorLinks.forEach(link => {
                link.removeEventListener('click', handleAnchorClick);
            });
        };
    }, []);

    // Cerrar menú hamburguesa al cambiar tamaño de ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = (userData) => {
        setCurrentUser(userData);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const handleRegister = (userData) => {
        setCurrentUser(userData);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    const handleOpenRegisterFromEvents = () => {
        setIsRegisterModalOpen(true);
    };

    return (
        <div className="App">
            {/* Alert de éxito */}
            {showSuccessAlert && (
                <div className="alert alert-success" style={{
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    zIndex: '10000',
                    padding: '1rem',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow)'
                }}>
                    ¡Bienvenido/a {currentUser?.name}!
                </div>
            )}

            <Header
                currentUser={currentUser}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onOpenRegister={() => setIsRegisterModalOpen(true)}
                onLogout={handleLogout}
                isMenuOpen={isMenuOpen}
                onToggleMenu={setIsMenuOpen}
            />

            {/* Hero Section */}
            <section className="hero" id="inicio">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">Café & Dulces — Sabor que abraza</h1>
                            <p className="hero-subtitle">
                                Cafés artesanales, pastelería fresca y un lugar para relajarte.
                            </p>
                            <div className="hero-buttons">
                                <button className="btn btn-primary" onClick={() => scrollToSection('menu')}>
                                    Ver menú
                                </button>
                            </div>
                        </div>
                        <div className="hero-image">
                        </div>
                    </div>
                </div>
            </section>

            <MenuSection />
            <AboutUs />
            <GallerySection />

            <EventsSection />

            <Footer />

            {/* Modales */}
            <Login
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginModalOpen(false);
                    setIsRegisterModalOpen(true);
                }}
                onLogin={handleLogin}
            />

            <Register
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
                onRegister={handleRegister}
            />
        </div>
    );
};

export default Home;