import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Activity, 
  UserRound, 
  Monitor, 
  FlaskConical, 
  Image as ImageIcon, 
  Pill, 
  Bed, 
  BarChart3, 
  FileText,
  Clock,
  MapPin,
  Bell,
  Search,
  User
} from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  subItems?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { 
    title: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/branch/dashboard' 
  },
  { 
    title: 'Patient Flow', 
    icon: Activity,
    subItems: [
      { title: 'Patient Tracking', path: '/branch/patients/track' },
      { title: 'Live Queue Status', path: '/branch/patients/queue' }
    ]
  },
  {
    title: 'User Management',
    icon: UserRound,
    subItems: [
      { title: 'Staff List', path: '/branch/users/staff' },
      { title: 'Doctor Management', path: '/branch/users/doctors' }
    ]
  },
  {
    title: 'Operations',
    icon: Monitor,
    subItems: [
      { title: 'Reception Overview', path: '/branch/operations/reception' },
      { title: 'Cashier Overview', path: '/branch/operations/cashier' },
      { title: 'Doctor Overview', path: '/branch/operations/doctor' }
    ]
  },
  {
    title: 'Medical Services',
    icon: FlaskConical,
    subItems: [
      { title: 'Lab Management', path: '/branch/services/lab' },
      { title: 'Imaging Management', path: '/branch/services/imaging' },
      { title: 'Pharmacy Management', path: '/branch/services/pharmacy' },
      { title: 'Ward / Admission', path: '/branch/services/ward' }
    ]
  },
  {
    title: 'Reports & Analytics',
    icon: BarChart3,
    subItems: [
      { title: 'Daily Summary', path: '/branch/reports/daily' },
      { title: 'Financial Report', path: '/branch/reports/financial' },
      { title: 'Medical Statistics', path: '/branch/reports/medical' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    subItems: [
      { title: 'Branch Info', path: '/branch/settings/info' },
      { title: 'Profile', path: '/branch/settings/profile' }
    ]
  }
];

const BranchAdminLayout: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<string[]>(['Dashboard']);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext) || {};

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-primary">
      {/* Sidebar */}
      <div className="w-80 h-full bg-gradient-to-b from-[#6C2BD9] to-[#4F09A3] text-white flex flex-col shadow-2xl relative z-20">
        {/* Logo Section */}
        <div className="p-8 flex items-center space-x-4 border-b border-white/10 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Branch HQ</h1>
            <p className="text-[10px] font-bold text-purple-200 tracking-widest mt-1 opacity-70">HMS OPERATIONAL CONTROL</p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide pb-20">
          {menuItems.map((item) => (
            <div key={item.title} className="space-y-1">
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                    location.pathname === item.path 
                      ? 'bg-white text-[#6C2BD9] shadow-xl shadow-indigo-900/20' 
                      : 'hover:bg-white/10 text-purple-100'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-[#6C2BD9]' : 'text-purple-300'}`} />
                    <span className="text-sm font-black uppercase tracking-widest">{item.title}</span>
                  </div>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                      openMenus.includes(item.title) ? 'bg-white/5' : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center text-purple-100">
                      <item.icon className="w-5 h-5 mr-3 text-purple-300 group-hover:text-white transition-colors" />
                      <span className="text-sm font-black uppercase tracking-widest leading-none">{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-purple-300 ${openMenus.includes(item.title) ? 'rotate-180 text-white' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {openMenus.includes(item.title) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/5 rounded-2xl mx-1"
                      >
                        {item.subItems?.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center px-12 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-l-2 ml-4 ${
                              location.pathname === sub.path 
                                ? 'text-white border-white' 
                                : 'text-purple-300 border-transparent hover:text-white hover:border-purple-300'
                            }`}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </div>

        {/* User Card */}
        <div className="p-6 bg-black/20 border-t border-white/5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/20 to-transparent flex items-center justify-center border border-white/20">
             <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-xs font-black truncate">{user?.firstName} {user?.lastName}</p>
             <p className="text-[10px] text-purple-300 font-bold uppercase tracking-tighter truncate leading-none mt-1">Branch Administrator</p>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg text-rose-300 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 relative z-10 shadow-sm">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#6C2BD9] transition-colors" />
            <input 
              type="text" 
              placeholder="Search patients, records, or tracking IDs..."
              className="w-full bg-gray-50/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#6C2BD9]/10 transition-all outline-none font-medium placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center space-x-6 ml-10">
            <div className="flex items-center text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
               <Clock className="w-4 h-4 mr-2 opacity-50 text-[#6C2BD9]" />
               <span className="text-xs font-black tracking-tight uppercase">Shift: Morning (7AM - 3PM)</span>
            </div>
            <button className="relative p-2.5 text-gray-400 hover:text-[#6C2BD9] hover:bg-purple-50 rounded-xl transition-all">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-10 bg-[#fbf9ff] custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BranchAdminLayout;
