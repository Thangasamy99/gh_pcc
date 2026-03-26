export interface CashierDashboard {
  totalRevenue: number;
  totalInsurancePayments: number;
  totalPaymentsToday: number;
  pendingPayments: number;
  fastTrackPatients: number;
}

export interface PendingPayment {
  patientEntryId: number;
  patientName: string;
  patientId: string;
  patientType: 'NORMAL' | 'FASTTRACK';
  service: string;
  amount: number;
  status: 'PENDING';
  queueTime: string;
}

export interface ConsultationPaymentRequest {
  patientEntryId: number;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  paymentType: 'FULL_PAYMENT' | 'ADVANCE_PAYMENT';
  discount?: number;
  notes?: string;
  branchId: number;
}

export interface LabPaymentRequest {
  patientEntryId: number;
  testType: string;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  branchId: number;
}

export interface ImagingPaymentRequest {
  patientEntryId: number;
  scanType: string;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  branchId: number;
}

export interface PharmacyPaymentRequest {
  patientEntryId: number;
  medicineCost: number;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  branchId: number;
}

export interface AdmissionPaymentRequest {
  patientEntryId: number;
  wardType: string;
  advanceAmount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  branchId: number;
}

export interface InsurancePaymentRequest {
  patientEntryId: number;
  insuranceCompany: string;
  policyNumber: string;
  approvedAmount: number;
  paidAmount: number;
  branchId: number;
}

export interface CreditPaymentRequest {
  patientEntryId: number;
  totalBill: number;
  paidAmount: number;
  remainingBalance: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD';
  branchId: number;
}

export interface PaymentReceipt {
  receiptId: string;
  patientName: string;
  service: string;
  amountPaid: number;
  paymentMethod: string;
  date: string;
  status: string;
}

export interface CollectionReport {
  totalRevenue: number;
  insuranceTotal: number;
  creditTotal: number;
  discountTotal: number;
  totalPatientsPaid: number;
  cashTotal: number;
  mobileMoneyTotal: number;
  cardTotal: number;
}
