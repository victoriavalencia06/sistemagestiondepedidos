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

const pedidoService = {
    get: async () => {
        try {
            const response = await client.get("/pedido");
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudieron cargar los pedidos.");
            throw error.response?.data || new Error("Error al obtener pedidos");
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/pedido/${id}`);
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudo cargar el pedido.");
            throw error.response?.data || new Error("Error al obtener pedido");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/pedido", data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Pedido creado", "El pedido fue registrado exitosamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al crear pedido", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/pedido/${id}`, data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Pedido actualizado", "El pedido fue actualizado correctamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al actualizar pedido", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    cancelar: async (id) => {
        try {
            const response = await client.delete(`/pedido/${id}`);

            alertSuccess("Pedido cancelado", "El pedido fue anulado y el stock revertido.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al cancelar el pedido.";

            alertError("No se puede cancelar", message);

            throw new Error(message);
        }
    },

    getByUsuario: async (idUsuario) => {
        try {
            const response = await client.get(`/pedido?usuario=${idUsuario}`);
            return response.data;
        } catch (error) {
            console.error('Error cargando pedidos por usuario:', error);
            return [];
        }
    },

    getByEstado: async (estado) => {
        try {
            const response = await client.get(`/pedido?estado=${estado}`);
            return response.data;
        } catch (error) {
            console.error('Error cargando pedidos por estado:', error);
            return [];
        }
    }
};

export default pedidoService;