import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Image as ImageIcon, 
  Pill, 
  Bed, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Activity
} from 'lucide-react';

type ServiceType = 'Lab' | 'Imaging' | 'Pharmacy' | 'Ward';

interface ServiceRecord {
    id: string;
    patientName: string;
    item: string;
    status: 'Pending' | 'Completed' | 'In Process';
    time: string;
}

const MedicalServices: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ServiceType>('Lab');
    const [searchTerm, setSearchTerm] = useState('');

    const mockData: Record<ServiceType, ServiceRecord[]> = {
        Lab: [
            { id: 'PCC-101', patientName: 'Nfor Silas', item: 'Full Blood Count', status: 'Pending', time: '5m ago' },
            { id: 'PCC-102', patientName: 'Tanyi Grace', item: 'Malaria Test', status: 'Completed', time: '12m ago' },
            { id: 'PCC-103', patientName: 'Ebai Paul', item: 'Widal Test', status: 'In Process', time: '2m ago' }
        ],
        Imaging: [
            { id: 'PCC-201', patientName: 'Musa Adamu', item: 'Chest X-Ray', status: 'Pending', time: '15m ago' },
            { id: 'PCC-202', patientName: 'Acha Rose', item: 'Pelvic Ultrasound', status: 'In Process', time: '8m ago' }
        ],
        Pharmacy: [
            { id: 'PCC-301', patientName: 'Neba Jude', item: 'Paracetamol + Amox', status: 'Completed', time: '3m ago' },
            { id: 'PCC-302', patientName: 'Kome Derek', item: 'Artesunate Inj', status: 'Pending', time: '20m ago' }
        ],
        Ward: [
            { id: 'PCC-401', patientName: 'Songo Peter', item: 'Ward 2 / Bed 4', status: 'In Process', time: '1h ago' },
            { id: 'PCC-402', patientName: 'Enow Jane', item: 'Ward 1 / Bed 12', status: 'Pending', time: 'Discharge' }
        ]
    };

    const tabs = [
        { id: 'Lab', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'Imaging', icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'Pharmacy', icon: Pill, color: 'text-rose-600', bg: 'bg-rose-50' },
        { id: 'Ward', icon: Bed, color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'In Process': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-tighter">Clinical Services Queue</h2>
                    <p className="text-gray-500 mt-3 font-medium flex items-center italic">
                       <Activity className="w-4 h-4 mr-2 text-indigo-600" />
                       Centralized monitoring for diagnostics, therapeutics, and inpatient care.
                    </p>
                </div>
                
                <div className="flex bg-white p-2 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ServiceType)}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-[1.5rem] transition-all font-black text-[11px] uppercase tracking-widest ${
                                activeTab === tab.id 
                                    ? `bg-gray-900 text-white shadow-2xl` 
                                    : `text-gray-400 hover:bg-gray-50`
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                            <span>{tab.id}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{activeTab} Queue List</span>
                        <div className="h-0.5 w-12 bg-gray-100" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-50 border-none rounded-xl pl-10 pr-6 py-3 text-xs outline-none focus:ring-2 focus:ring-purple-100 transition-all font-bold w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                                <th className="pb-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {activeTab === 'Ward' ? 'Room / Bed Allocation' : 'Requested Service'}
                                </th>
                                <th className="pb-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                                <th className="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Time elapsed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockData[activeTab].map((row, i) => (
                                <motion.tr 
                                    key={row.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-purple-50/30 transition-colors"
                                >
                                    <td className="py-7">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-white group-hover:shadow-lg transition-all border border-transparent group-hover:border-purple-50">
                                                {row.patientName.split(' ').map(n=>n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-none">{row.patientName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{row.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-7">
                                        <p className="text-xs font-black text-gray-700 tracking-tight uppercase">{row.item}</p>
                                    </td>
                                    <td className="py-7">
                                        <div className="flex justify-center">
                                            <span className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center space-x-2 ${getStatusStyle(row.status)}`}>
                                                {row.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                                                <span>{row.status}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-7 text-right">
                                        <div className="flex items-center justify-end space-x-4">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{row.time}</span>
                                            <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-purple-50">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
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

export default MedicalServices;
