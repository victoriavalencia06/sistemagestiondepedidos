import auth from "../api/auth";

const authService = {
    login: async (email, password) => {
        const res = await auth.login({ email, password });

        localStorage.setItem("api_token", res.data.token);

        return res.data;
    },

    register: async (nombre, email, password, password_confirmation) => {
        const res = await auth.register({
            nombre,
            email,
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
