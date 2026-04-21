import React, { createContext, useContext } from 'react';
import { theme, Theme } from '../theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

// wraps children with the app's theme context
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// hook to access the current theme from any component
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
