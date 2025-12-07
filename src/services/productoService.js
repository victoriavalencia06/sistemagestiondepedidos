import client from "../api/client";
import Swal from "sweetalert2";

// Extrae mensajes de validación de Laravel
function extractValidationMessages(apiData) {
    const msgs = [];
    const errors = apiData?.errors;

    if (!errors) {
        if (apiData?.message) msgs.push(apiData.message);
        return msgs;
    }

    for (const key of Object.keys(errors)) {
        const arr = errors[key];
        if (Array.isArray(arr)) arr.forEach(m => msgs.push(`${key}: ${m}`));
        else msgs.push(`${key}: ${String(arr)}`);
    }

    return msgs;
}

const productoService = {
    get: async () => {
        try {
            const res = await client.get("/producto");
            return res.data;
        } catch (e) {
            throw e.response?.data || new Error("Error al obtener productos");
        }
    },

    getById: async (id) => {
        try {
            const res = await client.get(`/producto/${id}`);
            return res.data;
        } catch (e) {
            throw e.response?.data || new Error("Error al obtener producto");
        }
    },

    create: async (data) => {
        try {
            const res = await client.post("/producto", data, {
                headers: { "Content-Type": "application/json" }
            });
            Swal.fire("Éxito", "Producto registrado correctamente", "success");
            return res.data;
        } catch (e) {
            const api = e.response?.data;
            const msgs = extractValidationMessages(api);
            Swal.fire("Error", msgs.join("<br>"), "error");
            throw new Error(msgs.join("\n"));
        }
    },

    update: async (id, data) => {
        try {
            const res = await client.put(`/producto/${id}`, data, {
                headers: { "Content-Type": "application/json" }
            });
            Swal.fire("Actualizado", "Producto actualizado", "success");
            return res.data;
        } catch (e) {
            const api = e.response?.data;
            const msgs = extractValidationMessages(api);
            Swal.fire("Error", msgs.join("<br>"), "error");
            throw new Error(msgs.join("\n"));
        }
    },

    delete: async (id) => {
        try {
            const res = await client.delete(`/producto/${id}`);
            Swal.fire("Desactivado", "Producto desactivado", "warning");
            return res.data;
        } catch (e) {
            Swal.fire("Error", "No se puede eliminar el producto", "error");
            throw e.response?.data;
        }
    }
};

export default productoService;