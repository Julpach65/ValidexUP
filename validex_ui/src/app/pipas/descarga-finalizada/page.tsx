"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DescargaPipaFinalizadaPage() {
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
                </div>
            </nav>

            <main className="flex-grow p-6 md:p-8 lg:p-12 border-t-4 border-emerald-500">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="material-icons-outlined text-emerald-500 text-sm">task_alt</span>
                                <span className="text-emerald-500 text-xs font-bold tracking-wider uppercase">Operación Completada</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Descarga Finalizada Exitosamente</h1>
                            <p className="text-slate-400 max-w-2xl text-sm md:text-base">
                                La descarga de 15,000 L de la unidad MX-8921 ha concluido sin incidencias operativas.
                            </p>
                        </div>
                        <button className="bg-emerald-500 hover:bg-[#059669] text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-green-900/20 transition-all">
                            <span className="material-icons-outlined">print</span>
                            Imprimir Recibo Oficial
                        </button>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="bg-blue-900/30 p-1.5 rounded text-blue-400">
                                    <span className="material-icons-outlined text-lg">badge</span>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">Volumen Total Recibido</span>
                            </div>
                            <div className="text-3xl font-bold text-emerald-500 mb-1 relative z-10">15,000 L</div>
                            <div className="text-slate-500 text-sm relative z-10 font-mono">Unidad MX-8921</div>
                        </div>

                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group border border-white/5">
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className="bg-slate-700/50 p-1.5 rounded text-slate-300">
                                    <span className="material-icons-outlined text-lg">schedule</span>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">Tiempo Total de Operación</span>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1 relative z-10">01:45:20</div>
                            <div className="text-emerald-500 text-sm flex items-center gap-1 relative z-10">
                                <span className="material-icons-outlined text-xs">thumb_up</span> Tiempo dentro del margen óptimo
                            </div>
                        </div>
                    </div>

                    {/* Progress and Security */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/5">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">Nivel de Llenado Objetivo</h2>
                                    <p className="text-slate-400 text-sm">Resumen de carga completada</p>
                                </div>
                                <span className="bg-green-900/30 text-emerald-500 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 uppercase">
                                    <span className="material-icons-outlined text-sm">check</span>
                                    100% Completado
                                </span>
                            </div>

                            {/* Progress Bar 100% */}
                            <div className="relative mb-10">
                                <div className="h-12 w-full bg-slate-800/50 rounded-full overflow-hidden flex relative border border-emerald-500/30">
                                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full relative shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: '100%' }}>
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-emerald-600 font-bold px-2 py-0.5 rounded text-xs shadow-lg">
                                            100%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
                                    <span>0 L</span>
                                    <span>7,500 L</span>
                                    <span className="text-emerald-500 font-bold tracking-wider">15,000 L</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/pipas')}
                                className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-colors border border-slate-600"
                            >
                                Regresar al Panel de Pipas
                            </button>
                        </div>

                        {/* Validation Panel */}
                        <div className="bg-[#1E293B] bg-opacity-80 backdrop-blur-md rounded-2xl flex flex-col h-full overflow-hidden border border-emerald-500/20">
                            <div className="p-4 bg-slate-800/40 border-b border-slate-700/50 flex items-center gap-3">
                                <span className="material-icons-outlined text-emerald-500">verified</span>
                                <h3 className="font-bold text-white">Certificado Final</h3>
                            </div>

                            <div className="flex-grow flex items-center justify-center p-6 bg-gradient-to-b from-emerald-900/10 to-transparent">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <div className="absolute w-full h-full border-4 border-emerald-500/30 rounded-full"></div>
                                    <div className="absolute w-3/4 h-3/4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <span className="material-icons-round text-emerald-500 text-5xl">task_alt</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-800/40 border-t border-slate-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-emerald-500">
                                        <span className="material-icons-outlined text-lg">check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">Carga Sellada en Bitácora</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            El volumen ha sido añadido al inventario digital y firmado por #TRX-9982-AB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
