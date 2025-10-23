import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { authService } from '../../../services/authService';
import { LoadingButton } from '../../common';
import LoginTwoFaVerify from './LoginTwoFaVerify';

interface LoginTwoFaProps {
  onSuccess: () => void;
}

/**
 * Two-Factor Authentication login component
 */
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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <TextField
        label="Email or Phone"
        variant="standard"
        fullWidth
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        loading={loading}
        sx={{ borderRadius: 2, mt: 2 }}
      >
        Continue
      </LoadingButton>
    </form>
  );
};

export default LoginTwoFa;
