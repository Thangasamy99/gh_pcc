import api from './api';
import { ApiResponse } from '../types';

export interface Permission {
    id: number;
    permissionName: string;
    permissionCode: string;
    module: string;
    description: string;
    assigned?: boolean; // UI state
}

export interface Role {
    id: number;
    roleName: string;
    roleCode: string;
    description: string;
    roleLevel: number;
    department?: string;
    isSystemRole: boolean;
    permissionIds: number[];
    userCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export const roleService = {
    // ========== ROLE MANAGEMENT ==========
    
    getAllRoles: async (): Promise<Role[]> => {
        const response = await api.get<ApiResponse<Role[]>>('/v1/superadmin/roles');
        return response.data.data;
    },

    getRoleById: async (id: number): Promise<Role> => {
        const response = await api.get<ApiResponse<Role>>(`/v1/superadmin/roles/${id}`);
        return response.data.data;
    },

    createRole: async (role: Partial<Role>): Promise<Role> => {
        const response = await api.post<ApiResponse<Role>>('/v1/superadmin/roles', role);
        return response.data.data;
    },

    updateRole: async (id: number, role: Partial<Role>): Promise<Role> => {
        const response = await api.put<ApiResponse<Role>>(`/v1/superadmin/roles/${id}`, role);
        return response.data.data;
    },

    deleteRole: async (id: number): Promise<void> => {
        await api.delete(`/v1/superadmin/roles/${id}`);
    },

    getRolesByDepartment: async (department: string): Promise<Role[]> => {
        const response = await api.get<ApiResponse<Role[]>>(`/v1/superadmin/roles/department/${department}`);
        return response.data.data;
    },

    getAllDepartments: async (): Promise<string[]> => {
        const response = await api.get<ApiResponse<string[]>>('/v1/superadmin/roles/departments');
        return response.data.data;
    },

    checkRoleName: async (name: string): Promise<boolean> => {
        const response = await api.get<ApiResponse<boolean>>('/v1/superadmin/roles/check-name', { params: { name } });
        return response.data.data;
    },

    // ========== PERMISSION MANAGEMENT ==========

    getAllPermissions: async (): Promise<Permission[]> => {
        const response = await api.get<ApiResponse<Permission[]>>('/v1/superadmin/permissions');
        return response.data.data;
    },

    getPermissionsByModule: async (module: string): Promise<Permission[]> => {
        const response = await api.get<ApiResponse<Permission[]>>(`/v1/superadmin/permissions/module/${module}`);
        return response.data.data;
    },

    // ========== ROLE-PERMISSION ASSIGNMENT ==========

    getRolePermissions: async (roleId: number): Promise<Permission[]> => {
        const response = await api.get<ApiResponse<Permission[]>>(`/v1/superadmin/role-permissions/role/${roleId}`);
        return response.data.data;
    },

    bulkUpdateRolePermissions: async (roleId: number, permissionIds: number[]): Promise<void> => {
        await api.put<ApiResponse<void>>(`/v1/superadmin/role-permissions/role/${roleId}/permissions`, permissionIds);
    },

    // ========== STATISTICS ==========

    getRoleCounts: async (): Promise<{ total: number; system: number; custom: number }> => {
        const roles = await roleService.getAllRoles();
        const systemRoles = roles.filter(r => r.isSystemRole).length;
        return {
            total: roles.length,
            system: systemRoles,
            custom: roles.length - systemRoles
        };
    }
};

export const permissionService = roleService; // Alias for backward compatibility if needed
