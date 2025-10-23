import React, { useState } from 'react';
import { Typography } from '@mui/material';
import OtpInput from 'react-otp-input';
import { authService } from '../../../services/authService';
import { LoadingButton } from '../../common';

interface LoginTwoFaVerifyProps {
  id: string;
  onSuccess: () => void;
}

/**
 * OTP verification component for 2FA login
 */
const LoginTwoFaVerify: React.FC<LoginTwoFaVerifyProps> = ({ id, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyLoginTwoFa(id, otp);
      if (response.data.status === 'Success') {
        onSuccess();
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Typography variant="body2" color="text.secondary" align="center">
        Enter the 6-digit code sent to your device
      </Typography>
      <div className="flex justify-center">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="tel"
          shouldAutoFocus
          renderSeparator={<span style={{ width: '8px' }} />}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: '40px',
                height: '50px',
                fontSize: '20px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                textAlign: 'center',
              }}
            />
          )}
        />
      </div>
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
      <LoadingButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleVerify}
        loading={loading}
        disabled={otp.length !== 6}
        sx={{ borderRadius: 2 }}
      >
        Verify
      </LoadingButton>
    </div>
  );
};

export default LoginTwoFaVerify;
