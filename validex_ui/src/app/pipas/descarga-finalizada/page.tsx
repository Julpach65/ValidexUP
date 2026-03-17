'use client'
import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_BASE_URL } from '@/config/api'
import AppHeader from '@/components/layout/AppHeader'

export const dynamic = 'force-dynamic';

interface OperacionFinal {
    id_operacion: number
    volumen_actual: number
    volumen_objetivo: number
    estado: string
    fecha_inicio: string
    fecha_fin: string | null
    id_pipa: number
}

function FinalizadaContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const idOperacion = searchParams.get('id_operacion')
    const interrumpida = searchParams.get('interrumpida') === '1'

    const [op, setOp] = useState<OperacionFinal | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!idOperacion) {
            setLoading(false)
            return
        }

        const fetchOperacion = async () => {
            try {
                const token = localStorage.getItem('access_token')
                const res = await fetch(
                    `${API_BASE_URL}/operaciones/${idOperacion}/estado`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (res.ok) {
                    setOp(await res.json())
                }
            } catch { /* fallo silencioso */ }
            finally {
                setLoading(false)
            }
        }

        fetchOperacion()
    }, [idOperacion])

    const calcDuracion = () => {
        if (!op?.fecha_inicio) return '—'
        const inicio = new Date(op.fecha_inicio).getTime()
        const fin = op.fecha_fin ? new Date(op.fecha_fin).getTime() : Date.now()
        const diffSecs = Math.floor((fin - inicio) / 1000)
        const mins = Math.floor(diffSecs / 60)
        const secs = diffSecs % 60
        return `${mins}m ${secs}s`
    }

    const volumenFinal = op?.volumen_actual ?? 0
    const volumenObjetivo = op?.volumen_objetivo ?? 0
    const eficiencia = volumenObjetivo > 0 ? ((volumenFinal / volumenObjetivo) * 100).toFixed(1) : '0.0'
    const duracion = calcDuracion()

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">

                {/* Success/Interrupt Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-50"
                        style={{ background: interrumpida ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)' }}
                    />
                    <div className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border ${interrumpida ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}>
                        <span className={`material-icons-outlined text-sm ${interrumpida ? 'text-red-400' : 'text-emerald-400'}`}>
                            {interrumpida ? 'error' : 'verified'}
                        </span>
                        <span className={`font-black text-[10px] tracking-[0.3em] uppercase ${interrumpida ? 'text-red-400' : 'text-emerald-400'}`}>
                            {interrumpida ? 'OPERACIÓN INTERRUMPIDA' : 'OPERACIÓN EXITOSA'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase italic mb-4">
                        Descarga <span className={`text-transparent bg-clip-text bg-gradient-to-r ${interrumpida ? 'from-red-400 to-red-600' : 'from-emerald-400 to-emerald-600'}`}>
                            {interrumpida ? 'Detenida' : 'Completada'}
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        {interrumpida
                            ? 'La operación fue detenida por paro de emergencia. El volumen parcial ha sido registrado.'
                            : 'El proceso de descarga ha sido validado exitosamente por la red de seguridad de '}
                        {!interrumpida && <span className="text-white font-bold tracking-widest">VALIDEX UP</span>}
                        {!interrumpida && '.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                    {/* Reporte Principal (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-10 relative overflow-hidden rounded-3xl shadow-2xl">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]">
                                <span className="material-icons text-[400px]">{interrumpida ? 'cancel' : 'check_circle'}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic">Métricas de Carga</h3>
                                    {loading ? (
                                        <p className="text-slate-500 font-bold animate-pulse">Cargando datos de la operación...</p>
                                    ) : (
                                        <div className="space-y-8">
                                            {[
                                                {
                                                    label: 'Volumen Final Registrado',
                                                    val: `${volumenFinal.toLocaleString('es-MX', { maximumFractionDigits: 0 })} L`,
                                                    icon: 'water_drop',
                                                    color: interrumpida ? 'text-red-400' : 'text-emerald-400'
                                                },
                                                {
                                                    label: 'Volumen Objetivo',
                                                    val: `${volumenObjetivo.toLocaleString('es-MX', { maximumFractionDigits: 0 })} L`,
                                                    icon: 'local_shipping',
                                                    color: 'text-white'
                                                },
                                                {
                                                    label: 'Eficiencia de Descarga',
                                                    val: `${eficiencia}%`,
                                                    icon: 'speed',
                                                    color: Number(eficiencia) >= 95 ? 'text-emerald-400' : 'text-yellow-400'
                                                },
                                                {
                                                    label: 'Duración Total',
                                                    val: duracion,
                                                    icon: 'timer',
                                                    color: 'text-white'
                                                },
                                            ].map(m => (
                                                <div key={m.label} className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                                                        <span className="material-icons-outlined">{m.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{m.label}</p>
                                                        <p className={`text-xl font-black ${m.color} tracking-tight tabular-nums`}>{m.val}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-black/20 rounded-3xl p-8 border border-white/5 backdrop-blur-sm self-start">
                                    <h3 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em] mb-4">Registro en Bitácora</h3>
                                    <div className="space-y-4 font-mono text-[11px] text-slate-500 uppercase">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>ID OPERACIÓN</span>
                                            <span className="text-white">#{String(idOperacion).padStart(6, '0')}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>ESTADO</span>
                                            <span className={interrumpida ? 'text-red-400' : 'text-emerald-400'}>
                                                {interrumpida ? 'INTERRUMPIDA' : 'FINALIZADA'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>TIMESTAMP</span>
                                            <span className="text-white text-[9px]">{new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</span>
                                        </div>
                                        <div className="pt-4 flex flex-col gap-2">
                                            <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                                <div className={`h-full ${interrumpida ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${eficiencia}%` }} />
                                            </div>
                                            <span className={`text-center font-black text-[9px] tracking-[0.2em] ${interrumpida ? 'text-red-400' : 'text-[#10B981]'}`}>
                                                {interrumpida ? 'CARGA PARCIAL REGISTRADA' : 'FIRMA DIGITAL VERIFICADA'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            id="finalized-done"
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-6 bg-[#10B981] hover:bg-emerald-600 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs border border-emerald-500/20"
                        >
                            <span className="material-icons-round">dashboard</span>
                            Finalizar y Volver al Panel
                        </button>
                    </div>

                    {/* Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card bg-[#151e32]/80 border-white/5 p-8 rounded-2xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Datos de la Operación</h3>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">ID de Operación</span>
                                    <span className="text-sm font-black text-white font-mono">#VDX-{String(idOperacion).padStart(6, '0')}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Pipa asignada</span>
                                    <span className="text-sm font-black text-white">#{op?.id_pipa ?? '—'}</span>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${interrumpida ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${interrumpida ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {interrumpida ? 'REGISTRO PARCIAL' : 'PAGO AUTORIZADO'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/pipas')}
                            className="w-full py-4 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] font-black rounded-2xl border border-[#10B981]/20 transition-all text-[10px] tracking-widest uppercase flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round text-sm">local_shipping</span>
                            Nueva Operación
                        </button>
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

export default function DescargaFinalizadaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        }>
            <FinalizadaContent />
        </Suspense>
    )
}
