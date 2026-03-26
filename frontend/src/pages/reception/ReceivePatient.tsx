import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Phone,
  Clock,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  Loader2,
  User,
  MapPin,
  FileText,
  X,
  Stethoscope,
  Shield,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { PatientEntry } from '../../types/reception';
import toast from 'react-hot-toast';

const ReceivePatient: React.FC = () => {
  const [pendingPatients, setPendingPatients] = useState<PatientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addingToQueue, setAddingToQueue] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingPatients();
  }, []);

  const fetchPendingPatients = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getPendingPatients();
      setPendingPatients(data);
      setError(null);
    } catch (err) {
      setError('Failed to load pending patients');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = async (patient: PatientEntry) => {
    try {
      setAddingToQueue(true);
      await receptionService.addToQueue(patient.id);
      setPendingPatients((prev) => prev.filter((p) => p.id !== patient.id));
      setDialogOpen(false);
      setSelectedPatient(null);
      toast.success(`${patient.patientName} added to queue successfully!`);
    } catch (err) {
      toast.error('Failed to add patient to queue');
      console.error('Error:', err);
    } finally {
      setAddingToQueue(false);
    }
  };

  const getVisitTypeBadge = (visitType: string) => {
    const styles: Record<string, string> = {
      CONSULTATION: 'bg-blue-100 text-blue-700 border-blue-200',
      FOLLOW_UP: 'bg-green-100 text-green-700 border-green-200',
      EMERGENCY: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[visitType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filtered = pendingPatients.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.entryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phoneNumber.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading patients...</p>
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
            <UserPlus className="w-7 h-7 text-[#6C2BD9]" />
            Receive Patient
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Patients from security module waiting for reception processing
          </p>
        </div>
        <button
          onClick={fetchPendingPatients}
          className="flex items-center gap-2 px-4 py-2 bg-[#6C2BD9] text-white rounded-xl text-sm font-medium hover:bg-[#5b24b8] transition-all shadow-lg shadow-purple-200"
        >
          Refresh List
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#6C2BD9]/30 focus-within:border-[#6C2BD9]/30 transition-all max-w-md">
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-purple-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No Pending Patients</h3>
          <p className="text-sm text-gray-400 mt-2">
            All patients from security have been processed. Check back later.
          </p>
        </div>
      ) : (
        /* Patient Table */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entry ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Age / Gender
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Visit Type
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entry Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((patient, idx) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[#6C2BD9]">{patient.entryId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-600">
                            {patient.patientName?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {patient.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {patient.age}y / {patient.gender}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5" />
                        {patient.phoneNumber}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getVisitTypeBadge(
                          patient.visitType
                        )}`}
                      >
                        {patient.visitType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{patient.department}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {patient.entryTime}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {patient.isEmergency ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          Emergency
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToQueue(patient)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6C2BD9] text-white rounded-lg text-xs font-semibold hover:bg-[#5b24b8] transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Queue
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setDialogOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#6C2BD9] hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      <AnimatePresence>
        {dialogOpen && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#6C2BD9] to-[#9333EA] px-6 py-5 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Patient Details</h2>
                    <p className="text-xs text-white/70">{selectedPatient.entryId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Read-only Patient Info (from Security) */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      From Security Module (Read-Only)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Entry ID" value={selectedPatient.entryId} />
                    <InfoField label="Full Name" value={selectedPatient.patientName} />
                    <InfoField label="Age / Gender" value={`${selectedPatient.age} years / ${selectedPatient.gender}`} />
                    <InfoField label="Phone" value={selectedPatient.phoneNumber} />
                    <InfoField label="Address" value={`${selectedPatient.address}, ${selectedPatient.city}`} />
                    <InfoField label="Visit Type" value={selectedPatient.visitType?.replace('_', ' ')} />
                    <InfoField label="Department" value={selectedPatient.department} />
                    <InfoField label="Purpose" value={selectedPatient.purposeOfVisit || 'N/A'} />
                    {selectedPatient.knownIllness && (
                      <InfoField label="Known Illness" value={selectedPatient.knownIllness} />
                    )}
                    {selectedPatient.allergy && (
                      <InfoField label="Allergies" value={selectedPatient.allergy} />
                    )}
                    <InfoField
                      label="Insurance"
                      value={selectedPatient.hasInsurance ? '✅ Has Insurance' : '❌ No Insurance'}
                    />
                    <InfoField label="Remarks" value={selectedPatient.remarks || 'No remarks'} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAddToQueue(selectedPatient)}
                  disabled={addingToQueue}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#6C2BD9] text-white rounded-xl text-sm font-semibold hover:bg-[#5b24b8] transition-all shadow-lg shadow-purple-200 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingToQueue ? 'Adding...' : 'Add to Queue'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
  </div>
);

export default ReceivePatient;
