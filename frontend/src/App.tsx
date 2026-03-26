import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './pages/Home';
import LoginPage from './pages/Auth/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminBranches from './pages/SuperAdminBranches';
import Layout from './components/layout/Layout';
import UsersManagement from './components/users/UsersManagement';
import RolesManagement from './components/roles/RolesManagement';
import PermissionsPage from './pages/PermissionsPage';
import RolePermissionsPage from './pages/RolePermissionsPage';
import SecurityDashboard from './pages/security/SecurityDashboard';
import SecurityLayout from './components/security/SecurityLayout';
import RegisterPatient from './components/security/RegisterPatient';
import PatientEntryForm from './components/security/forms/PatientEntryForm';
import PatientList from './components/security/PatientList';
import VisitorRegistrationForm from './components/security/forms/VisitorRegistrationForm';
import EmergencyEntryForm from './components/security/forms/EmergencyEntryForm';
import WardDirectorySearch from './components/security/ward/WardDirectorySearch';
import VisitorLog from './components/security/VisitorLog';
import ActiveVisitors from './components/security/ActiveVisitors';
import VisitorExit from './components/security/VisitorExit';
import DailyVisitorsReport from './components/security/reports/DailyVisitorsReport';
import PatientEntryReport from './components/security/reports/PatientEntryReport';
import ReceptionLayout from './pages/reception/ReceptionLayout';
import CashierLayout from './pages/cashier/CashierLayout';
import CashierDashboardPage from './pages/cashier/CashierDashboard';
import PendingConsultation from './pages/cashier/consultation/PendingConsultation';
import ProcessConsultation from './pages/cashier/consultation/ProcessConsultation';
import LabPayment from './pages/cashier/services/LabPayment';
import ImagingPayment from './pages/cashier/services/ImagingPayment';
import PharmacyPayment from './pages/cashier/services/PharmacyPayment';
import AdmissionPayment from './pages/cashier/services/AdmissionPayment';
import InsurancePayment from './pages/cashier/insurance/InsurancePayment';
import CreditDebtPayment from './pages/cashier/insurance/CreditDebtPayment';
import GenerateReceipt from './pages/cashier/receipts/GenerateReceipt';
import PaymentHistory from './pages/cashier/receipts/PaymentHistory';
import DailyCollectionReport from './pages/cashier/DailyCollectionReport';
import PlaceholderPage from './pages/cashier/PlaceholderPage';
import DoctorManagement from './pages/SuperAdmin/DoctorManagement';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import BranchAdminLayout from './pages/branchadmin/BranchAdminLayout';
import BranchAdminDashboard from './pages/branchadmin/BranchAdminDashboard';
import PatientTracking from './pages/branchadmin/PatientTracking';
import LiveQueueStatus from './pages/branchadmin/LiveQueueStatus';
import StaffList from './pages/branchadmin/StaffList';
import BranchDoctorManagement from './pages/branchadmin/DoctorManagement';
import ReceptionOverview from './pages/branchadmin/ReceptionOverview';
import CashierOverview from './pages/branchadmin/CashierOverview';
import DoctorOverview from './pages/branchadmin/DoctorOverview';
import LabManagement from './pages/branchadmin/LabManagement';
import ImagingManagement from './pages/branchadmin/ImagingManagement';
import PharmacyManagement from './pages/branchadmin/PharmacyManagement';
import WardAdmission from './pages/branchadmin/WardAdmission';
import DailySummary from './pages/branchadmin/DailySummary';
import FinancialReport from './pages/branchadmin/FinancialReport';
import MedicalStatistics from './pages/branchadmin/MedicalStatistics';
import BranchSettings from './pages/branchadmin/BranchSettings';
import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// A component to handle smart dashboard redirection
const DashboardRedirect = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext || !authContext.user) {
    return <Navigate to="/login" replace />;
  }
  
  const { user } = authContext;
  
  if (user.roleCode === 'SUPER_ADMIN') {
    return <Navigate to="/superadmin/dashboard" replace />;
  } else if (user.roleCode === 'SECURITY' || user.roleCode === 'SECURITY_GUARD') {
    return <Navigate to="/security/dashboard" replace />;
  } else if (user.roleCode === 'RECEPTION' || user.roleCode === 'RECEPTIONIST') {
    return <Navigate to="/reception/dashboard" replace />;
  } else if (user.roleCode === 'CASHIER') {
    return <Navigate to="/cashier/dashboard" replace />;
  } else if (user.roleCode === 'DOCTOR') {
    return <Navigate to="/doctor/dashboard" replace />;
  } else if (user.roleCode === 'BRANCH_ADMIN' || user.roleCode === 'ROLE_BRANCH_ADMIN') {
    return <Navigate to="/branchadmin/dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/superadmin/dashboard"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <SuperAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/branches/*"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <SuperAdminBranches />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/users"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <UsersManagement />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/users/create"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <UsersManagement initialCreateMode={true} />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/roles"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <RolesManagement />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/roles/create"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <RolesManagement initialCreateMode={true} />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/permissions"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <PermissionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/role-permissions"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <RolePermissionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/doctors/create"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <DoctorManagement initialCreateMode={true} />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/superadmin/doctors/list"
            element={
              <PrivateRoute requiredRole="SUPER_ADMIN">
                <Layout>
                  <DoctorManagement initialCreateMode={false} />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/superadmin/reports"
            element={<PrivateRoute requiredRole="SUPER_ADMIN"><Layout><div className="p-8">Reports Page (Coming Soon)</div></Layout></PrivateRoute>}
          />
          <Route
            path="/superadmin/audit-logs"
            element={<PrivateRoute requiredRole="SUPER_ADMIN"><Layout><div className="p-8">Audit Logs Page (Coming Soon)</div></Layout></PrivateRoute>}
          />
          <Route
            path="/superadmin/settings"
            element={<PrivateRoute requiredRole="SUPER_ADMIN"><Layout><div className="p-8">Settings Page (Coming Soon)</div></Layout></PrivateRoute>}
          />
          {/* Security Routes */}
          <Route 
            path="/security" 
            element={
              <PrivateRoute requiredRole="SECURITY">
                <SecurityLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/security/dashboard" replace />} />
            <Route path="dashboard" element={<SecurityDashboard />} />
            <Route path="entry/patient" element={<PatientEntryForm />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="entry/visitor" element={<VisitorRegistrationForm />} />
            <Route path="entry/emergency" element={<EmergencyEntryForm />} />
            <Route path="visitors/log" element={<VisitorLog />} />
            <Route path="visitors/active" element={<ActiveVisitors />} />
            <Route path="visitors/exit" element={<VisitorExit />} />
            <Route path="wards" element={<WardDirectorySearch />} />
            <Route path="reports/daily-visitors" element={<DailyVisitorsReport />} />
            <Route path="reports/patient-entries" element={<PatientEntryReport />} />
          </Route>

          {/* Reception Routes */}
          <Route 
            path="/reception/*" 
            element={
              <PrivateRoute requiredRole="RECEPTION">
                <ReceptionLayout />
              </PrivateRoute>
            }
          />

          {/* Cashier Routes */}
          <Route 
            path="/cashier" 
            element={
              <PrivateRoute requiredRole="CASHIER">
                <CashierLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/cashier/dashboard" replace />} />
            <Route path="dashboard" element={<CashierDashboardPage />} />
            <Route path="consultation/pending" element={<PendingConsultation />} />
            <Route path="consultation/process" element={<ProcessConsultation />} />
            <Route path="billing/lab" element={<LabPayment />} />
            <Route path="billing/imaging" element={<ImagingPayment />} />
            <Route path="billing/pharmacy" element={<PharmacyPayment />} />
            <Route path="billing/admission" element={<AdmissionPayment />} />
            <Route path="insurance" element={<InsurancePayment />} />
            <Route path="credit" element={<CreditDebtPayment />} />
            <Route path="receipts/generate" element={<GenerateReceipt />} />
            <Route path="receipts/history" element={<PaymentHistory />} />
            <Route path="reports/daily" element={<DailyCollectionReport />} />
          </Route>

          {/* Doctor Routes */}
          <Route 
            path="/doctor" 
            element={
              <PrivateRoute requiredRole="DOCTOR">
                <Layout>
                  <Outlet />
                </Layout>
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/doctor/dashboard" replace />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<DoctorDashboard />} />
            <Route path="consultations" element={<DoctorDashboard />} />
            <Route path="profile" element={<DoctorDashboard />} />
          </Route>

          {/* Branch Admin Routes */}
          <Route 
            path="/branchadmin" 
            element={
              <PrivateRoute requiredRole="BRANCH_ADMIN">
                <BranchAdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/branchadmin/dashboard" replace />} />
            <Route path="dashboard" element={<BranchAdminDashboard />} />
            <Route path="patient-tracking" element={<PatientTracking />} />
            <Route path="live-queue" element={<LiveQueueStatus />} />
            <Route path="staff-list" element={<StaffList />} />
            <Route path="doctors" element={<BranchDoctorManagement />} />
            <Route path="reception-overview" element={<ReceptionOverview />} />
            <Route path="cashier-overview" element={<CashierOverview />} />
            <Route path="doctor-overview" element={<DoctorOverview />} />
            <Route path="lab" element={<LabManagement />} />
            <Route path="imaging" element={<ImagingManagement />} />
            <Route path="pharmacy" element={<PharmacyManagement />} />
            <Route path="ward" element={<WardAdmission />} />
            <Route path="daily-summary" element={<DailySummary />} />
            <Route path="financial-report" element={<FinancialReport />} />
            <Route path="medical-stats" element={<MedicalStatistics />} />
            <Route path="settings" element={<BranchSettings />} />
          </Route>

          {/* Redirect to dashboard as default for superadmin */}
          <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
