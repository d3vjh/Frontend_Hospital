'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Heart, 
  Users, 
  Calendar, 
  Activity, 
  Stethoscope, 
  UserPlus, 
  Package, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  FileText, 
  Pill,
  Monitor,
  ClipboardList,
  User,
  Filter,
  Download,
  Upload,
  Lock,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import { usePatients } from '../hooks/usePatients';

// Interface para props del componente
interface HospitalDashboardProps {
  activeSection?: string;
}

// Interfaces para datos
interface MockUsuario {
  id: string;
  nombre: string;
  rol: string;
  departamento: string;
  especialidad: string | null;
}

interface MockCita {
  id: string;
  paciente: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
  diagnostico: string;
  observaciones: string;
  prescripciones: string[];
  archivos: string[];
}

const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ activeSection: propActiveSection }) => {
  const { user, logout, updatePassword } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Estados principales
  const [activeSection, setActiveSection] = useState(propActiveSection || 'dashboard');
  const [notifications] = useState(3);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Estados para los campos editables del perfil
  const [profileData, setProfileData] = useState({
    email: user?.email || "usuario@hospital.com",
    phone: user?.phone || "+57-300-1234567"
  });

  // Estados para funcionalidad avanzada
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>('medico_1');
  const [citasUsuario, setCitasUsuario] = useState<MockCita[]>([]);
  const [loadingCitas, setLoadingCitas] = useState<boolean>(false);
  const [modalActivo, setModalActivo] = useState<string | null>(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState<MockCita | null>(null);
  const [filtrosUsuario, setFiltrosUsuario] = useState({
    fecha: '',
    estado: '',
    tipo: '',
    paciente: ''
  });

  // Datos del usuario actual
  const currentUser: any = {
    id: user?.id || 1,
    name: user?.name || 'Dr. Carlos Rodríguez',
    role: user?.role || 'MEDICO_ESPECIALISTA',
    department: user?.department || 'Cardiología',
    avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=3b82f6&color=fff'
  };

  // Función para enviar datos al backend
  const sendToBackend = (action: string, data: any) => {
    const payload = {
      action,
      data,
      user: currentUser.id,
      timestamp: new Date().toISOString()
    };
    
    console.log('Enviando al backend:', JSON.stringify(payload, null, 2));
    
    if (action === 'logout') {
      logout();
      router.push('/login');
    } else if (action === 'change_password') {
      setIsChangePasswordOpen(true);
    }
  };

  // Función para actualizar datos del perfil
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Datos mock para usuarios
  const mockUsuarios: Record<string, MockUsuario> = {
    'medico_1': {
      id: 'medico_1',
      nombre: 'Dr. Carlos Rodríguez',
      rol: 'MEDICO_ESPECIALISTA',
      departamento: 'Cardiología',
      especialidad: 'Cardiología Intervencionista'
    },
    'medico_2': {
      id: 'medico_2',
      nombre: 'Dr. Roberto Silva',
      rol: 'MEDICO_GENERAL',
      departamento: 'Urgencias',
      especialidad: 'Medicina General'
    },
    'admin_1': {
      id: 'admin_1',
      nombre: 'Ana Martínez',
      rol: 'ADMINISTRATIVO',
      departamento: 'Cardiología',
      especialidad: null
    }
  };

  // Datos mock para citas por usuario
  const mockCitasPorUsuario: Record<string, MockCita[]> = {
    'medico_1': [
      {
        id: '1',
        paciente: 'Juan Pérez',
        fecha: '2025-07-10',
        hora: '09:00',
        tipo: 'Consulta Cardiológica',
        estado: 'PROGRAMADA',
        diagnostico: 'Seguimiento post-cirugía',
        observaciones: 'Paciente estable, revisar estudios',
        prescripciones: ['Aspirina 100mg', 'Atorvastatina 20mg'],
        archivos: ['ECG_20250710.pdf', 'Laboratorio_20250710.pdf']
      },
      {
        id: '2',
        paciente: 'Ana Martín',
        fecha: '2025-07-10',
        hora: '10:30',
        tipo: 'Ecocardiograma',
        estado: 'REALIZADA',
        diagnostico: 'Evaluación función ventricular',
        observaciones: 'Función ventricular preservada',
        prescripciones: ['Metoprolol 50mg'],
        archivos: ['Eco_20250710.pdf']
      }
    ],
    'medico_2': [
      {
        id: '3',
        paciente: 'Carlos López',
        fecha: '2025-07-12',
        hora: '14:00',
        tipo: 'Consulta General',
        estado: 'PROGRAMADA',
        diagnostico: 'Consulta por dolor',
        observaciones: 'Paciente refiere mejora con tratamiento',
        prescripciones: ['Ibuprofeno 400mg'],
        archivos: ['Radiografia_20250712.pdf']
      }
    ],
    'admin_1': [
      {
        id: '4',
        paciente: 'María González',
        fecha: '2025-07-11',
        hora: '08:00',
        tipo: 'Cita Administrativa',
        estado: 'PROGRAMADA',
        diagnostico: 'Trámite de documentación',
        observaciones: 'Solicitud de historia clínica',
        prescripciones: [],
        archivos: []
      }
    ]
  };

  // Función para cargar citas por usuario
  const cargarDatosUsuario = async (usuarioId: string) => {
    setLoadingCitas(true);
    sendToBackend('load_user_appointments', { usuarioId, timestamp: new Date().toISOString() });
    
    setTimeout(() => {
      const citasData = mockCitasPorUsuario[usuarioId] || [];
      setCitasUsuario(citasData);
      setLoadingCitas(false);
    }, 1000);
  };

  // Handlers para modales
  const abrirModal = (tipo: string, cita: MockCita | null = null) => {
    setModalActivo(tipo);
    setCitaSeleccionada(cita);
    sendToBackend(`modal_${tipo}`, { citaId: cita?.id, action: 'open' });
  };

  const cerrarModal = () => {
    setModalActivo(null);
    setCitaSeleccionada(null);
    sendToBackend('modal_close', { action: 'close' });
  };

  // Datos de ejemplo
  const dashboardData = {
    totalPacientes: 127,
    citasHoy: 18,
    citasPendientes: 45,
    equiposMantenimiento: 3,
    medicamentosStockBajo: 5,
    prescripcionesActivas: 89
  };

  const pacientes = [
    { id: 1, nombre: 'Juan Pérez', cedula: '11111111', ultimaCita: '2025-07-03', estado: 'ACTIVO', tipoSangre: 'A+' },
    { id: 2, nombre: 'María González', cedula: '22222222', ultimaCita: '2025-07-02', estado: 'ACTIVO', tipoSangre: 'B+' },
    { id: 3, nombre: 'Carlos López', cedula: '33333333', ultimaCita: '2025-07-01', estado: 'ACTIVO', tipoSangre: 'O+' },
    { id: 4, nombre: 'Ana Martín', cedula: '44444444', ultimaCita: '2025-06-30', estado: 'ACTIVO', tipoSangre: 'O-' }
  ];

  const citas = [
    { 
      id: 1, 
      paciente: 'Juan Pérez', 
      cedula: '11111111',
      fecha: '2025-07-10', 
      hora: '09:00', 
      tipo: 'Consulta Especializada', 
      estado: 'PROGRAMADA',
      motivo: 'Control cardiológico',
      medico: 'Dr. Carlos Rodríguez'
    },
    { 
      id: 2, 
      paciente: 'María González', 
      cedula: '22222222',
      fecha: '2025-07-11', 
      hora: '10:30', 
      tipo: 'Consulta General', 
      estado: 'PROGRAMADA',
      motivo: 'Control diabetes',
      medico: 'Dr. Carlos Rodríguez'
    },
    { 
      id: 3, 
      paciente: 'Carlos López', 
      cedula: '33333333',
      fecha: '2025-07-12', 
      hora: '14:00', 
      tipo: 'Consulta General', 
      estado: 'PROGRAMADA',
      motivo: 'Consulta por dolor',
      medico: 'Dr. Roberto Silva'
    }
  ];

  const medicamentos: any[] = [
    { 
      id: 1, 
      nombre: 'Acetaminofén', 
      principio: 'Paracetamol',
      concentracion: '500mg',
      stock: 500,
      stockMinimo: 50,
      precio: 150.00,
      laboratorio: 'Laboratorios Genfar',
      categoria: 'Analgésicos',
      vencimiento: '2025-12-31',
      estado: 'DISPONIBLE'
    },
    { 
      id: 2, 
      nombre: 'Amoxicilina', 
      principio: 'Amoxicilina',
      concentracion: '500mg',
      stock: 300,
      stockMinimo: 30,
      precio: 800.00,
      laboratorio: 'Tecnoquímicas',
      categoria: 'Antibióticos',
      vencimiento: '2025-10-15',
      estado: 'DISPONIBLE'
    }
  ];

  const equipamiento: any[] = [
    { 
      id: 1, 
      nombre: 'Monitor Cardíaco', 
      modelo: 'Lifepak 15', 
      serie: 'MC001', 
      departamento: 'Cardiología',
      estado: 'OPERATIVO',
      proximaCalibacion: '2025-12-30',
      proveedor: 'Medtronic Colombia'
    },
    { 
      id: 2, 
      nombre: 'Electrocardiógrafo', 
      modelo: 'PageWriter TC70', 
      serie: 'EC001', 
      departamento: 'Cardiología',
      estado: 'OPERATIVO',
      proximaCalibacion: '2025-09-15',
      proveedor: 'GE Healthcare'
    }
  ];

  const empleados: any[] = [
    { 
      id: 1, 
      nombre: 'Dr. Carlos Rodríguez', 
      cedula: '12345678',
      departamento: 'Cardiología', 
      rol: 'Médico Especialista',
      estado: 'ACTIVO',
      telefono: '+57-300-1234567',
      email: 'carlos.rodriguez@hospital.com'
    },
    { 
      id: 2, 
      nombre: 'Ana Martínez', 
      cedula: '23456789',
      departamento: 'Cardiología', 
      rol: 'Administrativo',
      estado: 'ACTIVO',
      telefono: '+57-300-2345678',
      email: 'ana.martinez@hospital.com'
    }
  ];

  // Efectos
  useEffect(() => {
    if (usuarioSeleccionado) {
      cargarDatosUsuario(usuarioSeleccionado);
    }
  }, [usuarioSeleccionado]);

  useEffect(() => {
    if (propActiveSection) {
      setActiveSection(propActiveSection);
    }
  }, [propActiveSection]);

  // Función para determinar si una ruta está activa
  const isActiveRoute = (route: string) => {
    if (propActiveSection) return activeSection === route;
    return pathname === `/${route}` || (pathname === '/dashboard' && route === 'dashboard');
  };

  // Función para determinar permisos según rol
  const getPermissions = (role: string) => {
    const permissions: { [key: string]: string[] } = {
      PACIENTE: ['dashboard', 'citas', 'perfil'],
      ENFERMERO: ['dashboard', 'citas', 'perfil', 'equipamiento'],
      MEDICO_GENERAL: ['dashboard', 'citas', 'perfil', 'equipamiento', 'medicamentos', 'pacientes'],
      MEDICO_ESPECIALISTA: ['dashboard', 'citas', 'perfil', 'equipamiento', 'medicamentos', 'pacientes'],
      DIRECTOR: ['dashboard', 'citas', 'perfil', 'equipamiento', 'medicamentos', 'pacientes', 'empleados']
    };
    return permissions[role] || ['dashboard'];
  };

  const hasPermission = (section: string) => {
    return getPermissions(currentUser.role).includes(section);
  };

  // Componente MenuItem
  const MenuItem = ({ icon: Icon, label, active, onClick }: {
    icon: any;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
        active 
          ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  // Componente Sidebar
  const Sidebar = () => (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-xl font-bold">HOSPITAL DB</h1>
            <p className="text-sm text-slate-400">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Principal</h3>
        </div>
        
        {hasPermission('dashboard') && (
          <MenuItem 
            icon={Activity} 
            label="Dashboard" 
            active={isActiveRoute('dashboard')}
            onClick={() => router.push('/dashboard')}
          />
        )}
        
        {hasPermission('citas') && (
          <MenuItem 
            icon={Calendar} 
            label="Citas" 
            active={isActiveRoute('citas')}
            onClick={() => router.push('/citas')}
          />
        )}
        
        {hasPermission('citas') && (
          <MenuItem 
            icon={User} 
            label="Citas por Usuario" 
            active={isActiveRoute('citas-usuario')}
            onClick={() => router.push('/citas-usuario')}
          />
        )}
        
        {hasPermission('pacientes') && (
          <MenuItem 
            icon={Users} 
            label="Pacientes" 
            active={isActiveRoute('pacientes')}
            onClick={() => router.push('/pacientes')}
          />
        )}
        
        {hasPermission('equipamiento') && (
          <MenuItem 
            icon={Monitor} 
            label="Equipamiento" 
            active={isActiveRoute('equipamiento')}
            onClick={() => router.push('/equipamiento')}
          />
        )}

        {hasPermission('medicamentos') && (
          <MenuItem 
            icon={Pill} 
            label="Medicamentos" 
            active={isActiveRoute('medicamentos')}
            onClick={() => router.push('/medicamentos')}
          />
        )}

        {hasPermission('empleados') && (
          <MenuItem 
            icon={Stethoscope} 
            label="Empleados" 
            active={isActiveRoute('empleados')}
            onClick={() => router.push('/empleados')}
          />
        )}

        <MenuItem 
          icon={User} 
          label="Perfil" 
          active={isActiveRoute('perfil')}
          onClick={() => router.push('/perfil')}
        />
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.department}</p>
          </div>
        </div>
        
        <button 
          onClick={() => sendToBackend('logout', { userId: currentUser.id })}
          className="flex items-center space-x-2 text-slate-400 hover:text-white w-full"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  // Componente TopBar
  const TopBar = () => (
    <div className="bg-white shadow-sm border-b px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeSection === 'citas-usuario' ? 'Citas por Usuario' : activeSection}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button 
            className="relative p-2 text-gray-600 hover:text-gray-800"
            onClick={() => sendToBackend('view_notifications', { userId: currentUser.id })}
          >
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Componente StatCard
  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
    title: string;
    value: number;
    change?: number;
    icon: any;
    color?: string;
  }) => {
    const colorClasses: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '↗' : '↘'} {Math.abs(change)}% desde el mes pasado
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]} text-white`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  };

  // Componente EquipamientoView
const EquipamientoView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Gestión de Equipamiento</h3>
      <button 
        onClick={() => sendToBackend('create_equipment', { type: 'new_equipment' })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Equipo</span>
      </button>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <p className="text-gray-600">Vista de equipamiento - Conectar con backend /equipamiento/</p>
    </div>
  </div>
);

// Componente MedicamentosView
const MedicamentosView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Gestión de Medicamentos</h3>
      <button 
        onClick={() => sendToBackend('create_medication', { type: 'new_medication' })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Medicamento</span>
      </button>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <p className="text-gray-600">Vista de medicamentos - Conectar con backend /medicamentos/</p>
    </div>
  </div>
);

// Componente EmpleadosView
const EmpleadosView = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Gestión de Empleados</h3>
      <button 
        onClick={() => sendToBackend('create_employee', { type: 'new_employee' })}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Nuevo Empleado</span>
      </button>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <p className="text-gray-600">Vista de empleados - Conectar con backend /empleados/</p>
    </div>
  </div>
);

// Componente PerfilView
const PerfilView = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-6">Mi Perfil</h3>
      
      <div className="flex items-center space-x-6 mb-6">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h4 className="text-xl font-semibold">{currentUser.name}</h4>
          <p className="text-gray-600">{currentUser.department}</p>
          <p className="text-sm text-gray-500">Rol: {currentUser.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={profileData.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input 
            type="tel" 
            value={profileData.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button 
          onClick={() => sendToBackend('update_profile', { 
            userId: currentUser.id, 
            profileData: profileData 
          })}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
        <button 
          onClick={() => sendToBackend('change_password', { userId: currentUser.id })}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Cambiar Contraseña</span>
        </button>
      </div>
    </div>
  </div>
);

  // Componente CitasUsuarioView
  const CitasUsuarioView = () => {
    const citasFiltradas = citasUsuario.filter((cita: MockCita) => {
      return (
        (!filtrosUsuario.fecha || cita.fecha === filtrosUsuario.fecha) &&
        (!filtrosUsuario.estado || cita.estado === filtrosUsuario.estado) &&
        (!filtrosUsuario.tipo || cita.tipo.toLowerCase().includes(filtrosUsuario.tipo.toLowerCase())) &&
        (!filtrosUsuario.paciente || cita.paciente.toLowerCase().includes(filtrosUsuario.paciente.toLowerCase()))
      );
    });

    return (
      <div className="space-y-6">
        {/* Header con selector de usuario */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gestión de Citas por Usuario</h3>
            <select
              value={usuarioSeleccionado}
              onChange={(e) => {
                setUsuarioSeleccionado(e.target.value);
                sendToBackend('change_user_view', { newUserId: e.target.value });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(mockUsuarios).map(([id, usuario]) => (
                <option key={id} value={id}>
                  {usuario.nombre} - {usuario.rol}
                </option>
              ))}
            </select>
          </div>
          
          {/* Información del usuario actual */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <User className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">{mockUsuarios[usuarioSeleccionado]?.nombre}</p>
                <p className="text-sm text-gray-600">
                  {mockUsuarios[usuarioSeleccionado]?.departamento} - {mockUsuarios[usuarioSeleccionado]?.rol}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros dinámicos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="mr-2" size={20} />
            Filtros por Usuario
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={filtrosUsuario.fecha}
                onChange={(e) => {
                  setFiltrosUsuario({...filtrosUsuario, fecha: e.target.value});
                  sendToBackend('filter_change', { filter: 'fecha', value: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtrosUsuario.estado}
                onChange={(e) => {
                  setFiltrosUsuario({...filtrosUsuario, estado: e.target.value});
                  sendToBackend('filter_change', { filter: 'estado', value: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="PROGRAMADA">Programada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cita</label>
              <input
                type="text"
                placeholder="Buscar tipo..."
                value={filtrosUsuario.tipo}
                onChange={(e) => {
                  setFiltrosUsuario({...filtrosUsuario, tipo: e.target.value});
                  sendToBackend('filter_change', { filter: 'tipo', value: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={filtrosUsuario.paciente}
                onChange={(e) => {
                  setFiltrosUsuario({...filtrosUsuario, paciente: e.target.value});
                  sendToBackend('filter_change', { filter: 'paciente', value: e.target.value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Lista de citas o estado de carga */}
        {loadingCitas ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos del usuario...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h4 className="text-xl font-semibold">
                Citas del Usuario ({citasFiltradas.length})
              </h4>
            </div>
            
            <div className="divide-y">
              {citasFiltradas.map((cita: MockCita) => (
                <div key={cita.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h5 className="font-semibold text-lg">{cita.paciente}</h5>
                          <p className="text-gray-600">{cita.tipo}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          <span>{cita.fecha}</span>
                          <Clock size={16} />
                          <span>{cita.hora}</span>
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cita.estado === 'REALIZADA' ? 'bg-green-100 text-green-800' :
                          cita.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cita.estado}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Diagnóstico:</strong> {cita.diagnostico}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Observaciones:</strong> {cita.observaciones}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => abrirModal('ver', cita)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button
                        onClick={() => abrirModal('editar', cita)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Editar cita"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => abrirModal('prescripcion', cita)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                        title="Agregar prescripción"
                      >
                        <Pill size={18} />
                      </button>
                      
                      <button
                        onClick={() => abrirModal('archivos', cita)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
                        title="Subir archivos"
                      >
                        <Upload size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {citasFiltradas.length === 0 && (
                <div className="p-12 text-center">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">No se encontraron citas con los filtros aplicados</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas del usuario */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Citas</p>
                <p className="text-2xl font-bold">{citasUsuario.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Realizadas</p>
                <p className="text-2xl font-bold">
                  {citasUsuario.filter((c: MockCita) => c.estado === 'REALIZADA').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Programadas</p>
                <p className="text-2xl font-bold">
                  {citasUsuario.filter((c: MockCita) => c.estado === 'PROGRAMADA').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Prescripciones</p>
                <p className="text-2xl font-bold">
                  {citasUsuario.reduce((total: number, cita: MockCita) => total + cita.prescripciones.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de integración con backend */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <h4 className="text-xl font-bold mb-4">🚀 Estructura Preparada para Backend</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">APIs Simuladas:</h5>
              <ul className="space-y-1 opacity-90">
                <li>• GET /api/usuarios/{'{id}'}/citas</li>
                <li>• POST /api/citas</li>
                <li>• PUT /api/citas/{'{id}'}</li>
                <li>• POST /api/citas/{'{id}'}/prescripciones</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Funcionalidades:</h5>
              <ul className="space-y-1 opacity-90">
                <li>• Filtros dinámicos por usuario</li>
                <li>• Estados de carga integrados</li>
                <li>• Modales preparados para backend</li>
                <li>• Control de acceso por roles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente DashboardView
  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Pacientes" 
          value={dashboardData.totalPacientes} 
          change={3.48}
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          title="Citas Hoy" 
          value={dashboardData.citasHoy} 
          change={-1.10}
          icon={Calendar} 
          color="green" 
        />
        <StatCard 
          title="Citas Pendientes" 
          value={dashboardData.citasPendientes} 
          change={12}
          icon={ClipboardList} 
          color="yellow" 
        />
        
        {hasPermission('equipamiento') && (
          <StatCard 
            title="Equipos en Mantenimiento" 
            value={dashboardData.equiposMantenimiento} 
            icon={Monitor} 
            color="red" 
          />
        )}
        
        {hasPermission('medicamentos') && (
          <StatCard 
            title="Medicamentos Stock Bajo" 
            value={dashboardData.medicamentosStockBajo} 
            icon={Pill} 
            color="red" 
          />
        )}
        
        <StatCard 
          title="Prescripciones Activas" 
          value={dashboardData.prescripcionesActivas} 
          icon={FileText} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Citas de Hoy</h3>
          <div className="space-y-3">
            {citas.filter(cita => cita.fecha === '2025-07-10').map(cita => (
              <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{cita.paciente}</p>
                  <p className="text-sm text-gray-600">{cita.motivo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{cita.hora}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    cita.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Nueva cita programada</p>
                <p className="text-xs text-gray-600">Juan Pérez - Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Prescripción completada</p>
                <p className="text-xs text-gray-600">María González - Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Equipo requiere mantenimiento</p>
                <p className="text-xs text-gray-600">Monitor Cardíaco - Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente PacientesView con integración al backend
  const PacientesView = () => {
    const { patients, loading, error } = usePatients();

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Cargando pacientes desde el backend...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error de Conexión</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-red-500">
            Asegúrate de que el backend esté ejecutándose en http://localhost:8000
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
  <h3 className="text-lg font-semibold">Gestión de Pacientes</h3>
  <div className="flex items-center space-x-4">
    <span className={`text-sm px-3 py-1 rounded-full ${
      error 
        ? 'text-yellow-600 bg-yellow-100' 
        : 'text-green-600 bg-green-100'
    }`}>
      {error ? '📱 Modo Mock' : '✅ Conectado al Backend'}
    </span>
    <button 
      onClick={() => sendToBackend('create_patient', { type: 'new_patient' })}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
    >
      <UserPlus className="w-4 h-4" />
      <span>Nuevo Paciente</span>
    </button>
  </div>
</div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-blue-50">
            <p className="text-sm text-blue-700">
              📡 Datos en tiempo real desde: <code>GET http://localhost:8000/patients/</code>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Total de pacientes: {patients.length}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((paciente: any) => (
                  <tr key={paciente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{paciente.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">
                            {paciente.primer_nombre} {paciente.primer_apellido}
                          </p>
                          <p className="text-sm text-gray-500">
                            {paciente.segundo_nombre} {paciente.segundo_apellido}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {paciente.numero_documento}
                      <p className="text-xs text-gray-500">{paciente.tipo_documento}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{paciente.telefono}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{paciente.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => sendToBackend('view_patient_history', { patientId: paciente.id })}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver historia clínica"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => sendToBackend('edit_patient', { patientId: paciente.id })}
                          className="text-green-600 hover:text-green-900"
                          title="Editar paciente"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {patients.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
            <p className="mt-1 text-sm text-gray-500">El backend no devolvió ningún paciente.</p>
          </div>
        )}
      </div>
    );
  };

  // Componente CitasView
  const CitasView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Citas</h3>
        <button 
          onClick={() => sendToBackend('create_cita', { type: 'new_appointment' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cita</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="border rounded px-3 py-1">
              <option>Todos los estados</option>
              <option>PROGRAMADA</option>
              <option>CONFIRMADA</option>
              <option>REALIZADA</option>
              <option>CANCELADA</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input type="date" className="border rounded px-3 py-1" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha & Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {citas.map(cita => (
                <tr key={cita.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{cita.paciente}</p>
                      <p className="text-sm text-gray-500">CC: {cita.cedula}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{cita.fecha}</p>
                      <p className="text-sm text-gray-500">{cita.hora}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{cita.tipo}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      cita.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-800' :
                      cita.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-800' :
                      cita.estado === 'REALIZADA' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{cita.motivo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => sendToBackend('view_cita', { citaId: cita.id })}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => sendToBackend('edit_cita', { citaId: cita.id })}
                        className="text-green-600 hover:text-green-900"
                        title="Editar cita"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => sendToBackend('add_prescription', { citaId: cita.id })}
                        className="text-purple-600 hover:text-purple-900"
                        title="Agregar prescripción"
                      >
                        <Pill className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => sendToBackend('add_file', { citaId: cita.id })}
                        className="text-orange-600 hover:text-orange-900"
                        title="Subir archivo"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Función para renderizar contenido
  const renderContent = () => {
  switch (activeSection) {
    case 'dashboard':
      return <DashboardView />;
    case 'citas':
      return <CitasView />;
    case 'citas-usuario':
      return hasPermission('citas') ? <CitasUsuarioView /> : <div className="p-6 text-center text-gray-500">Sin permisos para acceder a esta sección</div>;
    case 'pacientes':
      return hasPermission('pacientes') ? <PacientesView /> : <div className="p-6 text-center text-gray-500">Sin permisos para acceder a esta sección</div>;
    case 'equipamiento':
      return hasPermission('equipamiento') ? <EquipamientoView /> : <div className="p-6 text-center text-gray-500">Sin permisos para acceder a esta sección</div>;
    case 'medicamentos':
      return hasPermission('medicamentos') ? <MedicamentosView /> : <div className="p-6 text-center text-gray-500">Sin permisos para acceder a esta sección</div>;
    case 'empleados':
      return hasPermission('empleados') ? <EmpleadosView /> : <div className="p-6 text-center text-gray-500">Sin permisos para acceder a esta sección</div>;
    case 'perfil':
      return <PerfilView />;
    default:
      return <DashboardView />;
  }
};

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={updatePassword}
        userName={currentUser.name}
      />
    </div>
  );
};

export default HospitalDashboard;