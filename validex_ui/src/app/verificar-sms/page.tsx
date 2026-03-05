'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import OnboardingSidebar from '@/components/layout/OnboardingSidebar';

export default function RegisterSMSPage() {
    const router = useRouter();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    //  MODIFICADO: Estado para recuperar el ID del usuario registrado en la pantalla anterior
    const [userId, setUserId] = useState<string | null>(null);

    // 🛠️ MODIFICADO: Efecto para recuperar el ID del localStorage al cargar la página
    useEffect(() => {
        const savedId = localStorage.getItem('id_usuario_actual');
        if (!savedId) {
            // Si no hay ID, el usuario se saltó el paso 1. Lo regresamos.
            router.push('/crear-cuenta');
        } else {
            setUserId(savedId);
        }
    }, [router]);

    // Timer logic for OTP
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'otp' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPhone(value);
    };

    // 🛠️ MODIFICADO: Ahora envía el teléfono al backend para actualizar el usuario y generar el OTP
    const handleSendSMS = async () => {
        if (phone.length !== 10 || !userId) return;
        setIsLoading(true);

        try {
            // Cambia esta URL por tu endpoint real de FastAPI
            const response = await fetch('http://localhost:8000/api/v1/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: parseInt(userId),
                    telefono: phone
                }),
            });

            if (response.ok) {
                setStep('otp');
                setTimeLeft(300); // Reset timer
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.detail || "No se pudo enviar el SMS"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No hay conexión con el servidor de Validex UP.");
        } finally {
            setIsLoading(false);
        }
    };

    // 🛠️ MODIFICADO: Ahora valida el código contra la base de datos real
   const handleVerifyOTP = async () => {
        const fullCode = otp.join('');
        if (fullCode.length < 6 || !userId) return;
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: parseInt(userId),
                    codigo: fullCode
                }),
            });

            const data = await response.json();

            // 🛠️ CAMBIO AQUÍ: Usamos data.status porque así responde tu Python
            if (response.ok && data.status === "SMS_VERIFIED") {
                router.push(`/verificar-sms/correcta?phone=${phone}&code=${fullCode}`);
            } else {
                router.push(`/verificar-sms/fallida?phone=${phone}`);
            }
        } catch (error) {
            console.error("Error de verificación:", error);
            router.push(`/verificar-sms/fallida?phone=${phone}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0B1120] relative overflow-hidden selection:bg-[#10B981] selection:text-white">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
            </div>

            <OnboardingSidebar />

            <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
                {/* Unified Stepper */}
                <div className="w-full max-w-md mb-16 relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-3 text-[#10B981]">
                            <div className="w-10 h-10 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B1120] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Registro</span>
                        </div>
                        <div className="absolute top-1/2 left-[15%] w-[35%] h-0.5 bg-[#10B981]/50 -z-10 transform -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B1120] px-3">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-14 h-14 bg-[#10B981]/25 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-[#10B981]/20 relative z-10 transition-all">
                                <span className="material-icons-round text-xl">smartphone</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mt-1">SMS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center bg-[#0B1120]/50">
                                <span className="material-icons-outlined text-lg">face</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Cara</span>
                        </div>
                    </div>
                </div>

                {step === 'phone' ? (
                    <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                                <span className="text-[11px] font-bold tracking-widest text-[#10B981] uppercase">Vinculación Identidad</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                Registro de <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">Teléfono</span>
                            </h2>
                            <p className="text-slate-400 text-base max-w-sm mx-auto leading-relaxed font-medium">
                                Vincule un número corporativo para recibir su clave de acceso Zero-Trust.
                            </p>
                        </div>

                        <div className="w-full max-w-md mx-auto space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 ml-1">
                                    Número de contacto (MÉXICO)
                                </label>
                                <div className="flex gap-4">
                                    <div className="relative w-32 shrink-0 group">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                            <span className="text-[#10B981] font-black text-sm">+52</span>
                                        </div>
                                        <div className="w-full h-16 bg-[#0f172a] border border-slate-800 rounded-2xl text-white pl-12 pr-4 flex items-center font-black text-sm shadow-inner group-hover:border-slate-700">
                                            MEX
                                        </div>
                                    </div>
                                    <div className="flex-1 relative group">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="55 1234 5678"
                                            className="w-full h-16 bg-[#0f172a] border border-slate-800 rounded-2xl text-white px-6 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981] text-xl font-black tracking-[0.2em] transition-all shadow-inner"
                                        />
                                        {phone.length === 10 && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#10B981] animate-in zoom-in duration-300">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSendSMS}
                                fullWidth
                                isLoading={isLoading}
                                disabled={phone.length !== 10}
                                className="h-16 font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-emerald text-base hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <span>Enviar Código</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">Verificación en Curso</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                Validar <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#10B981]">Identidad</span>
                            </h2>
                            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed font-medium text-center">
                                Introduce el código de 6 dígitos enviado al dispositivo <br />
                                <span className="text-white font-mono tracking-widest text-sm bg-slate-800/50 px-2 py-1 rounded mt-2 inline-block border border-slate-700">
                                    +52 •••• •••{phone.slice(-4)}
                                </span>
                            </p>
                        </div>

                        <div className="w-full max-w-md mx-auto space-y-8">
                            <div className="flex gap-2 sm:gap-3 justify-center">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        placeholder="•"
                                        className="w-12 h-16 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 text-white text-2xl font-black text-center transition-all outline-none"
                                    />
                                ))}
                            </div>

                            <div className="flex flex-col gap-6">
                                <Button
                                    onClick={handleVerifyOTP}
                                    fullWidth
                                    isLoading={isLoading}
                                    disabled={otp.some(d => !d) || timeLeft === 0}
                                    className="h-16 font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-emerald text-base"
                                >
                                    <span>Verificar Código</span>
                                </Button>

                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] tracking-widest uppercase">
                                        <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-[#10B981]'}`} />
                                        <span>Expira en: <span className={timeLeft < 60 ? 'text-red-500' : 'text-white'}>{formatTime(timeLeft)}</span></span>
                                    </div>
                                    <button
                                        onClick={() => setStep('phone')}
                                        className="text-[11px] font-black text-slate-500 hover:text-[#10B981] tracking-[0.2em] uppercase transition-colors"
                                    >
                                        Editar número
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}