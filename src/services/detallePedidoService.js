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

const detallePedidoService = {
    get: async () => {
        try {
            const response = await client.get("/detallePedido");
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudieron cargar los detalles de pedido.");
            throw error.response?.data || new Error("Error al obtener detalles");
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/detallePedido/${id}`);
            return response.data;
        } catch (error) {
            alertError("Error", "No se pudo cargar el detalle del pedido.");
            throw error.response?.data || new Error("Error al obtener detalle");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/detallePedido", data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Detalle agregado", "El producto fue agregado al pedido.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al agregar detalle", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/detallePedido/${id}`, data, {
                headers: { "Content-Type": "application/json" }
            });

            alertSuccess("Detalle actualizado", "El detalle fue actualizado correctamente.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const msgs = extractValidationMessages(apiData);

            alertError("Error al actualizar detalle", msgs.join("<br>"));

            throw new Error(msgs.join("\n") || apiData?.message);
        }
    },

    delete: async (id) => {
        try {
            const response = await client.delete(`/detallePedido/${id}`);

            alertSuccess("Detalle eliminado", "El producto fue removido del pedido.");
            return response.data;
        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al eliminar el detalle.";

            alertError("No se puede eliminar", message);

            throw new Error(message);
        }
    },

    getByPedido: async (idPedido) => {
        try {
            const response = await client.get(`/detallePedido?pedido=${idPedido}`);
            return response.data;
        } catch (error) {
            console.error('Error cargando detalles por pedido:', error);
            return [];
        }
    },

    calcularSubtotal: (precio, cantidad) => {
        return parseFloat((precio * cantidad).toFixed(2));
    }
};

export default detallePedidoService;