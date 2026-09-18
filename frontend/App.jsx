import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// User Pages
import UserDashboard from './pages/User/UserDashboard';
import MyTickets from './pages/User/MyTickets';
import CreateTicket from './pages/User/CreateTicket';
import UserTicketDetail from './pages/User/UserTicketDetail';
import UserProfile from './pages/User/UserProfile';
import KnowledgeBase from './pages/User/KnowledgeBase';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminTickets from './pages/Admin/AdminTickets';
import AdminTicketDetail from './pages/Admin/AdminTicketDetail';
import UserManagement from './pages/Admin/UserManagement';
import AuditLogs from './pages/Admin/AuditLogs';
import SystemSettings from './pages/Admin/SystemSettings';

// Loading screen while verifying JWT session
function AuthLoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary, #0f1117)',
      flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid rgba(99,102,241,0.2)',
        borderTop: '3px solid #6366f1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary, #8b9ab1)', fontSize: '0.9rem' }}>
        Verifying session...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, authLoading } = useApp();
  if (authLoading) return <AuthLoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard'} replace />;
  }
  return children;
}

function App() {
  const { currentUser, authLoading } = useApp();

  if (authLoading) return <AuthLoadingScreen />;

  return (
    <Routes>
      {/* Public / Auth */}
      <Route path="/login" element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard'} replace /> : <Register />} />

      {/* Main App Layout */}
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Customer / User Portal */}
        <Route path="user/dashboard" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="user/tickets" element={<ProtectedRoute requiredRole="user"><MyTickets /></ProtectedRoute>} />
        <Route path="user/create-ticket" element={<ProtectedRoute requiredRole="user"><CreateTicket /></ProtectedRoute>} />
        <Route path="user/ticket/:id" element={<ProtectedRoute requiredRole="user"><UserTicketDetail /></ProtectedRoute>} />
        <Route path="user/profile" element={<ProtectedRoute requiredRole="user"><UserProfile /></ProtectedRoute>} />
        <Route path="user/knowledge-base" element={<ProtectedRoute requiredRole="user"><KnowledgeBase /></ProtectedRoute>} />

        {/* Admin Portal */}
        <Route path="admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/tickets" element={<ProtectedRoute requiredRole="admin"><AdminTickets /></ProtectedRoute>} />
        <Route path="admin/ticket/:id" element={<ProtectedRoute requiredRole="admin"><AdminTicketDetail /></ProtectedRoute>} />
        <Route path="admin/ticket/:id/delete" element={<ProtectedRoute requiredRole="admin"><AdminTicketDetail /></ProtectedRoute>} />
        <Route path="admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="admin/audit-logs" element={<ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>} />
        <Route path="admin/settings" element={<ProtectedRoute requiredRole="admin"><SystemSettings /></ProtectedRoute>} />

        {/* /app root redirect */}
        <Route
          index
          element={
            currentUser?.role === 'admin'
              ? <Navigate to="/app/admin/dashboard" replace />
              : <Navigate to="/app/user/dashboard" replace />
          }
        />
      </Route>

      {/* Root redirect */}
      <Route
        path="*"
        element={
          currentUser
            ? <Navigate to={currentUser.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard'} replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
