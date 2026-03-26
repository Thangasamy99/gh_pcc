import React from 'react';
import { Menu, Search, Bell, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ReceptionHeaderProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

const ReceptionHeader: React.FC<ReceptionHeaderProps> = ({ onMenuToggle, sidebarOpen }) => {
  const { user } = useAuth();

  const displayUser = user?.firstName ? `${user.firstName} ${user.lastName}` : 'Receptionist';
  const displayInitials = user?.firstName ? user.firstName[0] : 'R';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-80 focus-within:ring-2 focus-within:ring-[#6C2BD9]/40 transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search patients, queue..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2" />
            RECEPTION ACTIVE
          </div>

          {/* Notifications */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg relative transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900 leading-none">{displayUser}</p>
              <p className="text-[10px] font-bold text-[#6C2BD9] mt-1 uppercase tracking-widest leading-none">
                Receptionist
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C2BD9] to-[#9333EA] flex items-center justify-center text-white font-bold shadow-md text-sm">
              {displayInitials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ReceptionHeader;
