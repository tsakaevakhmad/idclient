import { createTheme, Theme } from '@mui/material/styles';
import { GlassTheme } from '../types/theme';

export const tundukConfig: GlassTheme = {
  name: 'tunduk',
  displayName: 'Түндүк',
  mode: 'light',
  colors: {
    primary: '#1560BD',
    secondary: '#1560BD',
    accent: '#1560BD',
    background: {
      main: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #EBF2FF 50%, #D6E6FF 100%)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(21, 96, 189, 0.2)',
      shadow: 'rgba(21, 96, 189, 0.12)',
      blur: '0px',
    },
    text: {
      primary: '#1560BD',
      secondary: '#1560BD',
      disabled: 'rgba(21, 96, 189, 0.4)',
    },
  },
  gradients: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #EBF2FF 50%, #D6E6FF 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(235, 242, 255, 0.7) 100%)',
    button: 'linear-gradient(135deg, #1560BD 0%, #1560BD 100%)',
  },
};

export const tundukTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tundukConfig.colors.primary,
    },
    secondary: {
      main: tundukConfig.colors.secondary,
    },
    background: {
      default: tundukConfig.colors.background.main,
      paper: '#ffffff',
    },
    text: {
      primary: tundukConfig.colors.text.primary,
      secondary: tundukConfig.colors.text.secondary,
      disabled: tundukConfig.colors.text.disabled,
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
          boxShadow: '0 2px 8px rgba(21, 96, 189, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(21, 96, 189, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid rgba(21, 96, 189, 0.15)',
          boxShadow: '0 4px 24px rgba(21, 96, 189, 0.1)',
        },
      },
    },
  },
});
