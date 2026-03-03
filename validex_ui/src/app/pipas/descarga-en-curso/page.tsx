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
                                    </div>
                                </div>
                            </div>
                        </div>

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
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center bg-[#0F172A] border-t border-white/5">
                <p className="text-[10px] text-slate-600 font-bold tracking-[0.4em] uppercase">
                    Validex UP © 2026. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
}
