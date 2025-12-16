import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

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
    setTheme(prevTheme => prevTheme === 'vibrant' ? 'glassmorphism' : 'vibrant');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'glassmorphism'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
