import auth from "../api/auth";

const authService = {
    login: async (correo, password) => {
        const res = await auth.login({ correo, password });

        // Guardar token en localStorage
        localStorage.setItem("api_token", res.data.token);

        return res.data;
    },

    register: async (nombre, correo, password, password_confirmation) => {
        const res = await auth.register({
            nombre,
            correo,
            password,
            password_confirmation,
        });

        localStorage.setItem("api_token", res.data.token);
        return res.data;
    },

    logout: async () => {
        await auth.logout();
        localStorage.removeItem("api_token");
    },

    me: async () => {
        const res = await auth.me();
        return res.data;
    },
};

export default authService;
