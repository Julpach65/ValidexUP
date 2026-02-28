"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReconocimientoValido() {
    const router = useRouter();

    return (
        <div className="bg-[#050505] text-gray-100 min-h-screen flex flex-col font-sans antialiased">
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10">
                        <span className="material-icons-outlined text-emerald-500 text-xl">security</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Validex <span className="text-emerald-500">UP</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-500/10">
                            <span className="material-icons-outlined text-sm">shield</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Registro</span>
                    </div>
                    <div className="w-24 h-[2px] bg-emerald-500 mb-5"></div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-500/10">
                            <span className="material-icons-outlined text-sm">smartphone</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">SMS</span>
                    </div>
                    <div className="w-24 h-[2px] bg-emerald-500 mb-5"></div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <span className="material-icons-outlined text-sm">face</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Cara</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-6 relative">
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/5 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                    <span className="material-icons-outlined text-[16px] font-bold">check_circle</span>
                    Identidad Verificada
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center tracking-tight">
                    Verificación Facial Exitosa
                </h1>
                <p className="text-zinc-400 text-center max-w-lg mb-12 leading-relaxed text-sm md:text-base">
                    Tu identidad ha sido confirmada correctamente.<br />
                    Ahora puedes proceder al sistema (Centro de Mando).
                </p>

                <div className="relative w-full max-w-sm aspect-square bg-[#0f0f0f] rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center mb-12">
                    {/* Scan Corners */}
                    <div className="absolute w-10 h-10 border-emerald-500 border-t-4 border-l-4 rounded-tl-xl top-5 left-5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                    <div className="absolute w-10 h-10 border-emerald-500 border-t-4 border-r-4 rounded-tr-xl top-5 right-5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                    <div className="absolute w-10 h-10 border-emerald-500 border-b-4 border-l-4 rounded-bl-xl bottom-5 left-5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                    <div className="absolute w-10 h-10 border-emerald-500 border-b-4 border-r-4 rounded-br-xl bottom-5 right-5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>

                    <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-emerald-500/30 bg-black/60 backdrop-blur-sm text-emerald-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        Completado
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-48 h-48 rounded-2xl border border-emerald-500/20 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center relative bg-white/[0.02] backdrop-blur-md">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                <span className="material-icons-outlined text-emerald-500 text-4xl font-bold">check</span>
                            </div>
                            <div className="px-6 py-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Verificado</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="group w-full max-w-sm bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.6)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                >
                    <span className="text-lg">Ingresar al Dashboard</span>
                    <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </main>
        </div>
    );
}
