'use client'

import React, { useState } from 'react';
import { Heart, Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string; role: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: 'MEDICO_ESPECIALISTA'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validación básica
    if (!credentials.username || !credentials.password) {
      setError('Por favor complete todos los campos');
      setIsLoading(false);
      return;
    }

    // Simular llamada al backend (reemplazar con API real)
    setTimeout(() => {
      // Credenciales de demo
      if (credentials.username === 'admin' && credentials.password === '123456') {
        onLogin(credentials);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Limpiar error al escribir
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">HOSPITAL DB</h1>
          </div>
          <p className="text-gray-600 text-sm">Sistema de Gestión Hospitalaria</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Ingrese su usuario"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Ingrese su contraseña"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 
                  <EyeOff className="w-5 h-5" /> : 
                  <Eye className="w-5 h-5" />
                }
              </button>
            </div>
          </div>

          {/* Role Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              name="role"
              value={credentials.role}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
            >
              <option value="PACIENTE">Paciente</option>
              <option value="ENFERMERO">Enfermero</option>
              <option value="MEDICO_GENERAL">Médico General</option>
              <option value="MEDICO_ESPECIALISTA">Médico Especialista</option>
              <option value="DIRECTOR">Director</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Credenciales de demo:
          </p>
          <p className="text-xs text-gray-600">Usuario: admin</p>
          <p className="text-xs text-gray-600">Contraseña: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;