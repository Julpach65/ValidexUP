'use client'

interface Props {
    value: number   // 0-100
    maxLabel?: string
    currentLabel?: string
}

export default function GaugeCircle({ value, maxLabel = '15,000 L', currentLabel }: Props) {
    const r = 80
    const circ = 2 * Math.PI * r
    const offset = circ - (value / 100) * circ
    const displayVal = currentLabel ?? `${Math.round(value)}%`

    const color = value < 60 ? '#10B981' : value < 85 ? '#f59e0b' : '#EF4444'

    return (
        <div className="relative flex items-center justify-center w-52 h-52">
            <svg viewBox="0 0 196 196" className="w-full h-full -rotate-90">
                {/* Track */}
                <circle cx="98" cy="98" r={r} fill="none" stroke="#1E293B" strokeWidth="12" />
                {/* Progress */}
                <circle
                    cx="98" cy="98" r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${color}80)` }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{displayVal}</span>
                <span className="text-xs text-gray-400 mt-1">de {maxLabel}</span>
            </div>
        </div>
    )
}
