import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Wallet, 
  Smartphone, 
  CreditCard,
  Users,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Briefcase,
  Tags
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { CollectionReport } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';
import PrintHeader from '../../components/common/PrintHeader';
import PrintWrapper from '../../components/common/PrintWrapper';

const DailyCollectionReport: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<CollectionReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getDailyReport(user.branchId);
      setReport(data);
    } catch (err) {
      console.error('Error fetching report:', err);
      toast.error('Failed to load collection report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [user?.branchId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Generating Report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-[#6C2BD9]" />
            Daily Collection Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time breakdown of today's revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <PrintWrapper>
            <PrintHeader title="DAILY REVENUE COLLECTION REPORT" />
            
            <div className="mt-8 space-y-8 text-left">
              <div className="grid grid-cols-2 gap-8 border-b border-gray-100 pb-8">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue Today</p>
                  <p className="text-4xl font-bold text-gray-900 underline decoration-[#6C2BD9]/30">FCFA {report?.totalRevenue?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Patients Paid</p>
                  <p className="text-4xl font-bold text-gray-900">{report?.totalPatientsPaid || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <PrintStat label="Cash Payments" value={report?.cashTotal} />
                <PrintStat label="Mobile Money" value={report?.mobileMoneyTotal} />
                <PrintStat label="Card Payments" value={report?.cardTotal} />
                <PrintStat label="Insurance Paid" value={report?.insuranceTotal} />
                <PrintStat label="Credit Settled" value={report?.creditTotal} />
                <PrintStat label="Discounts Given" value={report?.discountTotal} />
              </div>

              <div className="mt-20 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <div className="text-center w-64 border-t border-gray-400 pt-2">
                    <p className="text-sm font-bold text-gray-800">Hospital Cashier</p>
                    <p className="text-[10px] text-gray-500 uppercase">Signature & Date</p>
                  </div>
                  <div className="text-center w-64 border-t border-gray-400 pt-2">
                    <p className="text-sm font-bold text-gray-800">Medical Officer in Charge</p>
                    <p className="text-[10px] text-gray-500 uppercase">Signature & Date</p>
                  </div>
                </div>
              </div>
            </div>
          </PrintWrapper>

          <button 
            onClick={fetchReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors bg-white shadow-sm font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-[#6C2BD9] to-[#9333EA] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-medium mb-1">Total Revenue Today</p>
              <h2 className="text-4xl font-bold">FCFA {report?.totalRevenue?.toLocaleString() || '0'}</h2>
            </div>
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-[#6C2BD9] rounded-xl flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-500 font-medium text-sm mb-1">Total Patients Paid</p>
          <h3 className="text-2xl font-bold text-gray-900">{report?.totalPatientsPaid || 0}</h3>
        </motion.div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mt-8 mb-4 no-print">Revenue by Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        {[
          { label: 'Cash Payments', value: report?.cashTotal, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Mobile Money', value: report?.mobileMoneyTotal, icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Card Payments', value: report?.cardTotal, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Insurance Paid', value: report?.insuranceTotal, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Credit Settled', value: report?.creditTotal, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Discounts Given', value: report?.discountTotal, icon: Tags, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((method, idx) => {
          const Icon = method.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`p-4 rounded-xl ${method.bg} ${method.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{method.label}</p>
                <p className="text-xl font-bold text-gray-900">FCFA {method.value?.toLocaleString() || '0'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const PrintStat: React.FC<{ label: string; value?: number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 text-left">
    <span className="text-sm text-gray-600 font-medium">{label}</span>
    <span className="text-base font-bold text-gray-900 font-mono">FCFA {value?.toLocaleString() || '0'}</span>
  </div>
);

export default DailyCollectionReport;
