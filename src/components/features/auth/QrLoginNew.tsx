import { Typography, Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { useQRLogin } from '../../../hooks/useQRLogin';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';

interface QrLoginProps {
  onSuccess: () => void;
}

const QrLogin: React.FC<QrLoginProps> = ({ onSuccess }) => {
  const { sessionId, status, isLoading, isAuthenticating } = useQRLogin(onSuccess);
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ width: '100%' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {t('auth.qr.subtitle')}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            minHeight: 240,
          }}
        >
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress
                size={60}
                sx={{
                  color: theme.colors.primary,
                  filter: `drop-shadow(0 0 12px ${theme.colors.primary})`,
                }}
              />
            </motion.div>
          ) : sessionId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                padding: '20px',
                borderRadius: '20px',
                background: theme.colors.glass.background,
                backdropFilter: `blur(${theme.colors.glass.blur})`,
                border: `2px solid ${theme.colors.glass.border}`,
                boxShadow: theme.colors.glass.shadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAuthenticating ? (
                <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                  <CircularProgress
                    size={200}
                    sx={{
                      color: theme.colors.primary,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      filter: `drop-shadow(0 0 20px ${theme.colors.primary})`,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {t('auth.twoFaVerify.authenticating')}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <motion.div
                  animate={{
                    boxShadow: [
                      `0 0 20px ${theme.colors.primary}40`,
                      `0 0 40px ${theme.colors.primary}60`,
                      `0 0 20px ${theme.colors.primary}40`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#fff',
                  }}
                >
                  <QRCode value={sessionId} size={200} />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <Typography variant="body2" color="error" align="center">
              {status}
            </Typography>
          )}
        </Box>

        {sessionId && !isAuthenticating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                px: 2,
                py: 1,
                borderRadius: '12px',
                background: theme.colors.glass.background,
                border: `1px solid ${theme.colors.glass.border}`,
              }}
            >
              {status}
            </Typography>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default QrLogin;
