import React from 'react';

const Footer = () => {
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
                            <li>Sábados: 8:00 - 23:00</li>
                            <li>Domingos: 9:00 - 18:00</li>
                        </ul>
                        <h3 style={{ marginTop: '2rem' }}>Contacto</h3>
                        <ul className="footer-links">
                            <li>Tel: +503 7722 8899</li>
                            <li>Email: cafeydulces@gmail.com</li>
                        </ul>
                    </div>

                    {/* Columna 4 */}
                    <div className="footer-column">
                        <h3>Ubicación</h3>
                        <p>Calle del Café, 123<br />El Salvador</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Café & Dulces. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;