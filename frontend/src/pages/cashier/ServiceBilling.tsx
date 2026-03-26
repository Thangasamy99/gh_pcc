import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Image as ImageIcon, 
  Pill,
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cashierService } from '../../services/cashierService';
import { PaymentRequest } from '../../types/cashier';
import { useAuth } from '../../components/auth/AuthContext';
import toast from 'react-hot-toast';

const ServiceBilling: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'LAB' | 'IMAGING' | 'PHARMACY'>('LAB');
  
  // Basic State
  const [patientId, setPatientId] = useState('');
  const [serviceDetail, setServiceDetail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOBILE_MONEY' | 'CARD'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = [
    { id: 'LAB', label: 'Laboratory Payment', icon: FlaskConical, color: 'text-blue-600', bg: 'bg-blue-50/50' },
    { id: 'IMAGING', label: 'Imaging Payment', icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50/50' },
    { id: 'PHARMACY', label: 'Pharmacy Payment', icon: Pill, color: 'text-green-600', bg: 'bg-green-50/50' }
  ];

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.branchId || !patientId || !amount || !serviceDetail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsProcessing(true);
      const request: PaymentRequest = {
        patientEntryId: parseInt(patientId), // Demo assumption: using patient ID as entry ID for now
        serviceType: `${activeTab} - ${serviceDetail}`,
        amount: parseFloat(amount),
        paymentMethod,
        discount: 0,
        branchId: user.branchId
      };

      await cashierService.processPayment(request);
      toast.success(`${activeTab} Payment processed successfully!`);
      
      // Reset form
      setPatientId('');
      setServiceDetail('');
      setAmount('');
    } catch (err) {
      console.error('Service payment failed:', err);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-2 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6C2BD9] to-[#9333EA]">
            Service Billing
          </h1>
          <p className="text-sm text-gray-500 mt-1">Process post-consultation payments</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'LAB' | 'IMAGING' | 'PHARMACY');
                  setServiceDetail('');
                  setAmount('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all ${
                  isActive 
                    ? `border-b-2 border-purple-600 text-purple-700 bg-purple-50/30` 
                    : `text-gray-500 hover:text-gray-700 hover:bg-gray-50`
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="p-8">
          <motion.form 
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleProcessPayment} 
            className="max-w-xl mx-auto space-y-6"
          >
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6">
              <Search className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Find Patient</p>
                <input 
                  type="text" 
                  required
                  placeholder="Enter Patient ID or Waitlist #"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="mt-2 w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {activeTab === 'LAB' ? 'Test Type / Name' : activeTab === 'IMAGING' ? 'Scan Type (X-Ray, MRI, etc)' : 'Medicine Name / Prescription'}
              </label>
              <input 
                type="text" 
                required
                placeholder="E.g., Complete Blood Count"
                value={serviceDetail}
                onChange={(e) => setServiceDetail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Amount ($)</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#9333EA]/20 focus:border-[#9333EA]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {['CASH', 'MOBILE_MONEY', 'CARD'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method as any)}
                    className={`py-3 text-xs font-bold rounded-xl border-2 transition-all ${
                      paymentMethod === method 
                        ? 'bg-purple-50 border-[#6C2BD9] text-[#6C2BD9]' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-purple-200'
                    }`}
                  >
                    {method.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] text-white text-base font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                Confirm Payment
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ServiceBilling;
