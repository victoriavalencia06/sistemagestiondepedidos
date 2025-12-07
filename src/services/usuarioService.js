import client from "../api/client";
import { alertError, alertSuccess } from "../utils/alerts";

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

const usuarioService = {
    get: async () => {
        try {
            const response = await client.get("/usuario");
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudieron cargar los usuarios.");
            throw error.response?.data || new Error("Error al obtener usuarios");
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/usuario/${id}`);
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudo cargar el usuario.");
            throw error.response?.data || new Error("Error al obtener usuario");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/usuario", data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Usuario creado", "El usuario fue registrado exitosamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al crear usuario", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/usuario/${id}`, data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Usuario actualizado", "El usuario fue actualizado correctamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al actualizar usuario", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    delete: async (id) => {
        try {
            const response = await client.delete(`/usuario/${id}`);

            alertSuccess("Usuario desactivado", "El usuario fue desactivado correctamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al desactivar el usuario.";

            alertError("No se puede desactivar", message);

            throw new Error(message);
        }
    }
};

export default usuarioService;