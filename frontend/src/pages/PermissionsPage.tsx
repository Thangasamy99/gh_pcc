import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Search, Filter, ShieldCheck, Key, Lock, Layers,
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown, RefreshCw,
    Download, List as ListIcon, LayoutGrid, CheckCircle, AlertCircle,
    MoreVertical, Info, Activity, Globe
} from 'lucide-react';
import { roleService, Permission } from '../services/roleService';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';

const PermissionsPage: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'module', direction: 'asc' });

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const data = await roleService.getAllPermissions();
            setPermissions(data);
        } catch (error) {
            toast.error('Failed to sync security controls');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const modules = ['all', ...Array.from(new Set(permissions.map(p => p.module)))];

    const filteredPermissions = permissions.filter(p => {
        const matchesSearch = p.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.permissionCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === 'all' || p.module === selectedModule;
        return matchesSearch && matchesModule;
    });

    const sortedPermissions = [...filteredPermissions].sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (sortConfig.direction === 'asc') return String(aVal).localeCompare(String(bVal));
        return String(bVal).localeCompare(String(aVal));
    });

    const handleSelectPermission = (id: number, selected: boolean) => {
        if (selected) {
            setSelectedPermissions(prev => [...prev, id]);
        } else {
            setSelectedPermissions(prev => prev.filter(pid => pid !== id));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedPermissions(filteredPermissions.map(p => p.id));
        } else {
            setSelectedPermissions([]);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Control Database...</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="space-y-6 max-w-[1600px] mx-auto p-2">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Key className="w-8 h-8 mr-3 text-purple-600" />
                            Security Controls
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="hover:text-purple-600 cursor-pointer">Security</span>
                            <ChevronRight className="w-4 h-4 mx-1" />
                            <span className="text-gray-900 font-medium">Permission Matrix</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-col items-center px-6 py-1 border-r border-gray-100">
                            <span className="text-xl font-black text-purple-600 leading-none">{permissions.length}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Controls</span>
                        </div>
                        <div className="flex flex-col items-center px-6 py-1">
                            <span className="text-xl font-black text-amber-500 leading-none">{modules.length - 1}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Modules</span>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-100 mx-1" />
                        <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                            <Download className="w-5 h-5 shadow-sm" />
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by code or capability name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-transparent shadow-sm">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer capitalize"
                            >
                                {modules.map(mod => (
                                    <option key={mod} value={mod}>{mod === 'all' ? 'All Modules' : mod}</option>
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
                                        checked={filteredPermissions.length > 0 && selectedPermissions.length === filteredPermissions.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                        {selectedPermissions.length} selected
                                    </span>
                                </div>
                                <button onClick={fetchPermissions} className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                                    <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 w-10"></th>
                                            <th className="px-6 py-4">
                                                <button onClick={() => handleSort('permissionCode')} className="flex items-center space-x-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-purple-600">
                                                    <span>Code</span>
                                                    {sortConfig.key === 'permissionCode' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4">
                                                <button onClick={() => handleSort('module')} className="flex items-center space-x-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-purple-600">
                                                    <span>Core Capability</span>
                                                    {sortConfig.key === 'module' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4">
                                                <button onClick={() => handleSort('description')} className="flex items-center space-x-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-purple-600">
                                                    <span>Logic Definition</span>
                                                    {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                                </button>
                                            </th>
                                            <th className="px-6 py-4">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment</span>
                                            </th>
                                            <th className="px-6 py-4 text-right pr-10">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedPermissions.map((perm) => (
                                            <tr key={perm.id} className="hover:bg-purple-50/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.includes(perm.id)}
                                                        onChange={(e) => handleSelectPermission(perm.id, e.target.checked)}
                                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">{perm.permissionCode}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm`}>
                                                            <ShieldCheck className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 capitalize tracking-tight">{perm.permissionName.replace(/_/g, ' ')}</p>
                                                            <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{perm.module}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-500 line-clamp-1 italic max-w-sm">{perm.description || 'Core security rule for hospital infrastructure...'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black ring-1 ring-green-100 uppercase tracking-widest">
                                                        <CheckCircle className="w-3 h-3 mr-1.5" />
                                                        Deployed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right pr-6">
                                                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                        <button className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-all active:scale-90">
                                                            <Activity className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-90">
                                                            <Info className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-all">
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
                        <div className="space-y-10">
                            {modules.filter(m => m !== 'all' && (selectedModule === 'all' || m === selectedModule)).map(module => {
                                const perms = sortedPermissions.filter(p => p.module === module);
                                return perms.length > 0 ? (
                                    <div key={module} className="space-y-6">
                                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-3xl border border-gray-100 w-fit pr-8">
                                            <div className="w-12 h-12 bg-white shadow-md rounded-2xl flex items-center justify-center text-purple-600">
                                                <Layers size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 capitalize tracking-tight">{module}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-50 mt-1 pt-1">{perms.length} Active Rules</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {perms.map(perm => (
                                                <motion.div
                                                    key={perm.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Lock size={64} />
                                                    </div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                                                            <ShieldCheck size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2">ID: #{perm.id}</span>
                                                    </div>
                                                    <h4 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight">{perm.permissionName.replace(/_/g, ' ')}</h4>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <code className="text-[10px] font-mono font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded-lg uppercase tracking-wider">{perm.permissionCode}</code>
                                                    </div>
                                                    <p className="mt-4 text-sm text-gray-500 line-clamp-2 leading-relaxed italic">"{perm.description || 'Core security ruleset for standard operational procedures.'}"</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default PermissionsPage;
