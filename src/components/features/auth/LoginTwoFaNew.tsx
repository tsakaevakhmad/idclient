import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../../../services/authService';
import { GlassInput } from '../../glass/GlassInput';
import { GlassButton } from '../../glass/GlassButton';
import LoginTwoFaVerify from './LoginTwoFaVerifyNew';

interface LoginTwoFaProps {
  onSuccess: () => void;
}

const LoginTwoFa: React.FC<LoginTwoFaProps> = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [verifyId, setVerifyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter email or phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.loginTwoFa(identifier);
      setVerifyId(response.data.id);
    } catch (err) {
      console.error(err);
      setError('Failed to send verification code');
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
        label="Email or Phone"
        variant="outlined"
        fullWidth
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 3 }}
      />
      <GlassButton type="submit" variant="contained" fullWidth loading={loading}>
        Continue
      </GlassButton>
    </motion.form>
  );
};

export default LoginTwoFa;
