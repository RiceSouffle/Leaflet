import type { Session, UserSettings, AutoSaveMetadata } from './types';
import { DEFAULT_SETTINGS } from './constants';

// Typed wrappers around chrome.storage

async function getLocal<T>(key: string, fallback: T): Promise<T> {
  const result = await chrome.storage.local.get(key);
  return result[key] ?? fallback;
}

async function setLocal<T>(key: string, value: T): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

async function getSync<T>(key: string, fallback: T): Promise<T> {
  const result = await chrome.storage.sync.get(key);
  return result[key] ?? fallback;
}

async function setSync<T>(key: string, value: T): Promise<void> {
  await chrome.storage.sync.set({ [key]: value });
}

const SESSIONS_KEY = 'sessions';
const AUTO_SAVE_META_KEY = 'autoSaveMeta';
const SETTINGS_KEY = 'settings';

export const sessionsStorage = {
  getValue: () => getLocal<Session[]>(SESSIONS_KEY, []),
  setValue: (sessions: Session[]) => setLocal(SESSIONS_KEY, sessions),
  watch: (callback: (sessions: Session[]) => void) => {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'local' && changes[SESSIONS_KEY]) {
        callback(changes[SESSIONS_KEY].newValue ?? []);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  },
};

export const autoSaveMetaStorage = {
  getValue: () =>
    getLocal<AutoSaveMetadata>(AUTO_SAVE_META_KEY, {
      lastAutoSaveAt: null,
      lastAutoSaveSessionId: null,
    }),
  setValue: (meta: AutoSaveMetadata) => setLocal(AUTO_SAVE_META_KEY, meta),
};

export const settingsStorage = {
  getValue: () => getSync<UserSettings>(SETTINGS_KEY, DEFAULT_SETTINGS),
  setValue: (settings: UserSettings) => setSync(SETTINGS_KEY, settings),
  watch: (callback: (settings: UserSettings | null) => void) => {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'sync' && changes[SETTINGS_KEY]) {
        callback(changes[SETTINGS_KEY].newValue ?? null);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  },
};
