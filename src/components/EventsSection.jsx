import React from 'react';
import { FaCoffee, FaWineGlassAlt, FaBirthdayCake } from 'react-icons/fa';

const EventsSection = () => {
    const events = [
        {
            id: 1,
            title: "Taller de Arte Latte",
            description: "Aprende las técnicas básicas para crear diseños en tu café con nuestros baristas expertos.",
            date: "Sábado 15, 10:00-12:00",
            icon: <FaCoffee size={24} />
        },
        {
            id: 2,
            title: "Cata de Cafés Especiales",
            description: "Descubre los sabores y aromas de cafés de origen único de diferentes regiones del mundo.",
            date: "Viernes 21, 18:00-20:00",
            icon: <FaWineGlassAlt size={24} />
        },
        {
            id: 3,
            title: "Noche de Postres",
            description: "Una velada especial donde presentamos nuestras nuevas creaciones de pastelería con maridajes únicos.",
            date: "Sábado 29, 19:00-22:00",
            icon: <FaBirthdayCake size={24} />
        }
    ];

    const scrollToContact = () => {
        const element = document.getElementById('contacto');
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="events" id="eventos">
            <div className="container">
                <h2 className="section-title">Eventos y Talleres</h2>
                <p className="subscription-text">Descubre nuestras actividades especiales y talleres para amantes del café</p>
                <div className="events-content">
                    {events.map(event => (
                        <div className="event-card" key={event.id}>
                            <div className="event-icon">
                                {event.icon}
                            </div>
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                            <div className="event-date">{event.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsSection;