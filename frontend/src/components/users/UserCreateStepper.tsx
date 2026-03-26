import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Lock, UserCheck, Briefcase, 
    MapPin, CheckCircle2, ChevronRight, ChevronLeft,
    Shield, Building2, Phone, BadgeCheck, X,
    Eye, EyeOff
} from 'lucide-react';
import { roleService, Role } from '../../services/roleService';
import { branchService, Branch } from '../../services/branchService';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { UserResponse } from '../../types';

interface UserCreateStepperProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    editUser?: UserResponse | null;
}

const steps = [
    { id: 1, title: 'Authentication', icon: Lock, description: 'Login credentials' },
    { id: 2, title: 'Identity', icon: User, description: 'Personal details' },
    { id: 3, title: 'Assignment', icon: Briefcase, description: 'Role & Branch' },
    { id: 4, title: 'Validation', icon: CheckCircle2, description: 'Final review' },
];

const validationSchema = [
    Yup.object({
        username: Yup.string().required('Username is required').min(4, 'Username too short'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required').min(8, 'Minimum 8 characters'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirmation required'),
    }),
    Yup.object({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        staffId: Yup.string(), // Optional, auto-generated
        phone: Yup.string().required('Phone number is required'),
    }),
    Yup.object({
        roleId: Yup.number().required('Role assignment is required'),
        primaryBranchId: Yup.number().required('Branch assignment is required'),
    }),
    Yup.object({}),
];

const editValidationSchema = [
    Yup.object({
        username: Yup.string().required('Username is required').min(4, 'Username too short'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        // Password optional in edit mode
        password: Yup.string().min(8, 'Minimum 8 characters'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    Yup.object({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        staffId: Yup.string(),
        phone: Yup.string().required('Phone number is required'),
    }),
    Yup.object({
        roleId: Yup.number().required('Role assignment is required'),
        primaryBranchId: Yup.number().required('Branch assignment is required'),
    }),
    Yup.object({}),
];

const UserCreateStepper: React.FC<UserCreateStepperProps> = ({ onSuccess, onCancel, editUser }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [roles, setRoles] = useState<Role[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [rolesData, branchesData] = await Promise.all([
                    roleService.getAllRoles(),
                    branchService.getAllBranches()
                ]);
                setRoles(rolesData);
                setBranches(Array.isArray(branchesData) ? branchesData : (branchesData as any).content || []);
            } catch (error) {
                toast.error('Failed to load system metadata');
            }
        };
        loadData();
    }, []);

    const handleNext = async (values: any, actions: any) => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            actions.setTouched({});
            actions.setSubmitting(false);
        } else {
            try {
                if (editUser) {
                    await userService.updateUser(editUser.id, values);
                    toast.success('Personnel record updated successfully!');
                } else {
                    await userService.createUser(values);
                    toast.success('Personnel enlisted successfully!');
                }
                if (onSuccess) onSuccess();
            } catch (error: any) {
                toast.error(error.response?.data?.message || `Failed to ${editUser ? 'update' : 'enlist'} personnel`);
            } finally {
                actions.setSubmitting(false);
            }
        }
    };

    return (
        <div className="bg-white rounded-[40px] overflow-hidden flex flex-col items-stretch">
            {/* Stepper Header */}
            <div className="bg-[#fafafa] p-10 border-b border-gray-100">
                <div className="flex items-center justify-between relative max-w-3xl mx-auto">
                    <div className="absolute top-5 left-0 w-full h-[3px] bg-gray-100 z-0">
                        <motion.div 
                            className="h-full bg-[#9120e8]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = currentStep >= idx;
                        const isCurrent = currentStep === idx;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                <motion.div
                                    animate={{
                                        backgroundColor: isActive ? '#9120e8' : '#ffffff',
                                        color: isActive ? '#ffffff' : '#cbd5e1',
                                        scale: isCurrent ? 1.2 : 1,
                                        boxShadow: isCurrent ? '0 10px 25px -5px rgba(145, 32, 232, 0.4)' : 'none'
                                    }}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${
                                        isActive ? 'border-[#9120e8]' : 'border-gray-100 bg-white'
                                    } transition-all`}
                                >
                                    <Icon size={22} strokeWidth={2.5} />
                                </motion.div>
                                <div className="mt-4 text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#9120e8]' : 'text-gray-400'}`}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Formik
                initialValues={{
                    username: editUser?.username || '',
                    email: editUser?.email || '',
                    password: '', // Kept empty for edit as we usually don't want to show password
                    confirmPassword: '',
                    firstName: editUser?.firstName || '',
                    lastName: editUser?.lastName || '',
                    staffId: editUser?.staffId || '',
                    phone: editUser?.phone || '',
                    roleId: editUser?.roleId || (editUser?.role?.id) || '',
                    primaryBranchId: editUser?.primaryBranchId || (editUser?.primaryBranch?.id) || '',
                }}
                enableReinitialize={true}
                validationSchema={editUser ? editValidationSchema[currentStep] : validationSchema[currentStep]}
                onSubmit={handleNext}
            >
                {({ isSubmitting, values, setFieldValue }) => {
                    const handleBack = () => setCurrentStep(prev => prev - 1);
                    return (
                    <Form className="flex-1 flex flex-col">
                        <div className="p-10 flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {currentStep === 0 && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <User size={14} className="text-[#9120e8]" /> Username
                                                    </label>
                                                    <Field 
                                                        name="username" 
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" 
                                                        placeholder="e.g. j.ndifor" 
                                                    />
                                                    <ErrorMessage name="username" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <Mail size={14} className="text-[#9120e8]" /> Official Email
                                                    </label>
                                                    <Field 
                                                        name="email" 
                                                        type="email" 
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" 
                                                        placeholder="john.doe@ppc-hospital.com" 
                                                    />
                                                    <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <Lock size={14} className="text-[#9120e8]" /> Secret Key
                                                    </label>
                                                    <div className="relative">
                                                        <Field 
                                                            name="password" 
                                                            type={showPassword ? "text" : "password"} 
                                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" 
                                                            placeholder="••••••••" 
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9120e8]"
                                                        >
                                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>
                                                    <ErrorMessage name="password" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <Lock size={14} className="text-[#9120e8]" /> Confirm Key
                                                    </label>
                                                    <Field 
                                                        name="confirmPassword" 
                                                        type="password" 
                                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" 
                                                        placeholder="••••••••" 
                                                    />
                                                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">First Name</label>
                                                    <Field name="firstName" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" placeholder="John" />
                                                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Last Name</label>
                                                    <Field name="lastName" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" placeholder="Doe" />
                                                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <BadgeCheck size={14} className="text-[#9120e8]" /> Staff ID (Optional)
                                                    </label>
                                                    <Field name="staffId" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" placeholder="Auto-generated if empty" />
                                                    <ErrorMessage name="staffId" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                        <Phone size={14} className="text-[#9120e8]" /> Direct Line
                                                    </label>
                                                    <Field name="phone" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-purple-50 transition-all font-bold text-gray-700" placeholder="+237 6XX XXX XXX" />
                                                    <ErrorMessage name="phone" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                    <Shield size={16} className="text-[#9120e8]" /> Role Authorization
                                                </label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {roles.map(role => (
                                                        <div 
                                                            key={role.id}
                                                            onClick={() => setFieldValue('roleId', role.id)}
                                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                                                                Number(values.roleId) === role.id 
                                                                    ? 'bg-purple-50 border-[#9120e8] shadow-lg shadow-purple-50' 
                                                                    : 'bg-white border-gray-50 hover:border-purple-200'
                                                            }`}
                                                        >
                                                            <div>
                                                                <p className={`text-sm font-black capitalize ${Number(values.roleId) === role.id ? 'text-[#9120e8]' : 'text-gray-700'}`}>
                                                                    {role.roleName.replace(/_/g, ' ')}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{role.roleCode}</p>
                                                            </div>
                                                            {Number(values.roleId) === role.id && <CheckCircle2 size={20} className="text-[#9120e8]" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Field type="hidden" name="roleId" />
                                                <ErrorMessage name="roleId" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider" />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                    <Building2 size={16} className="text-[#9120e8]" /> Tactical Branch Assignment
                                                </label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {branches.map(branch => (
                                                        <div 
                                                            key={branch.id}
                                                            onClick={() => setFieldValue('primaryBranchId', branch.id)}
                                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                                                                Number(values.primaryBranchId) === branch.id 
                                                                    ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-50' 
                                                                    : 'bg-white border-gray-50 hover:border-blue-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                                    <MapPin size={16} />
                                                                </div>
                                                                <span className={`text-sm font-black ${Number(values.primaryBranchId) === branch.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                    {branch.branchName}
                                                                </span>
                                                            </div>
                                                            {Number(values.primaryBranchId) === branch.id && <CheckCircle2 size={20} className="text-blue-600" />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Field type="hidden" name="primaryBranchId" />
                                                <ErrorMessage name="primaryBranchId" component="div" className="text-red-500 text-[10px] font-black uppercase tracking-wider" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-8">
                                            <div className="bg-gradient-to-br from-[#9120e8] to-[#92f] p-10 rounded-[40px] text-white shadow-2xl shadow-purple-200 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                                    <BadgeCheck size={180} />
                                                </div>
                                                <div className="relative z-10 flex items-center gap-8">
                                                    <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center text-4xl font-black">
                                                        {values.firstName.charAt(0)}{values.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block">Reviewing Personnel File</span>
                                                        <h3 className="text-4xl font-black tracking-tight mb-2 uppercase">{values.firstName} {values.lastName}</h3>
                                                        <div className="flex items-center gap-4 text-purple-100 font-bold">
                                                            <span className="flex items-center gap-2"><Mail size={16} /> {values.email}</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                                                            <span className="flex items-center gap-2"><Briefcase size={16} /> {roles.find(r => r.id === Number(values.roleId))?.roleName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Username</p>
                                                    <p className="text-lg font-black text-gray-900">@{values.username}</p>
                                                </div>
                                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Staff ID</p>
                                                    <p className="text-lg font-black text-gray-900">{values.staffId || 'Auto-generated'}</p>
                                                </div>
                                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Branch</p>
                                                    <p className="text-lg font-black text-gray-600">{branches.find(b => b.id === Number(values.primaryBranchId))?.branchName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="p-10 bg-[#fafafa] border-t border-gray-100 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={currentStep === 0 ? onCancel : handleBack}
                                className="px-10 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
                            >
                                {currentStep === 0 ? 'Abort Engagement' : 'Return to Previous'}
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-[#9120e8] hover:bg-[#7a1bc2] text-white rounded-2xl shadow-xl shadow-purple-100 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {currentStep === steps.length - 1 ? (
                                    <>
                                        <BadgeCheck size={18} strokeWidth={3} />
                                        <span>Confirm Enlistment</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Proceed to Next</span>
                                        <ChevronRight size={18} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </Form>
                );
            }}
            </Formik>
        </div>
    );
};

export default UserCreateStepper;
