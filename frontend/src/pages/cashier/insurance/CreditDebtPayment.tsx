import React, { useState } from 'react';
import { cashierService } from '../../../services/cashierService';
import { useAuth } from '../../../components/auth/AuthContext';
import { CreditPaymentRequest } from '../../../types/cashier';
import { Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const CreditDebtPayment: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patientEntryId: '',
    totalBill: '',
    paidAmount: '',
    paymentMethod: 'CASH'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paidAmount || !formData.patientEntryId || !formData.totalBill) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalBillNum = Number(formData.totalBill);
    const paidAmountNum = Number(formData.paidAmount);
    
    if (paidAmountNum > totalBillNum) {
      toast.error('Paid amount cannot exceed total bill');
      return;
    }

    const remainingBal = totalBillNum - paidAmountNum;

    try {
      setLoading(true);
      const request: CreditPaymentRequest = {
        patientEntryId: Number(formData.patientEntryId),
        totalBill: totalBillNum,
        paidAmount: paidAmountNum,
        remainingBalance: remainingBal,
        paymentMethod: formData.paymentMethod as any,
        branchId: user?.branchId || 1
      };

      await cashierService.processCreditPayment(request);
      toast.success('Credit/Debt Payment Recorded Successfully');
      setFormData({ 
        patientEntryId: '', 
        totalBill: '', 
        paidAmount: '', 
        paymentMethod: 'CASH' 
      });
    } catch (error) {
      toast.error('Failed to record payment. Verify Patient Entry ID.');
    } finally {
      setLoading(false);
    }
  };

  const calculatedBalance = (Number(formData.totalBill) || 0) - (Number(formData.paidAmount) || 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Credit / Debt Payment</h2>
        <p className="text-gray-500 mt-1">Record partial payments and track remaining debt balances</p>
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

          <div className="h-px bg-gray-100 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Bill (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.totalBill}
                onChange={e => setFormData({...formData, totalBill: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="Total amount owed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount Being Paid (FCFA) *</label>
              <input
                type="number"
                required
                value={formData.paidAmount}
                onChange={e => setFormData({...formData, paidAmount: e.target.value})}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#9333EA] focus:border-transparent outline-none transition-all"
                placeholder="Amount settling now"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-medium text-gray-500">Remaining Balance (FCFA)</label>
              <div className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-red-600 font-bold font-mono">
                {calculatedBalance > 0 ? calculatedBalance.toLocaleString() : '0'}
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
                <Briefcase className="w-5 h-5" />
              )}
              <span>Record Debt / Credit Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditDebtPayment;
