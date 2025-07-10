import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // ← ASEGÚRATE DE QUE ESTA LÍNEA EXISTE
import { AuthProvider } from '../context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hospital DB - Sistema de Gestión Hospitalaria',
  description: 'Sistema integral de gestión hospitalaria con base de datos distribuida',
  keywords: 'hospital, gestión, base de datos, citas, pacientes, empleados',
  authors: [{ name: 'Hospital Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}