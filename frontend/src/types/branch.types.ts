export interface Branch {
    id: number;
    branchCode: string;
    branchName: string;
    branchType: 'HOSPITAL' | 'CENTRAL_PHARMACY';
    address: string;
    city: string;
    region: string;
    phone: string;
    email: string;
    registrationNumber: string;
    taxId: string;
    establishedDate: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: string;
    userCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface BranchStats {
    branchId: number;
    branchName: string;
    branchCode: string;
    totalStaff: number;
    doctors: number;
    nurses: number;
    labTechnicians: number;
    pharmacists: number;
    receptionists: number;
    cashiers: number;
    administrators: number;
    totalPatients: number;
    activePatients: number;
    totalAdmissions: number;
    availableBeds: number;
    occupiedBeds: number;
    bedOccupancyRate: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    patientSatisfaction: number;
}

export interface CreateBranchRequest {
    branchCode: string;
    branchName: string;
    branchType: 'HOSPITAL' | 'CENTRAL_PHARMACY';
    address: string;
    city: string;
    region: string;
    phone: string;
    email: string;
    registrationNumber: string;
    taxId?: string;
    establishedDate: string;
}

export interface UpdateBranchRequest {
    branchName?: string;
    address?: string;
    city?: string;
    region?: string;
    phone?: string;
    email?: string;
    taxId?: string;
    isActive?: boolean;
}

export interface BranchFilters {
    search?: string;
    region?: string;
    city?: string;
    branchType?: 'HOSPITAL' | 'CENTRAL_PHARMACY';
    isActive?: boolean;
    includeDeleted?: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
