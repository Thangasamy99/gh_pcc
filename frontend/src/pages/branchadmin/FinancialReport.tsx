import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Wallet, ShieldCheck, PieChart, Download } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const FinancialReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/reports/financial/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching financial report:', error);
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
          <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
          Financial Report
        </h1>
        <button className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <CreditCard className="w-10 h-10 mb-4 text-green-500" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Revenue</h3>
          <p className="text-3xl font-black text-gray-900">{data?.totalRevenue?.toLocaleString() || '0'} XAF</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <ShieldCheck className="w-10 h-10 mb-4 text-blue-500" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Insurance</h3>
          <p className="text-3xl font-black text-gray-900">125,000 XAF</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <Wallet className="w-10 h-10 mb-4 text-orange-500" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Cash Payments</h3>
          <p className="text-3xl font-black text-gray-900">85,000 XAF</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <PieChart className="w-10 h-10 mb-4 text-purple-600" />
          <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Discounts</h3>
          <p className="text-3xl font-black text-gray-900">15,000 XAF</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
