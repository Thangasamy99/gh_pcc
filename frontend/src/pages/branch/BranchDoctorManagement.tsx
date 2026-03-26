import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Stethoscope,
  MapPin,
  RefreshCw,
  User
} from 'lucide-react';
import { AuthContext } from '../../components/auth/AuthContext';
import { doctorService, DoctorDTO } from '../../services/doctorService';
import { toast } from 'react-hot-toast';

const BranchDoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        fetchDoctors();
    }, [user]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            // Ideally use a branch-specific endpoint, but here we filter
            const allDoctors = await doctorService.getAllDoctors();
            const branchId = user?.branchId || 1;
            const branchDoctors = allDoctors.filter((d: DoctorDTO) => d.branchId === branchId);
            setDoctors(branchDoctors);
        } catch (e) {
            toast.error('Failed to synchronizing medical staff');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (doctorId: number, currentStatus: string) => {
        const nextStatus = currentStatus === 'AVAILABLE' ? 'BUSY' : (currentStatus === 'BUSY' ? 'OFFLINE' : 'AVAILABLE');
        try {
            await doctorService.updateAvailability(doctorId, nextStatus);
            toast.success(`Doctor status updated to ${nextStatus}`);
            fetchDoctors();
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <span className="flex items-center px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 ring-4 ring-emerald-50/50"><CheckCircle2 className="w-3 h-3 mr-2" /> Online</span>;
            case 'BUSY':
                return <span className="flex items-center px-4 py-2 rounded-2xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 ring-4 ring-amber-50/50"><Clock className="w-3 h-3 mr-2" /> In Session</span>;
            case 'OFFLINE':
            default:
                return <span className="flex items-center px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100 ring-4 ring-rose-50/50"><XCircle className="w-3 h-3 mr-2" /> Off Duty</span>;
        }
    };

    const filteredDoctors = doctors.filter(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Medical Staff Control</h2>
                    <p className="text-gray-500 mt-3 font-medium flex items-center italic">
                       <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                       Real-time shift and room management for {user?.branchName || 'Main Branch'}.
                    </p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter by name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-2 border-transparent shadow-xl shadow-gray-200/40 rounded-[1.5rem] pl-12 pr-6 py-4 text-sm focus:ring-4 focus:ring-purple-600/5 focus:border-purple-100 outline-none w-72 transition-all font-black"
                        />
                    </div>
                    <button onClick={fetchDoctors} className="p-4 bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] text-[#6C2BD9] hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center uppercase font-black text-gray-300 tracking-[0.3em] text-xs">
                        Synchronizing Shift Data...
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 uppercase font-black text-gray-400 tracking-widest text-xs">
                        No medical staff found in this criteria.
                    </div>
                ) : filteredDoctors.map((doctor, idx) => (
                    <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50 group hover:shadow-purple-200/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center space-x-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[1.5rem] flex items-center justify-center font-black text-[#6C2BD9] text-xl border border-purple-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <User className="w-8 h-8 opacity-40" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight">Dr. {doctor.firstName} {doctor.lastName}</h3>
                                        <p className="text-[10px] font-black text-purple-600/60 uppercase tracking-widest mt-1 italic">{doctor.specialization}</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-xl">
                                    <Stethoscope className="w-5 h-5 text-gray-300" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-transparent group-hover:bg-white group-hover:border-purple-50 transition-all">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Consultation Room</p>
                                    <div className="flex items-center text-gray-900">
                                        <MapPin className="w-3.5 h-3.5 mr-2 text-purple-400" />
                                        <span className="text-sm font-black">{doctor.consultationRoom || 'Ward Dept'}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-transparent group-hover:bg-white group-hover:border-purple-50 transition-all flex flex-col justify-center items-center">
                                    {getStatusBadge(doctor.availabilityStatus)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-auto">
                            <button 
                                onClick={() => handleStatusToggle(doctor.id!, doctor.availabilityStatus!)}
                                className="flex-1 py-4 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transition-all hover:-translate-y-1"
                            >
                                Change Status
                            </button>
                            <button className="p-4 bg-gray-50 text-gray-400 hover:text-purple-600 rounded-[1.5rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-purple-100">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BranchDoctorManagement;
