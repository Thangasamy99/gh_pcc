import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { ConsultationPaymentRequest } from '../../../types/cashier';
import { CreditCard, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProcessConsultation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;

  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'CASH',
    paymentType: 'FULL_PAYMENT',
    discount: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  if (!patient) {
    return (
      <div className="p-6">
        <button onClick={() => navigate('/cashier/consultation/pending')} className="flex items-center gap-2 text-purple-600 mb-6">
          <ArrowLeft size={20} /> Back to Pending
        </button>
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl">Please select a patient from the prior screen.</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error('Amount is required');
      return;
    }

    try {
      setLoading(true);
      const request: ConsultationPaymentRequest = {
        patientEntryId: patient.patientEntryId,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as any,
        paymentType: formData.paymentType as any,
        discount: formData.discount ? Number(formData.discount) : 0,
        notes: formData.notes,
        branchId: user?.branchId || 1
      };

      await cashierService.processConsultationPayment(request);
      toast.success('Payment Successful');
      navigate('/cashier/consultation/pending');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/cashier/consultation/pending')} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
        <ArrowLeft size={20} /> Back to Pending List
      </button>

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Process Consultation Payment</h2>
        <p className="text-gray-500 mt-1">Complete payment to clear patient for doctor visit</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Patient Info Readonly */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">1. Patient Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Patient ID</label>
                <div className="mt-1 font-mono font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-200">{patient.patientId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-200">{patient.patientName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Type</label>
                <div className="mt-1 font-medium text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-200">{patient.patientType}</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Payment Info */}
          <div>
            <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">2. Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (FCFA) *</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                >
                  <option value="CASH">Cash</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Type *</label>
                <select
                  value={formData.paymentType}
                  onChange={e => setFormData({...formData, paymentType: e.target.value})}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                >
                  <option value="FULL_PAYMENT">Full Payment</option>
                  <option value="ADVANCE_PAYMENT">Advance Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Discount (FCFA)</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                  placeholder="Any additional remarks..."
                />
              </div>

            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              <span>Confirm Payment</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProcessConsultation;
