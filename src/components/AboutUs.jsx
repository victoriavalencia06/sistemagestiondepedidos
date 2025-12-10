import React from 'react';

const AboutUs = () => {
    return (
        <section className="about" id="sobre-nosotros">
            <div className="container">
                <h2 className="section-title">Sobre Nosotros</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>En Café & Dulces, nos apasiona crear experiencias memorables a través del café y la repostería.
                            Desde nuestra apertura en 2015, hemos trabajado incansablemente para ofrecer productos de la más
                            alta calidad en un ambiente cálido y acogedor.</p>
                        <p>Nuestros baristas están capacitados en las técnicas más modernas de preparación de café, mientras
                            que nuestros pasteleros combinan recetas tradicionales con toques innovadores para crear postres
                            únicos que deleitan todos los sentidos.</p>
                    </div>
                    <div className="about-image">
                        <img src="https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/sobreNosotros.png" alt="Nuestro local" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;