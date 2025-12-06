import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup.object({
    nombre: yup.string().required("El nombre es obligatorio"),
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().min(8, "Mínimo 8 caracteres").required("La contraseña es obligatoria"),
    password_confirmation: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Debes confirmar la contraseña"),
});

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { register: registerUser } = useContext(AuthContext);

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
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);


    const onSubmit = async (data) => {
        try {
            await registerUser(
                data.nombre,
                data.email,
                data.password,
                data.password_confirmation
            );

            setAlert({
                show: true,
                type: "success",
                message: "Cuenta creada correctamente",
            });

            reset();

            setTimeout(() => onClose(), 1200);
        } catch (error) {
            setAlert({
                show: true,
                type: "error",
                message: "Error al crear tu cuenta",
            });
        }
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

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Nombre */}
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tu nombre"
                                {...register("nombre")}
                            />
                            {errors.nombre && (
                                <small className="text-danger">{errors.nombre.message}</small>
                            )}
                        </div>

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
                        <div className="form-group" style={{ position: "relative" }}>
                            <label>Contraseña</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                {...register("password")}
                            />

                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "40px",
                                    cursor: "pointer",
                                    fontSize: "22px",
                                    color: "#666",
                                    margin: "14px 4px 0 0",
                                }}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>

                            {errors.password && (
                                <small className="text-danger">{errors.password.message}</small>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group" style={{ position: "relative" }}>
                            <label>Confirmar Contraseña</label>

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                {...register("password_confirmation")}
                            />

                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "40px",
                                    cursor: "pointer",
                                    fontSize: "22px",
                                    color: "#666",
                                    margin: "14px 4px 0 0",
                                }}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>

                            {errors.password_confirmation && (
                                <small className="text-danger">{errors.password_confirmation.message}</small>
                            )}
                        </div>

                        <button type="submit" className="btn-modal" disabled={isSubmitting}>
                            {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
                        </button>
                    </form>
                </div>

                <div className="modal-footer">
                    <p>
                        ¿Ya tienes cuenta?{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchToLogin();
                            }}
                        >
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;