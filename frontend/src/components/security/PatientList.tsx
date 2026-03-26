import React, { useState, useEffect } from 'react';
import { Search, User, Clock, Phone, AlertTriangle, Calendar, Eye } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

interface Patient {
  id: number;
  entryId: string;
  entryType: string;
  fullName: string;
  gender: string;
  age: number;
  phoneNumber: string;
  address: string;
  visitType?: string;
  department?: string;
  emergencyType?: string;
  conditionDescription?: string;
  entryTime: string;
  status: string;
  registeredBy: string;
}

const PatientList: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'NORMAL' | 'EMERGENCY'>('ALL');

  useEffect(() => {
    loadPatients();
  }, [user]);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, selectedFilter]);

  const loadPatients = async () => {
    if (!user?.branchId) return;

    try {
      setLoading(true);
      const patientData = await securityService.getAllPatientEntries(user.branchId);
      setPatients(patientData);
    } catch (error: any) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patient list');
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;

    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(patient => patient.entryType === selectedFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber.includes(searchTerm) ||
        patient.entryId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  };

  const getEntryTypeColor = (entryType: string) => {
    switch (entryType) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
          <p className="text-gray-600">View and manage patient entries</p>
        </div>
        <button 
          onClick={loadPatients} 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Calendar className="h-4 w-4 mr-2 inline" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Normal</p>
              <p className="text-2xl font-bold text-blue-600">
                {patients.filter(p => p.entryType === 'NORMAL').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emergency</p>
              <p className="text-2xl font-bold text-red-600">
                {patients.filter(p => p.entryType === 'EMERGENCY').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {patients.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or entry ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                selectedFilter === 'ALL' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFilter('ALL')}
            >
              All ({patients.length})
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                selectedFilter === 'NORMAL' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFilter('NORMAL')}
            >
              Normal ({patients.filter(p => p.entryType === 'NORMAL').length})
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                selectedFilter === 'EMERGENCY' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFilter('EMERGENCY')}
            >
              Emergency ({patients.filter(p => p.entryType === 'EMERGENCY').length})
            </button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Patient Entries ({filteredPatients.length})</h3>
        </div>
        <div className="p-4">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{patient.fullName}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEntryTypeColor(patient.entryType)}`}>
                          {patient.entryType}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">ID:</span>
                          <span className="font-medium">{patient.entryId}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Age/Gender:</span>
                          <span className="font-medium">{patient.age}, {patient.gender}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{patient.phoneNumber}</span>
                        </div>
                        
                        {patient.department && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Department:</span>
                            <span className="font-medium">{patient.department}</span>
                          </div>
                        )}
                        
                        {patient.emergencyType && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-gray-600">Emergency:</span>
                            <span className="font-medium text-red-600">{patient.emergencyType}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Entry Time:</span>
                          <span className="font-medium">{formatDateTime(patient.entryTime)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Registered by:</span>
                          <span className="font-medium">{patient.registeredBy}</span>
                        </div>
                      </div>
                      
                      {patient.address && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Address:</span>
                          <span className="ml-2">{patient.address}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Eye className="h-4 w-4 mr-2 inline" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
