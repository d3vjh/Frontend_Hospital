'use client'

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // 🔥 ESTE ES EL USEEFFECT QUE FALTABA PARA LA REDIRECCIÓN
  useEffect(() => {
    console.log('🔄 LoginPage: Verificando estado de autenticación...', {
      isLoading,
      isAuthenticated,
      userExists: !!user
    });
    
    if (!isLoading && isAuthenticated) {
      console.log('✅ LoginPage: Usuario autenticado, redirigiendo al dashboard...');
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar mensaje mientras redirige
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">¡Bienvenido! Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar formulario de login
  return <LoginForm onLogin={login} />;
}