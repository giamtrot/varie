import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Define all available themes
const THEMES = ['vibrant', 'midnight-ocean', 'sunset-noir', 'cyberpunk-neon'];

const THEME_NAMES = {
  'vibrant': 'Vibrant Cards',
  'midnight-ocean': 'Midnight Ocean',
  'sunset-noir': 'Sunset Noir',
  'cyberpunk-neon': 'Cyberpunk Neon'
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'vibrant'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('bbc-theme');
    return savedTheme || 'vibrant';
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bbc-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const currentIndex = THEMES.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      return THEMES[nextIndex];
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme !== 'vibrant',
    themeName: THEME_NAMES[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
