'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { API_BASE_URL } from '@/config/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // --- LÓGICA DE COOKIE/POLÍTICA AGREGADA ---
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)

  const handleCreateAccountClick = () => {
    setShowCameraModal(true)
  }

  const handleAcceptPolicies = () => {
    localStorage.setItem('politica_camara_aceptada', 'true')
    setShowCameraModal(false)
    router.push('/crear-cuenta')
  }

  const handleSupportClick = () => {
    setShowSupportModal(true)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCameraModal(false)
        setShowSupportModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const details: any = {
      'username': email,
      'password': password,
    };

    const formBody = Object.keys(details)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
      .join('&');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log("Iniciando solicitud de login...");
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('id_usuario_actual', data.id_usuario);
        localStorage.setItem('registration_step', 'sms');
        
        if (data.has_phone) {
            localStorage.setItem('login_mode', 'true');
        } else {
            localStorage.removeItem('login_mode');
        }
        
        router.push('/verificar-sms');
      } else {
        alert(data.detail || "Credenciales incorrectas");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        alert("El servidor central no responde (Tiempo de espera agotado). Verifique su conexión.");
      } else {
        alert("No se pudo conectar con el servidor central.");
      }
    } finally {
      setLoading(false);
    }
  }


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.33, 1, 0.68, 1] 
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0B1120]">
      <div className="absolute inset-0 z-0 bg-glow-gradient"></div>

      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full px-6 py-6 flex justify-between items-center relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/logo-v2.png" alt="Validex UP Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Validex <span className="text-[#10b981]">UP</span>
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(51, 65, 85, 1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSupportClick}
          className="px-5 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 transition-colors shadow-sm"
        >
          Soporte
        </motion.button>
      </motion.header>

      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          <div className="premium-glow absolute -top-20 -left-20 scale-150 opacity-40"></div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md glass-card p-8 sm:p-10 relative z-10 overflow-hidden"
          >
            {/* LASER SWEEP EFFECT */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-scan pointer-events-none z-20" />

            <div className="flex flex-col items-center text-center mb-8">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-5 ring-1 ring-[#10b981]/20 shadow-glow-emerald"
              >
                <span className="material-icons-outlined text-[#10b981] text-3xl">face</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Acceso Seguro al Portal</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                Ingresa tus credenciales para acceder al entorno Zero-Trust.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">mail</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all"
                    id="email"
                    type="email"
                    placeholder="usuario@validex.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Por políticas de seguridad Zero-Trust, contacte a su administrador superior para restablecer su acceso.")}
                    className="text-xs font-medium text-[#10b981] hover:text-emerald-400 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-outlined text-slate-500 group-focus-within:text-[#10b981] transition-colors">lock</span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-10 py-3 bg-[#0f1623] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition-all tracking-widest"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="material-icons-outlined text-slate-500 hover:text-[#10b981]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                id="login-submit"
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-full text-sm font-bold text-white transition-colors duration-200 mt-4 shadow-glow-emerald ${loading ? 'bg-emerald-800 cursor-not-allowed opacity-70' : 'bg-[#10b981] hover:bg-emerald-600'}`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                    VERIFICANDO IDENTIDAD...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <span className="material-icons-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateAccountClick} 
                  className="text-[#10b981] font-bold hover:text-emerald-400 transition-colors"
                >
                  Crear cuenta
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* MODAL DE SOPORTE */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0f172a] border border-[#10b981]/30 rounded-[2rem] p-8 shadow-glow-emerald relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-scan" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 ring-2 ring-emerald-500/20 shadow-glow-emerald">
                  <span className="material-icons-round text-emerald-500 text-4xl">contact_support</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Soporte Técnico</h3>
                <p className="text-slate-400 text-sm mb-8">
                  Centro de Respuesta Inmediata Validex.
                  <br /><br />
                  <span className="text-emerald-400 font-mono">Upsin@edu.mx</span>
                  <br />
                  Ext. <span className="text-white">8800</span> (7 a 5 PM de lunes a viernes)
                </p>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="w-full py-3 bg-[#10b981] hover:bg-emerald-600 text-[#0B1120] font-black rounded-xl transition-all"
                >
                  ENTENDIDO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL DE POLÍTICAS --- */}
      <AnimatePresence>
        {showCameraModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0f172a] border border-[#10b981]/30 rounded-[2rem] p-8 shadow-glow-emerald relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-scan" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 ring-2 ring-emerald-500/20">
                  <span className="material-icons-round text-emerald-500 text-4xl">videocam</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">Políticas de Seguridad</h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Para el registro en <span className="text-white font-semibold">VALIDEX UP</span>, es obligatorio el uso de la cámara.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={handleAcceptPolicies}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-[#0B1120] font-black rounded-xl transition-all uppercase tracking-widest text-xs"
                  >
                    Aceptar y Continuar
                  </button>

                  <button
                    onClick={() => setShowCameraModal(false)}
                    className="w-full py-4 bg-transparent border border-slate-700 text-slate-500 hover:text-slate-300 font-bold rounded-xl transition-all text-xs uppercase"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="w-full py-8 text-center relative z-10">
        <p className="text-xs text-slate-600 font-medium tracking-wide">
          Validex UP © 2026. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
