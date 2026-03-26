import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Phone,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  FlaskConical,
  Wallet
} from 'lucide-react';
import { AuthContext } from '../../components/auth/AuthContext';
import api from '../../services/api';

interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    roleName: string;
    roleCode: string;
    isActive: boolean;
    employeeId?: string;
}

const BranchStaffManagement: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext) || {};

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                // In a real app, this would be a branch-specific staff endpoint
                // For now, we fetch users and filter by branchId if available
                const response = await api.get('/v1/superadmin/users');
                const allUsers = response.data.data;
                const branchStaff = allUsers.filter((u: any) => u.branchId === user?.branchId || 1);
                setStaff(branchStaff);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [user]);

    const filteredStaff = staff.filter(s => 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleIcon = (roleCode: string) => {
        if (roleCode.includes('DOCTOR')) return <Stethoscope className="w-4 h-4 text-purple-500" />;
        if (roleCode.includes('RECEPTION')) return <UserCheck className="w-4 h-4 text-blue-500" />;
        if (roleCode.includes('CASHIER')) return <Wallet className="w-4 h-4 text-emerald-500" />;
        if (roleCode.includes('LAB')) return <FlaskConical className="w-4 h-4 text-rose-500" />;
        return <Users className="w-4 h-4 text-gray-500" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Staff Directory</h2>
                    <p className="text-gray-500 mt-1 font-medium italic">Managing your branch personnel across all departments.</p>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find staff members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-none shadow-lg shadow-gray-200/50 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-purple-600/10 outline-none w-64 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Staff Member</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Designation / Role</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 uppercase tracking-widest text-xs font-black">
                                       Synchronizing Directory...
                                    </td>
                                </tr>
                            ) : filteredStaff.map((member, idx) => (
                                <motion.tr 
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-purple-50/30 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-500 border border-gray-200 group-hover:bg-white group-hover:shadow-lg transition-all">
                                                {member.firstName[0]}{member.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{member.firstName} {member.lastName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{member.employeeId || 'STF-ADMIN'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                                                {getRoleIcon(member.roleCode)}
                                            </div>
                                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{member.roleName}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center space-y-1">
                                            <div className="flex items-center space-x-2 text-xs text-gray-500 font-bold group-hover:text-[#6C2BD9] transition-colors">
                                                <Mail className="w-3 h-3" />
                                                <span>{member.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold">
                                                <Phone className="w-2.5 h-2.5" />
                                                <span>{member.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${member.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {member.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                <span>{member.isActive ? 'Active' : 'Inactive'}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-3 bg-gray-50 hover:bg-white text-gray-400 hover:text-[#6C2BD9] rounded-xl transition-all hover:shadow-xl border border-transparent hover:border-purple-100">
                                            <MoreVertical className="w-5 h-5" />
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

export default BranchStaffManagement;
