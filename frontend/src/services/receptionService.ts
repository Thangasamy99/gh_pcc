import api from './api';
import { ReceptionDashboard, PatientEntry, PatientVitals, ReceptionQueue, VitalsForm } from '../types/reception';

const BASE = '/v1/reception';

export const receptionService = {
  // Dashboard APIs
  getDashboard: async (): Promise<ReceptionDashboard> => {
    const response = await api.get(`${BASE}/dashboard`);
    return response.data.data;
  },

  // Patient Entry APIs
  getPendingPatients: async (): Promise<PatientEntry[]> => {
    const response = await api.get(`${BASE}/patients/pending`);
    return response.data.data;
  },

  getPatientEntry: async (patientEntryId: number): Promise<PatientEntry> => {
    const response = await api.get(`${BASE}/patients/${patientEntryId}`);
    return response.data.data;
  },

  addToQueue: async (patientEntryId: number): Promise<ReceptionQueue> => {
    const response = await api.post(`${BASE}/queue/add`, null, {
      params: { patientEntryId }
    });
    return response.data.data;
  },

  // Vitals APIs
  recordVitals: async (vitalsData: VitalsForm): Promise<PatientVitals> => {
    const response = await api.post(`${BASE}/vitals`, vitalsData);
    return response.data.data;
  },

  getPatientVitals: async (patientEntryId: number): Promise<PatientVitals> => {
    const response = await api.get(`${BASE}/vitals/${patientEntryId}`);
    return response.data.data;
  },

  getTodayVitals: async (): Promise<PatientVitals[]> => {
    const response = await api.get(`${BASE}/vitals`);
    return response.data.data;
  },

  // Queue Management APIs
  getWaitingQueue: async (): Promise<ReceptionQueue[]> => {
    const response = await api.get(`${BASE}/queue/waiting`);
    return response.data.data;
  },

  sendToCashier: async (patientEntryId: number): Promise<ReceptionQueue> => {
    const response = await api.post(`${BASE}/queue/send-to-cashier`, null, {
      params: { patientEntryId }
    });
    return response.data.data;
  },

  assignConsultationRoom: async (patientEntryId: number, consultationRoom: string, doctorId?: number): Promise<ReceptionQueue> => {
    const response = await api.post(`${BASE}/queue/assign-room`, null, {
      params: { patientEntryId, consultationRoom, doctorId }
    });
    return response.data.data;
  },

  sendToDoctor: async (patientEntryId: number): Promise<ReceptionQueue> => {
    const response = await api.post(`${BASE}/queue/send-to-doctor`, null, {
      params: { patientEntryId }
    });
    return response.data.data;
  },

  getTodayQueue: async (): Promise<ReceptionQueue[]> => {
    const response = await api.get(`${BASE}/queue/today`);
    return response.data.data;
  },

  // Reports/List APIs
  getTodayPatients: async (): Promise<PatientEntry[]> => {
    const response = await api.get(`${BASE}/patients/today`);
    return response.data.data;
  },

  getPatientsByStatus: async (status: string): Promise<ReceptionQueue[]> => {
    const response = await api.get(`${BASE}/patients/status/${status}`);
    return response.data.data;
  }
};
