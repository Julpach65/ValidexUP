'use client'
import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'

interface Props {
    onComplete?: (code: string) => void
    state?: 'default' | 'success' | 'error'
}

export default function OtpInput({ onComplete, state = 'default' }: Props) {
    const refs = useRef<(HTMLInputElement | null)[]>([])
    const [value, setValue] = useState<string[]>(Array(6).fill(''))

    const stateClass = {
        default: '',
        success: 'success',
        error: 'error',
    }[state]

    const handleChange = (i: number, char: string) => {
        const digit = char.replace(/\D/g, '').slice(-1)
        const next = [...value]
        next[i] = digit
        setValue(next)

        if (digit && i < 5) {
            refs.current[i + 1]?.focus()
        }

        if (next.every(v => v !== '') && onComplete) {
            onComplete(next.join(''))
        }
    }

    const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value[i] && i > 0) {
            refs.current[i - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!text) return
        const next = [...value]
        text.split('').forEach((c, i) => { next[i] = c })
        setValue(next)

        if (next.every(v => v !== '') && onComplete) {
            onComplete(next.join(''))
        } else {
            refs.current[Math.min(text.length, 5)]?.focus()
        }
    }

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => { refs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`otp-input ${stateClass} w-10 h-12 text-center text-lg font-bold bg-[#0f1623] border border-slate-700 rounded-lg text-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all`}
                    id={`otp-${i}`}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    )
}
