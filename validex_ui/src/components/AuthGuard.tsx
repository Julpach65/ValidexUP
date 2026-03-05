'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const savedId = localStorage.getItem('id_usuario_actual');
        if (!savedId) {
            // 🎯 Objetivo cumplido: Usamos replace para evitar que el usuario
            // pueda volver a la página protegida con el botón "atrás" del navegador.
            router.replace('/crear-cuenta');
        } else {
            // El usuario tiene un ID, permitir el acceso.
            setIsVerified(true);
        }
    }, [router]);

    // Mientras se verifica, mostramos un loader para evitar parpadeos (FOUC).
    // Si la verificación es exitosa, renderizamos el contenido protegido.
    return isVerified ? <>{children}</> : <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Verificando sesión...</div>;
}