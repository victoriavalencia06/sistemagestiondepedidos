import React, { useState } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';

const Login = ({ isOpen, onClose, onSwitchToRegister, onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        if (!formData.email || !formData.password) {
            setAlert({
                show: true,
                message: 'Por favor, completa todos los campos',
                type: 'error'
            });
            return;
        }

        // Simular login
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u =>
            u.email === formData.email && u.password === formData.password
        );

        if (user) {
            setAlert({
                show: true,
                message: '¡Bienvenido de nuevo!',
                type: 'success'
            });

            // Guardar usuario actual
            const currentUser = {
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Resetear formulario
            setFormData({
                email: '',
                password: '',
                rememberMe: false
            });

            // Cerrar modal después de éxito
            setTimeout(() => {
                onLogin(currentUser);
                onClose();
            }, 1500);
        } else {
            setAlert({
                show: true,
                message: 'Credenciales incorrectas. Inténtalo de nuevo.',
                type: 'error'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Iniciar Sesión</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-body">
                    {alert.show && (
                        <div className={`alert alert-${alert.type} active`}>
                            {alert.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="loginEmail">Correo Electrónico</label>
                            <input
                                type="email"
                                id="loginEmail"
                                name="email"
                                className="form-control"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="loginPassword">Contraseña</label>
                            <input
                                type="password"
                                id="loginPassword"
                                name="password"
                                className="form-control"
                                placeholder="Tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label htmlFor="rememberMe">Recordarme</label>
                        </div>
                        <button type="submit" className="btn-modal">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
                <div className="modal-footer">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            onSwitchToRegister();
                        }}>
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;