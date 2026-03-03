'use client'
import { useRouter, usePathname } from 'next/navigation'

interface AppHeaderProps {
    user?: {
        name: string;
        role: string;
    };
    title?: React.ReactNode;
}

export default function AppHeader({ user, title }: AppHeaderProps) {
    const router = useRouter()
    const pathname = usePathname()

    const currentUser = user || { name: 'EL NOYER', role: 'Administrador' }
    const currentTitle = title || (
        <>Validex <span className="text-[#10b981]">UP</span></>
    )

    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
        { label: 'Operaciones', icon: 'local_shipping', href: '/pipas' },
        { label: 'Bitácora', icon: 'history', href: '/bitacora' },
    ]

    return (
        <header className="w-full h-20 bg-[#0F172A] border-b border-white/5 relative z-30 shadow-2xl">
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                {/* Left: Branding */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => router.push('/dashboard')}>
                        <img src="/logo-v2.png" alt="Validex Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-black text-white leading-none tracking-tight uppercase">
                            {currentTitle}
                        </h1>
                    </div>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map(item => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.href)}
                                className={`px-5 py-2.5 rounded-full flex items-center gap-2.5 text-sm font-bold tracking-wide transition-all ${isActive
                                    ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 shadow-glow-emerald'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <span className={`material-icons-outlined text-xl ${isActive ? 'text-[#10b981]' : 'text-slate-500'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                {/* Right: User Profile & Utils */}
                <div className="flex items-center gap-4">
                    <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all">
                        <span className="material-icons-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#10b981] rounded-full ring-2 ring-[#0F172A]"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                        <div className="hidden text-right lg:block">
                            <p className="text-xs font-black text-white uppercase tracking-wider">{currentUser.name}</p>
                            <p className="text-[10px] text-[#10b981] font-bold">{currentUser.role}</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="w-10 h-10 rounded-full border-2 border-[#10b981] p-0.5 group overflow-hidden transition-transform active:scale-95"
                        >
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                <span className="material-icons-round text-slate-500 text-3xl translate-y-1">person</span>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </header>
    )
}
