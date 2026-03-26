// src/components/branches/CreateBranchStepper.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    FileText,
    Check,
    ChevronRight,
    ChevronLeft,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle,
    Info,
    Hash
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { branchService } from '../../services/branchService';
import { toast } from 'react-toastify';

// Step configuration
const steps = [
    {
        id: 'basic',
        title: 'Basic Information',
        description: 'Enter branch code and name',
        icon: Building2
    },
    {
        id: 'location',
        title: 'Location Details',
        description: 'Address, city, and region',
        icon: MapPin
    },
    {
        id: 'contact',
        title: 'Contact Information',
        description: 'Phone and email',
        icon: Phone
    },
    {
        id: 'legal',
        title: 'Legal Information',
        description: 'Registration and tax details',
        icon: FileText
    },
    {
        id: 'review',
        title: 'Review & Confirm',
        description: 'Verify all information',
        icon: Check
    }
];

// Validation schemas for each step
const validationSchemas = [
    Yup.object({
        branchCode: Yup.string()
            .required('Branch code is required')
            .min(3, 'Must be at least 3 characters')
            .max(20, 'Cannot exceed 20 characters')
            .matches(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens'),
        branchName: Yup.string()
            .required('Branch name is required')
            .min(3, 'Must be at least 3 characters')
            .max(100, 'Cannot exceed 100 characters'),
        branchType: Yup.string()
            .required('Branch type is required')
            .oneOf(['HOSPITAL', 'CENTRAL_PHARMACY'], 'Invalid branch type')
    }),
    Yup.object({
        address: Yup.string()
            .required('Address is required')
            .max(500, 'Cannot exceed 500 characters'),
        city: Yup.string()
            .required('City is required')
            .max(50, 'Cannot exceed 50 characters'),
        region: Yup.string()
            .required('Region is required')
            .max(50, 'Cannot exceed 50 characters')
    }),
    Yup.object({
        phone: Yup.string()
            .required('Phone number is required')
            .matches(/^\+?[0-9\s-]{8,20}$/, 'Invalid phone number format'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email format')
            .max(100, 'Cannot exceed 100 characters')
    }),
    Yup.object({
        registrationNumber: Yup.string()
            .required('Registration number is required')
            .max(50, 'Cannot exceed 50 characters'),
        taxId: Yup.string()
            .max(50, 'Cannot exceed 50 characters'),
        establishedDate: Yup.date()
            .required('Established date is required')
            .max(new Date(), 'Date cannot be in the future')
    }),
    Yup.object({})
];

// Step Components
const BasicInfoStep = ({ formik, checkingCode, checkingName }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="branchCode"
                    value={formik.values.branchCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.branchCode && formik.errors.branchCode
                        ? 'border-red-300 focus:ring-red-200'
                        : formik.values.branchCode && !checkingCode
                            ? 'border-green-300 focus:ring-green-200'
                            : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="e.g., HOS-001"
                />
                {checkingCode && (
                    <div className="absolute right-3 top-3">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                )}
                {!checkingCode && formik.values.branchCode && !formik.errors.branchCode && (
                    <div className="absolute right-3 top-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                )}
            </div>
            {formik.touched.branchCode && formik.errors.branchCode && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.branchCode}</p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    name="branchName"
                    value={formik.values.branchName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.branchName && formik.errors.branchName
                        ? 'border-red-300 focus:ring-red-200'
                        : formik.values.branchName && !checkingName
                            ? 'border-green-300 focus:ring-green-200'
                            : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="e.g., Buea General Hospital"
                />
                {checkingName && (
                    <div className="absolute right-3 top-3">
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                )}
                {!checkingName && formik.values.branchName && !formik.errors.branchName && (
                    <div className="absolute right-3 top-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                )}
            </div>
            {formik.touched.branchName && formik.errors.branchName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.branchName}</p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => formik.setFieldValue('branchType', 'HOSPITAL')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center space-x-2 transition-all ${formik.values.branchType === 'HOSPITAL'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200'
                        }`}
                >
                    <Building2 className="w-5 h-5" />
                    <span>Hospital</span>
                </button>
                <button
                    type="button"
                    onClick={() => formik.setFieldValue('branchType', 'CENTRAL_PHARMACY')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center space-x-2 transition-all ${formik.values.branchType === 'CENTRAL_PHARMACY'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200'
                        }`}
                >
                    <Building2 className="w-5 h-5" />
                    <span>Central Pharmacy</span>
                </button>
            </div>
            {formik.touched.branchType && formik.errors.branchType && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.branchType}</p>
            )}
        </div>
    </motion.div>
);

const LocationStep = ({ formik }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
            </label>
            <textarea
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.address && formik.errors.address
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-purple-200'
                    }`}
                placeholder="Enter full address"
            />
            {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.city && formik.errors.city
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="e.g., Buea"
                />
                {formik.touched.city && formik.errors.city && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                </label>
                <select
                    name="region"
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.region && formik.errors.region
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                >
                    <option value="">Select Region</option>
                    <option value="South West">South West</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Centre">Centre</option>
                    <option value="West">West</option>
                    <option value="North West">North West</option>
                    <option value="North">North</option>
                    <option value="Adamawa">Adamawa</option>
                    <option value="East">East</option>
                    <option value="South">South</option>
                    <option value="Far North">Far North</option>
                </select>
                {formik.touched.region && formik.errors.region && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.region}</p>
                )}
            </div>
        </div>
    </motion.div>
);

const ContactStep = ({ formik }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.phone && formik.errors.phone
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="+237 677 123 456"
                />
            </div>
            {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.email && formik.errors.email
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="branch@hospital.cm"
                />
            </div>
            {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
        </div>
    </motion.div>
);

const LegalStep = ({ formik }: any) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
    >
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    name="registrationNumber"
                    value={formik.values.registrationNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.registrationNumber && formik.errors.registrationNumber
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                    placeholder="PCC-HOS-1978-001"
                />
            </div>
            {formik.touched.registrationNumber && formik.errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.registrationNumber}</p>
            )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID
            </label>
            <div className="relative">
                <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    name="taxId"
                    value={formik.values.taxId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Tax identification number"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="date"
                    name="establishedDate"
                    value={formik.values.establishedDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formik.touched.establishedDate && formik.errors.establishedDate
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-200'
                        }`}
                />
            </div>
            {formik.touched.establishedDate && formik.errors.establishedDate && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.establishedDate}</p>
            )}
        </div>
    </motion.div>
);

const ReviewStep = ({ formik }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-6"
    >
        <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="font-semibold text-purple-800 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Branch Information Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">Branch Code</p>
                    <p className="font-medium">{formik.values.branchCode}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Branch Name</p>
                    <p className="font-medium">{formik.values.branchName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Branch Type</p>
                    <p className="font-medium">{formik.values.branchType}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="font-medium">{formik.values.region}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{formik.values.city}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{formik.values.phone}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{formik.values.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Registration</p>
                    <p className="font-medium">{formik.values.registrationNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Tax ID</p>
                    <p className="font-medium">{formik.values.taxId || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium">{new Date(formik.values.establishedDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500">Full Address</p>
                <p className="font-medium">{formik.values.address}</p>
            </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <p className="text-sm text-yellow-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Please review all information carefully before creating the branch.
            </p>
        </div>
    </motion.div>
);

// Main CreateBranchStepper Component
interface CreateBranchStepperProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CreateBranchStepper: React.FC<CreateBranchStepperProps> = ({ onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [checkingCode, setCheckingCode] = useState(false);
    const [checkingName, setCheckingName] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            branchCode: '',
            branchName: '',
            branchType: 'HOSPITAL' as 'HOSPITAL' | 'CENTRAL_PHARMACY',
            address: '',
            city: '',
            region: '',
            phone: '',
            email: '',
            registrationNumber: '',
            taxId: '',
            establishedDate: '',
        },
        validationSchema: validationSchemas[activeStep],
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            if (activeStep === steps.length - 1) {
                setSubmitting(true);
                try {
                    await branchService.createBranch(values);
                    toast.success('Branch created successfully!');
                    onSuccess?.();
                    navigate('/superadmin/branches');
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to create branch');
                } finally {
                    setSubmitting(false);
                }
            } else {
                handleNext();
            }
        },
    });

    // Auto-generate branch code
    useEffect(() => {
        const generateBranchCode = async () => {
            if (!formik.values.branchType) return;

            try {
                const count = await branchService.getCountByType(formik.values.branchType);
                const prefix = formik.values.branchType === 'HOSPITAL' ? 'HOS' : 'CPH';
                const nextId = (count + 1).toString().padStart(3, '0');
                const generatedCode = `${prefix}-${nextId}`;

                // Only set if current value is empty or looks like a previous auto-generated one
                if (!formik.values.branchCode ||
                    /^(HOS|CPH)-\d{3}$/.test(formik.values.branchCode)) {
                    formik.setFieldValue('branchCode', generatedCode);
                }
            } catch (error) {
                console.error('Failed to generate branch code:', error);
            }
        };

        generateBranchCode();
    }, [formik.values.branchType]);

    // Check branch code uniqueness
    useEffect(() => {
        const checkCode = async () => {
            if (formik.values.branchCode && !formik.errors.branchCode) {
                setCheckingCode(true);
                try {
                    const exists = await branchService.checkBranchCode(formik.values.branchCode);
                    if (exists) {
                        formik.setFieldError('branchCode', 'Branch code already exists');
                    }
                } catch (error) {
                    console.error('Error checking branch code:', error);
                } finally {
                    setCheckingCode(false);
                }
            }
        };

        const timer = setTimeout(checkCode, 500);
        return () => clearTimeout(timer);
    }, [formik.values.branchCode]);

    // Check branch name uniqueness
    useEffect(() => {
        const checkName = async () => {
            if (formik.values.branchName && !formik.errors.branchName) {
                setCheckingName(true);
                try {
                    const exists = await branchService.checkBranchName(formik.values.branchName);
                    if (exists) {
                        formik.setFieldError('branchName', 'Branch name already exists');
                    }
                } catch (error) {
                    console.error('Error checking branch name:', error);
                } finally {
                    setCheckingName(false);
                }
            }
        };

        const timer = setTimeout(checkName, 500);
        return () => clearTimeout(timer);
    }, [formik.values.branchName]);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const canProceed = () => {
        if (activeStep === 0) {
            return formik.values.branchCode &&
                formik.values.branchName &&
                formik.values.branchType &&
                !formik.errors.branchCode &&
                !formik.errors.branchName &&
                !checkingCode &&
                !checkingName;
        }
        return formik.isValid;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-12"
            >
                <h1 className="text-2xl font-bold text-gray-900">Create New Branch</h1>
                <p className="text-gray-500 mt-1">Add a new hospital branch to the system</p>
            </motion.div>

            {/* Stepper */}
            <div className="mb-24 px-4">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Step Indicator */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <motion.div
                                    animate={{
                                        scale: index === activeStep ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{ duration: 0.3, repeat: index === activeStep ? Infinity : 0, repeatDelay: 1 }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${index < activeStep
                                        ? 'bg-green-500 text-white'
                                        : index === activeStep
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-200'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {index < activeStep ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-6 h-6" />
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-40 text-center">
                                    <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                </div>
                            </motion.div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                        className={`h-1 rounded-full ${index < activeStep ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Form */}
            <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
            >
                <form onSubmit={formik.handleSubmit}>
                    <AnimatePresence mode="wait">
                        {activeStep === 0 && (
                            <BasicInfoStep formik={formik} checkingCode={checkingCode} checkingName={checkingName} />
                        )}
                        {activeStep === 1 && <LocationStep formik={formik} />}
                        {activeStep === 2 && <ContactStep formik={formik} />}
                        {activeStep === 3 && <LegalStep formik={formik} />}
                        {activeStep === 4 && <ReviewStep formik={formik} />}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all ${activeStep === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </motion.button>

                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={onCancel || (() => navigate('/superadmin/branches'))}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={!canProceed() || submitting}
                                className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl flex items-center space-x-2 transition-all ${!canProceed() || submitting
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-lg hover:shadow-purple-200'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : activeStep === steps.length - 1 ? (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Create Branch</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Next</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateBranchStepper;
