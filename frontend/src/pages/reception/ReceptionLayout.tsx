import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ReceptionSidebar from '../../components/reception/ReceptionSidebar';
import ReceptionHeader from '../../components/reception/ReceptionHeader';
import ReceptionDashboard from './ReceptionDashboard';
import ReceivePatient from './ReceivePatient';
import RecordVitals from './RecordVitals';
import QueueManagement from './QueueManagement';
import SendToCashier from './SendToCashier';
import AssignRoom from './AssignRoom';
import DailyPatients from './DailyPatients';

const ReceptionLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ReceptionSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Top Header */}
        <ReceptionHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/dashboard" element={<ReceptionDashboard />} />
            <Route path="/receive-patient" element={<ReceivePatient />} />
            <Route path="/patient-list" element={<DailyPatients />} />
            <Route path="/record-vitals" element={<RecordVitals />} />
            <Route path="/queue-management" element={<QueueManagement />} />
            <Route path="/send-to-cashier" element={<SendToCashier />} />
            <Route path="/assign-room" element={<AssignRoom />} />
            <Route path="/daily-patients" element={<DailyPatients />} />
            <Route path="/" element={<ReceptionDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ReceptionLayout;
