'use client'

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

export default function HomePage() {
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 HomePage: Verificando autenticación...', {
      isLoading,
      isAuthenticated,
      userExists: !!user
    });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('✅ HomePage: Usuario autenticado, redirigiendo al dashboard...');
        router.push('/dashboard');
      } else {
        console.log('🔐 HomePage: Usuario no autenticado, redirigiendo al login...');
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Fallback mientras se hace la redirección
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}