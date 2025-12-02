import React from 'react';

const GallerySection = () => {
    const galleryItems = [
        { id: 1, title: "Nuestro Espacio" },
        { id: 2, title: "Baristas Expertos" },
        { id: 3, title: "Pastelería Fresca" },
        { id: 4, title: "Arte Latte" },
        { id: 5, title: "Eventos Especiales" }
    ];

    return (
        <section className="gallery" id="galeria">
            <div className="container">
                <h2 className="section-title">Nuestro Espacio y Productos</h2>
                <div className="gallery-grid">
                    {galleryItems.map(item => (
                        <div className="gallery-card" key={item.id}>
                            <div className="gallery-image">
                                [Foto de {item.title}]
                            </div>
                            <div className="gallery-content">
                                <h3 className="gallery-title">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;