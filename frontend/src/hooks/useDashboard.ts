
// ============================================================
// CUSTOM HOOK: useDashboard.ts
// Hook to fetch and manage all dashboard data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
    dashboardService
} from '../services/dashboardService';
import {
    DashboardStats,
    SystemHealth,
    UserActivity,
    RevenueData,
    AuditLog,
} from '../types';

interface DashboardData {
    stats: DashboardStats | null;
    systemHealth: SystemHealth | null;
    userActivity: UserActivity | null;
    revenue: RevenueData | null;
    recentActivities: AuditLog[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useDashboard = (timeRange: 'today' | 'week' | 'month' = 'today'): DashboardData => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
    const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
    const [revenue, setRevenue] = useState<RevenueData | null>(null);
    const [recentActivities, setRecentActivities] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch core dashboard data in parallel
            const [
                statsData,
                healthData,
                activitiesData,
            ] = await Promise.all([
                dashboardService.getDashboardStats(),
                dashboardService.getSystemHealth(),
                dashboardService.getRecentActivities(10),
            ]);

            setStats(statsData);
            setSystemHealth(healthData);
            setRecentActivities(activitiesData);

            // Attempt activity and revenue, which might be in separate controller/endpoints
            try {
                const activityData = await dashboardService.getUserActivity(timeRange);
                setUserActivity(activityData);
            } catch (e) { console.warn('User activity not available yet'); }

            try {
                const revenueData = await dashboardService.getRevenueOverview('month');
                setRevenue(revenueData);
            } catch (e) { console.warn('Revenue data not available yet'); }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchData();

        // Refresh data every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        stats,
        systemHealth,
        userActivity,
        revenue,
        recentActivities,
        loading,
        error,
        refresh,
    };
};
