'use client'

import React, { useState } from 'react';
import { Heart, Eye, EyeOff, User, Lock, AlertCircle, Wifi, WifiOff, Shield, Building2, RefreshCw } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string; role: string }) => Promise<void>;
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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Verificar conexión al backend al cargar
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch('http://localhost:8000/', { 
        method: 'GET',
        timeout: 5000 
      } as RequestInit);
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('✅ Backend conectado');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      console.warn('⚠️ Backend no disponible, modo offline:', error);
    }
  };

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

    if (credentials.password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 LoginForm: Iniciando submit con:', {
        username: credentials.username,
        role: credentials.role,
        backendStatus: connectionStatus
      });

      await onLogin(credentials);
      
      console.log('✅ LoginForm: Login completado exitosamente');
      console.log('🚀 LoginForm: Debería redirigir automáticamente...');
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      console.error('❌ LoginForm: Error de login:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Limpiar error al escribir
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#eab308',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />;
      case 'connected':
        return <Wifi size={16} color="#16a34a" />;
      case 'disconnected':
        return <WifiOff size={16} color="#dc2626" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Verificando conexión...';
      case 'connected':
        return 'Backend conectado';
      case 'disconnected':
        return 'Modo offline - Usando datos demo';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DIRECTOR':
        return <Building2 size={16} color="#7c3aed" />;
      case 'MEDICO_ESPECIALISTA':
      case 'MEDICO_GENERAL':
        return <Shield size={16} color="#2563eb" />;
      case 'ENFERMERO':
        return <User size={16} color="#16a34a" />;
      default:
        return <User size={16} color="#6b7280" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DIRECTOR': return '#7c3aed';
      case 'MEDICO_ESPECIALISTA':
      case 'MEDICO_GENERAL': return '#2563eb';
      case 'ENFERMERO': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .login-container {
          animation: slideInUp 0.6s ease-out;
        }
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transform: translateY(-1px);
        }
        .input-field {
          transition: all 0.3s ease;
        }
        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
        .login-button {
          transition: all 0.3s ease;
        }
        .role-option:hover {
          background-color: #f8fafc;
        }
        .demo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        .demo-card {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '80px',
        height: '80px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />

      <div style={{
        position: 'absolute',
        top: '60%',
        left: '5%',
        width: '60px',
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite'
      }} />

      {/* Main login card */}
      <div className="login-container" style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '28rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }} className="floating-element">
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
            }}>
              <Heart color="white" size={32} />
            </div>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>HOSPITAL DB</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>Sistema de Gestión Hospitalaria</p>
          
          {/* Estado de conexión mejorado */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: connectionStatus === 'connected' ? '#f0fdf4' : 
                           connectionStatus === 'disconnected' ? '#fef2f2' : '#fffbeb',
            borderRadius: '2rem',
            border: `1px solid ${
              connectionStatus === 'connected' ? '#bbf7d0' :
              connectionStatus === 'disconnected' ? '#fecaca' : '#fed7aa'
            }`
          }}>
            {getConnectionStatusIcon()}
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: connectionStatus === 'connected' ? '#16a34a' :
                     connectionStatus === 'disconnected' ? '#dc2626' : '#d97706'
            }}>
              {getConnectionStatusText()}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <p style={{
              color: '#dc2626',
              fontSize: '0.875rem',
              margin: 0,
              fontWeight: '500'
            }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10
              }}>
                <User size={20} color="#9ca3af" />
              </div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Ingrese su usuario"
                required
                disabled={isLoading}
                className="input-field"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: isLoading ? '#f9fafb' : 'white',
                  cursor: isLoading ? 'not-allowed' : 'text'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10
              }}>
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Ingrese su contraseña"
                required
                disabled={isLoading}
                className="input-field"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: isLoading ? '#f9fafb' : 'white',
                  cursor: isLoading ? 'not-allowed' : 'text'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: '#6b7280',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.color = '#374151')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.color = '#6b7280')}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Rol en el Sistema
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10
              }}>
                {getRoleIcon(credentials.role)}
              </div>
              <select
                name="role"
                value={credentials.role}
                onChange={handleInputChange}
                disabled={isLoading}
                className="input-field"
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '1rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: isLoading ? '#f9fafb' : 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: getRoleColor(credentials.role),
                  fontWeight: '500'
                }}
              >
                <option value="PACIENTE">👤 Paciente</option>
                <option value="ENFERMERO">👩‍⚕️ Enfermero/a</option>
                <option value="MEDICO_GENERAL">🩺 Médico General</option>
                <option value="MEDICO_ESPECIALISTA">⚕️ Médico Especialista</option>
                <option value="DIRECTOR">🏛️ Director</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: isLoading ? 'none' : '0 10px 25px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isLoading && (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {isLoading ? 'Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>
        </form>

        {/* Demo Credentials Card */}
        <div className="demo-card" style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Shield size={18} color="#3b82f6" />
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0
            }}>Credenciales de Demostración</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.25rem 0' }}>Usuario</p>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>admin</p>
            </div>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.25rem 0' }}>Contraseña</p>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>123456</p>
            </div>
          </div>
          
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.5rem',
            border: '1px solid #93c5fd'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#1e40af',
              margin: 0,
              textAlign: 'center'
            }}>
              ✨ Funciona con backend conectado y en modo offline
            </p>
          </div>
        </div>

        {/* Reconnect Button */}
        {connectionStatus === 'disconnected' && (
          <button
            onClick={checkBackendConnection}
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              color: '#3b82f6',
              backgroundColor: 'transparent',
              border: '1px solid #3b82f6',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#eff6ff')}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <RefreshCw size={16} />
            🔄 Reintentar conexión al backend
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;