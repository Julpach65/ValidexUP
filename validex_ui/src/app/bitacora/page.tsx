'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft, FileText, Download, CheckCircle2, XCircle } from 'lucide-react';
import { APP_INFO, LOGS_MOCK } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

export default function BitacoraPage() {
    const router = useRouter();
    const [logs] = useState(LOGS_MOCK);

    return (
        <div className="bg-[#0f172a] min-h-screen font-sans text-slate-200">

            <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="hidden sm:block text-xl font-bold tracking-tight text-white">
                                Validex <span className="text-blue-500">Log / Audit</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                        <Download className="w-4 h-4" /> Exportar a CSV
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Accesos y Descargas</h1>
                    <p className="text-slate-400">Registro inmutable de auditoría para toda transacción y validación ocurrida en el sistema.</p>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-bold">
                                    <th className="p-5 pl-8 w-32">Hora</th>
                                    <th className="p-5">Acción Realizada</th>
                                    <th className="p-5">Usuario / Entidad</th>
                                    <th className="p-5 pr-8 w-40 text-right">Estatus Org</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-5 pl-8 text-slate-400 font-mono text-sm align-middle">
                                            {log.time}
                                        </td>
                                        <td className="p-5 align-middle">
                                            <div className="flex items-center gap-3 text-white font-medium">
                                                <span className="material-icons-rounded text-slate-500 text-xl">{log.icon}</span>
                                                {log.action}
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-300 align-middle">
                                            {log.user}
                                        </td>
                                        <td className="p-5 pr-8 align-middle text-right">
                                            {log.status === 'EXITO' ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wider">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> EXITO
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 text-[10px] font-bold tracking-wider">
                                                    <XCircle className="w-3.5 h-3.5" /> DENEGADO
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-slate-800/50 p-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
                        <span>Mostrando {logs.length} de {logs.length} registros</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50">Anterior</button>
                            <button className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50">Siguiente</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
