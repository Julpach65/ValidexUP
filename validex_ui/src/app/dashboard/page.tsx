'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Truck, FileText, Bell, Shield, LogOut } from 'lucide-react';
import { APP_INFO, USER_MOCK } from '@/data/mockData';

export default function DashboardPage() {
    const router = useRouter();

    return (
        <div className="bg-[#0f172a] min-h-screen font-sans text-slate-200">

            {/* Header Minimalista */}
            <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-xl font-bold tracking-tight text-white">
                            {APP_INFO.name} <span className="text-emerald-500">UP</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-white tracking-wide">{USER_MOCK.name}</span>
                            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {USER_MOCK.role}
                            </span>
                        </div>
                        <img src={USER_MOCK.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-slate-700 hidden md:block" />

                        <button className="relative w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-400 hover:text-emerald-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900"></span>
                        </button>
                        <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                        <button
                            onClick={() => router.push('/')}
                            className="text-slate-500 hover:text-red-400 transition-colors hidden md:flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" /> Salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Hub */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">Centro de Control Táctico</h1>
                    <p className="text-slate-400">Seleccione el módulo operativo para continuar.</p>
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
                            <span className="material-icons-rounded">arrow_forward</span>
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
                            <span className="material-icons-rounded">arrow_forward</span>
                        </div>
                    </button>

                </div>
            </main>

            <footer className="w-full py-6 text-center border-t border-slate-800 mt-auto bg-slate-900/50">
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                    SISTEMA DE AUTORIZACIÓN ZERO-TRUST • VERSIÓN DE PRODUCCIÓN
                </p>
            </footer>
        </div>
    );
}
