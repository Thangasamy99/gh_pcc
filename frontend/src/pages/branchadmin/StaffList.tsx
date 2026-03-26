import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, BadgeCheck, ShieldAlert, MoreVertical } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const StaffList = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/staff/${branchId}`);
        setStaff(response.data.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Users className="w-8 h-8 mr-3 text-purple-600" />
            Staff Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and monitor hospital personnel</p>
        </div>
        
        <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95">
          + Add New Staff
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or role..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-50 rounded-3xl animate-pulse"></div>
            ))
          ) : staff.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 font-medium italic">No staff members found</div>
          ) : (
            staff.filter(s => 
              s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              s.role?.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xl">
                    {member.name?.charAt(0)}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${member.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {member.status}
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-purple-600 text-xs font-black uppercase tracking-widest mb-4">{member.role}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email || 'staff@hospital.com'}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone || '+237 6xx xxx xxx'}
                  </div>
                </div>

                <button className="absolute bottom-6 right-6 p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffList;
