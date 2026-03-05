'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import OnboardingSidebar from '@/components/layout/OnboardingSidebar';
import PasswordStrength from '@/components/PasswordStrength';

export default function CrearCuentaPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error de email al escribir
        if (name === 'email') setEmailError('');
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            setEmailError('El formato del correo no es válido (ejemplo: usuario@empresa.com)');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) {
            alert("La contraseña no cumple con los requisitos de seguridad.");
            return;
        }
        if (!validateEmail()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    rol: 'GERENTE'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('id_usuario_actual', data.id_usuario);
                setIsSuccess(true); // Activa la animación de éxito
                setTimeout(() => {
                    router.push('/verificar-sms');
                }, 1000); // Retraso extendido para apreciar el feedback
            } else {
                alert(`Error en el registro: ${data.detail || 'Ocurrió un error.'}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor. Intente más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    const isFormIncomplete = !formData.nombre_completo || !formData.email || !formData.password || !!emailError;

    return (
        <div className="min-h-screen flex bg-[#0B1120] relative overflow-hidden selection:bg-[#10B981] selection:text-white">
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
            </div>

            <OnboardingSidebar />

            <main className="flex-1 flex flex-col items-center justify-start p-6 pt-8 sm:px-12 pb-12 relative z-10">
                {/* Stepper */}
                <div className="w-full max-w-md mb-6 relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B1120] px-3">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-14 h-14 bg-[#10B981]/25 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-[#10B981]/20 z-10">
                                <span className="material-icons-round text-xl">person_add</span>
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase mt-1">Registro</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center bg-[#0B1120]/50"><span className="material-icons-round text-lg">smartphone</span></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">SMS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B1120] px-3 text-slate-600">
                            <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center bg-[#0B1120]/50"><span className="material-icons-outlined text-lg">face</span></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Cara</span>
                        </div>
                    </div>
                </div>

                {/* Contenedor Principal Split (Formulario Izq | Validaciones Der) */}
                <div className={`w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-start justify-center transition-all duration-700 ease-in-out ${isSuccess ? 'opacity-0 translate-x-24 blur-sm' : 'animate-in fade-in slide-in-from-bottom-6'}`}>
                    
                    {/* Columna Izquierda: Formulario */}
                    <div className="w-full max-w-md space-y-8 flex-1">
                        <div className="text-center lg:text-left space-y-3">
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                                Crear Cuenta <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">Corporativa</span>
                            </h2>
                            <p className="text-slate-400 text-base leading-relaxed font-medium">
                                Inicie el proceso de alta para acceder al panel de seguridad de Validex.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 ml-1">Nombre Completo</label>
                                <input name="nombre_completo" type="text" value={formData.nombre_completo} onChange={handleChange} required className="w-full h-14 bg-transparent border border-slate-800 rounded-xl text-white px-5 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981] text-base font-medium transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 ml-1">Email Corporativo</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    onBlur={validateEmail}
                                    required 
                                    className={`w-full h-14 bg-transparent border rounded-xl text-white px-5 focus:outline-none focus:ring-2 text-base font-medium transition-all ${emailError ? 'border-red-500 focus:ring-red-500/40' : 'border-slate-800 focus:ring-[#10B981]/40 focus:border-[#10B981]'}`} 
                                />
                                {emailError && <p className="text-red-400 text-xs font-bold ml-1 animate-pulse">{emailError}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 ml-1">Contraseña Segura</label>
                                <div className="relative">
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full h-14 bg-transparent border border-slate-800 rounded-xl text-white px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981] text-base font-medium transition-all" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 z-10 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        <span className="material-icons-round">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isLoading && !isSuccess}
                                disabled={isLoading || isFormIncomplete || !isPasswordValid || isSuccess}
                                className={`h-14 font-black uppercase tracking-[0.2em] rounded-2xl text-base transition-all duration-500 !mt-6 ${
                                    isSuccess 
                                    ? '!bg-[#10B981] !border-[#10B981] !text-white scale-105 shadow-[0_0_40px_rgba(16,185,129,0.6)] animate-pulse' 
                                    : 'shadow-glow-emerald hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isSuccess ? (
                                    <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                                        <span className="material-icons-round text-2xl">verified_user</span>
                                        <span>¡Acceso Nivel 1 Autorizado!</span>
                                    </div>
                                ) : (
                                    <span>Validar Credenciales</span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Columna Derecha: Panel de Seguridad (Alado) */}
                    <div className="w-full max-w-md lg:w-80 lg:mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="material-icons-round text-[#10B981]">security</span> Requisitos de Seguridad
                        </h3>
                        <PasswordStrength password={formData.password} onValidationChange={setIsPasswordValid} />
                    </div>
                </div>
            </main>
        </div>
    );
}