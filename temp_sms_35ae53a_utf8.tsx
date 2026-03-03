'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Sidebar from '@/components/layout/Sidebar';

export default function RegisterSMSPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendSMS = () => {
        setIsLoading(true);
        // Simulating SMS sending
        setTimeout(() => {
            setIsLoading(false);
            router.push('/verificar-sms'); // O pasamos directo a rostro en el MVP
        }, 1500);
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-slate-900">
            <Sidebar />

            <main className="flex-1 flex flex-col relative w-full h-full overflow-y-auto">
                {/* Stepper Header (simplified) */}
                <div className="w-full flex justify-center py-8">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-xs">1</div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Registro</span>
                        </div>
                        <div className="w-12 h-[1px] bg-emerald-500/50"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center text-white text-xs">2</div>
                            <span className="text-[10px] font-bold text-white uppercase">SMS</span>
                        </div>
                        <div className="w-12 h-[1px] bg-slate-700"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 text-xs">3</div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Cara</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-lg text-center space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Registro de Tel├®fono</h2>
                            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                                Para continuar, necesitamos vincular un n├║mero de contacto corporativo a su perfil para env├¡os de OTP.
                            </p>
                        </div>

                        <div className="w-full max-w-md mx-auto text-left space-y-2">
                            <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500 ml-1">
                                N├║mero de tel├®fono
                            </label>
                            <div className="flex gap-3">
                                <div className="relative w-28 shrink-0">
                                    <select className="w-full h-12 bg-[#151d2e] border border-slate-700 rounded-lg text-white px-3 appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-medium">
                                        <option>MX +52</option>
                                        <option>US +1</option>
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="55 1234 5678"
                                    className="flex-1 h-12 bg-[#151d2e] border border-slate-700 rounded-lg text-white px-4 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-lg tracking-wide"
                                />
                            </div>
                        </div>

                        <div className="w-full max-w-md mx-auto pt-4">
                            <Button onClick={handleSendSMS} fullWidth isLoading={isLoading} className="gap-2 group">
                                Enviar SMS de Verificaci├│n
                                <Smartphone className="w-5 h-5 group-hover:block transition-all" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
