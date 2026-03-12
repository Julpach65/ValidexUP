'use client'

import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

export default function LoginCaraPage() {
    const router = useRouter()
    
    // --- ESTADOS ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    
    // Estados para la animación de éxito
    const [accessGranted, setAccessGranted] = useState(false);
    const [userName, setUserName] = useState("");
    const [systemStatus, setSystemStatus] = useState("Analizando firma biométrica...");

    useEffect(() => {
        const savedId = localStorage.getItem('id_usuario_actual');
        if (!savedId) {
            router.push('/login'); 
            return; 
        }
        setUserId(savedId);
    }, [router]);

    useEffect(() => {
        if (!accessGranted) startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessGranted]);

    // --- SECUENCIA DE ÉXITO ---
    useEffect(() => {
        if (accessGranted) {
            // 1. Secuencia de mensajes de estado
            setTimeout(() => setSystemStatus("Coincidencia encontrada ✓"), 1000);
            setTimeout(() => setSystemStatus("Cargando perfil de seguridad..."), 2000);

            // 2. Limpieza y redirección
            localStorage.removeItem('registration_step'); 
            setTimeout(() => {
                router.push('/dashboard');
            }, 4000); // Aumentamos el tiempo para disfrutar la animación
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessGranted]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 1280, height: 720 } 
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error("Error cámara:", err);
            alert("Se necesita acceso a la cámara para verificar tu identidad.");
        }
    };

    const handleVerifyFace = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !userId) return;

        setIsLoading(true);
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const cleanBase64 = canvas.toDataURL('image/jpeg', 0.8).replace(/^data:image\/\w+;base64,/, "");

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/verify-face-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: parseInt(userId), image_data: cleanBase64 }),
            });

            const data = await response.json();

            if (response.ok) {
                // --- DISPARAMOS LA SECUENCIA DE BIENVENIDA ---
                setUserName(data.user_name || "Usuario");
                setAccessGranted(true);
            } else {
                // Si la cara no coincide o hay otro error
                alert(`Acceso denegado: ${data.detail || "Rostro no reconocido"}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- VISTA DE ÉXITO (ANIMACIÓN) ---
    if (accessGranted) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono">
                {/* Audio para el efecto de sonido */}
                <audio src="/sounds/AudioBienvenida.mp3" autoPlay preload="auto"></audio>

                {/* Fondo animado de rejilla */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10B981_1px,transparent_1px),linear-gradient(to_bottom,#10B981_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                
                <div className="z-10 flex flex-col items-center text-center animate-in zoom-in-90 duration-500">
                    
                    {/* Icono de Check con más efectos */}
                    <div className="relative mb-8">
                        <div className="w-28 h-28 rounded-full border-2 border-[#10B981] flex items-center justify-center bg-emerald-900/50 shadow-[0_0_40px_rgba(16,185,129,0.7)]">
                            <span className="material-icons-round text-7xl text-white animate-in zoom-in-50 delay-500 duration-500">verified_user</span>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-[#10B981] animate-ping"></div>
                        <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-pulse delay-500"></div>
                    </div>

                    {/* Mensajes de estado del sistema */}
                    <div className="h-8 mb-4">
                        <p key={systemStatus} className="text-emerald-400 text-sm tracking-widest animate-in fade-in duration-300">
                            {systemStatus}
                        </p>
                    </div>

                    {/* Título y Nombre */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        Bienvenido, <span className="text-[#10B981]">{userName}</span>
                    </h1>
                    
                    <p className="text-slate-400 mt-2">Acceso autorizado a la plataforma Validex UP.</p>

                    {/* Barra de carga falsa */}
                    <div className="w-64 h-2 bg-emerald-900/50 rounded-full mt-10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-[loading_3s_ease-out_forwards]"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 tracking-widest">INICIALIZANDO ENTORNO SEGURO...</p>
                </div>
                <style jsx>{`
                    @keyframes loading {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                `}</style>
            </div>
        )
    }

    // --- VISTA NORMAL DE LOGIN FACIAL ---
    return (
        <div className="h-screen flex flex-col bg-[#0B1120] text-slate-300 font-sans selection:bg-[#10B981] selection:text-white overflow-hidden">
            <header className="flex-none w-full px-6 py-3 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl gap-4 md:gap-0">
                 <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-[#10B981]">UP</span>
                    </div>
                </div>

                {/* STEPPER DE PROGRESO (VISUAL - LOGIN) */}
                <div className="w-full max-w-sm relative hidden md:block">
                    <div className="flex items-center justify-between relative">
                        {/* Línea de fondo */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10B981]/20 -z-10 transform -translate-y-1/2"></div>
                        
                        {/* Paso 1: Credenciales (Completado) */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#0B111D] border border-[#10B981] flex items-center justify-center text-[#10B981]">
                                <span className="material-icons-round text-sm">lock</span>
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-[#10B981] uppercase opacity-60">Cuenta</span>
                        </div>

                        {/* Paso 2: SMS (Completado) */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#0B111D] border border-[#10B981] flex items-center justify-center text-[#10B981]">
                                <span className="material-icons-round text-sm">smartphone</span>
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-[#10B981] uppercase opacity-60">SMS</span>
                        </div>

                        {/* Paso 3: Biometría (Activo) */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-[#10B981]/20 relative z-10">
                                <span className="material-icons-round text-lg">face</span>
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-white uppercase mt-1">Rostro</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/login')} className="px-5 py-2 rounded-lg border border-slate-700 uppercase text-[10px] font-black">
                    Cancelar
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
                <div className="w-full max-w-4xl h-full max-h-full rounded-2xl p-4 md:p-6 flex flex-col items-center text-center space-y-4 shadow-2xl relative bg-slate-900/50 border border-white/5">
                    <div className="flex-none space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Verificación de <span className="text-[#10B981]">Identidad</span>
                        </h1>
                        <p className="text-sm text-slate-400">Mira a la cámara para validar tu acceso.</p>
                    </div>

                    <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                        <div className="relative h-full aspect-[4/3] max-w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <canvas ref={canvasRef} className="hidden" />
                            
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white">REC</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-none pt-2 w-full md:w-auto">
                        <button
                            onClick={handleVerifyFace}
                            disabled={isLoading}
                            className={`group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-1 w-full md:min-w-[340px] justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-icons-round text-2xl">
                                {isLoading ? 'sync' : 'fingerprint'}
                            </span>
                            <span>
                                {isLoading ? 'Verificando...' : 'Autenticar Acceso'}
                            </span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}