import { useState, useCallback } from 'react';
import { passkeyService } from '../services/passkeyService';

interface UsePasskeyReturn {
  isRegistering: boolean;
  isLoggingIn: boolean;
  error: string | null;
  registerPasskey: () => Promise<boolean>;
  loginWithPasskey: () => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for WebAuthn Passkey functionality
 */
export const usePasskey = (): UsePasskeyReturn => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPasskey = useCallback(async (): Promise<boolean> => {
    try {
      setIsRegistering(true);
      setError(null);
      await passkeyService.registerPasskey();
      return true;
    } catch (err) {
      console.error('Passkey registration error:', err);
      setError('Failed to register passkey. Please try again.');
      return false;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const loginWithPasskey = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoggingIn(true);
      setError(null);
      const response = await passkeyService.loginPasskey();
      if (response && response.status === 200) {
        return true;
      }
      setError('Passkey login failed');
      return false;
    } catch (err) {
      console.error('Passkey login error:', err);
      setError('Failed to login with passkey. Please try again.');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isRegistering,
    isLoggingIn,
    error,
    registerPasskey,
    loginWithPasskey,
    clearError,
  };
};
