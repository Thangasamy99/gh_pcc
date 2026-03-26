import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  UserCheck,
  Wallet,
  Stethoscope,
  FlaskConical,
  Pill,
  Bed,
  LogOut
} from 'lucide-react';
import { branchAdminService, PatientTrack } from '../../services/branchAdminService';

const STAGES = [
  { id: 'Security', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Reception', icon: UserCheck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'Cashier', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Doctor', icon: Stethoscope, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'Lab', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Pharmacy', icon: Pill, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Admission', icon: Bed, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'Discharge', icon: LogOut, color: 'text-gray-500', bg: 'bg-gray-50' }
];

const PatientTracking: React.FC = () => {
    const [patients, setPatients] = useState<PatientTrack[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await branchAdminService.getPatientTracking();
            setPatients(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Waiting': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'In Consultation': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Patient Flow Tracking</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitoring every heartbeat of the hospital journey.</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Track by ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-none shadow-lg shadow-gray-200/50 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-purple-600/10 outline-none w-64 transition-all"
                        />
                    </div>
                    <button className="p-4 bg-white shadow-lg shadow-gray-200/50 rounded-2xl text-gray-400 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stage Legend */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between overflow-x-auto gap-8 no-scrollbar">
                {STAGES.map((stage, idx) => (
                    <div key={stage.id} className="flex items-center space-x-3 shrink-0 group">
                        <div className={`w-10 h-10 ${stage.bg} ${stage.color} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                            <stage.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600">{stage.id}</span>
                        {idx < STAGES.length - 1 && <ChevronRight className="w-3 h-3 text-gray-200" />}
                    </div>
                ))}
            </div>

            {/* Tracking Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Details</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Journey Stage</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Status</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Accessing records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPatients.map((patient, idx) => (
                                <motion.tr 
                                    key={patient.patientId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-purple-50/30 transition-colors group"
                                >
                                    <td className="px-8 py-7">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-500 border border-gray-200 group-hover:bg-white group-hover:shadow-lg transition-all">
                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-tight">{patient.name}</p>
                                                <p className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mt-1 w-fit uppercase tracking-tighter ring-1 ring-purple-100">{patient.patientId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                                                <div 
                                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(108,43,217,0.3)]"
                                                    style={{ width: `${((STAGES.findIndex(s => s.id === patient.currentStage) + 1) / STAGES.length) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{patient.currentStage}</span>
                                                <ArrowRight className="w-3 h-3 text-gray-300" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex justify-center">
                                            <span className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(patient.status)}`}>
                                                {patient.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                                                <span>{patient.status}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 hover:bg-white hover:text-purple-600 hover:shadow-xl hover:shadow-purple-200/50 px-5 py-3 rounded-xl transition-all border border-transparent hover:border-purple-100">
                                            View Logs
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientTracking;
