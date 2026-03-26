import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  ListTodo,
  Zap,
  FlaskConical,
  Image as ImageIcon,
  Pill,
  Receipt,
  History,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  BedDouble,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const CashierLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { path: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      label: 'Consultation Payment',
      items: [
        { path: '/cashier/consultation/pending', icon: ListTodo, label: 'Pending Consultation' },
        { path: '/cashier/consultation/process', icon: Zap, label: 'Process Consultation' },
      ]
    },
    {
      label: 'Service Payment',
      items: [
        { path: '/cashier/billing/lab', icon: FlaskConical, label: 'Lab Payment' },
        { path: '/cashier/billing/imaging', icon: ImageIcon, label: 'Imaging Payment' },
        { path: '/cashier/billing/pharmacy', icon: Pill, label: 'Pharmacy Payment' },
        { path: '/cashier/billing/admission', icon: BedDouble, label: 'Admission Payment' },
      ]
    },
    {
      label: 'Insurance & Credit',
      items: [
        { path: '/cashier/insurance', icon: ShieldCheck, label: 'Insurance Payment' },
        { path: '/cashier/credit', icon: Briefcase, label: 'Credit / Debt Payment' },
      ]
    },
    {
      label: 'Receipts',
      items: [
        { path: '/cashier/receipts/generate', icon: Receipt, label: 'Generate Receipt' },
        { path: '/cashier/receipts/history', icon: History, label: 'Payment History' },
      ]
    },
    {
      label: 'Reports',
      items: [
        { path: '/cashier/reports/daily', icon: TrendingUp, label: 'Daily Income Report' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#6C2BD9] to-[#9333EA] text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-purple-400/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CASH OFFICE</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <p className="px-3 text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                          isActive
                            ? 'bg-white text-[#6C2BD9] shadow-md shadow-purple-900/20 font-semibold'
                            : 'text-purple-100 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-purple-400/30 bg-purple-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white">{user?.username || 'Cashier'}</p>
              <p className="text-xs text-purple-200 truncate">{user?.branchName || 'Main Branch'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 text-white rounded-lg hover:bg-red-500/80 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Hospital Cashier Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CashierLayout;
