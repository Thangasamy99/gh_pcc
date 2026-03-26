
// ============================================================
// DASHBOARD SERVICE: dashboardService.ts
// All database queries for dashboard data
// ============================================================

import api from './api';
import {
  DashboardStats,
  SystemHealth,
  UserActivity,
  RevenueData,
  AuditLog,
  ApiResponse,
} from '../types';

export const dashboardService = {
  // ========== DASHBOARD STATS ==========
  // GET /api/v1/superadmin/dashboard/stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/v1/superadmin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // ========== SYSTEM HEALTH ==========
  // GET /api/v1/superadmin/dashboard/system-health
  getSystemHealth: async (): Promise<SystemHealth> => {
    try {
      const response = await api.get<ApiResponse<SystemHealth>>('/v1/superadmin/dashboard/system-health');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },

  // ========== USER ACTIVITY ==========
  // GET /api/v1/superadmin/dashboard/user-activity
  getUserActivity: async (timeRange: 'today' | 'week' | 'month' = 'today'): Promise<UserActivity> => {
    try {
      const response = await api.get<ApiResponse<UserActivity>>(`/v1/superadmin/dashboard/user-activity?range=${timeRange}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  },

  // ========== REVENUE OVERVIEW ==========
  // GET /api/v1/superadmin/dashboard/revenue
  getRevenueOverview: async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<RevenueData> => {
    try {
      const response = await api.get<ApiResponse<RevenueData>>(`/v1/superadmin/dashboard/revenue?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue overview:', error);
      throw error;
    }
  },

  // ========== RECENT ACTIVITIES ==========
  // GET /api/v1/superadmin/dashboard/recent-activities
  getRecentActivities: async (limit: number = 10): Promise<AuditLog[]> => {
    try {
      const response = await api.get<ApiResponse<AuditLog[]>>(`/v1/superadmin/dashboard/recent-activities?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
};
