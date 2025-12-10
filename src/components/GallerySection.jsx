import React from 'react';

const GallerySection = () => {
    const galleryItems = [
        {
            id: 1,
            title: "Nuestro Espacio",
            img: 'https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/gallerySection/nuestroEspacio.png'
        },
        {
            id: 2,
            title: "Baristas Expertos",
            img: 'https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/gallerySection/baristas.png'
        },
        {
            id: 3,
            title: "Pastelería Fresca",
            img: 'https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/gallerySection/pasteleria.png'
        },
        {
            id: 4,
            title: "Arte Latte",
            img: 'https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/gallerySection/arteLatte.png'
        },
        {
            id: 5,
            title: "Eventos Especiales",
            img: 'https://raw.githubusercontent.com/victoriavalencia06/project-images/refs/heads/main/coffeeShop/gallerySection/eventos.png'
        }
    ];

    return (
        <section className="gallery" id="galeria">
            <div className="container">
                <h2 className="section-title">Nuestro Espacio y Productos</h2>
                <div className="gallery-grid">
                    {galleryItems.map(item => (
                        <div className="gallery-card" key={item.id}>
                            <div className="gallery-image">
                                <img src={item.img} alt={item.title} />
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