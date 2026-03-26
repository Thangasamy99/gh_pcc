import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Save, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { AuthContext } from '../../components/auth/AuthContext';
import { toast } from 'react-hot-toast';

const BranchSettings: React.FC = () => {
    const { user } = useContext(AuthContext) || {};
    const [branchInfo, setBranchInfo] = useState({
        name: user?.branchName || 'Presbyterian Church Health Service - Buea',
        address: 'Molyko, Buea, South West Region, Cameroon',
        phone: '+237 670 000 000',
        email: 'buea.health@pcc.cm',
        website: 'www.pcchealth.cm',
        workingHours: '24/7 Operational'
    });

    const handleSave = () => {
        toast.success('Branch settings updated successfully');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-tighter">Branch Configuration</h2>
                <p className="text-gray-500 mt-2 font-medium italic">Manage public-facing information and operational parameters for this location.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 space-y-12">
                <div className="flex items-center space-x-6">
                   <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center border border-purple-100 shadow-sm">
                      <Building2 className="w-10 h-10 text-purple-600" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-gray-900">{branchInfo.name}</h4>
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Branch ID: {user?.branchId || '001'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Branch Name</label>
                        <div className="relative group">
                            <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                value={branchInfo.name}
                                onChange={(e) => setBranchInfo({...branchInfo, name: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Phone</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                value={branchInfo.phone}
                                onChange={(e) => setBranchInfo({...branchInfo, phone: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                value={branchInfo.address}
                                onChange={(e) => setBranchInfo({...branchInfo, address: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Web Portal</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                value={branchInfo.website}
                                onChange={(e) => setBranchInfo({...branchInfo, website: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Hours</label>
                        <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                            <input 
                                type="text" 
                                value={branchInfo.workingHours}
                                onChange={(e) => setBranchInfo({...branchInfo, workingHours: e.target.value})}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-gray-700 outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-gray-50 mt-12">
                   <div className="flex items-center space-x-3 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Enterprise verified branch</span>
                   </div>
                   <button 
                        onClick={handleSave}
                        className="flex items-center space-x-3 bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all"
                   >
                      <Save className="w-4 h-4" />
                      <span>Commit Changes</span>
                   </button>
                </div>
            </div>
        </div>
    );
};

export default BranchSettings;
