'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/config/api'
import { useAuth } from '@/hooks/useAuth'
import AppHeader from '@/components/layout/AppHeader'
import GaugeCircle from '@/components/ui/GaugeCircle'

interface Pipa {
    id_pipa: number;
    placa: string;
    capacidad_litros: number;
    proveedor: string;
    estado: string;
    litros_descargados: number;
}
export default function PipasPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const [pipas, setPipas] = useState<Pipa[]>([])
    const [selectedPipa, setSelectedPipa] = useState<Pipa | null>(null)
    const [volumen, setVolumen] = useState('')
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const [showFaceModal, setShowFaceModal] = useState(false);
    const [faceSystemStatus, setFaceSystemStatus] = useState("Alinee su rostro con la guía");
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isSecure, setIsSecure] = useState(true);

    useEffect(() => {
        if (showFaceModal) {
            startCamera();
        } else {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
        }
        return () => {
             if (stream) stream.getTracks().forEach(track => track.stop());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFaceModal]);

    const startCamera = async () => {
        setCameraError(null);
        
        // Verificación de Contexto Seguro
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setIsSecure(false);
            setCameraError("La cámara requiere HTTPS para funcionar en producción.");
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError("Navegador Bloqueado o Sin Soporte de Cámara.");
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user', 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 } 
                } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                };
            }
        } catch (err: any) {
            console.error("Error camara:", err);
            let errorMessage = "No se pudo acceder a la camara. Verifica los permisos.";
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                errorMessage = "Acceso denegado. Permite la cámara en el navegador.";
            } else if (err.name === 'NotFoundError') {
                errorMessage = "No se encontro ninguna camara activa.";
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                errorMessage = "Cámara ocupada por otra app.";
            }
            setCameraError(errorMessage);
        }
    };

    useEffect(() => {
        if (!authLoading && user?.rol === 'VISOR') {
            router.push('/bitacora')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        const fetchPipas = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_BASE_URL}/pipas/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPipas(data);
                    if (data.length > 0) setSelectedPipa(data[0]);
                }
            } catch (error) {
                console.error("Error obteniendo pipas:", error);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchPipas();
    }, []);

    const disponible = selectedPipa ? Number(selectedPipa.capacidad_litros) - Number(selectedPipa.litros_descargados) : 0;
    // Ojo: fillPercent = que tan llena está la pipa (100% = No le cabe mas)
    const fillPercent = selectedPipa ? Math.round((Number(selectedPipa.litros_descargados) / Number(selectedPipa.capacidad_litros)) * 100) : 0;

    const handleAutorizar = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPipa || !volumen) return;
        setShowFaceModal(true); // Dispara Step-Up Auth
    }

    const captureAndExecute = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !selectedPipa || !volumen) return;
        
        setIsScanning(true);
        setFaceSystemStatus("Procesando firma biométrica AES...");

        const context = canvas.getContext('2d');
        const size = Math.min(video.videoWidth, video.videoHeight);
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;

        canvas.width = size;
        canvas.height = size;
        context?.clearRect(0, 0, size, size);
        context?.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        const base64Image = canvas.toDataURL('image/jpeg', 0.8).replace(/^data:image\/\w+;base64,/, "");
        
        executeCarga(base64Image);
    }

    const executeCarga = async (imageData: string) => {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout para estabilidad asíncrona

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/operaciones/cargar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_pipa: selectedPipa?.id_pipa,
                    volumen_objetivo: Number(volumen),
                    tipo_combustible: 'MAGNA',
                    image_data: imageData // Envío Atómico
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                setFaceSystemStatus("Autenticado. Iniciando Descarga...");
                setTimeout(() => {
                    setShowFaceModal(false);
                    router.push(`/pipas/descarga-en-curso?id_operacion=${data.id_operacion}`);
                }, 1000);
            } else {
                if (response.status === 401 || response.status === 403) {
                     alert("Tu sesion ha caducado por seguridad. Por favor ingresa de nuevo.");
                     localStorage.clear();
                     router.push('/');
                     return;
                }
                const errData = await response.json();
                if (errData.detail?.includes("EN_DESCARGA")) {
                    console.warn("Pipa detectada en descarga (Recuperacion Automatica)");
                    window.location.reload(); 
                } else {
                    alert(`Error Operativo: ${errData.detail || "Permisos Insuficientes o Biometria Invalida"}`);
                    setShowFaceModal(false);
                    setIsScanning(false);
                    setFaceSystemStatus("Alinee su rostro con la guia");
                }
            }
        } catch (error: any) {
            clearTimeout(timeoutId);
            setIsScanning(false);
            setFaceSystemStatus("Error de conectividad");
            setShowFaceModal(false);
            if (error.name === 'AbortError') {
                alert('Tiempo de espera extendido: La operación se marcó en el servidor pero la respuesta tardó demasiado. Verifique el estado de la pipa.');
            } else if (error.message?.includes('fetch')) {
                alert('Inestabilidad de Red detectada. Verifique si la pipa cambió a EN_DESCARGA.');
            } else {
                alert(`Error crítico: ${error.message || 'Error desconocido contactando con el motor.'}`);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            {/* Background glow accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />

            <AppHeader />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">

                {/* Navigation Breadcrumb-like */}
                <button onClick={() => router.push('/dashboard')} className="group inline-flex items-center text-[10px] font-black text-slate-500 hover:text-[#10B981] tracking-[0.2em] uppercase transition-colors mb-10">
                    <span className="material-icons-outlined text-sm mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    VOLVER AL CENTRO DE CONTROL
                </button>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-outlined text-[#10B981] text-xl">local_shipping</span>
                        <span className="text-[#10B981] font-black text-[10px] tracking-[0.3em] uppercase">MÓDULO DE OPERACIONES</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none uppercase">Autorización <br /> de <span className="text-[#10b981]">Unidad</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* List Section (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Unidades Autorizadas</h2>
                        
                        {initialLoading ? (
                            <div className="w-full text-center p-8 text-slate-500 font-bold border border-white/5 bg-[#151e32] rounded-2xl">
                                Reconociendo unidades...
                            </div>
                        ) : pipas.length === 0 ? (
                            <div className="w-full text-center p-8 text-slate-500 font-bold border border-white/5 bg-[#151e32] rounded-2xl">
                                No se encontraron pipas. (Corre seed_operaciones.py)
                            </div>
                        ) : (
                            pipas.map(p => (
                                <button
                                    key={p.id_pipa}
                                    id={`pipa-${p.id_pipa}`}
                                    onClick={() => setSelectedPipa(p)}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedPipa?.id_pipa === p.id_pipa
                                        ? 'bg-[#10B981]/10 border-[#10B981]/40 shadow-glow-emerald'
                                        : 'bg-[#151e32] border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {selectedPipa?.id_pipa === p.id_pipa && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981] opacity-[0.05] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    )}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xl font-black tracking-tight ${selectedPipa?.id_pipa === p.id_pipa ? 'text-[#10B981]' : 'text-white'}`}>{p.placa}</span>
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded border uppercase tracking-widest ${selectedPipa?.id_pipa === p.id_pipa ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-slate-800 border-slate-700 text-slate-500'
                                            }`}>
                                            {p.estado}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mb-3">{p.proveedor}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 tracking-wider">
                                        <span>CAPACIDAD</span>
                                        <span className="text-slate-300">{Number(p.capacidad_litros).toLocaleString()} L</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Interactive Authorization Section (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Visual HUD Card */}
                        {selectedPipa ? (
                            <div className="glass-card bg-[#151e32]/90 border-white/5 p-8 flex flex-col md:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[#10b981] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                    <GaugeCircle
                                        value={fillPercent}
                                        maxLabel={`${Number(selectedPipa.capacidad_litros).toLocaleString()} L`}
                                        currentLabel={`${fillPercent}%`}
                                    />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-1">{selectedPipa.placa}</h2>
                                        <p className="text-slate-400 font-bold text-sm tracking-wide">{selectedPipa.proveedor}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Mermas/Descargado</p>
                                            <p className="text-xl font-black text-red-500">{Number(selectedPipa.litros_descargados).toLocaleString()} L</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">Disponible para Uso</p>
                                            <p className="text-xl font-black text-[#10B981]">{disponible.toLocaleString()} L</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card bg-[#151e32]/90 border-white/5 p-8 text-center text-slate-500 font-bold">
                                Selecciona una unidad para operar terminales.
                            </div>
                        )}

                        {/* Form Card */}
                        {selectedPipa && (
                        <div className="glass-card bg-[#151e32]/90 border-white/5 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="material-icons-outlined text-[#10B981]">assignment_turned_in</span>
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">Autorización de Carga</h3>
                            </div>

                            <form onSubmit={handleAutorizar} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Unidad Confirmada</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">local_shipping</span>
                                            <input
                                                type="text"
                                                value={selectedPipa.placa}
                                                readOnly
                                                className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-sm font-black opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Volumen a Cargar (L)</label>
                                        <div className="relative group">
                                            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-[#10B981] transition-colors">water_drop</span>
                                            <input
                                                id="auth-volumen"
                                                type="number"
                                                required
                                                min="1"
                                                max={disponible}
                                                value={volumen}
                                                onChange={e => setVolumen(e.target.value)}
                                                placeholder={`MÁX. ${disponible.toLocaleString()}`}
                                                className="w-full bg-[#0f1623] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm font-black transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {user?.rol === 'ADMIN' ? (
                                    <div className="relative group w-full">
                                        <button
                                            disabled
                                            className="w-full py-5 bg-slate-800 border border-slate-700 text-slate-500 font-black rounded-full flex items-center justify-center gap-3 cursor-not-allowed opacity-60"
                                        >
                                            <span className="material-icons-round text-slate-600">lock</span>
                                            AUTORIZACIÓN RESTRINGIDA
                                        </button>
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                                            REQUERIDO: ROL GERENTE DE PLANTA
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        id="auth-submit"
                                        type="submit"
                                        disabled={loading || !volumen || Number(volumen) > disponible}
                                        className="w-full py-5 bg-[#10B981] hover:bg-emerald-600 text-white font-black rounded-full shadow-glow-emerald transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-40 btn-glow"
                                    >
                                        {loading ? (
                                            <>TRABAJANDO CON CIFRADO AES-256...</>
                                        ) : (
                                            <>AUTORIZAR OPERACIÓN SEGURA</>
                                        )}
                                    </button>
                                )}
                            </form>
                        </div>
                        )}
                    </div>
                </div>

                {/* MODAL STEP-UP AUTH */}
                {showFaceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="w-full max-w-md bg-[#151e32] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
                            {/* Header Modal */}
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0f1623]">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons-outlined text-[#10B981] text-xl">face</span>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Aprobación Biométrica</h3>
                                </div>
                                {!isScanning && (
                                    <button onClick={() => setShowFaceModal(false)} className="text-slate-500 hover:text-white transition-colors">
                                        <span className="material-icons-round">close</span>
                                    </button>
                                )}
                            </div>

                            {/* Contenido Modal */}
                            <div className="p-6 flex flex-col items-center">
                                <p className="text-xs text-slate-400 font-bold tracking-wide text-center uppercase mb-6">
                                    Autorizando descarga de <span className="text-white">{Number(volumen).toLocaleString()} L</span>
                                </p>

                                <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-inner shadow-black">
                                    {cameraError ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 backdrop-blur-md z-50">
                                            <span className="material-icons-round text-red-500 text-4xl mb-3 animate-pulse">videocam_off</span>
                                            <h4 className="text-white font-bold text-xs mb-1">Fallo de Dispositivo</h4>
                                            <p className="text-slate-400 text-[10px] leading-relaxed mb-4 uppercase tracking-wider">
                                                {cameraError}
                                            </p>
                                            <button 
                                                onClick={() => { setCameraError(null); startCamera(); }}
                                                className="px-6 py-2 bg-[#10B981] text-black font-black text-[9px] rounded-full hover:scale-105 transition-all uppercase tracking-widest"
                                            >
                                                REINTENTAR
                                            </button>
                                            {!isSecure && (
                                                <p className="mt-4 text-[8px] text-amber-500 font-bold uppercase italic">
                                                    (Usa HTTPS o LOCALHOST)
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <video 
                                                ref={videoRef} 
                                                autoPlay 
                                                playsInline 
                                                muted
                                                className="w-full h-full object-cover scale-x-[-1]" 
                                            />
                                            {/* Overlay Máscara */}
                                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
                                                <div className="w-3/4 h-3/4 border-2 border-[#10B981] rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#10B981] animate-pulse"></div>
                                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#10B981] animate-pulse"></div>
                                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#10B981] animate-pulse"></div>
                                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#10B981] animate-pulse"></div>
                                                    <div className="absolute inset-0 bg-[#10B981]/10"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="mt-6 flex flex-col items-center w-full">
                                    <p className="text-xs text-[#10B981] font-black uppercase tracking-widest mb-4">
                                        {faceSystemStatus}
                                    </p>
                                    
                                    <button
                                        onClick={captureAndExecute}
                                        disabled={isScanning || !!cameraError || loading}
                                        className="w-full py-4 bg-gradient-to-r from-[#10B981] to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 border border-[#10B981]/50 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-glow-emerald transition-all transform hover:scale-[1.02] active:scale-95 text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {(isScanning || loading) ? (
                                            <span className="material-icons-round animate-spin">sync</span>
                                        ) : (
                                            <span className="material-icons-round">camera</span>
                                        )}
                                        <span>{(isScanning || loading) ? 'Procesando Transacción...' : 'Confirmar Identidad y Descargar'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="mt-auto border-t border-gray-800 bg-[#0d121d] py-6">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-slate-500 font-bold tracking-[0.4em] uppercase">Validex UP © 2026. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}
