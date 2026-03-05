'use client'

import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

export default function RegistroCaraPage() {
    const router = useRouter()
    
    // --- LÓGICA DE CÁMARA ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const savedId = localStorage.getItem('id_usuario_actual');
        if (!savedId) router.push('/crear-cuenta');
        else setUserId(savedId);

        startCamera();
        // Limpieza al cerrar la página
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        }
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 1280, height: 720 } 
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error("Error cámara:", err);
            alert("Permite el acceso a la cámara para continuar.");
        }
    };

    const handleCaptureAndUpload = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !userId) return;

        setIsLoading(true);
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const photoBase64 = canvas.toDataURL('image/jpeg', 0.8);

        try {
            // 🛠️ CAMBIO 1: URL limpia.
            // Eliminamos el ID de la URL (antes era .../register-face/${userId}) para evitar errores 404.
            const response = await fetch('http://localhost:8000/api/v1/auth/register-face', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 🛠️ CAMBIO 2: Objeto JSON unificado.
                // Ajustamos las claves para que coincidan EXACTAMENTE con el esquema Pydantic del backend.
                body: JSON.stringify({
                    user_id: parseInt(userId), // Antes 'id_usuario'. Backend espera 'user_id'.
                    image_data: photoBase64    // Antes 'face_data'. Backend espera 'image_data'.
                }),
            });

            if (response.ok) {
                router.push('/dashboard'); // O la ruta final que desees
            } else {
                alert("Error al registrar rostro. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // ------------------------

    return (
        <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-300 font-sans selection:bg-[#10B981] selection:text-white">
            <style jsx global>{`
                .glass-panel {
                    background-color: rgba(15, 22, 35, 0.8);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .corner-border {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-color: rgba(16, 185, 129, 0.5); /* Cambiado a verde para que resalte */
                    border-style: solid;
                    pointer-events: none;
                    z-index: 30;
                }
                .corner-tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; border-top-left-radius: 4px; }
                .corner-tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; border-top-right-radius: 4px; }
                .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; border-bottom-left-radius: 4px; }
                .corner-br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; border-bottom-right-radius: 4px; }
                
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan 3s linear infinite;
                }
            `}</style>

            <header className="w-full px-6 py-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between relative z-20 bg-[#0B111D]/80 backdrop-blur-xl">
                <div className="flex items-center space-x-3 cursor-pointer mb-8 md:mb-0" onClick={() => router.push('/')}>
                    <div className="w-10 h-10 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-xl font-black tracking-tighter text-white uppercase">
                        Validex <span className="text-[#10B981]">UP</span>
                    </div>
                </div>

                {/* Tu Stepper se mantiene igual */}
                <div className="w-full max-w-md relative">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#10B981]/20 -z-10 transform -translate-y-1/2"></div>
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">Registro</span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 bg-[#0B111D] px-3 text-[#10B981]">
                            <div className="w-9 h-9 rounded-full border border-[#10B981]/40 flex items-center justify-center bg-[#0B111D]">
                                <span className="material-icons-round text-lg">check_circle</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">SMS</span>
                        </div>
                        {/* Step 3 (Activo) */}
                        <div className="flex flex-col items-center gap-2 relative bg-[#0B111D] px-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] relative z-10">
                                <span className="material-icons-round text-xl">face</span>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.2em] text-white uppercase mt-1">Cara</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => router.push('/')} className="hidden md:flex px-5 py-2 rounded-lg border border-slate-700 uppercase text-[10px] font-black">
                    Cancelar
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
                <div className="w-full max-w-4xl mx-auto glass-panel rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center space-y-8 shadow-2xl">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                            Fase Final de Seguridad
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Captura de Rostro <span className="text-[#10B981]">Biométrica</span>
                        </h1>
                    </div>

                    <div className="relative w-full max-w-[560px]">
                        <div className="w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700/50">
                            
                            {/* VIDEO REAL DE LA CÁMARA */}
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover scale-x-[-1]" 
                            />

                            {/* Canvas oculto para procesar la foto */}
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(15, 23, 42, 0.4) 100%) pointer-events-none"></div>

                            {/* UI de Escaneo sobre el video */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 z-30">
                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse"></span>
                                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">Sensor Activo</span>
                            </div>

                            <div className="corner-border corner-tl"></div>
                            <div className="corner-border corner-tr"></div>
                            <div className="corner-border corner-bl"></div>
                            <div className="corner-border corner-br"></div>

                            {/* Linea de escaneo animada */}
                            <div className="absolute left-0 w-full h-0.5 bg-[#10B981]/50 shadow-[0_0_10px_#10B981] animate-scan-line pointer-events-none z-20"></div>
                        </div>
                    </div>

                    <div className="pt-4 w-full md:w-auto">
                        <button
                            onClick={handleCaptureAndUpload}
                            disabled={isLoading}
                            className={`group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl text-white font-bold text-lg shadow-lg transition-all hover:-translate-y-1 w-full md:min-w-[340px] justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-icons-round text-2xl">
                                {isLoading ? 'sync' : 'photo_camera'}
                            </span>
                            <span>{isLoading ? 'Procesando Biometría...' : 'Capturar Foto de Referencia'}</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}