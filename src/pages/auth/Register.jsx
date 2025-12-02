import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const Register = ({ isOpen, onClose, onSwitchToLogin, onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
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

        // Validaciones
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setAlert({
                show: true,
                message: 'Por favor, completa todos los campos',
                type: 'error'
            });
            return;
        }

        if (formData.password.length < 8) {
            setAlert({
                show: true,
                message: 'La contraseña debe tener al menos 8 caracteres',
                type: 'error'
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setAlert({
                show: true,
                message: 'Las contraseñas no coinciden',
                type: 'error'
            });
            return;
        }

        if (!formData.acceptTerms) {
            setAlert({
                show: true,
                message: 'Debes aceptar los términos y condiciones',
                type: 'error'
            });
            return;
        }

        // Verificar si el usuario ya existe
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === formData.email);

        if (existingUser) {
            setAlert({
                show: true,
                message: 'Este correo ya está registrado',
                type: 'error'
            });
            return;
        }

        // Registrar nuevo usuario
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        setAlert({
            show: true,
            message: `¡Cuenta creada con éxito! Bienvenido/a ${formData.name}`,
            type: 'success'
        });

        // Resetear formulario
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        });

        // Cerrar modal después de éxito
        setTimeout(() => {
            const currentUser = {
                name: newUser.name,
                email: newUser.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            onRegister(currentUser);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Crear Cuenta</h3>
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
                            <label htmlFor="registerName">Nombre Completo</label>
                            <input
                                type="text"
                                id="registerName"
                                name="name"
                                className="form-control"
                                placeholder="Tu nombre completo"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="registerEmail">Correo Electrónico</label>
                            <input
                                type="email"
                                id="registerEmail"
                                name="email"
                                className="form-control"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="registerPassword">Contraseña</label>
                            <input
                                type="password"
                                id="registerPassword"
                                name="password"
                                className="form-control"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="8"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Repite tu contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-modal">
                            Crear Cuenta
                        </button>
                    </form>
                </div>
                <div className="modal-footer">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            onSwitchToLogin();
                        }}>
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;