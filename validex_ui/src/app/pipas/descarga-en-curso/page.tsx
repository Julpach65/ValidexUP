"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DescargaPipaEnCursoPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
            <nav className="bg-[#0F172A] border-b border-[#334155] px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/dashboard')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-900 to-green-600 rounded-lg flex items-center justify-center border border-green-500/30">
                            <span className="material-icons-outlined text-green-300">verified_user</span>
                        </div>
                        <div className="text-xl font-bold text-white tracking-tight">
                            Validex <span className="text-emerald-500">UP</span>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center h-full">
                        <Link href="/dashboard" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-medium">Dashboard</Link>
                        <div className="relative h-10 flex items-center">
                            <Link href="/pipas" className="text-emerald-500 font-medium text-sm">Operaciones Pipas</Link>
                            <div className="absolute bottom-[-1.1rem] left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        </div>
                        <Link href="#" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-medium">Accesos y descargas</Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight uppercase">EL NOYER</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">PATRON</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-slate-600 flex justify-center items-center">
                                <span className="material-icons-outlined text-white">person</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow p-6 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="material-icons-outlined text-emerald-500 text-sm animate-spin-slow">sync</span>
                                <span className="text-emerald-500 text-xs font-bold tracking-wider uppercase">Operación en curso</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Descarga en Proceso</h1>
                            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
                                La descarga de combustible de la unidad MX-8921 se encuentra activa. Monitoreo en tiempo real.
                            </p>
                        </div>
                        <button className="bg-emerald-500 hover:bg-[#059669] text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-green-900/20 transition-all">
                            <span className="material-icons-outlined">print</span>
                            Imprimir Ticket
                        </button>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons-outlined text-emerald-500 text-7xl">local_shipping</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="bg-blue-900/30 p-1.5 rounded text-blue-400">
                                    <span className="material-icons-outlined text-lg">badge</span>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">ID de Pipa</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1 relative z-10">MX-8921</div>
                            <div className="text-slate-500 text-sm relative z-10">Transportes del Norte S.A.</div>
                        </div>

                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons-outlined text-emerald-500 text-7xl">water_drop</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="bg-teal-900/30 p-1.5 rounded text-teal-400">
                                    <span className="material-icons-outlined text-lg">propane</span>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">Volumen Autorizado</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1 relative z-10">15,000 L</div>
                            <div className="text-emerald-500 text-sm flex items-center gap-1 relative z-10">
                                <span className="material-icons-outlined text-xs">trending_up</span> Capacidad Máxima
                            </div>
                        </div>
                    </div>

                    {/* Progress and Security */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/5">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">Nivel de Llenado Objetivo</h2>
                                    <p className="text-slate-400 text-sm">Monitoreo en tiempo real de la carga autorizada</p>
                                </div>
                                <span className="bg-green-900/30 text-emerald-500 border border-green-800/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 uppercase">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Descargando
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative mb-10">
                                <div className="h-12 w-full bg-slate-800/50 rounded-full overflow-hidden flex relative border border-slate-700/30">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full relative shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: '65%' }}>
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 font-bold px-2 py-0.5 rounded text-xs shadow-lg">
                                            65%
                                        </div>
                                    </div>
                                    {/* Ticks */}
                                    <div className="absolute top-0 left-1/4 h-full w-px bg-slate-700/30"></div>
                                    <div className="absolute top-0 left-2/4 h-full w-px bg-slate-700/30"></div>
                                    <div className="absolute top-0 left-3/4 h-full w-px bg-slate-700/30"></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
                                    <span>0 L</span>
                                    <span>3,750 L</span>
                                    <span>7,500 L</span>
                                    <span>11,250 L</span>
                                    <span>15,000 L</span>
                                </div>
                            </div>

                            {/* Mini Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-[#1E293B] bg-opacity-80 rounded-xl p-4 relative border border-slate-700/50">
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-500"></div>
                                    <p className="text-slate-400 text-sm mb-1">Presión de Bomba</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">5.8</span>
                                        <span className="text-xs text-slate-500 font-bold uppercase">BAR</span>
                                    </div>
                                </div>
                                <div className="bg-[#1E293B] bg-opacity-80 rounded-xl p-4 relative border border-slate-700/50">
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <p className="text-slate-400 text-sm mb-1">Temperatura</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">41</span>
                                        <span className="text-xs text-slate-500 font-bold uppercase">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Validation Panel */}
                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl flex flex-col h-full overflow-hidden border border-white/5">
                            <div className="p-4 bg-slate-800/40 border-b border-slate-700/50 flex items-center gap-3">
                                <span className="material-icons-outlined text-emerald-500">security</span>
                                <h3 className="font-bold text-white">Validación de Seguridad</h3>
                            </div>

                            <div className="flex-grow flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-slate-900/20">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute w-full h-full border-4 border-slate-700/30 rounded-full"></div>
                                    <div className="absolute w-3/4 h-3/4 border-4 border-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                                    <span className="material-icons-outlined text-emerald-500/50 text-6xl">fingerprint</span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-800/40 border-t border-slate-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500">
                                        <span className="material-icons-outlined text-lg">check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">Token Biométrico</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Operación validada por el noyer por Reconocimiento facial a las 13:45:22 hrs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto px-6 py-8 border-t border-[#334155] bg-[#0F172A]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div>© 2026 Validex UP Todos los derechos reservados.</div>
                    <div className="flex items-center gap-6">
                        <span>ID de Transacción: <span className="text-slate-300 font-mono">#TRX-9982-AB</span></span>
                        <span>v1.0.0</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
