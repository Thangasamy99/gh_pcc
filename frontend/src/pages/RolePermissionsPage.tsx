import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, Search, ShieldCheck, Key, Lock, Layers, Save, 
    RefreshCw, ChevronDown, ChevronRight, CheckSquare, Square,
    Hexagon, Activity, Zap, Shield, ArrowRight, Info, LayoutGrid, List as ListIcon
} from 'lucide-react';
import { roleService, Role, Permission } from '../services/roleService';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';

const RolePermissionsPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [assignedPermissionIds, setAssignedPermissionIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [rolesData, permsData] = await Promise.all([
                roleService.getAllRoles(),
                roleService.getAllPermissions()
            ]);
            setRoles(rolesData);
            setPermissions(permsData);
            setExpandedModules(Array.from(new Set(permsData.map(p => p.module))));
        } catch (error) {
            toast.error('Failed to sync security infrastructure');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelect = async (roleId: number) => {
        setSelectedRoleId(roleId);
        setLoading(true);
        try {
            const rolePerms = await roleService.getRolePermissions(roleId);
            setAssignedPermissionIds(rolePerms.map(p => p.id));
        } catch (error) {
            toast.error('Failed to decrypt role permissions');
        } finally {
            setLoading(false);
        }
    };

    const togglePermission = (id: number) => {
        setAssignedPermissionIds(prev => 
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const toggleModule = (module: string, perms: Permission[]) => {
        const permsInModule = perms.map(p => p.id);
        const allAssigned = permsInModule.every(id => assignedPermissionIds.includes(id));
        
        if (allAssigned) {
            setAssignedPermissionIds(prev => prev.filter(id => !permsInModule.includes(id)));
        } else {
            setAssignedPermissionIds(prev => [...new Set([...prev, ...permsInModule])]);
        }
    };

    const handleSave = async () => {
        if (!selectedRoleId) return;
        setSaving(true);
        try {
            await roleService.bulkUpdateRolePermissions(selectedRoleId, assignedPermissionIds);
            toast.success('Capability Matrix Deployed Successfully!');
        } catch (error) {
            toast.error('Matrix deployment failed');
        } finally {
            setSaving(false);
        }
    };

    const groupedPermissions = permissions.reduce((acc, curr) => {
        if (!acc[curr.module]) acc[curr.module] = [];
        acc[curr.module].push(curr);
        return acc;
    }, {} as Record<string, Permission[]>);

    const filteredPermissionsByModule = Object.entries(groupedPermissions).reduce((acc, [module, perms]) => {
        const filtered = perms.filter(p => 
            p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) acc[module] = filtered;
        return acc;
    }, {} as Record<string, Permission[]>);

    const selectedRole = roles.find(r => r.id === selectedRoleId);

    return (
        <Layout>
            <div className="space-y-8 max-w-[1600px] mx-auto p-2 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-[#9120e8] rounded-[22px] flex items-center justify-center shadow-[#e5d5f2] shadow-2xl transition-transform hover:rotate-12">
                            <Zap className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                Tactical Assignment Matrix
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 mt-1 font-bold">
                                <span className="hover:text-purple-600 cursor-pointer">Security</span>
                                <ChevronRight className="w-4 h-4 mx-1" />
                                <span className="text-gray-900 font-black">Role-Permission Mapping</span>
                            </div>
                        </div>
                    </div>

                    {selectedRoleId && (
                        <div className="flex items-center gap-4">
                            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Selected Mode</span>
                                <span className="text-sm font-black text-purple-600 uppercase tracking-tight">{selectedRole?.roleName.replace(/_/g, ' ')}</span>
                            </div>
                             <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-3 px-8 py-4 bg-[#9120e8] hover:bg-[#7a1bc2] text-white rounded-[22px] shadow-2xl shadow-purple-200 font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 active:scale-95 group"
                            >
                                {saving ? (
                                    <RefreshCw className="animate-spin" size={18} />
                                ) : (
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                )}
                                <span>Deploy Matrix</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Role Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Operational Roles</h2>
                                <Activity className="w-4 h-4 text-purple-200" />
                            </div>
                            <div className="space-y-3">
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleRoleSelect(role.id)}
                                        className={`w-full text-left p-5 rounded-3xl transition-all relative overflow-hidden group ${
                                            selectedRoleId === role.id 
                                            ? 'bg-purple-50 text-purple-700 shadow-xl shadow-purple-50' 
                                            : 'bg-white hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {selectedRoleId === role.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600" />
                                        )}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${selectedRoleId === role.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-50 text-gray-300 group-hover:bg-purple-100 group-hover:text-purple-600'}`}>
                                                <Shield size={18} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase tracking-tight">{role.roleName.replace(/_/g, ' ')}</p>
                                                <p className="text-[9px] font-black uppercase text-gray-400 mt-1 opacity-60 tracking-[0.1em]">{role.roleCode}</p>
                                            </div>
                                            {selectedRoleId === role.id && (
                                                <div className="ml-auto w-2 h-2 rounded-full bg-purple-600" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedRole && (
                            <div className="bg-gradient-to-br from-purple-900 to-[#1a0533] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group border-4 border-purple-800/30">
                                <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <Hexagon size={200} fill="white" />
                                </div>
                                <h3 className="text-purple-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    <div className="w-4 h-[2px] bg-purple-400 rounded-full" /> Intelligence Report
                                </h3>
                                <div className="mb-6">
                                    <h4 className="text-2xl font-black uppercase tracking-tight leading-none">{selectedRole.roleName.replace(/_/g, ' ')}</h4>
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-2">Classified Privilege LVL {selectedRole.roleLevel}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
                                        <p className="text-[9px] font-black text-purple-300 uppercase tracking-widest mb-1 opacity-60">Status</p>
                                        <p className="font-black text-lg text-green-400 uppercase">Active</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm shadow-inner">
                                        <p className="text-[9px] font-black text-purple-300 uppercase tracking-widest mb-1 opacity-60">Permissions</p>
                                        <p className="font-black text-lg text-purple-200">{assignedPermissionIds.length}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-purple-200/70 leading-relaxed font-medium line-clamp-3 italic">"{selectedRole.description || 'No specialized description provided for this operational role profile.'}"</p>
                            </div>
                        )}
                    </div>

                    {/* Permissions Matrix */}
                    <div className="lg:col-span-9 space-y-6">
                        {!selectedRoleId ? (
                            <div className="bg-white p-24 rounded-[60px] border-4 border-dashed border-gray-50 flex flex-col items-center justify-center text-center space-y-8 min-h-[600px] shadow-inner">
                                <div className="p-10 bg-gray-50 rounded-[40px] flex items-center justify-center mb-4 transition-transform hover:scale-105 shadow-sm">
                                    <LayoutGrid className="text-gray-200" size={80} strokeWidth={1} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-300 tracking-tight uppercase">Authorization Required</h2>
                                    <p className="text-gray-400 max-w-sm mx-auto mt-4 font-bold text-sm leading-relaxed">Please select a strategic role from the operational roster to manage its capability matrix.</p>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-100" />)}
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="flex flex-col items-center justify-center h-[600px] space-y-4">
                                <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Scanning Neural Network...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all focus-within:ring-4 focus-within:ring-purple-50">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Search size={22} strokeWidth={3} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filter specific security controls or capability patterns..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-lg font-black placeholder-gray-300 text-gray-700 tracking-tight"
                                    />
                                    <div className="bg-purple-50 px-6 py-2 rounded-2xl border border-purple-100">
                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{Object.keys(filteredPermissionsByModule).length} Vectors Found</span>
                                    </div>
                                </div>

                                <div className="space-y-8 pb-20">
                                    {Object.entries(filteredPermissionsByModule).map(([module, perms]) => {
                                        const permsInModule = perms.map(p => p.id);
                                        const selectedInModule = permsInModule.filter(id => assignedPermissionIds.includes(id));
                                        const isFullySelected = permsInModule.length > 0 && permsInModule.every(id => assignedPermissionIds.includes(id));
                                        const isPartiallySelected = selectedInModule.length > 0 && !isFullySelected;
                                        const isExpanded = expandedModules.includes(module);

                                        return (
                                            <motion.div
                                                key={module}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group/module"
                                            >
                                                <div className={`p-8 flex items-center justify-between transition-all ${isExpanded ? 'bg-purple-50/20' : 'hover:bg-gray-50/50'}`}>
                                                    <div className="flex items-center gap-6">
                                                        <button 
                                                            onClick={() => setExpandedModules(prev => isExpanded ? prev.filter(m => m !== module) : [...prev, module])}
                                                            className={`p-3 rounded-2xl transition-all ${isExpanded ? 'bg-purple-600 text-white rotate-90 shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-purple-600'}`}
                                                        >
                                                            <ChevronRight size={20} strokeWidth={3} />
                                                        </button>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-white shadow-xl rounded-[20px] flex items-center justify-center text-purple-600 border border-purple-50 group-hover/module:rotate-6 transition-transform">
                                                                <Layers size={24} strokeWidth={2.5} />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-xl font-black text-gray-900 capitalize tracking-tight">{module} Segment</h2>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 opacity-60">{perms.length} Vector Keys</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{selectedInModule.length} Allocated</span>
                                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">/ {perms.length}</span>
                                                            </div>
                                                            <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                                <div 
                                                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${isFullySelected ? 'bg-purple-600 shadow-lg' : 'bg-amber-400'}`}
                                                                    style={{ width: `${(selectedInModule.length / perms.length) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => toggleModule(module, perms)}
                                                            className={`flex items-center gap-3 px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                                                isFullySelected 
                                                                ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-200 scale-105' 
                                                                : isPartiallySelected 
                                                                ? 'bg-purple-50 border-purple-200 text-purple-700' 
                                                                : 'bg-white border-gray-100 text-gray-400 hover:border-purple-300 hover:text-purple-600'
                                                            }`}
                                                        >
                                                            {isFullySelected ? <CheckSquare size={16} strokeWidth={2.5}/> : isPartiallySelected ? <ShieldCheck size={16} strokeWidth={2.5}/> : <Square size={16} strokeWidth={2.5}/>}
                                                            <span>{isFullySelected ? 'Revoke All' : 'Authorize All'}</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.4, ease: "circOut" }}
                                                            className="overflow-hidden border-t border-gray-50"
                                                        >
                                                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-gradient-to-b from-purple-50/10 to-transparent">
                                                                {perms.map(perm => (
                                                                    <button
                                                                        key={perm.id}
                                                                        onClick={() => togglePermission(perm.id)}
                                                                        className={`group/perm flex items-center text-left p-5 rounded-[28px] transition-all relative border-2 ${
                                                                            assignedPermissionIds.includes(perm.id)
                                                                            ? 'bg-white border-purple-500 shadow-xl shadow-purple-100/50'
                                                                            : 'bg-white border-gray-50 hover:border-purple-200 hover:bg-purple-50/30'
                                                                        }`}
                                                                    >
                                                                        <div className="flex-1">
                                                                            <h4 className={`text-sm font-black uppercase tracking-tight ${assignedPermissionIds.includes(perm.id) ? 'text-gray-900' : 'text-gray-400 group-hover/perm:text-gray-600'}`}>
                                                                                {perm.permissionName.replace(/_/g, ' ')}
                                                                            </h4>
                                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                                <code className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-[0.1em] ${assignedPermissionIds.includes(perm.id) ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-300 border-transparent'}`}>
                                                                                    {perm.permissionCode}
                                                                                </code>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${
                                                                            assignedPermissionIds.includes(perm.id) 
                                                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 rotate-[360deg]' 
                                                                            : 'bg-gray-50 text-gray-200 group-hover/perm:bg-purple-100 group-hover/perm:text-purple-400'
                                                                        }`}>
                                                                            <ShieldCheck size={18} strokeWidth={2.5} />
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RolePermissionsPage;
