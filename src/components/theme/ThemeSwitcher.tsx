import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, Menu, MenuItem, Box, Typography, Tooltip } from '@mui/material';
import {
  Palette as PaletteIcon,
  Park as EcoIcon,
  WaterDrop as OceanIcon,
  DarkMode as DarkIcon,
  NightsStay as MidnightIcon,
  Check as CheckIcon,
  AutoAwesome as ClassicLightIcon,
  Stars as ClassicDarkIcon,
} from '@mui/icons-material';
import { useTheme } from '../../hooks/useTheme';
import { ThemeName } from '../../types/theme';

const themeIcons: Record<ThemeName, React.ReactElement> = {
  warmRustic: <EcoIcon />,
  oceanGlass: <OceanIcon />,
  darkGlass: <DarkIcon />,
  midnightGlass: <MidnightIcon />,
  classicLight: <ClassicLightIcon />,
  classicDark: <ClassicDarkIcon />,
};

const themeColors: Record<ThemeName, { primary: string; secondary: string }> = {
  warmRustic: { primary: '#805A3B', secondary: '#FD974F' },
  oceanGlass: { primary: '#06b6d4', secondary: '#0ea5e9' },
  darkGlass: { primary: '#a78bfa', secondary: '#c084fc' },
  midnightGlass: { primary: '#60a5fa', secondary: '#3b82f6' },
  classicLight: { primary: '#f59e0b', secondary: '#f97316' },
  classicDark: { primary: '#818cf8', secondary: '#a78bfa' },
};

export const ThemeSwitcher: React.FC = () => {
  const { themeName, theme, setTheme } = useTheme();
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
    handleClose();
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
      <Tooltip title="Change Theme" placement="left">
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
                transform: 'rotate(180deg)',
                transition: 'transform 0.6s ease',
              },
            }}
          >
            <PaletteIcon />
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
            minWidth: 200,
          },
        }}
      >
        {(Object.keys(themeIcons) as ThemeName[]).map((themeKey) => (
          <MenuItem
            key={themeKey}
            onClick={() => handleThemeSelect(themeKey)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: themeColors[themeKey].primary,
              }}
            >
              {themeIcons[themeKey]}
            </motion.div>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={themeName === themeKey ? 600 : 400}>
                {themeKey === 'warmRustic' && 'Warm Rustic'}
                {themeKey === 'oceanGlass' && 'Ocean Glass'}
                {themeKey === 'darkGlass' && 'Dark Glass'}
                {themeKey === 'midnightGlass' && 'Midnight Glass'}
                {themeKey === 'classicLight' && 'Classic Light'}
                {themeKey === 'classicDark' && 'Classic Dark'}
              </Typography>
            </Box>

            <AnimatePresence>
              {themeName === themeKey && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <CheckIcon sx={{ color: themeColors[themeKey].primary, fontSize: 20 }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme preview indicator */}
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '6px',
                background: `linear-gradient(135deg, ${themeColors[themeKey].primary} 0%, ${themeColors[themeKey].secondary} 100%)`,
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
