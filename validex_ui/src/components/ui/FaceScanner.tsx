'use client'

interface Props {
    color?: 'green' | 'red'
    statusLabel?: string
}

export default function FaceScanner({ color = 'green', statusLabel }: Props) {
    const borderColor = color === 'green' ? '#22d3ee' : '#EF4444'
    const shadowColor = color === 'green'
        ? '0 0 15px rgba(34,211,238,0.6)'
        : '0 0 15px rgba(239,68,68,0.6)'
    const dotColor = color === 'green' ? '#10B981' : '#EF4444'
    const labelText = statusLabel ?? (color === 'green' ? 'Escaneando...' : 'Denegado')

    return (
        <div
            className="relative w-full max-w-md aspect-square rounded-2xl border border-gray-800 bg-black overflow-hidden shadow-2xl"
            style={{ maxWidth: '400px' }}
        >
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black opacity-60 z-0" />

            {/* Face silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 z-0">
                <svg className="w-64 h-64 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </div>

            {/* Grain */}
            <div className="absolute inset-0 grain-overlay z-0 pointer-events-none mix-blend-overlay" />

            {/* Color tint */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: `${color === 'green' ? 'rgba(16,185,129,0.03)' : 'rgba(239,68,68,0.05)'}` }}
            />

            {/* Corner brackets */}
            <div className="corner-tl" style={{ color: borderColor, boxShadow: shadowColor }} />
            <div className="corner-tr" style={{ color: borderColor, boxShadow: shadowColor }} />
            <div className="corner-bl" style={{ color: borderColor, boxShadow: shadowColor }} />
            <div className="corner-br" style={{ color: borderColor, boxShadow: shadowColor }} />

            {/* Status badge */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/80 px-3 py-1 rounded-full border z-20"
                style={{ borderColor: `${dotColor}80` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: dotColor }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: dotColor }}>
                    {labelText}
                </span>
            </div>

            {/* Center frame */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div
                    className="w-48 h-48 rounded-2xl flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-hidden border"
                    style={{ borderColor: `${borderColor}50` }}
                >
                    <div className={`scan-line ${color === 'green' ? 'scan-line-green' : 'scan-line-red'}`} />
                    {color === 'green' ? (
                        <>
                            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 bg-cyan-500/10"
                                style={{ borderColor: '#22d3ee80' }}>
                                <span className="material-icons-round text-4xl text-cyan-400">face</span>
                            </div>
                            <div className="px-4 py-1.5 bg-cyan-500/80 rounded text-white text-xs font-bold uppercase tracking-wide"
                                style={{ boxShadow: '0 0 10px rgba(34,211,238,0.4)' }}>
                                Posiciona tu cara
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center mb-4 bg-red-500/10">
                                <span className="material-icons-round text-red-400 text-4xl">close</span>
                            </div>
                            <div className="px-4 py-1.5 bg-red-500 rounded text-white text-xs font-bold uppercase tracking-wide shadow-glow-red">
                                Acceso Denegado
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
