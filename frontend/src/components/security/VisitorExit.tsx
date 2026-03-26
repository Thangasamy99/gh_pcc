import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, UserX, CheckCircle, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { toast } from 'react-hot-toast';

const VisitorExit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeResults, setActiveResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const data = await securityService.getActiveVisitors(2);
      const filtered = data.filter((v: any) => 
        v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.visitorPhone?.includes(searchTerm)
      );
      setActiveResults(filtered);
      if (filtered.length === 0) {
        toast.error('No matching active visitor found');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await securityService.checkoutVisitor(id, user.id);
      toast.success('DEPARTURE REGISTERED: Visitor has exited');
      setActiveResults(prev => prev.filter(v => v.id !== id));
      setSearchTerm('');
    } catch (error) {
      toast.error('Exit registration failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserX className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Hospital Exit Registration</h1>
        <p className="text-gray-500">Scan ID or search visitor to record departure</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div className="relative">
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
            placeholder="Search visitor by Name or Phone..."
            className="w-full pl-6 pr-32 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#9120e8] focus:bg-white transition-all outline-none text-xl font-bold placeholder:font-medium"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-[#9120e8] text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            {loading ? '...' : 'FIND VISITOR'}
          </button>
        </div>

        <AnimatePresence>
          {activeResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Matching Active Visitors</h3>
              {activeResults.map(v => (
                <div 
                  key={v.id}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-[#9120e8] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-black text-[#9120e8] shadow-sm">
                      {v.visitorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-lg text-gray-800">{v.visitorName}</p>
                      <p className="text-sm font-medium text-gray-400">Host: {v.patientName || 'Facility'}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCheckout(v.id)}
                    className="px-8 py-4 bg-red-600 text-white rounded-xl font-black flex items-center gap-3 hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95 group-hover:px-10"
                  >
                    REGISTER EXIT
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!searchTerm && activeResults.length === 0 && (
          <div className="flex items-center gap-4 p-6 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
            <Info className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium italic">
              Remember to collect the physical visitor pass before authorizing the exit on the system.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
            <ShieldAlert className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
               <h4 className="font-bold text-orange-900">Security Note</h4>
               <p className="text-sm text-orange-700">Check for any hospital materials being carried out without authorization.</p>
            </div>
         </div>
         <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
               <h4 className="font-bold text-emerald-900">Digital Log</h4>
               <p className="text-sm text-emerald-700">Exit time is automatically captured and added to the historical activity log.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VisitorExit;
