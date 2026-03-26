import React, { useState } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { PharmacyPaymentRequest } from '../../../types/cashier';
import { Pill } from 'lucide-react';
import toast from 'react-hot-toast';

const PharmacyPayment: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientEntryId: '',
    medicineCost: '',
    amount: '',
    paymentMethod: 'CASH'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.patientEntryId || !formData.medicineCost) {
      toast.error('Patient ID, Medicine Cost, and Amount are required');
      return;
    }

    try {
      setLoading(true);
      const request: PharmacyPaymentRequest = {
        patientEntryId: Number(formData.patientEntryId),
        medicineCost: Number(formData.medicineCost),
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as any,
        branchId: user?.branchId || 1
      };

      await cashierService.processPharmacyPayment(request);
      toast.success('Pharmacy Payment Successful');
      setFormData({ patientEntryId: '', medicineCost: '', amount: '', paymentMethod: 'CASH' });
    } catch (error) {
      toast.error('Payment failed. Please check the Patient Entry ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Pharmacy Payment</h2>
        <p className="text-gray-500 mt-1">Process payment for prescribed medications</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medicine Cost (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.medicineCost}
                onChange={e => {
                  setFormData({...formData, medicineCost: e.target.value, amount: e.target.value});
                }}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="e.g. 8500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount to Pay (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="e.g. 8500"
              />
            </div>
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

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Pill className="w-5 h-5" />
              )}
              <span>Confirm Pharmacy Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacyPayment;
