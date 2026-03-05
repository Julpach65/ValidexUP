'use client';

import { useEffect, useState } from 'react';

interface PasswordStrengthProps {
    password?: string;
    onValidationChange: (isValid: boolean) => void;
}

const requirements = [
    { id: 'length', text: 'Mínimo 8 caracteres', regex: /.{8,}/ },
    { id: 'uppercase', text: 'Al menos una mayúscula', regex: /[A-Z]/ },
    { id: 'lowercase', text: 'Al menos una minúscula', regex: /[a-z]/ },
    { id: 'number', text: 'Al menos un número', regex: /[0-9]/ },
    { id: 'special', text: 'Al menos un carácter especial (@, $, !, #, etc.)', regex: /[@$!%*?&#]/ },
];

export default function PasswordStrength({ password = '', onValidationChange }: PasswordStrengthProps) {
    const [validation, setValidation] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const newValidation: Record<string, boolean> = {};
        let allValid = true;
        for (const req of requirements) {
            const isValid = req.regex.test(password);
            newValidation[req.id] = isValid;
            if (!isValid) allValid = false;
        }
        setValidation(newValidation);
        onValidationChange(allValid);

    }, [password, onValidationChange]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-2 text-xs">
            {requirements.map(req => {
                const isValid = validation[req.id];
                return (
                    <div key={req.id} className={`flex items-center gap-2 transition-colors duration-300 ${isValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className="material-icons-round text-base">{isValid ? 'check_circle' : 'highlight_off'}</span>
                        <span className="font-semibold tracking-wide">{req.text}</span>
                    </div>
                );
            })}
        </div>
    );
}