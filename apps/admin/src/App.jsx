import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import ActivateAccount from './pages/ActivateAccount';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList';
import InventoryForm from './pages/InventoryForm';
import LeadsList from './pages/LeadsList';
import UserManagement from './pages/UserManagement';
import WebSettings from './pages/WebSettings';

function AuthenticatedApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/new" element={<InventoryForm />} />
        <Route path="/inventory/:id/edit" element={<InventoryForm />} />
        <Route path="/leads" element={<LeadsList />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/admins" element={<UserManagement adminOnly={true} />} />
        <Route path="/settings" element={<WebSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/activate/:token" element={<ActivateAccount />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
