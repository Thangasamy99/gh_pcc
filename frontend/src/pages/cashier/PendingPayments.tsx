import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Filter, 
  RefreshCw,
  Loader2,
  Clock,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { PendingPayment, PaymentRequest } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';

const PendingPayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  
  // Modal State
  const [amount, setAmount] = useState<string>('50.00'); // Default base consultation fee for demo
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CARD'>('CASH');
  const [discount, setDiscount] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPayments = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getPendingPayments(user.branchId);
      setPayments(data);
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user?.branchId]);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !user?.branchId) return;

    try {
      setIsProcessing(true);
      const request: PaymentRequest = {
        patientEntryId: selectedPayment.patientEntryId,
        serviceType: selectedPayment.service,
        amount: parseFloat(amount),
        paymentMethod,
        discount: parseFloat(discount) || 0,
        notes,
        branchId: user.branchId
      };

      await cashierService.processPayment(request);
      toast.success('Payment processed successfully!');
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      console.error('Payment processing failed:', err);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Process patient payments before consultation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] w-64"
            />
          </div>
          <button 
            onClick={fetchPayments}
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
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Info</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue Time</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#6C2BD9]" />
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No pending payments</p>
                    <p className="text-xs text-gray-400 mt-1">All caught up! Waiting for Reception.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.patientEntryId} className="hover:bg-purple-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#6C2BD9] transition-colors">{payment.patientName}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{payment.patientId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(payment.queueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {payment.patientType === 'FASTTRACK' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                          <Zap className="fill-current w-3.5 h-3.5" />
                          FASTTRACK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                          NORMAL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{payment.service}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#6C2BD9] text-white text-sm font-semibold rounded-xl hover:bg-[#5b24b8] transition-all shadow-md shadow-purple-200"
                      >
                        <CreditCard className="w-4 h-4" />
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

      {/* Payment Processing Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPayment(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Process Payment</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Collect payment for {selectedPayment.service}</p>
                </div>
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Patient</span>
                    {selectedPayment.patientType === 'FASTTRACK' && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> FastTrack
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900">{selectedPayment.patientName}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedPayment.patientId}</p>
                </div>

                <form id="payment-form" onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Selected</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedPayment.service}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium font-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Amount ($)</label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Discount ($)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['CASH', 'MOBILE_MONEY', 'CARD'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method as any)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            paymentMethod === method 
                              ? 'bg-purple-50 border-[#6C2BD9] text-[#6C2BD9]' 
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {method.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Internal Notes</label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional remarks..."
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA] resize-none"
                    />
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500 font-medium">To Pay: </span>
                  <span className="text-lg font-bold text-[#6C2BD9]">
                    ${Math.max(0, parseFloat(amount || '0') - parseFloat(discount || '0')).toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedPayment(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    form="payment-form"
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Confirm Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingPayments;
