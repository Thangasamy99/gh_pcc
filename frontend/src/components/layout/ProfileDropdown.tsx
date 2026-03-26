import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
  Shield,
  Bell,
  Lock,
  Mail,
  Building2,
  Calendar,
  Activity,
  Globe,
  Edit,
  RefreshCw,
  Eye,
  History
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { toast } from 'react-toastify';

interface ProfileDropdownProps {
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    roleCode: string;
    branchName?: string;
    profilePhoto?: string;
    lastLogin?: string;
  };
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) return null;
  const { logout } = authContext;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!user.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleColor = (roleCode: string) => {
    switch(roleCode) {
      case 'ROLE_SUPER_ADMIN':
      case 'SUPER_ADMIN':
        return 'from-purple-600 to-purple-800';
      case 'ROLE_BRANCH_ADMIN':
      case 'BRANCH_ADMIN':
        return 'from-blue-600 to-blue-800';
      case 'ROLE_DOCTOR':
        return 'from-green-600 to-green-800';
      case 'ROLE_NURSE':
        return 'from-teal-600 to-teal-800';
      default:
        return 'from-indigo-600 to-indigo-800';
    }
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: UserCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'account',
      label: 'Account',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Lock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    }
  ];

  const recentActivities = [
    { action: 'Logged in', time: '2 minutes ago', ip: '127.0.0.1' },
    { action: 'Viewed Dashboard', time: '1 hour ago', ip: '127.0.0.1' }
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar with Gradient */}
        <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.roleCode)} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials()
          )}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          />
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
          <p className="text-xs text-gray-500 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {user.role}
          </p>
        </div>

        {/* Chevron with Animation */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${getRoleColor(user.roleCode)} p-6 text-white`}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-white/80 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-white/60">Last Login</p>
                  <p className="text-sm font-semibold">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-white/60">Branch</p>
                  <p className="text-sm font-semibold truncate">{user.branchName || 'Head Office'}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id
                        ? `${item.bgColor} ${item.color}`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{user.email}</p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Branch</p>
                            <p className="text-sm font-medium">{user.branchName || 'Head Office'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                      <div className="space-y-2">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time} • {activity.ip}</p>
                            </div>
                            <Activity className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-3"
                  >
                    {[
                      { icon: User, label: 'Personal Information', description: 'Update details' },
                      { icon: Bell, label: 'Notifications', description: 'Manage preferences' },
                      { icon: Globe, label: 'Language', description: 'Set regional preferences' }
                    ].map((item, index) => (
                      <button key={index} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-3"
                  >
                    {[
                      { icon: Lock, label: 'Change Password', description: 'Update regularly' },
                      { icon: Shield, label: '2FA', description: 'Add extra security' },
                      { icon: History, label: 'Login History', description: 'Review logins' }
                    ].map((item, index) => (
                      <button key={index} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with Logout */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <motion.button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoggingOut ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
