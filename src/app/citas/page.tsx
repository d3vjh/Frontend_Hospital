'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  User,
  Clock,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Stethoscope,
  Users,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';

// Interfaces
interface Cita {
  id_cita: number;
  cod_pac: number;
  paciente?: {
    nombre: string;
    cedula: string;
    telefono: string;
    email: string;
  };
  empleado: {
    id: number;
    nombre: string;
    especialidad: string;
    numero_licencia: string;
  };
  tipo_cita: {
    id: number;
    nombre: string;
    duracion_default: number;
    costo_base: number;
  };
  departamento: {
    id: number;
    nombre: string;
    ubicacion: string;
    especialidad: string;
  };
  fecha_cita: string;
  hora_inicio: string;
  hora_fin?: string;
  duracion_real_min?: number;
  motivo_consulta?: string;
  diagnostico_preliminar?: string;
  estado_cita: string;
  created_at?: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  logoSubtext: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  },
  newButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#d97706',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  refreshButton: {
    padding: '0.5rem',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  content: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  searchCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  searchBox: {
    position: 'relative' as const,
    flex: 1,
  },
  searchInput: {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  tableHeaderCell: {
    padding: '0.75rem 1.5rem',
    textAlign: 'left' as const,
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  tableCell: {
    padding: '1rem 1.5rem',
    fontSize: '0.875rem',
    color: '#111827',
  },
  citaInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  citaAvatar: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: '#fef3c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    flexShrink: 0,
  },
  citaName: {
    fontWeight: '500',
    color: '#111827',
    margin: 0,
  },
  citaSecondary: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.125rem 0 0 0',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '9999px',
    gap: '0.25rem',
  },
  statusProgramada: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  statusConfirmada: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  statusEnCurso: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  statusCompletada: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
  },
  statusCancelada: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  actionButton: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loading: {
    padding: '4rem',
    textAlign: 'center' as const,
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '4px solid #d97706',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  errorAlert: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  errorText: {
    color: '#dc2626',
    margin: 0,
    fontSize: '0.875rem',
  },
  closeButton: {
    marginLeft: 'auto',
    color: '#dc2626',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
  },
};

export default function CitasPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    hoy: 0,
    programadas: 0,
    completadas: 0
  });

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar citas del backend
  const fetchCitas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando citas del backend...');
      
      // Obtener citas del backend
      const response = await fetch('http://localhost:8000/appointments/', {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Citas recibidas del backend:', data);
        
        if (data.success && data.citas) {
          setCitas(data.citas);
          
          // Calcular estadísticas
          const today = new Date().toISOString().split('T')[0];
          const citasHoy = data.citas.filter((cita: Cita) => cita.fecha_cita === today);
          const programadas = data.citas.filter((cita: Cita) => 
            ['PROGRAMADA', 'CONFIRMADA'].includes(cita.estado_cita)
          );
          const completadas = data.citas.filter((cita: Cita) => 
            cita.estado_cita === 'COMPLETADA'
          );
          
          setStats({
            total: data.citas.length,
            hoy: citasHoy.length,
            programadas: programadas.length,
            completadas: completadas.length
          });
        } else {
          // Usar datos mock si no hay estructura esperada
          setMockData();
        }
      } else {
        console.warn('⚠️ Error del backend, usando datos mock');
        setMockData();
        setError('Backend no disponible - Usando datos de demostración');
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando citas:', err);
      setMockData();
      setError('Error de conexión - Usando datos de demostración');
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockCitas: Cita[] = [
      {
        id_cita: 1,
        cod_pac: 1,
        paciente: {
          nombre: 'Juan Carlos Rodríguez',
          cedula: '12345678',
          telefono: '310-123-4567',
          email: 'juan.rodriguez@email.com'
        },
        empleado: {
          id: 1,
          nombre: 'Dr. Carlos Méndez',
          especialidad: 'Cardiología',
          numero_licencia: 'MED001'
        },
        tipo_cita: {
          id: 1,
          nombre: 'Consulta General',
          duracion_default: 30,
          costo_base: 50000
        },
        departamento: {
          id: 1,
          nombre: 'Cardiología',
          ubicacion: 'Piso 2',
          especialidad: 'Enfermedades del corazón'
        },
        fecha_cita: '2025-07-10',
        hora_inicio: '09:00',
        hora_fin: '09:30',
        motivo_consulta: 'Control rutinario',
        estado_cita: 'CONFIRMADA'
      },
      {
        id_cita: 2,
        cod_pac: 2,
        paciente: {
          nombre: 'María Elena García',
          cedula: '87654321',
          telefono: '320-987-6543',
          email: 'maria.garcia@email.com'
        },
        empleado: {
          id: 2,
          nombre: 'Dra. Ana López',
          especialidad: 'Neurología',
          numero_licencia: 'MED002'
        },
        tipo_cita: {
          id: 2,
          nombre: 'Especialista',
          duracion_default: 45,
          costo_base: 80000
        },
        departamento: {
          id: 2,
          nombre: 'Neurología',
          ubicacion: 'Piso 3',
          especialidad: 'Sistema nervioso'
        },
        fecha_cita: '2025-07-10',
        hora_inicio: '14:00',
        hora_fin: '14:45',
        motivo_consulta: 'Dolor de cabeza recurrente',
        estado_cita: 'PROGRAMADA'
      },
      {
        id_cita: 3,
        cod_pac: 3,
        paciente: {
          nombre: 'Carlos Andrés Martínez',
          cedula: '55556666',
          telefono: '315-678-9012',
          email: 'carlos.martinez@email.com'
        },
        empleado: {
          id: 3,
          nombre: 'Dr. Luis Herrera',
          especialidad: 'Medicina General',
          numero_licencia: 'MED003'
        },
        tipo_cita: {
          id: 1,
          nombre: 'Consulta General',
          duracion_default: 30,
          costo_base: 50000
        },
        departamento: {
          id: 3,
          nombre: 'Medicina General',
          ubicacion: 'Piso 1',
          especialidad: 'Atención primaria'
        },
        fecha_cita: '2025-07-11',
        hora_inicio: '10:30',
        motivo_consulta: 'Chequeo general',
        estado_cita: 'COMPLETADA'
      }
    ];
    
    setCitas(mockCitas);
    setStats({
      total: mockCitas.length,
      hoy: 2,
      programadas: 2,
      completadas: 1
    });
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchCitas();
    }
  }, [isAuthenticated, authLoading]);

  // Filtrar citas por búsqueda
  const filteredCitas = citas.filter(cita => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cita.paciente?.nombre?.toLowerCase().includes(searchLower) ||
      cita.paciente?.cedula?.includes(searchTerm) ||
      cita.empleado?.nombre?.toLowerCase().includes(searchLower) ||
      cita.motivo_consulta?.toLowerCase().includes(searchLower) ||
      cita.departamento?.nombre?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return styles.statusProgramada;
      case 'CONFIRMADA': return styles.statusConfirmada;
      case 'EN_CURSO': return styles.statusEnCurso;
      case 'COMPLETADA': return styles.statusCompletada;
      case 'CANCELADA': return styles.statusCancelada;
      default: return styles.statusProgramada;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA': return <Clock size={12} />;
      case 'CONFIRMADA': return <CheckCircle size={12} />;
      case 'EN_CURSO': return <PlayCircle size={12} />;
      case 'COMPLETADA': return <CheckCircle size={12} />;
      case 'CANCELADA': return <XCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  const clearError = () => setError(null);

  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ color: '#6b7280' }}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .table-row:hover {
          background-color: #f9fafb;
        }
        .action-button:hover {
          background-color: #f3f4f6;
        }
        .search-input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
        }
        .back-button:hover {
          background-color: #e5e7eb;
        }
        .new-button:hover {
          background-color: #b45309;
        }
        .refresh-button:hover {
          background-color: #f3f4f6;
          transform: rotate(90deg);
        }
        @media (min-width: 640px) {
          .search-container {
            flex-direction: row;
          }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Calendar size={32} color="#d97706" />
            <div>
              <h1 style={styles.logoText}>Sistema de Citas</h1>
              <p style={styles.logoSubtext}>
                {user?.department} - {user?.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={fetchCitas}
              disabled={loading}
              style={styles.refreshButton}
              className="refresh-button"
              title="Actualizar citas"
            >
              <RefreshCw 
                size={16} 
                color="#6b7280" 
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none'
                }}
              />
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={styles.backButton}
              className="back-button"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              style={styles.newButton}
              className="new-button"
            >
              <Plus size={20} />
              Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        
        {/* Error Message */}
        {error && (
          <div style={styles.errorAlert}>
            <AlertCircle size={20} color="#dc2626" />
            <p style={styles.errorText}>{error}</p>
            <button
              onClick={clearError}
              style={styles.closeButton}
            >
              ×
            </button>
          </div>
        )}

        {/* Search */}
        <div style={styles.searchCard}>
          <div style={styles.searchContainer} className="search-container">
            <div style={styles.searchBox}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar por paciente, médico, motivo o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem',
                marginRight: '1rem'
              }}>
                <Calendar size={24} color="#d97706" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Total Citas
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {loading ? '...' : stats.total}
                </p>
              </div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                marginRight: '1rem'
              }}>
                <Clock size={24} color="#16a34a" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Citas Hoy
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {loading ? '...' : stats.hoy}
                </p>
              </div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                marginRight: '1rem'
              }}>
                <CheckCircle size={24} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Programadas
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {loading ? '...' : stats.programadas}
                </p>
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f3e8ff',
                borderRadius: '0.5rem',
                marginRight: '1rem'
              }}>
                <CheckCircle size={24} color="#7c3aed" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Completadas
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {loading ? '...' : stats.completadas}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Citas Table */}
        <div style={styles.card}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Lista de Citas ({filteredCitas.length})
            </h2>
          </div>
          
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={{ color: '#6b7280' }}>Cargando citas...</p>
            </div>
          ) : filteredCitas.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
              <p style={{ color: '#6b7280', margin: 0 }}>
                {searchTerm ? 'No se encontraron citas con esos criterios' : 'No hay citas programadas'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Paciente</th>
                    <th style={styles.tableHeaderCell}>Médico & Departamento</th>
                    <th style={styles.tableHeaderCell}>Fecha & Hora</th>
                    <th style={styles.tableHeaderCell}>Motivo</th>
                    <th style={styles.tableHeaderCell}>Estado</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCitas.map((cita) => (
                    <tr key={cita.id_cita} style={styles.tableRow} className="table-row">
                      <td style={styles.tableCell}>
                        <div style={styles.citaInfo}>
                          <div style={styles.citaAvatar}>
                            <User size={24} color="#d97706" />
                          </div>
                          <div>
                            <p style={styles.citaName}>
                              {cita.paciente?.nombre || 'Paciente no encontrado'}
                            </p>
                            <p style={styles.citaSecondary}>
                              {cita.paciente?.cedula} - {cita.paciente?.telefono}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <p style={{ fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Stethoscope size={14} color="#6b7280" />
                            {cita.empleado.nombre}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.125rem 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} color="#9ca3af" />
                            {cita.departamento.nombre}
                          </p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <p style={{ fontWeight: '500', margin: 0 }}>{cita.fecha_cita}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.125rem 0 0 0' }}>
                            {cita.hora_inicio} {cita.hora_fin && `- ${cita.hora_fin}`}
                          </p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                          {cita.motivo_consulta || 'No especificado'}
                        </p>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(cita.estado_cita)
                        }}>
                          {getStatusIcon(cita.estado_cita)}
                          {cita.estado_cita}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button style={styles.actionButton} className="action-button" title="Ver detalles">
                            <Eye size={16} color="#2563eb" />
                          </button>
                          <button style={styles.actionButton} className="action-button" title="Editar cita">
                            <Edit size={16} color="#d97706" />
                          </button>
                          <button style={styles.actionButton} className="action-button" title="Cancelar cita">
                            <Trash2 size={16} color="#dc2626" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear cita */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            maxWidth: '32rem',
            width: '100%',
            padding: '1.5rem',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar size={20} color="#d97706" />
              Nueva Cita Médica
            </h3>
            
            {/* Formulario básico */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Paciente (ID)
              </label>
              <input
                type="number"
                placeholder="ID del paciente"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Médico (ID)
              </label>
              <input
                type="number"
                placeholder="ID del médico"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Fecha
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Hora
                </label>
                <input
                  type="time"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Motivo de consulta
              </label>
              <textarea
                placeholder="Describa el motivo de la consulta..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la lógica para crear la cita
                  setShowCreateModal(false);
                  // Recargar citas después de crear
                  fetchCitas();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#d97706',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Crear Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}