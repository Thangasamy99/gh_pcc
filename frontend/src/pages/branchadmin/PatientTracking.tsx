import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const PatientTracking = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/patients/track/${branchId}`);
        setPatients(response.data.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'WAITING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'PAID': return 'bg-green-50 text-green-600 border-green-100';
      case 'IN_CONSULTATION': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Activity className="w-8 h-8 mr-3 text-purple-600" />
            Patient Tracking
          </h1>
          <p className="text-gray-500 font-medium mt-1">Monitor patient flow across all hospital stages</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all border border-transparent focus:border-purple-600/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2.5 bg-gray-50 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors border border-gray-100">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Current Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">No patients found today</td>
                </tr>
              ) : (
                patients.filter(p => 
                  p.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.name?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((patient, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-700">{patient.patientId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-bold text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {['Security', 'Reception', 'Cashier', 'Doctor', 'Pharmacy'].map((stage, idx) => (
                          <React.Fragment key={stage}>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${patient.currentStage === stage ? 'bg-purple-600 text-white' : 'text-gray-300'}`}>
                              {stage}
                            </span>
                            {idx < 4 && <ChevronRight className="w-3 h-3 text-gray-200" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(patient.status)}`}>
                        {patient.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-purple-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Details</button>
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

export default PatientTracking;
