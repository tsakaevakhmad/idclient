import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Typography, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { authService } from '../../../services/authService';
import { RegisterRequest } from '../../../api/types';
import { LoadingButton } from '../../common';
import { ROUTES } from '../../../constants';

/**
 * User registration component
 */
const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    userName: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
  });

  const handleChange =
    (field: keyof RegisterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleRegister = async () => {
    const { email, userName, phoneNumber } = formData;

    if (!email && !phoneNumber) {
      setError('Please enter email or phone number');
      return;
    }
    if (!userName.trim()) {
      setError('Please enter username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);

      switch (response.data.status) {
        case 'SendedMailConfirmationCode':
          navigate(ROUTES.LOGIN);
          break;
        case 'UserNotFound':
          setError('User not found. Please check your details.');
          break;
        case 'UserMailNotConfirmed':
          setError('Email not confirmed. Please check your email.');
          break;
        case 'UserPhoneNotConfirmed':
          setError('Phone number not confirmed.');
          break;
        case 'UserAlreadyExists':
          setError('User already exists. Try logging in.');
          break;
        case 'UserMailAlreadyExists':
          setError('An account with this email already exists.');
          break;
        case 'UserPhoneAlreadyExists':
          setError('An account with this phone number already exists.');
          break;
        case 'InvalidToken':
          setError('Invalid token. Please try again.');
          break;
        default:
          setError('An unknown error occurred. Please try again.');
          break;
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{ label: string; name: keyof RegisterRequest }> = [
    { label: 'Email', name: 'email' },
    { label: 'Phone', name: 'phoneNumber' },
    { label: 'Username', name: 'userName' },
    { label: 'First Name', name: 'firstName' },
    { label: 'Last Name', name: 'lastName' },
    { label: 'Middle Name', name: 'middleName' },
  ];

  return (
    <div className="w-full mt-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: 8,
            p: 2,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" align="center">
                Registration
              </Typography>
            }
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {fields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                variant="standard"
                fullWidth
                value={formData[field.name]}
                onChange={handleChange(field.name)}
              />
            ))}

            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}

            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handleRegister}
              loading={loading}
              sx={{ width: '100%', borderRadius: 2 }}
            >
              Register
            </LoadingButton>

            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: 'pointer',
                mt: 1,
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Already have an account? Sign in
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Registration;
