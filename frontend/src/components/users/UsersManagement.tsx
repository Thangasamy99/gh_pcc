import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { branchService } from '../../services/branchService';
import { UserResponse } from '../../types';
import {
    Plus, Search, Filter, Mail, Phone, Building2,
    MoreVertical, Lock, Unlock, Edit2, UserPlus,
    UserMinus, ShieldCheck, User as UserIcon, X,
    ChevronDown, ChevronUp, ChevronRight, LayoutGrid, List as ListIcon, RefreshCw,
    BarChart3, Trash2, CheckCircle, XCircle, AlertCircle, Download,
    MapPin, Globe, BadgeCheck
} from 'lucide-react';
import UserCreateStepper from './UserCreateStepper';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface UsersManagementProps {
    initialCreateMode?: boolean;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ initialCreateMode = false }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isStepperOpen, setIsStepperOpen] = useState(initialCreateMode);
    const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'firstName', direction: 'asc' });

    useEffect(() => {
        if (initialCreateMode) {
            setIsStepperOpen(true);
        }
    }, [initialCreateMode]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData, branchesData] = await Promise.all([
                userService.getAllUsers(),
                roleService.getAllRoles(),
                branchService.getAllBranches()
            ]);
            
            // Handle both array and paginated object structure
            const usersList = Array.isArray(usersData) ? usersData : (usersData as any)?.content || [];
            setUsers(usersList);
            setRoles(rolesData || []);
            setBranches(branchesData || []);
        } catch (error) {
            toast.error('Failed to synchronize personnel headquarters');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            const usersList = Array.isArray(data) ? data : (data as any)?.content || [];
            setUsers(usersList);
        } catch (error) {
            toast.error('Failed to refresh personnel database');
        }
    };

    const handleLockToggle = async (user: UserResponse) => {
        try {
            if (user.isLocked) {
                await userService.unlockUser(user.id);
                toast.success(`Access restored for ${user.username}`);
            } else {
                await userService.lockUser(user.id);
                toast.warning(`Access revoked for ${user.username}`);
            }
            fetchUsers();
        } catch (error) {
            toast.error('Tactical override failed');
        }
    };

    const handleDelete = async (user: UserResponse) => {
        if (window.confirm(`Are you sure you want to decommission ${user.username}?`)) {
            try {
                // Backend implements soft delete via isActive = false in deleteUser method
                await userService.deleteUser(user.id);
                toast.success(`Personnel ${user.username} decommissioned (Soft Deleted)`);
                fetchUsers();
            } catch (error) {
                toast.error('Decommissioning sequence failed');
            }
        }
    };

    const handleEdit = (user: UserResponse) => {
        setEditingUser(user);
        setIsStepperOpen(true);
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const getRoleBadgeStyles = (roleName?: string) => {
        const role = (roleName || '').toUpperCase();
        if (role.includes('ADMIN')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (role.includes('DOCTOR')) return 'bg-green-100 text-green-700 border-green-200';
        if (role.includes('NURSE')) return 'bg-teal-100 text-teal-700 border-teal-200';
        if (role.includes('PHARM')) return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === '' || user.roleName === selectedRole;
        const matchesBranch = selectedBranch === '' || user.branchName === selectedBranch;

        return matchesSearch && matchesRole && matchesBranch;
    });

    const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
            return String(aVal).localeCompare(String(bVal));
        }
        return String(bVal).localeCompare(String(aVal));
    });

    const handleSelectUser = (id: number, selected: boolean) => {
        if (selected) {
            setSelectedUsers(prev => [...prev, id]);
        } else {
            setSelectedUsers(prev => prev.filter(uid => uid !== id));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-[#9120e8] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Personnel Database...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShieldCheck className="w-8 h-8 mr-3 text-purple-600" />
                        Personnel Command
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="hover:text-purple-600 cursor-pointer">Dashboard</span>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-gray-900 font-medium">User Management</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => { setEditingUser(null); setIsStepperOpen(true); }}
                        className="flex items-center px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold text-sm"
                    >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Enlist Staff
                    </button>
                    <div className="h-8 w-[1px] bg-gray-200 mx-2" />
                    <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-transparent">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer"
                        >
                            <option value="">All Roles</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.roleName}>{r.roleName.replace(/ROLE_/g, '').replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-transparent">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer"
                        >
                            <option value="">All Branches</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.branchName}>{b.branchName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content View */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                        {/* Table Header Controls */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="checkbox"
                                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {selectedUsers.length} selected
                                </span>
                            </div>
                            <button onClick={fetchUsers} className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 w-10"></th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('username')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Code</span>
                                                {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('firstName')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Staff Name</span>
                                                {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('branchName')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Assignment</span>
                                                {sortConfig.key === 'branchName' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('isLocked')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Status</span>
                                                {sortConfig.key === 'isLocked' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-500 uppercase">USR-{user.id.toString().padStart(3, '0')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-br from-[#9120e8] to-[#92f] text-white font-bold text-sm shadow-md`}>
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-gray-500">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center text-sm text-gray-600 font-medium">
                                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                        {user.branchName || 'Global Asset'}
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadgeStyles(user.roleName)}`}>
                                                        {(user.roleName || 'No Role').replace(/ROLE_/g, '').replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isLocked ? (
                                                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold ring-1 ring-red-200">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        LOCKED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-200">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button onClick={() => handleLockToggle(user)} className={`p-2 rounded-lg transition-all ${user.isLocked ? 'hover:bg-green-100 text-green-600' : 'hover:bg-red-100 text-red-600'}`}>
                                                        {user.isLocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                                    </button>
                                                    <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(user)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sortedUsers.map((user) => (
                            <div key={user.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#9120e8] to-[#92f] text-white flex items-center justify-center text-xl font-black shadow-lg">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h3>
                                        <p className="text-[11px] font-black text-purple-600 uppercase tracking-[0.15em] mb-4">
                                            {(user.roleName || 'No Role').replace(/ROLE_/g, '').replace(/_/g, ' ')}
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-600 transition-colors">
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Building2 size={14} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest">{user.branchName || 'No Branch'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.isLocked ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{user.isLocked ? 'Locked' : 'Active'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleLockToggle(user)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                                            {user.isLocked ? <Unlock size={18} /> : <Lock size={18} />}
                                        </button>
                                        <button onClick={() => handleEdit(user)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stepper Modal */}
            <AnimatePresence>
                {isStepperOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[40px] bg-white shadow-2xl relative"
                        >
                             <button
                                onClick={() => { setIsStepperOpen(false); setEditingUser(null); navigate('/superadmin/users'); }}
                                className="absolute right-8 top-8 z-10 w-12 h-12 bg-white/50 border border-black/5 rounded-2xl flex items-center justify-center hover:bg-white text-gray-900 transition-all"
                            >
                                <X size={24} />
                            </button>
                            <UserCreateStepper
                                editUser={editingUser}
                                onSuccess={() => { setIsStepperOpen(false); setEditingUser(null); fetchUsers(); navigate('/superadmin/users'); }}
                                onCancel={() => { setIsStepperOpen(false); setEditingUser(null); navigate('/superadmin/users'); }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersManagement;
