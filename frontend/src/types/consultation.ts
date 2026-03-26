export interface Consultation {
  id: number;
  consultationId: string;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  branchId: number;
  branchName: string;
  consultationDate: string;
  symptoms: string;
  clinicalNotes: string;
  diagnosis?: string;
  prescription?: string;
  labRequestStatus?: string;
  imagingRequestStatus?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface CreateConsultationRequest {
  patientId: number;
  doctorId: number;
  branchId: number;
  symptoms: string;
  clinicalNotes?: string;
  diagnosis?: string;
  prescription?: string;
  labRequestStatus?: string;
  imagingRequestStatus?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}
