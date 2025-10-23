import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const classicDarkConfig: GlassTheme = {
  name: 'classicDark',
  displayName: 'Classic Dark',
  mode: 'dark',
  colors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    accent: '#f472b6',
    background: {
      main: '#1e1b4b',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    },
    glass: {
      background: 'rgba(30, 27, 75, 0.95)',
      border: 'rgba(129, 140, 248, 0.3)',
      shadow: 'rgba(129, 140, 248, 0.2)',
      blur: '0px',
    },
    text: {
      primary: '#faf5ff',
      secondary: '#e9d5ff',
      disabled: '#7c3aed',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    card: 'linear-gradient(135deg, rgba(49, 46, 129, 0.8) 0%, rgba(76, 29, 149, 0.6) 100%)',
    button: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
  },
};

export const classicDarkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: classicDarkConfig.colors.primary,
    },
    secondary: {
      main: classicDarkConfig.colors.secondary,
    },
    background: {
      default: classicDarkConfig.colors.background.main,
      paper: '#312e81',
    },
    text: {
      primary: classicDarkConfig.colors.text.primary,
      secondary: classicDarkConfig.colors.text.secondary,
      disabled: classicDarkConfig.colors.text.disabled,
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
          boxShadow: '0 2px 8px rgba(129, 140, 248, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(129, 140, 248, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(49, 46, 129, 0.7)',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          boxShadow: '0 4px 24px rgba(129, 140, 248, 0.15)',
        },
      },
    },
  },
});
