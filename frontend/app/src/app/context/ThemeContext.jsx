import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const AVAILABLE_THEMES = [
  'light',
  'dark',
  'ocean-light',
  'ocean-dark',
  'forest-light',
  'forest-dark',
  'sunset-light',
  'sunset-dark',
  'purple-light',
  'purple-dark'
];

function ThemeProvider({ children }) {
  const [palette, setPalette] = useState('default');
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const storedPalette = localStorage.getItem('palette');
    const storedMode = localStorage.getItem('mode');
    if (storedPalette) setPalette(storedPalette);
    if (storedMode) setMode(storedMode);
  }, []);

  useEffect(() => {
    applyTheme(palette, mode);
    localStorage.setItem('palette', palette);
    localStorage.setItem('mode', mode);
  }, [palette, mode]);

  const applyTheme = (p, m) => {
    const root = document.documentElement;
    root.classList.remove(
      'palette-ocean',
      'palette-forest',
      'palette-sunset',
      'palette-purple',
      'dark'
    );
    if (p !== 'default') {
      root.classList.add(`palette-${p}`);
    }
    if (m === 'dark') {
      root.classList.add('dark');
    }
  };

  const setTheme = (theme) => {
    if (!AVAILABLE_THEMES.includes(theme)) return;
    const [p, m] = theme.split('-');
    if (m) {
      setPalette(p);
      setMode(m);
    } else {
      setPalette('default');
      setMode(p);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleTheme = () => {
    setPalette('default');
    toggleMode();
  };

  const value = {
    theme: palette === 'default' ? mode : `${palette}-${mode}`,
    themeInfo: { palette, mode },
    setTheme,
    toggleTheme,
    toggleMode,
    setPalette,
    isDark: mode === 'dark',
    palette
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

export { ThemeContext, ThemeProvider, useTheme };
