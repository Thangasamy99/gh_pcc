import React, { useState, useEffect } from 'react';
import { Image, Search, Monitor, Clipboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const ImagingManagement = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
        <Image className="w-8 h-8 mr-3 text-indigo-500" />
        Imaging Management
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Radiology Requests</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search scan type..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Scan Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">No imaging requests pending today</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImagingManagement;
