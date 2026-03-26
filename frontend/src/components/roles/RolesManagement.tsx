import React, { useState, useEffect } from 'react';
import { roleService, Role } from '../../services/roleService';
import {
    Plus, Search, Filter, Shield, Settings, Info,
    ChevronDown, ChevronUp, ChevronRight, LayoutGrid, List as ListIcon, RefreshCw,
    Trash2, Edit2, ShieldCheck, Download, CheckCircle, XCircle,
    AlertCircle, Layers, MoreVertical, X, Key, Save, Loader2,
    ArrowLeft, ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CreateRoleStepper from './CreateRoleStepper';
import PermissionList from '../permissions/PermissionList';

interface RolesManagementProps {
    initialCreateMode?: boolean;
}

const RolesManagement: React.FC<RolesManagementProps> = ({ initialCreateMode = false }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateStepperOpen, setIsCreateStepperOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'roleName', direction: 'asc' });

    const [editFormData, setEditFormData] = useState<Partial<Role>>({
        roleName: '',
        roleCode: '',
        description: '',
        roleLevel: 5,
        permissionIds: []
    });

    useEffect(() => {
        fetchRoles();
        if (initialCreateMode) {
            setIsCreateStepperOpen(true);
        }
    }, [initialCreateMode]);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getAllRoles();
            // Handle both array and paginated object structure
            const rolesList = Array.isArray(data) ? data : (data as any)?.content || [];
            setRoles(rolesList);
        } catch (error) {
            toast.error('Failed to fetch system roles');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditModal = (role: Role) => {
        setEditingRole(role);
        setEditFormData({
            ...role,
            permissionIds: role.permissionIds || []
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        try {
            await roleService.updateRole(editingRole.id, editFormData);
            toast.success('Role configuration updated');
            setIsEditModalOpen(false);
            fetchRoles();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const handleDelete = async (role: Role) => {
        if (window.confirm(`Are you sure you want to decommission ${role.roleName}?`)) {
            try {
                await roleService.deleteRole(role.id);
                toast.success('Role decommissioned successfully');
                fetchRoles();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Decommissioning failed');
            }
        }
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.roleCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedRoles = [...filteredRoles].sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (sortConfig.direction === 'asc') return String(aVal).localeCompare(String(bVal));
        return String(bVal).localeCompare(String(aVal));
    });

    const handleSelectRole = (id: number, selected: boolean) => {
        if (selected) {
            setSelectedRoles(prev => [...prev, id]);
        } else {
            setSelectedRoles(prev => prev.filter(rid => rid !== id));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedRoles(filteredRoles.map(r => r.id));
        } else {
            setSelectedRoles([]);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-[#9120e8] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Capability Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Shield className="w-8 h-8 mr-3 text-purple-600" />
                        Access Control
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="hover:text-purple-600 cursor-pointer">Security</span>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-gray-900 font-medium">Role Matrix</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setIsCreateStepperOpen(true)}
                        className="flex items-center px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold text-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Enlist Role
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
                        placeholder="Search by role name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-bold shadow-sm transition-all active:scale-95">
                        <Filter className="w-5 h-5 mr-2 text-gray-400" />
                        Filters
                    </button>

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
                                    checked={filteredRoles.length > 0 && selectedRoles.length === filteredRoles.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {selectedRoles.length} selected
                                </span>
                            </div>
                            <button onClick={fetchRoles} className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 w-10"></th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('roleCode')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Code</span>
                                                {sortConfig.key === 'roleCode' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('roleName')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Assignment</span>
                                                {sortConfig.key === 'roleName' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('description')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Strategic Mission</span>
                                                {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4">
                                            <button onClick={() => handleSort('roleLevel')} className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600">
                                                <span>Priority</span>
                                                {sortConfig.key === 'roleLevel' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedRoles.map((role) => (
                                        <tr key={role.id} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoles.includes(role.id)}
                                                    onChange={(e) => handleSelectRole(role.id, e.target.checked)}
                                                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-500 uppercase">{role.roleCode}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${role.isSystemRole ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 capitalize">{role.roleName.replace(/_/g, ' ')}</p>
                                                        <p className="text-[10px] font-black uppercase text-[#9120e8] tracking-widest">{role.permissionIds?.length || 0} Controls</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-500 line-clamp-1 italic max-w-xs">{role.description || 'No strategic description defined...'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 ${role.isSystemRole ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-purple-100 text-purple-700 ring-purple-200'} rounded-full text-xs font-bold ring-1 uppercase tracking-widest`}>
                                                    Level {role.roleLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-1">
                                                    <button onClick={() => handleOpenEditModal(role)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all shadow-sm">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    {!role.isSystemRole && (
                                                        <button onClick={() => handleDelete(role)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all shadow-sm">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-all shadow-sm">
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
                        {sortedRoles.map((role) => (
                            <div key={role.id} className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${role.isSystemRole ? 'bg-amber-50 text-amber-500' : 'bg-purple-50 text-purple-600'} transition-all group-hover:bg-[#9120e8] group-hover:text-white`}>
                                        <Shield size={24} />
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                                        <button onClick={() => handleOpenEditModal(role)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-all active:scale-90">
                                            <Edit2 size={16} strokeWidth={2.5} />
                                        </button>
                                        {!role.isSystemRole && (
                                            <button onClick={() => handleDelete(role)} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-all active:scale-90">
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 capitalize tracking-tight">{role.roleName.replace(/_/g, ' ')}</h3>
                                    <code className="text-[10px] font-mono font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md mt-2 inline-block uppercase tracking-wider">{role.roleCode}</code>
                                </div>
                                <p className="mt-4 text-sm text-gray-400 line-clamp-2 min-h-[40px] leading-relaxed italic">"{role.description || 'No strategic description defined...'}"</p>
                                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">{role.permissionIds?.length || 0} Dynamic Controls</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${role.isSystemRole ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>LVL {role.roleLevel}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <CreateRoleStepper
                isOpen={isCreateStepperOpen}
                onClose={() => setIsCreateStepperOpen(false)}
                onSuccess={fetchRoles}
            />

            {/* Edit Role Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl relative"
                        >
                            <form onSubmit={handleUpdateRole} className="h-full flex flex-col">
                                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                                <Settings size={20} />
                                            </div>
                                            Modify Strategic Role
                                        </h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-13">Reconfiguring access permissions</p>
                                    </div>
                                    <button onClick={() => setIsEditModalOpen(false)} type="button" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all active:scale-90 shadow-sm">
                                        <X size={24} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1 space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 uppercase tracking-wide">Role Identity</label>
                                            <input
                                                required
                                                value={editFormData.roleName}
                                                onChange={(e) => setEditFormData({ ...editFormData, roleName: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700 shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-gray-700 uppercase tracking-wide">Access Code (Static)</label>
                                            <input
                                                disabled
                                                value={editFormData.roleCode}
                                                className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl opacity-60 font-mono text-sm uppercase tracking-wider shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-black text-gray-700 uppercase tracking-wide">Strategic Intent</label>
                                            <textarea
                                                value={editFormData.description}
                                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700 shadow-inner"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                            <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                                <Key size={16} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-lg font-black text-gray-900 tracking-tight">Capability Matrix Elevation</span>
                                        </div>
                                        <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                            <PermissionList
                                                selectedPermissionIds={editFormData.permissionIds || []}
                                                onChange={(ids) => setEditFormData({ ...editFormData, permissionIds: ids })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-gray-100 bg-[#fafafa] flex justify-end gap-4">
                                    <button onClick={() => setIsEditModalOpen(false)} type="button" className="px-10 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm">
                                        Abort Change
                                    </button>
                                    <button type="submit" className="px-12 py-4 bg-[#9120e8] hover:bg-[#7a1bc2] text-white rounded-2xl shadow-xl shadow-purple-100/50 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 active:scale-95 transition-all">
                                        Deploy Configuration
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Chevron icons since they might not be imported from lucide correctly above
const XIcon: React.FC<{size?: number}> = ({size = 24}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default RolesManagement;
