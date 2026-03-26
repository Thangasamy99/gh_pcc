import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Thermometer,
  Wind,
  Droplets,
  Weight,
  Ruler,
  Activity,
  Eye,
  Loader2,
  AlertTriangle,
  X,
  Save,
  Clock,
  Check,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { PatientEntry, PatientVitals, VitalsForm } from '../../types/reception';
import toast from 'react-hot-toast';

const RecordVitals: React.FC = () => {
  const [waitingQueue, setWaitingQueue] = useState<PatientEntry[]>([]);
  const [todayVitals, setTodayVitals] = useState<PatientVitals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientEntry | null>(null);
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);
  const [viewVitalsDialogOpen, setViewVitalsDialogOpen] = useState(false);
  const [recordingVitals, setRecordingVitals] = useState(false);
  const [selectedVitals, setSelectedVitals] = useState<PatientVitals | null>(null);

  const [vitalsForm, setVitalsForm] = useState<VitalsForm>({
    patientEntryId: 0,
    triageStatus: 'NORMAL',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [queueData, vitalsData] = await Promise.all([
        receptionService.getWaitingQueue(),
        receptionService.getTodayVitals(),
      ]);

      const patientDetails = await Promise.all(
        queueData.map(async (queue) => {
          const patient = await receptionService.getPatientEntry(queue.patientEntryId);
          return patient;
        })
      );

      setWaitingQueue(patientDetails);
      setTodayVitals(vitalsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVitals = async () => {
    if (!selectedPatient) return;
    try {
      setRecordingVitals(true);
      const vitalsData = { ...vitalsForm, patientEntryId: selectedPatient.id };
      await receptionService.recordVitals(vitalsData);
      setVitalsDialogOpen(false);
      setSelectedPatient(null);
      setVitalsForm({ patientEntryId: 0, triageStatus: 'NORMAL' });
      toast.success('Vitals recorded successfully!');
      fetchData();
    } catch (err) {
      toast.error('Failed to record vitals');
      console.error('Error:', err);
    } finally {
      setRecordingVitals(false);
    }
  };

  const openVitalsDialog = (patient: PatientEntry) => {
    setSelectedPatient(patient);
    setVitalsForm({ ...vitalsForm, patientEntryId: patient.id });
    setVitalsDialogOpen(true);
  };

  const openViewVitalsDialog = async (patient: PatientEntry) => {
    try {
      const vitals = await receptionService.getPatientVitals(patient.id);
      setSelectedVitals(vitals);
      setSelectedPatient(patient);
      setViewVitalsDialogOpen(true);
    } catch (err) {
      toast.error('Vitals not recorded for this patient');
    }
  };

  const getTriageBadge = (status: string) => {
    const styles: Record<string, string> = {
      EMERGENCY: 'bg-red-100 text-red-700 border-red-200',
      URGENT: 'bg-amber-100 text-amber-700 border-amber-200',
      NORMAL: 'bg-green-100 text-green-700 border-green-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading vitals data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HeartPulse className="w-7 h-7 text-[#6C2BD9]" />
          Record Vitals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Record vital signs for patients in queue before sending to cashier
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Queue */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Waiting Queue
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                  {waitingQueue.length}
                </span>
              </h2>
            </div>

            {waitingQueue.length === 0 ? (
              <div className="p-12 text-center">
                <HeartPulse className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No patients waiting for vitals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Age / Gender
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Visit Type
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Queue Time
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {waitingQueue.map((patient) => (
                      <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-5 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{patient.patientName}</p>
                            <p className="text-xs text-gray-400">{patient.entryId}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {patient.age}y / {patient.gender}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              patient.visitType === 'EMERGENCY'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}
                          >
                            {patient.visitType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{patient.entryTime}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openVitalsDialog(patient)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6C2BD9] text-white rounded-lg text-xs font-semibold hover:bg-[#5b24b8] transition-all"
                            >
                              <HeartPulse className="w-3.5 h-3.5" />
                              Record
                            </button>
                            <button
                              onClick={() => openViewVitalsDialog(patient)}
                              className="p-1.5 text-gray-400 hover:text-[#6C2BD9] hover:bg-purple-50 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Today's Vitals Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Today's Vitals
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                {todayVitals.length}
              </span>
            </h2>
          </div>

          {todayVitals.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No vitals recorded today</p>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {todayVitals.slice(0, 10).map((vitals) => (
                <div
                  key={vitals.id}
                  className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{vitals.patientName}</p>
                      <p className="text-xs text-gray-400">{vitals.entryId}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTriageBadge(
                        vitals.triageStatus
                      )}`}
                    >
                      {vitals.triageStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>BP: {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</span>
                    <span>•</span>
                    <span>Temp: {vitals.temperatureCelsius}°C</span>
                    <span>•</span>
                    <span>Pulse: {vitals.pulseRateBpm}</span>
                  </div>
                </div>
              ))}
              {todayVitals.length > 10 && (
                <p className="text-xs text-gray-400 text-center">
                  +{todayVitals.length - 10} more...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Vitals Modal */}
      <AnimatePresence>
        {vitalsDialogOpen && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setVitalsDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] px-6 py-5 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Record Vitals</h2>
                  <p className="text-xs text-white/70">{selectedPatient.patientName}</p>
                </div>
                <button
                  onClick={() => setVitalsDialogOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <VitalsInput
                    icon={<Weight className="w-4 h-4" />}
                    label="Weight (kg)"
                    value={vitalsForm.weightKg || ''}
                    onChange={(v) => setVitalsForm({ ...vitalsForm, weightKg: parseFloat(v) || undefined })}
                  />
                  <VitalsInput
                    icon={<Ruler className="w-4 h-4" />}
                    label="Height (cm)"
                    value={vitalsForm.heightCm || ''}
                    onChange={(v) => setVitalsForm({ ...vitalsForm, heightCm: parseFloat(v) || undefined })}
                  />
                  <VitalsInput
                    icon={<Thermometer className="w-4 h-4" />}
                    label="Temperature (°C)"
                    value={vitalsForm.temperatureCelsius || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, temperatureCelsius: parseFloat(v) || undefined })
                    }
                  />
                  <VitalsInput
                    icon={<HeartPulse className="w-4 h-4" />}
                    label="Pulse Rate (bpm)"
                    value={vitalsForm.pulseRateBpm || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, pulseRateBpm: parseInt(v) || undefined })
                    }
                  />
                  <VitalsInput
                    icon={<Activity className="w-4 h-4" />}
                    label="BP Systolic"
                    value={vitalsForm.bloodPressureSystolic || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, bloodPressureSystolic: parseInt(v) || undefined })
                    }
                  />
                  <VitalsInput
                    icon={<Activity className="w-4 h-4" />}
                    label="BP Diastolic"
                    value={vitalsForm.bloodPressureDiastolic || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, bloodPressureDiastolic: parseInt(v) || undefined })
                    }
                  />
                  <VitalsInput
                    icon={<Wind className="w-4 h-4" />}
                    label="Respiration Rate"
                    value={vitalsForm.respirationRate || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, respirationRate: parseInt(v) || undefined })
                    }
                  />
                  <VitalsInput
                    icon={<Droplets className="w-4 h-4" />}
                    label="Oxygen Saturation (%)"
                    value={vitalsForm.oxygenSaturation || ''}
                    onChange={(v) =>
                      setVitalsForm({ ...vitalsForm, oxygenSaturation: parseInt(v) || undefined })
                    }
                  />
                </div>

                {/* Triage Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Triage Status
                  </label>
                  <div className="flex gap-3">
                    {(['NORMAL', 'URGENT', 'EMERGENCY'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setVitalsForm({ ...vitalsForm, triageStatus: status })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                          vitalsForm.triageStatus === status
                            ? status === 'NORMAL'
                              ? 'bg-green-500 text-white border-green-500 shadow-lg'
                              : status === 'URGENT'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-lg'
                              : 'bg-red-500 text-white border-red-500 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={vitalsForm.notes || ''}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#6C2BD9]/30 focus:border-[#6C2BD9]/30 outline-none transition-all resize-none"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setVitalsDialogOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordVitals}
                  disabled={recordingVitals}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#6C2BD9] text-white rounded-xl text-sm font-semibold hover:bg-[#5b24b8] transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {recordingVitals ? 'Saving...' : 'Save Vitals'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Vitals Modal */}
      <AnimatePresence>
        {viewVitalsDialogOpen && selectedVitals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setViewVitalsDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  Vitals - {selectedPatient?.patientName}
                </h2>
                <button
                  onClick={() => setViewVitalsDialogOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <VitalDisplay label="Weight" value={`${selectedVitals.weightKg} kg`} />
                <VitalDisplay label="Height" value={`${selectedVitals.heightCm} cm`} />
                <VitalDisplay label="Temperature" value={`${selectedVitals.temperatureCelsius}°C`} />
                <VitalDisplay label="Pulse Rate" value={`${selectedVitals.pulseRateBpm} bpm`} />
                <VitalDisplay
                  label="Blood Pressure"
                  value={`${selectedVitals.bloodPressureSystolic}/${selectedVitals.bloodPressureDiastolic}`}
                />
                <VitalDisplay label="Respiration" value={`${selectedVitals.respirationRate}`} />
                <VitalDisplay label="O₂ Saturation" value={`${selectedVitals.oxygenSaturation}%`} />
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase">Triage</p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTriageBadge(
                      selectedVitals.triageStatus
                    )}`}
                  >
                    {selectedVitals.triageStatus}
                  </span>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setViewVitalsDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VitalsInput: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
}> = ({ icon, label, value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#6C2BD9]/30 focus-within:border-[#6C2BD9]/30 transition-all">
      <span className="text-gray-400">{icon}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-sm"
        placeholder="0"
      />
    </div>
  </div>
);

const VitalDisplay: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold text-gray-400 uppercase">{label}</p>
    <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
  </div>
);

export default RecordVitals;
