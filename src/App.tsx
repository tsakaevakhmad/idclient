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

/**
 * Retries a failed dynamic import up to `retries` times with a delay.
 * If all retries fail, forces a hard reload to recover from stale chunk URLs.
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  delay = 500
): React.LazyExoticComponent<T> {
  return lazy(
    () =>
      new Promise<{ default: T }>((resolve, reject) => {
        const attempt = (remaining: number) => {
          factory()
            .then(resolve)
            .catch((err: unknown) => {
              if (remaining <= 0) {
                // All retries exhausted — chunk URLs are stale after a rebuild.
                // Force a full reload so the browser fetches the new HTML + chunks.
                window.location.reload();
                reject(err);
              } else {
                setTimeout(() => attempt(remaining - 1), delay);
              }
            });
        };
        attempt(retries);
      })
  );
}

// Lazy load route components (using new glassmorphism designs)
const Login = lazyWithRetry(() => import('./components/features/auth/LoginNew'));
const Registration = lazyWithRetry(() => import('./components/features/auth/RegistrationNew'));
const Profile = lazyWithRetry(() => import('./components/features/profile/ProfileNew'));
const MyDevices = lazyWithRetry(() => import('./components/features/profile/MyDevices'));

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
