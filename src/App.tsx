import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ErrorBoundary, LoadingSpinner } from './components/common';
import { SettingsMenu } from './components/theme/SettingsMenu';
import { PageTransition } from './components/animations';
import { ROUTES } from './constants';
import './i18n/config'; // Initialize i18n
import './App.css';

// Lazy load route components (using new glassmorphism designs)
const Login = lazy(() => import('./components/features/auth/LoginNew'));
const Registration = lazy(() => import('./components/features/auth/RegistrationNew'));
const Profile = lazy(() => import('./components/features/profile/ProfileNew'));
const MyDevices = lazy(() => import('./components/features/profile/MyDevices'));

/**
 * Router wrapper component to access useLocation hook
 */
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  return (
    <>
      <SettingsMenu />
      <Suspense fallback={<LoadingSpinner message="Loading..." />}>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            {settings?.registrationEnabled && (
              <Route path={ROUTES.REGISTRATION} element={<Registration />} />
            )}
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.DEVICES} element={<MyDevices />} />
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
        <SettingsProvider>
          <AuthProvider>
            <UserProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </UserProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
