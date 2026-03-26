import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Activity, 
  Monitor, 
  Stethoscope, 
  CreditCard, 
  FlaskConical, 
  Image, 
  Pill, 
  Bed, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarItemProps {
  item: any;
  isOpen: boolean;
  isActive: boolean;
}

const SidebarItem = ({ item, isOpen, isActive }: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children.some((child: any) => location.pathname === child.path);

  useEffect(() => {
    if (isChildActive) setIsExpanded(true);
  }, [isChildActive]);

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) => `
          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
          ${isActive 
            ? 'bg-white/20 text-white shadow-lg shadow-purple-900/20' 
            : 'text-purple-100 hover:bg-white/10 hover:text-white'}
        `}
      >
        <item.icon className="w-5 h-5" />
        <span className={`text-sm font-medium transition-all duration-300 ${isOpen ? 'opacity-100' : 'hidden'}`}>
          {item.text}
        </span>
      </NavLink>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
          ${isChildActive ? 'text-white' : 'text-purple-100 hover:bg-white/10 hover:text-white'}
        `}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="w-5 h-5" />
          <span className={`text-sm font-medium ${isOpen ? 'opacity-100' : 'hidden'}`}>
            {item.text}
          </span>
        </div>
        {isOpen && (
          isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 space-y-1"
          >
            {item.children.map((child: any) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) => `
                  block px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300
                  ${isActive ? 'text-white bg-white/10' : 'text-purple-200 hover:text-white hover:bg-white/5'}
                `}
              >
                {child.text}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BranchAdminSidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/branchadmin/dashboard' },
    {
      text: 'Patient Flow',
      icon: Activity,
      children: [
        { text: 'Patient Tracking', path: '/branchadmin/patient-tracking' },
        { text: 'Live Queue Status', path: '/branchadmin/live-queue' },
      ],
    },
    {
      text: 'User Management',
      icon: Users,
      children: [
        { text: 'Staff List', path: '/branchadmin/staff-list' },
        { text: 'Doctor Management', path: '/branchadmin/doctors' },
      ],
    },
    {
      text: 'Operations',
      icon: Monitor,
      children: [
        { text: 'Reception Overview', path: '/branchadmin/reception-overview' },
        { text: 'Cashier Overview', path: '/branchadmin/cashier-overview' },
        { text: 'Doctor Overview', path: '/branchadmin/doctor-overview' },
      ],
    },
    {
      text: 'Medical Services',
      icon: Stethoscope,
      children: [
        { text: 'Lab Management', path: '/branchadmin/lab' },
        { text: 'Imaging Management', path: '/branchadmin/imaging' },
        { text: 'Pharmacy Management', path: '/branchadmin/pharmacy' },
        { text: 'Ward / Admission', path: '/branchadmin/ward' },
      ],
    },
    {
      text: 'Reports & Analytics',
      icon: BarChart3,
      children: [
        { text: 'Daily Summary', path: '/branchadmin/daily-summary' },
        { text: 'Financial Report', path: '/branchadmin/financial-report' },
        { text: 'Medical Statistics', path: '/branchadmin/medical-stats' },
      ],
    },
    { text: 'Settings', icon: Settings, path: '/branchadmin/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#6C2BD9] to-[#9333EA] text-white flex flex-col z-50 shadow-2xl"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
          <Activity className="w-6 h-6 text-white" />
        </div>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-xl font-bold tracking-tight">HMS</h1>
            <p className="text-[10px] text-purple-200 uppercase font-bold tracking-widest">Branch Admin</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 no-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.text} 
            item={item} 
            isOpen={isOpen} 
            isActive={false} 
          />
        ))}
      </div>

      {/* User & Logout */}
      <div className="p-4 bg-black/10 backdrop-blur-md">
        {isOpen && (
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-purple-200">{user?.branchName || 'Buea General'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 px-4 py-3 bg-red-500/20 rounded-xl 
            hover:bg-red-500/30 transition-all duration-300 text-red-100
            ${!isOpen && 'justify-center'}
          `}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default BranchAdminSidebar;
