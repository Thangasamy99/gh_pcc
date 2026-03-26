import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Search,
  Phone,
  Clock,
  AlertTriangle,
  Loader2,
  X,
  ShieldCheck,
  User,
  Heart
} from 'lucide-react';
import { receptionService } from '../../services/receptionService';
import { PatientEntry } from '../../types/reception';
import PrintHeader from '../../components/common/PrintHeader';
import PrintWrapper from '../../components/common/PrintWrapper';

const DailyPatients: React.FC = () => {
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisitType, setFilterVisitType] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatientsData();
  }, [patients, searchTerm, filterVisitType, filterGender]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await receptionService.getTodayPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError("Failed to load today's patients");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPatientsData = () => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.entryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phoneNumber.includes(searchTerm)
      );
    }
    if (filterVisitType !== 'all') {
      filtered = filtered.filter((p) => p.visitType === filterVisitType);
    }
    if (filterGender !== 'all') {
      filtered = filtered.filter((p) => p.gender === filterGender);
    }
    setFilteredPatients(filtered);
  };

  const getVisitTypeBadge = (visitType: string) => {
    const styles: Record<string, string> = {
      CONSULTATION: 'bg-blue-100 text-blue-700 border-blue-200',
      FOLLOW_UP: 'bg-green-100 text-green-700 border-green-200',
      EMERGENCY: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[visitType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      IN_RECEPTION: 'bg-blue-100 text-blue-700 border-blue-200',
      AT_CASHIER: 'bg-purple-100 text-purple-700 border-purple-200',
      IN_CONSULTATION: 'bg-green-100 text-green-700 border-green-200',
      COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const stats = {
    total: patients.length,
    male: patients.filter((p) => p.gender === 'MALE').length,
    female: patients.filter((p) => p.gender === 'FEMALE').length,
    consultation: patients.filter((p) => p.visitType === 'CONSULTATION').length,
    followUp: patients.filter((p) => p.visitType === 'FOLLOW_UP').length,
    emergency: patients.filter((p) => p.visitType === 'EMERGENCY').length,
    withInsurance: patients.filter((p) => p.hasInsurance).length,
  };

  const ageGroups = {
    children: patients.filter((p) => p.age < 13).length,
    teens: patients.filter((p) => p.age >= 13 && p.age < 20).length,
    adults: patients.filter((p) => p.age >= 20 && p.age < 60).length,
    seniors: patients.filter((p) => p.age >= 60).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#6C2BD9] animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#6C2BD9]" />
            Daily Patients Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Summary for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrintWrapper>
            <PrintHeader 
              title="DAILY PATIENT VISITS REPORT" 
              showSignature={true}
              medicalOfficerName="Medical Officer in Charge"
            />
            <div className="overflow-hidden border border-gray-200 rounded-xl mt-4 text-left">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 uppercase text-[10px] font-bold text-gray-500">
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Age/Gender</th>
                    <th className="py-3 px-4">Visit Type</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 italic">
                  {filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 px-4 text-sm font-mono">{p.patientId || p.entryId}</td>
                      <td className="py-2 px-4 text-sm font-medium">{p.patientName}</td>
                      <td className="py-2 px-4 text-sm">{p.age}y / {p.gender}</td>
                      <td className="py-2 px-4 text-sm text-[10px]">{p.visitType?.replace('_', ' ')}</td>
                      <td className="py-2 px-4 text-sm">{p.department}</td>
                      <td className="py-2 px-4 text-sm">{p.entryTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-12 text-center text-[10px] text-gray-400 border-t pt-4">
              <p>Certified by PCC HMS Reporting Service - {new Date().toLocaleString()}</p>
            </div>
          </PrintWrapper>
          <button 
            onClick={fetchPatients}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors bg-white shadow-sm font-medium text-sm"
          >
            <Clock className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 no-print">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 no-print">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Male / Female</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.male} / {stats.female}
              </p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.emergency}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Insured</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.withInsurance}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

       {/* Age Groups */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 no-print">
        <h2 className="text-base font-bold text-gray-900 mb-4">Age Group Distribution</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-2xl font-bold text-blue-600">{ageGroups.children}</p>
            <p className="text-xs text-blue-500 font-medium mt-1">Children (&lt;13)</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-2xl font-bold text-indigo-600">{ageGroups.teens}</p>
            <p className="text-xs text-indigo-500 font-medium mt-1">Teens (13-19)</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-2xl font-bold text-purple-600">{ageGroups.adults}</p>
            <p className="text-xs text-purple-500 font-medium mt-1">Adults (20-59)</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-2xl font-bold text-amber-600">{ageGroups.seniors}</p>
            <p className="text-xs text-amber-500 font-medium mt-1">Seniors (60+)</p>
          </div>
        </div>
      </div>

       {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 no-print">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#6C2BD9]/30 flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
          <select
            value={filterVisitType}
            onChange={(e) => setFilterVisitType(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#6C2BD9]/30 outline-none"
          >
            <option value="all">All Visit Types</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="FOLLOW_UP">Follow-up</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#6C2BD9]/30 outline-none"
          >
            <option value="all">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden no-print">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">
            Patient List ({filteredPatients.length})
          </h2>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entry ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age/Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visit</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Insurance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-[#6C2BD9]">{patient.entryId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold text-purple-600">
                            {patient.patientName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{patient.patientName}</p>
                          {patient.city && (
                            <p className="text-[10px] text-gray-400">{patient.city}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{patient.age}y</p>
                      <p className="text-[10px] text-gray-400">{patient.gender}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        {patient.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getVisitTypeBadge(
                          patient.visitType
                        )}`}
                      >
                        {patient.visitType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{patient.department}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {patient.entryTime}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          patient.hasInsurance
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {patient.hasInsurance ? 'Insured' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          patient.status
                        )}`}
                      >
                        {patient.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {patient.isEmergency ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          Emergency
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold border border-green-200">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPatients;
