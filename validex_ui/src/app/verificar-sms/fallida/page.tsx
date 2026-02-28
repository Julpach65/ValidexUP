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
                        </div>
                    </div>
                </div>

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
}
