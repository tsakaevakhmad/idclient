import { Theme } from '@mui/material/styles';
import { warmRusticTheme, warmRusticConfig } from './warmRustic';
import { oceanGlassTheme, oceanGlassConfig } from './oceanGlass';
import { darkGlassTheme, darkGlassConfig } from './darkGlass';
import { midnightGlassTheme, midnightGlassConfig } from './midnightGlass';
import { classicLightTheme, classicLightConfig } from './classicLight';
import { classicDarkTheme, classicDarkConfig } from './classicDark';
import { ThemeName, GlassTheme } from '../types/theme';

export const themes: Record<ThemeName, Theme> = {
  warmRustic: warmRusticTheme,
  oceanGlass: oceanGlassTheme,
  darkGlass: darkGlassTheme,
  midnightGlass: midnightGlassTheme,
  classicLight: classicLightTheme,
  classicDark: classicDarkTheme,
};

export const themeConfigs: Record<ThemeName, GlassTheme> = {
  warmRustic: warmRusticConfig,
  oceanGlass: oceanGlassConfig,
  darkGlass: darkGlassConfig,
  midnightGlass: midnightGlassConfig,
  classicLight: classicLightConfig,
  classicDark: classicDarkConfig,
};

export {
  warmRusticTheme,
  oceanGlassTheme,
  darkGlassTheme,
  midnightGlassTheme,
  classicLightTheme,
  classicDarkTheme,
};
export {
  warmRusticConfig,
  oceanGlassConfig,
  darkGlassConfig,
  midnightGlassConfig,
  classicLightConfig,
  classicDarkConfig,
};
