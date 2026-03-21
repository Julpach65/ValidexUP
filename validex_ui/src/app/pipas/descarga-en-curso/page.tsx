'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from '@/config/api'
import AppHeader from '@/components/layout/AppHeader'

export const dynamic = 'force-dynamic';

interface OperacionState {
    id_operacion: number
    volumen_actual: number
    volumen_objetivo: number
    caudal_lpm: number
    estado: string
    progreso_pct: number
}

function DescargaContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const idOperacion = searchParams.get('id_operacion')

    const [op, setOp] = useState<OperacionState | null>(null)
    const [elapsedSecs, setElapsedSecs] = useState(0)
    const [stoppingEmergency, setStoppingEmergency] = useState(false)
    const [finalizando, setFinalizando] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const wsRef = useRef<WebSocket | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const startTimer = useCallback(() => {
        timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000)
    }, [])

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
    }, [])

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const [lastDataTime, setLastDataTime] = useState(Date.now());
    const [isDataFresh, setIsDataFresh] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now - lastDataTime > 5000) {
                setIsDataFresh(false);
            } else {
                setIsDataFresh(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [lastDataTime]);

    useEffect(() => {
        if (!idOperacion) {
            setError('No se proporcionó un ID de operación válido.')
            if (wsRef.current) wsRef.current.close();
            return
        }

        const token = localStorage.getItem('access_token')
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${window.location.host}/api/v1/operaciones/ws/descarga/${idOperacion}?token=${token}`;
        const ws = new WebSocket(wsUrl)
        wsRef.current = ws

        ws.onopen = () => {
            startTimer()
            setLastDataTime(Date.now());
        }

        ws.onmessage = (event) => {
            setLastDataTime(Date.now());
            try {
                const data = JSON.parse(event.data) as OperacionState
                setOp(data)
                if (data.estado === 'FINALIZADA') {
                    stopTimer()
                    setTimeout(() => {
                        router.push(`/pipas/descarga-finalizada?id_operacion=${idOperacion}`)
                    }, 1500)
                }
                if (data.estado === 'INTERRUMPIDA') {
                    stopTimer()
                }
            } catch {
            }
        }

        ws.onerror = () => {
            setError(null)
            const pollInterval = setInterval(async () => {
                try {
                    const token = localStorage.getItem('access_token')
                    const res = await fetch(
                        `${API_BASE_URL}/operaciones/${idOperacion}/estado`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    if (res.ok) {
                        setLastDataTime(Date.now());
                        const data = await res.json()
                        const operacion: OperacionState = {
                            ...data,
                            volumen_actual: Number(data.volumen_actual),
                            volumen_objetivo: Number(data.volumen_objetivo),
                            caudal_lpm: Number(data.caudal_lpm),
                            progreso_pct: data.volumen_objetivo > 0
                                ? Math.round((Number(data.volumen_actual) / Number(data.volumen_objetivo)) * 100 * 10) / 10
                                : 0
                        }
                        setOp(operacion)
                        if (operacion.estado === 'FINALIZADA') {
                            clearInterval(pollInterval)
                            stopTimer()
                            setTimeout(() => {
                                router.push(`/pipas/descarga-finalizada?id_operacion=${idOperacion}`)
                            }, 1500)
                        }
                        if (operacion.estado === 'INTERRUMPIDA') {
                            clearInterval(pollInterval)
                            stopTimer()
                        }
                    }
                } catch { }
            }, 1000)
            startTimer()
            return () => clearInterval(pollInterval)
        }

        return () => {
            ws.close()
            stopTimer()
        }
    }, [idOperacion, router, startTimer, stopTimer])

    const handleEmergencia = async () => {
        if (!idOperacion || stoppingEmergency) return
        setStoppingEmergency(true)
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/operaciones/${idOperacion}/interrumpir`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                stopTimer()
                wsRef.current?.close()
                router.push(`/pipas/descarga-finalizada?id_operacion=${idOperacion}&interrumpida=1`)
            } else {
                const err = await res.json()
                alert(`Error al detener: ${err.detail || 'Error desconocido.'}`)
                setStoppingEmergency(false)
            }
        } catch {
            alert('Error de red al enviar paro de emergencia.')
            setStoppingEmergency(false)
        }
    }

    const handleFinalizar = async () => {
        if (!idOperacion || finalizando) return
        if (op?.estado !== 'FINALIZADA') {
            alert(`La descarga aún no ha completado el volumen objetivo. Estado: ${op?.estado}`)
            return
        }
        setFinalizando(true)
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/operaciones/${idOperacion}/finalizar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                router.push(`/pipas/descarga-finalizada?id_operacion=${idOperacion}`)
            } else {
                const err = await res.json()
                alert(`Error al finalizar: ${err.detail}`)
                setFinalizando(false)
            }
        } catch {
            alert('Error de red al finalizar la operación.')
            setFinalizando(false)
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-red-400 font-bold text-center p-8">
                {error}
                <br />
                <button onClick={() => router.push('/pipas')} className="mt-4 text-slate-400 underline text-sm">
                    Volver a Pipas
                </button>
            </div>
        )
    }

    const progreso = op?.progreso_pct ?? 0
    const litrosActuales = op?.volumen_actual ?? 0
    const litrosobjetivo = op?.volumen_objetivo ?? 0
    const caudalLpm = op?.caudal_lpm ?? 0
    const estadoOp = op?.estado ?? 'INICIADA'

    // Bubbles generator based on flow
    const bubbles = useMemo(() => {
        if (caudalLpm <= 0) return []
        const count = Math.min(Math.floor(caudalLpm / 10), 15)
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: 1 + Math.random() * 2,
            delay: Math.random() * 2,
            size: 2 + Math.random() * 4
        }))
    }, [caudalLpm])

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
                {/* Status Warning Banner (Inactivity) */}
                <AnimatePresence>
                    {!isDataFresh && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-amber-500/5">
                                <span className="material-icons-round text-amber-500 animate-pulse">wifi_off</span>
                                <div>
                                    <p className="text-amber-500 font-black text-[10px] tracking-widest uppercase">Inestabilidad de Red Detectada</p>
                                    <p className="text-white/70 text-xs">No se han recibido paquetes de telemetría en los últimos 5s. El motor sigue operando, pero la vista visual puede estar desfasada.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Terminal Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <motion.span 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="material-icons-outlined text-emerald-400"
                            >
                                downloading
                            </motion.span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`font-black text-[10px] tracking-widest uppercase italic ${estadoOp === 'INTERRUMPIDA' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {estadoOp === 'EN_PROGRESO' ? 'EN PROCESO' : estadoOp === 'FINALIZADA' ? 'COMPLETADA' : estadoOp === 'INTERRUMPIDA' ? 'INTERRUMPIDA' : 'INICIANDO...'}
                                </span>
                                <div className={`w-1 h-1 rounded-full ${estadoOp === 'INTERRUMPIDA' ? 'bg-red-400' : 'bg-emerald-400 animate-ping'}`} />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase italic">
                                Descarga de Fluido <span className={estadoOp === 'INTERRUMPIDA' ? 'text-red-400' : 'text-emerald-400'}>
                                    {estadoOp === 'INTERRUMPIDA' ? 'Detenida' : 'Activa'}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#151e32] border border-white/5 rounded-2xl p-4 shadow-2xl relative">
                        {/* Heartbeat Indicator */}
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                            <motion.div 
                                animate={isDataFresh ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className={`w-3 h-3 rounded-full ${isDataFresh ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`}
                            />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-end gap-2">
                                <span className="material-icons-round text-[10px]">sensors</span>
                                VDX SECURE STREAM
                            </p>
                            <p className="text-sm font-black text-white px-2 py-1 bg-white/5 rounded mt-1 tabular-nums">
                                #VDX-{String(idOperacion).padStart(6, '0')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Métricas en tiempo real */}
                    <div className="lg:col-span-4 space-y-6">
                        {[
                            { label: 'Flujo de Carga (L/min)', val: Number(caudalLpm) > 0 ? `${Number(caudalLpm).toFixed(0)}` : '—', icon: 'speed', color: 'text-emerald-400', glow: 'shadow-glow-emerald' },
                            { label: 'Tiempo Transcurrido', val: formatTime(elapsedSecs), icon: 'timer', color: 'text-white', glow: '' },
                            { label: 'M3 Transferidos', val: Number(litrosActuales) > 0 ? `${(Number(litrosActuales) / 1000).toFixed(3)} m³` : '—', icon: 'water_drop', color: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' },
                        ].map((item, idx) => (
                            <motion.div 
                                key={item.label}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`glass-card bg-[#151e32]/80 border-white/5 p-6 flex items-center gap-5 group hover:border-emerald-500/20 transition-all rounded-2xl ${Number(caudalLpm) > 0 && item.glow ? item.glow : ''}`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                    <span className="material-icons-outlined transition-transform duration-500 group-hover:scale-110">{item.icon}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className={`text-xl font-black ${item.color} tracking-tight tabular-nums`}>{item.val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Terminal Central */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card bg-[#151e32]/90 border-white/5 p-10 relative overflow-hidden rounded-3xl shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-scan pointer-events-none z-20" />

                            <div className="flex flex-col items-center text-center">
                                <div className="text-[100px] font-black text-white leading-none tracking-tighter mb-4 tabular-nums relative">
                                    <motion.span
                                        key={progreso}
                                        initial={{ opacity: 0.8 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {progreso.toFixed(1)}
                                    </motion.span>
                                    <span className="text-3xl text-emerald-400 absolute md:top-6 ml-2">%</span>
                                </div>
                                <p className="text-sm font-black text-slate-400 tracking-[0.3em] uppercase mb-10">
                                    {op ? 'DATOS EN TIEMPO REAL — VALIDEX SECURE STREAM' : 'CONECTANDO CON EL MOTOR...'}
                                </p>

                                {/* Barra de Progreso LÍQUIDA */}
                                <div className="w-full h-14 bg-black/40 rounded-2xl border border-white/5 p-1.5 relative overflow-hidden mb-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(progreso, 100)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full rounded-xl relative overflow-hidden flex items-center shadow-[0_0_20px_rgba(16,185,129,0.3)] ${estadoOp === 'INTERRUMPIDA' ? 'bg-gradient-to-r from-red-700 to-red-500' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                                    >
                                        {/* Surface Wave Effect */}
                                        <motion.div 
                                            animate={{ x: [-100, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="absolute top-0 left-0 h-[4px] w-[200%] opacity-30"
                                            style={{ 
                                                background: 'linear-gradient(90deg, transparent, white, transparent)',
                                                maskImage: 'url("/wave-pattern.svg")',
                                                filter: 'blur(1px)'
                                            }}
                                        />

                                        {/* Animated Bubbles */}
                                        <AnimatePresence>
                                            {bubbles.map(bubble => (
                                                <motion.div
                                                    key={bubble.id}
                                                    initial={{ bottom: -10, opacity: 0 }}
                                                    animate={{ 
                                                        bottom: '120%', 
                                                        opacity: [0, 0.6, 0] 
                                                    }}
                                                    transition={{ 
                                                        duration: bubble.duration, 
                                                        delay: bubble.delay, 
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                    }}
                                                    className="absolute bg-white/40 rounded-full blur-[1px]"
                                                    style={{ 
                                                        left: bubble.left, 
                                                        width: bubble.size, 
                                                        height: bubble.size 
                                                    }}
                                                />
                                            ))}
                                        </AnimatePresence>

                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shimmer" />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 group hover:border-[#10b981]/30 transition-all">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 italic">Total Transferido</p>
                                        <p className="text-3xl font-black text-white tabular-nums">
                                            {litrosActuales.toLocaleString('es-MX', { maximumFractionDigits: 0 })} <span className="text-sm text-slate-500">L</span>
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 group hover:border-[#10b981]/30 transition-all">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 italic">Volumen Objetivo</p>
                                        <p className="text-3xl font-black text-emerald-400 tabular-nums">
                                            {litrosobjetivo.toLocaleString('es-MX', { maximumFractionDigits: 0 })} <span className="text-sm text-slate-500">L</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Botonera de Control */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                id="btn-emergencia"
                                onClick={handleEmergencia}
                                disabled={stoppingEmergency || estadoOp === 'INTERRUMPIDA' || estadoOp === 'FINALIZADA'}
                                className="flex-1 py-5 bg-white/5 hover:bg-red-500/20 text-white font-black rounded-2xl border border-white/5 hover:border-red-500/40 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                <span className="material-icons-outlined text-red-500">stop_circle</span>
                                {stoppingEmergency ? 'DETENIENDO...' : 'Interrupción de Emergencia'}
                            </button>
                            <button
                                id="btn-finalizar"
                                onClick={handleFinalizar}
                                disabled={finalizando || estadoOp !== 'FINALIZADA'}
                                className="flex-1 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] border border-emerald-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                <motion.span 
                                    animate={estadoOp === 'FINALIZADA' ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="material-icons-outlined"
                                >
                                    check_circle
                                </motion.span>
                                {finalizando ? 'REGISTRANDO...' : estadoOp === 'FINALIZADA' ? 'Confirmar y Registrar' : 'Esperando Completar...'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center bg-[#0F172A] border-t border-white/5 relative z-10">
                <p className="text-[10px] text-slate-600 font-bold tracking-[0.4em] uppercase">
                    Validex UP © 2026. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
}

export default function DescargaEnCursoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        }>
            <DescargaContent />
        </Suspense>
    )
}
