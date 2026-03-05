'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import OnboardingSidebar from '@/components/layout/OnboardingSidebar'
import { Suspense } from 'react';
import AuthGuard from '@/components/AuthGuard';

function SmsFallidaContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const phone = searchParams.get('phone') || '••••••••••'
    const phoneDisplay = phone.length >= 4 ? `+52 •••• •••${phone.slice(-4)}` : phone

    return (
        <div className="min-h-screen flex bg-[#0B1120] relative overflow-hidden selection:bg-red-500 selection:text-white">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
            </div>

            <OnboardingSidebar />

            <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 font-sans">

                <div className="w-full max-w-lg flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></span>
                        <span className="text-[10px] font-bold tracking-wide text-red-400 uppercase">Verificación Fallida</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Código <span className="text-red-500">Incorrecto</span></h1>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                        El código ingresado es incorrecto o ha expirado.
                        <br />
                        <span className="text-white font-mono tracking-widest text-xs bg-slate-800/50 px-2 py-1 rounded mt-2 inline-block border border-slate-700">
                            {phoneDisplay}
                        </span>
                    </p>

                    <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-10">
                        <span className="material-icons-round text-lg">error_outline</span>
                        <span>Intento no válido</span>
                    </div>

                    <button
                        onClick={() => router.push('/verificar-sms')}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black uppercase tracking-widest py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] mb-8"
                    >
                        <span>Reintentar Verificación</span>
                    </button>

                    <div className="space-y-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            ¿Problemas con el registro? <button className="text-red-500 hover:underline ml-1">Soporte Técnico</button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SmsFallidaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Cargando...</div>}>
            <AuthGuard>
                <SmsFallidaContent />
            </AuthGuard>
        </Suspense>
    )
}