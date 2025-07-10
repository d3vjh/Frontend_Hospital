const API_BASE_URL = 'http://localhost:8000';

// Configuración base para fetch
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Manejo de errores
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.json();
};

// API para Pacientes
export const patientsAPI = {
  // GET /patients/ - Obtener todos los pacientes
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/`, fetchConfig);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // GET /patients/{id} - Obtener paciente por ID
  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, fetchConfig);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  },

  // POST /patients/ - Crear nuevo paciente
  async create(patientData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify(patientData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }
};

// API para Citas
export const citasAPI = {
  // GET /citas/ - Obtener todas las citas
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/citas/`, fetchConfig);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching citas:', error);
      throw error;
    }
  },

  // GET /citas/usuario/{userId} - Obtener citas por usuario
  async getByUser(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/citas/usuario/${userId}`, fetchConfig);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching citas for user ${userId}:`, error);
      throw error;
    }
  }
};