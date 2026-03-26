import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { securityService, DynamicEntryRequest, Metadata, Ward, Room, Bed, PatientLocation } from '@/services/securityService';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Search, MapPin, Clock, User } from 'lucide-react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface DynamicEntryFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialEntryType?: 'NORMAL' | 'EMERGENCY' | 'VISITOR';
}

const DynamicEntryForm: React.FC<DynamicEntryFormProps> = ({ 
  onCancel, 
  onSuccess, 
  initialEntryType 
}) => {
  const { user, currentBranch } = useAuth();
  const [entryType, setEntryType] = useState<'NORMAL' | 'EMERGENCY' | 'VISITOR'>(initialEntryType || 'NORMAL');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    entryTypes: [] as Metadata[],
    visitTypes: [] as Metadata[],
    departments: [] as Metadata[],
    emergencyTypes: [] as Metadata[],
    relationships: [] as Metadata[]
  });
  const [wards, setWards] = useState<Ward[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PatientLocation[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientLocation | null>(null);

  useEffect(() => {
    fetchMetadata();
    if (currentBranch?.id) {
      fetchWards(currentBranch.id);
    }
  }, [currentBranch]);

  const fetchMetadata = async () => {
    try {
      const [entryTypes, visitTypes, departments, emergencyTypes, relationships] = await Promise.all([
        securityService.getEntryTypes(),
        securityService.getVisitTypes(),
        securityService.getDepartments(),
        securityService.getEmergencyTypes(),
        securityService.getRelationships()
      ]);

      setMetadata({
        entryTypes,
        visitTypes,
        departments,
        emergencyTypes,
        relationships
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const fetchWards = async (branchId: number) => {
    try {
      const wardsData = await securityService.getAllWards(branchId);
      setWards(wardsData);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchRooms = async (wardId: number) => {
    try {
      const roomsData = await securityService.getRoomsByWard(wardId);
      setRooms(roomsData);
      setBeds([]); // Reset beds when ward changes
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBeds = async (roomId: number) => {
    try {
      const bedsData = await securityService.getBedsByRoom(roomId);
      setBeds(bedsData);
    } catch (error) {
      console.error('Error fetching beds:', error);
    }
  };

  const searchPatients = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await securityService.searchPatientLocation(searchTerm);
      setSearchResults([results]); // API returns single result, wrap in array
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPatients(patientSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm]);

  const getValidationSchema = () => {
    const baseSchema = {
      fullName: Yup.string().required('Full name is required'),
      phoneNumber: Yup.string().required('Phone number is required'),
      branchId: Yup.number().required('Branch is required')
    };

    if (entryType === 'NORMAL') {
      return Yup.object({
        ...baseSchema,
        gender: Yup.string().required('Gender is required'),
        age: Yup.number().required('Age is required').positive().integer(),
        visitType: Yup.string().required('Visit type is required'),
        department: Yup.string().required('Department is required')
      });
    } else if (entryType === 'EMERGENCY') {
      return Yup.object({
        ...baseSchema,
        gender: Yup.string().required('Gender is required'),
        age: Yup.number().required('Age is required').positive().integer(),
        emergencyType: Yup.string().required('Emergency type is required'),
        conditionDescription: Yup.string().required('Condition description is required'),
        broughtBy: Yup.string().required('Brought by is required')
      });
    } else if (entryType === 'VISITOR') {
      return Yup.object({
        ...baseSchema,
        visitorName: Yup.string().required('Visitor name is required'),
        idProof: Yup.string().required('ID proof is required'),
        relationship: Yup.string().required('Relationship is required'),
        patientName: Yup.string().required('Patient name is required'),
        purposeOfVisit: Yup.string().required('Purpose of visit is required'),
        expectedExitTime: Yup.string().required('Expected exit time is required')
      });
    }

    return Yup.object(baseSchema);
  };

  const handleSubmit = async (values: any) => {
    if (!user?.id || !currentBranch?.id) {
      alert('User or branch information is missing');
      return;
    }

    setLoading(true);
    try {
      const requestData: DynamicEntryRequest = {
        ...values,
        entryType,
        branchId: currentBranch.id
      };

      await securityService.createEntry(requestData, user.id);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating entry:', error);
      alert(error.response?.data?.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  const renderNormalFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Field name="gender" as={Select}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Field>
          <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Field name="age" type="number" as={Input} placeholder="Enter age" />
          <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Field name="address" as={Textarea} placeholder="Enter address" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visitType">Visit Type</Label>
          <Field name="visitType" as={Select}>
            <SelectTrigger>
              <SelectValue placeholder="Select visit type" />
            </SelectTrigger>
            <SelectContent>
              {metadata.visitTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Field>
          <ErrorMessage name="visitType" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Field name="department" as={Select}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {metadata.departments.map(dept => (
                <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
              ))}
            </SelectContent>
          </Field>
          <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />
        </div>
      </div>
    </>
  );

  const renderEmergencyFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Field name="gender" as={Select}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Field>
          <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Field name="age" type="number" as={Input} placeholder="Enter age" />
          <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Field name="address" as={Textarea} placeholder="Enter address" rows={2} />
      </div>

      <div>
        <Label htmlFor="emergencyType">Emergency Type</Label>
        <Field name="emergencyType" as={Select}>
          <SelectTrigger>
            <SelectValue placeholder="Select emergency type" />
          </SelectTrigger>
          <SelectContent>
            {metadata.emergencyTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Field>
        <ErrorMessage name="emergencyType" component="div" className="text-red-500 text-sm" />
      </div>

      <div>
        <Label htmlFor="conditionDescription">Condition Description</Label>
        <Field name="conditionDescription" as={Textarea} placeholder="Describe the condition" rows={3} />
        <ErrorMessage name="conditionDescription" component="div" className="text-red-500 text-sm" />
      </div>

      <div>
        <Label htmlFor="broughtBy">Brought By</Label>
        <Field name="broughtBy" type="text" as={Input} placeholder="Who brought the patient?" />
        <ErrorMessage name="broughtBy" component="div" className="text-red-500 text-sm" />
      </div>
    </>
  );

  const renderVisitorFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visitorName">Visitor Name</Label>
          <Field name="visitorName" type="text" as={Input} placeholder="Enter visitor name" />
          <ErrorMessage name="visitorName" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <Label htmlFor="idProof">ID Proof</Label>
          <Field name="idProof" type="text" as={Input} placeholder="Enter ID proof number" />
          <ErrorMessage name="idProof" component="div" className="text-red-500 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationship">Relationship</Label>
          <Field name="relationship" as={Select}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {metadata.relationships.map(rel => (
                <SelectItem key={rel.value} value={rel.value}>{rel.label}</SelectItem>
              ))}
            </SelectContent>
          </Field>
          <ErrorMessage name="relationship" component="div" className="text-red-500 text-sm" />
        </div>
        <div>
          <Label htmlFor="purposeOfVisit">Purpose of Visit</Label>
          <Field name="purposeOfVisit" type="text" as={Input} placeholder="Purpose of visit" />
          <ErrorMessage name="purposeOfVisit" component="div" className="text-red-500 text-sm" />
        </div>
      </div>

      <div>
        <Label htmlFor="expectedExitTime">Expected Exit Time</Label>
        <Field name="expectedExitTime" type="datetime-local" as={Input} />
        <ErrorMessage name="expectedExitTime" component="div" className="text-red-500 text-sm" />
      </div>

      {/* Patient Search */}
      <div>
        <Label>Search Patient</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patient by name..."
            value={patientSearchTerm}
            onChange={(e) => setPatientSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-2 space-y-2">
            {searchResults.map((patient) => (
              <div
                key={patient.patientId}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedPatient(patient);
                  setPatientSearchTerm(patient.patientName);
                  setSearchResults([]);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{patient.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {patient.gender}, {patient.age} years
                    </p>
                  </div>
                  <div className="text-right">
                    {patient.wardName && (
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {patient.wardName}
                      </p>
                    )}
                    {patient.roomNumber && (
                      <p className="text-sm">Room {patient.roomNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Selected Patient</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedPatient(null);
                setPatientSearchTerm('');
              }}
            >
              Clear
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ward</Label>
              <Select onValueChange={(value) => fetchRooms(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map(ward => (
                    <SelectItem key={ward.id} value={ward.id.toString()}>{ward.wardName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Room</Label>
              <Select onValueChange={(value) => fetchBeds(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id.toString()}>{room.roomNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Hidden fields for selected patient */}
      <Field name="patientName" type="hidden" value={selectedPatient?.patientName || ''} />
      <Field name="patientId" type="hidden" value={selectedPatient?.patientId || ''} />
    </>
  );

  const initialValues = {
    fullName: '',
    gender: '',
    age: '',
    phoneNumber: '',
    address: '',
    visitType: '',
    department: '',
    emergencyType: '',
    conditionDescription: '',
    broughtBy: '',
    visitorName: '',
    idProof: '',
    relationship: '',
    patientName: '',
    patientId: '',
    purposeOfVisit: '',
    expectedExitTime: '',
    branchId: currentBranch?.id || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold">Dynamic Entry Form</h1>
        </div>
        <Badge variant={entryType === 'EMERGENCY' ? 'destructive' : 'secondary'}>
          {entryType}
        </Badge>
      </div>

      {/* Entry Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Entry Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {metadata.entryTypes.map(type => (
              <Button
                key={type.value}
                variant={entryType === type.value ? 'default' : 'outline'}
                onClick={() => setEntryType(type.value as any)}
                className={`h-16 flex-col ${
                  type.value === 'EMERGENCY' ? 'border-red-500' : ''
                }`}
              >
                <User className="h-6 w-6 mb-1" />
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Entry Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Common Fields */}
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Field name="fullName" type="text" as={Input} placeholder="Enter full name" />
                  <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Field name="phoneNumber" type="tel" as={Input} placeholder="Enter phone number" />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Type-specific Fields */}
                {entryType === 'NORMAL' && renderNormalFields()}
                {entryType === 'EMERGENCY' && renderEmergencyFields()}
                {entryType === 'VISITOR' && renderVisitorFields()}

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={entryType === 'EMERGENCY' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {loading ? 'Creating Entry...' : `Create ${entryType} Entry`}
                  </Button>
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DynamicEntryForm;
