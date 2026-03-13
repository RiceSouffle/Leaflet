import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useDarkMode() {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  const toggleDarkMode = () => updateSettings({ darkMode: !settings.darkMode });

  return { darkMode: settings.darkMode, toggleDarkMode };
}
