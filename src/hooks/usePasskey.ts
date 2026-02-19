import { useState, useCallback } from 'react';
import { passkeyService } from '../services/passkeyService';
import { FidoCredentialDto } from '../api/types';

interface UsePasskeyReturn {
  isRegistering: boolean;
  isLoggingIn: boolean;
  isLoadingPasskeys: boolean;
  isDeletingPasskey: boolean;
  error: string | null;
  passkeys: FidoCredentialDto[];
  registerPasskey: (passkeyName?: string) => Promise<boolean>;
  loginWithPasskey: () => Promise<boolean>;
  fetchPasskeys: () => Promise<void>;
  deletePasskey: (passkeyId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for WebAuthn Passkey functionality
 */
export const usePasskey = (): UsePasskeyReturn => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingPasskeys, setIsLoadingPasskeys] = useState(false);
  const [isDeletingPasskey, setIsDeletingPasskey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<FidoCredentialDto[]>([]);

  const registerPasskey = useCallback(async (passkeyName?: string): Promise<boolean> => {
    try {
      setIsRegistering(true);
      setError(null);
      await passkeyService.registerPasskey(passkeyName);
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

  const fetchPasskeys = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingPasskeys(true);
      setError(null);
      const data = await passkeyService.getPasskeys();
      setPasskeys(data);
    } catch (err) {
      console.error('Fetch passkeys error:', err);
      setError('Failed to load passkeys.');
    } finally {
      setIsLoadingPasskeys(false);
    }
  }, []);

  const deletePasskey = useCallback(async (passkeyId: string): Promise<boolean> => {
    try {
      setIsDeletingPasskey(true);
      setError(null);
      await passkeyService.deletePasskey(passkeyId);
      setPasskeys((prev) => prev.filter((p) => p.id !== passkeyId));
      return true;
    } catch (err) {
      console.error('Delete passkey error:', err);
      setError('Failed to delete passkey.');
      return false;
    } finally {
      setIsDeletingPasskey(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isRegistering,
    isLoggingIn,
    isLoadingPasskeys,
    isDeletingPasskey,
    error,
    passkeys,
    registerPasskey,
    loginWithPasskey,
    fetchPasskeys,
    deletePasskey,
    clearError,
  };
};
