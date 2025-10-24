import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState(t('auth.qr.status.connecting'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRScanned = useCallback(
    async (token: QRLoginToken) => {
      if (!token) return;

      setStatus(t('auth.qr.status.authenticating'));
      setIsAuthenticating(true);

      try {
        const response = await authService.qrSignIn(token.token);
        if (response.data.status === 'Success') {
          setStatus(t('auth.qr.status.success'));
          onSuccess();
        } else {
          setStatus(t('auth.qr.status.authFailed'));
          setError(t('auth.qr.status.authFailed'));
        }
      } catch (err) {
        console.error('QR login error:', err);
        setStatus(t('auth.qr.status.loginError'));
        setError(t('auth.qr.status.failedToAuth'));
      } finally {
        setIsAuthenticating(false);
      }
    },
    [onSuccess, t]
  );

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUBS.QR_LOGIN, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        setStatus(t('auth.qr.status.waitingForQR'));
        setIsLoading(false);
      } catch (err) {
        console.error('Connection error:', err);
        setStatus(t('auth.qr.status.connectionError'));
        setError(t('auth.qr.status.failedToConnect'));
        setIsLoading(false);
      }
    };

    connection.on('ReceiveSessionId', (id: string) => {
      setSessionId(id);
      setStatus(t('auth.qr.status.scanWithApp'));
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
