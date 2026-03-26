import axios from 'axios';
import { ApiResponse } from '../../types/api.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                localStorage.setItem('accessToken', response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const superAdminAPI = {
    // Dashboard
    getDashboardStats: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/superadmin/dashboard/stats');
        return response.data;
    },

    getRecentActivities: async (limit: number = 10): Promise<ApiResponse<any[]>> => {
        const response = await api.get(`/superadmin/dashboard/recent-activities?limit=${limit}`);
        return response.data;
    },

    getSystemHealth: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/superadmin/dashboard/system-health');
        return response.data;
    },

    // Branch Management
    getBranches: async (): Promise<ApiResponse<any[]>> => {
        const response = await api.get('/superadmin/branches');
        return response.data;
    },

    getBranchById: async (id: number): Promise<ApiResponse<any>> => {
        const response = await api.get(`/superadmin/branches/${id}`);
        return response.data;
    },

    createBranch: async (data: any): Promise<ApiResponse<any>> => {
        const response = await api.post('/superadmin/branches', data);
        return response.data;
    },

    updateBranch: async (id: number, data: any): Promise<ApiResponse<any>> => {
        const response = await api.put(`/superadmin/branches/${id}`, data);
        return response.data;
    },

    deleteBranch: async (id: number, permanent: boolean = false): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/superadmin/branches/${id}?permanent=${permanent}`);
        return response.data;
    },

    getBranchStats: async (id: number): Promise<ApiResponse<any>> => {
        const response = await api.get(`/superadmin/branches/${id}/stats`);
        return response.data;
    },

    // User Management
    getUsers: async (params?: any): Promise<ApiResponse<any>> => {
        const response = await api.get('/superadmin/users', { params });
        return response.data;
    },

    getUserById: async (id: number): Promise<ApiResponse<any>> => {
        const response = await api.get(`/superadmin/users/${id}`);
        return response.data;
    },

    createBranchAdmin: async (data: any): Promise<ApiResponse<any>> => {
        const response = await api.post('/superadmin/users/branch-admin', data);
        return response.data;
    },

    createCentralPharmacyAdmin: async (data: any): Promise<ApiResponse<any>> => {
        const response = await api.post('/superadmin/users/central-pharmacy-admin', data);
        return response.data;
    },

    updateUser: async (id: number, data: any): Promise<ApiResponse<any>> => {
        const response = await api.put(`/superadmin/users/${id}`, data);
        return response.data;
    },

    toggleUserStatus: async (id: number, active: boolean): Promise<ApiResponse<any>> => {
        const response = await api.put(`/superadmin/users/${id}/status?active=${active}`);
        return response.data;
    },

    resetUserPassword: async (id: number): Promise<ApiResponse<any>> => {
        const response = await api.post(`/superadmin/users/${id}/reset-password`);
        return response.data;
    },

    // Role Management
    getRoles: async (): Promise<ApiResponse<any[]>> => {
        const response = await api.get('/superadmin/roles');
        return response.data;
    },

    getRolePermissions: async (roleId: number): Promise<ApiResponse<any[]>> => {
        const response = await api.get(`/superadmin/roles/${roleId}/permissions`);
        return response.data;
    },

    updateRolePermissions: async (roleId: number, permissionIds: number[]): Promise<ApiResponse<void>> => {
        const response = await api.put(`/superadmin/roles/${roleId}/permissions`, permissionIds);
        return response.data;
    },

    // Reports
    getBranchComparisonReport: async (): Promise<ApiResponse<any[]>> => {
        const response = await api.get('/superadmin/reports/branch-comparison');
        return response.data;
    },

    getUserActivityReport: async (startDate: string, endDate: string): Promise<ApiResponse<any[]>> => {
        const response = await api.get('/superadmin/reports/user-activity', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    exportReport: async (type: string, format: string, startDate?: string, endDate?: string): Promise<Blob> => {
        const response = await api.get(`/superadmin/reports/export/${type}`, {
            params: { format, startDate, endDate },
            responseType: 'blob',
        });
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async (params?: any): Promise<ApiResponse<any>> => {
        const response = await api.get('/superadmin/audit-logs', { params });
        return response.data;
    },

    // System Settings
    getSystemSettings: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/superadmin/settings');
        return response.data;
    },

    updateSystemSettings: async (data: any): Promise<ApiResponse<any>> => {
        const response = await api.put('/superadmin/settings', data);
        return response.data;
    },

    // Backup & Restore
    createBackup: async (): Promise<ApiResponse<any>> => {
        const response = await api.post('/superadmin/backup/create');
        return response.data;
    },

    listBackups: async (): Promise<ApiResponse<any[]>> => {
        const response = await api.get('/superadmin/backup/list');
        return response.data;
    },

    restoreBackup: async (backupId: number): Promise<ApiResponse<void>> => {
        const response = await api.post(`/superadmin/backup/restore/${backupId}`);
        return response.data;
    },
};
