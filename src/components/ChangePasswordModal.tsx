'use client'

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, Check, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passwords: { current: string; new: string; confirm: string }) => void;
  userName: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userName 
}) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = () => {
    const newErrors: string[] = [];
    
    if (passwords.current.length < 1) {
      newErrors.push('Debe ingresar la contraseña actual');
    }
    
    if (passwords.new.length < 8) {
      newErrors.push('La nueva contraseña debe tener al menos 8 caracteres');
    }
    
    if (passwords.new === passwords.current) {
      newErrors.push('La nueva contraseña debe ser diferente a la actual');
    }
    
    if (passwords.new !== passwords.confirm) {
      newErrors.push('Las contraseñas nuevas no coinciden');
    }
    
    if (passwords.new && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.new)) {
      newErrors.push('La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);
    
    // Simular llamada al backend
    setTimeout(() => {
      onSubmit(passwords);
      setIsLoading(false);
      setPasswords({ current: '', new: '', confirm: '' });
      setErrors([]);
      onClose();
      
      // Mostrar mensaje de éxito (esto se puede mejorar con un sistema de notificaciones)
      alert('Contraseña cambiada exitosamente');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleClose = () => {
    setPasswords({ current: '', new: '', confirm: '' });
    setErrors([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cambiar Contraseña
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-3 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            Cambiando contraseña para: <strong>{userName}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => handleInputChange('current', e.target.value)}
                placeholder="Ingrese su contraseña actual"
                required
                className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => handleInputChange('new', e.target.value)}
                placeholder="Ingrese su nueva contraseña"
                required
                className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                placeholder="Confirme su nueva contraseña"
                required
                className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm font-medium text-red-600">
                  Por favor corrija los siguientes errores:
                </p>
              </div>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600 ml-6">
                  • {error}
                </p>
              ))}
            </div>
          )}

          {/* Password Requirements */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-2">
              Requisitos de la contraseña:
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• Mínimo 8 caracteres</p>
              <p>• Al menos una mayúscula y una minúscula</p>
              <p>• Al menos un número</p>
              <p>• Diferente a la contraseña actual</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cambiando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;