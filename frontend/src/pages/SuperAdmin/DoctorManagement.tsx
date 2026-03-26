import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Building2,
  Stethoscope,
  GraduationCap,
  History,
  Phone,
  Mail,
  MapPin,
  Save,
  Trash2,
  ShieldAlert,
  LayoutGrid,
  List,
  Eye,
  Edit3,
  ChevronRight
} from 'lucide-react';
import { doctorService, DoctorDTO } from '../../services/doctorService';
import { branchService } from '../../services/branchService';
import { toast } from 'react-hot-toast';

interface DoctorManagementProps {
  initialCreateMode?: boolean;
}

const RoomToSpecialization: Record<string, string[]> = {
  'Room 1': ['General Medicine'],
  'Room 2': ['Surgery', 'Orthopedic'],
  'Room 3': ['Child Specialist', 'Neonatal'],
  'Room 4': ['Gynecology', 'Maternity'],
  'Room 5': ['Dental Surgery'],
};

const DoctorManagement: React.FC<DoctorManagementProps> = ({ initialCreateMode = false }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>(initialCreateMode ? 'create' : 'list');
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'Male',
    qualification: '',
    experienceYears: 1,
    consultationRoom: '',
    specialization: '',
    availabilityStatus: 'AVAILABLE',
    branchId: 0,
    roleCode: 'DOCTOR'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [doctorsData, branchesData] = await Promise.all([
        doctorService.getAllDoctors(),
        branchService.getAllBranches()
      ]);
      setDoctors(doctorsData || []);
      setBranches(branchesData || []);
      if (branchesData && branchesData.length > 0) {
          setFormData(prev => ({ ...prev, branchId: branchesData[0].id }));
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomChange = (room: string) => {
    setSelectedRoom(room);
    setFormData({ 
      ...formData, 
      consultationRoom: room, 
      specialization: RoomToSpecialization[room]?.[0] || '' 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingDoctorId) {
        await doctorService.updateDoctor(editingDoctorId, formData as any);
        toast.success('Doctor updated successfully');
      } else {
        await doctorService.createDoctor(formData as any);
        toast.success('Doctor created successfully');
      }
      setActiveTab('list');
      setEditingDoctorId(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to save doctor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete doctor protocol? This action is irreversible.')) {
        try {
            await doctorService.deleteDoctor(id);
            toast.success('Doctor removed from system');
            fetchData();
        } catch (error) {
            toast.error('Deletion failed');
        }
    }
  };

  const handleEdit = (doctor: DoctorDTO) => {
    setEditingDoctorId(doctor.id || null);
    setFormData({
        ...formData,
        ...doctor,
        password: ''
    } as any);
    setActiveTab('create');
  };

  const handleViewProfile = (id: number) => {
    toast.success('Accessing profile data...');
    // Navigation logic here if needed
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold ring-1 ring-emerald-100 italic"><CheckCircle2 className="w-3 h-3 mr-1" /> Available</span>;
      case 'BUSY':
        return <span className="flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold ring-1 ring-amber-100 italic"><Clock className="w-3 h-3 mr-1" /> Busy</span>;
      case 'OFFLINE':
      default:
        return <span className="flex items-center px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold ring-1 ring-rose-100 italic"><XCircle className="w-3 h-3 mr-1" /> Offline</span>;
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.staffId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[85vh] bg-transparent p-6 font-primary text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#9120e8] to-[#4f09a3] bg-clip-text text-transparent">
              Doctor Intelligence
            </h1>
            <p className="text-gray-500 mt-2 font-medium flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-[#9120e8]" />
              Strategic resource management across clinical departments
            </p>
          </motion.div>

          <div className="flex bg-white/50 backdrop-blur-xl p-1.5 rounded-2xl shadow-inner-lg border border-white/20 ring-1 ring-[#9120e8]/10 overflow-hidden">
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex items-center px-8 py-3 rounded-xl transition-all duration-500 font-bold text-sm ${activeTab === 'list' ? 'bg-[#9120e8] text-white shadow-2xl scale-105' : 'text-gray-500 hover:bg-white/50'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Strategic Pool
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`flex items-center px-8 py-3 rounded-xl transition-all duration-500 font-bold text-sm ${activeTab === 'create' ? 'bg-[#9120e8] text-white shadow-2xl scale-105' : 'text-gray-500 hover:bg-white/50'}`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Onboard Professional
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div 
              key="create-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[-20px_20px_60px_#bebebe,20px_-20px_60px_#ffffff] border border-white p-10 overflow-hidden relative group"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9120e8]/10 to-transparent blur-3xl -z-10 group-hover:bg-[#9120e8]/20 transition-colors" />
                
                <div className="flex items-center space-x-4 mb-10 border-b border-[#9120e8]/10 pb-6">
                    <div className="p-4 bg-gradient-to-tr from-[#9120e8] to-[#6a15b5] rounded-2xl shadow-xl shadow-purple-200">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Create Medical Identity</h2>
                        <p className="text-xs text-[#9120e8] font-black uppercase tracking-[0.2em]">Super Admin Authorization Required</p>
                    </div>
                </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                {/* Personal Info */}
                <div className="space-y-6 lg:col-span-1">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <UserPlus className="w-3 h-3 mr-2" /> Basic Info
                    </h3>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Legal First Name *</label>
                            <input 
                                required
                                type="text" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                placeholder="Enter first name"
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-medium" 
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Legal Last Name *</label>
                            <input 
                                required
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                placeholder="Enter last name"
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-medium" 
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Gender Identification</label>
                            <select 
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-bold text-sm"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact & Credentials */}
                <div className="space-y-6 lg:col-span-1 border-l border-gray-100 pl-4 lg:pl-10">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <Mail className="w-3 h-3 mr-2" /> Credentials & Contact
                    </h3>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Institutional ID / Username *</label>
                            <input 
                                required
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="e.g. dr.mbella"
                                className="w-full px-5 py-3.5 bg-[#fef7ff] rounded-2xl border-2 border-[#9120e8]/5 focus:border-[#9120e8]/30 outline-none transition-all font-bold text-[#9120e8] placeholder:text-[#9120e8]/30" 
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Work Email Address *</label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="doctor@pcc.cm"
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-medium" 
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Secure System Password *</label>
                            <input 
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-medium" 
                            />
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block group-focus-within:text-[#9120e8] transition-colors">Active Phone Line *</label>
                            <input 
                                required
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+237 6XX XXX XXX"
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 focus:bg-white outline-none transition-all shadow-sm font-medium font-mono" 
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Mapping */}
                <div className="space-y-6 lg:col-span-1 border-l border-gray-100 pl-4 lg:pl-10">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <Stethoscope className="w-3 h-3 mr-2" /> Clinical Mapping
                    </h3>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Consultation Unit (Room) *</label>
                            <select 
                                required
                                value={formData.consultationRoom}
                                onChange={(e) => handleRoomChange(e.target.value)}
                                className="w-full px-5 py-3.5 bg-[#9120e8]/5 rounded-2xl border-2 border-[#9120e8]/20 focus:border-[#9120e8] outline-none transition-all font-black text-[#9120e8]"
                            >
                                <option value="">Select Room</option>
                                <option value="Room 1">Room 1 &rarr; General</option>
                                <option value="Room 2">Room 2 &rarr; Surgeon</option>
                                <option value="Room 3">Room 3 &rarr; Paediatrician</option>
                                <option value="Room 4">Room 4 &rarr; Gynaecologist</option>
                                <option value="Room 5">Room 5 &rarr; Dentist</option>
                            </select>
                        </div>
                        
                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Filtered Specialization</label>
                            <div className="w-full px-5 py-3.5 bg-gray-100 text-gray-400 rounded-2xl border-2 border-dashed border-gray-300 transition-all">
                                {selectedRoom ? (
                                    <select 
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                        className="w-full bg-transparent outline-none font-bold text-gray-700"
                                    >
                                        {RoomToSpecialization[selectedRoom].map(spec => (
                                            <option key={spec} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-xs font-bold font-mono">Select room first...</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Experience (Yrs)</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={formData.experienceYears}
                                    onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value)})}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 outline-none transition-all font-bold" 
                                />
                            </div>
                            <div className="group">
                                <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Active Branch</label>
                                <select 
                                    required
                                    value={formData.branchId}
                                    onChange={(e) => setFormData({...formData, branchId: parseInt(e.target.value)})}
                                    className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 outline-none transition-all text-xs font-bold"
                                >
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Availability Status</label>
                            <select 
                                value={formData.availabilityStatus}
                                onChange={(e) => setFormData({...formData, availabilityStatus: e.target.value})}
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 outline-none transition-all text-sm font-bold"
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="BUSY">Busy</option>
                                <option value="OFFLINE">Offline</option>
                            </select>
                        </div>

                        <div className="group">
                            <label className="text-xs font-bold text-gray-500 ml-2 mb-1 block">Clinical Role</label>
                            <select 
                                value={formData.roleCode}
                                onChange={(e) => setFormData({...formData, roleCode: e.target.value})}
                                className="w-full px-5 py-3.5 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#9120e8]/30 outline-none transition-all text-sm font-bold uppercase tracking-widest text-[#9120e8]"
                            >
                                <option value="DOCTOR">General Doctor</option>
                                <option value="SURGEON">Specialist Surgeon</option>
                                <option value="SPECIALIST">Medical Specialist</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3 pt-10 flex justify-end space-x-6 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={() => setActiveTab('list')}
                        className="px-10 py-4 text-gray-500 font-black text-sm uppercase tracking-widest hover:text-gray-700 transition-colors"
                    >
                        Abort Protocol
                    </button>
                    <motion.button 
                        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                        whileTap={{ scale: 0.95 }}
                        disabled={formLoading}
                        className="px-12 py-4 bg-gradient-to-r from-[#9120e8] via-[#8213d4] to-[#4f09a3] text-white rounded-[1.5rem] shadow-[0_20px_40px_-15px_rgba(145,32,232,0.4)] font-black text-sm uppercase tracking-[0.3em] flex items-center disabled:opacity-50"
                    >
                        {formLoading ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        ) : (
                            <Save className="w-5 h-5 mr-3" />
                        )}
                        Finalize Onboarding
                    </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#9120e8] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name, ID, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white rounded-3xl border-none shadow-xl shadow-gray-200/50 outline-none font-bold text-gray-700 text-lg placeholder:text-gray-300 ring-1 ring-gray-100 focus:ring-4 focus:ring-[#9120e8]/20 transition-all"
                  />
                </div>
                <div className="flex bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-1.5 ring-1 ring-gray-100">
                  <button 
                    onClick={() => setViewMode('card')}
                    className={`p-4 rounded-2xl transition-all ${viewMode === 'card' ? 'bg-[#9120e8] text-white shadow-lg shadow-[#9120e8]/20' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <LayoutGrid className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-4 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-[#9120e8] text-white shadow-lg shadow-[#9120e8]/20' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <List className="w-6 h-6" />
                  </button>
                  <div className="w-px h-8 bg-gray-100 my-auto mx-2" />
                  <button className="p-4 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors"><Filter className="w-6 h-6" /></button>
                  <button onClick={fetchData} className="p-4 hover:bg-gray-50 rounded-2xl text-[#9120e8] transition-colors"><History className="w-6 h-6" /></button>
                </div>
              </div>

              {/* Doctors Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-[#9120e8]/10 border-t-[#9120e8] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Stethoscope className="w-10 h-10 text-[#9120e8] animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[#9120e8] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Medical Database</p>
                </div>
              ) : (
                viewMode === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor, index) => (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 hover:shadow-[0_40px_80px_-20px_rgba(145,32,232,0.15)] transition-all border border-transparent hover:border-[#9120e8]/10 relative overflow-hidden"
                      >
                        {/* Status Dot */}
                        <div className="absolute top-8 right-8">
                          {getStatusBadge(doctor.availabilityStatus)}
                        </div>

                        <div className="flex items-start space-x-6 mb-8 mt-2">
                          <div className="relative">
                              <div className="w-20 h-20 bg-gradient-to-br from-[#9120e8] to-[#4f09a3] rounded-3xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-6 transition-transform">
                                  <span className="text-2xl font-black text-white">{doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}</span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-2xl shadow-lg border-4 border-gray-50 flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-gray-400" />
                              </div>
                          </div>
                          <div className="pt-2">
                            <h3 className="text-xl font-black text-gray-900 leading-tight">Dr. {doctor.firstName} {doctor.lastName}</h3>
                            <p className="text-[#9120e8] font-bold text-xs uppercase tracking-widest mt-1">{doctor.staffId}</p>
                            <div className="mt-4 flex items-center text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
                              <MapPin className="w-3 h-3 mr-1" /> {doctor.branchName}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-gray-50/50 p-4 rounded-3xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Unit / Room</p>
                              <p className="text-sm font-black text-gray-900">{doctor.consultationRoom || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50/50 p-4 rounded-3xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Expertise</p>
                              <p className="text-sm font-black text-gray-900 truncate">{doctor.specialization || 'General Medicine'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                          <div className="flex -space-x-2">
                              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-purple-100 hover:text-[#9120e8] transition-all cursor-pointer border border-white shadow-sm ring-2 ring-white">
                                  <Phone className="w-4 h-4" />
                              </div>
                              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-purple-100 hover:text-[#9120e8] transition-all cursor-pointer border border-white shadow-sm ring-2 ring-white">
                                  <Mail className="w-4 h-4" />
                              </div>
                              <div 
                                onClick={() => handleEdit(doctor)}
                                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-purple-100 hover:text-[#9120e8] transition-all cursor-pointer border border-white shadow-sm ring-2 ring-white"
                              >
                                  <Edit3 className="w-4 h-4" />
                              </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleDelete(doctor.id!)}
                                className="w-10 h-10 rounded-2xl hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all text-gray-300"
                              >
                                  <Trash2 className="w-5 h-5" />
                              </button>
                              <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleViewProfile(doctor.id!)}
                                  className="w-12 h-12 bg-gray-900 text-white rounded-[1.2rem] shadow-lg flex items-center justify-center"
                              >
                                  <ChevronRight className="w-6 h-6" />
                              </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* List View Table */
                  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden ring-1 ring-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Doctor Profile</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Service / Room</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Expertise</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Facility</th>
                            <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredDoctors.map((doctor) => (
                            <motion.tr 
                              key={doctor.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="group hover:bg-gray-50/80 transition-all cursor-default"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-[#9120e8]/10 rounded-2xl flex items-center justify-center text-[#9120e8] font-black group-hover:scale-110 transition-transform">
                                    {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-black text-gray-900 text-sm">Dr. {doctor.firstName} {doctor.lastName}</p>
                                    <p className="text-[10px] font-bold text-[#9120e8] uppercase tracking-widest">{doctor.staffId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-sm font-black text-gray-700">{doctor.consultationRoom || 'N/A'}</p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-600 w-fit uppercase tracking-tighter shadow-sm border border-gray-200/50">
                                  {doctor.specialization || 'General Practice'}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center text-xs font-bold text-gray-500">
                                  <Building2 className="w-3.5 h-3.5 mr-2 opacity-50" />
                                  {doctor.branchName}
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                {getStatusBadge(doctor.availabilityStatus)}
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center justify-end space-x-3 transition-all">
                                  <button onClick={() => handleEdit(doctor)} className="p-2.5 hover:bg-white hover:shadow-xl rounded-[1rem] text-gray-400 hover:text-[#9120e8] transition-all bg-gray-50/50">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDelete(doctor.id!)} className="p-2.5 hover:bg-white hover:shadow-xl rounded-[1rem] text-gray-400 hover:text-rose-500 transition-all bg-gray-50/50">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleViewProfile(doctor.id!)} className="p-2.5 bg-gray-900 text-white rounded-[1rem] shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transition-all">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default DoctorManagement;
