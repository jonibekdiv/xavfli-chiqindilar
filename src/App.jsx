import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { hasPermission } from './utils/permissions.js';

import Login from './pages/Login.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';
import WasteRegistry from './pages/WasteRegistry.jsx';
import QuarterlyReport from './pages/QuarterlyReport.jsx';
import AnnualReport from './pages/AnnualReport.jsx';
import Documents from './pages/Documents.jsx';
import NewDocument from './pages/NewDocument.jsx';
import Notifications from './pages/Notifications.jsx';
import RegionalDashboard from './pages/RegionalDashboard.jsx';
import RegionalReports from './pages/RegionalReports.jsx';
import RegionalFiles from './pages/RegionalFiles.jsx';
import DirectorateDashboard from './pages/DirectorateDashboard.jsx';
import DirectorateFiles from './pages/DirectorateFiles.jsx';
import Analytics from './pages/Analytics.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

function HomeRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'company') return <CompanyDashboard />;
  if (user.role === 'regional') return <RegionalDashboard />;
  if (user.role === 'directorate') return <DirectorateDashboard />;
  if (user.role === 'admin') return <AdminPanel />;
  return <Navigate to="/login" replace />;
}

/** Ruxsat bo'lmasa — bosh sahifaga qaytaradi */
function Guard({ children, action }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (action && !hasPermission(user.role, action)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomeRouter />} />

      {/* Korxona */}
      <Route path="/profile" element={<Guard action="profile.view_own"><CompanyProfile /></Guard>} />
      <Route path="/wastes" element={<Guard action="waste.manage"><WasteRegistry /></Guard>} />
      <Route path="/quarterly" element={<Guard action="report.view_own"><QuarterlyReport /></Guard>} />
      <Route path="/annual" element={<Guard action="report.view_own"><AnnualReport /></Guard>} />

      {/* Hujjatlar */}
      <Route path="/documents" element={<Guard action="doc.view"><Documents /></Guard>} />
      <Route path="/documents/new" element={<Guard action="doc.create"><NewDocument /></Guard>} />

      <Route path="/notifications" element={<Notifications />} />

      {/* Mintaqaviy */}
      <Route path="/regional/reports" element={<Guard action="report.view_region"><RegionalReports /></Guard>} />
      <Route path="/regional/files" element={<Guard action="file.view_region"><RegionalFiles /></Guard>} />

      {/* Direksiya */}
      <Route path="/directorate/companies" element={<Guard action="data.view_all"><RegionalDashboard /></Guard>} />
      <Route path="/directorate/files" element={<Guard action="file.view_all"><DirectorateFiles /></Guard>} />
      <Route path="/directorate/analytics" element={<Guard action="analytics.view_all"><Analytics /></Guard>} />

      {/* Admin */}
      <Route path="/admin" element={<Guard action="system.configure"><AdminPanel /></Guard>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}