import React, { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, fontSize } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    root.style.setProperty('--font-size-base', `${fontSize}px`);
  }, [theme, fontSize]);

  return <>{children}</>;
};

export default ThemeProvider;