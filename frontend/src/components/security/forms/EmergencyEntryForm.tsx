import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Heart, User, Shield, CheckCircle, Navigation, Ambulance, Info, Phone, Loader2, ChevronDown } from 'lucide-react';
import { securityService } from '../../../services/securityService';
import { toast } from 'react-hot-toast';

interface EmergencyEntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EmergencyEntryForm: React.FC<EmergencyEntryFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [emergencyTypes, setEmergencyTypes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    patientName: '',
    approxAge: '',
    gender: 'MALE',
    emergencyType: '',
    accompaniedBy: '',
    phoneNumber: '',
    arrivalTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    sendToDepartment: '',
    additionalInfo: '',
    branchId: 2 // Buea General Hospital
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    setDropdownLoading(true);
    try {
      const [typeData, deptData] = await Promise.all([
        securityService.getEmergencyTypes(),
        securityService.getDepartments()
      ]);
      
      setEmergencyTypes(typeData);
      setDepartments(deptData);
      
      // Set default selections if available
      if (typeData.length > 0) setFormData(prev => ({ ...prev, emergencyType: typeData[0].value }));
      if (deptData.length > 0) {
        const emergencyDept = deptData.find((d: any) => d.value === 'EMERGENCY') || deptData[0];
        setFormData(prev => ({ ...prev, sendToDepartment: emergencyDept.value }));
      }
      
    } catch (error) {
      console.error('Error loading dropdowns', error);
      toast.error('Failed to load emergency data');
      
      // Fallback data
      setEmergencyTypes([
        { value: 'ACCIDENT', label: 'Accident' },
        { value: 'CARDIAC', label: 'Cardiac' },
        { value: 'OTHER', label: 'Other' }
      ]);
      setDepartments([
        { value: 'EMERGENCY', label: 'Emergency' },
        { value: 'RECEPTION', label: 'Reception' }
      ]);
      setFormData(prev => ({ ...prev, emergencyType: 'ACCIDENT', sendToDepartment: 'EMERGENCY' }));
    } finally {
      setDropdownLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : { userId: 13 }; // Fallback to sec.motuba
      
      await securityService.createPatientEntry({
        personType: 'PATIENT',
        patientName: formData.patientName,
        gender: formData.gender,
        age: formData.approxAge ? parseInt(formData.approxAge) : null,
        phoneNumber: formData.phoneNumber,
        visitType: 'EMERGENCY',
        department: formData.sendToDepartment,
        purposeOfVisit: `Emergency: ${formData.emergencyType}. ${formData.additionalInfo}`,
        isEmergency: true,
        branchId: formData.branchId
      }, user.userId);
      
      toast.success('CRITICAL: Emergency entry recorded!');
      if (onSuccess) onSuccess();
      
      // Reset
      setFormData(prev => ({
        ...prev,
        patientName: '',
        approxAge: '',
        accompaniedBy: '',
        phoneNumber: '',
        additionalInfo: ''
      }));
    } catch (error) {
      console.error('Error submitting emergency:', error);
      toast.error('Failed to register emergency entry.');
    } finally {
      setLoading(false);
    }
  };

  if (dropdownLoading) {
    return (
      <div className="p-12 flex justify-center items-center bg-white rounded-2xl shadow-sm border border-red-100">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-red-100"
    >
      <div className="bg-linear-to-r from-red-600 to-rose-700 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Ambulance className="w-24 h-24 rotate-12" />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">CRITICAL EMERGENCY ENTRY</h2>
            <p className="text-red-100 text-sm">Priority registration for immediate care</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-red-50/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Patient Name (Unknown if n/a)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                placeholder="Full name or 'UNKNOWN MALE/FEMALE'"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white font-medium shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Approx. Age</label>
              <input
                name="approxAge"
                type="number"
                value={formData.approxAge}
                onChange={handleChange}
                placeholder="Years"
                className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white shadow-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Gender</label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white appearance-none shadow-xs"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Type of Emergency</label>
            <div className="relative">
              <select
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white font-semibold text-red-700 appearance-none shadow-xs"
              >
                {emergencyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Arrival Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                name="arrivalTime"
                type="time"
                value={formData.arrivalTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white shadow-xs"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Accompanied By</label>
            <input
              name="accompaniedBy"
              value={formData.accompaniedBy}
              onChange={handleChange}
              placeholder="Name of relative / Good Samaritan"
              className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white shadow-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Relative Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Relative's contact number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white shadow-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Direct to Department</label>
          <div className="flex flex-wrap gap-2">
            {departments.map(dept => (
              <button
                key={dept.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sendToDepartment: dept.value }))}
                className={`px-4 py-2 rounded-xl border-2 transition-all font-bold text-xs ${
                  formData.sendToDepartment === dept.value
                    ? 'bg-red-600 border-red-600 text-white shadow-md'
                    : 'bg-white border-red-100 text-red-600 hover:border-red-300'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-red-900 uppercase tracking-wide">Critical Observations / Notes</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={2}
            placeholder="Describe injuries, condition, or items found on patient..."
            className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:ring-2 focus:ring-red-500 outline-none bg-white resize-none shadow-xs"
          />
        </div>

        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 rounded-xl font-bold bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50 transition-all"
            >
              CANCEL
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`flex-(grow-2) py-4 rounded-xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-3 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-linear-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5" />
                DIRECT TO {formData.sendToDepartment} NOW
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EmergencyEntryForm;
