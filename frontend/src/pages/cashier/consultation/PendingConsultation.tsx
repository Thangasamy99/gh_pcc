import React, { useState, useEffect } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { PendingPayment } from '../../../types/cashier';
import { Clock, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PendingConsultation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      if (user?.branchId) {
        const data = await cashierService.getPendingConsultations(user.branchId);
        setPending(data);
      }
    } catch (error) {
      toast.error('Failed to load pending consultations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [user]);

  const filteredPending = pending.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Pending Consultations</h2>
          <p className="text-gray-500 mt-1">Patients waiting for consultation payment</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9333EA] focus:border-transparent transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Auto-refreshing queue</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <p>Loading pending patients...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPending.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No pending patients found
                  </td>
                </tr>
              ) : (
                filteredPending.map((p) => (
                  <tr key={p.patientEntryId} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{p.patientName}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm font-mono">{p.patientId}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        p.patientType === 'FASTTRACK' 
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {p.patientType === 'FASTTRACK' && <Zap className="w-3 h-3" />}
                        {p.patientType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-medium">FCFA {p.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate('/cashier/consultation/process', { state: { patient: p } })}
                        className="px-4 py-2 bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95"
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingConsultation;
