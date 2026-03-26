import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  CheckCircle, 
  Clock, 
  Activity, 
  Users, 
  Monitor,
  Search,
  Filter
} from 'lucide-react';

const DoctorOverview: React.FC = () => {
    const stats = [
        { title: 'Active Doctors', count: 8, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Full Staff' },
        { title: 'Consultations Completed', count: 32, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18%' },
        { title: 'Avg. Patients/Doctor', count: 4, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Stable' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-tighter">Doctor Operations Control</h2>
                <p className="text-gray-500 mt-2 font-medium italic flex items-center">
                   <Monitor className="w-4 h-4 mr-2 text-indigo-600" />
                   Real-time clinical throughput and consultant activity tracking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative group overflow-hidden hover:shadow-2xl hover:shadow-purple-200/40 transition-all"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 ${stat.bg} rounded-2xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div className="mt-8 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-4xl font-black text-gray-900 mt-2">{stat.count}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none">Consultant Sessions</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { doctor: 'Dr. Sarah Mbella', room: 'Room 1', load: 3, status: 'Active' },
                        { doctor: 'Dr. John Ndifor', room: 'Room 3', load: 5, status: 'Busy' },
                        { doctor: 'Dr. Elizabeth Ngwa', room: 'Room 2', load: 2, status: 'Active' }
                    ].map((session, i) => (
                        <div key={i} className="bg-gray-50/50 p-6 rounded-[2rem] border border-transparent hover:bg-white hover:border-purple-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                   <Users className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${session.status === 'Busy' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {session.status}
                                </span>
                            </div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{session.doctor}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session.room}</p>
                            
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Queue</span>
                                <span className="text-lg font-black text-gray-900">{session.load} patients</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 rounded-full mt-3 overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(session.load / 10) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorOverview;
