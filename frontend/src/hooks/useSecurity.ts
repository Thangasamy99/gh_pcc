import { useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/securityService';
import { toast } from 'react-toastify';

export const useSecurity = (branchId: number) => {
  const [stats, setStats] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await securityService.getDashboardStats(branchId);
      setStats(data);
    } catch (err) {
      setError('Failed to load stats');
      console.error(err);
    }
  }, [branchId]);

  const loadActiveVisitors = useCallback(async () => {
    try {
      const data = await securityService.getActiveVisitors(branchId);
      setVisitors(data);
    } catch (err) {
      setError('Failed to load visitors');
      console.error(err);
    }
  }, [branchId]);

  const loadTodayEntries = useCallback(async () => {
    try {
      const data = await securityService.getTodayEntries(branchId);
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries');
      console.error(err);
    }
  }, [branchId]);

  const loadWards = useCallback(async () => {
    try {
      const data = await securityService.getAllWards(branchId);
      setWards(data);
    } catch (err) {
      setError('Failed to load wards');
      console.error(err);
    }
  }, [branchId]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadActiveVisitors(),
        loadTodayEntries(),
        loadWards()
      ]);
      toast.success('Data refreshed');
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadActiveVisitors, loadTodayEntries, loadWards]);

  const registerVisitor = useCallback(async (data: any, userId: number = 1) => {
    try {
      const result = await securityService.registerVisitor(data, userId);
      toast.success('Visitor registered successfully');
      await loadActiveVisitors();
      await loadTodayEntries();
      return result;
    } catch (err) {
      toast.error('Failed to register visitor');
      throw err;
    }
  }, [loadActiveVisitors, loadTodayEntries]);

  const checkoutVisitor = useCallback(async (visitorId: number, userId: number = 1) => {
    try {
      await securityService.checkoutVisitor(visitorId, userId);
      toast.success('Visitor checked out');
      await loadActiveVisitors();
      await loadTodayEntries();
    } catch (err) {
      toast.error('Failed to checkout visitor');
      throw err;
    }
  }, [loadActiveVisitors, loadTodayEntries]);

  useEffect(() => {
    if (branchId) {
      refreshAll();
    }
  }, [branchId]);

  return {
    stats,
    visitors,
    entries,
    wards,
    loading,
    error,
    refreshAll,
    registerVisitor,
    checkoutVisitor,
    loadStats,
    loadActiveVisitors,
    loadTodayEntries,
    loadWards
  };
};

export default useSecurity;
