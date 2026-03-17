'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            // El usuario no está autenticado o el token es inválido
            router.replace('/crear-cuenta');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white gap-4">
                <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Sincronizando Identidad Zero-Trust</p>
            </div>
        );
    }

    return user ? <>{children}</> : null;
}
