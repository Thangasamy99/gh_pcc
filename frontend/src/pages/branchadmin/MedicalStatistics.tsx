import React, { useState, useEffect } from 'react';
import { Activity, Search, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const MedicalStatistics = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
        <Activity className="w-8 h-8 mr-3 text-purple-600" />
        Medical Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            Top Diagnosis Today
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Malaria', count: 45, color: 'bg-red-500' },
              { name: 'Hypertension', count: 28, color: 'bg-blue-500' },
              { name: 'Common Cold', count: 22, color: 'bg-green-500' },
              { name: 'Typhoid', count: 18, color: 'bg-orange-500' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="font-bold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            Patient Demographics
            <Users className="w-5 h-5 text-blue-500" />
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Male / Female Ratio</span>
              <span className="text-sm font-black text-gray-900">45% / 55%</span>
            </div>
            <div className="h-4 bg-gray-50 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 w-[45%]"></div>
              <div className="h-full bg-pink-500 w-[55%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalStatistics;
