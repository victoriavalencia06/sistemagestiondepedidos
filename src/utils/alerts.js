import Swal from "sweetalert2";

export const alertSuccess = (title, text = "") => {
    Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#B05A2C",
    });
};

export const alertError = (title, text = "") => {
    Swal.fire({
        icon: "error",
        title,
        html: text.replace(/\n/g, "<br>"),
        confirmButtonColor: "#B05A2C",
    });
};

export const alertConfirm = async (title, text = "") => {
    return Swal.fire({
        title,
        html: text.replace(/\n/g, "<br>"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#B05A2C",
    });
};
