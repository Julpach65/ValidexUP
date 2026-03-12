'use client'

import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

export default function RegistroCaraPage() {
    const router = useRouter()
    
    // --- ESTADOS ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState("Iniciando sensores...");
    const [feedbackStatus, setFeedbackStatus] = useState<'default' | 'warning' | 'success'>('default');

    // 1. Seguridad: Verificar que el usuario viene del paso anterior (SMS)
    useEffect(() => {
        const savedId = localStorage.getItem('id_usuario_actual');
        const registrationStep = localStorage.getItem('registration_step');
        
        // Si no está en proceso de registro, lo mandamos al inicio
        if (!savedId || registrationStep !== 'face') {
            console.warn("[Auth Guard] Flujo de registro no válido.");
            router.push('/crear-cuenta');
            return; 
        }
        setUserId(savedId);
    }, [router]);

    // 2. Ciclo de vida de la cámara
    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. Análisis de Iluminación
    useEffect(() => {
        if (!stream) return;
        const interval = setInterval(analyzeEnvironment, 800);
        return () => clearInterval(interval);
    }, [stream]);

    const analyzeEnvironment = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        const avgBrightness = totalBrightness / (data.length / 4);

        if (avgBrightness < 40) {
            setFeedback("⚠️ Muy oscuro. Busca más luz.");
            setFeedbackStatus('warning');
        } else if (avgBrightness > 220) {
            setFeedback("⚠️ Demasiado brillo. Evita el contraluz.");
            setFeedbackStatus('warning');
        } else {
            setFeedback("✅ Condiciones óptimas. Coloca tu rostro.");
            setFeedbackStatus('success');
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 1280, height: 720 } 
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error("Error cámara:", err);
            alert("Permite el acceso a la cámara para el registro.");
        }
    };

    // 4. ENVÍO EXCLUSIVO A REGISTRO
    const handleRegisterFace = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !userId) return;

        setIsLoading(true);
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const photoBase64 = canvas.toDataURL('image/jpeg', 0.8);
        const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, "");

        const body = {
            user_id: parseInt(userId),
            image_data: cleanBase64
        };

        try {
            // Solo usamos el endpoint de registro
            const response = await fetch('http://localhost:8000/api/v1/auth/register-face', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                // Registro completado: Limpiamos el proceso y vamos al dashboard
                localStorage.removeItem('registration_step');
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                alert(`Error en registro: ${errorData.detail || "No se pudo guardar el rostro"}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión al registrar biometría.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[#0B1120] text-slate-300 font-sans selection:bg-[#10B981] selection:text-white overflow-hidden">
            <style jsx global>{`
                .glass-panel { background-color: rgba(15, 22, 35, 0.8); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .corner-border { position: absolute; width: 40px; height: 40px; border-color: rgba(16, 185, 129, 0.5); border-style: solid; pointer-events: none; z-index: 30; }
                .corner-tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; border-top-left-radius: 4px; }
                .corner-tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; border-top-right-radius: 4px; }
                .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; border-bottom-left-radius: 4px; }
                .corner-br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; border-bottom-right-radius: 4px; }
                @keyframes scan { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                .animate-scan-line { animation: scan 3s linear infinite; }
            `}</style>

            <header className="flex-none w-full px-6 py-3 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl">
                <div className="flex items-center space-x-3 cursor-pointer mb-8 md:mb-0" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-[#10B981]">UP</span>
                    </div>
                </div>

                {/* STEPPER ACTIVO (Solo se muestra en Registro) */}
                <div className="w-full max-w-md relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10B981]/20 -z-10 transform -translate-y-1/2"></div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Datos</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">SMS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B111D] px-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] relative z-10">
                                <span className="material-icons-round text-xl">face</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-white uppercase mt-1">Rostro</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="hidden md:flex px-5 py-2 rounded-lg border border-slate-700 uppercase text-[10px] font-black">
                    Cancelar
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
                <div className="w-full max-w-4xl h-full max-h-full glass-panel rounded-2xl p-4 md:p-6 flex flex-col items-center text-center space-y-4 shadow-2xl">
                    <div className="flex-none space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                            Alta de Usuario Biométrico
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Registrar <span className="text-[#10B981]">Rostro Maestro</span>
                        </h1>
                    </div>

                    <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                        <div className="relative h-full aspect-[4/3] max-w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(15, 23, 42, 0.4) 100%) pointer-events-none"></div>

                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-30">
                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></span>
                                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Modo Enrolamiento</span>
                            </div>

                            <div className="absolute bottom-8 left-0 w-full text-center z-30 pointer-events-none">
                                <span className={`px-4 py-2 backdrop-blur-md rounded-full text-xs font-medium border transition-all duration-300 ${
                                    feedbackStatus === 'warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' :
                                    feedbackStatus === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' :
                                    'bg-black/60 border-white/10 text-white/90'
                                }`}>
                                    {feedback}
                                </span>
                            </div>

                            <div className="corner-border corner-tl"></div>
                            <div className="corner-border corner-tr"></div>
                            <div className="corner-border corner-bl"></div>
                            <div className="corner-border corner-br"></div>
                            <div className="absolute left-0 w-full h-0.5 bg-[#10B981]/50 shadow-[0_0_10px_#10B981] animate-scan-line pointer-events-none z-20"></div>
                        </div>
                    </div>

                    <div className="flex-none pt-2 w-full md:w-auto">
                        <button
                            onClick={handleRegisterFace}
                            disabled={isLoading}
                            className={`group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-1 w-full md:min-w-[340px] justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-icons-round text-2xl">
                                {isLoading ? 'sync' : 'add_a_photo'}
                            </span>
                            <span>
                                {isLoading ? 'Guardando Perfil...' : 'Establecer como Rostro de Acceso'}
                            </span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}