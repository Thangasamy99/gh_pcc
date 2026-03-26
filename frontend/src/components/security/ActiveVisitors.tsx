import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Search, X, Shield, Clock, MapPin, User, Printer } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { toast } from 'react-hot-toast';

const ActiveVisitors: React.FC = () => {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadActiveVisitors();
  }, []);

  const loadActiveVisitors = async () => {
    try {
      const data = await securityService.getActiveVisitors(2);
      setVisitors(data || []);
    } catch (error) {
      console.error('Error loading active visitors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await securityService.checkoutVisitor(id, user.id);
      toast.success('Visitor checked out successfully');
      loadActiveVisitors();
    } catch (error) {
      toast.error('Checkout failed');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Visitors</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <p className="text-gray-500 text-sm font-medium">Currently inside hospital premises</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xl border border-emerald-100">
            {visitors.length}
          </div>
        </div>
      </div>

      <div className="bg-[#9120e8]/5 p-1 rounded-2xl flex items-center">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9120e8]/60" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Live filter by name or host..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent border-none focus:ring-0 transition-all outline-none font-medium"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visitors.length > 0 ? (
          visitors
            .filter(v => 
              v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (v.patientName && v.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((visitor) => (
            <motion.div
              key={visitor.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-[#9120e8] flex items-center justify-center font-black text-xl shadow-inner">
                      {visitor.visitorName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#9120e8] transition-colors">{visitor.visitorName}</h3>
                      <p className="text-xs text-gray-400 font-medium">ID: {visitor.visitorIdCard || 'N/A'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => securityService.printVisitorPass(visitor.id.toString())}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-500">Visitings:</span>
                    <span className="font-bold text-gray-800">{visitor.patientName || 'Facility/Staff'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-500">Entered:</span>
                    <span className="font-bold text-gray-800">{new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-gray-500">Ward:</span>
                    <span className="font-bold text-gray-800">{visitor.wardName || 'OPD'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCheckout(visitor.id)}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                  >
                    <X className="w-4 h-4" />
                    CHECK-OUT
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="flex flex-col items-center gap-4 opacity-20">
               <UserCheck className="w-20 h-20" />
               <h3 className="text-3xl font-black">ALL CLEAR</h3>
               <p className="font-bold">No visitors currently registered inside</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveVisitors;
