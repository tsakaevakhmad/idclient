import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const warmRusticConfig: GlassTheme = {
  name: 'warmRustic',
  displayName: 'Warm Rustic',
  mode: 'light',
  colors: {
    primary: '#805A3B',
    secondary: '#FD974F',
    accent: '#C60000',
    background: {
      main: '#FEF2E4',
      gradient: 'linear-gradient(135deg, #FEF2E4 0%, #FDD7AA 50%, #FDB88E 100%)',
    },
    glass: {
      background: 'rgba(254, 242, 228, 0.95)',
      border: 'rgba(128, 90, 59, 0.3)',
      shadow: 'rgba(128, 90, 59, 0.15)',
      blur: '0px',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      disabled: '#a8a29e',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #FEF2E4 0%, #FDD7AA 50%, #FDB88E 100%)',
    card: 'linear-gradient(135deg, rgba(254, 242, 228, 0.98) 0%, rgba(253, 215, 170, 0.7) 100%)',
    button: 'linear-gradient(135deg, #805A3B 0%, #FD974F 100%)',
  },
};

export const warmRusticTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: warmRusticConfig.colors.primary,
    },
    secondary: {
      main: warmRusticConfig.colors.secondary,
    },
    background: {
      default: warmRusticConfig.colors.background.main,
      paper: '#ffffff',
    },
    text: {
      primary: warmRusticConfig.colors.text.primary,
      secondary: warmRusticConfig.colors.text.secondary,
      disabled: warmRusticConfig.colors.text.disabled,
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
          boxShadow: '0 2px 8px rgba(128, 90, 59, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(128, 90, 59, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(128, 90, 59, 0.2)',
          boxShadow: '0 4px 24px rgba(128, 90, 59, 0.12)',
        },
      },
    },
  },
});
