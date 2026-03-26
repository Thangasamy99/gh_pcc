import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  Activity, 
  Users, 
  Stethoscope, 
  Search, 
  Filter 
} from 'lucide-react';

const ReceptionOverview: React.FC = () => {
    const stats = [
        { title: 'Registered Today', count: 42, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+15%' },
        { title: 'Vitals Completed', count: 38, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '90%' },
        { title: 'Waiting for Cashier', count: 4, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reception Operations</h2>
                <p className="text-gray-500 mt-2 font-medium italic">Monitoring front-desk registration and preliminary triage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative group overflow-hidden"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 ${stat.bg} rounded-2xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="bg-gray-50 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.trend}
                            </div>
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
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Recent Registrations</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                           <input type="text" placeholder="Quick find..." className="bg-gray-50 border-none rounded-lg pl-8 pr-4 py-2 text-[10px] font-bold outline-none ring-1 ring-gray-100" />
                        </div>
                        <button className="p-2 bg-gray-50 rounded-lg text-gray-400"><Filter className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { name: 'Ambe Che', time: '10 mins ago', type: 'New Patient', status: 'Vitals Done' },
                        { name: 'Bessong Mary', time: '14 mins ago', type: 'Emergency', status: 'In Triage' },
                        { name: 'Nkwenti John', time: '22 mins ago', type: 'Return User', status: 'Searching File' }
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-purple-100">
                            <div className="flex items-center space-x-5">
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100">
                                   {row.name.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-none">{row.name}</p>
                                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter mt-1">{row.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Status</p>
                                    <p className="text-xs font-bold text-gray-700 mt-1">{row.status}</p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{row.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReceptionOverview;
