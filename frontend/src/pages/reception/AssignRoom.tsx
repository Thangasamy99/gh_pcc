import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DoorOpen,
  Loader2,
  AlertTriangle,
  RefreshCw,
  X,
  Stethoscope,
  CheckCircle2,
  Clock,
  CreditCard,
  Users,
  Send,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { doctorService, DoctorDTO } from '../../services/doctorService';
import { ReceptionQueue } from '../../types/reception';
import toast from 'react-hot-toast';

const consultationRooms = [
  { room: 'Room 1', category: 'General Medicine', icon: '🩺' },
  { room: 'Room 2', category: 'Surgery/Orthopedic', icon: '🔬' },
  { room: 'Room 3', category: 'Pediatrics', icon: '👶' },
  { room: 'Room 4', category: 'Gynecology', icon: '🏥' },
  { room: 'Room 5', category: 'Dental', icon: '🦷' },
];

const AssignRoom: React.FC = () => {
  const [queue, setQueue] = useState<ReceptionQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<ReceptionQueue | null>(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState<DoctorDTO[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchDoctorsForRoom(selectedRoom);
    } else {
      setAvailableDoctors([]);
      setSelectedDoctorId(null);
    }
  }, [selectedRoom]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getTodayQueue();
      setQueue(data);
      setError(null);
    } catch (err) {
      setError('Failed to load queue');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsForRoom = async (room: string) => {
    try {
      setFetchingDoctors(true);
      const doctors = await doctorService.getAvailableByRoom(room);
      setAvailableDoctors(doctors);
      if (doctors.length > 0) {
        // Automatically select the first available doctor if none selected
        // setSelectedDoctorId(doctors[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      toast.error('Could not load available doctors');
    } finally {
      setFetchingDoctors(false);
    }
  };

  const handleAssignRoom = async () => {
    if (!selectedPatient || !selectedRoom) return;
    try {
      setActionLoading(true);
      await receptionService.assignConsultationRoom(
        selectedPatient.patientEntryId, 
        selectedRoom, 
        selectedDoctorId || undefined
      );
      toast.success(`${selectedRoom} assigned to ${selectedPatient.patientName}!`);
      setDialogOpen(false);
      setSelectedPatient(null);
      setSelectedRoom('');
      setSelectedDoctorId(null);
      fetchQueue();
    } catch (err) {
      toast.error('Failed to assign room');
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
      fetchQueue();
    } catch (err) {
      toast.error('Failed to send to doctor');
      console.error('Error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Patients who have paid but no room assigned yet
  const eligibleForRoom = queue.filter((q) => q.paymentCompleted && !q.consultationRoom);
  // Patients who have room assigned but not sent to doctor
  const readyForDoctor = queue.filter((q) => q.consultationRoom && !q.sentToDoctor);
  // Already sent to doctor
  const withDoctor = queue.filter((q) => q.sentToDoctor);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium italic">Synchronizing Medical Queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-transparent">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#6C2BD9] to-[#9333EA] rounded-xl shadow-lg shadow-purple-200">
                <DoorOpen className="w-8 h-8 text-white" />
            </div>
            Clinical Distribution
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Post-payment resource allocation and specialist assignment
          </p>
        </motion.div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 px-6 py-3 bg-white text-[#6C2BD9] border-2 border-[#6C2BD9]/10 rounded-2xl text-sm font-black hover:bg-purple-50 transition-all shadow-xl shadow-purple-100/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Update Queue
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 flex items-center gap-3 animate-shake">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <p className="text-rose-700 text-sm font-bold">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-rose-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Rule Banner */}
      <div className="bg-gradient-to-r from-[#6C2BD9]/5 to-transparent border border-[#6C2BD9]/10 rounded-[2rem] p-6 flex items-center gap-6 backdrop-blur-sm">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-purple-100">
          <CreditCard className="w-7 h-7 text-[#6C2BD9]" />
        </div>
        <div>
          <p className="text-base font-black text-gray-800 tracking-tight">Voucher Verification Protocol</p>
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-2xl mt-1">
            System requires confirmed digital receipt for each patient before unlocking unit assignment. 
            TEMP-ID will be automatically transitioned to PCC-FINAL identification upon room confirmation.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Assignment Section */}
        <div className="space-y-6">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center px-2">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Authorized for Unit Assignment
                <span className="ml-auto bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px]">
                    {eligibleForRoom.length} Pending
                </span>
            </h2>

            {eligibleForRoom.length === 0 ? (
                <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center group transition-all hover:bg-white hover:border-[#6C2BD9]/20">
                    <Users className="w-16 h-16 text-gray-200 mx-auto mb-4 group-hover:text-[#6C2BD9]/40 transition-colors" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Awaiting Cleared Patients</p>
                    <p className="text-[10px] text-gray-300 mt-2 italic font-medium">Assignment portal will populate upon cashier confirmation</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {eligibleForRoom.map((patient) => (
                        <motion.div 
                            key={patient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-100 border border-gray-50 hover:shadow-2xl hover:shadow-purple-100 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C2BD9]/5 -mr-12 -mt-12 rounded-full transition-all group-hover:scale-150" />
                            
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#6C2BD9] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                                        <span className="text-white font-black text-xl">#{patient.queueNumber}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight">{patient.patientName}</h3>
                                        <p className="text-xs font-bold text-[#6C2BD9] mt-1 uppercase tracking-widest flex items-center italic">
                                            <CreditCard className="w-3 h-3 mr-1" /> Payment Verified
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedPatient(patient);
                                        setSelectedRoom('');
                                        setSelectedDoctorId(null);
                                        setDialogOpen(true);
                                    }}
                                    className="p-4 bg-gray-50 text-[#6C2BD9] rounded-2xl hover:bg-[#6C2BD9] hover:text-white transition-all shadow-inner group-hover:shadow-lg"
                                >
                                    <DoorOpen className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    patient.visitType === 'EMERGENCY' ? 'bg-rose-50 text-rose-500' : 'bg-purple-50 text-[#6C2BD9]'
                                }`}>
                                    {patient.visitType?.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold font-mono">
                                    ENTRY_ID: {patient.entryId}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

        {/* Ready for Doctor & Active Section */}
        <div className="space-y-8">
            {/* Transitioning to Doctor */}
            <div className="space-y-6">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center px-2">
                    <Stethoscope className="w-4 h-4 mr-2 text-[#6C2BD9]" /> Assigned & Ready
                </h2>

                {readyForDoctor.length === 0 ? (
                    <div className="bg-gray-50/50 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-gray-200">
                        <p className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">No Unit Assignments Pending Handover</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {readyForDoctor.map((patient) => (
                            <motion.div 
                                key={patient.id}
                                className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-5 shadow-lg border border-white flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                        #{patient.queueNumber}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800">{patient.patientName}</p>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-tighter">
                                                {patient.consultationRoom}
                                            </span>
                                            {patient.assignedDoctorName && (
                                              <span className="text-[10px] font-bold text-gray-500 italic">
                                                {patient.assignedDoctorName}
                                              </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSendToDoctor(patient.patientEntryId)}
                                    disabled={actionLoading}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Final Handover
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Currently Active Sessions */}
            <div className="space-y-6 pt-4">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center px-2">
                    <UserCheck className="w-4 h-4 mr-2 text-emerald-500" /> Engaged Sessions
                </h2>
                
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 overflow-hidden border border-gray-50">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Unit</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {withDoctor.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">All units currently idle</p>
                                    </td>
                                </tr>
                            ) : (
                                withDoctor.map(patient => (
                                    <tr key={patient.id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black text-gray-800">{patient.patientName}</p>
                                            <p className="text-[9px] font-bold text-gray-400">#Q{patient.queueNumber}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-[#6C2BD9]">{patient.consultationRoom}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-emerald-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-tighter italic">In Consultation</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {/* Assign Room Modal - Premium Glassmorphism */}
      <AnimatePresence>
        {dialogOpen && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(108,43,217,0.3)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6C2BD9] via-[#8B45FF] to-[#9333EA] px-10 py-8 relative">
                <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-[-30deg] translate-x-20" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white leading-none">Unit Assignment</h2>
                    <p className="text-sm text-white/70 mt-2 font-bold tracking-wide uppercase italic">
                        {selectedPatient.patientName} <span className="mx-2 opacity-50">|</span> Queue #{selectedPatient.queueNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setDialogOpen(false)}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all group"
                  >
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Two Column */}
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Column 1: Room Selection */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-[#6C2BD9] uppercase tracking-[0.3em] flex items-center">
                    <DoorOpen className="w-4 h-4 mr-2" /> 1. Select Medical Unit
                  </h3>
                  <div className="space-y-3">
                    {consultationRooms.map((room) => (
                      <button
                        key={room.room}
                        onClick={() => setSelectedRoom(room.room)}
                        className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all relative group ${
                          selectedRoom === room.room
                            ? 'border-[#6C2BD9] bg-white shadow-2xl shadow-purple-200'
                            : 'border-gray-100 bg-gray-50/50 hover:border-[#6C2BD9]/30 hover:bg-white'
                        }`}
                      >
                        <div className={`text-3xl p-3 rounded-2xl transition-all ${
                            selectedRoom === room.room ? 'bg-purple-100' : 'bg-white'
                        }`}>
                            {room.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-base font-black leading-tight ${selectedRoom === room.room ? 'text-[#6C2BD9]' : 'text-gray-800'}`}>
                              {room.room}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{room.category}</p>
                        </div>
                        {selectedRoom === room.room && (
                          <motion.div layoutId="selection-mark" className="ml-auto w-8 h-8 bg-[#6C2BD9] rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                        <ChevronRight className={`ml-auto w-5 h-5 transition-all ${selectedRoom === room.room ? 'opacity-0' : 'text-gray-200 opacity-100 group-hover:translate-x-1'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Doctor Selection */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-[#6C2BD9] uppercase tracking-[0.3em] flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2" /> 2. Assign Available Professional
                  </h3>
                  
                  {!selectedRoom ? (
                    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 p-10 text-center">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-4">
                            <Stethoscope className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Select medical unit first to fetch available specialists</p>
                    </div>
                  ) : fetchingDoctors ? (
                    <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-purple-100 border-t-[#6C2BD9] rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] animate-pulse">Syncing Active Professionals...</p>
                    </div>
                  ) : availableDoctors.length === 0 ? (
                    <div className="h-[400px] flex flex-col items-center justify-center border-2 border-rose-100 rounded-[2rem] bg-rose-50/30 p-10 text-center">
                        <AlertTriangle className="w-12 h-12 text-rose-300 mb-4" />
                        <p className="text-xs font-black text-rose-500 uppercase tracking-widest">No Professionals Available</p>
                        <p className="text-[10px] text-rose-400 mt-2 italic font-medium">All specialists in this unit are currently engaged or offline.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableDoctors.map((doctor) => (
                            <button
                                key={doctor.id}
                                onClick={() => setSelectedDoctorId(doctor.id || null)}
                                className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all relative ${
                                    selectedDoctorId === doctor.id
                                    ? 'border-[#6C2BD9] bg-[#6C2BD9]/5 shadow-xl'
                                    : 'border-gray-50 bg-white hover:border-gray-200'
                                }`}
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400">
                                    {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-black text-gray-800 leading-tight">Dr. {doctor.firstName} {doctor.lastName}</p>
                                    <p className="text-[9px] font-bold text-[#6C2BD9] uppercase tracking-widest mt-0.5 italic">{doctor.specialization}</p>
                                </div>
                                {selectedDoctorId === doctor.id && (
                                    <div className="w-8 h-8 bg-[#6C2BD9] rounded-xl flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-xl">
                <button
                  onClick={() => setDialogOpen(false)}
                  className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
                >
                  Abort Protocol
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleAssignRoom}
                        disabled={!selectedRoom || actionLoading}
                        className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#6C2BD9] to-[#8B45FF] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] hover:shadow-[0_20px_40px_-10px_rgba(108,43,217,0.4)] transition-all shadow-xl shadow-purple-100 transform active:scale-95 disabled:opacity-30"
                    >
                        {actionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-4 h-4" />
                        )}
                        {selectedDoctorId ? 'Confirm Unit & specialist' : 'Assign Unit Only'}
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignRoom;
