<<<<<<< HEAD
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import OnboardingSidebar from '@/components/layout/OnboardingSidebar'
import { Suspense } from 'react'

function SmsCorrectaContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code') || '••••••'
    const phone = searchParams.get('phone') || '••••8392'
    const phoneDisplay = phone.length >= 4 ? `•••• ${phone.slice(-4)}` : '•••• 8392'
    const digits = code.split('').concat(Array(6 - code.length).fill('•')).slice(0, 6)

    return (
        <div className="min-h-screen flex bg-[#0B1120] relative overflow-hidden selection:bg-[#10B981] selection:text-white">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
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

                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-[12%] w-[38%] h-0.5 bg-[#10B981]/50 -z-0 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>

                        {/* Step 2: SMS (Success) */}
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B1120] px-2">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-12 h-12 bg-[#10B981]/20 rounded-full blur-xl"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] border-2 border-[#10B981]/20 relative z-10">
=======
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ValidacionSmsCorrecta() {
    const router = useRouter();

    return (
        <div className="bg-[#0F172A] text-white min-h-screen flex overflow-hidden selection:bg-emerald-500 selection:text-white">
            {/* Sidebar - Visible on Desktop */}
            <aside className="hidden lg:flex w-1/4 min-w-[320px] max-w-[400px] flex-col justify-between bg-[#1A212B] p-8 border-r border-slate-800">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center">
                            <span className="text-emerald-500 font-bold text-sm">V</span>
                        </div>
                        <div className="text-xl font-semibold tracking-tight">
                            Validex <span className="text-emerald-500">UP</span>
                        </div>
                    </div>
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 shadow-lg">
                            <span className="material-icons-outlined text-emerald-500 text-3xl">security</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Seguridad Zero-Trust</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Validex UP implementa autenticación multifactor (MFA) para garantizar que solo tú tengas acceso. Este código único expira en 5 minutos.
                        </p>
                    </div>
                    <div className="h-px bg-slate-700/50 w-full mb-8"></div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <span className="material-icons-outlined text-emerald-500 text-xl">lock</span>
                            </div>
                            <div>
                                <h3 className="font-medium text-white text-sm">Cifrado de extremo a extremo</h3>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Tus datos viajan seguros mediante protocolos TLS 1.3.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <span className="material-icons-outlined text-emerald-500 text-xl">verified_user</span>
                            </div>
                            <div>
                                <h3 className="font-medium text-white text-sm">Validación en tiempo real</h3>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Monitoreo activo contra intentos de intrusión.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-slate-400 text-xs opacity-60">
                    © 2026 Validex UP Security Systems. v1.0.0
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#0F172A] relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto w-full">
                {/* Progress Bar Header */}
                <div className="w-full max-w-lg mb-12 relative z-10">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>

                        <div className="flex flex-col items-center gap-2 bg-[#0F172A] px-2">
                            <div className="w-10 h-10 rounded-full border border-emerald-500/30 text-emerald-500 flex items-center justify-center bg-[#0F172A]">
                                <span className="material-icons-round text-lg">check_circle_outline</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">Registro</span>
                        </div>

                        {/* The line to SMS is active */}
                        <div className="absolute top-1/2 left-[12%] w-[38%] h-0.5 bg-emerald-500 -z-0 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>

                        <div className="flex flex-col items-center gap-2 relative bg-[#0F172A] px-2">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-12 h-12 bg-emerald-500/20 rounded-full blur-xl"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border-2 border-emerald-500/20 relative z-10">
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                                <span className="material-icons-round text-xl">smartphone</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-white uppercase mt-1">SMS</span>
                        </div>

<<<<<<< HEAD
                        {/* Step 3: Cara */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-2 text-slate-500">
                            <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center bg-[#0B1120]">
                                <span className="material-icons-outlined text-lg">face</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider uppercase">Cara</span>
=======
                        <div className="flex flex-col items-center gap-2 bg-[#0F172A] px-2">
                            <div className="w-10 h-10 rounded-full border border-slate-700 text-slate-500 flex items-center justify-center bg-[#0F172A]">
                                <span className="material-icons-outlined text-lg">face</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">Cara</span>
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                        </div>
                    </div>
                </div>

<<<<<<< HEAD
                <div className="w-full max-w-lg flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#10B981]/20 bg-[#10B981]/5 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]"></span>
                        <span className="text-[10px] font-bold tracking-wide text-[#10B981] uppercase">Verificación Exitosa</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Acceso <span className="text-[#10B981]">Validado</span></h1>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                        El código ingresado ha sido confirmado para el dispositivo <br />
                        <span className="text-white font-mono tracking-widest text-xs bg-slate-800/50 px-2 py-1 rounded mt-2 inline-block border border-slate-700">
                            {phoneDisplay}
                        </span>
                    </p>

                    {/* OTP Inputs Display */}
                    <div className="flex gap-2 sm:gap-3 mb-8 justify-center w-full">
                        {digits.map((digit, i) => (
                            <div key={i} className="w-10 h-14 rounded-xl bg-[#0F172A] border border-[#10B981] text-white text-2xl font-black flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                {digit}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-[#10B981] font-black text-xs uppercase tracking-[0.2em] mb-10 animate-bounce">
                        <span className="material-icons-round text-lg">verified_user</span>
                        <span>Identidad Confirmada</span>
=======
                {/* Verification Success UI */}
                <div className="w-full max-w-lg flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-medium tracking-wide text-slate-300 uppercase">Paso Completado</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">¡Código Correcto!</h1>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto">
                        Tu número de teléfono ha sido validado exitosamente en nuestra base de datos.
                    </p>

                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <span className="material-icons-round text-emerald-500 text-5xl">verified</span>
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                    </div>

                    <button
                        onClick={() => router.push('/registro-cara')}
<<<<<<< HEAD
                        className="w-full bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black uppercase tracking-widest py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-8"
                    >
                        <span>Continuar Proceso</span>
                    </button>

                    <div className="space-y-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            ¿Problemas con el registro? <button className="text-[#10B981] hover:underline ml-1">Soporte Técnico</button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SmsCorrectaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Cargando...</div>}>
            <SmsCorrectaContent />
        </Suspense>
    )
=======
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-8"
                    >
                        <span>Continuar al Siguiente Paso</span>
                        <span className="material-icons-round text-lg">arrow_forward</span>
                    </button>
                </div>

                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>
            </main>
        </div>
    );
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
}
