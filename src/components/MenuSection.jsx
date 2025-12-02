import React from 'react';

const MenuSection = () => {
    const menuItems = [
        {
            id: 1,
            title: "Cappuccino Artesanal",
            description: "Café espresso con leche vaporizada y una capa de espuma cremosa, decorado con arte latte.",
            price: "$4.50"
        },
        {
            id: 2,
            title: "Croissant de Almendra",
            description: "Hojaldre crujiente relleno de crema de almendras y espolvoreado con azúcar glass.",
            price: "$3.75"
        },
        {
            id: 3,
            title: "Tarta de Queso",
            description: "Nuestra especialidad: base de galleta, cremosa mezcla de queso y topping de frutos rojos.",
            price: "$5.20"
        }
    ];

    return (
        <section className="menu" id="menu">
            <div className="container">
                <h2 className="section-title">Nuestro Menú Destacado</h2>
                <div className="menu-grid">
                    {menuItems.map(item => (
                        <div className="menu-card" key={item.id}>
                            <div className="menu-image">
                                [Imagen de {item.title}]
                            </div>
                            <div className="menu-content">
                                <h3 className="menu-title">{item.title}</h3>
                                <p className="menu-description">{item.description}</p>
                                <div className="menu-price">{item.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenuSection;