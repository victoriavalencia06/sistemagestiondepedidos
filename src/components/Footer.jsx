import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <footer id="contacto">
            <div className="container">
                <div className="footer-content">
                    {/* Columna 1 */}
                    <div className="footer-column">
                        <h3>Café & Dulces</h3>
                        <p>Tu lugar favorito para disfrutar del mejor café y los postres más deliciosos en un ambiente acogedor.</p>
                        <div className="social-icons">
                            <a href="#" className="social-icon" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="social-icon" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-icon" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div className="footer-column">
                        <h3>Enlaces Rápidos</h3>
                        <ul className="footer-links">
                            <li><a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>Inicio</a></li>
                            <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menú</a></li>
                            <li><a href="#sobre-nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('sobre-nosotros'); }}>Sobre Nosotros</a></li>
                            <li><a href="#galeria" onClick={(e) => { e.preventDefault(); scrollToSection('galeria'); }}>Galería</a></li>
                            <li><a href="#eventos" onClick={(e) => { e.preventDefault(); scrollToSection('eventos'); }}>Eventos</a></li>
                            <li><a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>Contacto</a></li>
                        </ul>
                    </div>

                    {/* Columna 3 */}
                    <div className="footer-column">
                        <h3>Horario</h3>
                        <ul className="footer-links">
                            <li>Lunes - Viernes: 7:00 - 20:00</li>
                            <li>Sábados: 8:00 - 21:00</li>
                            <li>Domingos: 9:00 - 18:00</li>
                        </ul>
                        <h3 style={{ marginTop: '2rem' }}>Contacto</h3>
                        <ul className="footer-links">
                            <li>Tel: +34 912 345 678</li>
                            <li>Email: hola@cafeydulces.com</li>
                        </ul>
                    </div>

                    {/* Columna 4 */}
                    <div className="footer-column">
                        <h3>Ubicación</h3>
                        <p>Calle del Café, 123<br />28001 Madrid, España</p>
                        <div className="footer-map">
                            [Mapa pequeño o enlace]
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2023 Café & Dulces. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;