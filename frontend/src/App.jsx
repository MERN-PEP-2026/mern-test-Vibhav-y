import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const PrivateRoute = ({ children }) => {
  const { token, initializing } = useAuth();
  if (initializing) {
    return <div className="app-shell card">Checking session…</div>;
  }
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
