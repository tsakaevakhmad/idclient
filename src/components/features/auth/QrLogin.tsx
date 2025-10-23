import React from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useQRLogin } from '../../../hooks/useQRLogin';

interface QrLoginProps {
  onSuccess: () => void;
}

/**
 * QR Code login component using SignalR
 */
const QrLogin: React.FC<QrLoginProps> = ({ onSuccess }) => {
  const { sessionId, status, isLoading, isAuthenticating } = useQRLogin(onSuccess);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
          textAlign: 'center',
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" align="center">
              QR Code Login
            </Typography>
          }
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : sessionId ? (
            <>
              {isAuthenticating ? (
                <CircularProgress size={200} />
              ) : (
                <QRCode value={sessionId} size={200} style={{ borderRadius: '8px' }} />
              )}
              <Typography variant="body2" color="text.secondary">
                {status}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">{status}</Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QrLogin;
