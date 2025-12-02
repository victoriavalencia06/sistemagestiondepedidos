import api from "./client";

const auth = {
    login: (data) => api.post("/login", data),
    register: (data) => api.post("/register", data),
    me: () => api.get("/me"),
    logout: () => api.post("/logout"),
};

export default auth;
