import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import { MarkEmailRead as MailSentIcon } from '@mui/icons-material';
import { GlassButton } from '../../glass/GlassButton';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { accountSettingsService } from '../../../services/accountSettingsService';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChangeEmailDialog: React.FC<Props> = ({ open, onClose }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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

  const handleSend = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    setError('');
    try {
      await accountSettingsService.changeEmail(newEmail.trim());
      setSent(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || t('accountSettings.errors.sendEmailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: paperSx }}>
      <DialogTitle sx={titleSx}>{t('accountSettings.changeEmail')}</DialogTitle>
      <DialogContent sx={{ py: 3, minWidth: 320 }}>
        {!sent ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('accountSettings.changeEmailSubtitle')}
            </Typography>
            <TextField
              fullWidth
              label={t('accountSettings.newEmail')}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              type="email"
              autoFocus
              sx={{ mt: 1 }}
            />
            {error && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5 }}>
                {error}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <MailSentIcon
              sx={{
                fontSize: 56,
                mb: 2,
                color: theme.colors.accent,
                filter: `drop-shadow(0 0 12px ${theme.colors.accent})`,
              }}
            />
            <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              {t('accountSettings.emailSent')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('accountSettings.emailSentSubtitle', { email: newEmail })}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <GlassButton gradient={false} onClick={handleClose}>
          {sent ? t('common.close') : t('common.cancel')}
        </GlassButton>
        {!sent && (
          <GlassButton onClick={handleSend} loading={loading} disabled={!newEmail.trim()}>
            {t('accountSettings.sendLink')}
          </GlassButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
