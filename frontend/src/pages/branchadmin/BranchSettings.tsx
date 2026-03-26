import React, { useState, useEffect } from 'react';
import { Settings, User, Building, MapPin, Phone, Mail, Globe, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const BranchSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
        <Settings className="w-8 h-8 mr-3 text-gray-700" />
        Branch Settings
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Building className="w-5 h-5 mr-2 text-purple-600" />
              Branch Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Branch Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={user?.branchName || 'Buea General Hospital'} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:ring-2 focus:ring-purple-600/20 transition-all font-bold text-gray-700" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value="Buea, South West Region" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:ring-2 focus:ring-purple-600/20 transition-all font-bold text-gray-700" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value="+237 677 123 456" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:ring-2 focus:ring-purple-600/20 transition-all font-bold text-gray-700" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value="info@bueageneral.com" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-transparent focus:ring-2 focus:ring-purple-600/20 transition-all font-bold text-gray-700" />
                </div>
              </div>
            </div>
            <button className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-purple-700 transition-colors flex items-center shadow-lg shadow-purple-600/20">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            Admin Profile
          </h3>
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center text-blue-600 font-black text-3xl shadow-inner border-4 border-white">
              {user?.firstName?.charAt(0)}
            </div>
            <div>
              <p className="font-black text-xl text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Branch Administrator</p>
            </div>
            <div className="pt-4 border-t border-gray-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Username</span>
                <span className="font-bold text-gray-900">{user?.username}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium">Last Login</span>
                <span className="font-bold text-gray-900">Today, 08:30 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSettings;
