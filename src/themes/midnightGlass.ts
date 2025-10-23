import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const midnightGlassConfig: GlassTheme = {
  name: 'midnightGlass',
  displayName: 'Midnight Glass',
  mode: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#3b82f6',
    accent: '#818cf8',
    background: {
      main: '#030712',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    },
    glass: {
      background: 'rgba(3, 7, 18, 0.4)',
      border: 'rgba(96, 165, 250, 0.3)',
      shadow: 'rgba(59, 130, 246, 0.25)',
      blur: '20px',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      disabled: '#475569',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    card: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
    button: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
  },
};

export const midnightGlassTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: midnightGlassConfig.colors.primary,
    },
    secondary: {
      main: midnightGlassConfig.colors.secondary,
    },
    background: {
      default: midnightGlassConfig.colors.background.main,
      paper: 'rgba(15, 23, 42, 0.8)',
    },
    text: {
      primary: midnightGlassConfig.colors.text.primary,
      secondary: midnightGlassConfig.colors.text.secondary,
      disabled: midnightGlassConfig.colors.text.disabled,
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
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          background: midnightGlassConfig.colors.glass.background,
          border: `1px solid ${midnightGlassConfig.colors.glass.border}`,
          boxShadow: `0 8px 32px 0 ${midnightGlassConfig.colors.glass.shadow}`,
        },
      },
    },
  },
});
