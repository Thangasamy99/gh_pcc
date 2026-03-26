import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, AlertCircle, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const FinanceCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">{title}</h3>
    <p className="text-4xl font-black text-gray-900">{value}</p>
    {trend && <p className="text-green-600 text-xs font-bold mt-2 flex items-center">+{trend}% from yesterday</p>}
  </div>
);

const CashierOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/operations/cashier/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching cashier data:', error);
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
            <CreditCard className="w-8 h-8 mr-3 text-green-600" />
            Cashier Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">Financial operations and payment status monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FinanceCard 
          title="Pending Payments" 
          value={data?.pendingPayments || 0} 
          icon={AlertCircle} 
          color="bg-orange-500" 
        />
        <FinanceCard 
          title="Completed" 
          value={data?.completedPayments || 0} 
          icon={CheckCircle2} 
          color="bg-green-500" 
          trend={15}
        />
        <FinanceCard 
          title="Insurance Cases" 
          value={data?.insuranceCases || 0} 
          icon={ShieldCheck} 
          color="bg-blue-500" 
        />
        <FinanceCard 
          title="Credit Cases" 
          value={data?.creditCases || 0} 
          icon={Wallet} 
          color="bg-purple-600" 
        />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-gray-400">#</div>
                <div>
                  <p className="font-bold text-gray-900">Transaction TXN-00{i}</p>
                  <p className="text-xs text-gray-500">Patient: John Doe • 10:45 AM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">25,000 XAF</p>
                <span className="text-[10px] font-black uppercase text-green-600">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CashierOverview;
