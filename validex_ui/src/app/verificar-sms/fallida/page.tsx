<<<<<<< HEAD
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
=======
"use client";

import Link from "next/link";

export default function ValidacionSmsFallida() {
    return (
        <div className="bg-[#0B111D] text-white min-h-screen flex flex-col font-sans transition-colors duration-300">
            <header className="w-full px-6 py-4 border-b border-gray-800 flex items-center justify-between relative z-20 bg-[#0B111D]">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-700">
                        <span className="material-icons-round text-emerald-500 text-2xl">verified_user</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-white">
                        Validex <span className="text-red-500">UP</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mb-1 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                            <span className="material-icons-outlined text-xl">security</span>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider text-emerald-500 uppercase">Registro</span>
                    </div>
                    <div className="w-24 h-0.5 bg-emerald-500 mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-red-500 text-white flex items-center justify-center mb-1 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            <span className="material-icons-outlined text-xl">smartphone</span>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider text-red-500 uppercase">SMS</span>
                    </div>
                    <div className="w-24 h-0.5 bg-gray-700 mx-2 mb-4"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-gray-700 text-gray-400 flex items-center justify-center mb-1">
                            <span className="material-icons-round text-xl">face</span>
                        </div>
                        <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Cara</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold tracking-wider mb-6 animate-pulse">
                    <span className="material-icons-outlined text-sm">error_outline</span>
                    <span>ERROR DE VALIDACIÓN</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    Código Incorrecto
                </h1>
                <p className="text-gray-400 text-center max-w-lg mb-12 leading-relaxed">
                    El código de verificación SMS ingresado es inválido o ha expirado. Por favor, solicita uno nuevo e inténtalo otra vez.
                </p>

                <div className="relative w-full max-w-md aspect-square bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl mb-10 group">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-60 z-0"></div>
                    <div className="absolute inset-0 bg-red-500/5 z-0 pointer-events-none"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <div className="w-48 h-48 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-hidden">
                            <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-4 bg-red-500/10">
                                <span className="material-icons-round text-red-500 text-4xl">close</span>
                            </div>
                            <div className="px-4 py-1.5 bg-red-500 rounded text-white text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                Acceso Denegado
                            </div>
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                        </div>
                    </div>
                </div>

<<<<<<< HEAD
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
=======
                <div className="flex gap-4 w-full max-w-sm mb-6">
                    <Link href="/verificar-sms" className="flex-1 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white font-semibold py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] transform transition hover:scale-[1.02] flex items-center justify-center space-x-2">
                        <span className="material-icons-outlined">refresh</span>
                        <span>Reintentar</span>
                    </Link>
                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl border border-gray-700 transform transition flex items-center justify-center">
                        <span>Soporte</span>
                    </button>
                </div>
            </main>
        </div>
    );
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
}
