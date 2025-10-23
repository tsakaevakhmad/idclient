import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const darkGlassConfig: GlassTheme = {
  name: 'darkGlass',
  displayName: 'Dark Glass',
  mode: 'dark',
  colors: {
    primary: '#a78bfa',
    secondary: '#c084fc',
    accent: '#f472b6',
    background: {
      main: '#0f172a',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    glass: {
      background: 'rgba(15, 23, 42, 0.3)',
      border: 'rgba(167, 139, 250, 0.3)',
      shadow: 'rgba(167, 139, 250, 0.2)',
      blur: '16px',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      disabled: '#64748b',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
    button: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
  },
};

export const darkGlassTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkGlassConfig.colors.primary,
    },
    secondary: {
      main: darkGlassConfig.colors.secondary,
    },
    background: {
      default: darkGlassConfig.colors.background.main,
      paper: 'rgba(30, 41, 59, 0.7)',
    },
    text: {
      primary: darkGlassConfig.colors.text.primary,
      secondary: darkGlassConfig.colors.text.secondary,
      disabled: darkGlassConfig.colors.text.disabled,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          backdropFilter: 'blur(16px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          background: darkGlassConfig.colors.glass.background,
          border: `1px solid ${darkGlassConfig.colors.glass.border}`,
          boxShadow: `0 8px 32px 0 ${darkGlassConfig.colors.glass.shadow}`,
        },
      },
    },
  },
});
