'use client'
import { useRouter } from 'next/navigation'

export default function ReconocimientoFallidoPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col bg-[#0B111D] text-slate-300 font-sans selection:bg-red-500 selection:text-white">
            <style jsx global>{`
                .glass-panel {
                    background-color: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(239, 68, 68, 0.1);
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(239, 68, 68, 0.8);
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
                    animation: scan 3s linear infinite;
                    opacity: 0.5;
                }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>

            {/* Header Redesign for Error State */}
            <header className="w-full px-6 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl">
                <div className="flex items-center space-x-3 cursor-pointer mb-8 md:mb-0" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Validex UP Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-red-500">UP</span>
                    </div>
                </div>

                {/* Unified Stepper (Cara Fallida) */}
                <div className="w-full max-w-md relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>

                        {/* Step 1: Registro (Completed) */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Registro</span>
                        </div>

                        {/* Progress Line 1 */}
                        <div className="absolute top-1/2 left-[15%] w-[35%] h-0.5 bg-[#10B981]/50 -z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>

                        {/* Step 2: SMS (Completed) */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">SMS</span>
                        </div>

                        {/* Progress Line 2 */}
                        <div className="absolute top-1/2 left-[50%] w-[35%] h-0.5 bg-red-500/30 -z-10 transform -translate-y-1/2 border-dashed border-red-500/20 border-t"></div>

                        {/* Step 3: Cara (Active Failure) */}
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B111D] px-3">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-14 h-14 bg-red-500/25 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] border-2 border-red-500/20 relative z-10 transition-all">
                                <span className="material-icons-round text-xl">face</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-red-500 uppercase mt-1">Rechazado</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="hidden md:block px-5 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border border-white/10">
                    Cancelar
                </button>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-bold tracking-wider mb-6 animate-pulse">
                    <span className="material-icons-outlined text-sm">error_outline</span>
                    <span>ERROR DE IDENTIDAD</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    Acceso Denegado
                </h1>
                <p className="text-gray-400 text-center max-w-lg mb-12 leading-relaxed">
                    La verificación de identidad ha fallado. Por razones de seguridad, su acceso ha sido restringido. Por favor, póngase en contacto con soporte técnico.
                </p>

                <div className="relative w-full max-w-md aspect-square bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl mb-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-60"></div>

                    {/* Silhouette Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="material-icons-round text-[200px] text-gray-600">person</span>
                    </div>

                    <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-red-500 rounded-tl-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-red-500 rounded-tr-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-red-500 rounded-bl-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-red-500 rounded-br-lg shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>

                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/80 px-3 py-1 rounded-full border border-red-500/50">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">Denegado</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-hidden">
                            <div className="scan-line"></div>
                            <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-4 bg-red-500/10">
                                <span className="material-icons-round text-red-500 text-4xl">close</span>
                            </div>
                            <div className="px-4 py-1.5 bg-red-500 rounded text-white text-xs font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                Acceso Denegado
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full max-w-sm bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white font-semibold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transform transition hover:scale-[1.02] flex items-center justify-center space-x-3 mb-6">
                    <span className="material-icons-outlined">headset_mic</span>
                    <span className="text-lg">Llamar a Soporte</span>
                </button>

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-12">
                    <button onClick={() => router.push('/registro-cara/validar')} className="flex items-center space-x-2 hover:text-white transition-colors group">
                        <span className="material-icons-outlined text-lg group-hover:rotate-180 transition-transform duration-500">refresh</span>
                        <span>Reintentar</span>
                    </button>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button className="flex items-center space-x-2 hover:text-white transition-colors">
                        <span className="material-icons-outlined text-lg">help_outline</span>
                        <span>Ayuda</span>
                    </button>
                </div>
            </main>

            <footer className="w-full py-6 text-center text-xs text-slate-600 border-t border-gray-800/50">
                <div className="flex items-center justify-center space-x-2">
                    <span className="material-icons-outlined text-sm">lock</span>
                    <span>Cifrado de extremo a extremo • Conexión Segura</span>
                </div>
            </footer>
        </div>
    )
}
