import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './hospital-complete.css'

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
        {children}
      </body>
    </html>
  )
}