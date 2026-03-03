'use client'
import { useState } from 'react'
import AppHeader from '@/components/layout/AppHeader'

const LOGOS = [
    { id: 1, event: 'Autorización de Pipa', user: 'Rubén Noyer', date: '2024-05-20 10:45:22', module: 'Operaciones', status: 'Exitoso', unit: 'MX-8921' },
    { id: 2, event: 'Validación Facial', user: 'Laura G.', date: '2024-05-20 09:30:15', module: ' Seguridad', status: 'Exitoso', unit: '-' },
    { id: 3, event: 'Intento de Acceso', user: 'Desconocido', date: '2024-05-20 08:15:00', module: 'Seguridad', status: 'Denegado', unit: '-' },
    { id: 4, event: 'Descarga Finalizada', user: 'Rubén Noyer', date: '2024-05-19 18:22:45', module: 'Operaciones', status: 'Exitoso', unit: 'MX-7734' },
    { id: 5, event: 'Cambio de Password', user: 'Admin System', date: '2024-05-19 17:05:10', module: 'Configuración', status: 'Exitoso', unit: '-' },
]

export default function BitacoraPage() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">

                {/* Filter & Search Bar */}
                <div className="glass-card bg-[#151e32]/80 border-white/5 p-6 mb-8 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="BUSCAR POR EVENTO, USUARIO O UNIDAD..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-[11px] font-black tracking-widest placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-xl text-white font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">filter_list</span> Filtrar
                        </button>
                        <button className="px-6 py-4 bg-[#10b981] hover:bg-emerald-600 rounded-xl text-white font-black text-[10px] tracking-widest uppercase transition-all shadow-glow-emerald flex items-center gap-2 btn-glow">
                            <span className="material-icons-outlined text-sm">download</span> Exportar
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="glass-card bg-[#151e32]/90 border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-slate-900/40">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Evento / Acción</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operador</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Módulo</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Timestamp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-12 py-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {LOGOS.map(log => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${log.status === 'Exitoso' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                                <div>
                                                    <p className="text-sm font-black text-white tracking-tight uppercase group-hover:translate-x-1 transition-transform">{log.event}</p>
                                                    {log.unit !== '-' && <p className="text-[10px] text-slate-500 font-bold">Unidad: {log.unit}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-slate-400 italic uppercase">{log.user}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.module}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-mono text-slate-500 font-bold">{log.date}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded inline-block tracking-widest ${log.status === 'Exitoso' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
                                                }`}>
                                                {log.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-12 py-6 text-right">
                                            <button className="text-slate-600 hover:text-white transition-colors">
                                                <span className="material-icons-outlined text-lg">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination UI */}
                    <div className="px-8 py-6 border-t border-white/5 bg-slate-900/20 flex items-center justify-between">
                        <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">MOSTRANDO REGISTROS RECIENTES</span>
                        <div className="flex gap-3">
                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed border border-white/10">
                                <span className="material-icons-outlined">chevron_left</span>
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-white/10 border border-indigo-500/20 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
                                <span className="material-icons-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] border-t border-white/5 bg-[#0B1120]/50 backdrop-blur-md">
                Validex UP © 2026. Todos los derechos reservados.
            </footer>
        </div>
    )
}
