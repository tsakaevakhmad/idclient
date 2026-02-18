import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePasskey } from '../../../hooks/usePasskey';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { useSettings } from '../../../contexts/SettingsContext';
import { getOAuthRedirectUrl } from '../../../utils';
import { AuthMethod } from '../../../types';
import { ROUTES } from '../../../constants';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import LoginTwoFa from './LoginTwoFaNew';
import QrLogin from './QrLoginNew';
import {
  Login as LoginIcon,
  Fingerprint as FingerprintIcon,
  QrCode2 as QrCodeIcon,
} from '@mui/icons-material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, externalProviders, login, loadExternalProviders } = useAuth();
  const { loginWithPasskey } = usePasskey();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('2FA');
  const rawSearch = new URLSearchParams(window.location.search);
  rawSearch.delete('session_revoked');
  const params = rawSearch.toString();

  useEffect(() => {
    loadExternalProviders(params);
  }, [loadExternalProviders, params]);

  useEffect(() => {
    if (isAuthenticated) {
      if (params) {
        window.location.href = getOAuthRedirectUrl(params);
      } else {
        navigate(ROUTES.PROFILE);
      }
    }
  }, [isAuthenticated, navigate, params]);

  const handleSuccess = () => {
    login();
  };

  const handlePasskeyLogin = async () => {
    const success = await loginWithPasskey();
    if (success) {
      handleSuccess();
    }
  };

  let loginComponent: React.ReactNode;
  switch (authMethod) {
    case 'PassKey':
      loginComponent = null;
      break;
    case 'QR':
      loginComponent = <QrLogin onSuccess={handleSuccess} />;
      break;
    default:
      loginComponent = <LoginTwoFa onSuccess={handleSuccess} />;
  }

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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <GlassCard
          glowOnHover
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
          }}
        >
          {/* Logo/Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 2, sm: 4 } }}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <LoginIcon
                  sx={{
                    fontSize: { xs: 44, sm: 64 },
                    color: theme.colors.primary,
                    filter: `drop-shadow(0 0 20px ${theme.colors.primary}80)`,
                    mb: { xs: 1, sm: 2 },
                  }}
                />
              </motion.div>
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.35rem', sm: '2.125rem' },
                  background: theme.gradients.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                {t('auth.login.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('auth.login.subtitle')}
              </Typography>
            </Box>
          </motion.div>

          {/* Auth Method Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ButtonGroup
              fullWidth
              variant="outlined"
              sx={{
                mb: 4,
                '& .MuiButton-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '12px 16px',
                  background: theme.colors.glass.background,
                  backdropFilter: `blur(${theme.colors.glass.blur})`,
                  border: `1px solid ${theme.colors.glass.border}`,
                  color: theme.colors.text.secondary,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme.colors.glass.background,
                    border: `1px solid ${theme.colors.primary}`,
                    transform: 'translateY(-2px)',
                  },
                },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  flex: 1,
                }}
              >
                <Box
                  onClick={() => setAuthMethod('2FA')}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    background: authMethod === '2FA' ? theme.gradients.button : 'transparent',
                    color: authMethod === '2FA' ? '#fff' : theme.colors.text.secondary,
                    borderRadius: '12px 0 0 12px',
                    cursor: 'pointer',
                    ...(authMethod === '2FA' && {
                      boxShadow: `0 0 20px ${theme.colors.primary}40`,
                    }),
                  }}
                >
                  <LoginIcon fontSize="small" />
                  <span>{t('auth.login.methods.2fa')}</span>
                </Box>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  flex: 1,
                }}
              >
                <Box
                  onClick={handlePasskeyLogin}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    background: authMethod === 'PassKey' ? theme.gradients.button : 'transparent',
                    color: authMethod === 'PassKey' ? '#fff' : theme.colors.text.secondary,
                    cursor: 'pointer',
                    ...(authMethod === 'PassKey' && {
                      boxShadow: `0 0 20px ${theme.colors.primary}40`,
                    }),
                  }}
                >
                  <FingerprintIcon fontSize="small" />
                  <span>{t('auth.login.methods.passkey')}</span>
                </Box>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  flex: 1,
                }}
              >
                <Box
                  onClick={() => setAuthMethod('QR')}
                  sx={{
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    background: authMethod === 'QR' ? theme.gradients.button : 'transparent',
                    color: authMethod === 'QR' ? '#fff' : theme.colors.text.secondary,
                    borderRadius: '0 12px 12px 0',
                    cursor: 'pointer',
                    ...(authMethod === 'QR' && {
                      boxShadow: `0 0 20px ${theme.colors.primary}40`,
                    }),
                  }}
                >
                  <QrCodeIcon fontSize="small" />
                  <span>{t('auth.login.methods.qr')}</span>
                </Box>
              </motion.button>
            </ButtonGroup>
          </motion.div>

          {/* Auth Method Component */}
          {authMethod !== 'PassKey' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={authMethod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {loginComponent}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Registration Link */}
          {settings?.registrationEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Link
                  to={ROUTES.REGISTRATION}
                  style={{
                    textDecoration: 'none',
                    color: theme.colors.primary,
                    fontWeight: '600',
                    fontSize: '0.95rem',
                  }}
                >
                  <motion.span whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
                    {t('auth.login.noAccount')} →
                  </motion.span>
                </Link>
              </Box>
            </motion.div>
          )}

          {/* External Providers */}
          {externalProviders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  {t('auth.login.orContinueWith')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {externalProviders.map((provider, index) => (
                    <motion.div
                      key={provider.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <GlassButton
                        fullWidth
                        gradient={false}
                        onClick={() => (window.location.href = provider.url)}
                      >
                        {provider.displayName || provider.name}
                      </GlassButton>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default Login;
