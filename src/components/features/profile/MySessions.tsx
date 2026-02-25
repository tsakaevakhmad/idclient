import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Laptop as DesktopIcon,
  Smartphone as MobileIcon,
  Tablet as TabletIcon,
  DeviceUnknown as UnknownDeviceIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSessions } from '../../../hooks/useSessions';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { AuthorizationSession } from '../../../api/types';

const MySessions: React.FC = () => {
  const { sessions, loading, error, revokeSession } = useSessions();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<AuthorizationSession | null>(null);
  const [revoking, setRevoking] = useState(false);

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return <DesktopIcon sx={{ fontSize: 40, color: theme.colors.primary }} />;
      case 'mobile':
        return <MobileIcon sx={{ fontSize: 40, color: theme.colors.primary }} />;
      case 'tablet':
        return <TabletIcon sx={{ fontSize: 40, color: theme.colors.primary }} />;
      default:
        return <UnknownDeviceIcon sx={{ fontSize: 40, color: theme.colors.text.secondary }} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const normalized = /Z|[+-]\d{2}:\d{2}$/.test(dateString) ? dateString : dateString + 'Z';
    const date = new Date(normalized);
    return date.toLocaleString();
  };

  const handleRevokeClick = (session: AuthorizationSession) => {
    setSelectedSession(session);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedSession) return;
    setRevoking(true);
    try {
      await revokeSession(selectedSession.id);
      setSelectedSession(null);
    } catch (err) {
      console.error('Failed to revoke session:', err);
    } finally {
      setRevoking(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedSession(null);
  };

  if (loading && sessions.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </GlassCard>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: theme.colors.text.primary,
          fontWeight: 600,
        }}
      >
        {t('auth.profile.activeSessions') || 'Active Sessions'}
      </Typography>

      {sessions.length === 0 ? (
        <GlassCard>
          <Typography align="center" color={theme.colors.text.secondary}>
            {t('auth.profile.noActiveSessions') || 'No active sessions found'}
          </Typography>
        </GlassCard>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  {/* Device Icon */}
                  <Box sx={{ flexShrink: 0 }}>{getDeviceIcon(session.deviceType)}</Box>

                  {/* Session Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                    >
                      {session.deviceName || session.deviceType || 'Unknown Device'}
                    </Typography>
                    <Typography variant="body2" color={theme.colors.text.secondary}>
                      {session.ipAddress || 'IP not available'}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.text.secondary}>
                      {t('auth.profile.sessionCreated') || 'Created'}:{' '}
                      {formatDate(session.creationDate)}
                    </Typography>
                    {session.clientId && (
                      <Typography
                        variant="caption"
                        display="block"
                        color={theme.colors.text.secondary}
                      >
                        {t('auth.profile.client') || 'Client'}: {session.clientId}
                      </Typography>
                    )}
                    {session.status && (
                      <Chip
                        label={session.status}
                        size="small"
                        sx={{ mt: 1 }}
                        color={session.status === 'valid' ? 'success' : 'default'}
                      />
                    )}
                  </Box>

                  {/* Revoke Button */}
                  <IconButton
                    onClick={() => handleRevokeClick(session)}
                    sx={{
                      color: theme.colors.accent,
                      '&:hover': {
                        backgroundColor: `${theme.colors.accent}20`,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedSession}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: theme.colors.glass.background,
            backdropFilter: `blur(${theme.colors.glass.blur})`,
            borderRadius: 2,
            border: `1px solid ${theme.colors.text.secondary}30`,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: theme.colors.text.primary,
          }}
        >
          {t('auth.profile.revokeSession') || 'Revoke Session'}
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography color={theme.colors.text.secondary}>
            {t('auth.profile.revokeSessionConfirm') ||
              'Are you sure you want to revoke this session? This action cannot be undone.'}
          </Typography>
          {selectedSession && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color={theme.colors.text.primary}>
                <strong>{t('auth.profile.device') || 'Device'}:</strong>{' '}
                {selectedSession.deviceName || selectedSession.deviceType || 'Unknown'}
              </Typography>
              <Typography variant="body2" color={theme.colors.text.primary}>
                <strong>{t('auth.profile.ipAddress') || 'IP Address'}:</strong>{' '}
                {selectedSession.ipAddress || 'N/A'}
              </Typography>
              <Typography variant="body2" color={theme.colors.text.primary}>
                <strong>{t('auth.profile.created') || 'Created'}:</strong>{' '}
                {formatDate(selectedSession.creationDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GlassButton onClick={handleCloseDialog} disabled={revoking}>
            {t('common.cancel') || 'Cancel'}
          </GlassButton>
          <GlassButton onClick={handleConfirmRevoke} disabled={revoking}>
            {revoking ? t('common.revoking') || 'Revoking...' : t('common.revoke') || 'Revoke'}
          </GlassButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MySessions;
