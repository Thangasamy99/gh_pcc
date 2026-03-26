import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  RefreshCw,
  Loader2,
  Clock,
  Zap,
  Flame,
  X,
  CheckCircle2
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { PendingPayment, PaymentRequest } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';

const FastTrackQueue: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  
  // Modal State
  const [amount, setAmount] = useState<string>('50.00');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CARD'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFastTrackPayments = async () => {
    if (!user?.branchId) return;
    try {
      setLoading(true);
      const data = await cashierService.getFastTrackPayments(user.branchId);
      setPayments(data);
    } catch (err) {
      console.error('Error fetching fasttrack payments:', err);
      toast.error('Failed to load fast track queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFastTrackPayments();
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
        discount: 0,
        branchId: user.branchId
      };

      await cashierService.processPayment(request);
      toast.success('FastTrack Payment processed successfully!');
      setSelectedPayment(null);
      fetchFastTrackPayments();
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
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-7 h-7 text-red-500" />
            FastTrack Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1">Priority payment processing for urgent cases</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search priority patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-64 bg-red-50/30"
            />
          </div>
          <button 
            onClick={fetchFastTrackPayments}
            className="p-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        <div className="overflow-x-auto mt-2">
          <table className="w-full">
            <thead>
              <tr className="bg-red-50/50 border-b border-red-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority Patient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Entry Time</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status Tag</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50">
              {loading && payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
                    Loading priority queue...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No FastTrack patients</p>
                    <p className="text-xs text-gray-400 mt-1">Priority queue is empty</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.patientEntryId} className="hover:bg-red-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{payment.patientName}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{payment.patientId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(payment.queueTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold border border-red-200">
                        <Zap className="fill-current w-3.5 h-3.5" />
                        FASTTRACK
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{payment.service}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        Quick Pay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FastTrack Payment Modal */}
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500 fill-current" />
                  <h3 className="text-lg font-bold text-red-700">Quick Process</h3>
                </div>
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="font-bold text-xl text-gray-900">{selectedPayment.patientName}</p>
                  <p className="text-sm text-gray-500">{selectedPayment.service}</p>
                </div>

                <form id="fast-payment-form" onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount ($)</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-center text-xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['CASH', 'MOBILE_MONEY', 'CARD'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method as any)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                            paymentMethod === method 
                              ? 'bg-red-50 border-red-500 text-red-600' 
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {method === 'MOBILE_MONEY' ? 'MOBILE' : method}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="fast-payment-form"
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-70"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FastTrackQueue;
