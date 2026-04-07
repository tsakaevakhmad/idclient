import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import OtpInput from 'react-otp-input';
import { GlassButton } from '../../glass/GlassButton';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { accountSettingsService } from '../../../services/accountSettingsService';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePhoneDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [newPhone, setNewPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paperSx = {
    background: theme.colors.glass.background,
    backdropFilter: `blur(${theme.colors.glass.blur})`,
    border: `1px solid ${theme.colors.glass.border}`,
    borderRadius: '20px',
    boxShadow: theme.colors.glass.shadow,
  };

  const titleSx = {
    background: theme.gradients.button,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  };

  const handleSendCode = async () => {
    if (!newPhone.trim()) return;
    setLoading(true);
    setError('');
    try {
      await accountSettingsService.changePhone(newPhone.trim());
      setStep('otp');
    } catch (e: any) {
      setError(e?.response?.data?.message || t('accountSettings.errors.sendCodeFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      await accountSettingsService.confirmPhoneChange(newPhone.trim(), otp);
      handleClose();
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message || t('accountSettings.errors.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setNewPhone('');
    setOtp('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: paperSx }}>
      <DialogTitle sx={titleSx}>{t('accountSettings.changePhone')}</DialogTitle>
      <DialogContent sx={{ py: 3, minWidth: 320 }}>
        {step === 'input' ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('accountSettings.changePhoneSubtitle')}
            </Typography>
            <TextField
              fullWidth
              label={t('accountSettings.newPhone')}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              type="tel"
              autoFocus
              sx={{ mt: 1 }}
            />
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t('accountSettings.otpSubtitle', { phone: newPhone })}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputType="tel"
                shouldAutoFocus
                renderSeparator={<span style={{ width: '10px' }} />}
                renderInput={(props) => (
                  <motion.input
                    {...props}
                    whileFocus={{ scale: 1.1 }}
                    style={{
                      width: '44px',
                      height: '52px',
                      fontSize: '22px',
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
          </>
        )}
        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <GlassButton gradient={false} onClick={handleClose}>
          {t('common.cancel')}
        </GlassButton>
        {step === 'input' ? (
          <GlassButton onClick={handleSendCode} loading={loading} disabled={!newPhone.trim()}>
            {t('accountSettings.sendCode')}
          </GlassButton>
        ) : (
          <GlassButton onClick={handleConfirm} loading={loading} disabled={otp.length !== 6}>
            {t('common.confirm')}
          </GlassButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
