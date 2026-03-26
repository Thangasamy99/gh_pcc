import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  UserPlus, 
  Wallet, 
  Stethoscope, 
  FlaskConical,
  Activity,
  AlertCircle
} from 'lucide-react';
import { branchAdminService, QueueStatus as IQueueStatus } from '../../services/branchAdminService';

const QueueStatus: React.FC = () => {
    const [queueData, setQueueData] = useState<IQueueStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await branchAdminService.getQueueStatus();
            setQueueData(data);
            setLoading(false);
        };
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000); // Auto refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const queueItems = [
        { title: 'Reception Queue', count: queueData?.reception || 0, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
        { title: 'Cashier Queue', count: queueData?.cashier || 0, icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
        { title: 'Doctor Queue', count: queueData?.doctor || 0, icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
        { title: 'Lab Queue', count: queueData?.lab || 0, icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' }
    ];

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Live Queue Status</h2>
                <p className="text-gray-500 mt-2 font-medium italic">Real-time load balancing across hospital departments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {queueItems.map((item, idx) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white rounded-[2rem] p-8 border ${item.border} shadow-xl shadow-gray-200/40 relative overflow-hidden group hover:shadow-2xl transition-all`}
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 ${item.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                        
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`p-4 ${item.bg} rounded-2xl`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full ring-1 ring-gray-100/50 shadow-sm">
                                <span className={`w-2 h-2 rounded-full ${item.count > 5 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.count > 5 ? 'Critical' : 'Stable'}</span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.title}</p>
                            <h3 className="text-5xl font-black text-gray-900 tracking-tighter">{item.count}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest opacity-60">Patients Waiting</p>
                        </div>

                        {item.count > 5 && (
                            <motion.div 
                                initial={{ x: 100 }}
                                animate={{ x: 0 }}
                                className="mt-6 flex items-center space-x-2 bg-rose-50 p-4 rounded-2xl border border-rose-100"
                            >
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none">High Traffic Detected</span>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Visualizer Row */}
            <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-indigo-600" />
                       </div>
                       <h3 className="text-xl font-black text-gray-900 tracking-tight">Relative Departmental Load</h3>
                   </div>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Last sync: {new Date().toLocaleTimeString()}
                   </div>
                </div>

                <div className="space-y-10">
                    {queueItems.map(item => (
                        <div key={item.title} className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-black text-gray-600 uppercase tracking-widest">
                                <span>{item.title}</span>
                                <span>{item.count} Patients</span>
                            </div>
                            <div className="w-full bg-gray-50 h-5 rounded-full p-1 border border-gray-100 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (item.count / 15) * 100)}%` }}
                                    transition={{ duration: 1, type: 'spring' }}
                                    className={`h-full rounded-full bg-gradient-to-r from-gray-200 to-indigo-500 shadow-sm transition-all duration-1000`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QueueStatus;
