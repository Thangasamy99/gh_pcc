// src/components/branches/BranchList.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Users,
    MoreVertical,
    Edit,
    Trash2,
    EyeOff,
    RefreshCw,
    Download,
    Printer,
    CheckCircle,
    XCircle,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Plus,
    BarChart3,
    AlertCircle
} from 'lucide-react';
import { Branch } from '../../types/branch.types';

interface BranchListProps {
    branches: Branch[];
    loading: boolean;
    onEdit: (branch: Branch) => void;
    onSoftDelete: (id: number) => void;
    onRestore: (id: number) => void;
    onViewStats: (id: number) => void;
    selectedBranches: number[];
    onSelectBranch: (id: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    onRefresh: () => void;
}

const BranchList: React.FC<BranchListProps> = ({
    branches,
    loading,
    onEdit,
    onSoftDelete,
    onRestore,
    onViewStats,
    selectedBranches,
    onSelectBranch,
    onSelectAll,
    onRefresh
}) => {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Branch;
        direction: 'asc' | 'desc';
    }>({ key: 'branchName', direction: 'asc' });

    const handleSort = (key: keyof Branch) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortedBranches = [...branches].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortConfig.direction === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortConfig.direction === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        }

        return 0;
    });

    const allSelected = branches.length > 0 && selectedBranches.length === branches.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading branches...</p>
                </div>
            </div>
        );
    }

    if (branches.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first branch</p>
                <Link
                    to="/superadmin/branches/create"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Branch
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Table Header Controls */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {selectedBranches.length} selected
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onRefresh}
                            className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200"
                            title="Refresh"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200" title="Export">
                            <Download className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 w-10"></th>
                            <th className="px-6 py-4">
                                <button
                                    onClick={() => handleSort('branchCode')}
                                    className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600 transition-colors"
                                >
                                    <span>Code</span>
                                    {sortConfig.key === 'branchCode' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4">
                                <button
                                    onClick={() => handleSort('branchName')}
                                    className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600 transition-colors"
                                >
                                    <span>Branch Name</span>
                                    {sortConfig.key === 'branchName' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4">
                                <button
                                    onClick={() => handleSort('city')}
                                    className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600 transition-colors"
                                >
                                    <span>Location</span>
                                    {sortConfig.key === 'city' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4">
                                <button
                                    onClick={() => handleSort('isActive')}
                                    className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-purple-600 transition-colors"
                                >
                                    <span>Status</span>
                                    {sortConfig.key === 'isActive' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <AnimatePresence mode="popLayout">
                            {sortedBranches.map((branch) => (
                                <motion.tr
                                    key={branch.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`hover:bg-purple-50/30 transition-colors ${branch.isDeleted ? 'bg-red-50/50' : ''
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedBranches.includes(branch.id)}
                                            onChange={(e) => onSelectBranch(branch.id, e.target.checked)}
                                            className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                            disabled={branch.isDeleted}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-gray-500 uppercase">{branch.branchCode}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${branch.branchType === 'HOSPITAL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                }`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{branch.branchName}</p>
                                                <p className="text-xs text-gray-500 capitalize">{branch.branchType.toLowerCase().replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                {branch.city}, {branch.region}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {branch.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {branch.isDeleted ? (
                                            <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold ring-1 ring-red-200">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                DELETED
                                            </span>
                                        ) : branch.isActive ? (
                                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-200">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold ring-1 ring-gray-200">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onViewStats(branch.id)}
                                                className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                                                title="Statistics"
                                            >
                                                <BarChart3 className="w-5 h-5" />
                                            </motion.button>

                                            {branch.isDeleted ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => onRestore(branch.id)}
                                                    className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                                    title="Restore"
                                                >
                                                    <RefreshCw className="w-5 h-5" />
                                                </motion.button>
                                            ) : (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onEdit(branch)}
                                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => onSoftDelete(branch.id)}
                                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </motion.button>
                                                </>
                                            )}

                                            <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BranchList;
