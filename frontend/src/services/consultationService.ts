import api from './api';
import { Consultation, CreateConsultationRequest } from '../types/consultation';

const BASE = '/v1/consultations';

export const consultationService = {
  createConsultation: async (request: CreateConsultationRequest): Promise<Consultation> => {
    const response = await api.post(BASE, request);
    return response.data.data;
  },

  getConsultation: async (id: number): Promise<Consultation> => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data.data;
  },

  getConsultationBySmartId: async (smartId: string): Promise<Consultation> => {
    const response = await api.get(`${BASE}/smart/${smartId}`);
    return response.data.data;
  },

  getAllConsultations: async (): Promise<Consultation[]> => {
    const response = await api.get(BASE);
    return response.data.data;
  }
};
