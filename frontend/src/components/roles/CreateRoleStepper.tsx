import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Key,
    Check,
    X,
    Save,
    Loader2,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    ArrowRight,
    Info,
    CircleCheck,
    CircleX,
    Layers,
    Lock
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { roleService, Permission, Role } from '../../services/roleService';

interface CreateRoleStepperProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateRoleStepper: React.FC<CreateRoleStepperProps> = ({ isOpen, onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen]);

    const fetchPermissions = async () => {
        try {
            const data = await roleService.getAllPermissions();
            setPermissions(data);
            
            const grouped = data.reduce((acc, perm) => {
                if (!acc[perm.module]) {
                    acc[perm.module] = [];
                }
                acc[perm.module].push(perm);
                return acc;
            }, {} as Record<string, Permission[]>);
            
            setGroupedPermissions(grouped);
            setExpandedModules(Object.keys(grouped));
        } catch (error) {
            toast.error('Failed to fetch permissions');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            id: 'basic',
            title: 'Basic Information',
            description: 'Enter role details',
            icon: Shield
        },
        {
            id: 'permissions',
            title: 'Assign Permissions',
            description: 'Select module permissions',
            icon: Key
        },
        {
            id: 'review',
            title: 'Review',
            description: 'Confirm role details',
            icon: Check
        }
    ];

    const formik = useFormik({
        initialValues: {
            roleName: '',
            roleCode: '',
            description: '',
            permissionIds: [] as number[],
            roleLevel: 5
        },
        validationSchema: Yup.object({
            roleName: Yup.string().required('Role name is required').min(3, 'Must be at least 3 characters'),
            roleCode: Yup.string()
                .required('Role code is required')
                .matches(/^[A-Z_]+$/, 'Must be uppercase with underscores')
                .min(3, 'Must be at least 3 characters'),
            description: Yup.string().max(500, 'Cannot exceed 500 characters')
        }),
        onSubmit: async (values) => {
            if (activeStep === steps.length - 1) {
                setSubmitting(true);
                try {
                    await roleService.createRole(values);
                    toast.success('Role created successfully!');
                    onSuccess?.();
                    onClose();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to create role');
                } finally {
                    setSubmitting(false);
                }
            } else {
                handleNext();
            }
        }
    });

    const handleNext = () => {
        if (activeStep === 0) {
            if (formik.values.roleName && formik.values.roleCode && !formik.errors.roleName && !formik.errors.roleCode) {
                setActiveStep(1);
            } else {
                formik.setTouched({ roleName: true, roleCode: true });
            }
        } else if (activeStep === 1) {
            setActiveStep(2);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const toggleModule = (module: string) => {
        setExpandedModules(prev =>
            prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
        );
    };

    const togglePermission = (id: number) => {
        const newPermissions = formik.values.permissionIds.includes(id)
            ? formik.values.permissionIds.filter(pid => pid !== id)
            : [...formik.values.permissionIds, id];
        formik.setFieldValue('permissionIds', newPermissions);
    };

    const toggleModulePermissions = (module: string, assign: boolean) => {
        const modulePermIds = groupedPermissions[module]?.map(p => p.id) || [];
        const newPermissions = assign
            ? [...new Set([...formik.values.permissionIds, ...modulePermIds])]
            : formik.values.permissionIds.filter(id => !modulePermIds.includes(id));
        formik.setFieldValue('permissionIds', newPermissions);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Role</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="px-6 pt-6 mb-12">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: index === activeStep ? [1, 1.1, 1] : 1 }}
                                            transition={{ duration: 0.3, repeat: index === activeStep ? Infinity : 0, repeatDelay: 1 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                index < activeStep
                                                    ? 'bg-green-500 text-white'
                                                    : index === activeStep
                                                    ? 'bg-[#9120e8] text-white shadow-lg shadow-purple-200'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {index < activeStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                        </motion.div>
                                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-32 text-center">
                                            <p className="text-sm font-bold text-gray-900">{step.title}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 mx-4">
                                            <div className={`h-1.5 rounded-full transition-all duration-500 ${index < activeStep ? 'bg-green-500' : 'bg-gray-100'}`} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
                        <AnimatePresence mode="wait">
                            {activeStep === 0 && (
                                <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700">Role Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="roleName"
                                                value={formik.values.roleName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="e.g. Ward Manager"
                                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all font-medium ${
                                                    formik.touched.roleName && formik.errors.roleName
                                                        ? 'border-red-300 focus:ring-red-100'
                                                        : 'border-gray-200 focus:ring-purple-50 focus:border-[#9120e8]'
                                                }`}
                                            />
                                            {formik.touched.roleName && formik.errors.roleName && <p className="text-xs text-red-600 font-bold">{formik.errors.roleName}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700">Role Code <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="roleCode"
                                                    value={formik.values.roleCode}
                                                    onChange={e => formik.setFieldValue('roleCode', e.target.value.toUpperCase())}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="ROLE_MANAGER"
                                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all font-mono text-sm ${
                                                        formik.touched.roleCode && formik.errors.roleCode
                                                            ? 'border-red-300 focus:ring-red-100'
                                                            : 'border-gray-200 focus:ring-purple-50 focus:border-[#9120e8]'
                                                    }`}
                                                />
                                                {formik.values.roleCode && !formik.errors.roleCode && <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />}
                                            </div>
                                            {formik.touched.roleCode && formik.errors.roleCode && <p className="text-xs text-red-600 font-bold">{formik.errors.roleCode}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Role Priority Level (1-100)</label>
                                        <input
                                            type="number"
                                            name="roleLevel"
                                            value={formik.values.roleLevel}
                                            onChange={formik.handleChange}
                                            className="w-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#9120e8] transition-all font-medium"
                                        />
                                        <p className="text-xs text-gray-400">Higher number means higher system priority.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Description</label>
                                        <textarea
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            rows={4}
                                            placeholder="What can users with this role do?"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-[#9120e8] transition-all font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 1 && (
                                <motion.div key="permissions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                    <div className="flex items-center justify-between bg-purple-50 p-6 rounded-[24px] border border-purple-100 shadow-sm shadow-purple-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-purple-100">
                                                <Key className="text-[#9120e8]" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-gray-900">Permission Matrix</h3>
                                                <p className="text-xs font-bold text-[#9120e8] uppercase tracking-wider">{formik.values.permissionIds.length} Controls Selected</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(groupedPermissions).map(([module, perms]) => {
                                            const isExpanded = expandedModules.includes(module);
                                            const moduleSelected = perms.filter(p => formik.values.permissionIds.includes(p.id));
                                            const isAllSelected = moduleSelected.length === perms.length;

                                            return (
                                                <div key={module} className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden group">
                                                    <div onClick={() => toggleModule(module)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-[#9120e8] group-hover:bg-[#9120e8] group-hover:text-white transition-all">
                                                                <Layers size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-extrabold text-gray-900 capitalize">{module} Module</h3>
                                                                <p className="text-[10px] font-bold text-gray-400 transition-colors uppercase tracking-widest">{moduleSelected.length} / {perms.length} Active</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); toggleModulePermissions(module, !isAllSelected); }}
                                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                                                                        isAllSelected ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                                    }`}
                                                                >
                                                                    {isAllSelected ? 'Clear All' : 'Select All'}
                                                                </button>
                                                            </div>
                                                            {isExpanded ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
                                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {perms.map((perm) => (
                                                                        <div
                                                                            key={perm.id}
                                                                            onClick={() => togglePermission(perm.id)}
                                                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group/item ${
                                                                                formik.values.permissionIds.includes(perm.id)
                                                                                    ? 'bg-purple-50 border-purple-200'
                                                                                    : 'bg-white border-gray-100 hover:border-purple-200'
                                                                            }`}
                                                                        >
                                                                            <div>
                                                                                <p className={`text-sm font-bold capitalize ${formik.values.permissionIds.includes(perm.id) ? 'text-purple-700' : 'text-gray-700'}`}>
                                                                                    {perm.permissionName.replace(/_/g, ' ')}
                                                                                </p>
                                                                                <p className="text-[10px] text-gray-400 font-medium group-hover/item:text-purple-400 transition-colors">{perm.permissionCode}</p>
                                                                            </div>
                                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                                                                formik.values.permissionIds.includes(perm.id) ? 'bg-[#9120e8] text-white scale-110' : 'bg-gray-100 text-transparent'
                                                                            }`}>
                                                                                <Check size={14} strokeWidth={4} />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {activeStep === 2 && (
                                <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                                    <div className="bg-gradient-to-br from-[#9120e8] to-[#6a15b5] p-8 rounded-[32px] text-white shadow-xl shadow-purple-200 relative overflow-hidden">
                                        <div className="absolute -right-10 -bottom-10 opacity-10">
                                            <Shield size={200} />
                                        </div>
                                        <div className="relative">
                                            <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 inline-block">Reviewing New Role</span>
                                            <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">{formik.values.roleName}</h3>
                                            <code className="text-purple-200 text-sm font-mono tracking-wider">CODE: {formik.values.roleCode}</code>
                                            <p className="mt-6 text-purple-100/80 font-medium leading-relaxed max-w-lg italic">"{formik.values.description || 'No description provided for this role.'}"</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Priority Level</p>
                                            <p className="text-2xl font-black text-gray-900">{formik.values.roleLevel}</p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Controls</p>
                                            <p className="text-2xl font-black text-[#9120e8]">{formik.values.permissionIds.length}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-extrabold text-gray-900 border-b border-gray-100 pb-2">Assigned Capabilities</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {formik.values.permissionIds.slice(0, 6).map(id => {
                                                const p = permissions.find(p => p.id === id);
                                                return p ? (
                                                    <div key={id} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                        <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700 capitalize">{p.permissionName.replace(/_/g, ' ')}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                            {formik.values.permissionIds.length > 6 && (
                                                <div className="flex items-center justify-center p-4 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs font-bold">
                                                    + {formik.values.permissionIds.length - 6} more controls...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between">
                        <button
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            className={`px-8 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all ${
                                activeStep === 0 ? 'opacity-0' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 active:scale-95'
                            }`}
                        >
                            <ArrowLeft size={18} />
                            <span>Modify Previous</span>
                        </button>

                        <div className="flex gap-4">
                            <button onClick={onClose} className="px-8 py-3 bg-white text-gray-500 font-bold rounded-2xl border border-gray-200 hover:bg-gray-100">Cancel</button>
                            
                            {activeStep === steps.length - 1 ? (
                                <button
                                    onClick={() => formik.handleSubmit()}
                                    disabled={submitting}
                                    className="px-10 py-3 bg-[#9120e8] text-white rounded-2xl shadow-xl shadow-purple-100 font-bold hover:bg-[#7a1bc2] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    <span>Deploy Role</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="px-10 py-3 bg-[#9120e8] text-white rounded-2xl shadow-xl shadow-purple-100 font-bold hover:bg-[#7a1bc2] transition-all flex items-center gap-3 active:scale-95"
                                >
                                    <span>Continue</span>
                                    <ArrowRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateRoleStepper;
