import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
  sendPhoneVerificationCode: () => Promise<void>;
  verifyPhoneCode: (code: string) => Promise<boolean>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUserInfo();
      setUser(response.data);
    } catch (err) {
      const errorMessage = 'Failed to load user information';
      setError(errorMessage);
      console.error(errorMessage, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendPhoneVerificationCode = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await userService.sendPhoneConfirmationCode();
    } catch (err) {
      const errorMessage = 'Failed to send verification code';
      setError(errorMessage);
      console.error(errorMessage, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPhoneCode = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);
        await userService.verifyPhoneConfirmationCode(code);
        // Refresh user info after successful verification
        await fetchUserInfo();
        return true;
      } catch (err) {
        const errorMessage = 'Failed to verify phone code';
        setError(errorMessage);
        console.error(errorMessage, err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserInfo]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: UserContextType = {
    user,
    isLoading,
    error,
    fetchUserInfo,
    sendPhoneVerificationCode,
    verifyPhoneCode,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext };
export type { UserContextType };
