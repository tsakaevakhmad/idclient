import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { authService } from '../../../services/authService';
import { RegisterRequest } from '../../../api/types';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { GlassInput } from '../../glass/GlassInput';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { ROUTES } from '../../../constants';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useLanguage();
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
      setError('');
    };

  const handleRegister = async () => {
    const { email, userName, phoneNumber } = formData;

    if (!email && !phoneNumber) {
      setError(t('auth.registration.errors.emailOrPhoneRequired'));
      return;
    }
    if (!userName.trim()) {
      setError(t('auth.registration.errors.usernameRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);

      switch (response.data.status) {
        case 'SendedMailConfirmationCode':
        case 'SendedPhoneNumberConfirmationCode':
        case 'SendedLoginCodeToEmail':
        case 'SendedLoginCodeToPhoneNumber':
        case 'Success':
          // All success cases - redirect to login
          navigate(ROUTES.LOGIN);
          break;
        case 'UserNotFound':
          setError(t('auth.registration.errors.userNotFound'));
          break;
        case 'UserMailNotConfirmed':
          setError(t('auth.registration.errors.emailNotConfirmed'));
          break;
        case 'UserPhoneNotConfirmed':
          setError(t('auth.registration.errors.phoneNotConfirmed'));
          break;
        case 'UserAlreadyExists':
          setError(t('auth.registration.errors.userExists'));
          break;
        case 'UserMailAlreadyExists':
          setError(t('auth.registration.errors.emailExists'));
          break;
        case 'UserPhoneAlreadyExists':
          setError(t('auth.registration.errors.phoneExists'));
          break;
        case 'InvalidToken':
          setError(t('auth.registration.errors.invalidToken'));
          break;
        case 'UserIsBlocked':
          setError(t('auth.twoFa.UserIsBlocked'));
          break;
        default:
          setError(t('auth.registration.errors.unknown'));
          break;
      }
    } catch (err) {
      console.error(err);
      setError(t('auth.registration.errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{ labelKey: string; name: keyof RegisterRequest; required?: boolean }> = [
    { labelKey: 'auth.registration.fields.email', name: 'email', required: true },
    { labelKey: 'auth.registration.fields.phoneNumber', name: 'phoneNumber' },
    { labelKey: 'auth.registration.fields.username', name: 'userName', required: true },
    { labelKey: 'auth.registration.fields.firstName', name: 'firstName', required: true },
    { labelKey: 'auth.registration.fields.lastName', name: 'lastName', required: true },
    { labelKey: 'auth.registration.fields.middleName', name: 'middleName' },
  ];

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
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <GlassCard glowOnHover sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <PersonAddIcon
                  sx={{
                    fontSize: 64,
                    color: theme.colors.primary,
                    filter: `drop-shadow(0 0 20px ${theme.colors.primary}80)`,
                    mb: 2,
                  }}
                />
              </motion.div>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: theme.gradients.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {t('auth.registration.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('auth.registration.subtitle')}
              </Typography>
            </Box>
          </motion.div>

          {/* Form Fields */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            {fields.map((field, index) => (
              <Box
                key={field.name}
                sx={{
                  gridColumn:
                    field.name === 'email' || field.name === 'phoneNumber' ? '1 / -1' : 'auto',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <GlassInput
                    label={t(field.labelKey)}
                    variant="outlined"
                    fullWidth
                    required={field.required}
                    value={formData[field.name]}
                    onChange={handleChange(field.name)}
                  />
                </motion.div>
              </Box>
            ))}
          </Box>

          {/* Error Message */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            </motion.div>
          )}

          {/* Register Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <GlassButton
              variant="contained"
              fullWidth
              onClick={handleRegister}
              loading={loading}
              sx={{ mb: 2 }}
            >
              {t('auth.registration.registerButton')}
            </GlassButton>
          </motion.div>

          {/* Login Link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.primary,
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                {t('auth.registration.hasAccount')} →
              </Typography>
            </Box>
          </motion.div>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default Registration;
