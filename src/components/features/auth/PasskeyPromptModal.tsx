import { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Fingerprint as FingerprintIcon, Check as CheckIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton } from '../../glass/GlassButton';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { usePasskey } from '../../../hooks/usePasskey';

function getSystemPasskeyName(): string {
  const ua = navigator.userAgent;
  const hostname = window.location.hostname;
  let os = '';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/Mac/.test(ua)) os = 'Mac';
  else if (/Linux/.test(ua)) os = 'Linux';
  return os ? `${hostname} (${os})` : hostname;
}

interface PasskeyPromptModalProps {
  onDone: () => void;
}

export const PasskeyPromptModal: React.FC<PasskeyPromptModalProps> = ({ onDone }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { registerPasskey, isRegistering } = usePasskey();
  const [succeeded, setSucceeded] = useState(false);

  const handleAdd = async () => {
    const ok = await registerPasskey(getSystemPasskeyName());
    if (ok) {
      setSucceeded(true);
      setTimeout(onDone, 1200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          background: '#ffffff',
          border: `1.5px solid ${theme.colors.glass.border}`,
          boxShadow: `0 24px 64px ${theme.colors.glass.shadow}`,
          borderRadius: 24,
          padding: '40px 36px',
          maxWidth: 380,
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {succeeded ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: `${theme.colors.primary}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckIcon sx={{ fontSize: 40, color: theme.colors.primary }} />
              </Box>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: theme.colors.primary, textAlign: 'center' }}
              >
                {t('passkeyPrompt.success')}
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `${theme.colors.primary}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <FingerprintIcon
                    sx={{
                      fontSize: 48,
                      color: theme.colors.primary,
                      filter: `drop-shadow(0 0 8px ${theme.colors.primary}60)`,
                    }}
                  />
                </Box>
              </motion.div>

              {/* Text */}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: theme.colors.primary, mb: 1, textAlign: 'center' }}
              >
                {t('passkeyPrompt.title')}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: `${theme.colors.primary}99`,
                  textAlign: 'center',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                {t('passkeyPrompt.subtitle')}
              </Typography>

              {/* Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                <GlassButton fullWidth onClick={handleAdd} disabled={isRegistering} gradient>
                  {isRegistering ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: '#fff' }} />
                      {t('passkeyPrompt.adding')}
                    </Box>
                  ) : (
                    t('passkeyPrompt.add')
                  )}
                </GlassButton>

                <GlassButton
                  fullWidth
                  onClick={onDone}
                  disabled={isRegistering}
                  gradient={false}
                  sx={{
                    color: `${theme.colors.primary}80`,
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                    '&:hover': { background: `${theme.colors.primary}08` },
                  }}
                >
                  {t('passkeyPrompt.skip')}
                </GlassButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
