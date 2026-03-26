import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  BadgeCheck, 
  LogOut, 
  Camera,
  Activity
} from 'lucide-react';
import { AuthContext } from '../../components/auth/AuthContext';
import { toast } from 'react-hot-toast';

const BranchProfile: React.FC = () => {
    const { user, logout } = useContext(AuthContext) || {};

    const handleLogout = () => {
        if (logout) {
            logout();
            toast.success('Logged out successfully');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-tighter">Administrator Profile</h2>
                <p className="text-gray-500 mt-2 font-medium italic">Manage your secure identity and account preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Identity Card */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-[#6C2BD9] to-[#9333EA]" />
                        <div className="relative mt-8">
                            <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto p-1.5 shadow-xl relative group">
                                <div className="w-full h-full bg-gray-50 rounded-[1.8rem] flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:bg-purple-50 transition-all">
                                   <User className="w-10 h-10 text-gray-300 group-hover:text-purple-600" />
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                                   <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-xl font-black text-gray-900 leading-none">{user?.fullName || 'John Admin'}</h4>
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-2">{user?.role || 'Branch Administrator'}</p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-center space-x-6 text-gray-400">
                           <div className="text-center">
                              <p className="text-sm font-black text-gray-900">12</p>
                              <p className="text-[8px] font-bold uppercase tracking-widest">Tasks</p>
                           </div>
                           <div className="w-px h-8 bg-gray-50" />
                           <div className="text-center">
                              <p className="text-sm font-black text-gray-900">Active</p>
                              <p className="text-[8px] font-bold uppercase tracking-widest">Status</p>
                           </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full py-5 bg-rose-50 text-rose-600 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-rose-100 transition-all border border-rose-100/50"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Terminate Session</span>
                    </button>
                </div>

                {/* Profile Details Card */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10">
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-purple-50 rounded-xl">
                              <Shield className="w-5 h-5 text-purple-600" />
                           </div>
                           <h4 className="text-lg font-black text-gray-900 uppercase">Identity Protection</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                                   <span className="text-sm font-black text-gray-700">{user?.username}</span>
                                   <BadgeCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                                <div className="flex items-center space-x-3 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                                   <Mail className="w-4 h-4 text-gray-300" />
                                   <span className="text-sm font-black text-gray-700">{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-50">
                            <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Security Actions</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 transition-all group">
                                   <div className="flex items-center space-x-4">
                                      <Key className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                                      <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Modify Password</span>
                                   </div>
                                   <Activity className="w-4 h-4 text-gray-100 group-hover:text-purple-100" />
                                </button>
                                <button className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 transition-all group">
                                   <div className="flex items-center space-x-4">
                                      <Shield className="w-5 h-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                                      <span className="text-xs font-black text-gray-700 uppercase tracking-tight">Security Keys</span>
                                   </div>
                                   <Activity className="w-4 h-4 text-gray-100 group-hover:text-purple-100" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="pt-8 flex justify-end">
                           <button className="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">
                              Update Account
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchProfile;
