'use client'
import { useRouter } from 'next/navigation'

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

    return (
        <nav className="w-full px-6 py-6 border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-md relative z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="material-icons-outlined text-white text-xl">verified_user</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-white leading-none">Validex <span className="text-[#10b981]">UP</span></h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-widest mt-0.5">EST. 2026</p>
                    </div>
                </div>

                {/* Stepper Section (Desktop) */}
                <div className="hidden lg:flex items-center gap-16">
                    {steps.map((step, idx) => {
                        const isActive = step.id === currentStep
                        const isCompleted = steps.findIndex(s => s.id === currentStep) > idx
                        return (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className={`flex items-center gap-2.5 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${isActive ? 'bg-[#10b981] border-[#10b981] text-white shadow-glow-emerald' :
                                        isCompleted ? 'bg-emerald-900/30 border-[#10b981]/50 text-[#10b981]' : 'border-slate-700 text-slate-500'
                                        }`}>
                                        {isCompleted ? <span className="material-icons-round text-sm">check</span> : idx + 1}
                                    </div>
                                    <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="w-16 h-px bg-slate-800" />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Support/Cancel Section */}
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-bold">
                        <span className="material-icons-outlined text-sm">help_outline</span>
                        Soporte
                    </button>
                    <button
                        onClick={onCancel || (() => router.push('/'))}
                        className="w-10 h-10 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                    >
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}
