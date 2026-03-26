// src/services/branchService.ts
import api from './api';
import {
  Branch,
  BranchStats,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchFilters,
  PaginatedResponse
} from '../types/branch.types';
import { ApiResponse } from '../types';

export type { Branch };

const BASE_URL = '/v1/superadmin/branches';

export const branchService = {
  // Get all branches
  getAllBranches: async (includeDeleted: boolean = false): Promise<Branch[]> => {
    const response = await api.get<ApiResponse<Branch[]>>(BASE_URL, { params: { includeDeleted } });
    return response.data.data;
  },

  // Get paginated branches with filters
  getBranchesPaginated: async (
    page: number = 0,
    size: number = 10,
    filters?: BranchFilters
  ): Promise<PaginatedResponse<Branch>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Branch>>>(`${BASE_URL}/paged`, {
      params: { page, size, ...filters }
    });
    return response.data.data;
  },

  // Get branch by ID
  getBranchById: async (id: number): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  // Get branch by ID including deleted
  getBranchByIdIncludingDeleted: async (id: number): Promise<Branch> => {
    const response = await api.get<ApiResponse<Branch>>(`${BASE_URL}/${id}/include-deleted`);
    return response.data.data;
  },

  // Create new branch
  createBranch: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await api.post<ApiResponse<Branch>>(BASE_URL, data, {
      headers: { 'X-User-Id': '1' }
    });
    return response.data.data;
  },

  // Update branch
  updateBranch: async (id: number, data: UpdateBranchRequest): Promise<Branch> => {
    const response = await api.put<ApiResponse<Branch>>(`${BASE_URL}/${id}`, data, {
      headers: { 'X-User-Id': '1' }
    });
    return response.data.data;
  },

  // Soft delete branch
  softDeleteBranch: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}/soft`, {
      headers: { 'X-User-Id': '1' }
    });
  },

  // Restore branch
  restoreBranch: async (id: number): Promise<void> => {
    await api.post(`${BASE_URL}/${id}/restore`, null, {
      headers: { 'X-User-Id': '1' }
    });
  },

  // Permanent delete branch
  permanentDeleteBranch: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}/permanent`, {
      headers: { 'X-User-Id': '1' }
    });
  },

  // Bulk soft delete
  bulkSoftDelete: async (ids: number[]): Promise<void> => {
    await api.post(`${BASE_URL}/bulk/soft-delete`, ids, {
      headers: { 'X-User-Id': '1' }
    });
  },

  // Bulk restore
  bulkRestore: async (ids: number[]): Promise<void> => {
    await api.post(`${BASE_URL}/bulk/restore`, ids, {
      headers: { 'X-User-Id': '1' }
    });
  },

  // Get branch statistics
  getBranchStats: async (id: number): Promise<BranchStats> => {
    const response = await api.get<ApiResponse<BranchStats>>(`${BASE_URL}/${id}/stats`);
    return response.data.data;
  },

  // Get all branches statistics
  getAllBranchesStats: async (): Promise<BranchStats[]> => {
    const response = await api.get<ApiResponse<BranchStats[]>>(`${BASE_URL}/stats/all`);
    return response.data.data;
  },

  // Get filter options
  getAllRegions: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>(`${BASE_URL}/filters/regions`);
    return response.data.data;
  },

  getAllCities: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>(`${BASE_URL}/filters/cities`);
    return response.data.data;
  },

  // Check uniqueness
  checkBranchCode: async (code: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<boolean>>(`${BASE_URL}/check-code`, { params: { code } });
    return response.data.data;
  },

  checkBranchName: async (name: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<boolean>>(`${BASE_URL}/check-name`, { params: { name } });
    return response.data.data;
  },

  // Get counts
  getActiveCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>(`${BASE_URL}/counts/active`);
    return response.data.data;
  },

  getDeletedCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<number>>(`${BASE_URL}/counts/deleted`);
    return response.data.data;
  },

  getCountByType: async (type: string): Promise<number> => {
    const response = await api.get<ApiResponse<number>>(`${BASE_URL}/counts/type/${type}`);
    return response.data.data;
  }
};
