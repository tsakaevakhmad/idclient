import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { ExternalProvider } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  externalProviders: ExternalProvider[];
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  loadExternalProviders: (params?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [externalProviders, setExternalProviders] = useState<ExternalProvider[]>([]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.isAuthorized();
      const authenticated = result.data.status === 'Success';
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const loadExternalProviders = useCallback(async (params?: string) => {
    try {
      const result = await authService.getExternalProviders(params);
      if (Array.isArray(result?.data)) {
        setExternalProviders(result.data);
      }
    } catch (error) {
      console.error('Failed to load external providers:', error);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    externalProviders,
    login,
    logout,
    checkAuth,
    loadExternalProviders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export type { AuthContextType };
