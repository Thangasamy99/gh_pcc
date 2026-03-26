import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ListTodo, 
  Zap, 
  TrendingUp, 
  RefreshCw,
  AlertTriangle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { CashierDashboard } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';

const CashierDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<CashierDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getDashboard(user.branchId);
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cashier dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user?.branchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Cash Today',
      value: dashboardData ? `FCFA ${dashboardData.totalRevenue.toLocaleString()}` : 'FCFA 0',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50 text-green-600',
    },
    {
      title: 'Pending Payments',
      value: dashboardData?.pendingPayments || 0,
      icon: ListTodo,
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Total Insurance Payments',
      value: dashboardData ? `FCFA ${(dashboardData.totalInsurancePayments || 0).toLocaleString()}` : 'FCFA 0',
      icon: ShieldCheck,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'FastTrack Patients',
      value: dashboardData?.fastTrackPatients || 0,
      icon: Zap,
      color: 'from-red-500 to-pink-600',
      bgLight: 'bg-red-50 text-red-600',
    }
  ];

  return (
    <div className="p-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6C2BD9] to-[#9333EA]">
            Cashier Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time payment and queuing metrics</p>
        </div>
        <button
          onClick={() => {
            fetchDashboard();
            toast.success('Dashboard refreshed');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              
              {/* Decorative gradient blur */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            </motion.div>
          );
        })}
      </div>
      
      {/* Informational Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to the Cash Office</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-3xl">
          Process payments efficiently. Patients sent from Reception will appear in the Pending Payments queue.
          Use the FastTrack queue to prioritize urgent patients. Remember that payment is required before a patient can proceed to the Doctor.
        </p>
      </div>
    </div>
  );
};

export default CashierDashboardPage;
