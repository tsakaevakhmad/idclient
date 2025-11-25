import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Laptop as DesktopIcon,
  Smartphone as MobileIcon,
  Tablet as TabletIcon,
  DeviceUnknown as UnknownDeviceIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  LogoutOutlined as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { useUserSessions } from '../../../hooks/useUserSessions';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { UserSessionDto } from '../../../api/types';
import { ROUTES } from '../../../constants';
import { geolocationService, GeolocationData } from '../../../services/geolocationService';

const MyDevices: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, loading, error, revokeSession, revokeAllExceptCurrent } = useUserSessions();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<UserSessionDto | null>(null);
  const [detailsSession, setDetailsSession] = useState<UserSessionDto | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [locationData, setLocationData] = useState<GeolocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const getDeviceIcon = (deviceType?: string) => {
    const iconProps = { sx: { fontSize: 48 } };
    switch (deviceType) {
      case 'Desktop':
        return <DesktopIcon {...iconProps} />;
      case 'Mobile':
        return <MobileIcon {...iconProps} />;
      case 'Tablet':
        return <TabletIcon {...iconProps} />;
      default:
        return <UnknownDeviceIcon {...iconProps} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDeviceName = (session: UserSessionDto) => {
    const info = session.deviceInfo;
    const parts = [];
    if (info.browser) {
      parts.push(`${info.browser}${info.browserVersion ? ` ${info.browserVersion}` : ''}`);
    }
    if (info.os) {
      parts.push(`${info.os}${info.osVersion ? ` ${info.osVersion}` : ''}`);
    }
    return parts.length > 0 ? parts.join(' on ') : info.deviceName || 'Unknown Device';
  };

  const handleViewDetails = async (session: UserSessionDto) => {
    setDetailsSession(session);
    setLoadingLocation(true);
    setLocationData(null);

    try {
      const location = await geolocationService.getLocationByIP(session.ipAddress);
      setLocationData(location);
    } catch (err) {
      console.error('Failed to load location:', err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsSession(null);
    setLocationData(null);
  };

  const handleRevokeClick = (session: UserSessionDto) => {
    setSelectedSession(session);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedSession) return;
    setRevoking(true);
    try {
      await revokeSession(selectedSession.id);
      setSelectedSession(null);
      setSnackbar({
        open: true,
        message: t('sessions.revokeSuccess') || 'Session revoked successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to revoke session:', err);
      setSnackbar({
        open: true,
        message: t('sessions.revokeError') || 'Failed to revoke session',
        severity: 'error',
      });
    } finally {
      setRevoking(false);
    }
  };

  const handleRevokeAllClick = () => {
    setShowRevokeAllDialog(true);
  };

  const handleConfirmRevokeAll = async () => {
    setRevoking(true);
    try {
      const response = await revokeAllExceptCurrent();
      setShowRevokeAllDialog(false);
      if (response) {
        setSnackbar({
          open: true,
          message: response.message || `${response.count} sessions revoked successfully`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: t('sessions.revokeAllSuccess') || 'Sessions revoked successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to revoke all sessions:', err);
      setSnackbar({
        open: true,
        message: t('sessions.revokeAllError') || 'Failed to revoke sessions',
        severity: 'error',
      });
    } finally {
      setRevoking(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedSession(null);
  };

  const handleCloseRevokeAllDialog = () => {
    setShowRevokeAllDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && sessions.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <BackgroundGradient />
        <LoadingSpinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          position: 'relative',
        }}
      >
        <BackgroundGradient />
        <GlassCard>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </GlassCard>
      </Box>
    );
  }

  const activeSessions = sessions.filter((s) => !s.isRevoked);
  const hasMultipleSessions = activeSessions.length > 1;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        position: 'relative',
      }}
    >
      <BackgroundGradient />
      <Box sx={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 3 }}>
            <GlassButton
              onClick={() => navigate(ROUTES.PROFILE)}
              startIcon={<ArrowBackIcon />}
              gradient={false}
            >
              {t('common.backToProfile') || 'Back to Profile'}
            </GlassButton>
          </Box>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography
              variant="h4"
              sx={{
                background: theme.gradients.button,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              {t('sessions.myDevices') || 'My Devices'}
            </Typography>
            {hasMultipleSessions && (
              <GlassButton
                onClick={handleRevokeAllClick}
                startIcon={<LogoutIcon />}
                disabled={revoking}
              >
                {t('sessions.logoutOtherDevices') || 'Logout from Other Devices'}
              </GlassButton>
            )}
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Typography variant="body2" color={theme.colors.text.secondary} sx={{ mb: 4 }}>
            {t('sessions.devicesDescription') ||
              'Manage your active login sessions. You can revoke sessions from devices you no longer use.'}
          </Typography>
        </motion.div>

        {/* Sessions Grid */}
        {activeSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GlassCard glowOnHover>
              <Typography align="center" color={theme.colors.text.secondary}>
                {t('sessions.noActiveSessions') || 'No active sessions found'}
              </Typography>
            </GlassCard>
          </motion.div>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activeSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlassCard
                  glowOnHover
                  sx={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleViewDetails(session)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    {/* Device Icon with gradient background */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 80,
                        height: 80,
                        borderRadius: '16px',
                        background: theme.gradients.button,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: `0 4px 20px ${theme.colors.primary}40`,
                      }}
                    >
                      {getDeviceIcon(session.deviceInfo.deviceType)}
                    </Box>

                    {/* Session Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 0.5 }}
                      >
                        {getDeviceName(session)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 16, color: theme.colors.text.secondary }} />
                          <Typography variant="body2" color={theme.colors.text.secondary}>
                            {session.ipAddress}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <UpdateIcon sx={{ fontSize: 16, color: theme.colors.text.secondary }} />
                          <Typography variant="caption" color={theme.colors.text.secondary}>
                            {formatDate(session.lastActivityAt)}
                          </Typography>
                        </Box>
                      </Box>
                      {session.activeAuthorizationsCount > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={`${session.activeAuthorizationsCount} ${t('sessions.activeApps') || 'active apps'}`}
                            size="small"
                            sx={{
                              background: theme.colors.accent + '20',
                              color: theme.colors.accent,
                              fontWeight: 600,
                              border: `1px solid ${theme.colors.accent}40`,
                            }}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(session);
                        }}
                        sx={{
                          color: theme.colors.primary,
                          background: theme.colors.glass.background,
                          backdropFilter: `blur(${theme.colors.glass.blur})`,
                          border: `1px solid ${theme.colors.primary}40`,
                          '&:hover': {
                            background: `${theme.colors.primary}20`,
                            borderColor: theme.colors.primary,
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevokeClick(session);
                        }}
                        sx={{
                          color: theme.colors.accent,
                          background: theme.colors.glass.background,
                          backdropFilter: `blur(${theme.colors.glass.blur})`,
                          border: `1px solid ${theme.colors.accent}40`,
                          '&:hover': {
                            background: `${theme.colors.accent}20`,
                            borderColor: theme.colors.accent,
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </GlassCard>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Session Details Dialog */}
        <Dialog
          open={!!detailsSession}
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: theme.colors.glass.background,
              backdropFilter: `blur(${theme.colors.glass.blur})`,
              border: `1px solid ${theme.colors.glass.border}`,
              borderRadius: '20px',
              boxShadow: theme.colors.glass.shadow,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                background: theme.gradients.button,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              {t('sessions.device') || 'Device Details'}
            </Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {detailsSession && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Device Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '20px',
                      background: theme.gradients.button,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: `0 8px 32px ${theme.colors.primary}60`,
                    }}
                  >
                    {getDeviceIcon(detailsSession.deviceInfo.deviceType)}
                  </Box>
                </Box>

                {/* Device Name */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                    {getDeviceName(detailsSession)}
                  </Typography>
                  <Chip
                    label={detailsSession.deviceInfo.deviceType || 'Unknown'}
                    size="small"
                    sx={{
                      background: theme.colors.primary + '20',
                      color: theme.colors.primary,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor: theme.colors.glass.border, opacity: 0.5 }} />

                {/* Browser */}
                {detailsSession.deviceInfo.browser && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                    >
                      {t('auth.profile.browser') || 'Browser'}
                    </Typography>
                    <Typography variant="body1" color="text.primary" fontWeight={500}>
                      {detailsSession.deviceInfo.browser}
                      {detailsSession.deviceInfo.browserVersion &&
                        ` ${detailsSession.deviceInfo.browserVersion}`}
                    </Typography>
                  </Box>
                )}

                {/* Operating System */}
                {detailsSession.deviceInfo.os && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                    >
                      {t('auth.profile.operatingSystem') || 'Operating System'}
                    </Typography>
                    <Typography variant="body1" color="text.primary" fontWeight={500}>
                      {detailsSession.deviceInfo.os}
                      {detailsSession.deviceInfo.osVersion &&
                        ` ${detailsSession.deviceInfo.osVersion}`}
                    </Typography>
                  </Box>
                )}

                {/* IP Address */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    {t('sessions.ipAddress') || 'IP Address'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ color: theme.colors.primary }} />
                    <Typography variant="body1" color="text.primary" fontWeight={500}>
                      {detailsSession.ipAddress}
                    </Typography>
                  </Box>
                </Box>

                {/* Location */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    {t('auth.profile.location') || 'Location'}
                  </Typography>
                  {loadingLocation ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('auth.profile.loadingLocation') || 'Loading location...'}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body1" color="text.primary" fontWeight={500}>
                        {geolocationService.formatLocation(locationData)}
                      </Typography>
                      {locationData && locationData.timezone && (
                        <Typography variant="caption" color="text.secondary">
                          {locationData.timezone}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {/* Created Date */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    {t('sessions.created') || 'Created'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon sx={{ color: theme.colors.primary }} />
                    <Typography variant="body1" color="text.primary" fontWeight={500}>
                      {formatDate(detailsSession.createdAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Last Activity */}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                  >
                    {t('sessions.lastActivity') || 'Last Activity'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UpdateIcon sx={{ color: theme.colors.primary }} />
                    <Typography variant="body1" color="text.primary" fontWeight={500}>
                      {formatDate(detailsSession.lastActivityAt)}
                    </Typography>
                  </Box>
                </Box>

                {/* Active Apps */}
                {detailsSession.activeAuthorizationsCount > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontWeight: 600 }}
                    >
                      {t('sessions.activeApps') || 'Active Applications'}
                    </Typography>
                    <Chip
                      label={detailsSession.activeAuthorizationsCount}
                      sx={{
                        mt: 1,
                        background: theme.gradients.button,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <GlassButton gradient={false} onClick={handleCloseDetails}>
              {t('common.close') || 'Close'}
            </GlassButton>
            {detailsSession && (
              <GlassButton
                onClick={() => {
                  handleCloseDetails();
                  handleRevokeClick(detailsSession);
                }}
                sx={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.2)',
                  },
                }}
              >
                {t('common.revoke') || 'Revoke'}
              </GlassButton>
            )}
          </DialogActions>
        </Dialog>

        {/* Revoke Single Session Dialog */}
        <Dialog
          open={!!selectedSession}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              background: theme.colors.glass.background,
              backdropFilter: `blur(${theme.colors.glass.blur})`,
              borderRadius: '20px',
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
            {t('sessions.revokeSession') || 'Revoke Session'}
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography color={theme.colors.text.secondary}>
              {t('sessions.revokeSessionConfirm') ||
                'Are you sure you want to revoke this session? You will be logged out from this device.'}
            </Typography>
            {selectedSession && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color={theme.colors.text.primary}>
                  <strong>{t('sessions.device') || 'Device'}:</strong>{' '}
                  {getDeviceName(selectedSession)}
                </Typography>
                <Typography variant="body2" color={theme.colors.text.primary}>
                  <strong>{t('sessions.ipAddress') || 'IP Address'}:</strong>{' '}
                  {selectedSession.ipAddress}
                </Typography>
                <Typography variant="body2" color={theme.colors.text.primary}>
                  <strong>{t('sessions.created') || 'Created'}:</strong>{' '}
                  {formatDate(selectedSession.createdAt)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <GlassButton onClick={handleCloseDialog} disabled={revoking} gradient={false}>
              {t('common.cancel') || 'Cancel'}
            </GlassButton>
            <GlassButton onClick={handleConfirmRevoke} disabled={revoking}>
              {revoking ? t('common.revoking') || 'Revoking...' : t('common.revoke') || 'Revoke'}
            </GlassButton>
          </DialogActions>
        </Dialog>

        {/* Revoke All Sessions Dialog */}
        <Dialog
          open={showRevokeAllDialog}
          onClose={handleCloseRevokeAllDialog}
          PaperProps={{
            sx: {
              background: theme.colors.glass.background,
              backdropFilter: `blur(${theme.colors.glass.blur})`,
              borderRadius: '20px',
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
            {t('sessions.logoutOtherDevices') || 'Logout from Other Devices'}
            <IconButton onClick={handleCloseRevokeAllDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('sessions.revokeAllWarning') ||
                'This will log you out from all other devices. Your current session will remain active.'}
            </Alert>
            <Typography color={theme.colors.text.secondary}>
              {t('sessions.revokeAllConfirm') ||
                `Are you sure you want to logout from ${activeSessions.length - 1} other device(s)?`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <GlassButton onClick={handleCloseRevokeAllDialog} disabled={revoking} gradient={false}>
              {t('common.cancel') || 'Cancel'}
            </GlassButton>
            <GlassButton onClick={handleConfirmRevokeAll} disabled={revoking}>
              {revoking
                ? t('common.revoking') || 'Logging out...'
                : t('common.confirm') || 'Confirm'}
            </GlassButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default MyDevices;
