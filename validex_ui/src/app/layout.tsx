import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Validex UP',
  description: 'Sistema B2B de Autorización Geométrica y Acceso Táctico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-300 antialiased selection:bg-emerald-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
