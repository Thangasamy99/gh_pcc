import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, MapPin, Users, Activity, Filter, Info, ShieldCheck, Bed } from 'lucide-react';
import { securityService } from '../../../services/securityService';

const WardDirectorySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [wards, setWards] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bedStats, setBedStats] = useState<any>(null);

  useEffect(() => {
    loadWards();
    loadBedStats();
  }, []);

  const loadWards = async () => {
    try {
      const data = await securityService.getAllWards(2);
      setWards(data);
    } catch (error) {
      console.error('Error loading wards', error);
    }
  };

  const loadBedStats = async () => {
    try {
      const data = await securityService.getAvailableBeds(2);
      setBedStats(data);
    } catch (error) {
      console.error('Error loading bed stats', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await securityService.searchPatientInWard(searchTerm, 2);
      setPatients(results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bed Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Bed Capacity</p>
            <h3 className="text-2xl font-bold text-gray-800">{bedStats?.totalBeds || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Bed className="w-6 h-6" />
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">Currently Available</p>
            <h3 className="text-2xl font-bold text-emerald-600">{bedStats?.availableBeds || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">Occupied / Admitted</p>
            <h3 className="text-2xl font-bold text-orange-600">{bedStats?.occupiedBeds || 0}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by Patient Name, ID, or Location..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9120e8] transition-all outline-none bg-gray-50/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#9120e8] outline-none bg-gray-50/50 min-w-[160px]"
            >
              <option value="all">All Wards</option>
              {wards.map(w => (
                <option key={w.id} value={w.id}>{w.wardName}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-4 bg-[#9120e8] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'SEARCH DIRECTORY'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Admitted Patient Directory
          </h4>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
            {patients.length} PATIENTS FOUND
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {patients.length > 0 ? (
                patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-[#9120e8] flex items-center justify-center font-bold">
                          {p.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{p.patientName}</p>
                          <p className="text-xs text-gray-400">ID: {p.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{p.wardName}</p>
                        <p className="text-xs text-gray-500">Room {p.roomNumber} | Bed {p.bedNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                        p.status === 'STABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-[#9120e8] hover:underline text-sm font-bold">
                        Register Visitor
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Info className="w-10 h-10 opacity-20" />
                      <p>Enter a name to search the directory</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardDirectorySearch;
