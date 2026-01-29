import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AllCollectionsPage from './pages/AllCollectionsPage';
import CollectionsPage from './pages/CollectionsPage';
import TrashPage from './pages/TrashPage';
import SettingsPage from './pages/SettingsPage';
import PublicSharePage from './pages/PublicSharePage';

const Layout = () => (
  <div className="flex bg-dark-900 min-h-screen">
    <Sidebar />
    <div className="flex-1 ml-64 p-8 overflow-y-auto">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/share/:shareId" element={<PublicSharePage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/collections" element={<AllCollectionsPage />} />
              <Route path="/collections/:id" element={<CollectionsPage />} />
              <Route path="/trash" element={<TrashPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
