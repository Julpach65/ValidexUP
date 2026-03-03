'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('secretpassword')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // En el diseño original, el login redirige a verificar-sms
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
            <img src="/logo-v2.png" alt="Validex UP Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Validex <span className="text-[#10b981]">UP</span>
          </h1>
        </div>
        <button className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-all shadow-sm">
          Soporte
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="relative">
          <div className="premium-glow absolute -top-20 -left-20 scale-150"></div>
          <div className="premium-glow absolute -bottom-20 -right-20 scale-150 opacity-50"></div>

          <div className="w-full max-w-md glass-card p-8 sm:p-10 transform transition-all hover:scale-[1.005] relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-5 ring-1 ring-[#10b981]/20">
                <span className="material-icons-outlined text-[#10b981] text-3xl">face</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Acceso Seguro al Portal</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Ingresa tus credenciales para acceder al entorno Zero-Trust de Validex UP.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">mail</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all sm:text-sm"
                    id="email"
                    type="email"
                    placeholder="usuario@validex.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                    Contraseña
                  </label>
                  <a className="text-xs font-medium text-[#10b981] hover:text-emerald-400 transition-colors" href="#">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">lock</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-10 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all sm:text-sm tracking-widest"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                id="login-submit"
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full shadow-glow-emerald text-sm font-bold text-white bg-[#10b981] hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#10b981] transition-all duration-200 btn-glow mt-4"
              >
                Iniciar Sesión
                <span className="material-icons-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            {/* Create Account Link (not in original html but added for UX) */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <button onClick={() => router.push('/crear-cuenta')} className="text-[#10b981] font-bold hover:underline">
                  Crear cuenta
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
