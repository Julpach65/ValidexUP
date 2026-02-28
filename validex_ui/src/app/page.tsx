'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock } from 'lucide-react';
import { APP_INFO } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Sidebar from '@/components/layout/Sidebar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating authentication flow
    setTimeout(() => {
      setIsLoading(false);
      router.push('/registro-sms'); // Siguiente paso del onboarding
    }, 1500);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col relative w-full h-full overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between border-b border-slate-800 bg-slate-800/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-500 w-6 h-6" />
            <div className="font-bold text-white">
              {APP_INFO.name} <span className="text-emerald-500">{APP_INFO.suffix}</span>
            </div>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
          <div className="glass-panel w-full max-w-md rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20">
                <Shield className="text-emerald-500 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Acceso Táctico
              </h2>
              <p className="text-slate-400 text-sm">
                Ingrese sus credenciales de nivel corporativo para continuar.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Correo Electrónico Corporativo"
                type="email"
                placeholder="gerencia@compania.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Clave de Identidad (Password)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
                  <label htmlFor="remember" className="text-slate-400 select-none cursor-pointer">Mantener sesión</label>
                </div>
                <button type="button" className="text-emerald-500 hover:text-emerald-400 font-medium">
                  ¿Extravió sus claves?
                </button>
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth isLoading={isLoading}>
                  Autorizar Acceso
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-700/50 pt-6">
              ¿Nueva incorporación logística?{' '}
              <button onClick={() => router.push('/crear-cuenta')} className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
                Solicite Enrolamiento
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>
      </main>
    </div>
  );
}
