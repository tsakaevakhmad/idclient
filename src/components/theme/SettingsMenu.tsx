import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  WbSunny as LightIcon,
  WaterDrop as OceanIcon,
  DarkMode as DarkIcon,
  NightsStay as MidnightIcon,
  Check as CheckIcon,
  AutoAwesome as ClassicLightIcon,
  Stars as ClassicDarkIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { ThemeName } from '../../types/theme';
import { SupportedLanguage } from '../../types/i18n';

const themeIcons: Record<ThemeName, React.ReactElement> = {
  lightGlass: <LightIcon fontSize="small" />,
  oceanGlass: <OceanIcon fontSize="small" />,
  darkGlass: <DarkIcon fontSize="small" />,
  midnightGlass: <MidnightIcon fontSize="small" />,
  classicLight: <ClassicLightIcon fontSize="small" />,
  classicDark: <ClassicDarkIcon fontSize="small" />,
};

const themeColors: Record<ThemeName, { primary: string; secondary: string }> = {
  lightGlass: { primary: '#6366f1', secondary: '#8b5cf6' },
  oceanGlass: { primary: '#06b6d4', secondary: '#0ea5e9' },
  darkGlass: { primary: '#a78bfa', secondary: '#c084fc' },
  midnightGlass: { primary: '#60a5fa', secondary: '#3b82f6' },
  classicLight: { primary: '#f59e0b', secondary: '#f97316' },
  classicDark: { primary: '#818cf8', secondary: '#a78bfa' },
};

export const SettingsMenu: React.FC = () => {
  const { themeName, theme, setTheme } = useTheme();
  const { currentLanguage, changeLanguage, languages, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (selectedTheme: ThemeName) => {
    setTheme(selectedTheme);
  };

  const handleLanguageSelect = (language: SupportedLanguage) => {
    changeLanguage(language);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      <Tooltip title={t('common.settings')} placement="left">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={handleClick}
            sx={{
              background: theme.colors.glass.background,
              backdropFilter: `blur(${theme.colors.glass.blur})`,
              border: `1px solid ${theme.colors.glass.border}`,
              boxShadow: `0 8px 32px 0 ${theme.colors.glass.shadow}`,
              color: theme.colors.text.primary,
              '&:hover': {
                background: theme.gradients.card,
                transform: 'rotate(90deg)',
                transition: 'transform 0.6s ease',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </motion.div>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: theme.colors.glass.background,
            backdropFilter: `blur(${theme.colors.glass.blur})`,
            border: `1px solid ${theme.colors.glass.border}`,
            boxShadow: `0 8px 32px 0 ${theme.colors.glass.shadow}`,
            mt: 1,
            minWidth: 280,
            maxHeight: 600,
          },
        }}
      >
        {/* Language Section */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <LanguageIcon sx={{ fontSize: 20, color: theme.colors.primary }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {t('common.language')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {Object.values(languages).map((lang) => (
              <motion.div key={lang.code} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <MenuItem
                  onClick={() => handleLanguageSelect(lang.code)}
                  sx={{
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 1.5,
                    background:
                      currentLanguage === lang.code ? `${theme.colors.primary}20` : 'transparent',
                    '&:hover': {
                      background:
                        currentLanguage === lang.code
                          ? `${theme.colors.primary}30`
                          : 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <Typography fontSize="1.5rem">{lang.flag}</Typography>
                  <ListItemText
                    primary={lang.nativeName}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: currentLanguage === lang.code ? 600 : 400,
                    }}
                  />
                  <AnimatePresence>
                    {currentLanguage === lang.code && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckIcon sx={{ color: theme.colors.primary, fontSize: 18 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </MenuItem>
              </motion.div>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 1, borderColor: theme.colors.glass.border }} />

        {/* Theme Section */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <PaletteIcon sx={{ fontSize: 20, color: theme.colors.primary }} />
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {t('common.theme')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {(Object.keys(themeIcons) as ThemeName[]).map((themeKey) => (
              <motion.div key={themeKey} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <MenuItem
                  onClick={() => handleThemeSelect(themeKey)}
                  sx={{
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 1.5,
                    background:
                      themeName === themeKey ? `${themeColors[themeKey].primary}20` : 'transparent',
                    '&:hover': {
                      background:
                        themeName === themeKey
                          ? `${themeColors[themeKey].primary}30`
                          : 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      color: themeColors[themeKey].primary,
                    }}
                  >
                    {themeIcons[themeKey]}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`themes.${themeKey}`)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: themeName === themeKey ? 600 : 400,
                    }}
                  />

                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      background: `linear-gradient(135deg, ${themeColors[themeKey].primary} 0%, ${themeColors[themeKey].secondary} 100%)`,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />

                  <AnimatePresence>
                    {themeName === themeKey && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <CheckIcon sx={{ color: themeColors[themeKey].primary, fontSize: 18 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </MenuItem>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};
