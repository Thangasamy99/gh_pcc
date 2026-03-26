
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Activity,
    AlertCircle,
    TrendingUp,
    Clock,
    RefreshCw,
    ChevronRight,
    ArrowUp,
    Menu,
    Shield,
    Search,
    Bell,
    Cpu,
    DollarSign
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useDashboard } from '../hooks/useDashboard';
import { formatNumber, formatDate, formatTimeAgo } from '../utils/formatters';
import { AuthContext } from '../components/auth/AuthContext';

// --- Subcomponents ---

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; change: string; trend: 'up' | 'down' | 'stable'; color: string }> = ({
    title, value, icon, change, trend, color
}) => {
    const bgMap: Record<string, string> = {
        'blue': 'bg-blue-50',
        'purple': 'bg-purple-50',
        'green': 'bg-green-50',
        'emerald': 'bg-emerald-50',
    };
    const iconBgMap: Record<string, string> = {
        'blue': 'bg-blue-50',
        'purple': 'bg-purple-50',
        'green': 'bg-green-50',
        'emerald': 'bg-emerald-50',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-xl transition-all"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${iconBgMap[color] || 'bg-gray-50'} rounded-xl`}>{icon}</div>
                <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'} flex items-center`}>
                    {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
                    {change}
                </span>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        </motion.div>
    );
};

const MonitoringProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const colorMap: Record<string, string> = {
        '[#9120e8]': 'bg-[#9120e8]',
        'blue-500': 'bg-blue-500',
        'green-500': 'bg-green-500',
        'primary-600': 'bg-[#9120e8]',
    };

    return (
        <div>
            <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="font-bold text-gray-900">{value}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={`h-1.5 rounded-full ${colorMap[color] || 'bg-purple-500'}`}
                />
            </div>
        </div>
    );
};

const StaffRow: React.FC<{ label: string; count: number; percentage: number; color: string }> = ({ label, count, percentage, color }) => {
    const colorMap: Record<string, string> = {
        'blue': 'bg-blue-500',
        'purple': 'bg-purple-500',
        'yellow': 'bg-yellow-500',
        'emerald': 'bg-emerald-500',
    };

    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${colorMap[color] || 'bg-gray-400'} mr-3 group-hover:scale-150 transition-transform`} />
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-900">{count}</span>
                <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-lg">{percentage}%</span>
            </div>
        </div>
    );
};

const SuperAdminDashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
    const { stats, revenue, recentActivities, loading, error, refresh } =
        useDashboard(timeRange);

    const authContext = useContext(AuthContext);
    const user = authContext?.user || {
        firstName: 'System',
        lastName: 'Admin',
        email: 'super.admin@pcc.cm',
        roleCode: 'SUPER_ADMIN'
    };

    const userData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.roleCode,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-[#9120e8] mx-auto"></div>
                    <p className="mt-4 text-[#9120e8] animate-pulse font-medium">Synchronizing with Central Database...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={refresh}
                        className="w-full py-3 bg-[#9120e8] text-white rounded-xl hover:bg-[#7b1bc5] transition-all shadow-lg hover:shadow-purple-200 font-bold"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userData={userData} />

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {/* Header */}
                <header className="bg-white border-b sticky top-0 z-30 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-96">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Universal search..."
                                    className="bg-transparent border-none outline-none text-sm w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 mr-4">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500 font-mono">{formatDate(new Date())}</span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-6 h-6 text-gray-500" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                            </button>
                            <button
                                onClick={refresh}
                                className="p-2 hover:bg-purple-50 rounded-lg group transition-all"
                            >
                                <RefreshCw className="w-5 h-5 text-[#9120e8] group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8 pb-12">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header / Stats Period */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
                                <p className="text-gray-500 mt-1">Real-time analytical data from all 16 hospital branches</p>
                            </div>
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border">
                                {(['today', 'week', 'month'] as const).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setTimeRange(r)}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === r
                                                ? 'bg-[#9120e8] text-white shadow-md'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Branches"
                                value={stats?.totalBranches || 16}
                                icon={<Building2 className="w-6 h-6 text-blue-600" />}
                                change="+1"
                                trend="up"
                                color="blue"
                            />
                            <StatCard
                                title="Global Users"
                                value={stats?.totalUsers || 245}
                                icon={<Users className="w-6 h-6 text-purple-600" />}
                                change="+12"
                                trend="up"
                                color="purple"
                            />
                            <StatCard
                                title="Active Sessions"
                                value={stats?.activeSessions || 42}
                                icon={<Activity className="w-6 h-6 text-green-600" />}
                                change="+8%"
                                trend="up"
                                color="green"
                            />
                            <StatCard
                                title="System Health"
                                value={stats?.errorRate ? `${stats.errorRate} Err` : 'Excellent'}
                                icon={<Shield className="w-6 h-6 text-emerald-600" />}
                                change="99.9% Uptime"
                                trend="stable"
                                color="emerald"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* System Monitoring */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 flex items-center">
                                        <Cpu className="w-5 h-5 mr-2 text-[#9120e8]" />
                                        Infrastructure
                                    </h3>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">LIVE</span>
                                </div>

                                <div className="space-y-4">
                                    <MonitoringProgress label="Database Cluster" value={98} color="[#9120e8]" />
                                    <MonitoringProgress label="Central Storage" value={45} color="blue-500" />
                                    <MonitoringProgress label="API Gateway" value={12} color="green-500" />
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Latency</p>
                                        <p className="text-lg font-bold text-gray-800">24ms</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Cache Hit</p>
                                        <p className="text-lg font-bold text-gray-800">92%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2 text-[#9120e8]" />
                                        Revenue Stream
                                    </h3>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>

                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm">Monthly Total (Cumulative)</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-1">
                                        XAF {formatNumber(revenue?.totalRevenue || 1250400)}
                                    </p>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mr-3">
                                            <TrendingUp className="w-4 h-4 text-[#9120e8]" />
                                        </div>
                                        <span className="text-sm font-medium text-purple-900">Growth vs LY</span>
                                    </div>
                                    <span className="text-lg font-bold text-[#9120e8]">+14.2%</span>
                                </div>
                            </div>

                            {/* User Trends */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                                <h3 className="font-bold text-gray-900 flex items-center mb-6">
                                    <Users className="w-5 h-5 mr-2 text-[#9120e8]" />
                                    Staff Distribution
                                </h3>
                                <div className="space-y-4">
                                    <StaffRow label="Doctors" count={42} percentage={17} color="blue" />
                                    <StaffRow label="Nurses" count={128} percentage={52} color="purple" />
                                    <StaffRow label="Admin Staff" count={56} percentage={23} color="yellow" />
                                    <StaffRow label="Lab Techs" count={19} percentage={8} color="emerald" />
                                </div>
                            </div>
                        </div>

                        {/* Audit Logs Table */}
                        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-[#9120e8]" />
                                    Global Security Audit
                                </h3>
                                <button className="text-[#9120e8] text-sm font-bold hover:underline">View All Records</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Administrator</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Operation</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Module</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Source IP</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentActivities.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-[#9120e8] font-bold text-xs mr-3">
                                                            {log.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{log.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600 font-mono">{log.action}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                        {log.module}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.ipAddress}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {formatTimeAgo(log.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                        {recentActivities.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                    No audit records found in the current period.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
