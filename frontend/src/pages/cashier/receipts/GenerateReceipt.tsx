import React, { useState, useEffect } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { PaymentReceipt } from '../../../types/cashier';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import PrintHeader from '../../../components/common/PrintHeader';
import PrintWrapper from '../../../components/common/PrintWrapper';

const GenerateReceipt: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getHistory(user.branchId);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter(item => 
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Generate Receipt</h2>
          <p className="text-gray-500 mt-1">Print official receipts for completed payments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by patient name or receipt ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9333EA] focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      <p>Loading payments...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No completed payments found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.receiptId} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-6 text-sm font-mono text-gray-600">{item.receiptId}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{item.patientName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{item.service}</td>
                    <td className="py-4 px-6 text-gray-900 font-medium">FCFA {item.amountPaid.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      <PrintWrapper 
                        btnText="Print" 
                        btnClassName="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                      >
                        <PrintHeader 
                          title="OFFICIAL PAYMENT RECEIPT" 
                          showSignature={true}
                          medicalOfficerName="Medical Officer in Charge"
                        />
                        <div className="mt-8 space-y-6 text-gray-900 text-left">
                          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase font-semibold">Receipt Number</p>
                              <p className="text-xl font-mono font-bold">{item.receiptId}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500 text-xs uppercase font-semibold">Date & Time</p>
                              <p className="text-sm font-medium">
                                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 py-4">
                            <div>
                              <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Patient Details</p>
                              <p className="text-lg font-bold text-gray-900">{item.patientName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Payment Method</p>
                              <p className="text-lg font-medium text-gray-900">{item.paymentMethod}</p>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg overflow-hidden mt-8">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="py-2 px-4 text-xs font-bold text-gray-600 uppercase">Description of Service</th>
                                  <th className="py-2 px-4 text-xs font-bold text-gray-600 uppercase text-right">Amount (FCFA)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-100">
                                  <td className="py-3 px-4 text-sm text-gray-900">{item.service}</td>
                                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.amountPaid.toLocaleString()}</td>
                                </tr>
                                <tr className="bg-gray-50 font-bold">
                                  <td className="py-3 px-4 text-sm text-gray-900">TOTAL PAID</td>
                                  <td className="py-3 px-4 text-base text-gray-900 text-right">FCFA {item.amountPaid.toLocaleString()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-12 text-center border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 italic">This is an automated system generated receipt. Thank you for choosing PCC Health Services.</p>
                            {user && <p className="text-[10px] text-gray-300 mt-1 uppercase">Issued by: {user.username}</p>}
                          </div>
                        </div>
                      </PrintWrapper>
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

export default GenerateReceipt;
