import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

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

function Guard({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Bosh sahifa — rolga qarab */}
      <Route path="/" element={<HomeRouter />} />

      {/* ===== KORXONA ===== */}
      <Route
        path="/profile"
        element={
          <Guard roles={['company']}>
            <CompanyProfile />
          </Guard>
        }
      />
      <Route
        path="/wastes"
        element={
          <Guard roles={['company']}>
            <WasteRegistry />
          </Guard>
        }
      />
      <Route
        path="/quarterly"
        element={
          <Guard roles={['company']}>
            <QuarterlyReport />
          </Guard>
        }
      />
      <Route
        path="/annual"
        element={
          <Guard roles={['company']}>
            <AnnualReport />
          </Guard>
        }
      />

      {/* ===== HUJJATLAR (umumiy) ===== */}
     <Route
  path="/documents"
  element={
    <Guard roles={['company', 'regional', 'directorate', 'admin']}>
      <Documents />
    </Guard>
  }
/>
<Route
  path="/documents/new"
  element={
    <Guard roles={['company', 'regional', 'directorate']}>
      <NewDocument />
    </Guard>
  }
/>
      {/* ===== BILDIRISHNOMALAR (barcha rollar) ===== */}
      <Route path="/notifications" element={<Notifications />} />

      {/* ===== MINTAQAVIY ===== */}
      <Route
        path="/regional/reports"
        element={
          <Guard roles={['regional']}>
            <RegionalReports />
          </Guard>
        }
      />
      <Route
        path="/regional/files"
        element={
          <Guard roles={['regional']}>
            <RegionalFiles />
          </Guard>
        }
      />

      {/* ===== DIREKSIYA ===== */}
      <Route
        path="/directorate/companies"
        element={
          <Guard roles={['directorate']}>
            <RegionalDashboard />
          </Guard>
        }
      />
      <Route
        path="/directorate/files"
        element={
          <Guard roles={['directorate']}>
            <DirectorateFiles />
          </Guard>
        }
      />
      <Route
        path="/directorate/analytics"
        element={
          <Guard roles={['directorate']}>
            <Analytics />
          </Guard>
        }
      />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <Guard roles={['admin']}>
            <AdminPanel />
          </Guard>
        }
      />

      {/* 404 → bosh sahifa */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}