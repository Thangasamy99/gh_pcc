export interface ReceptionDashboard {
  totalPatientsToday: number;
  waitingQueue: number;
  vitalsCompleted: number;
  sentToCashier: number;
  paymentCompleted: number;
  sentToDoctor: number;
  emergencyCases: number;
  normalCases: number;
  urgentCases: number;
  malePatients: number;
  femalePatients: number;
  otherGenderPatients: number;
  consultationPatients: number;
  followUpPatients: number;
  emergencyPatients: number;
  lastUpdated: string;
}

export interface PatientEntry {
  id: number;
  entryId: string;
  personType: string;
  patientName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  address: string;
  city: string;
  visitType: string;
  department: string;
  purposeOfVisit: string;
  remarks?: string;
  isEmergency: boolean;
  knownIllness: string;
  allergy: string;
  hasInsurance: boolean;
  entryDate: string;
  entryTime: string;
  registeredBy: string;
  status: string;
  branchId: number;
  branchName: string;
  createdBy: string;
  createdAt: string;
}

export interface PatientVitals {
  id: number;
  patientEntryId: number;
  entryId: string;
  patientName: string;
  weightKg?: number;
  heightCm?: number;
  temperatureCelsius?: number;
  pulseRateBpm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respirationRate?: number;
  oxygenSaturation?: number;
  triageStatus: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  notes?: string;
  recordedBy: string;
  branchId: number;
  createdAt: string;
}

export interface ReceptionQueue {
  id: number;
  patientEntryId: number;
  entryId: string;
  patientName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  visitType: string;
  department: string;
  queueStatus: 'WAITING' | 'VITALS_COMPLETED' | 'SENT_TO_CASHIER' | 'PAYMENT_COMPLETED' | 'ASSIGNED_ROOM' | 'SENT_TO_DOCTOR' | 'COMPLETED';
  queueNumber?: number;
  vitalsCompleted: boolean;
  sentToCashier: boolean;
  paymentCompleted: boolean;
  consultationRoom?: string;
  assignedDoctorId?: number;
  assignedDoctorName?: string;
  sentToDoctor: boolean;
  queueTime?: string;
  vitalsTime?: string;
  cashierTime?: string;
  doctorTime?: string;
  notes?: string;
  managedBy: string;
  branchId: number;
  entryDate: string;
  entryTime: string;
  createdAt: string;
}

export interface VitalsForm {
  patientEntryId: number;
  weightKg?: number;
  heightCm?: number;
  temperatureCelsius?: number;
  pulseRateBpm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  respirationRate?: number;
  oxygenSaturation?: number;
  triageStatus: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  notes?: string;
}
