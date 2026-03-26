import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, Download } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const DailySummary = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/reports/daily/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching daily summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
          Daily Summary
        </h1>
        <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Users className="w-10 h-10 mx-auto mb-4 text-purple-600" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Patients</h3>
          <p className="text-5xl font-black text-gray-900">{data?.stats?.totalPatientsToday || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-4 text-blue-500" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Peak Hour</h3>
          <p className="text-5xl font-black text-gray-900">11:00</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-4 text-green-500" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Efficiency</h3>
          <p className="text-5xl font-black text-gray-900">92%</p>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
