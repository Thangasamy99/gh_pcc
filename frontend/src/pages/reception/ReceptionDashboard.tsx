import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CreditCard,
  Stethoscope,
  Activity,
  TrendingUp,
  AlertTriangle,
  Heart,
  RefreshCw,
  ArrowUpRight,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { ReceptionDashboard as ReceptionDashboardType } from '../../types/reception';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const ReceptionDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<ReceptionDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getDashboard();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-800 font-semibold">Error loading dashboard</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const mainStats = [
    {
      title: 'Total Patients Today',
      value: dashboard.totalPatientsToday,
      icon: Users,
      gradient: 'from-[#6C2BD9] to-[#9333EA]',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Waiting Patients',
      value: dashboard.waitingQueue,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      title: 'Sent to Cashier',
      value: dashboard.sentToCashier,
      icon: CreditCard,
      gradient: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Sent to Doctor',
      value: dashboard.sentToDoctor,
      icon: Stethoscope,
      gradient: 'from-emerald-500 to-green-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
  ];

  const processFlow = [
    {
      title: 'Vitals Completed',
      value: dashboard.vitalsCompleted,
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      title: 'Payment Completed',
      value: dashboard.paymentCompleted,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      title: 'Emergency Cases',
      value: dashboard.emergencyCases,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's your real-time overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Last updated: {new Date(dashboard.lastUpdated).toLocaleTimeString()}
          </span>
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C2BD9] text-white rounded-xl text-sm font-medium hover:bg-[#5b24b8] transition-all shadow-lg shadow-purple-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mainStats.map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <ArrowUpRight className={`w-4 h-4 ${stat.textColor}`} />
              <span className={`text-xs font-semibold ${stat.textColor}`}>Today's count</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Process Flow & Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Process Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#6C2BD9]" />
            Process Flow
          </h2>
          <div className="space-y-3">
            {processFlow.map((item) => (
              <div
                key={item.title}
                className={`flex items-center justify-between p-4 ${item.bg} border ${item.border} rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.title}</span>
                </div>
                <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Triage Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6C2BD9]" />
            Triage Status
          </h2>
          <div className="space-y-4">
            {/* Normal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Normal Cases</span>
                <span className="font-bold text-green-600">{dashboard.normalCases}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      dashboard.totalPatientsToday > 0
                        ? (dashboard.normalCases / dashboard.totalPatientsToday) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            {/* Urgent */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Urgent Cases</span>
                <span className="font-bold text-amber-600">{dashboard.urgentCases}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      dashboard.totalPatientsToday > 0
                        ? (dashboard.urgentCases / dashboard.totalPatientsToday) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            {/* Emergency */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Emergency Cases</span>
                <span className="font-bold text-red-600">{dashboard.emergencyCases}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-400 to-rose-500 h-3 rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      dashboard.totalPatientsToday > 0
                        ? (dashboard.emergencyCases / dashboard.totalPatientsToday) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Demographics & Visit Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Gender Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Demographics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-3xl font-bold text-blue-600">{dashboard.malePatients}</p>
              <p className="text-xs font-medium text-blue-500 mt-1">Male</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-xl border border-pink-100">
              <p className="text-3xl font-bold text-pink-600">{dashboard.femalePatients}</p>
              <p className="text-xs font-medium text-pink-500 mt-1">Female</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-3xl font-bold text-purple-600">{dashboard.otherGenderPatients}</p>
              <p className="text-xs font-medium text-purple-500 mt-1">Other</p>
            </div>
          </div>
        </motion.div>

        {/* Visit Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Visit Types</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-3xl font-bold text-indigo-600">{dashboard.consultationPatients}</p>
              <p className="text-xs font-medium text-indigo-500 mt-1">Consultation</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-3xl font-bold text-teal-600">{dashboard.followUpPatients}</p>
              <p className="text-xs font-medium text-teal-500 mt-1">Follow-up</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-3xl font-bold text-red-600">{dashboard.emergencyPatients}</p>
              <p className="text-xs font-medium text-red-500 mt-1">Emergency</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
