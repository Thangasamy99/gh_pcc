import api from './api';

const API_BASE = '/v1/security';

export interface DynamicEntryRequest {
  entryType: 'NORMAL' | 'EMERGENCY' | 'VISITOR';
  fullName?: string;
  gender?: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
  visitType?: string;
  department?: string;
  emergencyType?: string;
  conditionDescription?: string;
  broughtBy?: string;
  visitorName?: string;
  idProof?: string;
  relationship?: string;
  patientName?: string;
  patientId?: number;
  wardId?: number;
  roomNumber?: string;
  bedNumber?: string;
  purposeOfVisit?: string;
  expectedExitTime?: string;
  branchId: number;
}

export interface EntryResponse {
  id: number;
  entryId: string;
  entryType: string;
  fullName: string;
  gender: string;
  age: number;
  phoneNumber: string;
  address: string;
  visitType: string;
  department: string;
  emergencyType: string;
  conditionDescription: string;
  broughtBy: string;
  visitorName: string;
  idProof: string;
  relationship: string;
  patientName: string;
  patientId: number;
  wardId: number;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  purposeOfVisit: string;
  entryTime: string;
  expectedExitTime: string;
  exitTime: string;
  status: string;
  registeredBy: string;
  branchId: number;
  branchName: string;
  destination: string;
}

export interface VisitorResponse {
  id: number;
  visitorId: string;
  visitorName: string;
  phoneNumber: string;
  idProof: string;
  relationship: string;
  patientName: string;
  patientId: number;
  wardId: number;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  purposeOfVisit: string;
  entryTime: string;
  expectedExitTime: string;
  exitTime: string;
  status: string;
  visitorPassNumber: string;
  registeredBy: string;
}

export interface PatientLocation {
  patientId: number;
  patientName: string;
  gender: string;
  age: number;
  wardId: number;
  wardName: string;
  roomNumber: string;
  bedNumber: string;
  doctorName: string;
  admissionDate: string;
  status: string;
}

export interface Ward {
  id: number;
  wardCode: string;
  wardName: string;
  wardType: string;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  floor: string;
  rooms: Room[];
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  beds: Bed[];
}

export interface Bed {
  id: number;
  bedNumber: string;
  status: string;
  currentPatientId?: number;
  currentPatientName?: string;
}

export interface Metadata {
  value: string;
  label: string;
}

export const securityService = {
  // Dashboard
  getDashboardStats: async (branchId: number) => {
    const response = await api.get(`${API_BASE}/dashboard/${branchId}`);
    return response.data.data;
  },

  // Dynamic Entry
  createEntry: async (data: DynamicEntryRequest, userId: number) => {
    const response = await api.post(`${API_BASE}/entries`, data, {
      headers: { 'X-User-Id': userId }
    });
    return response.data.data;
  },

  createPatientEntry: async (data: any, userId: number) => {
    const response = await api.post(`${API_BASE}/entries`, data, {
      headers: { 'X-User-Id': userId }
    });
    return response.data.data;
  },

  getTodayEntries: async (branchId: number) => {
    const response = await api.get(`${API_BASE}/entries/today/${branchId}`);
    return response.data.data;
  },

  getAllPatientEntries: async (branchId: number) => {
    const response = await api.get(`${API_BASE}/entries/patients/${branchId}`);
    return response.data.data;
  },

  getEntryById: async (id: number) => {
    const response = await api.get(`${API_BASE}/entries/${id}`);
    return response.data.data;
  },

  // Visitor Management
  getActiveVisitors: async (branchId: number) => {
    const response = await api.get(`${API_BASE}/visitors/active/${branchId}`);
    return response.data.data;
  },

  getDailyVisitors: async (branchId: number, date: string) => {
    const response = await api.get(`${API_BASE}/visitors/daily/${branchId}?date=${date}`);
    return response.data.data;
  },

  checkoutVisitor: async (visitorId: number, userId: number) => {
    const response = await api.post(`${API_BASE}/visitors/${visitorId}/checkout`, null, {
      headers: { 'X-User-Id': userId }
    });
    return response.data.data;
  },

  getVisitorHistory: async (branchId: number, params?: any) => {
    const response = await api.get(`${API_BASE}/visitors/history/${branchId}`, { params });
    return response.data.data;
  },

  // Patient Location
  searchPatientLocation: async (searchTerm: string) => {
    const response = await api.get(`${API_BASE}/patient/location`, {
      params: { searchTerm }
    });
    return response.data.data;
  },

  getAllWards: async (branchId: number) => {
    const response = await api.get(`${API_BASE}/wards/${branchId}`);
    return response.data.data;
  },

  getRoomsByWard: async (wardId: number) => {
    const response = await api.get(`${API_BASE}/wards/${wardId}/rooms`);
    return response.data.data;
  },

  getBedsByRoom: async (roomId: number) => {
    const response = await api.get(`${API_BASE}/rooms/${roomId}/beds`);
    return response.data.data;
  },

  // Logs & Reports
  getDailyLogs: async (branchId: number, date: string, page?: number, size?: number) => {
    const response = await api.get(`${API_BASE}/logs/daily/${branchId}`, {
      params: { date, page, size }
    });
    return response.data.data;
  },

  getEmergencyLogs: async (branchId: number, startDate: string, endDate: string, page?: number, size?: number) => {
    const response = await api.get(`${API_BASE}/logs/emergency/${branchId}`, {
      params: { startDate, endDate, page, size }
    });
    return response.data.data;
  },

  // Metadata
  getEntryTypes: async () => {
    const response = await api.get(`${API_BASE}/metadata/entry-types`);
    return response.data.data;
  },

  getVisitTypes: async () => {
    const response = await api.get(`${API_BASE}/metadata/visit-types`);
    return response.data.data;
  },

  getDepartments: async () => {
    const response = await api.get(`${API_BASE}/metadata/departments`);
    return response.data.data;
  },

  getEmergencyTypes: async () => {
    const response = await api.get(`${API_BASE}/metadata/emergency-types`);
    return response.data.data;
  },

  getGenders: async () => {
    const response = await api.get(`${API_BASE}/metadata/genders`);
    return response.data.data;
  },

  getRelationships: async () => {
    const response = await api.get(`${API_BASE}/metadata/relationships`);
    return response.data.data;
  }
};
