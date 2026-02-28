import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, isLoading, children, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.99] transform transition-all',
            secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
            outline: 'bg-transparent border border-emerald-500 text-emerald-500 hover:bg-emerald-500/10',
            ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-12 px-6',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
