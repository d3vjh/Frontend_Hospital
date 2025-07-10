'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePatients } from '../../hooks/usePatients';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowLeft,
  Heart
} from 'lucide-react';

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
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
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
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
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
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
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
  statContent: {
    display: 'flex',
    alignItems: 'center',
  },
  statIcon: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    marginRight: '1rem',
  },
  statText: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    margin: 0,
  },
  statNumber: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0.25rem 0 0 0',
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
  patientInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  patientAvatar: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    flexShrink: 0,
  },
  patientName: {
    fontWeight: '500',
    color: '#111827',
    margin: 0,
  },
  patientSecondary: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.125rem 0 0 0',
  },
  contactInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#111827',
    margin: '0.25rem 0',
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
  emptyState: {
    padding: '4rem',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    margin: '0 auto 1rem',
    color: '#9ca3af',
  },
  emptyText: {
    color: '#6b7280',
    margin: 0,
  },
  loading: {
    padding: '4rem',
    textAlign: 'center' as const,
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '4px solid #2563eb',
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

export default function PacientesPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const { 
    patients, 
    loading, 
    error, 
    total, 
    loadPatients, 
    createPatient, 
    updatePatient, 
    deletePatient,
    clearError 
  } = usePatients();

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.primer_nombre?.toLowerCase().includes(searchLower) ||
      patient.primer_apellido?.toLowerCase().includes(searchLower) ||
      patient.numero_documento?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreatePatient = async (patientData: any) => {
    try {
      const success = await createPatient(patientData);
      if (success) {
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating patient:', error);
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
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .filter-button:hover {
          background-color: #f9fafb;
        }
        .back-button:hover {
          background-color: #e5e7eb;
        }
        .new-button:hover {
          background-color: #1d4ed8;
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
            <Users size={32} color="#2563eb" />
            <div>
              <h1 style={styles.logoText}>Gestión de Pacientes</h1>
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
              Nuevo Paciente
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

        {/* Search and Filters */}
        <div style={styles.searchCard}>
          <div style={styles.searchContainer} className="search-container">
            <div style={styles.searchBox}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, documento o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="search-input"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={styles.filterButton}
              className="filter-button"
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              <select style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}>
                <option value="">Todos los estados</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
              <select style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}>
                <option value="">Todos los géneros</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
              <input
                type="date"
                placeholder="Fecha de nacimiento"
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, backgroundColor: '#dbeafe'}}>
                <Users size={24} color="#2563eb" />
              </div>
              <div>
                <p style={styles.statText}>Total Pacientes</p>
                <p style={styles.statNumber}>{total}</p>
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, backgroundColor: '#dcfce7'}}>
                <User size={24} color="#16a34a" />
              </div>
              <div>
                <p style={styles.statText}>Filtrados</p>
                <p style={styles.statNumber}>{filteredPatients.length}</p>
              </div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statContent}>
              <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>
                <FileText size={24} color="#d97706" />
              </div>
              <div>
                <p style={styles.statText}>Nuevos Hoy</p>
                <p style={styles.statNumber}>3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              Lista de Pacientes ({filteredPatients.length})
            </h2>
          </div>
          
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p style={{ color: '#6b7280' }}>Cargando pacientes...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div style={styles.emptyState}>
              <Users size={48} style={styles.emptyIcon} />
              <p style={styles.emptyText}>
                {searchTerm ? 'No se encontraron pacientes con esos criterios' : 'No hay pacientes registrados'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Paciente</th>
                    <th style={styles.tableHeaderCell}>Documento</th>
                    <th style={styles.tableHeaderCell}>Contacto</th>
                    <th style={styles.tableHeaderCell}>Estado</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} style={styles.tableRow} className="table-row">
                      <td style={styles.tableCell}>
                        <div style={styles.patientInfo}>
                          <div style={styles.patientAvatar}>
                            <User size={24} color="#2563eb" />
                          </div>
                          <div>
                            <p style={styles.patientName}>
                              {patient.primer_nombre} {patient.primer_apellido}
                            </p>
                            <p style={styles.patientSecondary}>
                              {patient.segundo_nombre} {patient.segundo_apellido}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div>
                          <p style={{ fontWeight: '500', margin: 0 }}>{patient.numero_documento}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{patient.tipo_documento}</p>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.contactInfo}>
                          <Phone size={16} color="#6b7280" />
                          {patient.telefono}
                        </div>
                        <div style={styles.contactInfo}>
                          <Mail size={16} color="#6b7280" />
                          {patient.email}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(patient.estado === 'ACTIVO' ? styles.statusActive : styles.statusInactive)
                        }}>
                          {patient.estado || 'ACTIVO'}
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

      {/* Modal para crear paciente - Implementar según necesidades */}
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
            }}>Crear Nuevo Paciente</h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1rem',
            }}>Formulario de creación de paciente</p>
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
                  backgroundColor: '#2563eb',
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