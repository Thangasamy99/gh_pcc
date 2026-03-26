import React, { useEffect, useState } from 'react';
import { 
  Receipt as ReceiptIcon, 
  Search, 
  Download, 
  Printer,
  RefreshCw,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { PaymentReceipt } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';

const Receipts: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getHistory(user.branchId);
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.branchId]);

  const filteredHistory = history.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ReceiptIcon className="w-7 h-7 text-[#6C2BD9]" />
            Payment Receipts
          </h1>
          <p className="text-sm text-gray-500 mt-1">View payment history and generate receipts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search receipts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] w-64"
            />
          </div>
          <button 
            onClick={fetchHistory}
            className="p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt No.</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient & Service</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#6C2BD9]" />
                    Loading receipts...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No payment history</p>
                    <p className="text-xs text-gray-400 mt-1">Processed payments will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((receipt) => (
                  <tr key={receipt.receiptId} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#6C2BD9]">{receipt.receiptId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{receipt.patientName}</p>
                      <p className="text-xs text-gray-500">{receipt.service}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">${receipt.amountPaid.toFixed(2)}</span>
                      <p className="text-xs text-gray-500">{receipt.paymentMethod.replace('_', ' ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{new Date(receipt.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(receipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-500 hover:text-[#6C2BD9] hover:bg-purple-50 rounded-lg transition-colors" title="Print Receipt">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-[#6C2BD9] hover:bg-purple-50 rounded-lg transition-colors" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
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

export default Receipts;
