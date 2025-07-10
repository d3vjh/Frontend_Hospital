'use client'

import { useAuth } from '../../context/AuthContext'
import LoginForm from '../../components/LoginForm'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = (credentials: { username: string; password: string; role: string }) => {
    login(credentials);
    // La redirección se maneja en el useEffect de arriba
  };

  return <LoginForm onLogin={handleLogin} />;
}