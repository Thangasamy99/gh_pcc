import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BranchAdminSidebar from '../../components/branchadmin/BranchAdminSidebar';
import { Menu, Search, Bell, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BranchAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50/50">
      <BranchAdminSidebar isOpen={sidebarOpen} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between border-b border-gray-100 shadow-sm shadow-purple-900/5">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search patient, doctor, staff..."
                className="pl-12 pr-6 py-2.5 bg-gray-100/50 rounded-xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:bg-white transition-all border border-transparent focus:border-purple-600/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 text-gray-400 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BranchAdminLayout;
