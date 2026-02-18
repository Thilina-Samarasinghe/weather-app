import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Loading from './components/Loading';
import { ThemeProvider } from './context/ThemeContext';

// Simple guard component
const AuthenticationGuard = ({ component }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? component : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={<AuthenticationGuard component={<Dashboard />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
