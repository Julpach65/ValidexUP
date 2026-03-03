'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppHeader from '@/components/layout/AppHeader'
import GaugeCircle from '@/components/ui/GaugeCircle'

const PIPAS = [
    { id: 'MX-8921', empresa: 'Transportes del Norte S.A.', capacidad: 15000, disponible: 9500, status: 'Disponible' },
    { id: 'MX-7734', empresa: 'Flota Central Mx', capacidad: 12000, disponible: 12000, status: 'Disponible' },
    { id: 'MX-5501', empresa: 'Logística Sur', capacidad: 18000, disponible: 7200, status: 'En Espera' },
]

export default function PipasPage() {
    const router = useRouter()
    const [selectedPipa, setSelectedPipa] = useState(PIPAS[0])
    const [volumen, setVolumen] = useState('')
    const [loading, setLoading] = useState(false)

    const fillPercent = Math.round(((selectedPipa.capacidad - selectedPipa.disponible) / selectedPipa.capacidad) * 100)

    const handleAutorizar = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1500))
        router.push('/pipas/descarga-en-curso')
    }

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Background glow accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />

            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">

                {/* Navigation Breadcrumb-like */}
                <button onClick={() => router.push('/dashboard')} className="group inline-flex items-center text-[10px] font-black text-slate-500 hover:text-[#10B981] tracking-[0.2em] uppercase transition-colors mb-10">
                    <span className="material-icons-outlined text-sm mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    VOLVER AL CENTRO DE CONTROL
                </button>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-outlined text-[#10B981] text-xl">local_shipping</span>
                        <span className="text-[#10B981] font-black text-[10px] tracking-[0.3em] uppercase">MÓDULO DE OPERACIONES</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Autorización <br /> de <span className="text-[#10b981]">Unidad</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* List Section (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Unidades Autorizadas</h2>
                        {PIPAS.map(p => (
                            <button
                                key={p.id}
                                id={`pipa-${p.id}`}
                                onClick={() => setSelectedPipa(p)}
                                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedPipa.id === p.id
                                    ? 'bg-[#10B981]/10 border-[#10B981]/40 shadow-glow-emerald'
                                    : 'bg-[#151e32] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {selectedPipa.id === p.id && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981] opacity-[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xl font-black tracking-tight ${selectedPipa.id === p.id ? 'text-[#10B981]' : 'text-white'}`}>{p.id}</span>
                                    <span className={`text-[9px] font-black px-2.5 py-1 rounded border uppercase tracking-widest ${selectedPipa.id === p.id ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-slate-800 border-slate-700 text-slate-500'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium mb-3">{p.empresa}</p>
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 tracking-wider">
                                    <span>CAPACIDAD</span>
                                    <span className="text-slate-300">{p.capacidad.toLocaleString()} L</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Interactive Authorization Section (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Visual HUD Card */}
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-8 flex flex-col md:flex-row items-center gap-10">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#10b981] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <GaugeCircle
                                    value={fillPercent}
                                    maxLabel={`${selectedPipa.capacidad.toLocaleString()} L`}
                                    currentLabel={`${fillPercent}%`}
                                />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-1">{selectedPipa.id}</h2>
                                    <p className="text-slate-400 font-bold text-sm tracking-wide">{selectedPipa.empresa}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Disponible</p>
                                        <p className="text-xl font-black text-[#10B981]">{selectedPipa.disponible.toLocaleString()} L</p>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Nivel Actual</p>
                                        <p className="text-xl font-black text-white">{fillPercent}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-icons-outlined text-[#10B981]">assignment_turned_in</span>
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">Autorización de Carga</h3>
                            </div>

                            <form onSubmit={handleAutorizar} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Unidad Confirmada</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">local_shipping</span>
                                            <input
                                                type="text"
                                                value={selectedPipa.id}
                                                readOnly
                                                className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-sm font-black opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Volumen a Cargar (L)</label>
                                        <div className="relative group">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-[#10B981] transition-colors">water_drop</span>
                                            <input
                                                id="auth-volumen"
                                                type="number"
                                                required
                                                min="1"
                                                max={selectedPipa.disponible}
                                                value={volumen}
                                                onChange={e => setVolumen(e.target.value)}
                                                placeholder={`MÁX. ${selectedPipa.disponible.toLocaleString()}`}
                                                className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm font-black transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    id="auth-submit"
                                    type="submit"
                                    disabled={loading || !volumen}
                                    className="w-full py-5 bg-[#10B981] hover:bg-emerald-600 text-white font-black rounded-full shadow-glow-emerald transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-40 btn-glow"
                                >
                                    {loading ? (
                                        <><span className="material-symbols-outlined text-xl animate-spin">sync</span> PROCESANDO AUDITORÍA...</>
                                    ) : (
                                        <>AUTORIZAR OPERACIÓN</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto border-t border-gray-800 bg-[#0d121d] py-6">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-slate-500 font-bold tracking-[0.4em] uppercase">Validex UP © 2026. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
