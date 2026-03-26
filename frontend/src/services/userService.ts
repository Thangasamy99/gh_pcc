
// ============================================================
// USER SERVICE: userService.ts
// All database queries for user management
// ============================================================

import api from './api';
import { UserResponse, ApiResponse, PaginatedResponse } from '../types';

export const userService = {
  // ========== GET ALL ACTIVE USERS ==========
  // GET /api/v1/superadmin/users
  getAllUsers: async (params?: {
    role?: string;
    branchId?: number;
    active?: boolean;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<UserResponse>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<UserResponse>>>('/v1/superadmin/users', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // ========== GET USER BY ID ==========
  // GET /api/v1/superadmin/users/{id}
  getUserById: async (id: number): Promise<UserResponse> => {
    try {
      const response = await api.get<ApiResponse<UserResponse>>(`/v1/superadmin/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // ========== CREATE USER ==========
  createUser: async (userData: any): Promise<UserResponse> => {
    try {
      const response = await api.post<ApiResponse<UserResponse>>('/v1/superadmin/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // ========== UPDATE USER ==========
  // PUT /api/v1/superadmin/users/{id}
  updateUser: async (id: number, userData: any): Promise<UserResponse> => {
    try {
      const response = await api.put<ApiResponse<UserResponse>>(`/v1/superadmin/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // ========== DELETE USER ==========
  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`/v1/superadmin/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // ========== LOCK USER ==========
  lockUser: async (id: number): Promise<void> => {
    try {
      await api.post(`/v1/superadmin/users/${id}/lock`);
    } catch (error) {
      console.error(`Error locking user ${id}:`, error);
      throw error;
    }
  },

  // ========== UNLOCK USER ==========
  unlockUser: async (id: number): Promise<void> => {
    try {
      await api.post(`/v1/superadmin/users/${id}/unlock`);
    } catch (error) {
      console.error(`Error unlocking user ${id}:`, error);
      throw error;
    }
  },

  // ========== RESET USER PASSWORD ==========
  // POST /api/v1/superadmin/users/{id}/reset-password
  resetUserPassword: async (id: number, newPassword?: string): Promise<any> => {
    try {
      const response = await api.post<ApiResponse<any>>(`/v1/superadmin/users/${id}/reset-password`, { newPassword });
      return response.data.data;
    } catch (error) {
      console.error(`Error resetting password for user ${id}:`, error);
      throw error;
    }
  },

  // ========== CHECK USERNAME UNIQUENESS ==========
  checkUsername: async (username: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<boolean>>('/v1/superadmin/users/check-username', { params: { username } });
      return response.data.data;
    } catch (error) {
      return false;
    }
  },

  // ========== CHECK STAFF ID UNIQUENESS ==========
  checkStaffId: async (staffId: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<boolean>>('/v1/superadmin/users/check-staff-id', { params: { staffId } });
      return response.data.data;
    } catch (error) {
      return false;
    }
  }
};
