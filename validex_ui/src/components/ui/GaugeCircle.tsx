'use client'
import { motion, AnimatePresence } from 'framer-motion'

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
                <motion.circle
                    cx="98" cy="98" r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.span 
                        key={displayVal}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-3xl font-black text-white tracking-tighter"
                    >
                        {displayVal}
                    </motion.span>
                </AnimatePresence>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-60">de {maxLabel}</span>
            </div>
            
            {/* Ambient Pulse */}
            <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ backgroundColor: color, filter: 'blur(40px)' }}
            />
        </div>
    )
}
