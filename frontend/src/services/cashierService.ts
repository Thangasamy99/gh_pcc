import api from './api';
import { 
  CashierDashboard, 
  PendingPayment, 
  ConsultationPaymentRequest,
  LabPaymentRequest,
  ImagingPaymentRequest,
  PharmacyPaymentRequest,
  AdmissionPaymentRequest,
  InsurancePaymentRequest,
  CreditPaymentRequest,
  PaymentReceipt, 
  CollectionReport 
} from '../types/cashier';
const BASE = '/v1/cashier';
export const cashierService = {
  getDashboard: async (branchId: number): Promise<CashierDashboard> => {
    const response = await api.get(`${BASE}/dashboard/${branchId}`);
    return response.data.data;
  },

  getPendingConsultations: async (branchId: number): Promise<PendingPayment[]> => {
    const response = await api.get(`${BASE}/consultation/pending/${branchId}`);
    return response.data.data;
  },

  // Temporarily keeping fasttrack if frontend still uses it separately
  getFastTrackPayments: async (branchId: number): Promise<PendingPayment[]> => {
    const response = await api.get(`${BASE}/fasttrack/${branchId}`);
    return response.data.data;
  },

  processConsultationPayment: async (request: ConsultationPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/consultation/pay`, request);
    return response.data.data;
  },

  processLabPayment: async (request: LabPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/service/lab/pay`, request);
    return response.data.data;
  },

  processImagingPayment: async (request: ImagingPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/service/imaging/pay`, request);
    return response.data.data;
  },

  processPharmacyPayment: async (request: PharmacyPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/service/pharmacy/pay`, request);
    return response.data.data;
  },

  processAdmissionPayment: async (request: AdmissionPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/service/admission/pay`, request);
    return response.data.data;
  },

  processInsurancePayment: async (request: InsurancePaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/insurance/pay`, request);
    return response.data.data;
  },

  processCreditPayment: async (request: CreditPaymentRequest): Promise<PaymentReceipt> => {
    const response = await api.post(`${BASE}/credit/pay`, request);
    return response.data.data;
  },

  getHistory: async (branchId: number): Promise<PaymentReceipt[]> => {
    const response = await api.get(`${BASE}/history/${branchId}`);
    return response.data.data;
  },

  getDailyReport: async (branchId: number): Promise<CollectionReport> => {
    const response = await api.get(`${BASE}/reports/daily/${branchId}`);
    return response.data.data;
  }
};
