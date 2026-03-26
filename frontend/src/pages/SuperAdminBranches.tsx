// src/pages/SuperAdminBranches.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Filter,
    RefreshCw,
    LayoutGrid,
    List as ListIcon,
    ChevronLeft,
    X,
    Download,
    Upload,
    MoreHorizontal,
    BarChart3
} from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import BranchList from '../components/branches/BranchList';
import CreateBranchStepper from '../components/branches/CreateBranchStepper';
import BranchStatsView from '../components/branches/BranchStats';
import { useNavigate, useLocation } from 'react-router-dom';
import { branchService } from '../services/branchService';
import { Branch, BranchStats, BranchFilters } from '../types/branch.types';

const SuperAdminBranches: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState<'list' | 'create' | 'stats'>('list');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [branchStats, setBranchStats] = useState<BranchStats | null>(null);
    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
    const [filters, setFilters] = useState<BranchFilters>({
        search: '',
        includeDeleted: false
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Synchronize view with URL
    useEffect(() => {
        if (location.pathname.endsWith('/create')) {
            setView('create');
        } else if (location.pathname.endsWith('/stats')) {
            setView('stats');
            // If we don't have stats yet, and it's /stats, maybe show global stats?
            // For now, we'll keep it as is, but handle fetch better.
        } else {
            setView('list');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (view === 'list') {
            fetchBranches();
        }
    }, [filters, view]);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await branchService.getAllBranches(filters.includeDeleted);
            // Client-side search for demo (backend search exists in /paged endpoint)
            const filtered = data.filter(b =>
                b.branchName.toLowerCase().includes(filters.search?.toLowerCase() || '') ||
                b.branchCode.toLowerCase().includes(filters.search?.toLowerCase() || '')
            );
            setBranches(filtered);
        } catch (error) {
            toast.error('Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        navigate('/superadmin/branches');
    };

    const handleCancel = () => {
        navigate('/superadmin/branches');
    };

    const handleEdit = (branch: Branch) => {
        toast.info('Edit functionality coming soon');
    };

    const handleSoftDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                await branchService.softDeleteBranch(id);
                toast.success('Branch deleted successfully');
                fetchBranches();
            } catch (error) {
                toast.error('Failed to delete branch');
            }
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await branchService.restoreBranch(id);
            toast.success('Branch restored successfully');
            fetchBranches();
        } catch (error) {
            toast.error('Failed to restore branch');
        }
    };

    const handleViewStats = async (id: number) => {
        setLoading(true);
        try {
            const stats = await branchService.getBranchStats(id);
            setBranchStats(stats);
            setSelectedBranchId(id);
            setView('stats');
        } catch (error) {
            toast.error('Failed to fetch branch statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBranch = (id: number, selected: boolean) => {
        if (selected) {
            setSelectedBranches(prev => [...prev, id]);
        } else {
            setSelectedBranches(prev => prev.filter(bid => bid !== id));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedBranches(branches.map(b => b.id));
        } else {
            setSelectedBranches([]);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="hover:text-purple-600 cursor-pointer">Dashboard</span>
                            <ChevronLeft className="w-4 h-4 mx-1 rotate-180" />
                            <span className="text-gray-900 font-medium">Branch Management</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Building2 className="w-8 h-8 mr-3 text-purple-600" />
                            Branch Management
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3">
                        {view === 'list' ? (
                            <>
                                <button
                                    onClick={() => navigate('/superadmin/branches/create')}
                                    className="flex items-center px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Branch
                                </button>
                                <div className="h-8 w-[1px] bg-gray-200 mx-2" />
                                <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600">
                                    <Download className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/superadmin/branches')}
                                className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Back to List
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'list' && (
                        <motion.div
                            key="list-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Filters & Search */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                                <div className="relative flex-1 min-w-[300px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by branch name or code..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`flex items-center px-4 py-2.5 rounded-xl border transition-all ${isFilterOpen
                                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Filter className="w-5 h-5 mr-2" />
                                        Filters
                                        {filters.includeDeleted && (
                                            <span className="ml-2 w-2 h-2 bg-purple-600 rounded-full" />
                                        )}
                                    </button>

                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                            <ListIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-gray-700">
                                            <LayoutGrid className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Filters Drawer */}
                            {isFilterOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Show Records</label>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.includeDeleted}
                                                        onChange={(e) => setFilters(prev => ({ ...prev, includeDeleted: e.target.checked }))}
                                                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">Include Deleted</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Branch List Table */}
                            <BranchList
                                branches={branches}
                                loading={loading}
                                onEdit={handleEdit}
                                onSoftDelete={handleSoftDelete}
                                onRestore={handleRestore}
                                onViewStats={handleViewStats}
                                selectedBranches={selectedBranches}
                                onSelectBranch={handleSelectBranch}
                                onSelectAll={handleSelectAll}
                                onRefresh={fetchBranches}
                            />
                        </motion.div>
                    )}

                    {view === 'create' && (
                        <motion.div
                            key="create-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <CreateBranchStepper
                                onSuccess={handleCreateSuccess}
                                onCancel={handleCancel}
                            />
                        </motion.div>
                    )}

                    {view === 'stats' && (
                        <motion.div
                            key="stats-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            {branchStats ? (
                                <>
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{branchStats.branchName} Statistics</h2>
                                            <p className="text-sm text-gray-500">Live performance data and analytics</p>
                                        </div>
                                        <button
                                            onClick={() => handleViewStats(selectedBranchId!)}
                                            className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh Data
                                        </button>
                                    </div>
                                    <BranchStatsView stats={branchStats} />
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No branch selected</h3>
                                    <p className="text-gray-500 mb-6">Select a branch from the list to view its detailed performance. </p>
                                    <button
                                        onClick={() => navigate('/superadmin/branches')}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                                    >
                                        Select Branch
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default SuperAdminBranches;
