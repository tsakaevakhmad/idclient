import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../../services/authService';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassInput } from '../../glass/GlassInput';
import { GlassButton } from '../../glass/GlassButton';
import LoginTwoFaVerify from './LoginTwoFaVerifyNew';

interface LoginTwoFaProps {
  onSuccess: () => void;
}

const LoginTwoFa: React.FC<LoginTwoFaProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [verifyId, setVerifyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(t('auth.twoFa.enterIdentifier'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.loginTwoFa(identifier);

      // Success statuses that require verification code input
      const successStatuses = [
        'SendedMailConfirmationCode',
        'SendedPhoneNumberConfirmationCode',
        'SendedLoginCodeToEmail',
        'SendedLoginCodeToPhoneNumber',
      ];

      if (successStatuses.includes(response.data.status)) {
        setVerifyId(response.data.id);
        return;
      }

      // All other statuses are errors - show localized message
      setError(t(`auth.twoFa.${response.data.status}`));
    } catch (err) {
      console.error(err);
      setError(t('auth.twoFa.sendCodeFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (verifyId) {
    return <LoginTwoFaVerify id={verifyId} onSuccess={onSuccess} />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ width: '100%' }}
    >
      <GlassInput
        label={t('auth.twoFa.emailOrPhone')}
        variant="outlined"
        fullWidth
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 3 }}
      />
      <GlassButton type="submit" variant="contained" fullWidth loading={loading}>
        {t('auth.twoFa.continueButton')}
      </GlassButton>
    </motion.form>
  );
};

export default LoginTwoFa;
