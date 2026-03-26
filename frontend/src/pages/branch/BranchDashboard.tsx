import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Stethoscope, 
  Bed, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  UserPlus
} from 'lucide-react';
import { branchAdminService, BranchDashboardStats } from '../../services/branchAdminService';
import { AuthContext } from '../../components/auth/AuthContext';

const BranchDashboard: React.FC = () => {
    const [stats, setStats] = useState<BranchDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.branchId) {
                const data = await branchAdminService.getDashboardStats(user.branchId);
                setStats(data);
            } else {
                // Fallback for demo
                const data = await branchAdminService.getDashboardStats(1);
                setStats(data);
            }
            setLoading(false);
        };
        fetchStats();
    }, [user]);

    const statCards = [
        { 
            title: 'Total Patients Today', 
            count: stats?.totalPatientsToday || 0, 
            icon: Users, 
            color: 'from-blue-500 to-indigo-600', 
            trend: '+12%', 
            isUp: true,
            description: 'New & returning registrations'
        },
        { 
            title: 'Waiting Patients', 
            count: stats?.waitingPatients || 0, 
            icon: Clock, 
            color: 'from-amber-400 to-orange-500', 
            trend: '-5%', 
            isUp: false,
            description: 'Currently in various queues'
        },
        { 
            title: 'Paid Patients', 
            count: stats?.paidPatients || 0, 
            icon: CheckCircle, 
            color: 'from-emerald-400 to-teal-600', 
            trend: '+18%', 
            isUp: true,
            description: 'Confirmed billing & payments'
        },
        { 
            title: 'In Consultation', 
            count: stats?.patientsInConsultation || 0, 
            icon: Stethoscope, 
            color: 'from-purple-500 to-violet-600', 
            trend: '+2', 
            isUp: true,
            description: 'Active doctor sessions'
        },
        { 
            title: 'Admissions Today', 
            count: stats?.admissionsToday || 0, 
            icon: Bed, 
            color: 'from-rose-400 to-red-600', 
            trend: 'Stable', 
            isUp: true,
            description: 'Ward / IPD processing'
        },
        { 
            title: 'Total Revenue Today', 
            count: `${(stats?.totalRevenueToday || 0).toLocaleString()} FCFA`, 
            icon: Wallet, 
            color: 'from-[#6C2BD9] to-[#9333EA]', 
            trend: '+25%', 
            isUp: true,
            description: 'Cash, Insurance & Credit'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-purple-600 font-black uppercase tracking-widest text-xs">Initializing Branch Command...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div>
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-black text-gray-900 tracking-tight"
                >
                    Operational Overview
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 mt-2 font-medium"
                >
                    Real-time monitoring of hospital flow and departmental performance.
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group overflow-hidden relative"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 bg-gradient-to-br ${card.color} rounded-2xl shadow-lg ring-4 ring-white`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                <span>{card.trend}</span>
                            </div>
                        </div>

                        <div className="mt-8 relative z-10">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{card.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-2">{card.count}</h3>
                            <p className="text-xs font-bold text-gray-400 mt-2 italic group-hover:text-gray-500 transition-colors uppercase tracking-widest leading-none opacity-60">
                               {card.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Secondary Sections Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Live Activity Feed */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                              <Activity className="w-5 h-5 text-purple-600" />
                           </div>
                           <h3 className="text-xl font-black text-gray-900 tracking-tight">System Vitality</h3>
                        </div>
                        <button className="text-xs font-black text-purple-600 uppercase tracking-widest hover:underline">See Logs</button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { action: 'New Patient Registered', time: '2 mins ago', meta: 'PCC-4421', icon: UserPlus, color: 'text-blue-500' },
                            { action: 'Consultation Completed', time: '5 mins ago', meta: 'Dr. Mbella', icon: Stethoscope, color: 'text-emerald-500' },
                            { action: 'Payment Processed', time: '8 mins ago', meta: '25,000 FCFA', icon: Wallet, color: 'text-purple-500' },
                            { action: 'Admission Initiated', time: '12 mins ago', meta: 'Ward 2 (B-14)', icon: Bed, color: 'text-rose-500' }
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-purple-100 hover:bg-white transition-all cursor-default">
                                <div className="flex items-center space-x-4">
                                   <div className={`p-2 bg-white rounded-lg shadow-sm border border-gray-100 ${log.color}`}>
                                      <log.icon className="w-4 h-4" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-gray-800">{log.action}</p>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{log.meta}</p>
                                   </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Performance Analytics Widget */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-[#6C2BD9] to-[#4F09A3] rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20" />
                    
                    <h3 className="text-xl font-black tracking-tight mb-8">Performance Pulse</h3>
                    
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                           <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Patient Satisfaction</p>
                           <h4 className="text-3xl font-black">4.8 / 5.0</h4>
                           <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                              <div className="w-[96%] h-full bg-white rounded-full" />
                           </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                           <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Avg. Wait Time</p>
                           <h4 className="text-3xl font-black">18 mins</h4>
                           <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                              <div className="w-[40%] h-full bg-emerald-400 rounded-full" />
                           </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10">
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-purple-200">
                           <span>Weekly Targets</span>
                           <span>82% Reached</span>
                        </div>
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '82%' }}
                              transition={{ duration: 1.5, type: 'spring' }}
                              className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                           />
                        </div>
                        <p className="text-[10px] font-bold text-white/50 text-center tracking-widest italic pt-2">
                           "Optimizing healthcare delivery at Presbyterian Church Service"
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BranchDashboard;
