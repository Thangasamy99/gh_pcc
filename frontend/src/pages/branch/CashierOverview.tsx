import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CheckCircle, 
  Clock, 
  FileText, 
  Activity, 
  ShieldCheck, 
  CreditCard,
  Search,
  Filter
} from 'lucide-react';

const CashierOverview: React.FC = () => {
    const stats = [
        { title: 'Pending Payments', count: 12, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-3' },
        { title: 'Completed Payments', count: 48, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
        { title: 'Insurance Cases', count: 8, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', trend: '15%' },
        { title: 'Credit Cases', count: 3, icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Stable' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Cashier & Revenue Operations</h2>
                <p className="text-gray-500 mt-2 font-medium flex items-center italic">
                   <Wallet className="w-4 h-4 mr-2 text-purple-600" />
                   Real-time monitoring of billing, payments, and financial settlement.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 group transition-all"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 ${stat.bg} rounded-2xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-2">{stat.count}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-10 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Pending Billings</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Name</th>
                                <th className="pb-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Item</th>
                                <th className="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="pb-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: 'Echu Peter', service: 'Consultation + Lab', amount: '12,500', status: 'Pending' },
                                { name: 'Ngando Alice', service: 'Pharmacy Withdrawal', amount: '8,400', status: 'Awaiting' },
                                { name: 'Tumenta John', service: 'Radiology Scan', amount: '25,000', status: 'In Process' }
                            ].map((row, i) => (
                                <tr key={i} className="group transition-colors hover:bg-gray-50/50">
                                    <td className="py-6 text-sm font-black text-gray-800">{row.name}</td>
                                    <td className="py-6 text-xs text-gray-500 font-bold uppercase tracking-tight">{row.service}</td>
                                    <td className="py-6 text-right text-sm font-black text-gray-900 leading-none">{row.amount} FCFA</td>
                                    <td className="py-6 text-right">
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100 ring-4 ring-amber-50/50 uppercase tracking-tighter">
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CashierOverview;
