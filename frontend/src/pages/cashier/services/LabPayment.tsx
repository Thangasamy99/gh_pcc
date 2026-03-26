import React, { useState } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { LabPaymentRequest } from '../../../types/cashier';
import { FlaskConical } from 'lucide-react';
import toast from 'react-hot-toast';

const LabPayment: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientEntryId: '',
    testType: 'Complete Blood Count',
    amount: '',
    paymentMethod: 'CASH'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.patientEntryId) {
      toast.error('Patient ID and Amount are required');
      return;
    }

    try {
      setLoading(true);
      const request: LabPaymentRequest = {
        patientEntryId: Number(formData.patientEntryId),
        testType: formData.testType,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod as any,
        branchId: user?.branchId || 1
      };

      await cashierService.processLabPayment(request);
      toast.success('Lab Payment Successful');
      setFormData({ patientEntryId: '', testType: 'Complete Blood Count', amount: '', paymentMethod: 'CASH' });
    } catch (error) {
      toast.error('Payment failed. Please check the Patient Entry ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Lab Payment</h2>
        <p className="text-gray-500 mt-1">Process payment for laboratory tests</p>
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
            <label className="block text-sm font-medium text-gray-700">Test Type *</label>
            <select
              value={formData.testType}
              onChange={e => setFormData({...formData, testType: e.target.value})}
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
            >
              <option value="Complete Blood Count">Complete Blood Count (CBC)</option>
              <option value="Malaria Parasite">Malaria Parasite</option>
              <option value="Widal Test">Widal Test (Typhoid)</option>
              <option value="Urinalysis">Urinalysis</option>
              <option value="Blood Sugar">Blood Sugar</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="e.g. 3000"
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
                <FlaskConical className="w-5 h-5" />
              )}
              <span>Confirm Lab Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabPayment;
