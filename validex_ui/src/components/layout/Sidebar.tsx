// src/components/layout/Sidebar.tsx
import React from 'react';
import { Shield, Settings, CheckCircle } from 'lucide-react';
import { APP_INFO } from '@/data/mockData';

export default function Sidebar() {
    return (
        <aside className="w-full lg:w-[380px] xl:w-[450px] hidden lg:flex flex-col justify-between p-8 bg-slate-800 border-r border-slate-700 relative z-10 shrink-0">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 flex items-center justify-center">
                    <img src="/logo-v2.png" alt="Validex Logo" className="w-full h-full object-contain" />
                </div>
                <div className="text-xl font-bold text-white tracking-tight">
                    {APP_INFO.name} <span className="text-emerald-500">{APP_INFO.suffix}</span>
                </div>
            </div>

            <div className="flex flex-col gap-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700 shadow-lg shadow-black/20">
                    <Settings className="text-emerald-500 w-8 h-8" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-white mb-4 leading-snug">
                        Seguridad de Grado Corporativo
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Plataforma B2B para autorización segura de recursos tácticos y logísticos.
                    </p>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                    <div className="flex gap-4">
                        <CheckCircle className="text-emerald-500 mt-1 w-5 h-5 shrink-0" />
                        <div>
                            <h3 className="text-white font-semibold text-sm mb-1">Protección de Identidad</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Vinculación biométrica y MFA único por cuenta corporativa.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Shield className="text-emerald-500 mt-1 w-5 h-5 shrink-0" />
                        <div>
                            <h3 className="text-white font-semibold text-sm mb-1">Control de Acceso (RBAC)</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Niveles de acceso definidos por la estructura jerárquica de su organización.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
                {APP_INFO.copyright}
            </div>
        </aside>
    );
}
