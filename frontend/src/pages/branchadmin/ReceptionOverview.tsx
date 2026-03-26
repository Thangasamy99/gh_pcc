import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Users, HeartPulse, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const InfoCard = ({ title, value, icon: Icon, color, description }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">{title}</h3>
    <p className="text-4xl font-black text-gray-900 mb-2">{value}</p>
    <p className="text-gray-400 text-xs font-medium">{description}</p>
  </div>
);

const ReceptionOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/operations/reception/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching reception data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Monitor className="w-8 h-8 mr-3 text-purple-600" />
            Reception Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time patient registration and triage monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InfoCard 
          title="Registered Today" 
          value={data?.registeredToday || 0} 
          icon={Users} 
          color="bg-purple-600" 
          description="Total patients processed at front desk"
        />
        <InfoCard 
          title="Vitals Completed" 
          value={data?.vitalsCompleted || 0} 
          icon={HeartPulse} 
          color="bg-pink-500" 
          description="Patients ready for the next stage"
        />
        <InfoCard 
          title="Waiting for Cashier" 
          value={data?.waitingForCashier || 0} 
          icon={Clock} 
          color="bg-orange-500" 
          description="Patients in billing queue"
        />
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-purple-900/20">
        <div className="space-y-4 text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-3xl font-black">Front Desk Efficiency</h2>
          <p className="text-purple-100 max-w-md">Average check-in time is currently <span className="font-bold text-white underline">8.5 minutes</span>. Staff are operating at optimal capacity.</p>
        </div>
        <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-purple-50 transition-colors flex items-center">
          View Detailed Logs <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ReceptionOverview;
