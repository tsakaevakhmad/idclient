import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const classicLightConfig: GlassTheme = {
  name: 'classicLight',
  displayName: 'Classic Light',
  mode: 'light',
  colors: {
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#ec4899',
    background: {
      main: '#fef3c7',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(251, 191, 36, 0.3)',
      shadow: 'rgba(245, 158, 11, 0.15)',
      blur: '0px',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      disabled: '#a8a29e',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 243, 199, 0.7) 100%)',
    button: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
};

export const classicLightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: classicLightConfig.colors.primary,
    },
    secondary: {
      main: classicLightConfig.colors.secondary,
    },
    background: {
      default: classicLightConfig.colors.background.main,
      paper: '#ffffff',
    },
    text: {
      primary: classicLightConfig.colors.text.primary,
      secondary: classicLightConfig.colors.text.secondary,
      disabled: classicLightConfig.colors.text.disabled,
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
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          boxShadow: '0 4px 24px rgba(245, 158, 11, 0.12)',
        },
      },
    },
  },
});
