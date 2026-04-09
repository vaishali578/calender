import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('cal_theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
    localStorage.setItem('cal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    setTheme(t => t === 'dark' ? 'light' : 'dark');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 450);
  };

  return { theme, toggleTheme };
}
