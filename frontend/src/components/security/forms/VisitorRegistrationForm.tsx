import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Search, Printer, CheckCircle, User, MapPin, Building, Clock, Info } from 'lucide-react';
import { securityService } from '../../../services/securityService';
import { toast } from 'react-hot-toast';

interface VisitorRegistrationFormProps {
  onSuccess?: () => void;
}

const VisitorRegistrationForm: React.FC<VisitorRegistrationFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [foundPatients, setFoundPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorIdCard: '',
    address: '',
    relationship: 'FRIEND',
    patientName: '',
    wardId: '',
    roomNumber: '',
    bedNumber: '',
    purposeOfVisit: '',
    expectedExitTime: '',
    branchId: JSON.parse(localStorage.getItem('user') || '{}').branchId || 1
  });

  const [wards, setWards] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [wardData, relData] = await Promise.all([
          securityService.getAllWards(JSON.parse(localStorage.getItem('user') || '{}').branchId || 1),
          securityService.getRelationships()
        ]);
        setWards(wardData);
        setRelationships(relData);
      } catch (error) {
        console.error('Error loading static data', error);
      }
    };
    loadStaticData();
  }, []);

  const handlePatientSearch = async () => {
    if (!patientSearch.trim()) return;
    try {
      const results = await securityService.searchPatientInWard(patientSearch, formData.branchId);
      setFoundPatients(results);
    } catch (error) {
      toast.error('Patient search failed');
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientName: patient.patientName,
      wardId: patient.wardId,
      roomNumber: patient.roomNumber,
      bedNumber: patient.bedNumber
    }));
    setFoundPatients([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'wardId') {
      loadRooms(parseInt(value));
    } else if (name === 'roomNumber') {
      // Find room id from room number if needed, or update API to take roomNumber
    }
  };

  const loadRooms = async (wardId: number) => {
    try {
      const data = await securityService.getRoomsByWard(wardId);
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await securityService.registerVisitor({
        ...formData,
        wardId: formData.wardId ? parseInt(formData.wardId) : null
      }, user.userId);
      
      toast.success('Visitor registered successfully!');
      if (onSuccess) onSuccess();
      
      // Optionally trigger print
      if (window.confirm('Would you like to print the Visitor Pass?')) {
        await securityService.printVisitorPass(response.visitorId);
      }

      // Reset
      setFormData({
        visitorName: '',
        visitorPhone: '',
        visitorIdCard: '',
        address: '',
        relationship: 'FRIEND',
        patientName: '',
        wardId: '',
        roomNumber: '',
        bedNumber: '',
        purposeOfVisit: '',
        expectedExitTime: '',
        branchId: user.branchId || 1
      });
      setSelectedPatient(null);
    } catch (error) {
      toast.error('Failed to register visitor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Visitor Registration</h2>
            <p className="text-emerald-100 text-sm">Register and track hospital visitors</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Section 1: Visitor Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
            <User className="w-5 h-5" />
            <h3 className="uppercase tracking-wider text-xs">Visitor Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Visitor Full Name</label>
              <input
                name="visitorName"
                value={formData.visitorName}
                onChange={handleChange}
                required
                placeholder="Name on Identity Card"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="visitorPhone"
                  value={formData.visitorPhone}
                  onChange={handleChange}
                  required
                  placeholder="6xx xxx xxx"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">ID Card / Passport Number</label>
              <input
                name="visitorIdCard"
                value={formData.visitorIdCard}
                onChange={handleChange}
                placeholder="Enter ID number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Visitor Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Neighborhood / Quarter"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Visiting Target */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-teal-700 font-semibold mb-2">
            <Search className="w-5 h-5" />
            <h3 className="uppercase tracking-wider text-xs">Patient to Visit</h3>
          </div>

          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search admitted patient by name or room..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                />
              </div>
              <button 
                type="button"
                onClick={handlePatientSearch}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                Search
              </button>
            </div>

            <AnimatePresence>
              {foundPatients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                >
                  {foundPatients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPatient(p)}
                      className="w-full p-4 text-left hover:bg-emerald-50 border-b border-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{p.patientName}</p>
                        <p className="text-xs text-teal-600 font-medium">{p.wardName} - Room {p.roomNumber} - Bed {p.bedNumber}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedPatient && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider">Visiting Admitted Patient</p>
                  <p className="font-bold text-emerald-900">{selectedPatient.patientName}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="text-emerald-700 hover:text-emerald-900 text-sm font-medium"
              >
                Change
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Patient Name (Manual)</label>
              <input
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Type name if not found in list"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Relationship</label>
              <select
                name="relationship"
                title="Relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
              >
                {relationships.map(rel => (
                  <option key={rel.value} value={rel.value}>{rel.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Ward Info */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
            <Building className="w-5 h-5" />
            <h3 className="uppercase tracking-wider text-xs">Destination within Hospital</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ward / Unit</label>
              <select
                name="wardId"
                title="Ward"
                value={formData.wardId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value="">Select Ward</option>
                {wards.map(w => (
                  <option key={w.id} value={w.id}>{w.wardName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Room No.</label>
              <input
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 104"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bed No.</label>
              <input
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                placeholder="e.g. B-01"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Purpose of Visit</label>
            <textarea
              name="purposeOfVisit"
              value={formData.purposeOfVisit}
              onChange={handleChange}
              rows={2}
              placeholder="Briefly state reason for visit..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-linear-to-r from-emerald-600 to-teal-700 hover:shadow-emerald-200 hover:-translate-y-1 active:scale-95'
          }`}
        >
          {loading ? (
            'Registering...'
          ) : (
            <>
              <Printer className="w-5 h-5" />
              REGISTER VISITOR & PRINT PASS
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default VisitorRegistrationForm;
