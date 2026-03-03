<<<<<<< HEAD
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
                    <div className="inline-flex items-center gap-2 mb-6 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-glow-emerald">
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
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-10 relative overflow-hidden">
                            {/* Giant Background Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
                                <span className="material-icons text-[400px]">check_circle</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">Métricas de Carga</h3>
                                    <div className="space-y-8">
                                        {[
                                            { label: 'Volumen Final', val: '12,000 L', icon: 'water_drop', color: 'text-emerald-400' },
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
                                                <div className="w-full h-full bg-emerald-500 animate-shimmer"></div>
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
                        <div className="glass-card bg-[#151e32]/80 border-white/5 p-8">
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

                        <div className="glass-card bg-[#151e32]/80 border-white/5 p-8 relative overflow-hidden group">
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
=======
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
>>>>>>> 24840eff08b1ed8e0c5ccb270cb59b1c6ad76a9f
}
