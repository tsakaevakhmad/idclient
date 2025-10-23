import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUBS } from '../constants';
import { authService } from '../services/authService';
import { QRLoginToken } from '../api/types';

interface UseQRLoginReturn {
  sessionId: string | null;
  status: string;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
}

/**
 * Custom hook for QR code login functionality using SignalR
 */
export const useQRLogin = (onSuccess: () => void): UseQRLoginReturn => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState('Connecting to server...');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRScanned = useCallback(
    async (token: QRLoginToken) => {
      if (!token) return;

      setStatus('Authenticating...');
      setIsAuthenticating(true);

      try {
        const response = await authService.qrSignIn(token.token);
        if (response.data.status === 'Success') {
          setStatus('Login successful ✅');
          onSuccess();
        } else {
          setStatus('Authentication failed. Please try again.');
          setError('Authentication failed');
        }
      } catch (err) {
        console.error('QR login error:', err);
        setStatus('Login error occurred.');
        setError('Failed to authenticate with QR code');
      } finally {
        setIsAuthenticating(false);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUBS.QR_LOGIN, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        setStatus('Waiting for QR code...');
        setIsLoading(false);
      } catch (err) {
        console.error('Connection error:', err);
        setStatus('Connection error. Please try again.');
        setError('Failed to connect to server');
        setIsLoading(false);
      }
    };

    connection.on('ReceiveSessionId', (id: string) => {
      setSessionId(id);
      setStatus('Scan QR code with your mobile app');
    });

    connection.on('QrScaned', handleQRScanned);

    startConnection();

    return () => {
      connection.stop();
    };
  }, [handleQRScanned]);

  return {
    sessionId,
    status,
    isLoading,
    isAuthenticating,
    error,
  };
};
