'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import OnboardingSidebar from '@/components/layout/OnboardingSidebar'
import { Suspense } from 'react'

function SmsFallidaContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code') || '••••••'
    const phone = searchParams.get('phone') || '••••8392'
    const phoneDisplay = phone.length >= 4 ? `•••• ${phone.slice(-4)}` : '•••• 8392'
    const digits = code.split('').concat(Array(6 - code.length).fill('•')).slice(0, 6)

    return (
        <div className="min-h-screen flex bg-[#0B1120] relative overflow-hidden selection:bg-red-500 selection:text-white">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-red-500/10 rounded-full blur-3xl text-red-500"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-slate-500/5 rounded-full blur-3xl"></div>
            </div>

            <OnboardingSidebar />

            <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 font-sans">
                {/* Step Progress Estandarizado */}
                <div className="w-full max-w-md mb-12 relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>

                        {/* Step 1: Registro */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-2 text-[#10B981]">
                            <div className="w-10 h-10 rounded-full border border-[#10B981]/30 flex items-center justify-center bg-[#0B1120] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider uppercase">Registro</span>
                        </div>

                        {/* Step 2: SMS (Active Error) */}
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B1120] px-2">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-12 h-12 bg-red-500/20 rounded-full blur-xl"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-red-500 to-red-700 text-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] border-2 border-red-500/20 relative z-10">
                                <span className="material-icons-round text-xl">smartphone</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-white uppercase mt-1">SMS</span>
                        </div>

                        {/* Step 3: Cara */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-2 text-slate-500">
                            <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center bg-[#0B1120]">
                                <span className="material-icons-outlined text-lg">face</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider uppercase">Cara</span>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-lg flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold tracking-wide text-red-500 uppercase">Verificación Fallida</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight uppercase">Acceso <span className="text-red-500">Rechazado</span></h1>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                        El código ingresado no coincide con el enviado al dispositivo <br />
                        <span className="text-red-400 font-mono tracking-widest text-xs bg-red-500/5 px-2 py-1 rounded mt-2 inline-block border border-red-500/20">
                            {phoneDisplay}
                        </span>
                    </p>

                    {/* OTP Inputs with dynamic User Input */}
                    <div className="flex gap-2 sm:gap-3 mb-8 justify-center w-full">
                        {digits.map((digit, i) => (
                            <div key={i} className="w-10 h-14 rounded-xl bg-[#0F172A] border border-red-500 text-white text-2xl font-black flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                {digit}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-10">
                        <span className="material-icons-round text-lg">error_outline</span>
                        <span>Código incorrecto. Reinténtelo.</span>
                    </div>

                    <button
                        onClick={() => router.push('/verificar-sms')}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black uppercase tracking-widest py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] mb-8"
                    >
                        <span>Reintentar Validación</span>
                        <span className="material-icons-round text-xl text-white/80">refresh</span>
                    </button>

                    <div className="space-y-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            ¿No recibiste el código? <button onClick={() => router.push('/verificar-sms')} className="text-red-400 hover:underline ml-1">Reenviar SMS</button>
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
            <SmsFallidaContent />
        </Suspense>
    )
}
