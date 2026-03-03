'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CrearCuentaPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        router.push('/verificar-sms')
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0B1120]">
            {/* Glow Background Gradient */}
            <div className="absolute inset-0 z-0 bg-glow-gradient"></div>

            {/* Official Header */}
            <header className="w-full px-6 py-6 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                        <img src="/logo.png" alt="Validex Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        Validex <span className="text-[#10b981]">UP</span>
                    </h1>
                </div>
                <button className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-all shadow-sm">
                    Soporte
                </button>
            </header>

            {/* Main Card */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <div className="relative">
                    <div className="premium-glow absolute -top-20 -left-20 scale-150 opacity-70"></div>
                    <div className="premium-glow absolute -bottom-20 -right-20 scale-150 opacity-40"></div>

                    <div className="w-full max-w-md glass-card p-8 sm:p-10 transform transition-all hover:scale-[1.002] relative z-10">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-5 ring-1 ring-[#10b981]/20">
                                <span className="material-icons-outlined text-[#10b981] text-3xl">person_add</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Crea tu Cuenta</h2>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                                Regístrate para comenzar el proceso de verificación biométrica de Validex UP.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nombre Completo */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Nombre Completo</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">badge</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Ej. Juan Pérez"
                                        required
                                        type="text"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">mail</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all sm:text-sm"
                                        placeholder="usuario@validex.com"
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">lock</span>
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-10 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all sm:text-sm tracking-widest"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10"
                                    >
                                        <span className="material-icons-outlined text-slate-500 hover:text-[#10b981] transition-colors">
                                            {showPassword ? "visibility" : "visibility_off"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <button
                                id="signup-submit"
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full shadow-glow-emerald text-sm font-bold text-white bg-[#10b981] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#10b981] transition-all duration-200 btn-glow mt-4"
                            >
                                Registrarse ahora
                                <span className="material-icons-outlined text-lg">arrow_forward</span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                ¿Ya tienes cuenta?{' '}
                                <button onClick={() => router.push('/')} className="text-[#10b981] font-bold hover:underline">
                                    Inicia sesión
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center relative z-10">
                <p className="text-xs text-slate-600 font-medium tracking-wide">
                    Validex UP © 2026. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    )
}
