import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import SecuritySidebar from './SecuritySidebar';
import { useAuth } from '../../hooks/useAuth';

const SecurityLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  
  const displayUser = user?.firstName ? `${user.firstName} ${user.lastName}` : 'David Motuba';
  const displayInitials = user?.firstName ? user.firstName[0] : 'D';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Security Dedicated Sidebar */}
      <SecuritySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={displayUser}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-72 focus-within:ring-2 focus-within:ring-[#9120e8] transition-all">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Universal Search..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                GATE 01 SYSTEM ACTIVE
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-all" title="Notifications">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">
                    {displayUser}
                  </p>
                  <p className="text-[10px] font-bold text-[#9120e8] mt-1 uppercase tracking-widest leading-none">
                    Security Guard
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9120e8] to-[#6a15b5] flex items-center justify-center text-white font-bold shadow-md">
                  {displayInitials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SecurityLayout;
