'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI, clearAuthToken } from '../services/api/hospitalAPI';

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email?: string;
  phone?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  updatePassword: (passwords: { current: string; new: string; confirm: string }) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: { username: string; password: string; role: string }) => {
    console.log('🔐 AuthContext: Iniciando proceso de login...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 AuthContext: Llamando authAPI.login...');
      const result = await authAPI.login(credentials);
      console.log('📋 AuthContext: Resultado recibido:', result);
      
      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          department: result.user.department,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=3b82f6&color=fff`,
          email: result.user.email,
          phone: typeof (result.user as any).phone === 'string' && (result.user as any).phone ? (result.user as any).phone : '+57-300-1234567',
          username: result.user.username
        };
        
        console.log('👤 AuthContext: Datos del usuario procesados:', userData);
        
        setUser(userData);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('hospital_user', JSON.stringify(userData));
        
        console.log('✅ AuthContext: Usuario logueado exitosamente');
        console.log('🔄 AuthContext: Debería redirigir al dashboard...');
        
      } else {
        console.error('❌ AuthContext: Respuesta de login inválida:', result);
        throw new Error('Respuesta de login inválida');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      console.error('❌ AuthContext: Error de login:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    clearAuthToken();
    localStorage.removeItem('hospital_user');
    console.log('🚪 Usuario deslogueado');
  };

  const updatePassword = async (passwords: { current: string; new: string; confirm: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validaciones básicas
      if (passwords.new !== passwords.confirm) {
        throw new Error('Las contraseñas nuevas no coinciden');
      }
      
      if (passwords.new.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // TODO: Implementar llamada real al backend cuando esté disponible
      // await authAPI.changePassword(passwords);
      
      console.log('🔐 Contraseña actualizada para:', user?.name);
      
      // Simular éxito por ahora
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar contraseña';
      setError(errorMessage);
      console.error('❌ Error actualizando contraseña:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si hay usuario guardado al cargar y validar token
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const savedUser = localStorage.getItem('hospital_user');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Intentar validar el token con el backend
          try {
            await authAPI.getCurrentUser();
            setUser(userData);
            console.log('✅ Usuario restaurado desde localStorage:', userData.name);
          } catch (err) {
            console.warn('⚠️ Token expirado o inválido, limpiando sesión');
            localStorage.removeItem('hospital_user');
            clearAuthToken();
          }
        }
      } catch (error) {
        console.error('❌ Error inicializando autenticación:', error);
        localStorage.removeItem('hospital_user');
        clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updatePassword,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};