'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterFacePage() {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const handleCapture = () => {
        setIsCapturing(true);
        setTimeout(() => {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);
            }
            setIsCapturing(false);
        }, 1000);
    };

    const handleConfirm = () => {
        // Navigate to dashboard after saving biometrics
        router.push('/dashboard');
    };

    return (
        <div className="bg-[#080d1a] text-slate-200 font-sans min-h-screen flex flex-col">
            <header className="w-full border-b border-slate-800 bg-[#0b1221]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tight text-white">
                        Validex <span className="text-emerald-500">UP</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative">
                <div className="text-center mb-10 max-w-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Registro de Rostro</h1>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Posiciona tu rostro en el centro. Este será tu factor biométrico para autorizaciones.
                    </p>
                </div>

                <div className="relative w-full max-w-[400px] aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-8 flex items-center justify-center">
                    {!capturedImage ? (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover opacity-80"
                            videoConstraints={{ facingMode: "user" }}
                        />
                    ) : (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    )}

                    {/* Overlay HUD */}
                    <div className="absolute inset-0 pointer-events-none border-[4px] border-emerald-500/50 m-8 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>

                    {/* Status Badge */}
                    <div className="absolute top-6 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-slate-700 flex items-center gap-2 z-10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">En Vivo</span>
                    </div>
                </div>

                <div className="w-full max-w-[400px]">
                    {!capturedImage ? (
                        <Button onClick={handleCapture} fullWidth size="lg" isLoading={isCapturing} className="gap-2">
                            <Camera className="w-6 h-6" /> Capturar Rostro Seguro
                        </Button>
                    ) : (
                        <Button onClick={handleConfirm} fullWidth size="lg" className="gap-2 bg-emerald-600">
                            <CheckCircle2 className="w-6 h-6" /> Confirmar y Acceder
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
