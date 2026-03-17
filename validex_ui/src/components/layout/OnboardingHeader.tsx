'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingHeaderProps {
    currentStep: 'registro' | 'sms' | 'cara'
    onCancel?: () => void
}

export default function OnboardingHeader({ currentStep, onCancel }: OnboardingHeaderProps) {
    const router = useRouter()

    const steps = [
        { id: 'registro', label: 'Registro', icon: 'person_add' },
        { id: 'sms', label: 'SMS', icon: 'message' },
        { id: 'cara', label: 'Cara', icon: 'face' },
    ]

    const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep)

    return (
        <nav className="w-full px-6 py-6 border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md relative z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <motion.div 
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        className="w-9 h-9 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20"
                    >
                        <span className="material-icons-outlined text-white text-xl">verified_user</span>
                    </motion.div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-white leading-none">Validex <span className="text-[#10b981]">UP</span></h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-widest mt-0.5">EST. 2026</p>
                    </div>
                </div>

                {/* Stepper Section (Desktop) */}
                <div className="hidden lg:flex items-center gap-16">
                    {steps.map((step, idx) => {
                        const isActive = step.id === currentStep
                        const isCompleted = getCurrentStepIndex() > idx
                        
                        return (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className={`flex items-center gap-2.5 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className="relative">
                                        {/* Pulse Halo for Active Step */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1.5, opacity: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                                                    className="absolute inset-x-0 inset-y-0 rounded-full bg-[#10b981]/30 z-0"
                                                />
                                            )}
                                        </AnimatePresence>
                                        
                                        <motion.div 
                                            initial={false}
                                            animate={{ 
                                                scale: isActive ? 1.1 : 1,
                                                borderColor: isActive || isCompleted ? '#10b981' : '#334155'
                                            }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all relative z-10 ${
                                                isActive ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                                isCompleted ? 'bg-emerald-900/30 text-[#10b981]' : 'bg-transparent text-slate-500'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <motion.span 
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="material-icons-round text-sm"
                                                >
                                                    check
                                                </motion.span>
                                            ) : (
                                                <span>{idx + 1}</span>
                                            )}
                                        </motion.div>
                                    </div>
                                    <span className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="relative w-16 h-px bg-slate-800 overflow-hidden">
                                        {/* Connection Energy Flow */}
                                        {(isActive || isCompleted) && (
                                            <motion.div 
                                                initial={{ left: '-100%' }}
                                                animate={{ left: '100%' }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#10b981] to-transparent opacity-50"
                                            />
                                        )}
                                        {isCompleted && (
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute top-0 bottom-0 left-0 bg-[#10b981]/40"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Support/Cancel Section */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-bold active:scale-95">
                        <span className="material-icons-outlined text-sm">help_outline</span>
                        Soporte
                    </button>
                    <button
                        onClick={onCancel || (() => router.push('/'))}
                        className="w-10 h-10 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-90"
                    >
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
