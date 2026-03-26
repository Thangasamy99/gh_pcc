import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Users,
  AlertCircle,
  Save,
  Check,
  Loader2,
  MapPin,
  Home,
  UserCircle,
  Briefcase,
  FileText,
  Info,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { securityService } from '../../services/securityService';
import { toast } from 'react-toastify';

const steps = [
  {
    id: 'identify',
    title: 'Identify Person',
    description: 'Select person type',
    icon: User
  },
  {
    id: 'details',
    title: 'Basic Details',
    description: 'Personal information',
    icon: FileText
  },
  {
    id: 'visit',
    title: 'Visit Type',
    description: 'Purpose of visit',
    icon: Briefcase
  },
  {
    id: 'direction',
    title: 'Direction',
    description: 'Assign destination',
    icon: MapPin
  },
  {
    id: 'confirm',
    title: 'Confirm & Save',
    description: 'Review and submit',
    icon: Check
  }
];

const validationSchemas = [
  Yup.object({
    personType: Yup.string().required('Please select person type')
  }),
  Yup.object({
    patientName: Yup.string().when('personType', {
      is: (val: string) => val !== 'VISITOR',
      then: (schema) => schema.required('Name is required')
    }),
    age: Yup.number().when('personType', {
      is: (val: string) => val !== 'VISITOR',
      then: (schema) => schema.required('Age is required').min(0).max(150)
    }),
    gender: Yup.string().when('personType', {
      is: (val: string) => val !== 'VISITOR',
      then: (schema) => schema.required('Gender is required')
    }),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().when('personType', {
      is: (val: string) => val === 'PATIENT' || val === 'EMERGENCY',
      then: (schema) => schema.required('Address is required')
    })
  }),
  Yup.object({
    visitType: Yup.string().required('Please select visit type')
  }),
  Yup.object({
    direction: Yup.string().required('Please select destination')
  }),
  Yup.object({})
];

interface SecurityEntryStepperProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  branchId: number;
  userId: number;
}

const SecurityEntryStepper: React.FC<SecurityEntryStepperProps> = ({
  isOpen,
  onClose,
  onSuccess,
  branchId,
  userId
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [wards, setWards] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWards();
      setActiveStep(0);
    }
  }, [isOpen, branchId]);

  const loadWards = async () => {
    try {
      const wardsData = await securityService.getAllWards(branchId);
      setWards(wardsData);
    } catch (error) {
      toast.error('Failed to load wards');
    }
  };

  const loadRooms = async (wardId: number) => {
    try {
      const data = await securityService.getRoomsByWard(wardId);
      setRooms(data);
    } catch (error) {
      toast.error('Failed to load rooms');
    }
  };

  const loadBeds = async (roomId: number) => {
    try {
      const data = await securityService.getBedsByRoom(roomId);
      setBeds(data);
    } catch (error) {
      toast.error('Failed to load beds');
    }
  };

  const formik = useFormik({
    initialValues: {
      personType: '',
      patientName: '',
      visitorName: '',
      age: '',
      gender: '',
      phoneNumber: '',
      address: '',
      visitType: '',
      direction: '',
      wardId: '',
      roomNumber: '',
      bedNumber: '',
      destinationDetails: '',
      branchId: branchId
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        setSubmitting(true);
        try {
          if (values.personType === 'VISITOR') {
            await securityService.registerVisitor({
              visitorName: values.visitorName || values.patientName,
              visitorPhone: values.phoneNumber,
              patientName: values.patientName,
              wardId: values.wardId ? parseInt(values.wardId) : undefined,
              roomNumber: values.roomNumber,
              bedNumber: values.bedNumber,
              purposeOfVisit: values.visitType,
              branchId: branchId
            }, userId);
          } else {
            await securityService.createPatientEntry({
              personType: values.personType,
              patientName: values.patientName,
              age: values.age ? parseInt(values.age.toString()) : undefined,
              gender: values.gender,
              phoneNumber: values.phoneNumber,
              address: values.address,
              visitType: values.visitType,
              direction: values.direction,
              destinationDetails: values.destinationDetails,
              branchId: branchId
            }, userId);
          }
          toast.success('Entry recorded successfully!');
          onSuccess?.();
          onClose();
        } catch (error) {
          console.error(error);
          toast.error('Failed to record entry');
        } finally {
          setSubmitting(false);
        }
      } else {
        handleNext();
      }
    }
  });

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const canProceed = () => {
    if (activeStep === 0) return formik.values.personType;
    if (activeStep === 1) {
      if (formik.values.personType === 'VISITOR') {
        return formik.values.visitorName && formik.values.phoneNumber;
      }
      return formik.values.patientName && formik.values.age && formik.values.gender && formik.values.phoneNumber;
    }
    if (activeStep === 2) return formik.values.visitType;
    if (activeStep === 3) return formik.values.direction;
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">New Entry Registration</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Close" aria-label="Close">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="px-6 py-8 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index < activeStep ? 'bg-green-500 text-white' : 
                      index === activeStep ? 'bg-primary text-white shadow-lg shadow-purple-200' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {index < activeStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <div className="absolute -bottom-6 w-max text-center">
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${index === activeStep ? 'text-primary' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 bg-gray-200 mx-2 -translate-y-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: index < activeStep ? '100%' : '0%' }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh - 250px)]">
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div key="step0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Who is entering?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'PATIENT', label: 'Patient', icon: UserCircle, color: '#3b82f6' },
                      { value: 'VISITOR', label: 'Visitor', icon: Users, color: '#10b981' },
                      { value: 'EMERGENCY', label: 'Emergency', icon: AlertCircle, color: '#ef4444' },
                      { value: 'STAFF', label: 'Staff', icon: Briefcase, color: '#8b5cf6' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => formik.setFieldValue('personType', type.value)}
                        className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                          formik.values.personType === type.value 
                            ? 'border-primary bg-purple-50 shadow-md' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <type.icon className="w-8 h-8 mb-2" style={{ color: type.color }} />
                        <span className="font-semibold">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
                  {formik.values.personType === 'VISITOR' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name *</label>
                        <input type="text" {...formik.getFieldProps('visitorName')} 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient to Visit</label>
                        <input type="text" {...formik.getFieldProps('patientName')} 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" placeholder="Enter patient name (optional)" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                        <input type="text" {...formik.getFieldProps('patientName')} 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                          <input type="number" {...formik.getFieldProps('age')} 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                          <select {...formik.getFieldProps('gender')} title="Select Gender"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none">
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="text" {...formik.getFieldProps('phoneNumber')} 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
                  </div>
                  {['PATIENT', 'EMERGENCY'].includes(formik.values.personType) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <textarea {...formik.getFieldProps('address')} rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none" />
                    </div>
                  )}
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Why are they here?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'OUTPATIENT', label: 'Outpatient Consultation', icon: UserCircle },
                      { value: 'INPATIENT_VISIT', label: 'Visit Admitted Patient', icon: Users },
                      { value: 'EMERGENCY', label: 'Emergency Case', icon: AlertCircle },
                      { value: 'MATERNITY', label: 'Maternity Unit', icon: Home },
                      { value: 'LAB', label: 'Laboratory Service', icon: FileText },
                      { value: 'PHARMACY', label: 'Pharmacy Service', icon: Briefcase }
                    ].map((visit) => (
                      <button
                        key={visit.value}
                        type="button"
                        onClick={() => formik.setFieldValue('visitType', visit.value)}
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all text-left ${
                          formik.values.visitType === visit.value 
                            ? 'border-primary bg-purple-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <visit.icon className="w-6 h-6 text-purple-600" />
                        <span className="font-medium text-sm">{visit.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Where are they going?</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                    <select {...formik.getFieldProps('direction')} title="Select Direction"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none">
                      <option value="">Select Destination</option>
                      <option value="RECEPTION">Reception</option>
                      <option value="CONSULTATION">Consultation Rooms</option>
                      <option value="EMERGENCY">Emergency Room</option>
                      <option value="WARD">Ward Units</option>
                      <option value="LABORATORY">Laboratory</option>
                      <option value="PHARMACY">Pharmacy</option>
                    </select>
                  </div>

                  {formik.values.direction === 'WARD' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Select Ward</label>
                        <select
                          name="wardId"
                          title="Select Ward"
                          className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          onChange={(e) => {
                            formik.setFieldValue('wardId', e.target.value);
                            loadRooms(parseInt(e.target.value));
                          }}
                        >
                          <option value="">Select Ward</option>
                          {wards.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.wardName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formik.values.wardId && (
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Room & Bed</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <select name="roomNumber" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" title="Select Room"
                              onChange={(e) => {
                                formik.setFieldValue('roomNumber', e.target.value);
                                const room = rooms.find(r => r.roomNumber === e.target.value);
                                if(room) loadBeds(room.id);
                              }}>
                              <option value="">Room</option>
                              {rooms.map(r => <option key={r.id} value={r.roomNumber}>{r.roomNumber}</option>)}
                            </select>
                            <select {...formik.getFieldProps('bedNumber')} title="Select Bed" className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
                              <option value="">Bed</option>
                              {beds.map(b => <option key={b.id} value={b.bedNumber}>{b.bedNumber}</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                    <textarea {...formik.getFieldProps('destinationDetails')} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none" placeholder="e.g. Accompanying person details..." />
                  </div>
                </motion.div>
              )}

              {activeStep === 4 && (
                <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="space-y-6">
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                    <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Registration Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Person Type</p>
                        <p className="font-semibold text-purple-900">{formik.values.personType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Visit Type</p>
                        <p className="font-semibold text-purple-900">{formik.values.visitType}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Name</p>
                        <p className="font-semibold text-purple-900">{formik.values.visitorName || formik.values.patientName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Phone</p>
                        <p className="font-semibold text-purple-900">{formik.values.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-400 uppercase">Destination</p>
                        <p className="font-semibold text-purple-900">{formik.values.direction}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                    <Info className="w-5 h-5 shrink-0" />
                    <p className="text-sm">A pass will be generated with a unique tracking ID once you submit.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
            <button
              onClick={handleBack}
              disabled={activeStep === 0 || submitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-gray-500 hover:bg-white transition-all disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => formik.handleSubmit()}
              disabled={!canProceed() || submitting}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-white bg-linear-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 shadow-lg shadow-purple-100 transition-all"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>{activeStep === steps.length - 1 ? 'Confirm Registration' : 'Next Step'}</span>
                  {activeStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecurityEntryStepper;
