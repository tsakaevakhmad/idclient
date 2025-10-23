import { Theme } from '@mui/material/styles';
import { lightGlassTheme, lightGlassConfig } from './lightGlass';
import { oceanGlassTheme, oceanGlassConfig } from './oceanGlass';
import { darkGlassTheme, darkGlassConfig } from './darkGlass';
import { midnightGlassTheme, midnightGlassConfig } from './midnightGlass';
import { classicLightTheme, classicLightConfig } from './classicLight';
import { classicDarkTheme, classicDarkConfig } from './classicDark';
import { ThemeName, GlassTheme } from '../types/theme';

export const themes: Record<ThemeName, Theme> = {
  lightGlass: lightGlassTheme,
  oceanGlass: oceanGlassTheme,
  darkGlass: darkGlassTheme,
  midnightGlass: midnightGlassTheme,
  classicLight: classicLightTheme,
  classicDark: classicDarkTheme,
};

export const themeConfigs: Record<ThemeName, GlassTheme> = {
  lightGlass: lightGlassConfig,
  oceanGlass: oceanGlassConfig,
  darkGlass: darkGlassConfig,
  midnightGlass: midnightGlassConfig,
  classicLight: classicLightConfig,
  classicDark: classicDarkConfig,
};

export {
  lightGlassTheme,
  oceanGlassTheme,
  darkGlassTheme,
  midnightGlassTheme,
  classicLightTheme,
  classicDarkTheme,
};
export {
  lightGlassConfig,
  oceanGlassConfig,
  darkGlassConfig,
  midnightGlassConfig,
  classicLightConfig,
  classicDarkConfig,
};
