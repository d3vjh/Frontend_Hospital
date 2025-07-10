'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const HospitalDashboard: React.FC = () => {
  const { user, logout, updatePassword } = useAuth();
  const router = useRouter();
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications] = useState(3);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Estados para los campos editables del perfil
  const [profileData, setProfileData] = useState({
    email: user?.email || "usuario@hospital.com",
    phone: user?.phone || "+57-300-1234567"
  });

  // Datos del usuario actual basados en la autenticación
  const currentUser = {
    id: user?.id || 1,
    name: user?.name || 'Dr. Carlos Rodríguez',
    role: user?.role || 'MEDICO_ESPECIALISTA',
    department: user?.department || 'Cardiología',
    avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=3b82f6&color=fff'
  };

  // Datos de ejemplo basados en tu DML
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

  const equipamiento = [
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
    },
    { 
      id: 3, 
      nombre: 'Desfibrilador', 
      modelo: 'AED Plus', 
      serie: 'DEF001', 
      departamento: 'Urgencias',
      estado: 'MANTENIMIENTO',
      proximaCalibacion: '2025-08-25',
      proveedor: 'Medtronic Colombia'
    }
  ];

  const medicamentos = [
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

  const empleados = [
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
    },
    { 
      id: 3, 
      nombre: 'Dr. Roberto Silva', 
      cedula: '78901234',
      departamento: 'Urgencias', 
      rol: 'Médico General',
      estado: 'ACTIVO',
      telefono: '+57-300-7890123',
      email: 'roberto.silva@hospital.com'
    },
    { 
      id: 4, 
      nombre: 'Carmen Ruiz', 
      cedula: '89012345',
      departamento: 'Urgencias', 
      rol: 'Administrativo',
      estado: 'ACTIVO',
      telefono: '+57-300-8901234',
      email: 'carmen.ruiz@hospital.com'
    },
    { 
      id: 5, 
      nombre: 'Sandra Pérez', 
      cedula: '23456780',
      departamento: 'Farmacia', 
      rol: 'Farmacéutico',
      estado: 'ACTIVO',
      telefono: '+57-300-2345679',
      email: 'sandra.perez@hospital.com'
    }
  ];

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

  // Función para enviar datos al backend
  const sendToBackend = (action: string, data: any) => {
    const payload = {
      action,
      data,
      user: currentUser.id,
      timestamp: new Date().toISOString()
    };
    
    console.log('Enviando al backend:', JSON.stringify(payload, null, 2));
    
    // Manejar acciones específicas
    if (action === 'logout') {
      logout();
      router.push('/login'); // Redirigir al login después del logout
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
            active={activeSection === 'dashboard'}
            onClick={() => setActiveSection('dashboard')}
          />
        )}
        
        {hasPermission('citas') && (
          <MenuItem 
            icon={Calendar} 
            label="Citas" 
            active={activeSection === 'citas'}
            onClick={() => setActiveSection('citas')}
          />
        )}
        
        {hasPermission('pacientes') && (
          <MenuItem 
            icon={Users} 
            label="Pacientes" 
            active={activeSection === 'pacientes'}
            onClick={() => setActiveSection('pacientes')}
          />
        )}
        
        {hasPermission('equipamiento') && (
          <MenuItem 
            icon={Monitor} 
            label="Equipamiento" 
            active={activeSection === 'equipamiento'}
            onClick={() => setActiveSection('equipamiento')}
          />
        )}

        {hasPermission('medicamentos') && (
          <MenuItem 
            icon={Pill} 
            label="Medicamentos" 
            active={activeSection === 'medicamentos'}
            onClick={() => setActiveSection('medicamentos')}
          />
        )}

        {hasPermission('empleados') && (
          <MenuItem 
            icon={Stethoscope} 
            label="Empleados" 
            active={activeSection === 'empleados'}
            onClick={() => setActiveSection('empleados')}
          />
        )}

        <MenuItem 
          icon={User} 
          label="Perfil" 
          active={activeSection === 'perfil'}
          onClick={() => setActiveSection('perfil')}
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

  const TopBar = () => (
    <div className="bg-white shadow-sm border-b px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeSection}
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

  const PacientesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Pacientes</h3>
        <button 
          onClick={() => sendToBackend('create_patient', { type: 'new_patient' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Sangre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Cita</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pacientes.map(paciente => (
                <tr key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{paciente.nombre}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{paciente.cedula}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{paciente.tipoSangre}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{paciente.ultimaCita}</td>
                 <td className="px-6 py-4">
                   <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     {paciente.estado}
                   </span>
                 </td>
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
                     <button 
                       onClick={() => sendToBackend('schedule_appointment', { patientId: paciente.id })}
                       className="text-purple-600 hover:text-purple-900"
                       title="Programar cita"
                     >
                       <Calendar className="w-4 h-4" />
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

 const MedicamentosView = () => (
   <div className="space-y-6">
     <div className="flex justify-between items-center">
       <h3 className="text-lg font-semibold">Gestión de Medicamentos</h3>
       <div className="flex space-x-2">
         <button 
           onClick={() => sendToBackend('export_inventory', { type: 'excel' })}
           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
         >
           <Download className="w-4 h-4" />
           <span>Exportar</span>
         </button>
         <button 
           onClick={() => sendToBackend('create_medication', { type: 'new_medication' })}
           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
         >
           <Plus className="w-4 h-4" />
           <span>Nuevo Medicamento</span>
         </button>
       </div>
     </div>

     <div className="bg-white rounded-lg shadow-sm border">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principio Activo</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Laboratorio</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {medicamentos.map(medicamento => (
               <tr key={medicamento.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                       <Pill className="w-5 h-5 text-green-600" />
                     </div>
                     <div className="ml-4">
                       <p className="font-medium text-gray-900">{medicamento.nombre}</p>
                       <p className="text-sm text-gray-500">{medicamento.concentracion}</p>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">{medicamento.principio}</td>
                 <td className="px-6 py-4">
                   <div>
                     <p className={`text-sm font-medium ${
                       medicamento.stock <= medicamento.stockMinimo ? 'text-red-600' : 'text-gray-900'
                     }`}>
                       {medicamento.stock}
                     </p>
                     <p className="text-xs text-gray-500">Mín: {medicamento.stockMinimo}</p>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">${medicamento.precio.toFixed(2)}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{medicamento.laboratorio}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{medicamento.vencimiento}</td>
                 <td className="px-6 py-4">
                   <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                     medicamento.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                     medicamento.estado === 'AGOTADO' ? 'bg-red-100 text-red-800' :
                     'bg-yellow-100 text-yellow-800'
                   }`}>
                     {medicamento.estado}
                   </span>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex items-center space-x-2">
                     <button 
                       onClick={() => sendToBackend('view_medication', { medicationId: medicamento.id })}
                       className="text-blue-600 hover:text-blue-900"
                       title="Ver detalles"
                     >
                       <Eye className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('edit_medication', { medicationId: medicamento.id })}
                       className="text-green-600 hover:text-green-900"
                       title="Editar medicamento"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('update_stock', { medicationId: medicamento.id })}
                       className="text-purple-600 hover:text-purple-900"
                       title="Actualizar stock"
                     >
                       <Package className="w-4 h-4" />
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

     <div className="bg-white rounded-lg shadow-sm border">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo/Serie</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Calibración</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {equipamiento.map(equipo => (
               <tr key={equipo.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                       <Monitor className="w-5 h-5 text-blue-600" />
                     </div>
                     <div className="ml-4">
                       <p className="font-medium text-gray-900">{equipo.nombre}</p>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <div>
                     <p className="text-sm font-medium">{equipo.modelo}</p>
                     <p className="text-sm text-gray-500">Serie: {equipo.serie}</p>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">{equipo.departamento}</td>
                 <td className="px-6 py-4">
                   <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                     equipo.estado === 'OPERATIVO' ? 'bg-green-100 text-green-800' :
                     equipo.estado === 'MANTENIMIENTO' ? 'bg-yellow-100 text-yellow-800' :
                     'bg-red-100 text-red-800'
                   }`}>
                     {equipo.estado}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">{equipo.proximaCalibacion}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{equipo.proveedor}</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center space-x-2">
                     <button 
                       onClick={() => sendToBackend('view_equipment', { equipmentId: equipo.id })}
                       className="text-blue-600 hover:text-blue-900"
                       title="Ver detalles"
                     >
                       <Eye className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('edit_equipment', { equipmentId: equipo.id })}
                       className="text-green-600 hover:text-green-900"
                       title="Editar equipo"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('schedule_maintenance', { equipmentId: equipo.id })}
                       className="text-orange-600 hover:text-orange-900"
                       title="Programar mantenimiento"
                     >
                       <Settings className="w-4 h-4" />
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

     <div className="bg-white rounded-lg shadow-sm border">
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cédula</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {empleados.map(empleado => (
               <tr key={empleado.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                   <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                       <Stethoscope className="w-5 h-5 text-blue-600" />
                     </div>
                     <div className="ml-4">
                       <p className="font-medium text-gray-900">{empleado.nombre}</p>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">{empleado.cedula}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{empleado.departamento}</td>
                 <td className="px-6 py-4 text-sm text-gray-900">{empleado.rol}</td>
                 <td className="px-6 py-4">
                   <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     {empleado.estado}
                   </span>
                 </td>
                 <td className="px-6 py-4">
                   <div>
                     <p className="text-sm text-gray-900">{empleado.telefono}</p>
                     <p className="text-sm text-gray-500">{empleado.email}</p>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex items-center space-x-2">
                     <button 
                       onClick={() => sendToBackend('view_employee', { employeeId: empleado.id })}
                       className="text-blue-600 hover:text-blue-900"
                       title="Ver detalles"
                     >
                       <Eye className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('edit_employee', { employeeId: empleado.id })}
                       className="text-green-600 hover:text-green-900"
                       title="Editar empleado"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => sendToBackend('manage_permissions', { employeeId: empleado.id })}
                       className="text-purple-600 hover:text-purple-900"
                       title="Gestionar permisos"
                     >
                       <Settings className="w-4 h-4" />
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
           <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
           <input 
             type="text" 
             value={currentUser.name}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
             readOnly
           />
         </div>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
           <input 
             type="text" 
             value={currentUser.department}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
             readOnly
           />
         </div>
         
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

       <div className="mt-6 pt-6 border-t">
         <h4 className="text-lg font-semibold mb-4">Seguridad</h4>
         <div className="bg-gray-50 p-4 rounded-lg">
           <div className="flex items-center justify-between">
             <div>
               <h5 className="font-medium text-gray-900">Contraseña</h5>
               <p className="text-sm text-gray-600">Última actualización: hace 30 días</p>
             </div>
             <button 
               onClick={() => sendToBackend('change_password', { userId: currentUser.id })}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
             >
               <Lock className="w-4 h-4" />
               <span>Cambiar Contraseña</span>
             </button>
           </div>
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
           onClick={() => sendToBackend('logout', { userId: currentUser.id })}
           className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
         >
           <LogOut className="w-4 h-4" />
           <span>Cerrar Sesión</span>
         </button>
       </div>
     </div>

     {/* Citas del paciente (solo si es paciente) */}
     {currentUser.role === 'PACIENTE' && (
       <div className="bg-white rounded-lg shadow-sm border p-6">
         <h3 className="text-lg font-semibold mb-4">Mis Citas</h3>
         <div className="space-y-3">
           {citas.filter(cita => cita.paciente === currentUser.name).map(cita => (
             <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
               <div>
                 <p className="font-medium">{cita.tipo}</p>
                 <p className="text-sm text-gray-600">{cita.motivo}</p>
                 <p className="text-sm text-gray-500">Dr. {cita.medico}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm font-medium">{cita.fecha} - {cita.hora}</p>
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
     )}
   </div>
 );

 const renderContent = () => {
   switch (activeSection) {
     case 'dashboard':
       return <DashboardView />;
     case 'citas':
       return <CitasView />;
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