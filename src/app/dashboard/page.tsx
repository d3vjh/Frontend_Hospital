'use client'

import { useAuth } from '../../context/AuthContext'
import HospitalDashboard from '../../components/HospitalDashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Si no está logueado, redirigir al login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <HospitalDashboard />;
}