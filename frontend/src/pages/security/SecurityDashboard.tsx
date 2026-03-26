import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Bed,
  Activity,
  Calendar,
  RefreshCw,
  Search,
  Filter,
  X,
  AlertCircle,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  Shield,
  Building2,
  MoreVertical,
  User
} from 'lucide-react';
import { securityService } from '../../services/securityService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import SecurityEntryStepper from '../../components/security/SecurityEntryStepper';

interface DashboardStats {
  todayVisitors: number;
  todayPatients: number;
  currentVisitors: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  todayEntries: number;
  pendingEntries: number;
  completedEntries: number;
}

const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    todayVisitors: 0,
    todayPatients: 0,
    currentVisitors: 0,
    totalBeds: 50,
    occupiedBeds: 0,
    availableBeds: 50,
    todayEntries: 0,
    pendingEntries: 0,
    completedEntries: 0
  });
  
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [activeVisitors, setActiveVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [showEntryForm, setShowEntryForm] = useState(false);

  // Fallback to Branch 1 if user.branchId is undefined
  const branchId = user?.branchId || 1;
  const userId = user?.id || 1;

  useEffect(() => {
    loadDashboardData();
    // Auto refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [branchId]);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all dashboard data in parallel
      const [statsData, entriesData, visitorsData] = await Promise.all([
        securityService.getDashboardStats(branchId).catch(() => null),
        securityService.getTodayEntries(branchId).catch(() => []),
        securityService.getActiveVisitors(branchId).catch(() => [])
      ]);

      setStats({
        todayVisitors: visitorsData?.length || 0,
        todayPatients: statsData?.normalEntriesToday || 0,
        currentVisitors: visitorsData?.length || 0,
        totalBeds: 50, // Default value
        occupiedBeds: statsData?.emergencyCasesToday || 0,
        availableBeds: 50 - (statsData?.emergencyCasesToday || 0),
        todayEntries: (entriesData?.length) || 0,
        pendingEntries: (entriesData || []).filter((e: any) => e.status === 'PENDING').length || 0,
        completedEntries: (entriesData || []).filter((e: any) => e.status === 'COMPLETED').length || 0
      });

      setRecentEntries((entriesData || []).slice(0, 5));
      setActiveVisitors(visitorsData || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    toast.info('Dashboard refreshed');
  };

  const handleNewEntry = () => {
    navigate('/security/entry/patient');
  };

  const handleCheckout = async (visitorId: number) => {
    try {
      await securityService.checkoutVisitor(visitorId, userId);
      toast.success('Visitor checked out successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to checkout visitor');
    }
  };

  const statCards = [
    {
      title: 'Current Visitors',
      value: stats.currentVisitors,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      trend: '+12%',
      trendUp: true,
      subtitle: 'Inside hospital'
    },
    {
      title: 'Today Patients',
      value: stats.todayPatients,
      icon: UserPlus,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      trend: '+8%',
      trendUp: true,
      subtitle: 'New patients'
    },
    {
      title: 'Today Visitors',
      value: stats.todayVisitors,
      icon: UserCheck,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      trend: '-3%',
      trendUp: false,
      subtitle: 'Total visits'
    },
    {
      title: 'Available Beds',
      value: stats.availableBeds,
      icon: Bed,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      subtitle: `${stats.occupiedBeds} occupied`,
      subValueColor: 'text-gray-500'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading && !stats.totalBeds) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Console</h1>
          <div className="text-gray-500 mt-1 flex items-center text-sm">
            <Building2 className="w-4 h-4 mr-1" />
            Buea General Hospital • Main Entrance Gate 01
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            title="Time Range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            title="New Registration"
            onClick={handleNewEntry}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-[#7a1bc2] transition-colors flex items-center space-x-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Registration</span>
          </button>
          <button
            title="Refresh Dashboard"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/security/entry/patient')}
          className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-500 transition-all text-left group"
        >
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Patient Entry</h3>
            <p className="text-xs text-gray-500">Quick medical registration</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/security/entry/visitor')}
          className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-emerald-500 transition-all text-left group"
        >
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Visitor Pass</h3>
            <p className="text-xs text-gray-500">Register hospital guest</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/security/entry/emergency')}
          className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-red-500 transition-all text-left group"
        >
          <div className="p-4 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Emergency Case</h3>
            <p className="text-xs text-red-600 font-bold animate-pulse">Critical Priority Entry</p>
          </div>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-bold ${card.textColor} mt-1`}>{card.value}</p>
                  {card.subtitle && (
                    <span className={`text-xs text-gray-500`}>
                      {card.subtitle}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-7 h-7 ${card.textColor}`} />
              </div>
            </div>
            {card.trend && (
              <div className="mt-4 flex items-center text-xs">
                {card.trendUp ? (
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className={card.trendUp ? 'text-green-600' : 'text-red-600'}>
                  {card.trend}
                </span>
                <span className="text-gray-500 ml-1">vs yesterday</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Entry Stream */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Entry Stream</h2>
              <div className="text-sm text-gray-500 flex items-center">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                 Real-time movement tracking
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none w-48 transition-all" />
              </div>
              <button
                title="Filter Results"
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      entry.personType === 'EMERGENCY' ? 'bg-red-100' : 
                      entry.personType === 'VISITOR' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {entry.personType === 'EMERGENCY' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : entry.personType === 'VISITOR' ? (
                        <Users className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{entry.patientName || entry.visitorName || 'Anonymous'}</p>
                      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
                        <span>{entry.personType}</span>
                        <span>•</span>
                        <span>{entry.visitType}</span>
                        <span>•</span>
                        <span className="flex items-center text-primary">
                          {entry.direction} <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">
                        {entry.entryTime ? new Date(entry.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </p>
                      <div className="mt-1">{getStatusBadge(entry.status)}</div>
                    </div>
                    <button title="More Options" className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No entries recorded today yet</h3>
                <p className="text-gray-500 text-sm mb-4">Start by registering a new patient or visitor</p>
                <button
                  onClick={handleNewEntry}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center space-x-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>New Entry</span>
                </button>
              </div>
            )}
            {recentEntries.length > 0 && (
                <button onClick={() => navigate('/security/visitors/log')} className="w-full mt-2 py-3 text-sm font-bold text-primary bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                    View All Activity Logs
                </button>
            )}
          </div>
        </motion.div>

        {/* Active Visitors */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 rounded-xl p-6 shadow-xl text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Active Visitors</h2>
                <div className="flex items-center text-xs font-medium text-gray-400 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                  Inside premises
                </div>
              </div>
              <span className="text-3xl font-black text-purple-400">{activeVisitors.length}</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {activeVisitors.length > 0 ? (
                activeVisitors.map((visitor, idx) => (
                  <div 
                    key={visitor.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm">{visitor.visitorName}</h4>
                      <button 
                        onClick={() => handleCheckout(visitor.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs flex items-center"
                        title="Check-out"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Exit
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                      <div>
                        <span>Host: </span>
                        <span className="text-white">{visitor.patientName || 'Facility/Staff'}</span>
                      </div>
                      <div className="text-right">
                        <span>In at: </span>
                        <span className="text-purple-400 font-bold">{new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium text-sm">No active visitors</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
               <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                   <span>System Status</span>
                   <span className="text-green-400 flex items-center">
                       <Shield className="w-3 h-3 mr-1" /> Secure
                   </span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

       <SecurityEntryStepper
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        onSuccess={loadDashboardData}
        branchId={branchId}
        userId={userId}
      />
    </div>
  );
};

export default SecurityDashboard;
