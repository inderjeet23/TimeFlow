'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'orange' | 'blue' | 'purple' | 'green';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [accentColor, setAccentColor] = useState<AccentColor>('orange');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('timeflow-theme') as Theme;
    const savedAccent = localStorage.getItem('timeflow-accent') as AccentColor;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Auto-detect system preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
    
    setMounted(true);
  }, []);

  // Apply theme and accent to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    root.classList.remove('accent-orange', 'accent-blue', 'accent-purple', 'accent-green');
    
    // Add current theme and accent
    root.classList.add(theme);
    root.classList.add(`accent-${accentColor}`);
    
    // Save to localStorage
    localStorage.setItem('timeflow-theme', theme);
    localStorage.setItem('timeflow-accent', accentColor);
  }, [theme, accentColor, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetAccentColor = (color: AccentColor) => {
    setAccentColor(color);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        accentColor,
        setTheme: handleSetTheme,
        setAccentColor: handleSetAccentColor,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}