import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import OtpInput from 'react-otp-input';
import { authService } from '../../../services/authService';
import { GlassButton } from '../../glass/GlassButton';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';

interface LoginTwoFaVerifyProps {
  id: string;
  onSuccess: () => void;
}

const LoginTwoFaVerify: React.FC<LoginTwoFaVerifyProps> = ({ id, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError(t('auth.twoFaVerify.codeRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyLoginTwoFa(id, otp);
      if (response.data.status === 'Success') {
        onSuccess();
      } else {
        setError(t('auth.twoFaVerify.invalidCode'));
      }
    } catch (err) {
      console.error(err);
      setError(t('auth.twoFaVerify.verificationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        {t('auth.twoFaVerify.subtitle')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        </motion.div>
      )}

      <GlassButton
        variant="contained"
        fullWidth
        onClick={handleVerify}
        loading={loading}
        disabled={otp.length !== 6}
      >
        {t('auth.twoFaVerify.verifyButton')}
      </GlassButton>
    </Box>
  );
};

export default LoginTwoFaVerify;
