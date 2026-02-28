'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Truck, AlertTriangle, Fingerprint, Lock } from 'lucide-react';
import { APP_INFO, PIPAS_MOCK } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

export default function PipasPage() {
    const router = useRouter();
    const [selectedPipa, setSelectedPipa] = useState(PIPAS_MOCK[0].id);
    const [litros, setLitros] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const activePipa = PIPAS_MOCK.find(p => p.id === selectedPipa) || PIPAS_MOCK[0];
    const fillPercentage = (activePipa.actual / activePipa.capacidad) * 100;

    const handleAuthorize = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <div className="bg-[#0f172a] min-h-screen font-sans text-slate-200">

            <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div className="hidden sm:block text-xl font-bold tracking-tight text-white">
                                Gestión de <span className="text-emerald-500">Pipas</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-wide">
                        <Lock className="w-4 h-4" /> Auth Biométrico Requerido
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Autorización de Descarga</h1>
                    <p className="text-slate-400">Selecciona el ID del transporte y la cantidad de litros a despachar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Formulario Lateral */}
                    <div className="lg:col-span-7 space-y-6">
                        <form onSubmit={handleAuthorize} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8">

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificador de Pipa</label>
                                <select
                                    className="w-full h-14 bg-slate-900 border border-slate-700 rounded-xl text-white px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-medium cursor-pointer"
                                    value={selectedPipa}
                                    onChange={(e) => setSelectedPipa(e.target.value)}
                                >
                                    {PIPAS_MOCK.map((pipa) => (
                                        <option key={pipa.id} value={pipa.id}>{pipa.id} - Cap. {pipa.capacidad.toLocaleString()} L</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Litros a Descargar</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        max={activePipa.capacidad - activePipa.actual}
                                        value={litros}
                                        onChange={(e) => setLitros(e.target.value)}
                                        required
                                        className="w-full h-16 bg-slate-900 border border-slate-700 rounded-xl text-emerald-500 px-6 text-3xl font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Lts</div>
                                </div>

                                {Number(litros) > (activePipa.capacidad - activePipa.actual) && (
                                    <div className="flex items-start gap-2 text-red-400 text-sm mt-2 p-3 bg-red-400/10 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 shrink-0" />
                                        <p>El volumen ingresado excede la capacidad disponible de la pipa seleccionada.</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                                <Fingerprint className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Firma de Responsabilidad</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Esta acción quedará registrada en la bitácora criptográfica e inmutable.
                                        Confirmar iniciará el proceso de reconocimiento facial como firma digital.
                                    </p>
                                </div>
                            </div>

                            <Button type="submit" size="lg" fullWidth isLoading={isLoading} className="mt-8 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                Autorizar Transacción
                            </Button>
                        </form>
                    </div>

                    {/* Panel Visual (Gauge) */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px]">
                            <div className="text-center mb-8">
                                <h3 className="text-white font-bold text-xl">{activePipa.id}</h3>
                                <p className="text-slate-400 text-sm uppercase tracking-wide">Estado de Carga</p>
                            </div>

                            {/* Custom Gauge */}
                            <div className="relative w-48 h-48 rounded-full border-[6px] border-slate-800 flex items-center justify-center shadow-inner">
                                {/* Pseudo-gauge fill - for visual purposes */}
                                <div className="absolute inset-0 rounded-full border-[6px] border-emerald-500" style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - fillPercentage}%, 0 ${100 - fillPercentage}%)` }}></div>

                                <div className="flex flex-col items-center z-10">
                                    <span className="text-4xl font-black text-white">{fillPercentage.toFixed(1)}%</span>
                                </div>
                            </div>

                            <div className="mt-10 w-full space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Capacidad Total</span>
                                    <span className="text-white font-bold">{activePipa.capacidad.toLocaleString()} Lts</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Volumen Actual</span>
                                    <span className="text-emerald-500 font-bold">{activePipa.actual.toLocaleString()} Lts</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-slate-700 pt-3">
                                    <span className="text-slate-400 font-medium">Bolsa Disponible</span>
                                    <span className="text-white font-bold">{(activePipa.capacidad - activePipa.actual).toLocaleString()} Lts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
