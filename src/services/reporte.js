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

const reporteService = {
    get: async () => {
        try {
            const response = await client.get("/reporte");
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudieron cargar los reportes.");
            throw error.response?.data || new Error("Error al obtener reportes");
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/reporte/${id}`);
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudo cargar el reporte.");
            throw error.response?.data || new Error("Error al obtener reporte");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/reporte", data, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al crear reporte", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message || "Error al crear reporte");
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/reporte/${id}`, data);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al actualizar reporte", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message || "Error al actualizar reporte");
        }
    },

    delete: async (id) => {
        try {
            const response = await client.delete(`/reporte/${id}`);
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "No se pudo desactivar el reporte.";

            alertError("No se puede desactivar", message);

            throw new Error(message);
        }
    },
};

export default reporteService;
