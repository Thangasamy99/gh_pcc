import React, { useState, useEffect } from 'react';
import { Pill, Search, Pill as Capsule } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const PharmacyManagement = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/services/pharmacy/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching pharmacy data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
        <Pill className="w-8 h-8 mr-3 text-pink-500" />
        Pharmacy Management
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Medication Issuance</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search patient or medicine..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Medicines Issued</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">No prescriptions to issue today</td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-bold">#P-{item.patientId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.medicines}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'ISSUED' ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-pink-600'}`}>
                        {item.status}
                      </span>
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

export default PharmacyManagement;
