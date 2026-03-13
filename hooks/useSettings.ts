import { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '@/lib/types';
import { settingsStorage } from '@/lib/storage';
import { DEFAULT_SETTINGS } from '@/lib/constants';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsStorage.getValue().then((s) => {
      setSettings(s);
      setLoading(false);
    });

    const unwatch = settingsStorage.watch((newVal) => {
      if (newVal) setSettings(newVal);
    });

    return unwatch;
  }, []);

  const updateSettings = useCallback(async (partial: Partial<UserSettings>) => {
    const current = await settingsStorage.getValue();
    const updated = { ...current, ...partial };
    await settingsStorage.setValue(updated);
  }, []);

  return { settings, loading, updateSettings };
}
