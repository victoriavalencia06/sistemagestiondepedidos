import client from "../api/client";
import { alertError } from "../utils/alerts";

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

const categoriaService = {
    get: async () => {
        try {
            const response = await client.get("/categoria");
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudieron cargar las categorías.");
            throw error.response?.data || new Error("Error al obtener categorías");
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/categoria/${id}`);
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudo cargar la categoría.");
            throw error.response?.data || new Error("Error al obtener categoría");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/categoria", data, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al crear categoría", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/categoria/${id}`, data);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al actualizar categoría", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    delete: async (id) => {
        try {
            const response = await client.delete(`/categoria/${id}`);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const message =
                apiData?.message || "La categoría no puede eliminarse porque tiene productos activos.";

            alertError("No se puede eliminar", message);

            throw new Error(message);
        }
    },
};

export default categoriaService;
