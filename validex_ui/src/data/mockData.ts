// src/data/mockData.ts
// Basado en las guías de la habilidad react-components: "Move all static text, image URLs, and lists into src/data/mockData.ts"

export const APP_INFO = {
    name: "Validex",
    suffix: "UP",
    version: "v1.0.0",
    copyright: "© 2026 Validex UP Security Systems. Todos los derechos reservados."
};

export const USER_MOCK = {
    name: "EL NOYER",
    role: "PATRON",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgiNZ7npo88yTlikH_HPIinhlnkNFRxTs5p5KyK0a0bmu6kHs7Xzm2mI14X4WjbqN12qvE88pwRQwdyB06dV3UkeYo64hMk4UOyC4yf3w8QRyp2hVCjvm7UUmBAVFk0LdQNZozCoawVIDlcBip6W2AQTFb_p8LM-hpq0C01V9AhkUNB4r9JynrnUQ6mousY2ZappFun2JJQIsk8XvF5_sIycm6lEI5NTTP0VabHsjX_jbltqiCrxWgWuFQcJvnMEp7GhPfO5-6yZA",
    email: "elnoyer@validex.com"
};

export const LOGS_MOCK = [
    { id: 1, time: "14:45:01", action: "Inicio de Sesión", user: "Super noyer", status: "EXITO", icon: "vpn_key" },
    { id: 2, time: "14:42:15", action: "Autorización de Descarga", user: "Arq. Abraham Orozco", status: "EXITO", icon: "check_circle" },
    { id: 3, time: "14:38:22", action: "Inicio de Sesión", user: "Anabel Hernandez", status: "DENEGADO", icon: "vpn_key" },
    { id: 4, time: "14:30:10", action: "Autorización de Descarga", user: "Ing. Julian Pacheco", status: "EXITO", icon: "check_circle" },
    { id: 5, time: "14:15:00", action: "Inicio de Sesión", user: "Ing. Diego Ochoa", status: "EXITO", icon: "vpn_key" }
];

export const PIPAS_MOCK = [
    { id: "PIPA-001", capacidad: 35000, actual: 0 },
    { id: "PIPA-002", capacidad: 35000, actual: 12000 },
    { id: "PIPA-003", capacidad: 45000, actual: 40000 }
];
