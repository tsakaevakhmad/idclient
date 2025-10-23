import { createContext, useState, useCallback, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeName, GlassTheme } from '../types/theme';
import { themes, themeConfigs } from '../themes';

interface ThemeContextType {
  themeName: ThemeName;
  theme: GlassTheme;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: ThemeName = 'lightGlass';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
    return savedTheme && themes[savedTheme] ? savedTheme : DEFAULT_THEME;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const setTheme = useCallback((newThemeName: ThemeName) => {
    setIsTransitioning(true);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newThemeName);

    // Small delay for transition effect
    setTimeout(() => {
      setThemeName(newThemeName);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 150);
  }, []);

  const toggleTheme = useCallback(() => {
    const themeOrder: ThemeName[] = [
      'lightGlass',
      'oceanGlass',
      'classicLight',
      'darkGlass',
      'midnightGlass',
      'classicDark',
    ];
    const currentIndex = themeOrder.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [themeName, setTheme]);

  const value: ThemeContextType = {
    themeName,
    theme: themeConfigs[themeName],
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={themes[themeName]}>
        <CssBaseline />
        <AnimatePresence mode="wait">
          <motion.div
            key={themeName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '100vh',
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Theme transition overlay */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: themeConfigs[themeName].colors.primary,
              pointerEvents: 'none',
              zIndex: 9999,
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
export type { ThemeContextType };
