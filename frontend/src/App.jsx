import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
      <Route path="/user-login" element={!isAuthenticated ? <UserLogin /> : <Navigate to="/dashboard" />} />
      <Route path="/admin-login" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        isAuthenticated ? (
          <Layout>
            {isAdmin ? <AdminDashboard /> : <Dashboard />}
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App; 