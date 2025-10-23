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
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccountCircle as AccountCircleIcon,
  Fingerprint as FingerprintIcon,
  PhoneAndroid as PhoneIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import OtpInput from 'react-otp-input';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { usePasskey } from '../../../hooks/usePasskey';
import { useTheme } from '../../../hooks/useTheme';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { ProfileSkeletonLoader } from '../../animations/SkeletonLoader';
import { ROUTES } from '../../../constants';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, isLoading, error, fetchUserInfo, sendPhoneVerificationCode, verifyPhoneCode } =
    useUser();
  const { isRegistering, registerPasskey } = usePasskey();
  const { theme } = useTheme();

  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

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

  const handleRegisterPasskey = async () => {
    const success = await registerPasskey();
    if (success) {
      await fetchUserInfo();
    }
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
            {error || 'Failed to load user data'}
          </Typography>
          <GlassButton sx={{ mt: 3 }} onClick={() => navigate(ROUTES.LOGIN)}>
            Back to Login
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
        padding: 3,
        position: 'relative',
      }}
    >
      <BackgroundGradient />

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
          Enter Verification Code
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter the 6-digit code sent to {user.phoneNumber}
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
            Cancel
          </GlassButton>
          <GlassButton onClick={handleVerifyPhone} loading={verifying} disabled={otp.length !== 6}>
            Confirm
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: theme.gradients.button,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: `0 0 40px ${theme.colors.primary}60`,
                  cursor: 'pointer',
                }}
              >
                {user.firstName?.[0]?.toUpperCase() || <AccountCircleIcon sx={{ fontSize: 64 }} />}
              </motion.div>

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
                        variant="h4"
                        fontWeight="bold"
                        sx={{
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
                        variant="h4"
                        fontWeight="bold"
                        sx={{
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
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2,
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

          <Divider
            sx={{
              my: 4,
              borderColor: theme.colors.glass.border,
              opacity: 0.5,
            }}
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!user.phoneNumberConfirmed && (
                <GlassButton
                  fullWidth
                  onClick={handlePhoneConfirmation}
                  loading={sendingCode}
                  startIcon={<PhoneIcon />}
                >
                  Confirm Phone Number
                </GlassButton>
              )}

              <GlassButton
                fullWidth
                onClick={handleRegisterPasskey}
                loading={isRegistering}
                startIcon={<FingerprintIcon />}
              >
                Register Passkey
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
                Logout
              </GlassButton>
            </Box>
          </motion.div>
        </GlassCard>
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4, opacity: 0.6 }}
        >
          © {new Date().getFullYear()} ID. All rights reserved.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Profile;
