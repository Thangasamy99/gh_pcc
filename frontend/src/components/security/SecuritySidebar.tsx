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
  DoorOpen,
  FileText,
  UserCircle,
  Building2,
  Activity,
  Calendar,
  AlertCircle,
  Menu,
  Shield,
  ClipboardList,
  UserCheck,
  UserX,
  Hospital,
  DoorClosed,
  Bed
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SecuritySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  branchName?: string;
  userName?: string;
}

const SecuritySidebar: React.FC<SecuritySidebarProps> = ({ 
  isOpen, 
  onClose, 
  branchName = 'Buea General Hospital',
  userName = 'David Motuba'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['entry', 'visitors', 'wards']);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const displayUser = user?.firstName ? `${user.firstName} ${user.lastName}` : userName;

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
    if (path.includes('/security/entry') && !expandedItems.includes('entry')) {
      setExpandedItems(prev => [...prev, 'entry']);
    }
    if (path.includes('/security/visitors') && !expandedItems.includes('visitors')) {
      setExpandedItems(prev => [...prev, 'visitors']);
    }
    if (path.includes('/security/wards') && !expandedItems.includes('wards')) {
      setExpandedItems(prev => [...prev, 'wards']);
    }
    if (path.includes('/security/reports') && !expandedItems.includes('reports')) {
      setExpandedItems(prev => [...prev, 'reports']);
    }
  }, [location.pathname]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
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
      href: '/security/dashboard'
    },
    {
      id: 'entry',
      label: 'Entry Management',
      icon: DoorOpen,
      children: [
        {
          id: 'register-patient',
          label: 'Register Patient Entry',
          icon: UserPlus,
          href: '/security/entry/patient'
        },
        {
          id: 'patient-list',
          label: 'Patient List',
          icon: Users,
          href: '/security/patients'
        },
        {
          id: 'register-visitor',
          label: 'Register Visitor',
          icon: Users,
          href: '/security/entry/visitor'
        },
        {
          id: 'emergency-entry',
          label: 'Emergency Entry',
          icon: AlertCircle,
          href: '/security/entry/emergency'
        }
      ]
    },
    {
      id: 'visitors',
      label: 'Visitor Management',
      icon: Users,
      children: [
        {
          id: 'visitor-log',
          label: 'Visitor Log',
          icon: ClipboardList,
          href: '/security/visitors/log'
        },
        {
          id: 'active-visitors',
          label: 'Active Visitors',
          icon: UserCheck,
          href: '/security/visitors/active'
        },
        {
          id: 'visitor-exit',
          label: 'Visitor Exit',
          icon: UserX,
          href: '/security/visitors/exit'
        }
      ]
    },
    {
      id: 'wards',
      label: 'Facility Directory',
      icon: Hospital,
      href: '/security/wards'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      children: [
        {
          id: 'daily-visitors',
          label: 'Daily Visitors',
          icon: Calendar,
          href: '/security/reports/daily-visitors'
        },
        {
          id: 'patient-entry-report',
          label: 'Patient Entry Report',
          icon: Activity,
          href: '/security/reports/patient-entries'
        }
      ]
    }
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

      {/* Sidebar - Matching Super Admin Gradient Color */}
      <motion.aside
        className="fixed top-0 left-0 h-full w-64 bg-linear-to-b from-primary to-[#6a15b5] text-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">PCC HMS</h2>
              <p className="text-xs text-white/80">Security Guard</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{displayUser}</h3>
              <p className="text-xs text-white/80">{branchName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname.startsWith(item.href || '')
                        ? 'bg-white text-primary'
                        : 'hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(item.id) && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-11 mt-1 space-y-1"
                      >
                        {item.children.map((child) => (
                          <li key={child.id}>
                          <NavLink
                            to={child.href}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                                isActive
                                  ? 'bg-white/20 text-white font-medium'
                                  : 'hover:bg-white/10 text-white/80'
                              }`
                            }
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="text-sm">{child.label}</span>
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
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-primary font-medium shadow-lg'
                        : 'hover:bg-white/10 text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-8 px-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default SecuritySidebar;
