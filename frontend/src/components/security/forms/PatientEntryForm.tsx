import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
  X,
  UserPlus,
  Mail,
  Home,
  Building2,
  Briefcase,
  FileText,
  Hash,
  Globe,
  Map,
  Navigation,
  Locate,
  Crosshair,
  Radar,
  Satellite,
  MapPinned,
  Route,
  Waypoints,
  Heart,
  AlertTriangle,
  Shield,
  Activity,
  Thermometer,
  Droplet,
  Wind,
  Cloud,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Umbrella,
  Compass,
  ChevronDown
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { securityService } from '../../../services/securityService';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

interface PatientEntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PatientEntryForm: React.FC<PatientEntryFormProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [visitTypes, setVisitTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const branchId = 2; // Buea General Hospital
  const userId = user?.id || 13; // sec.motuba ID
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    setLoading(true);
    try {
      // Load all dropdown data in parallel
      const [visitTypesData, departmentsData, gendersData] = await Promise.all([
        securityService.getVisitTypes(),
        securityService.getDepartments(),
        securityService.getGenders()
      ]);
      
      setVisitTypes(visitTypesData);
      setDepartments(departmentsData);
      setGenders(gendersData);
      
      console.log('Dropdown data loaded:', { 
        visitTypes: visitTypesData.length, 
        departments: departmentsData.length,
        genders: gendersData.length 
      });
      
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast.error('Failed to load form data. Using default values.');
      
      // Set default values if API fails
      setVisitTypes([
        { value: 'OUTPATIENT', label: 'Outpatient Consultation' },
        { value: 'EMERGENCY', label: 'Emergency' },
        { value: 'LABORATORY', label: 'Laboratory' },
        { value: 'PHARMACY', label: 'Pharmacy' }
      ]);
      
      setDepartments([
        { value: 'RECEPTION', label: 'Reception' },
        { value: 'EMERGENCY', label: 'Emergency' },
        { value: 'LABORATORY', label: 'Laboratory' },
        { value: 'PHARMACY', label: 'Pharmacy' }
      ]);
      
      setGenders([
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'Other' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      gender: '',
      age: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      city: '',
      visitType: '',
      department: '',
      purposeOfVisit: '',
      isEmergency: 'NO',
      knownIllness: '',
      allergy: '',
      hasInsurance: 'NO'
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      gender: Yup.string().required('Gender is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
      visitType: Yup.string().required('Visit type is required'),
      department: Yup.string().required('Department is required')
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const data = {
          entryType: values.isEmergency === 'YES' ? 'EMERGENCY' : 'NORMAL',
          fullName: values.fullName,
          gender: values.gender,
          age: values.age ? parseInt(values.age) : null,
          phoneNumber: values.phoneNumber,
          address: values.address,
          visitType: values.visitType,
          department: values.department,
          purposeOfVisit: values.purposeOfVisit,
          emergencyType: values.isEmergency === 'YES' ? 'URGENT' : null,
          conditionDescription: values.isEmergency === 'YES' ? values.knownIllness : null,
          broughtBy: values.isEmergency === 'YES' ? values.broughtBy || 'Self' : null,
          branchId: parseInt(branchId.toString())
        };
        
        const response = await securityService.createPatientEntry(data, userId);
        toast.success(`Patient entry created! ID: ${response.entryId}`);
        onSuccess?.();
        navigate('/security/dashboard');
      } catch (error: any) {
        console.error('Error saving patient entry:', error);
        toast.error(error.response?.data?.message || 'Failed to save patient entry');
      } finally {
        setSubmitting(false);
      }
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onCancel || (() => navigate('/security/dashboard'))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Entry Form</h1>
          <p className="text-gray-500 mt-1">Record new patient at the hospital gate</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Basic Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.fullName && formik.errors.fullName
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="Enter patient full name"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.fullName}</p>
                )}
              </div>

              {/* Gender - DROPDOWN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.gender && formik.errors.gender
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    {genders.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Age"
                />
              </div>

              {/* Phone Number */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="+237 6XX XXX XXX"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                )}
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Street address"
                />
              </div>

              {/* City */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City"
                />
              </div>
            </div>
          </div>

          {/* Visit Details Section - THIS IS WHERE THE DROPDOWNS WERE MISSING */}
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
              Visit & Destination
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Visit Type - DROPDOWN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visit Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="visitType"
                    value={formik.values.visitType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.visitType && formik.errors.visitType
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                  >
                    <option value="">Select Visit Type</option>
                    {visitTypes.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {formik.touched.visitType && formik.errors.visitType && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.visitType}</p>
                )}
              </div>

              {/* Department - DROPDOWN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department / Unit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 border rounded-xl appearance-none focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.department && formik.errors.department
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-purple-500'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {formik.touched.department && formik.errors.department && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.department}</p>
                )}
              </div>

              {/* Purpose of Visit */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Visit
                </label>
                <textarea
                  name="purposeOfVisit"
                  value={formik.values.purposeOfVisit}
                  onChange={formik.handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief reason for visit"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={onCancel || (() => navigate('/security/dashboard'))}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientEntryForm;
