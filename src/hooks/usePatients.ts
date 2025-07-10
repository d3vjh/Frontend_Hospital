import { useState, useEffect } from 'react';
import { patientsAPI } from '../services/api/hospitalAPI';

// Interface para tipar los pacientes (compatible con backend)
interface Patient {
  id: number;
  primer_nombre: string;
  primer_apellido: string;
  segundo_nombre?: string;
  segundo_apellido?: string;
  numero_documento: string;
  tipo_documento: string;
  telefono: string;
  email: string;
  genero?: string;
  estado?: string;
  fecha_nac?: string;
  direccion?: string;
  numero_seguro?: string;
  id_tipo_sangre?: number;
}

interface UsePatients {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  total: number;
  loadPatients: (params?: { skip?: number; limit?: number; search?: string }) => Promise<void>;
  createPatient: (patientData: Partial<Patient>) => Promise<boolean>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
  getPatientById: (id: string) => Promise<Patient | null>;
  getBloodTypes: () => Promise<any[]>;
  clearError: () => void;
}

export const usePatients = (): UsePatients => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const clearError = () => setError(null);

  const loadPatients = async (params?: { skip?: number; limit?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando pacientes del backend...');
      
      const result = await patientsAPI.getAll(params);
      
      if (result.success && result.patients) {
        setPatients(result.patients);
        setTotal(result.total || result.patients.length);
        console.log(`✅ ${result.patients.length} pacientes cargados exitosamente`);
      } else {
        // Fallback a datos mock si no hay estructura esperada
        setPatients(Array.isArray(result) ? result : []);
        setTotal(Array.isArray(result) ? result.length : 0);
        console.log('📋 Datos cargados con estructura alternativa');
      }
      
    } catch (err: any) {
      console.warn('⚠️ Error cargando pacientes del backend:', err.message);
      
      // Datos mock de respaldo
      const mockPatients: Patient[] = [
        {
          id: 1,
          primer_nombre: 'Juan',
          primer_apellido: 'Pérez',
          segundo_nombre: 'Carlos',
          segundo_apellido: 'González',
          numero_documento: '12345678',
          tipo_documento: 'CC',
          telefono: '+57-300-1234567',
          email: 'juan.perez@email.com',
          genero: 'M',
          estado: 'ACTIVO',
          fecha_nac: '1990-05-15'
        },
        {
          id: 2,
          primer_nombre: 'María',
          primer_apellido: 'García',
          segundo_nombre: 'Isabel',
          segundo_apellido: 'López',
          numero_documento: '87654321',
          tipo_documento: 'CC',
          telefono: '+57-300-7654321',
          email: 'maria.garcia@email.com',
          genero: 'F',
          estado: 'ACTIVO',
          fecha_nac: '1985-11-22'
        },
        {
          id: 3,
          primer_nombre: 'Ana',
          primer_apellido: 'Martín',
          segundo_nombre: 'Lucía',
          segundo_apellido: 'Rodríguez',
          numero_documento: '11223344',
          tipo_documento: 'CC',
          telefono: '+57-300-1122334',
          email: 'ana.martin@email.com',
          genero: 'F',
          estado: 'ACTIVO',
          fecha_nac: '1992-08-10'
        }
      ];
      
      setPatients(mockPatients);
      setTotal(mockPatients.length);
      setError('Backend no disponible - Usando datos de demostración');
      console.log('🔄 Usando datos mock como respaldo');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData: Partial<Patient>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('➕ Creando nuevo paciente...');
      
      const result = await patientsAPI.create(patientData);
      
      if (result.success) {
        console.log('✅ Paciente creado exitosamente');
        await loadPatients(); // Recargar lista
        return true;
      } else {
        throw new Error(result.error || 'Error al crear paciente');
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear paciente';
      setError(errorMessage);
      console.error('❌ Error creando paciente:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Actualizando paciente ${id}...`);
      
      const result = await patientsAPI.update(id, patientData);
      
      if (result.success) {
        console.log('✅ Paciente actualizado exitosamente');
        await loadPatients(); // Recargar lista
        return true;
      } else {
        throw new Error(result.error || 'Error al actualizar paciente');
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar paciente';
      setError(errorMessage);
      console.error('❌ Error actualizando paciente:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🗑️ Eliminando paciente ${id}...`);
      
      const result = await patientsAPI.delete(id);
      
      if (result.success) {
        console.log('✅ Paciente eliminado exitosamente');
        await loadPatients(); // Recargar lista
        return true;
      } else {
        throw new Error(result.error || 'Error al eliminar paciente');
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar paciente';
      setError(errorMessage);
      console.error('❌ Error eliminando paciente:', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async (id: string): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Buscando paciente ${id}...`);
      
      const result = await patientsAPI.getById(id);
      
      if (result.success && result.data) {
        console.log('✅ Paciente encontrado');
        return result.data;
      } else {
        return null;
      }
      
    } catch (err: any) {
      const errorMessage = err.message || `Error al buscar paciente ${id}`;
      setError(errorMessage);
      console.error('❌ Error buscando paciente:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getBloodTypes = async (): Promise<any[]> => {
    try {
      console.log('🩸 Obteniendo tipos de sangre...');
      
      const result = await patientsAPI.getBloodTypes();
      
      if (Array.isArray(result)) {
        console.log(`✅ ${result.length} tipos de sangre obtenidos`);
        return result;
      } else {
        // Fallback a tipos básicos
        return [
          { id: 1, tipo: 'O+', descripcion: 'O Positivo' },
          { id: 2, tipo: 'O-', descripcion: 'O Negativo' },
          { id: 3, tipo: 'A+', descripcion: 'A Positivo' },
          { id: 4, tipo: 'A-', descripcion: 'A Negativo' },
          { id: 5, tipo: 'B+', descripcion: 'B Positivo' },
          { id: 6, tipo: 'B-', descripcion: 'B Negativo' },
          { id: 7, tipo: 'AB+', descripcion: 'AB Positivo' },
          { id: 8, tipo: 'AB-', descripcion: 'AB Negativo' }
        ];
      }
      
    } catch (err: any) {
      console.error('❌ Error obteniendo tipos de sangre:', err.message);
      // Retornar tipos básicos como fallback
      return [
        { id: 1, tipo: 'O+', descripcion: 'O Positivo' },
        { id: 2, tipo: 'A+', descripcion: 'A Positivo' },
        { id: 3, tipo: 'B+', descripcion: 'B Positivo' },
        { id: 4, tipo: 'AB+', descripcion: 'AB Positivo' }
      ];
    }
  };

  // Cargar pacientes automáticamente al montar el componente
  useEffect(() => {
    loadPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    total,
    loadPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    getBloodTypes,
    clearError
  };
};