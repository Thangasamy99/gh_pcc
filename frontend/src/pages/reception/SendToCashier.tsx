import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SendHorizontal,
  Clock,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  X,
  CreditCard,
  Users,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { ReceptionQueue } from '../../types/reception';
import toast from 'react-hot-toast';

const SendToCashier: React.FC = () => {
  const [queue, setQueue] = useState<ReceptionQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getWaitingQueue();
      setQueue(data);
      setError(null);
    } catch (err) {
      setError('Failed to load queue');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToCashier = async (patientEntryId: number) => {
    try {
      setActionLoading(patientEntryId);
      await receptionService.sendToCashier(patientEntryId);
      toast.success('Patient sent to cashier successfully!');
      fetchQueue();
    } catch (err) {
      toast.error('Failed to send patient to cashier');
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Only show patients with vitals completed but not yet sent to cashier
  const eligiblePatients = queue.filter((q) => q.vitalsCompleted && !q.sentToCashier);
  const alreadySent = queue.filter((q) => q.sentToCashier);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <SendHorizontal className="w-7 h-7 text-[#6C2BD9]" />
            Send to Cashier
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Send patients with completed vitals to the cashier for payment
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 px-4 py-2 bg-[#6C2BD9] text-white rounded-xl text-sm font-medium hover:bg-[#5b24b8] transition-all shadow-lg shadow-purple-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Flow Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">Patient Flow Rule</p>
          <p className="text-xs text-gray-500">
            Only patients with <strong>completed vitals</strong> can be sent to the cashier. Vitals must be recorded first.
          </p>
        </div>
      </div>

      {/* Eligible Patients */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-green-500" />
            Ready to Send
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
              {eligiblePatients.length}
            </span>
          </h2>
        </div>

        {eligiblePatients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No patients ready to send</p>
            <p className="text-xs text-gray-400 mt-1">
              Patients need vitals recorded before they can be sent to cashier
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vitals Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {eligiblePatients.map((patient) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[#6C2BD9]">#{patient.queueNumber}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{patient.patientName}</p>
                        <p className="text-xs text-gray-400">{patient.entryId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{patient.entryTime}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Vitals Completed
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleSendToCashier(patient.patientEntryId)}
                        disabled={actionLoading === patient.patientEntryId}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                      >
                        <SendHorizontal className="w-3.5 h-3.5" />
                        {actionLoading === patient.patientEntryId ? 'Sending...' : 'Send to Cashier'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Already Sent */}
      {alreadySent.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Already at Cashier
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {alreadySent.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alreadySent.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-bold text-[#6C2BD9]">#{patient.queueNumber}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">{patient.patientName}</td>
                    <td className="px-5 py-3">
                      {patient.paymentCompleted ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold border border-amber-200">
                        SENT TO CASHIER
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendToCashier;
