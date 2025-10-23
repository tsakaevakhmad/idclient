import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import OtpInput from 'react-otp-input';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { usePasskey } from '../../../hooks/usePasskey';
import { LoadingSpinner, LoadingButton } from '../../common';
import { ROUTES } from '../../../constants';

/**
 * User profile page with passkey registration and phone verification
 */
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, isLoading, error, fetchUserInfo, sendPhoneVerificationCode, verifyPhoneCode } =
    useUser();
  const { isRegistering, registerPasskey } = usePasskey();

  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await fetchUserInfo();
      } catch (err) {
        navigate(ROUTES.LOGIN);
      }
    };
    loadUserData();
  }, [fetchUserInfo, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePhoneConfirmation = async () => {
    try {
      await sendPhoneVerificationCode();
      setDialogOpen(true);
    } catch (error) {
      console.error('Error sending phone confirmation code:', error);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifying(true);
    const success = await verifyPhoneCode(otp);
    setVerifying(false);
    if (success) {
      setDialogOpen(false);
      setOtp('');
    }
  };

  const handleRegisterPasskey = async () => {
    const success = await registerPasskey();
    if (success) {
      await fetchUserInfo();
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile data..." />;
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-red-600 font-semibold text-lg">{error || 'Failed to load user data'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Enter verification code</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <LoadingButton
            onClick={handleVerifyPhone}
            variant="contained"
            color="primary"
            loading={verifying}
            disabled={otp.length !== 6}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold mb-4 shadow-md"
          >
            {user.firstName?.[0] || '?'}
          </motion.div>

          <div
            className="inline-block relative h-8 cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AnimatePresence mode="wait">
              {!hovered ? (
                <motion.h1
                  key="fullname"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-semibold text-gray-800"
                >
                  {user.firstName} {user.lastName}
                </motion.h1>
              ) : (
                <motion.h1
                  key="username"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-semibold text-gray-800"
                >
                  {user.userName}
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-2 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-gray-600">
              <span>{user.email}</span>
              {user.emailConfirmed ? (
                <CheckCircle sx={{ fontSize: 18 }} color="success" />
              ) : (
                <Cancel sx={{ fontSize: 18 }} color="error" />
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-600">
              <span>{user.phoneNumber}</span>
              {user.phoneNumberConfirmed ? (
                <CheckCircle sx={{ fontSize: 18 }} color="success" />
              ) : (
                <Cancel sx={{ fontSize: 18 }} color="error" />
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6" />

        <div className="space-y-4">
          {!user.phoneNumberConfirmed && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePhoneConfirmation}
              className="w-full py-3 rounded-xl text-white font-medium transition bg-blue-600 hover:bg-blue-700"
            >
              Confirm Phone Number
            </motion.button>
          )}

          <LoadingButton
            fullWidth
            variant="contained"
            onClick={handleRegisterPasskey}
            loading={isRegistering}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Register Passkey
          </LoadingButton>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-400 text-sm"
      >
        © {new Date().getFullYear()} ID. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default Profile;
