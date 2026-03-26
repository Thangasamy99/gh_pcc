// src/components/branches/BranchStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserCheck,
    Stethoscope,
    Bed,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    Heart,
    Calendar
} from 'lucide-react';
import { BranchStats } from '../../types/branch.types';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

interface BranchStatsViewProps {
    stats: BranchStats;
}

const BranchStatsView: React.FC<BranchStatsViewProps> = ({ stats }) => {
    const cards = [
        {
            title: 'Total Staff',
            value: formatNumber(stats.totalStaff),
            icon: Users,
            color: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            detail: `${stats.doctors} Doctors, ${stats.nurses} Nurses`
        },
        {
            title: 'Active Patients',
            value: formatNumber(stats.activePatients),
            icon: Heart,
            color: 'bg-red-500',
            lightColor: 'bg-red-50',
            textColor: 'text-red-600',
            detail: `${stats.totalAdmissions} New Admissions`
        },
        {
            title: 'Bed Occupancy',
            value: formatPercentage(stats.bedOccupancyRate),
            icon: Bed,
            color: 'bg-orange-500',
            lightColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            detail: `${stats.occupiedBeds}/${stats.availableBeds + stats.occupiedBeds} Beds occupied`
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(stats.monthlyRevenue),
            icon: DollarSign,
            color: 'bg-green-500',
            lightColor: 'bg-green-50',
            textColor: 'text-green-600',
            detail: stats.monthlyRevenue > 100000 ? 'Above target' : 'On track'
        }
    ];

    const staffBreakdown = [
        { label: 'Doctors', value: stats.doctors, icon: Stethoscope, color: 'text-blue-600' },
        { label: 'Nurses', value: stats.nurses, icon: Users, color: 'text-green-600' },
        { label: 'Technicians', value: stats.labTechnicians, icon: Activity, color: 'text-purple-600' },
        { label: 'Reception', value: stats.receptionists, icon: UserCheck, color: 'text-orange-600' }
    ];

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.lightColor} p-3 rounded-xl`}>
                                <card.icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                            <div className="flex items-center text-green-500 text-sm font-bold">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                12%
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                        <p className="text-xs text-gray-400 mt-2">{card.detail}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Staff Breakdown */}
                <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Staff Breakdown
                    </h3>
                    <div className="space-y-6">
                        {staffBreakdown.map((staff) => (
                            <div key={staff.label} className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <staff.icon className={`w-4 h-4 mr-2 ${staff.color}`} />
                                        <span className="text-sm font-medium text-gray-700">{staff.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{staff.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.totalStaff > 0 ? (staff.value / stats.totalStaff) * 100 : 0}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full rounded-full bg-current ${staff.color.replace('text', 'bg')}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Patient Satisfaction</span>
                            <span className="text-lg font-bold text-purple-600">{stats.patientSatisfaction}/5.0</span>
                        </div>
                        <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Heart
                                    key={star}
                                    className={`w-4 h-4 mr-1 ${star <= stats.patientSatisfaction ? 'text-red-500 fill-red-500' : 'text-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-purple-600" />
                            Historical Overview
                        </h3>
                        <div className="flex bg-gray-50 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-medium text-purple-600 bg-white rounded-md shadow-sm">Monthly</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">Yearly</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between space-x-2">
                        {[45, 60, 55, 75, 90, 85, 95, 80, 70, 85, 100, 90].map((height, i) => (
                            <div key={i} className="flex-1 group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className={`w-full rounded-t-lg transition-all ${i === 10 ? 'bg-purple-600' : 'bg-purple-200 group-hover:bg-purple-300'
                                        }`}
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatCurrency(height * 2000)}
                                </div>
                                <div className="mt-2 text-[10px] text-gray-400 text-center font-medium">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-12">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                Yearly Revenue
                            </div>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.yearlyRevenue)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Growth Rate
                            </div>
                            <p className="text-xl font-bold text-green-600">+24.8%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchStatsView;
