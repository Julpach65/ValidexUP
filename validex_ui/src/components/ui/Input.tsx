import React, { InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="text-[11px] uppercase tracking-wider font-bold text-slate-500 ml-1 mb-2 block">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-lg border border-slate-700 bg-[#151d2e] px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                            icon && "pl-10",
                            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';
