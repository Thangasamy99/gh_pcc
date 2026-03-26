import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Stethoscope,
  ClipboardList,
  Thermometer,
  Activity,
  ChevronRight,
  FlaskConical,
  Beaker,
  Image as ImageIcon,
  Pill,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  User,
  History,
  FileText,
  Loader2,
  RefreshCw,
  Power
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { consultationService } from '../../services/consultationService';
import { doctorService } from '../../services/doctorService';
import { ReceptionQueue } from '../../types/reception';
import { Consultation, CreateConsultationRequest } from '../../types/consultation';
import toast from 'react-hot-toast';

const DoctorDashboard: React.FC = () => {
  const [queue, setQueue] = useState<ReceptionQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePatient, setActivePatient] = useState<ReceptionQueue | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'diagnosis' | 'requests' | 'prescription'>('notes');
  const [doctorStatus, setDoctorStatus] = useState<'AVAILABLE' | 'BUSY' | 'OFFLINE'>('AVAILABLE');
  const [saving, setSaving] = useState(false);

  // Form States
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [labRequest, setLabRequest] = useState('');
  const [imagingRequest, setImagingRequest] = useState('');

  useEffect(() => {
    fetchQueue();
    // In a real app, we would fetch the doctor's current status from auth context or an API
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      // Fetch patients assigned to this specific doctor
      // In a real scenario, we'd filter by doctorId from auth
      const data = await receptionService.getTodayQueue();
      // For demo, we'll show all patients who are SENT_TO_DOCTOR or ASSIGNED_ROOM
      setQueue(data.filter(p => p.queueStatus === 'SENT_TO_DOCTOR' || p.queueStatus === 'ASSIGNED_ROOM'));
    } catch (err) {
      toast.error('Failed to sync clinical queue');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const nextStatus = doctorStatus === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
    try {
      // await doctorService.updateStatus(nextStatus); // To be implemented
      setDoctorStatus(nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleStartConsultation = (patient: ReceptionQueue) => {
    setActivePatient(patient);
    setSymptoms('');
    setClinicalNotes('');
    setDiagnosis('');
    setPrescription('');
    setLabRequest('');
    setImagingRequest('');
    setActiveTab('notes');
  };

  const handleSubmitConsultation = async () => {
    if (!activePatient) return;
    
    try {
      setSaving(true);
      const request: CreateConsultationRequest = {
        patientId: activePatient.patientEntryId, // Assuming this maps correctly
        doctorId: 1, // Current Doctor ID
        branchId: activePatient.branchId,
        symptoms,
        clinicalNotes,
        diagnosis,
        prescription,
        labRequestStatus: labRequest ? 'PENDING' : undefined,
        imagingRequestStatus: imagingRequest ? 'PENDING' : undefined,
      };

      await consultationService.createConsultation(request);
      toast.success('Consultation session finalized successfully');
      setActivePatient(null);
      fetchQueue();
    } catch (err) {
      toast.error('Error finalizing consultation');
    } finally {
      setSaving(false);
    }
  };

  if (loading && queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-[#6C2BD9] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-[#6C2BD9]" />
          </div>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Clinical Environment...</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-[#FDFCFE] space-y-8">
      
      {/* HUD Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-purple-100 border border-purple-50">
              <Activity className="w-8 h-8 text-[#6C2BD9]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clinical Operations</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Session
                </span>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-widest italic font-mono">DRX-PCC-091</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
            doctorStatus === 'AVAILABLE' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-emerald-100/30' 
              : 'bg-rose-50 border-rose-100 text-rose-700 shadow-rose-100/30'
          }`}
          onClick={toggleStatus}
          >
            <Power className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{doctorStatus}</span>
          </div>

          <button 
            onClick={fetchQueue}
            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100 text-gray-400 hover:text-[#6C2BD9] transition-all hover:border-purple-100"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Left Peripheral: Queue Console */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100/40 p-8 border border-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C2BD9]/5 -mr-16 -mt-16 rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                <ClipboardList className="w-4 h-4 text-[#6C2BD9]" /> Triage Queue
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {queue.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Sector Clear</p>
                  </div>
                ) : (
                  queue.map((patient) => (
                    <motion.div 
                      key={patient.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer group relative overflow-hidden ${
                        activePatient?.id === patient.id
                          ? 'bg-[#6C2BD9]/5 border-[#6C2BD9] shadow-xl shadow-purple-100'
                          : 'bg-gray-50/50 border-transparent hover:border-purple-100 hover:bg-white'
                      }`}
                      onClick={() => handleStartConsultation(patient)}
                    >
                      <div className="flex items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                            activePatient?.id === patient.id ? 'bg-[#6C2BD9] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                          }`}>
                            {patient.queueNumber}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800 tracking-tight">{patient.patientName}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 italic">
                              <User className="w-3 h-3 text-[#6C2BD9]" /> {patient.gender} • {patient.age}Y
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${activePatient?.id === patient.id ? 'text-[#6C2BD9] rotate-90' : 'text-gray-200 group-hover:translate-x-1'}`} />
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100/50 pt-3 opacity-60 group-hover:opacity-100">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                          patient.visitType === 'EMERGENCY' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {patient.visitType}
                        </span>
                        <span className="text-[9px] font-bold font-mono text-gray-400 italic">{patient.entryId}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Clinical Workstation */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {!activePatient ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-purple-100 h-[700px] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-purple-100 mb-8 border border-purple-50">
                  <Stethoscope className="w-12 h-12 text-[#6C2BD9] animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest tracking-[0.3em]">Workstation Idle</h3>
                <p className="text-sm text-gray-500 max-w-sm mt-4 font-medium italic">
                  Select a candidate from the clinical distribution console to initialize the medical session.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(108,43,217,0.1)] border border-white overflow-hidden flex flex-col min-h-[750px]"
              >
                {/* Workspace Header */}
                <div className="bg-gradient-to-r from-[#6C2BD9] via-[#8B45FF] to-[#9333EA] px-10 py-8 relative">
                  <div className="absolute top-0 right-0 w-64 h-full bg-white/10 skew-x-[-30deg] translate-x-20" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-black text-2xl">
                        {activePatient.patientName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white leading-tight">{activePatient.patientName}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-widest italic">{activePatient.entryId}</span>
                          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                          <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">{activePatient.gender} • {activePatient.age}Y</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20 text-white flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-black uppercase tracking-widest">Session: 04:32</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="px-10 py-6 border-b border-gray-50 flex items-center gap-8">
                  {[
                    { id: 'notes', label: 'History & Notes', icon: FileText },
                    { id: 'diagnosis', label: 'Clinical Diagnosis', icon: Activity },
                    { id: 'requests', label: 'Medical Requests', icon: FlaskConical },
                    { id: 'prescription', label: 'Pharmacy Order', icon: Pill },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 pb-2 relative transition-all group ${
                        activeTab === tab.id ? 'text-[#6C2BD9]' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#6C2BD9]' : 'text-gray-300'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div layoutId="tab-underline" className="absolute -bottom-1 left-0 right-0 h-1 bg-[#6C2BD9] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeTab === 'notes' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-widest flex items-center gap-2">
                              <Thermometer className="w-3 h-3" /> Vitals Handover
                            </label>
                            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100/50 flex flex-wrap gap-4">
                              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">BP Systolic</p>
                                <p className="text-sm font-black text-gray-800">120 <small className="text-[10px]">mmHg</small></p>
                              </div>
                              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Heart Rate</p>
                                <p className="text-sm font-black text-gray-800 text-rose-500">88 <small className="text-[10px]">bpm</small></p>
                              </div>
                              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Temp</p>
                                <p className="text-sm font-black text-gray-800">37.2 <small className="text-[10px]">°C</small></p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-widest flex items-center gap-2">
                              <History className="w-3 h-3" /> Prior Visits
                            </label>
                            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100/50">
                                <p className="text-[10px] text-gray-400 font-bold italic">No identified medical history in this sector.</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-widest tracking-[0.2em] flex items-center gap-2">
                             Systemic Symptoms & Presentation
                          </label>
                          <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Document patient presenting symptoms, duration, and severity..."
                            className="w-full h-32 bg-[#F9FAFB] border-2 border-transparent focus:border-[#6C2BD9]/30 focus:bg-white rounded-[2rem] p-6 text-sm font-medium transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-widest tracking-[0.2em] flex items-center gap-2 text-indigo-500">
                             Medical History / Physician's Clinical Narrative
                          </label>
                          <textarea
                            value={clinicalNotes}
                            onChange={(e) => setClinicalNotes(e.target.value)}
                            placeholder="Physician's findings, systemic review, and relevant background details..."
                            className="w-full h-40 bg-[#EEF2FF]/30 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] p-6 text-sm font-medium transition-all outline-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'diagnosis' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                         <div className="bg-indigo-50/50 rounded-[2.5rem] p-10 border border-indigo-100/50">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-indigo-500">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-800">Final Diagnostic Impression</h4>
                                    <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest italic">Confirmed or Differential Diagnosis</p>
                                </div>
                            </div>
                            <textarea
                              value={diagnosis}
                              onChange={(e) => setDiagnosis(e.target.value)}
                              placeholder="Clinical diagnosis based on findings or ICD-10 reference..."
                              className="w-full h-64 bg-white/70 border-2 border-transparent focus:border-indigo-500/20 rounded-[2.5rem] p-8 text-base font-black text-gray-800 transition-all outline-none shadow-inner"
                            />
                         </div>
                      </motion.div>
                    )}

                    {activeTab === 'requests' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-[#6C2BD9] uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Beaker className="w-4 h-4" /> Laboratory Investigation
                                </h4>
                                <span className="px-4 py-1.5 bg-purple-50 text-[#6C2BD9] rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">Real-time Sync Active</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['FBC (Full Blood Count)', 'Liver Function Tests (LFT)', 'Urinalysis', 'Blood Glucose'].map((test) => (
                                    <div 
                                        key={test} 
                                        className="p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#6C2BD9]/30 transition-all cursor-pointer flex items-center justify-between group"
                                        onClick={() => setLabRequest(prev => prev ? prev + ', ' + test : test)}
                                    >
                                        <span className="text-xs font-black text-gray-700 tracking-tight">{test}</span>
                                        <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#6C2BD9] group-hover:text-white transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <textarea
                              value={labRequest}
                              onChange={(e) => setLabRequest(e.target.value)}
                              placeholder="Detail additional laboratory diagnostic requirements..."
                              className="w-full h-32 bg-gray-50 border-2 border-transparent focus:border-purple-200 focus:bg-white rounded-[2rem] p-6 text-sm font-medium transition-all outline-none"
                            />
                        </section>

                        <section className="space-y-6">
                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Imaging & Radiometry
                            </h4>
                            <textarea
                              value={imagingRequest}
                              onChange={(e) => setImagingRequest(e.target.value)}
                              placeholder="X-Ray, Ultrasound, CT, or specialised imaging instructions..."
                              className="w-full h-40 bg-indigo-50/20 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] p-6 text-sm font-medium transition-all outline-none italic"
                            />
                        </section>
                      </motion.div>
                    )}

                    {activeTab === 'prescription' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                         <div className="bg-emerald-50/50 rounded-[3rem] p-10 border border-emerald-100/50">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-100 text-emerald-500 border border-emerald-50 transition-transform hover:scale-105 active:scale-95">
                                    <Pill className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-gray-800 tracking-tight">Digital Prescription Order</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pharmacy Connected</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest italic mt-1 font-mono">PCC-RX-ENCRYPTED-SESSION</p>
                                </div>
                            </div>
                            <textarea
                              value={prescription}
                              onChange={(e) => setPrescription(e.target.value)}
                              placeholder="e.g., Amoxicillin 500mg TDS x 5 Days; Paracetamol 1g PRN..."
                              className="w-full h-80 bg-white border-2 border-transparent focus:border-emerald-500/20 rounded-[2.5rem] p-10 text-lg font-black text-gray-800 transition-all outline-none shadow-xl shadow-emerald-100/20 placeholder:text-gray-300"
                            />
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Taskbar Footer */}
                <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-xl">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                      <ArrowRightLeft className="w-4 h-4" /> Sector Transfer
                    </button>
                    <button className="flex items-center gap-3 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                      <History className="w-4 h-4" /> Defer Session
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSubmitConsultation}
                    disabled={saving || !diagnosis}
                    className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#6C2BD9] to-[#8B45FF] text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 transition-all transform hover:translate-y-[-4px] active:translate-y-0 active:scale-95 disabled:opacity-20 disabled:translate-y-0"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Finalize Medical Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
