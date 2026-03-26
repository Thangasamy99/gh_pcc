import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, Users, CreditCard, Stethoscope, FlaskConical, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const QueueCard = ({ title, count, icon: Icon, color, subText }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group"
  >
    <div className="space-y-2">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest">{title}</h3>
      <div className="flex items-end space-x-2">
        <span className="text-4xl font-black text-gray-900">{count}</span>
        <span className="text-gray-400 text-xs font-medium pb-1">{subText || 'Patients waiting'}</span>
      </div>
    </div>
    
    <div className="h-20 w-1 bg-gray-50 rounded-full group-hover:bg-purple-100 transition-colors"></div>
  </motion.div>
);

const LiveQueueStatus = () => {
  const { user } = useAuth();
  const [queues, setQueues] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const branchId = user?.branchId || 1;
      const response = await api.get(`/v1/branch-admin/queues/${branchId}`);
      setQueues(response.data.data);
    } catch (error) {
      console.error('Error fetching queues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Clock className="w-8 h-8 mr-3 text-blue-500" />
            Live Queue Status
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time workload monitoring across departments</p>
        </div>
        
        <button 
          onClick={fetchQueues}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
          Refresh Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <QueueCard 
          title="Reception" 
          count={queues?.Reception || 0} 
          icon={Users} 
          color="bg-purple-600" 
          subText="In Triage"
        />
        <QueueCard 
          title="Cashier" 
          count={queues?.Cashier || 0} 
          icon={CreditCard} 
          color="bg-green-500" 
          subText="Pending Payment"
        />
        <QueueCard 
          title="Doctor" 
          count={queues?.Doctor || 0} 
          icon={Stethoscope} 
          color="bg-blue-500" 
          subText="Waiting for Consultation"
        />
        <QueueCard 
          title="Laboratory" 
          count={queues?.Lab || 0} 
          icon={FlaskConical} 
          color="bg-orange-500" 
          subText="Sample Collection"
        />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-600" />
          Queue Trend (Last 4 Hours)
        </h3>
        <div className="h-64 flex items-end justify-between px-4">
          {[45, 60, 40, 80, 35, 55, 70, 90].map((height, i) => (
            <div key={i} className="w-12 space-y-2 flex flex-col items-center">
              <div 
                className="w-full bg-purple-50 rounded-t-xl transition-all duration-1000 group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
              </div>
              <span className="text-[10px] font-bold text-gray-400">{10 + i}:00</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveQueueStatus;
