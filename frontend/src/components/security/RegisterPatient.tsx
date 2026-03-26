import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { securityService } from '../../services/securityService';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface RegisterPatientProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RegisterPatient: React.FC<RegisterPatientProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [visitTypes, setVisitTypes] = useState<any[]>([]);
  const [directions, setDirections] = useState<any[]>([]);
  const [genders, setGenders] = useState<any[]>([]);

  const branchId = user?.branchId || 1;
  const userId = user?.userId || 1;

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      const [visitTypesData, directionsData, gendersData] = await Promise.all([
        securityService.getVisitTypes(),
        securityService.getDirections(),
        securityService.getGenders()
      ]);
      setVisitTypes(visitTypesData);
      setDirections(directionsData);
      setGenders(gendersData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      toast.error('Failed to load form data');
    }
  };

  const formik = useFormik({
    initialValues: {
      patientName: '',
      age: '',
      gender: '',
      phoneNumber: '',
      address: '',
      visitType: '',
      direction: '',
      destinationDetails: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required('Patient name is required'),
      age: Yup.number().required('Age is required').min(0).max(150),
      gender: Yup.string().required('Gender is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
      address: Yup.string().required('Address is required'),
      visitType: Yup.string().required('Visit type is required'),
      direction: Yup.string().required('Destination is required')
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const data = {
          personType: 'PATIENT',
          patientName: values.patientName,
          age: parseInt(values.age),
          gender: values.gender,
          phoneNumber: values.phoneNumber,
          address: values.address,
          visitType: values.visitType,
          direction: values.direction,
          destinationDetails: values.destinationDetails,
          branchId: branchId
        };
        
        const response = await securityService.createPatientEntry(data, userId);
        toast.success(`Patient registered successfully! Entry ID: ${response.entryId}`);
        if(onSuccess) onSuccess();
        else navigate('/security/dashboard');
      } catch (error) {
        console.error('Error registering patient:', error);
        toast.error('Failed to register patient');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onCancel || (() => navigate('/security/dashboard'))}
          title="Go Back"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register Patient Entry</h1>
          <p className="text-gray-500 mt-1">Record new patient at the security gate</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="patientName"
                value={formik.values.patientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.patientName && formik.errors.patientName
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                placeholder="Enter patient full name"
              />
            </div>
            {formik.touched.patientName && formik.errors.patientName && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.patientName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.age && formik.errors.age
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                placeholder="Age"
              />
              {formik.touched.age && formik.errors.age && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.gender && formik.errors.gender
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                title="Gender"
              >
                <option value="">Select Gender</option>
                {genders.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.address && formik.errors.address
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                placeholder="Enter full address"
              />
            </div>
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Type <span className="text-red-500">*</span>
              </label>
              <select
                name="visitType"
                value={formik.values.visitType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.visitType && formik.errors.visitType
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                title="Visit Type"
              >
                <option value="">Select Visit Type</option>
                {visitTypes.map(v => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
              {formik.touched.visitType && formik.errors.visitType && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.visitType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <select
                name="direction"
                value={formik.values.direction}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.direction && formik.errors.direction
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-primary'
                }`}
                title="Destination"
              >
                <option value="">Select Destination</option>
                {directions.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {formik.touched.direction && formik.errors.direction && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.direction}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              name="destinationDetails"
              value={formik.values.destinationDetails}
              onChange={formik.handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any special instructions or notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel || (() => navigate('/security/dashboard'))}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-[#7a1bc2] transition-colors flex items-center space-x-2 font-medium disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Register Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPatient;
