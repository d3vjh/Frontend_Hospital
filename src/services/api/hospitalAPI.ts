const API_BASE_URL = 'http://localhost:8000';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('hospital_auth_token', token);
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  return localStorage.getItem('hospital_auth_token');
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('hospital_auth_token');
};

// Configuración base para fetch con autenticación
const getFetchConfig = (includeAuth = true) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (includeAuth && getAuthToken()) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${getAuthToken()}`;
  }

  return config;
};

// Manejo de errores mejorado
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const parsedError = JSON.parse(errorData);
      errorMessage = parsedError.detail || parsedError.message || errorMessage;
    } catch {
      errorMessage = errorData || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// ==========================================
// API DE AUTENTICACIÓN
// ==========================================
export const authAPI = {
  async login(credentials: { username: string; password: string; role: string }) {
    try {
      console.log('🔐 Enviando petición de login:', {
        email: `${credentials.username}@hospital.com`,
        password: '***'
      });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        ...getFetchConfig(false),
        method: 'POST',
        body: JSON.stringify({
          email: `${credentials.username}@hospital.com`,
          password: credentials.password
        }),
      });
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await handleResponse(response);
        console.log('✅ Datos recibidos del backend:', data);
        
        if (data.access_token && data.user) {
          setAuthToken(data.access_token);
          
          // Normalizar los datos del usuario para el frontend
          const normalizedUser = {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            role: data.user.role,
            department: data.user.department,
            email: data.user.email,
            especialidad: data.user.especialidad,
            numero_licencia: data.user.numero_licencia,
            permissions: data.user.permissions
          };
          
          console.log('👤 Usuario normalizado:', normalizedUser);
          
          return {
            success: true,
            token: data.access_token,
            user: normalizedUser
          };
        } else {
          throw new Error('Respuesta del servidor incompleta');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Solo usar fallback si es el usuario demo específico
      if (credentials.username === 'admin' && credentials.password === '123456') {
        console.log('🔄 Intentando fallback demo...');
        
        const mockToken = 'mock-token-' + Date.now();
        setAuthToken(mockToken);
        
        return {
          success: true,
          token: mockToken,
          user: {
            id: 999,
            username: credentials.username,
            role: credentials.role,
            name: getRoleDisplayName(credentials.role, credentials.username),
            department: getDepartmentByRole(credentials.role),
            email: `${credentials.username}@hospital.com`
          }
        };
      }

      throw error;
    }
  },

  async logout() {
    clearAuthToken();
    return { success: true };
  },

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      // Si falla, devolver usuario mock basado en token
      const token = getAuthToken();
      if (token && token.startsWith('mock-token')) {
        return {
          id: 1,
          username: 'admin',
          role: 'MEDICO_ESPECIALISTA',
          name: 'Dr. Admin',
          department: 'Cardiología'
        };
      }
      throw error;
    }
  }
};

// Funciones auxiliares para mock
const getRoleDisplayName = (role: string, username: string) => {
  const roleNames: Record<string, string> = {
    'PACIENTE': `${username}`,
    'ENFERMERO': `Enf. ${username}`,
    'MEDICO_GENERAL': `Dr. ${username}`,
    'MEDICO_ESPECIALISTA': `Dr. ${username}`,
    'DIRECTOR': `Dir. ${username}`
  };
  return roleNames[role] || username;
};

const getDepartmentByRole = (role: string) => {
  const departments: Record<string, string> = {
    'PACIENTE': 'N/A',
    'ENFERMERO': 'Enfermería',
    'MEDICO_GENERAL': 'Medicina General',
    'MEDICO_ESPECIALISTA': 'Cardiología',
    'DIRECTOR': 'Dirección General'
  };
  return departments[role] || 'Desconocido';
};

// ==========================================
// API DE PACIENTES
// ==========================================
export const patientsAPI = {
  async getAll(params?: { skip?: number; limit?: number; search?: string }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `${API_BASE_URL}/patients/?${queryParams.toString()}`;
      const response = await fetch(url, getFetchConfig());
      const data = await handleResponse(response);
      
      // Normalizar respuesta del backend
      if (data.data) {
        return {
          success: true,
          patients: data.data.map((p: any) => ({
            id: p.id || p.cod_pac,
            primer_nombre: p.nombre || p.nom_pac,
            primer_apellido: p.apellido || p.apellido_pac,
            segundo_nombre: '',
            segundo_apellido: '',
            numero_documento: p.cedula,
            tipo_documento: 'CC',
            telefono: p.telefono || p.tel_pac,
            email: p.email || p.email_pac,
            genero: p.genero,
            estado: p.estado
          })),
          total: data.total || data.data.length
        };
      }
      
      return { success: true, patients: data, total: data.length };
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  },

  async create(patientData: any) {
    try {
      // Transformar datos del frontend al formato del backend
      const backendData = {
        nom_pac: patientData.primer_nombre || patientData.nom_pac,
        apellido_pac: patientData.primer_apellido || patientData.apellido_pac,
        cedula: patientData.numero_documento || patientData.cedula,
        tel_pac: patientData.telefono || patientData.tel_pac,
        email_pac: patientData.email || patientData.email_pac,
        fecha_nac: patientData.fecha_nac,
        genero: patientData.genero,
        dir_pac: patientData.direccion || patientData.dir_pac,
        num_seguro: patientData.numero_seguro || patientData.num_seguro,
        id_tipo_sangre: patientData.id_tipo_sangre,
        id_dept_principal: patientData.id_dept_principal
      };

      const response = await fetch(`${API_BASE_URL}/patients/`, {
        ...getFetchConfig(),
        method: 'POST',
        body: JSON.stringify(backendData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  async update(id: string, patientData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        ...getFetchConfig(),
        method: 'PUT',
        body: JSON.stringify(patientData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        ...getFetchConfig(),
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  },

  async getBloodTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/tipos-sangre`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching blood types:', error);
      throw error;
    }
  }
};

// ==========================================
// API DE EMPLEADOS
// ==========================================
export const employeesAPI = {
  async getAll(params?: { skip?: number; limit?: number; search?: string; estado?: string }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.estado) queryParams.append('estado', params.estado);

      const url = `${API_BASE_URL}/employees/?${queryParams.toString()}`;
      const response = await fetch(url, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  },

  async create(employeeData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/`, {
        ...getFetchConfig(),
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async getRoles() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/roles`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  async getDepartments() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/departamentos`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }
};

// ==========================================
// API DE CITAS (APPOINTMENTS)
// ==========================================
export const appointmentsAPI = {
  async getAll(params?: { 
    skip?: number; 
    limit?: number; 
    departamento_id?: number;
    fecha?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    estado?: string;
    paciente_id?: number;
    empleado_id?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.departamento_id) queryParams.append('departamento_id', params.departamento_id.toString());
      if (params?.fecha) queryParams.append('fecha', params.fecha);
      if (params?.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params?.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.paciente_id) queryParams.append('paciente_id', params.paciente_id.toString());
      if (params?.empleado_id) queryParams.append('empleado_id', params.empleado_id.toString());

      const url = `${API_BASE_URL}/appointments/?${queryParams.toString()}`;
      const response = await fetch(url, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  async getToday() {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/today`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },

  async create(appointmentData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/`, {
        ...getFetchConfig(),
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async update(id: string, appointmentData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        ...getFetchConfig(),
        method: 'PUT',
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  },

  async cancel(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        ...getFetchConfig(),
        method: 'DELETE',
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error canceling appointment ${id}:`, error);
      throw error;
    }
  },

  async getTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/types/`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching appointment types:', error);
      throw error;
    }
  },

  async getStats(params?: { fecha_desde?: string; fecha_hasta?: string; departamento_id?: number }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params?.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
      if (params?.departamento_id) queryParams.append('departamento_id', params.departamento_id.toString());

      const url = `${API_BASE_URL}/appointments/stats/?${queryParams.toString()}`;
      const response = await fetch(url, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  }
};

// ==========================================
// API DE INTERCONSULTAS
// ==========================================
export const interconsultasAPI = {
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/interconsultas/`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching interconsultas:', error);
      throw error;
    }
  },

  async create(data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/interconsultas/`, {
        ...getFetchConfig(),
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating interconsulta:', error);
      throw error;
    }
  }
};

// ==========================================
// API DE FARMACIA
// ==========================================
export const farmaciaAPI = {
  async getMedicamentos() {
    try {
      const response = await fetch(`${API_BASE_URL}/farmacia/medicamentos/`, getFetchConfig());
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching medicamentos:', error);
      throw error;
    }
  },

  async createPrescripcion(data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/farmacia/prescripciones/`, {
        ...getFetchConfig(),
        method: 'POST',
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating prescripción:', error);
      throw error;
    }
  }
};

// ==========================================
// UTILIDADES
// ==========================================
export const utilsAPI = {
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      return handleResponse(response);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  async testConnection() {
    try {
      const result = await this.healthCheck();
      return { success: true, message: 'Conexión establecida', data: result };
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      return { success: false, message: 'Error de conexión', error: errorMessage };
    }
  }
};

// Mantener compatibilidad con el código existente
export const citasAPI = appointmentsAPI;