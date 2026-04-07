import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Typography,
  Box,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle,
  Cancel,
  ArrowBack as BackIcon,
  Settings as SettingsIcon,
  Fingerprint as FingerprintIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Devices as DevicesIcon,
} from '@mui/icons-material';
import { useUser } from '../../../hooks/useUser';
import { usePasskey } from '../../../hooks/usePasskey';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { ProfileSkeletonLoader } from '../../animations/SkeletonLoader';
import { PasskeyPromptModal } from '../auth/PasskeyPromptModal';
import { ChangeEmailDialog } from './ChangeEmailDialog';
import { ChangePhoneDialog } from './ChangePhoneDialog';
import { ROUTES } from '../../../constants';
import { FidoCredentialDto } from '../../../api/types';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, fetchUserInfo } = useUser();
  const {
    isRegistering,
    passkeys,
    isLoadingPasskeys,
    isDeletingPasskey,
    fetchPasskeys,
    deletePasskey,
  } = usePasskey();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passkeysExpanded, setPasskeysExpanded] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<FidoCredentialDto | null>(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);

  useEffect(() => {
    fetchUserInfo().catch(() => navigate(ROUTES.LOGIN));
  }, [fetchUserInfo, navigate]);

  const handlePhoneSuccess = async () => {
    await fetchUserInfo();
    setSuccessMessage(t('accountSettings.phoneChanged'));
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handlePasskeysToggle = () => {
    const next = !passkeysExpanded;
    setPasskeysExpanded(next);
    if (next) fetchPasskeys();
  };

  const handlePasskeyModalDone = async () => {
    setShowPasskeyModal(false);
    await fetchUserInfo();
    if (passkeysExpanded) await fetchPasskeys();
  };

  const handleConfirmDeletePasskey = async () => {
    if (!selectedPasskey) return;
    const success = await deletePasskey(selectedPasskey.id);
    if (success) setSelectedPasskey(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const normalized = /Z|[+-]\d{2}:\d{2}$/.test(dateString) ? dateString : dateString + 'Z';
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(normalized));
  };

  const dialogPaperSx = {
    background: theme.colors.glass.background,
    backdropFilter: `blur(${theme.colors.glass.blur})`,
    border: `1px solid ${theme.colors.glass.border}`,
    borderRadius: '20px',
    boxShadow: theme.colors.glass.shadow,
  };

  const dialogTitleSx = {
    background: theme.gradients.button,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
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
        <Box sx={{ width: '100%', maxWidth: 560 }}>
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

      <AnimatePresence>
        {showPasskeyModal && <PasskeyPromptModal onDone={handlePasskeyModalDone} />}
      </AnimatePresence>

      <ChangeEmailDialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} />
      <ChangePhoneDialog
        open={phoneDialogOpen}
        onClose={() => setPhoneDialogOpen(false)}
        onSuccess={handlePhoneSuccess}
      />

      {/* Passkey Delete Dialog */}
      <Dialog
        open={!!selectedPasskey}
        onClose={() => setSelectedPasskey(null)}
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle sx={dialogTitleSx}>{t('auth.profile.deletePasskey')}</DialogTitle>
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
              '&:hover': { background: 'rgba(239, 68, 68, 0.2)' },
            }}
          >
            {t('auth.profile.deletePasskey')}
          </GlassButton>
        </DialogActions>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 560 }}
      >
        <GlassCard glowOnHover sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <SettingsIcon sx={{ color: theme.colors.primary, fontSize: 28 }} />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  background: theme.gradients.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('accountSettings.title')}
              </Typography>
            </Box>
          </motion.div>

          {successMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {successMessage}
              </Alert>
            </motion.div>
          )}

          {/* Email */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.colors.glass.border}`,
                background: theme.colors.glass.background,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                  <EmailIcon sx={{ color: theme.colors.primary, mt: 0.25, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {t('accountSettings.email')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ wordBreak: 'break-all' }}>
                        {user.email}
                      </Typography>
                      {user.emailConfirmed
                        ? <CheckCircle sx={{ fontSize: 16, color: theme.colors.accent, flexShrink: 0 }} />
                        : <Cancel sx={{ fontSize: 16, color: '#ef4444', flexShrink: 0 }} />}
                    </Box>
                  </Box>
                </Box>
                <GlassButton size="small" onClick={() => setEmailDialogOpen(true)} sx={{ flexShrink: 0 }}>
                  {t('accountSettings.change')}
                </GlassButton>
              </Box>
            </Box>
          </motion.div>

          {/* Phone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.colors.glass.border}`,
                background: theme.colors.glass.background,
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                  <PhoneIcon sx={{ color: theme.colors.primary, mt: 0.25, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {t('accountSettings.phone')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {user.phoneNumber || '—'}
                      </Typography>
                      {user.phoneNumber && (
                        user.phoneNumberConfirmed
                          ? <CheckCircle sx={{ fontSize: 16, color: theme.colors.accent, flexShrink: 0 }} />
                          : <Cancel sx={{ fontSize: 16, color: '#ef4444', flexShrink: 0 }} />
                      )}
                    </Box>
                  </Box>
                </Box>
                <GlassButton size="small" onClick={() => setPhoneDialogOpen(true)} sx={{ flexShrink: 0 }}>
                  {t('accountSettings.change')}
                </GlassButton>
              </Box>
            </Box>
          </motion.div>

          <Divider sx={{ mb: 3, borderColor: theme.colors.glass.border, opacity: 0.5 }} />

          {/* Passkeys Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
                      {t('common.loading')}
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
                            <Typography variant="body2" fontWeight={600} color="text.primary" noWrap>
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
                              '&:hover': { backgroundColor: `${theme.colors.accent}20` },
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

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <GlassButton
                fullWidth
                onClick={() => setShowPasskeyModal(true)}
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
                {t('auth.profile.myDevices')}
              </GlassButton>

              <Divider sx={{ borderColor: theme.colors.glass.border, opacity: 0.5 }} />

              <GlassButton
                fullWidth
                gradient={false}
                startIcon={<BackIcon />}
                onClick={() => navigate(ROUTES.PROFILE)}
              >
                {t('common.backToProfile')}
              </GlassButton>
            </Box>
          </motion.div>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default AccountSettings;
