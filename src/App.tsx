import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ErrorBoundary, LoadingSpinner } from './components/common';
import { ROUTES } from './constants';
import './App.css';

// Lazy load route components
const Login = lazy(() => import('./components/features/auth/Login'));
const Registration = lazy(() => import('./components/features/auth/Registration'));
const Profile = lazy(() => import('./components/features/profile/Profile'));

/**
 * Main App component with routing, context providers, and error boundaries
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner message="Loading..." />}>
              <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTRATION} element={<Registration />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
