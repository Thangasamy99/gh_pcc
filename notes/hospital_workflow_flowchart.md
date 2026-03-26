# General Medicine Hospital Workflow - Corrected Flow Chart

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React/TypeScript UI]
        AUTH[Authentication Module]
        DASH[Dashboard Components]
    end
    
    subgraph "Backend API Layer"
        API[Spring Boot REST API]
        JWT[JWT Authentication]
        SEC[Security Layer]
    end
    
    subgraph "Business Logic Layer"
        AUTH_SVC[Auth Service]
        PATIENT_SVC[Patient Service]
        CONSULT_SVC[Consultation Service]
        LAB_SVC[Laboratory Service]
        PHARM_SVC[Pharmacy Service]
        BILL_SVC[Billing Service]
        WARD_SVC[Ward Service]
        INV_SVC[Inventory Service]
    end
    
    subgraph "Data Layer"
        DB[(MySQL Database)]
        CACHE[Redis Cache]
    end
    
    UI --> API
    AUTH --> JWT
    API --> SEC
    API --> AUTH_SVC
    API --> PATIENT_SVC
    API --> CONSULT_SVC
    API --> LAB_SVC
    API --> PHARM_SVC
    API --> BILL_SVC
    API --> WARD_SVC
    API --> INV_SVC
    AUTH_SVC --> DB
    PATIENT_SVC --> DB
    CONSULT_SVC --> DB
    LAB_SVC --> DB
    PHARM_SVC --> DB
    BILL_SVC --> DB
    WARD_SVC --> DB
    INV_SVC --> DB
    SEC --> CACHE
```

## Patient Journey Workflow

```mermaid
flowchart TD
    START([Patient Arrival]) --> REGISTRATION
    REGISTRATION[Patient Registration] --> VERIFY_ID
    VERIFY_ID{Verify Identity} -->|New Patient| CREATE_RECORD
    VERIFY_ID{Verify Identity} -->|Existing Patient| RETRIEVE_RECORD
    
    CREATE_RECORD[Create Medical Record] --> ASSIGN_ID
    ASSIGN_ID[Assign Patient ID] --> TRIAGE
    
    RETRIEVE_RECORD[Retrieve Existing Record] --> UPDATE_INFO
    UPDATE_INFO[Update Information] --> TRIAGE
    
    TRIAGE[Triage Assessment] --> URGENCY{Urgency Level}
    URGENCY -->|Emergency| EMERGENCY_CARE
    URGENCY -->|Urgent| URGENT_CONSULT
    URGENCY -->|Routine| ROUTINE_CONSULT
    
    EMERGENCY_CARE[Emergency Care] --> STABILIZE
    STABILIZE[Stabilize Patient] --> ADMISSION
    
    URGENT_CONSULT[Urgent Consultation] --> DOCTOR_ASSIGN
    ROUTINE_CONSULT[Routine Consultation] --> DOCTOR_ASSIGN
    
    DOCTOR_ASSIGN[Assign Doctor] --> CONSULTATION
    CONSULTATION[Medical Consultation] --> DIAGNOSIS
    
    DIAGNOSIS[Diagnosis] --> TREATMENT_PLAN
    TREATMENT_PLAN[Treatment Plan] --> LAB_TESTS{Lab Tests Required?}
    
    LAB_TESTS -->|Yes| LAB_ORDER
    LAB_TESTS -->|No| PRESCRIPTION{Prescription Required?}
    
    LAB_ORDER[Laboratory Tests] --> SAMPLE_COLLECTION
    SAMPLE_COLLECTION[Sample Collection] --> LAB_ANALYSIS
    LAB_ANALYSIS[Laboratory Analysis] --> RESULTS
    RESULTS[Lab Results] --> DOCTOR_REVIEW
    DOCTOR_REVIEW[Doctor Review] --> PRESCRIPTION
    
    PRESCRIPTION{Prescription Required?} -->|Yes| PHARMACY
    PRESCRIPTION -->|No| FOLLOW_UP{Follow-up Required?}
    
    PHARMACY[Pharmacy Dispensing] --> MEDICATION
    MEDICATION[Medication Administration] --> FOLLOW_UP
    
    FOLLOW_UP{Follow-up Required?} -->|Yes| SCHEDULE_FOLLOWUP
    FOLLOW_UP -->|No| BILLING
    
    SCHEDULE_FOLLOWUP[Schedule Follow-up] --> BILLING
    
    BILLING[Billing Process] --> PAYMENT
    PAYMENT[Payment Collection] --> DISCHARGE
    
    ADMISSION[Admission Process] --> WARD_ASSIGN
    WARD_ASSIGN[Ward Assignment] --> INPATIENT_CARE
    INPATIENT_CARE[Inpatient Care] --> TREATMENT
    TREATMENT[Ongoing Treatment] --> DISCHARGE_PLANNING
    DISCHARGE_PLANNING[Discharge Planning] --> BILLING
    
    DISCHARGE[Patient Discharge] --> END([End of Journey])
```

## Multi-Branch Workflow

```mermaid
flowchart LR
    subgraph "Central Pharmacy"
        CP[Central Pharmacy Admin]
        MI[Master Inventory]
        BP[Bulk Procurement]
        BD[Branch Distribution]
    end
    
    subgraph "Branch 1 - Buea"
        B1_ADMIN[Branch Admin]
        B1_RECEPTION[Reception]
        B1_DOCTOR[Doctor]
        B1_LAB[Laboratory]
        B1_PHARM[Branch Pharmacy]
        B1_BILL[Billing]
    end
    
    subgraph "Branch 2 - Douala"
        B2_ADMIN[Branch Admin]
        B2_RECEPTION[Reception]
        B2_DOCTOR[Doctor]
        B2_LAB[Laboratory]
        B2_PHARM[Branch Pharmacy]
        B2_BILL[Billing]
    end
    
    subgraph "Branch 3 - Yaounde"
        B3_ADMIN[Branch Admin]
        B3_RECEPTION[Reception]
        B3_DOCTOR[Doctor]
        B3_LAB[Laboratory]
        B3_PHARM[Branch Pharmacy]
        B3_BILL[Billing]
    end
    
    CP --> BD
    BD --> B1_PHARM
    BD --> B2_PHARM
    BD --> B3_PHARM
    
    B1_PHARM -.->|Stock Request| CP
    B2_PHARM -.->|Stock Request| CP
    B3_PHARM -.->|Stock Request| CP
```

## User Role & Permission Flow

```mermaid
flowchart TD
    LOGIN([User Login]) --> AUTHENTICATE
    AUTHENTICATE[Authentication Check] --> CREDENTIALS{Valid Credentials?}
    
    CREDENTIALS -->|No| FAILED_LOGIN
    CREDENTIALS -->|Yes| ROLE_CHECK
    
    FAILED_LOGIN[Login Failed] --> LOGIN
    
    ROLE_CHECK[Role Verification] --> SUPER_ADMIN{Super Admin?}
    ROLE_CHECK --> CENTRAL_PHARM{Central Pharmacy?}
    ROLE_CHECK --> BRANCH_ADMIN{Branch Admin?}
    ROLE_CHECK --> DOCTOR_ROLE{Doctor?}
    ROLE_CHECK --> NURSE_ROLE{Nurse?}
    ROLE_CHECK --> RECEPTION_ROLE{Reception?}
    ROLE_CHECK --> CASHIER_ROLE{Cashier?}
    
    SUPER_ADMIN -->|Yes| SA_DASHBOARD[Super Admin Dashboard]
    CENTRAL_PHARM -->|Yes| CP_DASHBOARD[Central Pharmacy Dashboard]
    BRANCH_ADMIN -->|Yes| BA_DASHBOARD[Branch Admin Dashboard]
    DOCTOR_ROLE -->|Yes| DOC_DASHBOARD[Doctor Dashboard]
    NURSE_ROLE -->|Yes| NURSE_DASHBOARD[Nurse Dashboard]
    RECEPTION_ROLE -->|Yes| REC_DASHBOARD[Reception Dashboard]
    CASHIER_ROLE -->|Yes| CASH_DASHBOARD[Cashier Dashboard]
    
    SA_DASHBOARD --> BRANCH_MGMT[Branch Management]
    SA_DASHBOARD --> GLOBAL_USERS[Global User Management]
    SA_DASHBOARD --> SYSTEM_MONITOR[System Monitoring]
    SA_DASHBOARD --> GLOBAL_REPORTS[Global Reports]
    
    CP_DASHBOARD --> MASTER_INV[Master Inventory]
    CP_DASHBOARD --> BULK_PROC[Bulk Procurement]
    CP_DASHBOARD --> BRANCH_DIST[Branch Distribution]
    
    BA_DASHBOARD --> BRANCH_SETTINGS[Branch Settings]
    BA_DASHBOARD --> STAFF_MGMT[Staff Management]
    BA_DASHBOARD --> BRANCH_REPORTS[Branch Reports]
    
    DOC_DASHBOARD --> PATIENT_LIST[Patient List]
    DOC_DASHBOARD --> CONSULTATIONS[Consultations]
    DOC_DASHBOARD --> PRESCRIPTIONS[Prescriptions]
    
    NURSE_DASHBOARD --> WARD_MGMT[Ward Management]
    NURSE_DASHBOARD --> PATIENT_CARE[Patient Care]
    
    REC_DASHBOARD --> PATIENT_REG[Patient Registration]
    REC_DASHBOARD --> APPOINTMENTS[Appointments]
    
    CASH_DASHBOARD --> BILLING_MGMT[Billing Management]
    CASH_DASHBOARD --> PAYMENTS[Payments]
```

## Data Flow Architecture

```mermaid
flowchart TB
    subgraph "Presentation Layer"
        WEB[Web Application]
        MOBILE[Mobile App]
    end
    
    subgraph "API Gateway"
        GATEWAY[API Gateway]
        RATE_LIMIT[Rate Limiting]
        AUTH_GATEWAY[Authentication Gateway]
    end
    
    subgraph "Microservices"
        AUTH_MS[Authentication Service]
        PATIENT_MS[Patient Service]
        CONSULT_MS[Consultation Service]
        LAB_MS[Laboratory Service]
        PHARM_MS[Pharmacy Service]
        BILL_MS[Billing Service]
        WARD_MS[Ward Service]
        INVENTORY_MS[Inventory Service]
        REPORT_MS[Reporting Service]
    end
    
    subgraph "Data Storage"
        USER_DB[(User Database)]
        MEDICAL_DB[(Medical Records DB)]
        INVENTORY_DB[(Inventory DB)]
        BILLING_DB[(Billing DB)]
        REPORT_DB[(Reports DB)]
    end
    
    subgraph "External Services"
        EMAIL[Email Service]
        SMS[SMS Service]
        PAYMENT_GATEWAY[Payment Gateway]
        LAB_EQUIPMENT[Laboratory Equipment]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    GATEWAY --> RATE_LIMIT
    GATEWAY --> AUTH_GATEWAY
    AUTH_GATEWAY --> AUTH_MS
    GATEWAY --> PATIENT_MS
    GATEWAY --> CONSULT_MS
    GATEWAY --> LAB_MS
    GATEWAY --> PHARM_MS
    GATEWAY --> BILL_MS
    GATEWAY --> WARD_MS
    GATEWAY --> INVENTORY_MS
    GATEWAY --> REPORT_MS
    
    AUTH_MS --> USER_DB
    PATIENT_MS --> MEDICAL_DB
    CONSULT_MS --> MEDICAL_DB
    LAB_MS --> MEDICAL_DB
    PHARM_MS --> INVENTORY_DB
    BILL_MS --> BILLING_DB
    WARD_MS --> MEDICAL_DB
    INVENTORY_MS --> INVENTORY_DB
    REPORT_MS --> REPORT_DB
    
    AUTH_MS --> EMAIL
    BILL_MS --> PAYMENT_GATEWAY
    LAB_MS --> LAB_EQUIPMENT
    PATIENT_MS --> SMS
```

## Emergency Response Workflow

```mermaid
flowchart TD
    EMERGENCY_CALL([Emergency Call/Arrival]) --> RAPID_ASSESS
    RAPID_ASSESS[Rapid Assessment] --> CRITICAL{Critical Condition?}
    
    CRITICAL -->|Yes| IMMEDIATE_CARE
    CRITICAL -->|No| STABLE_ASSESS
    
    IMMEDIATE_CARE[Immediate Life Support] --> VITAL_SIGNS
    VITAL_SIGNS[Monitor Vital Signs] --> EMERGENCY_TESTS
    
    STABLE_ASSESS[Stable Assessment] --> PRIORITY_LEVEL
    PRIORITY_LEVEL[Assign Priority Level] --> EMERGENCY_TESTS
    
    EMERGENCY_TESTS[Emergency Lab Tests] --> RADILOGY{Radiology Needed?}
    RADILOGY -->|Yes| IMAGING
    RADILOGY -->|No| TREATMENT_DECISION
    
    IMAGING[Emergency Imaging] --> TREATMENT_DECISION
    
    TREATMENT_DECISION[Treatment Decision] --> ADMISSION_TYPE{Admission Type}
    
    ADMISSION_TYPE -->|ICU| ICU_ADMISSION
    ADMISSION_TYPE -->|Ward| WARD_ADMISSION
    ADMISSION_TYPE -->|Discharge| EMERGENCY_DISCHARGE
    
    ICU_ADMISSION[ICU Admission] --> CRITICAL_CARE
    CRITICAL_CARE[Critical Care Management] --> MONITORING
    
    WARD_ADMISSION[Ward Admission] --> WARD_CARE
    WARD_CARE[Ward Care] --> MONITORING
    
    MONITORING[Continuous Monitoring] --> IMPROVEMENT{Patient Improvement?}
    IMPROVEMENT -->|Yes| STEP_DOWN
    IMPROVEMENT -->|No| ESCALATE_CARE
    
    STEP_DOWN[Step Down Care] --> DISCHARGE_PLAN
    ESCALATE_CARE[Escalate Care] --> CRITICAL_CARE
    
    DISCHARGE_PLAN[Discharge Planning] --> FOLLOW_UP_CARE
    EMERGENCY_DISCHARGE[Emergency Discharge] --> FOLLOW_UP_CARE
    
    FOLLOW_UP_CARE[Follow-up Care Instructions] --> END([End Emergency Care])
```

## Key Corrections Made:

1. **Clear Patient Journey Flow**: Added comprehensive patient flow from arrival to discharge
2. **Multi-Branch Integration**: Properly connected central pharmacy with branch operations
3. **Role-Based Access**: Detailed user role and permission workflow
4. **Data Architecture**: Clear separation of concerns across different databases
5. **Emergency Response**: Dedicated emergency care workflow
6. **System Integration**: Proper API gateway and microservices architecture

## System Modules Identified:

- **Authentication & Authorization**: JWT-based security
- **Patient Management**: Registration, records, history
- **Clinical Operations**: Consultations, diagnoses, treatments
- **Laboratory Services**: Tests, results, analysis
- **Pharmacy Management**: Central and branch pharmacy operations
- **Billing & Payments**: Invoicing, insurance, cash collection
- **Ward Management**: Inpatient care, bed management
- **Inventory Management**: Stock control, procurement
- **Reporting & Analytics**: Clinical and financial reports
- **Multi-Branch Support**: Centralized coordination with branch autonomy

This corrected flow chart provides a comprehensive view of the General Medicine Hospital Workflow system with proper integration between all modules and clear patient care pathways.
