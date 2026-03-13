import type { UserSettings } from './types';

export const DEFAULT_SETTINGS: UserSettings = {
  autoSaveEnabled: false,
  autoSaveIntervalMinutes: 5,
  suspensionEnabled: false,
  suspensionIdleMinutes: 30,
  maxSessionsToKeep: 100,
  openInNewWindow: false,
};

export const AUTO_SAVE_ALARM_NAME = 'auto-save-session';
export const SUSPENSION_ALARM_NAME = 'check-inactive-tabs';
export const SUSPENSION_CHECK_INTERVAL_MINUTES = 1;
export const MAX_AUTO_SAVES = 5;
