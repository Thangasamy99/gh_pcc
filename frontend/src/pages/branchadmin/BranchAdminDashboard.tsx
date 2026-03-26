import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  CreditCard, 
  UserPlus, 
  Bed, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100/80 relative overflow-hidden group"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4 transition-all group-hover:scale-110 duration-300`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    
    <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
    <div className="flex items-end space-x-3">
      <h3 className="text-3xl font-black text-gray-900 leading-none">{value}</h3>
      {trend && (
        <span className={`text-xs font-bold flex items-center px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>

    {/* Decorative background element */}
    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-125 transition-all duration-500 ${color}`}></div>
  </motion.div>
);

const BranchAdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/dashboard/${branchId}`);
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Branch Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {user?.branchName || 'Buea General Hospital'} Control Center
          </p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Today's Date</p>
            <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard 
          title="Total Patients" 
          value={stats?.totalPatientsToday || 0} 
          icon={Users} 
          color="bg-purple-600" 
          trend={12}
        />
        <StatCard 
          title="Waiting" 
          value={stats?.waitingPatients || 0} 
          icon={Clock} 
          color="bg-blue-500" 
          trend={-5}
        />
        <StatCard 
          title="Paid" 
          value={stats?.paidPatients || 0} 
          icon={CreditCard} 
          color="bg-green-500" 
          trend={8}
        />
        <StatCard 
          title="In Consultation" 
          value={stats?.patientsInConsultation || 0} 
          icon={Activity} 
          color="bg-orange-500" 
          trend={15}
        />
        <StatCard 
          title="Admissions" 
          value={stats?.admissionsToday || 0} 
          icon={Bed} 
          color="bg-indigo-500" 
          trend={2}
        />
        <StatCard 
          title="Revenue (XAF)" 
          value={stats?.totalRevenueToday?.toLocaleString() || '0'} 
          icon={TrendingUp} 
          color="bg-pink-500" 
          trend={24}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Patient Tracking Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Patient Tracking
            </h3>
            <button className="text-purple-600 text-sm font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Current Stage</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-700">#P-100{i+1}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">Patient Name {i+1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        <span className="text-sm font-medium text-gray-600">Reception</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-black rounded-full uppercase">Waiting</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Live Queues */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Live Queue Status
            </h3>
            <div className="space-y-4">
              {Object.entries(stats?.queueStatus || { Reception: 0, Cashier: 0, Doctor: 0 }).map(([dept, count]: any) => (
                <div key={dept} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <span className="font-bold text-gray-700">{dept}</span>
                  <span className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center font-black text-purple-600 border border-gray-100">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6C2BD9] to-[#9333EA] p-6 rounded-3xl shadow-lg shadow-purple-900/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Hospital Capacity</h3>
              <p className="text-purple-100 text-sm mb-6">Real-time resource utilization</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                    <span>Doctor Availability</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest">
                    <span>Ward Occupancy</span>
                    <span>62%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[62%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminDashboard;
