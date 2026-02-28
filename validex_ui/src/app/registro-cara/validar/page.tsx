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
                            </p>
                        </div>
                    </div>

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
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center mt-auto">
                <div className="inline-flex items-center gap-2 text-xs text-slate-500/80 uppercase tracking-widest font-semibold cursor-default">
                    <span className="material-icons-outlined text-[14px]">lock</span>
                    <span>Cifrado de extremo a extremo • 2FA Liveness Activado</span>
                </div>
            </footer>
        </div>
    );
}
