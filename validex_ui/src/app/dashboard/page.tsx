'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Truck, FileText, Bell, Shield, LogOut } from 'lucide-react';
import { APP_INFO, USER_MOCK } from '@/data/mockData';
import AppHeader from '@/components/layout/AppHeader';

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Background glow accent similar to Pipas */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />

            <AppHeader />

            {/* Main Content Hub */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 w-full relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">
                        Gestión de módulos <br />
                        Validex <span className="text-[#10b981]">UP</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Card 1: Descargas */}
                    <button
                        onClick={() => router.push('/pipas')}
                        className="group relative flex flex-col items-center justify-center p-12 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 text-left overflow-hidden w-full h-full min-h-[300px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center mb-6 text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300 z-10 shadow-lg">
                            <Truck className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 z-10">Gestión de Pipas y Descargas</h2>
                        <p className="text-slate-400 text-center text-sm max-w-xs z-10 leading-relaxed group-hover:text-slate-300 transition-colors">
                            Autorización biométrica para descarga de tanques, monitoreo de volumen y asignación.
                        </p>
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-emerald-500 z-10">
                            <span className="material-icons-round">arrow_forward</span>
                        </div>
                    </button>

                    {/* Card 2: Bitacora */}
                    <button
                        onClick={() => router.push('/bitacora')}
                        className="group relative flex flex-col items-center justify-center p-12 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 text-left overflow-hidden w-full h-full min-h-[300px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center mb-6 text-slate-300 group-hover:text-blue-400 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300 z-10 shadow-lg">
                            <FileText className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 z-10">Bitácora y Auditoría</h2>
                        <p className="text-slate-400 text-center text-sm max-w-xs z-10 leading-relaxed group-hover:text-slate-300 transition-colors">
                            Registro inmutable de accesos, intentos denegados y autorizaciones despachadas.
                        </p>
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-blue-400 z-10">
                            <span className="material-icons-round">arrow_forward</span>
                        </div>
                    </button>

                </div>
            </main>

            <footer className="mt-auto border-t border-gray-800 bg-[#0d121d] py-6 relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Validex UP © 2026. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
