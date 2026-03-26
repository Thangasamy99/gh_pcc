import React, { useState } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { InsurancePaymentRequest } from '../../../types/cashier';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const InsurancePayment: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientEntryId: '',
    insuranceCompany: '',
    policyNumber: '',
    approvedAmount: '',
    paidAmount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paidAmount || !formData.patientEntryId || !formData.approvedAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const request: InsurancePaymentRequest = {
        patientEntryId: Number(formData.patientEntryId),
        insuranceCompany: formData.insuranceCompany,
        policyNumber: formData.policyNumber,
        approvedAmount: Number(formData.approvedAmount),
        paidAmount: Number(formData.paidAmount),
        branchId: user?.branchId || 1
      };

      await cashierService.processInsurancePayment(request);
      toast.success('Insurance Payment Recorded Successfully');
      setFormData({ 
        patientEntryId: '', 
        insuranceCompany: '', 
        policyNumber: '', 
        approvedAmount: '', 
        paidAmount: '' 
      });
    } catch (error) {
      toast.error('Failed to record insurance payment. Verify Patient Entry ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Insurance Payment</h2>
        <p className="text-gray-500 mt-1">Record approved insurance coverage and patient co-pay</p>
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
              className="mt-1 block w-max min-w-[300px] px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
              placeholder="e.g. 104"
            />
          </div>

          <div className="h-px bg-gray-100 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Company *</label>
              <input
                type="text"
                required
                value={formData.insuranceCompany}
                onChange={e => setFormData({...formData, insuranceCompany: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="e.g. Ascoma, Zenithe..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Policy Number *</label>
              <input
                type="text"
                required
                value={formData.policyNumber}
                onChange={e => setFormData({...formData, policyNumber: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="Policy # / Card #"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Approved Amount (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.approvedAmount}
                onChange={e => setFormData({...formData, approvedAmount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="Amount covered by insurance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Paid Amount (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.paidAmount}
                onChange={e => setFormData({...formData, paidAmount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="Patient Co-pay amount"
              />
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
                <ShieldCheck className="w-5 h-5" />
              )}
              <span>Record Insurance Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsurancePayment;
