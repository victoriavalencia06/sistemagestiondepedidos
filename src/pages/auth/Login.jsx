import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup.object({
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria"),
});

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [alert, setAlert] = React.useState({ show: false, type: "", message: "" });
    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate("/dashboard");

            setAlert({
                show: true,
                message: "Inicio de sesión exitoso",
                type: "success",
            });

            reset();

            setTimeout(() => onClose(), 1200);
        } catch (error) {
            setAlert({
                show: true,
                message: "Credenciales incorrectas",
                type: "error",
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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Email */}
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="email@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <small className="text-danger">{errors.email.message}</small>
                            )}
                        </div>

                        {/* Password */}
                        {/* Password */}
                        <div className="form-group" style={{ position: "relative" }}>
                            <label>Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Tu contraseña"
                                {...register("password")}
                            />

                            {/* Botón para mostrar/ocultar */}
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "38px",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#666"
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>

                            {errors.password && (
                                <small className="text-danger">{errors.password.message}</small>
                            )}
                        </div>


                        <button type="submit" className="btn-modal" disabled={isSubmitting}>
                            {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>

                <div className="modal-footer">
                    <p>
                        ¿No tienes cuenta?{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchToRegister();
                            }}
                        >
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;