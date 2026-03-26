import React, { useState } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { AdmissionPaymentRequest } from '../../../types/cashier';
import { BedDouble } from 'lucide-react';
import toast from 'react-hot-toast';

const AdmissionPayment: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientEntryId: '',
    wardType: 'General Ward',
    advanceAmount: '',
    paymentMethod: 'CASH'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.advanceAmount || !formData.patientEntryId) {
      toast.error('Patient ID and Advance Amount are required');
      return;
    }

    try {
      setLoading(true);
      const request: AdmissionPaymentRequest = {
        patientEntryId: Number(formData.patientEntryId),
        wardType: formData.wardType,
        advanceAmount: Number(formData.advanceAmount),
        paymentMethod: formData.paymentMethod as any,
        branchId: user?.branchId || 1
      };

      await cashierService.processAdmissionPayment(request);
      toast.success('Admission Advance Payment Successful');
      setFormData({ patientEntryId: '', wardType: 'General Ward', advanceAmount: '', paymentMethod: 'CASH' });
    } catch (error) {
      toast.error('Payment failed. Please check the Patient Entry ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Admission Payment</h2>
        <p className="text-gray-500 mt-1">Process advance payment for in-patient admission</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Entry ID *</label>
            <input
              type="number"
              required
              value={formData.patientEntryId}
              onChange={e => setFormData({...formData, patientEntryId: e.target.value})}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
              placeholder="e.g. 104"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ward Type *</label>
            <select
              value={formData.wardType}
              onChange={e => setFormData({...formData, wardType: e.target.value})}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
            >
              <option value="General Ward">General Ward</option>
              <option value="Private Room">Private Room</option>
              <option value="VIP Suite">VIP Suite</option>
              <option value="ICU">ICU / Emergency Recovery</option>
              <option value="Maternity">Maternity Ward</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Advance Amount (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.advanceAmount}
                onChange={e => setFormData({...formData, advanceAmount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="e.g. 50000"
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
                <BedDouble className="w-5 h-5" />
              )}
              <span>Confirm Admission Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionPayment;
