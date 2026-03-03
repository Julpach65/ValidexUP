'use client'

export default function OnboardingSidebar() {
    const features = [
        { icon: 'lock', title: 'Cifrado de Nivel Militar', desc: 'Tus datos están protegidos con AES-256.' },
        { icon: 'verified_user', title: 'Identidad Zero-Trust', desc: 'Validación robusta con múltiples factores.' },
        { icon: 'visibility_off', title: 'Privacidad Total', desc: 'No compartimos tus rasgos biométricos.' },
    ]

    return (
        <aside className="hidden xl:flex w-96 flex-col bg-[#0F172A] border-r border-white/5 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-glow-gradient opacity-30 group-hover:opacity-40 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="flex-grow p-12 flex flex-col justify-center relative z-10">
                <div className="mb-12">
                    <div className="w-20 h-20 flex items-center justify-center mb-6">
                        <img src="/logo-v2.png" alt="Validex Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-4">
                        Seguridad sin <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-emerald-400">Compromisos</span>
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Habilitando un entorno ultra-seguro para la gestión de activos.
                    </p>
                </div>

                <div className="space-y-8">
                    {features.map((f, i) => (
                        <div key={i} className="flex gap-5 group/item">
                            <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center transition-all group-hover/item:border-[#10b981]/50 group-hover/item:bg-[#10b981]/10">
                                <span className="material-icons-outlined text-[#10b981] text-xl transition-all group-hover/item:scale-110">{f.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-12 mt-auto border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <span className="text-xs font-black text-white tracking-[0.2em] uppercase">Validex Protection</span>
                </div>
            </div>
        </aside>
    )
}
