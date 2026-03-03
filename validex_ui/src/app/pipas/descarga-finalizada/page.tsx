'use client'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'

export default function DescargaFinalizadaPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Background radial accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">

                {/* Success Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>
                    <div className="inline-flex items-center gap-2 mb-6 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <span className="material-icons-outlined text-emerald-400 text-sm">verified</span>
                        <span className="text-emerald-400 font-black text-[10px] tracking-[0.3em] uppercase">OPERACIÓN EXITOSA</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase italic mb-4">
                        Descarga <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Completada</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        El proceso de transferencia ha sido validado criptográficamente por la red de seguridad de <span className="text-white font-bold tracking-widest">VALIDEX UP</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* Detailed Report Section (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-10 relative overflow-hidden rounded-3xl shadow-2xl">
                            {/* Giant Background Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
                                <span className="material-icons text-[400px]">check_circle</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">Métricas de Carga</h3>
                                    <div className="space-y-8">
                                        {[
                                            { label: 'Volumen Final', val: '15,000 L', icon: 'water_drop', color: 'text-emerald-400' },
                                            { label: 'Unidad Validada', val: 'MX-8921', icon: 'local_shipping' },
                                            { label: 'Duración Total', val: '42:15 min', icon: 'timer' },
                                        ].map(m => (
                                            <div key={m.label} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                                                    <span className="material-icons-outlined">{m.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{m.label}</p>
                                                    <p className={`text-xl font-black ${m.color || 'text-white'} tracking-tight`}>{m.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-3xl p-8 border border-white/5 backdrop-blur-sm self-start">
                                    <h3 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em] mb-4">Validación Digital</h3>
                                    <div className="space-y-4 font-mono text-[11px] text-slate-500 uppercase">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>HASH ID</span>
                                            <span className="text-white">8X72...F9A2</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>TIMESTAMP</span>
                                            <span className="text-white">10:45:22 UTC</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>SECURITY SEAL</span>
                                            <span className="text-emerald-500">CERTIFIED</span>
                                        </div>
                                        <div className="pt-4 flex flex-col gap-2">
                                            <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                                <div className="w-full h-full bg-emerald-500 animate-pulse"></div>
                                            </div>
                                            <span className="text-center font-black text-[9px] tracking-[0.2em] text-[#10B981]">FIRMA DIGITAL VERIFICADA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Action Button */}
                        <button
                            id="finalized-done"
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-6 bg-white hover:bg-slate-200 text-[#0B1120] font-black rounded-2xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs"
                        >
                            <span className="material-icons-outlined">dashboard</span>
                            Finalizar y volver al Panel
                        </button>
                    </div>

                    {/* Sidebar Info Section (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card bg-[#151e32]/80 border-white/5 p-8 rounded-2xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Detalles de Facturación</h3>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Empresa Transportista</span>
                                    <span className="text-sm font-black text-white italic">TRANSPORTES DEL NORTE S.A.</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Operador de Turno</span>
                                    <span className="text-sm font-black text-white">RUBÉN NOYER</span>
                                </div>
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                    <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">PAGO AUTORIZADO</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card bg-[#151e32]/80 border-white/5 p-8 relative overflow-hidden group rounded-2xl">
                            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="material-icons-outlined text-emerald-400">picture_as_pdf</span>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Resumen Técnico</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mb-6">Descarga el reporte detallado con las métricas de presión, temperatura y flujo durante la operación.</p>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl border border-white/10 transition-all text-[10px] tracking-widest uppercase">
                                DESCARGAR PDF
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
