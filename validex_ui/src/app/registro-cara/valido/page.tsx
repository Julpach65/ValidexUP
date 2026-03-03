'use client'
import { useRouter } from 'next/navigation'
import OnboardingHeader from '@/components/layout/OnboardingHeader'
import OnboardingSidebar from '@/components/layout/OnboardingSidebar'

export default function ReconocimientoValidoPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col bg-[#0B111D] text-slate-300 font-sans selection:bg-[#10B981] selection:text-white">
            <style jsx global>{`
                .glass-panel {
                    background-color: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(16, 185, 129, 0.1);
                }
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(16, 185, 129, 0.8);
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
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
            <header className="w-full px-6 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl">
                <div className="flex items-center space-x-3 cursor-pointer mb-8 md:mb-0" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Validex UP Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-[#10B981]">UP</span>
                    </div>
                </div>

                {/* Unified Stepper (Todo Completado) */}
                <div className="w-full max-w-md relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10B981]/20 -z-10 transform -translate-y-1/2"></div>

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
                        <div className="absolute top-1/2 left-[50%] w-[35%] h-0.5 bg-[#10B981]/50 -z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>

                        {/* Step 3: Cara (Completed) */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] border-2 border-[#10B981]/20 relative z-10">
                                <span className="material-icons-round text-xl">verified</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-white uppercase mt-1">Validado</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block w-32"></div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-bold tracking-wider mb-6 uppercase">
                    <span>IDENTIDAD CONFIRMADA</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    Acceso Concedido
                </h1>
                <p className="text-gray-400 text-center max-w-lg mb-12 leading-relaxed">
                    La verificación de identidad ha sido exitosa. Sus biometrías han sido validadas. Redirigiendo al sistema de gestión seguro.
                </p>
                <div className="relative w-full max-w-md aspect-square bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl mb-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="material-icons-round text-[200px] text-gray-600">person</span>
                    </div>
                    <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-[#10B981] rounded-tl-lg shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-[#10B981] rounded-tr-lg shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-[#10B981] rounded-bl-lg shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-[#10B981] rounded-br-lg shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/80 px-3 py-1 rounded-full border border-[#10B981]/50">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-[#10B981] tracking-widest uppercase">Autorizado</span>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-48 h-48 border border-[#10B981]/30 rounded-2xl flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-hidden">
                            <div className="scan-line"></div>
                            <div className="w-16 h-16 rounded-full border-2 border-[#10B981]/50 flex items-center justify-center bg-[#10B981]/10">
                                <span className="material-icons-round text-[#10B981] text-4xl">check</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => router.push('/dashboard')} className="w-full max-w-sm bg-gradient-to-r from-[#10B981] to-emerald-500 hover:from-emerald-500 hover:to-[#10B981] text-white font-semibold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transform transition hover:scale-[1.02] flex items-center justify-center space-x-3 mb-6">
                    <span className="text-lg">Ingresar al Dashboard</span>
                    <span className="material-icons-outlined">arrow_forward</span>
                </button>
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
