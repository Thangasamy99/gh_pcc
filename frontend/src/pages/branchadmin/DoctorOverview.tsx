import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Users, CheckSquare, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const DoctorOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchId = user?.branchId || 1;
        const response = await api.get(`/v1/branch-admin/operations/doctor/${branchId}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching doctor overview:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
            <Stethoscope className="w-8 h-8 mr-3 text-blue-600" />
            Doctor Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">Clinical operations and consultation throughput</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Active Doctors</p>
            <p className="text-4xl font-black text-gray-900">{data?.activeDoctors || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Completed</p>
            <p className="text-4xl font-black text-gray-900">{data?.consultationsCompleted || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest">In Progress</p>
            <p className="text-4xl font-black text-gray-900">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Patient Distribution per Doctor
        </h3>
        <div className="space-y-6">
          {[
            { name: 'Dr. Sarah Mbella', count: 12, max: 20 },
            { name: 'Dr. John Ndifor', count: 8, max: 20 },
            { name: 'Dr. Elizabeth Ngwa', count: 15, max: 20 }
          ].map((doc, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">{doc.name}</span>
                <span className="font-black text-purple-600">{doc.count} patients</span>
              </div>
              <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(doc.count / doc.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;
