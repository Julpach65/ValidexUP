'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Building, ArrowLeft } from 'lucide-react';
import { APP_INFO } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Sidebar from '@/components/layout/Sidebar';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('GERENTE');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulating signup flow
        setTimeout(() => {
            setIsLoading(false);
            router.push('/registro-sms'); // Luego de crear, va al SMS
        }, 1500);
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-slate-900">
            <Sidebar />

            <main className="flex-1 flex flex-col relative w-full h-full overflow-y-auto">
                <div className="lg:hidden p-6 flex items-center justify-between border-b border-slate-800 bg-slate-800/80 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Shield className="text-emerald-500 w-6 h-6" />
                        <div className="font-bold text-white">
                            {APP_INFO.name} <span className="text-emerald-500">{APP_INFO.suffix}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                    <div className="glass-panel w-full max-w-md rounded-2xl p-8 sm:p-10 relative">
                        <button
                            onClick={() => router.push('/')}
                            className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-10 mt-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 border border-slate-700">
                                <Building className="text-emerald-500 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                                Enrolamiento
                            </h2>
                            <p className="text-slate-400 text-sm">
                                Registro de nuevos perfiles logísticos y administrativos.
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <Input
                                label="Correo Corporativo"
                                type="email"
                                placeholder="usuario@compania.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-5 h-5" />}
                                required
                            />

                            <Input
                                label="Nueva Clave de Seguridad"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="w-5 h-5" />}
                                required
                            />

                            <div className="w-full">
                                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500 ml-1 mb-2 block">
                                    Rol Organizacional
                                </label>
                                <select
                                    className="flex h-12 w-full rounded-lg border border-slate-700 bg-[#151d2e] px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer appearance-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="GERENTE">Gerente de Planta</option>
                                    <option value="PATRON">Patrón / Administrador Principal</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" fullWidth isLoading={isLoading}>
                                    Completar Registro Base
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
