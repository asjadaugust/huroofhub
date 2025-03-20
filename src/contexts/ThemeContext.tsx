'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { mode, setMode } = useColorScheme();

  const value = useMemo(() => {
    const toggleTheme = () => {
      setMode(mode === 'light' ? 'dark' : 'light');
    };
    
    return {
      mode: (mode as ThemeMode) || 'light',
      toggleTheme,
    };
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
