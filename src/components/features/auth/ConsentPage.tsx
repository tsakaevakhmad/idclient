import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Shield as ShieldIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../hooks/useTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { GlassCard } from '../../glass/GlassCard';
import { GlassButton } from '../../glass/GlassButton';
import { BackgroundGradient } from '../../theme/BackgroundGradient';
import { API_ENDPOINTS } from '../../../constants';
import apiClient from '../../../api/client';

interface ScopeInfo {
  name: string;
  displayName?: string;
  description?: string;
}

interface ConsentInfo {
  clientId: string;
  clientName: string;
  clientDescription?: string;
  clientUri?: string;
  logoUri?: string;
  requestedScopes: ScopeInfo[];
}

const ConsentPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const [consentInfo, setConsentInfo] = useState<ConsentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Все OIDC-параметры из текущего URL (будут переданы обратно в /connect/authorize)
  const oidcParams = window.location.search.slice(1);
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client_id') ?? '';
  const scope = urlParams.get('scope') ?? '';

  useEffect(() => {
    if (!clientId) {
      setError(t('consent.error.missingClientId'));
      setIsLoading(false);
      return;
    }

    const fetchConsentInfo = async () => {
      try {
        const params = new URLSearchParams({ client_id: clientId, scope });
        const response = await apiClient.get<ConsentInfo>(
          `${API_ENDPOINTS.CONSENT.INFO}?${params.toString()}`
        );
        setConsentInfo(response.data);
      } catch {
        setError(t('consent.error.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsentInfo();
  }, [clientId, scope, t]);

  /**
   * Отправляет решение пользователя на бэкенд через форму POST.
   * OpenIddict при POST читает параметры ТОЛЬКО из тела формы (не из query string),
   * поэтому все OIDC-параметры добавляются как hidden-поля формы вместе с решением.
   */
  const submitConsent = (grant: 'Accept' | 'Deny') => {
    setIsSubmitting(true);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/connect/authorize';

    // Добавляем все OIDC-параметры из URL как скрытые поля формы
    const urlSearchParams = new URLSearchParams(oidcParams);
    urlSearchParams.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Добавляем решение пользователя
    const grantInput = document.createElement('input');
    grantInput.type = 'hidden';
    grantInput.name = 'grant';
    grantInput.value = grant;
    form.appendChild(grantInput);

    document.body.appendChild(form);
    form.submit();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <BackgroundGradient />
        <CircularProgress sx={{ color: theme.colors.primary }} />
      </Box>
    );
  }

  if (error || !consentInfo) {
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
        <GlassCard sx={{ p: 4, maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <Typography color="error">{error ?? t('consent.error.unknown')}</Typography>
        </GlassCard>
      </Box>
    );
  }

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
        style={{ width: '100%', maxWidth: 480 }}
      >
        <GlassCard glowOnHover sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          {/* Шапка */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {consentInfo.logoUri ? (
                <Avatar
                  src={consentInfo.logoUri}
                  sx={{ width: 72, height: 72, mx: 'auto', mb: 2 }}
                />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <ShieldIcon
                    sx={{
                      fontSize: 64,
                      color: theme.colors.primary,
                      filter: `drop-shadow(0 0 20px ${theme.colors.primary}80)`,
                      mb: 2,
                    }}
                  />
                </motion.div>
              )}

              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.35rem', sm: '1.75rem' },
                  background: theme.gradients.button,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                {t('consent.title')}
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: theme.colors.text.primary, mb: 0.5 }}
              >
                {consentInfo.clientName}
              </Typography>

              {consentInfo.clientUri && (
                <Typography variant="body2" color="text.secondary">
                  {consentInfo.clientUri}
                </Typography>
              )}
            </Box>
          </motion.div>

          {/* Описание */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: 'center' }}
            >
              {t('consent.description', { appName: consentInfo.clientName })}
            </Typography>
          </motion.div>

          <Divider sx={{ borderColor: theme.colors.glass.border, mb: 3 }} />

          {/* Запрошенные права */}
          {consentInfo.requestedScopes.length > 0 && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 2, color: theme.colors.text.primary }}
                >
                  {t('consent.requestedAccess')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {consentInfo.requestedScopes.map((s) => (
                    <Box
                      key={s.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        background: theme.colors.glass.background,
                        backdropFilter: `blur(${theme.colors.glass.blur})`,
                        border: `1px solid ${theme.colors.glass.border}`,
                      }}
                    >
                      <CheckIcon
                        sx={{
                          color: theme.colors.primary,
                          fontSize: 20,
                          mt: 0.2,
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: theme.colors.text.primary }}
                        >
                          {s.displayName ?? s.name}
                        </Typography>
                        {s.description && (
                          <Typography variant="caption" color="text.secondary">
                            {s.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}

          <Divider sx={{ borderColor: theme.colors.glass.border, mb: 2 }} />

          {/* Предупреждение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mb: 3 }}
            >
              {t('consent.warning')}
            </Typography>
          </motion.div>

          {/* Кнопки */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <GlassButton
                fullWidth
                gradient={false}
                onClick={() => submitConsent('Deny')}
                disabled={isSubmitting}
              >
                {t('consent.deny')}
              </GlassButton>

              <GlassButton
                fullWidth
                gradient
                onClick={() => submitConsent('Accept')}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {t('consent.accept')}
              </GlassButton>
            </Box>
          </motion.div>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default ConsentPage;
