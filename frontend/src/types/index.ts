
// ============================================================
// TYPES: index.ts - Type Definitions for Database Models
// ============================================================

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    staffId: string;
    phone: string;
    roleId: number;
    roleName: string;
    roleCode: string;
    branchId: number;
    branchName: string;
    isActive: boolean;
    isLocked: boolean;
    isDeleted: boolean;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    staffId: string;
    phone: string;
    roleId?: number;
    roleName?: string;
    roleCode?: string;
    primaryBranchId?: number;
    branchName?: string;
    role?: {
        id: number;
        roleName: string;
        roleCode: string;
    };
    primaryBranch?: {
        id: number;
        branchName: string;
        branchCode: string;
    };
    isActive: boolean;
    isLocked: boolean;
    lastLoginAt: string;
    createdAt: string;
}

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
    userCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
    id: number;
    roleName: string;
    roleCode: string;
    roleAbbreviation: string;
    description: string;
    roleLevel: number;
    isSystemRole: boolean;
    userCount: number;
    permissionCount: number;
}

export interface Patient {
    id: number;
    patientId: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    bloodGroup: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceExpiryDate: string;
    branchId: number;
    registeredBy: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Permission {
    id: number;
    permissionName: string;
    permissionCode: string;
    module: string;
    description: string;
}

export interface DashboardStats {
    totalBranches: number;
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    deletedUsers: number;
    deletedBranches: number;
    pendingApprovals: number;
    totalDoctors: number;
    totalNurses: number;
    totalPatients: number;
    systemUptime: string;
    storageUsed: string;
    activeSessions: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    totalRevenue: number;
    averageResponseTime: string;
    errorRate: string;
    lastBackup: string;
    upcomingMaintenance: string;
}

export interface SystemHealth {
    databaseStatus: 'Healthy' | 'Degraded' | 'Down';
    databaseLatency: string;
    cacheStatus: 'Healthy' | 'Degraded' | 'Down';
    cacheHitRate: string;
    queueStatus: 'Healthy' | 'Degraded' | 'Down';
    queueSize: number;
    totalDiskSpace: string;
    usedDiskSpace: string;
    freeDiskSpace: string;
    diskUsagePercentage: number;
    totalMemory: string;
    usedMemory: string;
    freeMemory: string;
    memoryUsagePercentage: number;
    cpuUsage: number;
    cpuCores: number;
    systemLoad: number;
    systemUptime: string;
    lastRestart: string;
    lastBackup: string;
    lastBackupStatus: string;
}

export interface UserActivity {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    growth: number;
    peakHour: number;
    averageSessionDuration: string;
    newUsersToday: number;
    returningUsers: number;
}

export interface RevenueData {
    totalRevenue: number;
    monthlyRevenue: number;
    monthlyGrowth: number;
    previousMonthRevenue: number;
    revenueByBranch: {
        branchId: number;
        branchName: string;
        revenue: number;
    }[];
    revenueByType: {
        type: string;
        amount: number;
        percentage: number;
    }[];
}

export interface AuditLog {
    id: number;
    userId: number;
    userName: string;
    action: string;
    module: string;
    resourceType: string;
    resourceId: string;
    oldValue: string;
    newValue: string;
    ipAddress: string;
    userAgent: string;
    status: string;
    errorMessage: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
