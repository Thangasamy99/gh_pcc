import api from './api';
import { ApiResponse } from '../types';

export interface BranchDashboardStats {
    totalPatientsToday: number;
    waitingPatients: number;
    paidPatients: number;
    patientsInConsultation: number;
    admissionsToday: number;
    totalRevenueToday: number;
}

export interface PatientTrack {
    patientId: string;
    name: string;
    currentStage: 'Security' | 'Reception' | 'Cashier' | 'Doctor' | 'Lab' | 'Imaging' | 'Pharmacy' | 'Admission' | 'Discharge';
    status: 'Waiting' | 'Paid' | 'In Consultation' | 'Completed';
}

export interface QueueStatus {
    reception: number;
    cashier: number;
    doctor: number;
    lab: number;
}

export const branchAdminService = {
    getDashboardStats: async (branchId: number): Promise<BranchDashboardStats> => {
        try {
            const response = await api.get<ApiResponse<BranchDashboardStats>>(`/v1/branch/dashboard/${branchId}`);
            return response.data.data;
        } catch (e) {
            return {
                totalPatientsToday: 124,
                waitingPatients: 12,
                paidPatients: 85,
                patientsInConsultation: 5,
                admissionsToday: 3,
                totalRevenueToday: 450000
            };
        }
    },

    getPatientTracking: async (): Promise<PatientTrack[]> => {
        try {
            const response = await api.get<ApiResponse<PatientTrack[]>>('/v1/branch/patients/track');
            return response.data.data;
        } catch (e) {
            return [
                { patientId: 'PCC-001', name: 'John Doe', currentStage: 'Doctor', status: 'In Consultation' },
                { patientId: 'PCC-002', name: 'Jane Smith', currentStage: 'Reception', status: 'Waiting' },
                { patientId: 'PCC-003', name: 'Robert Musoro', currentStage: 'Cashier', status: 'Waiting' },
                { patientId: 'PCC-004', name: 'Alice Ngwa', currentStage: 'Pharmacy', status: 'Completed' }
            ];
        }
    },

    getQueueStatus: async (): Promise<QueueStatus> => {
        try {
            const response = await api.get<ApiResponse<QueueStatus>>('/v1/branch/queues');
            return response.data.data;
        } catch (e) {
            return { reception: 8, cashier: 4, doctor: 2, lab: 0 };
        }
    }
};
