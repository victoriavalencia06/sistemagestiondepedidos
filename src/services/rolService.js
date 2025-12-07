// src/services/rolService.js
import client from "../api/client";
import { alertError } from "../utils/alerts";

const rolService = {
    get: async () => {
        try {
            const response = await client.get("/rol");

            // Verificar la estructura de la respuesta
            if (response.data && response.data.success) {
                return response.data.data;
            } else if (Array.isArray(response.data)) {
                return response.data;
            }

            console.warn('Formato de respuesta inesperado para roles:', response.data);
            return [];

        } catch (error) {
            console.error('Error cargando roles:', error);

            // Si hay error, devolver roles por defecto
            const rolesDefault = [
                { idRol: 1, nombre: "Administrador", estado: true },
                { idRol: 2, nombre: "Cliente", estado: true },
                { idRol: 3, nombre: "Empleado", estado: true }
            ];

            return rolesDefault;
        }
    },

    getById: async (id) => {
        try {
            const response = await client.get(`/rol/${id}`);

            if (response.data && response.data.success) {
                return response.data.data;
            }

            return response.data;

        } catch (error) {
            console.error(`Error cargando rol ${id}:`, error);
            throw error.response?.data || new Error("Error al obtener rol");
        }
    },

    create: async (data) => {
        try {
            const response = await client.post("/rol", data, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data && response.data.success) {
                return response.data.data;
            }

            return response.data;

        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al crear el rol";

            alertError("Error al crear rol", message);
            throw new Error(message);
        }
    },

    update: async (id, data) => {
        try {
            const response = await client.put(`/rol/${id}`, data, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data && response.data.success) {
                return response.data.data;
            }

            return response.data;

        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al actualizar el rol";

            alertError("Error al actualizar rol", message);
            throw new Error(message);
        }
    },

    delete: async (id) => {
        try {
            const response = await client.delete(`/rol/${id}`);

            if (response.data && response.data.success) {
                return response.data.data;
            }

            return response.data;

        } catch (error) {
            const apiData = error.response?.data;
            const message = apiData?.message || "Error al desactivar el rol";

            alertError("Error al desactivar rol", message);
            throw new Error(message);
        }
    },

    // Función auxiliar para obtener nombre del rol
    getRolNombre: (idRol) => {
        const rolesMap = {
            1: "Administrador",
            2: "Cliente",
            3: "Empleado"
        };

        return rolesMap[idRol] || `Rol ${idRol}`;
    },

    // Función auxiliar para obtener color del rol
    getRolColor: (idRol) => {
        const colorsMap = {
            1: "accent",
            2: "success",
            3: "info"
        };

        return colorsMap[idRol] || "muted";
    }
};

export default rolService;