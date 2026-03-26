import api from './api';

const API_URL = '/v1/doctor';

export interface DoctorDTO {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  staffId?: string;
  phone: string;
  gender: string;
  qualification: string;
  experienceYears: number;
  consultationRoom: string;
  specialization: string;
  availabilityStatus?: string;
  branchId: number;
  branchName?: string;
  roleCode: string;
  isActive?: boolean;
}

export const doctorService = {
  createDoctor: async (data: DoctorDTO) => {
    const response = await api.post(`${API_URL}/create`, data);
    return response.data.data;
  },
  getAllDoctors: async () => {
    const response = await api.get(`${API_URL}/list`);
    return response.data.data;
  },
  getAvailableDoctors: async (branchId: number) => {
    const response = await api.get(`${API_URL}/available/${branchId}`);
    return response.data.data;
  },
  getAvailableByRoom: async (roomId: string) => {
    const response = await api.get(`${API_URL}/available/room/${roomId}`);
    return response.data.data;
  },
  updateAvailability: async (doctorId: number, status: string) => {
    const response = await api.patch(`${API_URL}/${doctorId}/availability?status=${status}`);
    return response.data.data;
  },
  deleteDoctor: async (id: number) => {
    // Doctors are users, using the user management endpoint for deletion
    await api.delete(`/v1/superadmin/users/${id}`);
  },
  updateDoctor: async (id: number, data: DoctorDTO) => {
    // Doctors are users, using the user management endpoint for update
    const response = await api.put(`/v1/superadmin/users/${id}`, data);
    return response.data.data;
  }
};
