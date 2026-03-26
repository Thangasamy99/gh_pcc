import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, MapPin, Award, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const DoctorManagement = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/doctors/${branchId}`);
        setDoctors(response.data.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Stethoscope className="w-8 h-8 mr-3 text-blue-500" />
            Doctor Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Monitor physician availability and room assignments</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Doctor Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Specialization</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Room</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td></tr>
                ))
              ) : doctors.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">No doctors registered at this branch</td></tr>
              ) : (
                doctors.filter(d => 
                  d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((doctor, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-3 font-bold">
                          {doctor.name?.split(' ').map((n: any) => n[0]).join('')}
                        </div>
                        <span className="font-bold text-gray-900">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-sm font-medium">{doctor.specialization || 'General Physician'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-400" />
                        <span className="text-sm font-bold">{doctor.room || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {doctor.status === 'AVAILABLE' ? (
                          <span className="flex items-center text-green-600 text-xs font-black uppercase bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-xs font-black uppercase bg-red-50 px-3 py-1 rounded-full">
                            <XCircle className="w-3 h-3 mr-1" /> Busy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-black transition-colors">Manage</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
