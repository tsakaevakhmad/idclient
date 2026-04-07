import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { accountSettingsService } from '../../../services/accountSettingsService';
import { ROUTES } from '../../../constants';

const EmailChangeConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const userId = searchParams.get('userId');
    const newEmail = searchParams.get('newEmail');
    const token = searchParams.get('token');

    if (!userId || !newEmail || !token) {
      setStatus('error');
      return;
    }

    accountSettingsService
      .confirmEmailChange(userId, newEmail, token)
      .then((success) => setStatus(success ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'loading') {
    return <LoadingSpinner message={t('common.loading')} />;
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
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <GlassCard sx={{ p: 5, textAlign: 'center' }}>
          {status === 'success' ? (
            <>
              <CheckCircle
                sx={{
                  fontSize: 64,
                  mb: 2,
                  color: theme.colors.accent,
                  filter: `drop-shadow(0 0 16px ${theme.colors.accent})`,
                }}
              />
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
                {t('accountSettings.confirmEmailChange.successTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t('accountSettings.confirmEmailChange.successSubtitle')}
              </Typography>
            </>
          ) : (
            <>
              <ErrorOutline sx={{ fontSize: 64, mb: 2, color: '#ef4444' }} />
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
                {t('accountSettings.confirmEmailChange.errorTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t('accountSettings.confirmEmailChange.errorSubtitle')}
              </Typography>
            </>
          )}
          <GlassButton fullWidth onClick={() => navigate(ROUTES.PROFILE)}>
            {t('common.backToProfile')}
          </GlassButton>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default EmailChangeConfirm;
