import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Users,
  FileText,
  UserCircle,
  Activity,
  Calendar,
  HeartPulse,
  ClipboardList,
  SendHorizontal,
  DoorOpen,
  Stethoscope,
  ListOrdered,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ReceptionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  branchName?: string;
  userName?: string;
}

const ReceptionSidebar: React.FC<ReceptionSidebarProps> = ({
  isOpen,
  onClose,
  branchName = 'Buea General Hospital',
  userName = 'Receptionist',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['patient', 'vitals', 'queue', 'reports']);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const displayUser = user?.firstName ? `${user.firstName} ${user.lastName}` : userName;
  const displayInitials = user?.firstName ? user.firstName[0] : 'R';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-expand based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/reception/receive-patient') || path.includes('/reception/patient-list')) {
      setExpandedItems((prev) => (prev.includes('patient') ? prev : [...prev, 'patient']));
    }
    if (path.includes('/reception/record-vitals')) {
      setExpandedItems((prev) => (prev.includes('vitals') ? prev : [...prev, 'vitals']));
    }
    if (
      path.includes('/reception/queue-management') ||
      path.includes('/reception/send-to-cashier') ||
      path.includes('/reception/assign-room')
    ) {
      setExpandedItems((prev) => (prev.includes('queue') ? prev : [...prev, 'queue']));
    }
    if (path.includes('/reception/daily-patients')) {
      setExpandedItems((prev) => (prev.includes('reports') ? prev : [...prev, 'reports']));
    }
  }, [location.pathname]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/reception/dashboard',
    },
    {
      id: 'patient',
      label: 'Patient Entry',
      icon: UserPlus,
      children: [
        {
          id: 'receive-patient',
          label: 'Receive Patient',
          icon: ClipboardList,
          href: '/reception/receive-patient',
        },
        {
          id: 'patient-list',
          label: 'Patient List',
          icon: Users,
          href: '/reception/patient-list',
        },
      ],
    },
    {
      id: 'vitals',
      label: 'Vitals & Check',
      icon: HeartPulse,
      children: [
        {
          id: 'record-vitals',
          label: 'Record Vitals',
          icon: Activity,
          href: '/reception/record-vitals',
        },
      ],
    },
    {
      id: 'queue',
      label: 'Queue Management',
      icon: ListOrdered,
      children: [
        {
          id: 'waiting-queue',
          label: 'Waiting Queue',
          icon: ClipboardList,
          href: '/reception/queue-management',
        },
        {
          id: 'send-to-cashier',
          label: 'Send to Cashier',
          icon: SendHorizontal,
          href: '/reception/send-to-cashier',
        },
        {
          id: 'assign-room',
          label: 'Assign Consultation Room',
          icon: DoorOpen,
          href: '/reception/assign-room',
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      children: [
        {
          id: 'daily-patients',
          label: 'Daily Patients',
          icon: BarChart3,
          href: '/reception/daily-patients',
        },
      ],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCircle,
      href: '/reception/profile',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 h-full w-64 text-white shadow-2xl z-50 overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #6C2BD9 0%, #9333EA 100%)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-[#6C2BD9]" />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">PCC HMS</h2>
              <p className="text-xs text-white/70 font-medium">Reception Portal</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-white/15">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="text-white font-bold text-lg">{displayInitials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">{displayUser}</h3>
              <p className="text-xs text-white/70">Receptionist</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex-1">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        item.children.some((child) => location.pathname === child.href)
                          ? 'bg-white/15 text-white'
                          : 'hover:bg-white/10 text-white/90'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-[18px] h-[18px]" />
                        <span className="text-[13px] font-medium">{item.label}</span>
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4 text-white/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedItems.includes(item.id) && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-10 mt-0.5 space-y-0.5"
                        >
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <NavLink
                                to={child.href}
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                      ? 'bg-white/20 text-white font-semibold'
                                      : 'hover:bg-white/10 text-white/70'
                                  }`
                                }
                              >
                                <child.icon className="w-4 h-4" />
                                <span className="text-[12.5px]">{child.label}</span>
                              </NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink
                    to={item.href || '#'}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white text-[#6C2BD9] font-semibold shadow-lg shadow-black/10'
                          : 'hover:bg-white/10 text-white/90'
                      }`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    <span className="text-[13px] font-medium">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-white/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/20 rounded-xl hover:bg-red-500/30 transition-all duration-300 text-red-100"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default ReceptionSidebar;
