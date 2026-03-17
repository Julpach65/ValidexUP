'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/config/api'
import { useAuth } from '@/hooks/useAuth'
import AppHeader from '@/components/layout/AppHeader'

// Estructura acorde al Pydantic schema del Backend (BitacoraOut)
interface BitacoraLog {
    id_log: number;
    id_usuario: number;
    nombre_responsable: string;
    rol_responsable: string;
    accion: string;
    detalles: string;
    fecha_hora: string;
}

const DecryptedText = ({ text }: { text: string }) => {
    const [displayValue, setDisplayValue] = useState('');
    const chars = "!@#$%^&*()_+{}[]|;:,.<>?";

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayValue(
                text.split("")
                    .map((char, index) => {
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayValue}</span>;
};

export default function BitacoraPage() {
    const { user } = useAuth()
    const [searchTerm, setSearchTerm] = useState('')
    const [logs, setLogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;
                const response = await fetch(`${API_BASE_URL}/operaciones/bitacora`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                }
            } catch (error) {
                console.error("Error cargando bitácora:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBitacora();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.accion.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.nombre_responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detalles.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const headers = ["Accion", "Responsable", "Rol", "Detalles", "Fecha"];
        const rows = filteredLogs.map(log => [
            log.accion,
            log.nombre_responsable,
            log.rol_responsable,
            log.detalles,
            log.fecha_hora
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `bitacora_validex_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                            placeholder="BUSCAR POR EVENTO, USUARIO O DETALLE..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-[11px] font-black tracking-widest placeholder-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-4 bg-white/5 border border-white/5 hover:border-white/20 rounded-xl text-white font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">filter_list</span> Filtrar
                        </button>
                        {user?.rol === 'GERENTE' || user?.rol === 'VISOR' ? (
                            <div className="relative group">
                                <button 
                                    disabled
                                    className="px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-500 font-black text-[10px] tracking-widest uppercase cursor-not-allowed flex items-center gap-2 opacity-60"
                                >
                                    <span className="material-icons-outlined text-sm text-slate-600">lock</span> Exportar
                                </button>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-red-500 text-white text-[9px] font-bold rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    REQUERIDO: ROL ADMINISTRADOR
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={handleExport}
                                className="px-6 py-4 bg-[#10b981] hover:bg-emerald-600 rounded-xl text-white font-black text-[10px] tracking-widest uppercase transition-all shadow-glow-emerald flex items-center gap-2 btn-glow"
                            >
                                <span className="material-icons-outlined text-sm">download</span> Exportar
                            </button>
                        )}
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
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Timestamp</th>
                                    <th className="px-12 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-slate-500 font-bold">Cargando bitácora segura...</td></tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-10 text-slate-500 font-bold">Sin resultados o Bitácora vacía.</td></tr>
                                ) : (
                                filteredLogs.map((log: any) => {
                                    const isSuccess = !log.accion.toLowerCase().includes('denegado') && !log.accion.toLowerCase().includes('fallid');
                                    return (
                                        <tr key={log.id_log} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 max-w-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${isSuccess ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                                    <div>
                                                        <p className="text-sm font-black text-white tracking-tight uppercase group-hover:translate-x-1 transition-transform truncate">
                                                            <DecryptedText text={log.accion} />
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 font-bold truncate">{log.detalles}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[11px] font-black text-white italic uppercase block">{log.nombre_responsable}</span>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">{log.rol_responsable}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-mono text-slate-500 font-bold">
                                                    {new Date(log.fecha_hora).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-12 py-6">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded inline-block tracking-widest ${isSuccess ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                                    {isSuccess ? 'REGISTRADO' : 'ALERTA'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                }))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] border-t border-white/5 bg-[#0B1120]/50 backdrop-blur-md">
                Validex UP © 2026. Todos los derechos reservados.
            </footer>
        </div>
    )
}
