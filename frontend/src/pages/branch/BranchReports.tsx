import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  FileText, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

type ReportType = 'Daily' | 'Financial' | 'Medical';

const BranchReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportType>('Daily');

    const tabs = [
        { id: 'Daily', icon: Calendar, label: 'Daily Activity' },
        { id: 'Financial', icon: DollarSign, label: 'Financial Performance' },
        { id: 'Medical', icon: Activity, label: 'Medical Statistics' }
    ];

    const renderDaily = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Outpatients', value: '124', trend: '+12%', isUp: true },
                    { label: 'Inpatients', value: '18', trend: '-2%', isUp: false },
                    { label: 'Emergencies', value: '5', trend: 'Stable', isUp: true }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-end justify-between mt-2">
                           <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
                           <span className={`text-[10px] font-black px-2 py-1 rounded-md ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               {stat.trend}
                           </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Hourly Patient Traffic</h5>
                <div className="flex items-end justify-between h-48 gap-2">
                    {[40, 70, 45, 90, 65, 30, 85, 50, 95, 60, 40, 20].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className="w-full bg-indigo-100 rounded-t-lg group-hover:bg-indigo-600 transition-colors relative"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                                   {h}
                                </div>
                            </motion.div>
                            <span className="text-[8px] font-bold text-gray-400 mt-2 uppercase">{8 + i}h</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFinancial = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#6C2BD9] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-10 -mt-10" />
                    <p className="text-[10px] font-black text-purple-200 uppercase tracking-widest mb-2">Total Monthly Revenue</p>
                    <h3 className="text-5xl font-black">4.2M <span className="text-lg opacity-60">FCFA</span></h3>
                    <div className="mt-10 flex items-center space-x-4">
                        <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black">
                           <TrendingUp className="w-3 h-3" />
                           <span>+24% vs Prev Month</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Revenue Stream Breakdown</h5>
                    <div className="space-y-6">
                        {[
                            { label: 'Consultations', value: '45%', color: 'bg-emerald-500' },
                            { label: 'Laboratory', value: '30%', color: 'bg-indigo-500' },
                            { label: 'Pharmacy', value: '20%', color: 'bg-rose-500' },
                            { label: 'Imaging', value: '5%', color: 'bg-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                   <span>{item.label}</span>
                                   <span>{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                   <div className={`h-full ${item.color}`} style={{ width: item.value }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMedical = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
             <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-10">Top Diagnosed Conditions (Weekly)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        {[
                            { disease: 'Malaria', count: 45, trend: 'up' },
                            { disease: 'Hypertension', count: 28, trend: 'down' },
                            { disease: 'Typhoid', count: 22, trend: 'up' },
                            { disease: 'Diabetes', count: 18, trend: 'stable' }
                        ].map((d, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">{i+1}</div>
                                   <span className="text-sm font-black text-gray-800">{d.disease}</span>
                                </div>
                                <div className="flex items-center space-x-6">
                                   <span className="text-xs font-black text-gray-900">{d.count} Cases</span>
                                   {d.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-rose-500" /> : <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center p-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <div className="text-center">
                           <PieChart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Demographic distribution pending</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-tighter">Analytical Intelligence</h2>
                    <p className="text-gray-500 mt-2 font-medium italic">Data-driven insights for branch operational excellence.</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-50">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ReportType)}
                                className={`px-5 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 ${
                                    activeTab === tab.id 
                                        ? `bg-[#6C2BD9] text-white shadow-lg` 
                                        : `text-gray-400 hover:text-gray-600`
                                }`}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                <span>{tab.id}</span>
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center space-x-2 px-6 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
                       <Download className="w-4 h-4" />
                       <span>Export</span>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'Daily' && renderDaily()}
                    {activeTab === 'Financial' && renderFinancial()}
                    {activeTab === 'Medical' && renderMedical()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BranchReports;
