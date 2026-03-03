<<<<<<< HEAD
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'

export default function DescargaEnCursoPage() {
    const router = useRouter()
    const [progreso, setProgreso] = useState(65)
    const [litros, setLitros] = useState(8240)
    const [flujo, setFlujo] = useState(450)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgreso(p => (p < 100 ? p + 0.1 : 100))
            setLitros(l => l + 5)
            setFlujo(Math.floor(440 + Math.random() * 20))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Background radial accent */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">

                {/* Terminal Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <span className="material-icons-outlined text-emerald-400 animate-pulse">downloading</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-emerald-400 font-black text-[10px] tracking-widest uppercase italic">EN PROCESO</span>
                                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></div>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Descarga de Fluido <span className="text-emerald-400">Activa</span></h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#151e32] border border-white/5 rounded-2xl p-4 shadow-2xl">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID de Operación</p>
                            <p className="text-sm font-black text-white px-2 py-1 bg-white/5 rounded mt-1 tabular-nums">#VDX-2024-001</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Detailed Metrics HUD (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {[
                            { label: 'Unidad de Transporte', val: 'MX-8921', icon: 'local_shipping' },
                            { label: 'Flujo de Carga (L/min)', val: `${flujo}`, icon: 'speed', color: 'text-emerald-400' },
                            { label: 'Tiempo Estimado', val: '14:23 min', icon: 'timer' },
                        ].map(item => (
                            <div key={item.label} className="glass-card bg-[#151e32]/80 border-white/5 p-6 flex items-center gap-5 group hover:border-emerald-500/20 transition-all">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                    <span className="material-icons-outlined">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className={`text-xl font-black ${item.color || 'text-white'} tracking-tight`}>{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Central Progress Terminal (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-10 relative overflow-hidden">
                            {/* Scanner Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan pointer-events-none"></div>

                            <div className="flex flex-col items-center text-center">
                                <div className="text-[100px] font-black text-white leading-none tracking-tighter mb-4 tabular-nums relative">
                                    {Math.floor(progreso)}<span className="text-3xl text-emerald-400 absolute md:top-6 ml-2">%</span>
                                </div>
                                <p className="text-sm font-black text-slate-400 tracking-[0.3em] uppercase mb-10">Progreso de Transferencia de Datos</p>

                                {/* Industrial Progress Bar */}
                                <div className="w-full h-12 bg-black/40 rounded-2xl border border-white/5 p-1.5 relative overflow-hidden mb-10">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl relative transition-all duration-500 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        style={{ width: `${progreso}%` }}
                                    >
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-shimmer"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 w-full gap-6">
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 italic">Total Transferido</p>
                                        <p className="text-3xl font-black text-white tabular-nums">{litros.toLocaleString()} <span className="text-sm text-slate-500">L</span></p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 italic">Capacidad Objetivo</p>
                                        <p className="text-3xl font-black text-white tabular-nums">12,000 <span className="text-sm text-slate-500">L</span></p>
=======
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
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                                    </div>
                                </div>
                            </div>
                        </div>

<<<<<<< HEAD
                        {/* Control Actions Bar */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button className="flex-1 py-5 bg-white/5 hover:bg-red-500/20 text-white font-black rounded-2xl border border-white/5 hover:border-red-500/40 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]">
                                <span className="material-icons-outlined text-red-500">stop_circle</span>
                                Interrupción de Emergencia
                            </button>
                            <button
                                id="finish-sim"
                                onClick={() => router.push('/pipas/descarga-finalizada')}
                                className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-glow-emerald border border-emerald-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] btn-glow"
                            >
                                <span className="material-icons-outlined">check_circle</span>
                                Finalizar Maniobra
                            </button>
=======
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
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
                        </div>
                    </div>
                </div>
            </main>

<<<<<<< HEAD
            <footer className="py-8 text-center bg-[#0F172A] border-t border-white/5">
                <p className="text-[10px] text-slate-600 font-bold tracking-[0.4em] uppercase">
                    Validex UP © 2026. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
=======
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
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
}
