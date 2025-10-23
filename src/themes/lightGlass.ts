import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const lightGlassConfig: GlassTheme = {
  name: 'lightGlass',
  displayName: 'Light Glass',
  mode: 'light',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: {
      main: '#f0f4f8',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      blur: '10px',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
    button: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  },
};

export const lightGlassTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightGlassConfig.colors.primary,
    },
    secondary: {
      main: lightGlassConfig.colors.secondary,
    },
    background: {
      default: lightGlassConfig.colors.background.main,
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: lightGlassConfig.colors.text.primary,
      secondary: lightGlassConfig.colors.text.secondary,
      disabled: lightGlassConfig.colors.text.disabled,
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
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: lightGlassConfig.colors.glass.background,
          border: `1px solid ${lightGlassConfig.colors.glass.border}`,
          boxShadow: `0 8px 32px 0 ${lightGlassConfig.colors.glass.shadow}`,
        },
      },
    },
  },
});
