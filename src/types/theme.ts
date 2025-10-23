export type ThemeName =
  | 'lightGlass'
  | 'oceanGlass'
  | 'darkGlass'
  | 'midnightGlass'
  | 'classicLight'
  | 'classicDark';

export interface GlassTheme {
  name: ThemeName;
  displayName: string;
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      main: string;
      gradient: string;
    };
    glass: {
      background: string;
      border: string;
      shadow: string;
      blur: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  gradients: {
    background: string;
    card: string;
    button: string;
  };
}
