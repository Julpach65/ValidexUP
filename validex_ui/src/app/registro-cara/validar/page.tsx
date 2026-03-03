<<<<<<< HEAD
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ValidarCaraPage() {
    const router = useRouter()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-300 font-sans selection:bg-[#10B981] selection:text-white">
            <style jsx global>{`
                .glass-panel {
                    background-color: rgba(15, 22, 35, 0.8);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .corner-border {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-color: #10B981;
                    border-style: solid;
                    pointer-events: none;
                }
                .corner-tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; border-top-left-radius: 4px; }
                .corner-tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; border-top-right-radius: 4px; }
                .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; border-bottom-left-radius: 4px; }
                .corner-br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; border-bottom-right-radius: 4px; }
            `}</style>

            {/* Header matches Stitch */}
            <header className="w-full px-6 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl">
                <div className="flex items-center space-x-3 cursor-pointer mb-8 md:mb-0" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Validex UP Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-[#10B981]">UP</span>
                    </div>
                </div>

                {/* Unified Stepper (Cara Active - Validando) */}
                <div className="w-full max-w-md relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10B981]/20 -z-10 transform -translate-y-1/2"></div>

                        {/* Step 1: Registro (Completed) */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Registro</span>
                        </div>

                        {/* Progress Line 1 */}
                        <div className="absolute top-1/2 left-[15%] w-[35%] h-0.5 bg-[#10B981]/50 -z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>

                        {/* Step 2: SMS (Completed) */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">SMS</span>
                        </div>

                        {/* Progress Line 2 */}
                        <div className="absolute top-1/2 left-[50%] w-[35%] h-0.5 bg-[#10B981]/50 -z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>

                        {/* Step 3: Cara (Active Validating) */}
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B111D] px-3">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-14 h-14 bg-blue-500/25 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-blue-500/20 relative z-10">
                                <span className="material-icons-round text-xl animate-spin-slow">sync</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-blue-400 uppercase mt-1">Validando</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="hidden md:flex px-5 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-[10px] font-black tracking-widest uppercase transition-colors border border-slate-700">
                    Cancelar
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
                <div className="w-full max-w-4xl mx-auto glass-panel rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                            Registro de Usuario
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                Validando Foto de Referencia
                            </h1>
                            <p className="text-slate-400 text-lg font-light max-w-xl mx-auto leading-relaxed">
                                Procesando rasgos biométricos. Por favor, mantenga la posición.
=======
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ValidarCaraPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-300 flex flex-col selection:bg-emerald-500 selection:text-white font-sans">
            {/* Header */}
            <header className="w-full bg-[#1E293B]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <span className="material-icons-outlined">verified_user</span>
                    </div>
                    <div className="text-xl font-bold tracking-tight">
                        <span className="text-white">Validex</span>
                        <span className="text-emerald-500">UP</span>
                    </div>
                </div>

                {/* Timeline Desktop */}
                <div className="hidden md:flex items-center gap-4 flex-1 justify-center max-w-2xl mx-auto">
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                            <span className="material-icons-outlined text-lg">check</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Registro</span>
                    </div>
                    <div className="h-[2px] flex-1 bg-emerald-500 rounded-full mx-2"></div>

                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                            <span className="material-icons-outlined text-lg">smartphone</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">SMS</span>
                    </div>
                    <div className="h-[2px] flex-1 bg-emerald-500 rounded-full mx-2"></div>

                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <span className="material-icons-outlined text-lg">face</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Cara</span>
                    </div>
                </div>

                <div>
                    <button className="px-5 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-colors border border-slate-700">
                        Cancelar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
                <div className="w-full max-w-4xl mx-auto bg-[#1E293B]/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl border border-white/10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                            <span className="material-icons-outlined text-sm">smart_toy</span>
                            Enrolamiento o Verificación
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                                Escaneo Biométrico Facial
                            </h1>
                            <p className="text-slate-400 text-lg font-light max-w-xl mx-auto leading-relaxed">
                                Posiciona tu rostro dentro del recuadro y mantén la mirada a la cámara para iniciar el escaneo en vivo.
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                            </p>
                        </div>
                    </div>

<<<<<<< HEAD
                    <div className="relative w-full max-w-[560px]">
                        <div className="w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700/50 flex items-center justify-center">
                            {/* Scanning indicator */}
                            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                <div className="w-48 h-48 border-2 border-[#10B981]/30 rounded-full flex items-center justify-center bg-[#10B981]/5">
                                    <span className="material-icons-round text-[#10B981] text-6xl animate-pulse">radar</span>
                                </div>
                            </div>

                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></span>
                                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Validando</span>
                            </div>

                            <div className="corner-border corner-tl !border-[#10B981]"></div>
                            <div className="corner-border corner-tr !border-[#10B981]"></div>
                            <div className="corner-border corner-bl !border-[#10B981]"></div>
                            <div className="corner-border corner-br !border-[#10B981]"></div>

                            {/* Scanning Animation Line */}
                            <div className="absolute left-0 w-full h-1 bg-[#10B981] shadow-[0_0_20px_#10B981] animate-scan-line pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Progress Bar from Stitch design style */}
                    <div className="w-full max-w-md space-y-4">
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-xs font-bold tracking-[0.2em] text-[#10B981] animate-pulse">
                            COMPARANDO RASGOS BIOMÉTRICOS... {progress}%
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => router.push('/registro-cara/valido')} className="px-6 py-2 bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] rounded-full text-xs font-bold hover:bg-[#10B981] hover:text-white transition-all uppercase">Simular Éxito</button>
                        <button onClick={() => router.push('/registro-cara/fallido')} className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase">Simular Fallo</button>
=======
                    {/* Camera Viewport Simulation */}
                    <div className="relative w-full max-w-[560px]">
                        <div className="w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700/50 flex items-center justify-center">
                            {/* Silhouette Placeholder */}
                            <div className="opacity-30 mix-blend-overlay grayscale flex justify-center items-center w-full h-full">
                                <span className="material-icons-outlined text-9xl text-white">person</span>
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(15,23,42,0.7)_100%)] pointer-events-none"></div>

                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
                                <span className="text-[10px] font-bold tracking-widest text-white/90">EN VIVO</span>
                            </div>

                            {/* Focus corners */}
                            <div className="absolute top-5 left-5 w-10 h-10 border-white/50 border-t-2 border-l-2 rounded-tl-md"></div>
                            <div className="absolute top-5 right-5 w-10 h-10 border-white/50 border-t-2 border-r-2 rounded-tr-md"></div>
                            <div className="absolute bottom-5 left-5 w-10 h-10 border-white/50 border-b-2 border-l-2 rounded-bl-md"></div>
                            <div className="absolute bottom-5 right-5 w-10 h-10 border-white/50 border-b-2 border-r-2 rounded-br-md"></div>
                        </div>
                    </div>

                    <div className="pt-4 w-full md:w-auto">
                        <button
                            onClick={() => router.push('/registro-cara/valido')}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-emerald-500 to-[#059669] hover:from-[#34D399] hover:to-[#10B981] rounded-2xl text-white font-bold text-lg shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 w-full md:min-w-[340px] justify-center"
                        >
                            <span className="material-icons-outlined text-2xl">photo_camera</span>
                            <span>Escanear y Autenticar</span>
                        </button>
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center mt-auto">
                <div className="inline-flex items-center gap-2 text-xs text-slate-500/80 uppercase tracking-widest font-semibold cursor-default">
                    <span className="material-icons-outlined text-[14px]">lock</span>
<<<<<<< HEAD
                    <span>Procesamiento en Tiempo Real • Neural Engine V.4</span>
                </div>
            </footer>
        </div>
    )
=======
                    <span>Cifrado de extremo a extremo • 2FA Liveness Activado</span>
                </div>
            </footer>
        </div>
    );
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
}
