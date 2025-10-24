import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const oceanGlassConfig: GlassTheme = {
  name: 'oceanGlass',
  displayName: 'Ocean Glass',
  mode: 'light',
  colors: {
    primary: '#217074',
    secondary: '#0ea5e9',
    accent: '#3b82f6',
    background: {
      main: '#e0f2fe',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #217074 100%)',
    },
    glass: {
      background: 'rgba(14, 165, 233, 0.15)',
      border: 'rgba(14, 165, 233, 0.1)',
      shadow: 'rgba(14, 165, 233, 0.15)',
      blur: '12px',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      disabled: '#94a3b8',
    },
  },
  gradients: {
    background:
      'linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(224, 242, 254, 0.15) 100%)',
    card: 'linear-gradient(135deg, rgba(224, 242, 254, 0.25) 0%, rgba(224, 242, 254, 0.15) 100%)',
    button: 'linear-gradient(135deg, #217074 0%, #0ea5e9 100%)',
  },
};

export const oceanGlassTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: oceanGlassConfig.colors.primary,
    },
    secondary: {
      main: oceanGlassConfig.colors.secondary,
    },
    background: {
      default: oceanGlassConfig.colors.background.main,
      paper: 'rgba(224, 242, 254, 0.9)',
    },
    text: {
      primary: oceanGlassConfig.colors.text.primary,
      secondary: oceanGlassConfig.colors.text.secondary,
      disabled: oceanGlassConfig.colors.text.disabled,
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
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
          background: oceanGlassConfig.colors.glass.background,
          border: `1px solid ${oceanGlassConfig.colors.glass.border}`,
          boxShadow: `0 8px 32px 0 ${oceanGlassConfig.colors.glass.shadow}`,
        },
      },
    },
  },
});
