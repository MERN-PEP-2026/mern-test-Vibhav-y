import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppHeader from './components/AppHeader';

const PrivateRoute = ({ children }) => {
  const { token, initializing } = useAuth();
  if (initializing) {
    return <div className="app-loading">Checking session...</div>;
  }
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <div className="app-shell">
        <AppHeader />
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
      </div>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
