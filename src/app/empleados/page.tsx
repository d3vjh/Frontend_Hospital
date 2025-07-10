'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  Users,
  ArrowLeft,
  Star,
  Calendar,
  Building,
  Shield
} from 'lucide-react';

// Usamos los mismos estilos base de la página de pacientes
const styles = {
  // ... (mismos estilos que la página de pacientes)
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
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  // ... resto de estilos similares a pacientes
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
  employeeInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    flexShrink: 0,
  },
  employeeName: {
    fontWeight: '500',
    color: '#111827',
    margin: 0,
  },
  employeeSecondary: {
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
  },
  statusActive: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  statusVacation: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '0.375rem',
    backgroundColor: '#f3e8ff',
    color: '#7c3aed',
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
    border: '4px solid #16a34a',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
};

// Mock data para empleados
const mockEmployees = [
  {
    id: 1,
    nom_emp: 'Carlos',
    apellido_emp: 'Rodríguez',
    cedula: '1234567890',
    email_emp: 'carlos.rodriguez@hospital.com',
    tel_emp: '310-123-4567',
    especialidad_medica: 'Cardiología',
    numero_licencia: 'MED001',
    estado_empleado: 'ACTIVO',
    turno_preferido: 'DIURNO',
    departamento: { nom_dept: 'Cardiología' },
    rol: { nombre_rol: 'MEDICO_ESPECIALISTA' },
  },
  {
    id: 2,
    nom_emp: 'María',
    apellido_emp: 'González',
    cedula: '9876543210',
    email_emp: 'maria.gonzalez@hospital.com',
    tel_emp: '320-987-6543',
    especialidad_medica: 'Neurología',
    numero_licencia: 'MED002',
    estado_empleado: 'ACTIVO',
    turno_preferido: 'NOCTURNO',
    departamento: { nom_dept: 'Neurología' },
    rol: { nombre_rol: 'MEDICO_ESPECIALISTA' },
  },
  {
    id: 3,
    nom_emp: 'Ana',
    apellido_emp: 'Martínez',
    cedula: '5555666677',
    email_emp: 'ana.martinez@hospital.com',
    tel_emp: '315-678-9012',
    especialidad_medica: 'Enfermería',
    numero_licencia: 'ENF001',
    estado_empleado: 'VACACIONES',
    turno_preferido: 'DIURNO',
    departamento: { nom_dept: 'Urgencias' },
    rol: { nombre_rol: 'ENFERMERO' },
  },
  {
    id: 4,
    nom_emp: 'Luis',
    apellido_emp: 'Herrera',
    cedula: '1111222233',
    email_emp: 'luis.herrera@hospital.com',
    tel_emp: '302-112-2334',
    especialidad_medica: 'Administración',
    numero_licencia: 'ADM001',
    estado_empleado: 'ACTIVO',
    turno_preferido: 'DIURNO',
    departamento: { nom_dept: 'Administración' },
    rol: { nombre_rol: 'DIRECTOR' },
  },
];

export default function EmpleadosPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  
  const [employees, setEmployees] = useState(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Filtrar empleados por búsqueda
  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee.nom_emp?.toLowerCase().includes(searchLower) ||
      employee.apellido_emp?.toLowerCase().includes(searchLower) ||
      employee.cedula?.includes(searchTerm) ||
      employee.email_emp?.toLowerCase().includes(searchLower) ||
      employee.especialidad_medica?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return styles.statusActive;
      case 'VACACIONES': return styles.statusVacation;
      default: return styles.statusInactive;
    }
  };

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
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        .back-button:hover {
          background-color: #e5e7eb;
        }
        .new-button:hover {
          background-color: #15803d;
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
            <Users size={32} color="#16a34a" />
            <div>
              <h1 style={styles.logoText}>Gestión de Empleados</h1>
              <p style={styles.logoSubtext}>
                {user?.department} - {user?.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              Nuevo Empleado
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        
        {/* Search */}
        <div style={styles.searchCard}>
          <div style={styles.searchContainer} className="search-container">
            <div style={styles.searchBox}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, cédula o especialidad..."
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
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                marginRight: '1rem'
              }}>
                <Users size={24} color="#16a34a" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Total Empleados
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {employees.length}
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
                <Star size={24} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Activos
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  {employees.filter(e => e.estado_empleado === 'ACTIVO').length}
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
                <Building size={24} color="#7c3aed" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
                  Departamentos
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0.25rem 0 0 0' }}>
                  4
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div style={styles.card}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              Lista de Empleados ({filteredEmployees.length})
            </h2>
          </div>
          
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={{ color: '#6b7280' }}>Cargando empleados...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Users size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
              <p style={{ color: '#6b7280', margin: 0 }}>
                {searchTerm ? 'No se encontraron empleados con esos criterios' : 'No hay empleados registrados'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Empleado</th>
                    <th style={styles.tableHeaderCell}>Documento</th>
                    <th style={styles.tableHeaderCell}>Rol & Departamento</th>
                    <th style={styles.tableHeaderCell}>Contacto</th>
                    <th style={styles.tableHeaderCell}>Estado</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} style={styles.tableRow} className="table-row">
                      <td style={styles.tableCell}>
                        <div style={styles.employeeInfo}>
                          <div style={styles.employeeAvatar}>
                            <User size={24} color="#16a34a" />
                          </div>
                          <div>
                            <p style={styles.employeeName}>
                              {employee.nom_emp} {employee.apellido_emp}
                            </p>
                            <p style={styles.employeeSecondary}>
                              {employee.especialidad_medica}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <p style={{ fontWeight: '500', margin: 0 }}>{employee.cedula}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                            {employee.numero_licencia}
                          </p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <span style={styles.roleBadge}>
                            {employee.rol.nombre_rol}
                          </span>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                            {employee.departamento.nom_dept}
                          </p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ fontSize: '0.875rem' }}>
                          <p style={{ margin: 0 }}>{employee.tel_emp}</p>
                          <p style={{ color: '#6b7280', margin: '0.125rem 0 0 0' }}>
                            {employee.email_emp}
                          </p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(employee.estado_empleado)
                        }}>
                          {employee.estado_empleado}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button style={styles.actionButton} className="action-button">
                            <Eye size={16} color="#2563eb" />
                          </button>
                          <button style={styles.actionButton} className="action-button">
                            <Edit size={16} color="#d97706" />
                          </button>
                          <button style={styles.actionButton} className="action-button">
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

      {/* Modal para crear empleado */}
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
            maxWidth: '28rem',
            width: '100%',
            padding: '1.5rem',
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
            }}>Nuevo Empleado</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1rem',
            }}>Formulario de registro de empleado</p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.5rem',
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}