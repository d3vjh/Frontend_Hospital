import { useState, useEffect } from 'react';

// Interface para tipar los pacientes
interface Patient {
  id: number;
  primer_nombre: string;
  primer_apellido: string;
  segundo_nombre: string;
  segundo_apellido: string;
  numero_documento: string;
  tipo_documento: string;
  telefono: string;
  email: string;
}

const API_BASE_URL = 'http://localhost:8000';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    
    // DATOS MOCK TEMPORALES (hasta que tengas el backend listo)
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
        email: 'juan.perez@email.com'
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
        email: 'maria.garcia@email.com'
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
        email: 'ana.martin@email.com'
      }
    ];

    try {
      console.log('Intentando conectar al backend...');
      
      // Intentar conectar al backend con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos
      
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: Patient[] = await response.json();
      console.log('✅ Pacientes recibidos del backend:', data);
      setPatients(data);
      
    } catch (err) {
      console.warn('⚠️ Backend no disponible, usando datos mock');
      
      // Si falla, usar datos mock sin mostrar error crítico
      setPatients(mockPatients);
      setError('Backend no disponible - Modo Mock activo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const createPatient = async (patientData: Partial<Patient>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      await loadPatients(); // Recargar lista
      return true;
    } catch (err) {
      console.error('Error creando paciente:', err);
      setError('Error al crear paciente');
      return false;
    }
  };

  return {
    patients,
    loading,
    error,
    loadPatients,
    createPatient
  };
};