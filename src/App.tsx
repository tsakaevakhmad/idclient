import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary, LoadingSpinner } from './components/common';
import { ThemeSwitcher } from './components/theme/ThemeSwitcher';
import { PageTransition } from './components/animations';
import { ROUTES } from './constants';
import './App.css';

// Lazy load route components (using new glassmorphism designs)
const Login = lazy(() => import('./components/features/auth/LoginNew'));
const Registration = lazy(() => import('./components/features/auth/RegistrationNew'));
const Profile = lazy(() => import('./components/features/profile/ProfileNew'));

/**
 * Router wrapper component to access useLocation hook
 */
const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <ThemeSwitcher />
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTRATION} element={<Registration />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </>
  );
};

/**
 * Main App component with routing, context providers, and error boundaries
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
