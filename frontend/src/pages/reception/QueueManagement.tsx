import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ListOrdered,
  Clock,
  CreditCard,
  Stethoscope,
  HeartPulse,
  CheckCircle2,
  Send,
  DoorOpen,
  Eye,
  RefreshCw,
  Loader2,
  AlertTriangle,
  X,
  Users,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { ReceptionQueue } from '../../types/reception';
import toast from 'react-hot-toast';

const QueueManagement: React.FC = () => {
  const [waitingQueue, setWaitingQueue] = useState<ReceptionQueue[]>([]);
  const [todayQueue, setTodayQueue] = useState<ReceptionQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      const [waitingData, todayData] = await Promise.all([
        receptionService.getWaitingQueue(),
        receptionService.getTodayQueue(),
      ]);
      setWaitingQueue(waitingData);
      setTodayQueue(todayData);
      setError(null);
    } catch (err) {
      setError('Failed to load queue data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToCashier = async (patientEntryId: number) => {
    try {
      setActionLoading(true);
      await receptionService.sendToCashier(patientEntryId);
      toast.success('Patient sent to cashier!');
      fetchQueueData();
    } catch (err) {
      toast.error('Failed to send patient to cashier');
      console.error('Error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToDoctor = async (patientEntryId: number) => {
    try {
      setActionLoading(true);
      await receptionService.sendToDoctor(patientEntryId);
      toast.success('Patient sent to doctor!');
      fetchQueueData();
    } catch (err) {
      toast.error('Failed to send patient to doctor');
      console.error('Error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      WAITING: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
      VITALS_COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      SENT_TO_CASHIER: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
      PAYMENT_COMPLETED: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      ASSIGNED_ROOM: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
      SENT_TO_DOCTOR: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    };
    const style = styles[status] || styles.WAITING;
    return `${style.bg} ${style.text} ${style.border}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading queue...</p>
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
            <ListOrdered className="w-7 h-7 text-[#6C2BD9]" />
            Queue Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage patient flow: Reception → Vitals → Cashier → Doctor
          </p>
        </div>
        <button
          onClick={fetchQueueData}
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

      {/* Active Waiting Queue */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Active Waiting Queue
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
              {waitingQueue.length}
            </span>
          </h2>
        </div>

        {waitingQueue.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No patients in waiting queue</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Queue #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entry Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vitals
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {waitingQueue.map((queue) => (
                  <tr key={queue.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-[#6C2BD9]">#{queue.queueNumber}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{queue.patientName}</p>
                        <p className="text-xs text-gray-400">{queue.entryId}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-500">
                        {queue.queueTime
                          ? new Date(queue.queueTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : queue.entryTime}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {queue.vitalsCompleted ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {queue.paymentCompleted ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Paid
                        </span>
                      ) : queue.sentToCashier ? (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                          <CreditCard className="w-3.5 h-3.5" />
                          At Cashier
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          queue.queueStatus
                        )}`}
                      >
                        {queue.queueStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {/* Send to Cashier: Only if vitals completed AND not yet sent */}
                        {queue.vitalsCompleted && !queue.sentToCashier && (
                          <button
                            onClick={() => handleSendToCashier(queue.patientEntryId)}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            To Cashier
                          </button>
                        )}
                        {/* Send to Doctor: Only if payment completed AND has room */}
                        {queue.consultationRoom && !queue.sentToDoctor && (
                          <button
                            onClick={() => handleSendToDoctor(queue.patientEntryId)}
                            disabled={actionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            To Doctor
                          </button>
                        )}
                        {queue.sentToDoctor && (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                            ✓ With Doctor
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Queue Today */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6C2BD9]" />
            Today's Full Queue
            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
              {todayQueue.length}
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Visit
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vitals
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {todayQueue.map((queue) => (
                <tr key={queue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-[#6C2BD9]">#{queue.queueNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{queue.patientName}</p>
                    <p className="text-[10px] text-gray-400">{queue.entryId}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {queue.age}y / {queue.gender}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        queue.visitType === 'EMERGENCY'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {queue.visitType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {queue.vitalsCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {queue.sentToCashier ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {queue.paymentCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {queue.consultationRoom ? (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold border border-indigo-200">
                        {queue.consultationRoom}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {queue.sentToDoctor ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        queue.queueStatus
                      )}`}
                    >
                      {queue.queueStatus?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
