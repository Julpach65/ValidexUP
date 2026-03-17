import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

export interface UserProfile {
    id_usuario: number;
    nombre_completo: string;
    rol: string;
    email: string;
}

// Utilidades tácticas de ofuscación (Capa ligera Zero-Trust)
const obfuscate = (str: string) => btoa(str);
const deobfuscate = (str: string) => {
    try {
        return atob(str);
    } catch (e) {
        return str; // Fallback para tokens no ofuscados (retrocompatibilidad)
    }
}

export function useAuth() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Obtenemos el token ofuscado
                const rawToken = localStorage.getItem('access_token');
                if (!rawToken) {
                    setIsLoading(false);
                    return;
                }

                const token = deobfuscate(rawToken);

                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error("Identidad rechazada o sesión expirada");
                    localStorage.removeItem('access_token');
                }
            } catch (error) {
                console.error("Error táctico sincronizando perfil", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, isLoading };
}
