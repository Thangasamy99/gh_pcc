import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, CheckCircle2, AlertCircle, Info, Layers, Key, FileText, Settings, KeySquare } from 'lucide-react';
import { roleService, Permission } from '../services/roleService';
import { toast } from 'react-toastify';
import Layout from '../components/layout/Layout';
import PermissionList from '../components/permissions/PermissionList';

const CreateRolePage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [formData, setFormData] = useState({
        roleName: '',
        roleCode: '',
        description: '',
        department: '',
        roleLevel: 5,
        permissionIds: [] as number[],
        isSystemRole: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        try {
            const data = await roleService.getAllPermissions();
            setPermissions(data);
        } catch (error) {
            toast.error('Failed to load system permissions');
        } finally {
            setLoadingPermissions(false);
        }
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.roleName.trim()) newErrors.roleName = 'Role name is required';
        if (!formData.roleCode.trim()) newErrors.roleCode = 'Role code is required';
        if (!formData.department) newErrors.department = 'Department is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2) setStep(3);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Check name uniqueness
            const nameExists = await roleService.checkRoleName(formData.roleName);
            if (nameExists) {
                setErrors({ roleName: 'Role name already exists' });
                setStep(1);
                setSubmitting(false);
                return;
            }

            await roleService.createRole(formData);
            toast.success('Role provisioned successfully!');
            navigate('/superadmin/roles');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Authorization failure while creating role');
        } finally {
            setSubmitting(false);
        }
    };

    const rolesLevels = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <Layout>
            <div className="p-10 space-y-12 min-h-screen bg-transparent relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/20 rounded-full -mr-64 -mt-64 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/20 rounded-full -ml-64 -mb-64 blur-3xl pointer-events-none" />

                {/* Header Area */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50">
                                <KeySquare className="text-white" size={32} />
                            </div>
                            Access Provisioning
                        </h1>
                        <p className="text-gray-500 font-medium text-xl mt-3 ml-1 outline-none">Create a new security identity for system components</p>
                    </div>

                    {/* Stepper Dots */}
                    <div className="flex items-center gap-8 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 font-bold ${
                                    step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {step > s ? <CheckCircle2 size={18} /> : s}
                                </div>
                                <span className={`text-sm font-bold tracking-wider uppercase ${step >= s ? 'text-gray-900' : 'text-gray-300'}`}>
                                    {s === 1 ? 'Identity' : s === 2 ? 'Privileges' : 'Review'}
                                </span>
                                {s < 3 && <div className="w-12 h-[2px] bg-gray-100" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-12"
                            >
                                <div className="space-y-10">
                                    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={16} /> Identity Signature
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.roleName}
                                                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                                                placeholder="e.g. Clinical Director"
                                                className={`w-full px-8 py-5 bg-gray-50 border ${errors.roleName ? 'border-red-500 ring-4 ring-red-50' : 'border-gray-100'} rounded-3xl text-xl font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder-gray-300`}
                                            />
                                            {errors.roleName && <p className="text-red-500 text-sm font-bold flex items-center gap-2 ml-2"><AlertCircle size={14} /> {errors.roleName}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Key size={16} /> Identity Code
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={formData.roleCode}
                                                    onChange={(e) => setFormData({ ...formData, roleCode: e.target.value.toUpperCase() })}
                                                    placeholder="ROLE_CLINICAL_DIRECTOR"
                                                    className={`w-full px-8 py-5 bg-gray-50 border ${errors.roleCode ? 'border-red-500 ring-4 ring-red-50' : 'border-gray-100'} rounded-3xl text-lg font-mono font-black focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder-gray-300`}
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-xl shadow-sm text-[10px] font-bold text-gray-400">
                                                    <Lock size={12} /> READ ONLY IF ACTIVE
                                                </div>
                                            </div>
                                            {errors.roleCode && <p className="text-red-500 text-sm font-bold flex items-center gap-2 ml-2"><AlertCircle size={14} /> {errors.roleCode}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Layers size={16} /> Department
                                                </label>
                                                <select
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-lg font-bold focus:ring-4 focus:ring-indigo-50 outline-none appearance-none"
                                                >
                                                    <option value="">Select Dept</option>
                                                    <option value="Clinical">Clinical</option>
                                                    <option value="Administrative">Administrative</option>
                                                    <option value="IT Support">IT Support</option>
                                                    <option value="Operations">Operations</option>
                                                    <option value="Finance">Finance</option>
                                                </select>
                                                {errors.department && <p className="text-red-500 text-sm font-bold flex items-center gap-2 ml-2"><AlertCircle size={14} /> {errors.department}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Settings size={16} /> Trust Level
                                                </label>
                                                <select
                                                    value={formData.roleLevel}
                                                    onChange={(e) => setFormData({ ...formData, roleLevel: Number(e.target.value) })}
                                                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-lg font-bold focus:ring-4 focus:ring-indigo-50 outline-none appearance-none"
                                                >
                                                    {rolesLevels.map(lvl => <option key={lvl} value={lvl}>Level {lvl}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                                            <Info size={16} /> Supplemental Context
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Elaborate on the specific scope of this role..."
                                            className="flex-1 w-full p-8 bg-gray-100 border-none rounded-[32px] text-lg font-medium outline-none resize-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder-gray-300"
                                        />
                                        <div className="mt-8 p-6 bg-indigo-900 rounded-3xl text-white">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-2xl">
                                                    <Shield size={24} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">System Integrity Protection</p>
                                                    <p className="text-indigo-200 text-xs">Roles defined here are immutable once assigned to active user clusters.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[600px] flex flex-col">
                                    <div className="flex items-end justify-between mb-10 border-b border-gray-50 pb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Privilege Attribution</h3>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">ASSIGN SECURITY CONTROLS TO THIS IDENTITY</p>
                                        </div>
                                        <div className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest border border-indigo-100">
                                            {formData.permissionIds.length} Keys Selected
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-100">
                                        {loadingPermissions ? (
                                            <div className="flex items-center justify-center p-20">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                            </div>
                                        ) : (
                                            <PermissionList 
                                                selectedPermissionIds={formData.permissionIds}
                                                onChange={(ids) => setFormData({ ...formData, permissionIds: ids })}
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-2xl mx-auto space-y-8"
                            >
                                <div className="bg-white p-12 rounded-[50px] shadow-2xl shadow-gray-300/50 border border-gray-100 text-center relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500" />
                                     
                                     <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-indigo-50/50">
                                        <CheckCircle2 className="text-indigo-600" size={48} />
                                     </div>
                                     
                                     <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Final Provisioning Review</h2>
                                     <p className="text-gray-500 font-medium text-lg mb-10">Confirm the details of the new security identity</p>
                                     
                                     <div className="space-y-4 text-left">
                                         <div className="bg-gray-50 p-6 rounded-[32px] flex justify-between items-center">
                                             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Identity Label</span>
                                             <span className="text-gray-900 font-black text-lg">{formData.roleName}</span>
                                         </div>
                                         <div className="bg-gray-50 p-6 rounded-[32px] flex justify-between items-center">
                                             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Identity Code</span>
                                             <span className="text-gray-900 font-mono font-black">{formData.roleCode}</span>
                                         </div>
                                         <div className="bg-gray-50 p-6 rounded-[32px] flex justify-between items-center">
                                             <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Assigned Privileges</span>
                                             <span className="text-indigo-600 font-black text-lg">{formData.permissionIds.length} SECURITY KEYS</span>
                                         </div>
                                     </div>

                                     <div className="mt-12 p-8 border-2 border-dashed border-indigo-100 rounded-[40px] text-indigo-400 text-sm font-bold leading-relaxed">
                                         By confirming, you are granting this role access within the {formData.department} department. All associated users will inherit these privileges immediately.
                                     </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="fixed bottom-12 left-0 w-full px-12 z-40 pointer-events-none">
                    <div className="max-w-6xl mx-auto flex justify-between pointer-events-auto">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : navigate('/superadmin/roles')}
                            className="px-10 py-5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-900 rounded-3xl font-black shadow-xl shadow-gray-200/50 tracking-tighter transition-all active:scale-95"
                        >
                            {step === 1 ? 'Discard Identity' : 'Previous Module'}
                        </button>
                        
                        <button
                            onClick={step < 3 ? handleNext : handleSubmit}
                            disabled={submitting}
                            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black shadow-2xl shadow-indigo-200 tracking-tighter transition-all flex items-center gap-3 active:scale-95"
                        >
                            {submitting ? (
                                <>
                                    <RefreshCw className="animate-spin" size={20} />
                                    <span>Provisioning...</span>
                                </>
                            ) : (
                                <>
                                    <span>{step < 3 ? 'Proceed to Authorization' : 'Authorize Identity'}</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreateRolePage;
