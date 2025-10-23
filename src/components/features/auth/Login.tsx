import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Card, CardContent, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePasskey } from '../../../hooks/usePasskey';
import { getOAuthRedirectUrl } from '../../../utils';
import { AuthMethod } from '../../../types';
import { ROUTES } from '../../../constants';
import LoginTwoFa from './LoginTwoFa';
import QrLogin from './QrLogin';

/**
 * Main login page with multiple authentication methods
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, externalProviders, login, loadExternalProviders } = useAuth();
  const { loginWithPasskey } = usePasskey();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('2FA');
  const params = window.location.search.slice(1);

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
      loginComponent = null; // Passkey is handled directly via button click
      break;
    case 'QR':
      loginComponent = <QrLogin onSuccess={handleSuccess} />;
      break;
    default:
      loginComponent = <LoginTwoFa onSuccess={handleSuccess} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gray-50"
    >
      <Card className="shadow-xl rounded-2xl w-full max-w-md">
        <CardContent className="flex flex-col items-center p-8 gap-6">
          <Typography variant="h4" fontWeight="bold" color="primary">
            Sign In
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center">
            Choose your authentication method
          </Typography>

          <ButtonGroup
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              '& .MuiButton-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '10px 0',
              },
            }}
          >
            <Button
              variant={authMethod === '2FA' ? 'contained' : 'outlined'}
              onClick={() => setAuthMethod('2FA')}
            >
              2FA
            </Button>
            <Button
              variant={authMethod === 'PassKey' ? 'contained' : 'outlined'}
              onClick={handlePasskeyLogin}
            >
              PassKey
            </Button>
            <Button
              variant={authMethod === 'QR' ? 'contained' : 'outlined'}
              onClick={() => setAuthMethod('QR')}
            >
              QR
            </Button>
          </ButtonGroup>

          {authMethod !== 'PassKey' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={authMethod}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full mt-4"
              >
                {loginComponent}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="w-full mt-4">
            <Link
              to={ROUTES.REGISTRATION}
              style={{
                textDecoration: 'none',
                color: '#1976d2',
                fontWeight: '500',
                textAlign: 'end',
                display: 'block',
              }}
            >
              Register
            </Link>
          </div>

          {externalProviders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="w-full mt-6"
            >
              <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
                Or sign in with
              </Typography>
              <div className="flex flex-col gap-3">
                {externalProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outlined"
                    fullWidth
                    onClick={() => (window.location.href = provider.url)}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {provider.displayName || provider.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Login;
