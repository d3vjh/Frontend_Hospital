'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string; role: string }) => void;
  logout: () => void;
  updatePassword: (passwords: { current: string; new: string; confirm: string }) => void;
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

  const login = (credentials: { username: string; password: string; role: string }) => {
    // Simular respuesta del backend - reemplazar con API real
    const userData: User = {
      id: 1,
      name: getRoleDisplayName(credentials.role, credentials.username),
      role: credentials.role,
      department: getDepartmentByRole(credentials.role),
      avatar: `https://ui-avatars.com/api/?name=${credentials.username}&background=3b82f6&color=fff`,
      email: `${credentials.username}@hospital.com`,
      phone: '+57-300-1234567'
    };
    
    setUser(userData);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('hospital_user', JSON.stringify(userData));
    
    console.log('Usuario logueado:', userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
    console.log('Usuario deslogueado');
  };

  const updatePassword = (passwords: { current: string; new: string; confirm: string }) => {
    // Simular actualización de contraseña
    console.log('Contraseña actualizada para:', user?.name);
    
    // Aquí iría la llamada al backend
    // fetch('/api/auth/change-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: user?.id, ...passwords })
    // });
  };

  // Funciones auxiliares
  const getRoleDisplayName = (role: string, username: string) => {
    const roleNames = {
      'PACIENTE': `${username}`,
      'ENFERMERO': `Enf. ${username}`,
      'MEDICO_GENERAL': `Dr. ${username}`,
      'MEDICO_ESPECIALISTA': `Dr. ${username}`,
      'DIRECTOR': `Dir. ${username}`
    };
    return roleNames[role as keyof typeof roleNames] || username;
  };

  const getDepartmentByRole = (role: string) => {
    const departments = {
      'PACIENTE': 'N/A',
      'ENFERMERO': 'Enfermería',
      'MEDICO_GENERAL': 'Medicina General',
      'MEDICO_ESPECIALISTA': 'Cardiología',
      'DIRECTOR': 'Dirección General'
    };
    return departments[role as keyof typeof departments] || 'Desconocido';
  };

  // Verificar si hay usuario guardado al cargar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('hospital_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('hospital_user');
      }
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};