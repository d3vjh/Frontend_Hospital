import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './hospital-complete.css'
import { AuthProvider } from '../context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hospital DB - Sistema de Gestión',
  description: 'Sistema de gestión hospitalaria distribuida',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}