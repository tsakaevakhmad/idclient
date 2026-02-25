import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
  Collapse,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccountCircle as AccountCircleIcon,
  Fingerprint as FingerprintIcon,
  PhoneAndroid as PhoneIcon,
  ExitToApp as LogoutIcon,
  Laptop as DesktopIcon,
  Smartphone as MobileIcon,
  Tablet as TabletIcon,
  DeviceUnknown as UnknownDeviceIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Devices as DevicesIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import OtpInput from 'react-otp-input';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { usePasskey } from '../../../hooks/usePasskey';
import { useSessions } from '../../../hooks/useSessions';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { ProfileSkeletonLoader } from '../../animations/SkeletonLoader';
import { ROUTES } from '../../../constants';
import { AuthorizationSession, FidoCredentialDto } from '../../../api/types';
import { geolocationService, GeolocationData } from '../../../services/geolocationService';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, isLoading, error, fetchUserInfo, sendPhoneVerificationCode, verifyPhoneCode } =
    useUser();
  const {
    isRegistering,
    registerPasskey,
    passkeys,
    isLoadingPasskeys,
    isDeletingPasskey,
    fetchPasskeys,
    deletePasskey,
  } = usePasskey();
  const { sessions, loading: sessionsLoading, revokeSession } = useSessions();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sessionsExpanded, setSessionsExpanded] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AuthorizationSession | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [allSessionsOpen, setAllSessionsOpen] = useState(false);
  const [detailsSession, setDetailsSession] = useState<AuthorizationSession | null>(null);
  const [locationData, setLocationData] = useState<GeolocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [passkeysExpanded, setPasskeysExpanded] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<FidoCredentialDto | null>(null);
  const [passkeyNameDialogOpen, setPasskeyNameDialogOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await fetchUserInfo();
      } catch (err) {
        navigate(ROUTES.LOGIN);
      }
    };
    loadUserData();
  }, [fetchUserInfo, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePhoneConfirmation = async () => {
    setSendingCode(true);
    try {
      await sendPhoneVerificationCode();
      setDialogOpen(true);
    } catch (error) {
      console.error('Error sending phone confirmation code:', error);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifying(true);
    const success = await verifyPhoneCode(otp);
    setVerifying(false);
    if (success) {
      setDialogOpen(false);
      setOtp('');
    }
  };

  const handleRegisterPasskey = () => {
    setPasskeyName('');
    setPasskeyNameDialogOpen(true);
  };

  const handleConfirmRegisterPasskey = async () => {
    setPasskeyNameDialogOpen(false);
    const success = await registerPasskey(passkeyName || undefined);
    if (success) {
      await fetchUserInfo();
      if (passkeysExpanded) {
        await fetchPasskeys();
      }
    }
  };

  const handlePasskeysToggle = () => {
    const newExpanded = !passkeysExpanded;
    setPasskeysExpanded(newExpanded);
    if (newExpanded) {
      fetchPasskeys();
    }
  };

  const handleConfirmDeletePasskey = async () => {
    if (!selectedPasskey) return;
    const success = await deletePasskey(selectedPasskey.id);
    if (success) {
      setSelectedPasskey(null);
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    const iconProps = { sx: { fontSize: 28 } };
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return <DesktopIcon {...iconProps} />;
      case 'mobile':
        return <MobileIcon {...iconProps} />;
      case 'tablet':
        return <TabletIcon {...iconProps} />;
      default:
        return <UnknownDeviceIcon {...iconProps} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const normalized = /Z|[+-]\d{2}:\d{2}$/.test(dateString) ? dateString : dateString + 'Z';
    const date = new Date(normalized);
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  const handleViewDetails = async (session: AuthorizationSession) => {
    setDetailsSession(session);
    setLocationData(null);

    if (session.ipAddress) {
      setLoadingLocation(true);
      try {
        const location = await geolocationService.getLocationByIP(session.ipAddress);
        setLocationData(location);
      } catch (err) {
        console.error('Failed to load location:', err);
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  const handleCloseDetails = () => {
    setDetailsSession(null);
    setLocationData(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          position: 'relative',
        }}
      >
        <BackgroundGradient />
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <ProfileSkeletonLoader />
        </Box>
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          position: 'relative',
        }}
      >
        <BackgroundGradient />
        <GlassCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            {error || t('auth.profile.loadFailed')}
          </Typography>
          <GlassButton sx={{ mt: 3 }} onClick={() => navigate(ROUTES.LOGIN)}>
            {t('auth.profile.backToLogin')}
          </GlassButton>
        </GlassCard>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1.5, sm: 3 },
        position: 'relative',
      }}
    >
      <BackgroundGradient />

      {/* Session Revoke Confirmation Dialog - HIDDEN */}

      <Dialog
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
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
            background: theme.gradients.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('auth.profile.revokeSession')}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('auth.profile.revokeSessionConfirm')}
          </Typography>
          {selectedSession && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: theme.colors.glass.background,
                border: `1px solid ${theme.colors.glass.border}`,
              }}
            >
              <Typography variant="body2" color="text.primary">
                <strong>{t('auth.profile.device')}:</strong>{' '}
                {selectedSession.deviceName || selectedSession.deviceType || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>{t('auth.profile.ipAddress')}:</strong> {selectedSession.ipAddress || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.primary">
                <strong>{t('auth.profile.created')}:</strong>{' '}
                {formatDate(selectedSession.creationDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlassButton
            gradient={false}
            onClick={() => setSelectedSession(null)}
            disabled={revoking}
          >
            {t('common.cancel')}
          </GlassButton>
          <GlassButton onClick={handleConfirmRevoke} loading={revoking}>
            {t('common.revoke')}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* Phone Verification Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
            background: theme.gradients.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('auth.profile.phoneVerification.title')}
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('auth.profile.phoneVerification.subtitle', { phone: user.phoneNumber })}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="tel"
              shouldAutoFocus
              renderSeparator={<span style={{ width: '12px' }} />}
              renderInput={(props) => (
                <motion.input
                  {...props}
                  whileFocus={{ scale: 1.1 }}
                  style={{
                    width: '48px',
                    height: '56px',
                    fontSize: '24px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.colors.glass.border}`,
                    background: theme.colors.glass.background,
                    backdropFilter: `blur(${theme.colors.glass.blur})`,
                    textAlign: 'center',
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlassButton gradient={false} onClick={() => setDialogOpen(false)}>
            {t('auth.profile.phoneVerification.cancel')}
          </GlassButton>
          <GlassButton onClick={handleVerifyPhone} loading={verifying} disabled={otp.length !== 6}>
            {t('auth.profile.phoneVerification.confirm')}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* Passkey Delete Confirmation Dialog */}
      <Dialog
        open={!!selectedPasskey}
        onClose={() => setSelectedPasskey(null)}
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
            background: theme.gradients.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('auth.profile.deletePasskey')}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t('auth.profile.passkeys.deleteConfirm')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlassButton
            gradient={false}
            onClick={() => setSelectedPasskey(null)}
            disabled={isDeletingPasskey}
          >
            {t('common.cancel')}
          </GlassButton>
          <GlassButton
            onClick={handleConfirmDeletePasskey}
            loading={isDeletingPasskey}
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.2)',
              },
            }}
          >
            {t('auth.profile.deletePasskey')}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* Passkey Name Dialog */}
      <Dialog
        open={passkeyNameDialogOpen}
        onClose={() => setPasskeyNameDialogOpen(false)}
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
            background: theme.gradients.button,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          {t('auth.profile.passkeys.namePromptTitle')}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('auth.profile.passkeys.namePromptSubtitle')}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            value={passkeyName}
            onChange={(e) => setPasskeyName(e.target.value)}
            placeholder={t('auth.profile.passkeys.namePlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmRegisterPasskey();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: theme.colors.glass.background,
                '& fieldset': {
                  borderColor: theme.colors.glass.border,
                },
                '&:hover fieldset': {
                  borderColor: theme.colors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.colors.primary,
                },
              },
              '& .MuiInputBase-input': {
                color: theme.colors.text.primary,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlassButton gradient={false} onClick={() => setPasskeyNameDialogOpen(false)}>
            {t('common.cancel')}
          </GlassButton>
          <GlassButton onClick={handleConfirmRegisterPasskey}>
            {t('auth.profile.registerPasskey')}
          </GlassButton>
        </DialogActions>
      </Dialog>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <GlassCard glowOnHover sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Avatar and Name */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 4 } }}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: { xs: 80, sm: 120 },
                  margin: '0 auto',
                  mb: { xs: 1.5, sm: 3 },
                  borderRadius: '50%',
                  background: theme.gradients.button,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: '32px', sm: '48px' },
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: `0 0 40px ${theme.colors.primary}60`,
                  cursor: 'pointer',
                }}
              >
                {user.firstName?.[0]?.toUpperCase() || (
                  <AccountCircleIcon sx={{ fontSize: { xs: 44, sm: 64 } }} />
                )}
              </Box>

              {/* Name Swap Animation */}
              <Box
                sx={{
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <AnimatePresence mode="wait">
                  {!hovered ? (
                    <motion.div
                      key="fullname"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: '1.35rem', sm: '2.125rem' },
                          background: theme.gradients.button,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="username"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: '1.35rem', sm: '2.125rem' },
                          background: theme.gradients.button,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {user.userName}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {user.email}
                </Typography>
                {user.emailConfirmed ? (
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color: theme.colors.accent,
                        filter: 'drop-shadow(0 0 8px currentColor)',
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Cancel sx={{ fontSize: 20, color: '#ef4444' }} />
                  </motion.div>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {user.phoneNumber}
                </Typography>
                {user.phoneNumberConfirmed ? (
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <CheckCircle
                      sx={{
                        fontSize: 20,
                        color: theme.colors.accent,
                        filter: 'drop-shadow(0 0 8px currentColor)',
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Cancel sx={{ fontSize: 20, color: '#ef4444' }} />
                  </motion.div>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Active Sessions Section - HIDDEN */}

          <Divider
            sx={{
              my: { xs: 2, sm: 4 },
              borderColor: theme.colors.glass.border,
              opacity: 0.5,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  cursor: 'pointer',
                }}
                onClick={() => setSessionsExpanded(!sessionsExpanded)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DevicesIcon sx={{ color: theme.colors.primary }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {t('auth.profile.activeSessions')}
                  </Typography>
                  <Chip
                    label={sessions.length}
                    size="small"
                    sx={{
                      background: theme.gradients.button,
                      color: '#fff',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    transform: sessionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              <Collapse in={sessionsExpanded}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                  {sessionsLoading ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {t('common.loading') || 'Loading...'}
                    </Typography>
                  ) : sessions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {t('auth.profile.noActiveSessions')}
                    </Typography>
                  ) : (
                    sessions.slice(0, 3).map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: theme.colors.glass.background,
                            border: `1px solid ${theme.colors.glass.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: theme.colors.primary,
                              boxShadow: `0 0 20px ${theme.colors.primary}40`,
                            },
                          }}
                          onClick={() => handleViewDetails(session)}
                        >
                          <Box sx={{ color: theme.colors.primary }}>
                            {getDeviceIcon(session.deviceType)}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                              noWrap
                            >
                              {session.deviceName || session.deviceType || 'Unknown Device'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {session.ipAddress} • {formatDate(session.creationDate)}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(session);
                            }}
                            sx={{
                              color: theme.colors.primary,
                              '&:hover': {
                                backgroundColor: `${theme.colors.primary}20`,
                              },
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRevokeClick(session);
                            }}
                            sx={{
                              color: theme.colors.accent,
                              '&:hover': {
                                backgroundColor: `${theme.colors.accent}20`,
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))
                  )}
                </Box>
                {sessions.length > 3 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <GlassButton
                      size="small"
                      gradient={false}
                      onClick={() => setAllSessionsOpen(true)}
                    >
                      {t('common.viewAll')} ({sessions.length})
                    </GlassButton>
                  </Box>
                )}
              </Collapse>
            </Box>
          </motion.div>

          {/* My Passkeys Section */}

          <Divider
            sx={{
              my: 3,
              borderColor: theme.colors.glass.border,
              opacity: 0.5,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  cursor: 'pointer',
                }}
                onClick={handlePasskeysToggle}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FingerprintIcon sx={{ color: theme.colors.primary }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {t('auth.profile.passkeys.title')}
                  </Typography>
                  <Chip
                    label={passkeys.length}
                    size="small"
                    sx={{
                      background: theme.gradients.button,
                      color: '#fff',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    transform: passkeysExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>

              <Collapse in={passkeysExpanded}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                  {isLoadingPasskeys ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {t('common.loading') || 'Loading...'}
                    </Typography>
                  ) : passkeys.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {t('auth.profile.passkeys.noPasskeys')}
                    </Typography>
                  ) : (
                    passkeys.map((passkey) => (
                      <motion.div
                        key={passkey.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: theme.colors.glass.background,
                            border: `1px solid ${theme.colors.glass.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: theme.colors.primary,
                              boxShadow: `0 0 20px ${theme.colors.primary}40`,
                            },
                          }}
                        >
                          <Box sx={{ color: theme.colors.primary }}>
                            <FingerprintIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                              noWrap
                            >
                              {passkey.authenticatorDescription || 'Passkey'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {t('auth.profile.passkeys.registeredOn')}{' '}
                              {formatDate(passkey.registrationDate)}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => setSelectedPasskey(passkey)}
                            sx={{
                              color: theme.colors.accent,
                              '&:hover': {
                                backgroundColor: `${theme.colors.accent}20`,
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))
                  )}
                </Box>
              </Collapse>
            </Box>
          </motion.div>

          <Divider
            sx={{
              my: 3,
              borderColor: theme.colors.glass.border,
              opacity: 0.5,
            }}
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!user.phoneNumberConfirmed && (
                <GlassButton
                  fullWidth
                  onClick={handlePhoneConfirmation}
                  loading={sendingCode}
                  startIcon={<PhoneIcon />}
                >
                  {t('auth.profile.confirmPhone')}
                </GlassButton>
              )}

              <GlassButton
                fullWidth
                onClick={handleRegisterPasskey}
                loading={isRegistering}
                startIcon={<FingerprintIcon />}
              >
                {t('auth.profile.registerPasskey')}
              </GlassButton>

              <GlassButton
                fullWidth
                gradient={false}
                onClick={() => navigate(ROUTES.DEVICES)}
                startIcon={<DevicesIcon />}
              >
                {t('auth.profile.myDevices') || 'My Devices'}
              </GlassButton>

              <GlassButton
                fullWidth
                gradient={false}
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  '&:hover': {
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                  },
                }}
              >
                {t('auth.profile.logout')}
              </GlassButton>
            </Box>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Session Details Dialog - HIDDEN */}
      {/* All Sessions Dialog - HIDDEN */}

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
            {t('auth.profile.sessionDetails')}
          </Typography>
          <IconButton onClick={handleCloseDetails} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detailsSession && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ color: theme.colors.primary, fontSize: 64 }}>
                  {getDeviceIcon(detailsSession.deviceType)}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('auth.profile.device')}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {detailsSession.deviceName || detailsSession.deviceType || 'Unknown Device'}
                </Typography>
              </Box>

              {detailsSession.deviceName?.includes('Chrome') && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('auth.profile.browser')}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {detailsSession.deviceName.split(' on ')[0]}
                  </Typography>
                </Box>
              )}

              {detailsSession.deviceName?.includes(' on ') && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('auth.profile.operatingSystem')}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {detailsSession.deviceName.split(' on ')[1]}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('auth.profile.ipAddress')}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {detailsSession.ipAddress || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <LocationIcon fontSize="small" />
                  {t('auth.profile.location')}
                </Typography>
                {loadingLocation ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.profile.loadingLocation')}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="text.primary">
                    {geolocationService.formatLocation(locationData)}
                  </Typography>
                )}
                {locationData && locationData.city && (
                  <Typography variant="caption" color="text.secondary">
                    {locationData.timezone}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('auth.profile.created')}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {formatDate(detailsSession.creationDate)}
                </Typography>
              </Box>

              {detailsSession.clientId && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('auth.profile.client')}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {detailsSession.clientId}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <GlassButton gradient={false} onClick={handleCloseDetails}>
            {t('common.close')}
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
              {t('common.revoke')}
            </GlassButton>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={allSessionsOpen}
        onClose={() => setAllSessionsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.colors.glass.background,
            backdropFilter: `blur(${theme.colors.glass.blur})`,
            border: `1px solid ${theme.colors.glass.border}`,
            borderRadius: '20px',
            boxShadow: theme.colors.glass.shadow,
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.colors.glass.border}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DevicesIcon sx={{ color: theme.colors.primary }} />
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
              {t('auth.profile.allSessions')}
            </Typography>
            <Chip
              label={sessions.length}
              size="small"
              sx={{
                background: theme.gradients.button,
                color: '#fff',
                fontWeight: 600,
              }}
            />
          </Box>
          <IconButton onClick={() => setAllSessionsOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: theme.colors.glass.background,
                    border: `1px solid ${theme.colors.glass.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.colors.primary,
                      boxShadow: `0 0 20px ${theme.colors.primary}40`,
                    },
                  }}
                  onClick={() => {
                    setAllSessionsOpen(false);
                    handleViewDetails(session);
                  }}
                >
                  <Box sx={{ color: theme.colors.primary }}>
                    {getDeviceIcon(session.deviceType)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
                      {session.deviceName || session.deviceType || 'Unknown Device'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {session.ipAddress} • {formatDate(session.creationDate)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAllSessionsOpen(false);
                      handleViewDetails(session);
                    }}
                    sx={{
                      color: theme.colors.primary,
                      '&:hover': {
                        backgroundColor: `${theme.colors.primary}20`,
                      },
                    }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAllSessionsOpen(false);
                      handleRevokeClick(session);
                    }}
                    sx={{
                      color: theme.colors.accent,
                      '&:hover': {
                        backgroundColor: `${theme.colors.accent}20`,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </motion.div>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4, opacity: 0.6 }}
        >
          {t('auth.profile.footer', { year: new Date().getFullYear() })}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Profile;
