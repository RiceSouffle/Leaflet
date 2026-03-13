import { settingsStorage, autoSaveMetaStorage } from '@/lib/storage';
import { saveCurrentSession, trimSessions } from '@/lib/sessions';
import { updateBadge } from '@/lib/badge';
import { checkAndSuspendInactiveTabs } from '@/lib/suspension';
import { restoreSession } from '@/lib/tabs';
import { sessionsStorage } from '@/lib/storage';
import {
  AUTO_SAVE_ALARM_NAME,
  SUSPENSION_ALARM_NAME,
  SUSPENSION_CHECK_INTERVAL_MINUTES,
} from '@/lib/constants';

async function setupAutoSaveAlarm(intervalMinutes: number) {
  await chrome.alarms.clear(AUTO_SAVE_ALARM_NAME);
  await chrome.alarms.create(AUTO_SAVE_ALARM_NAME, {
    periodInMinutes: Math.max(1, intervalMinutes),
  });
}

async function setupSuspensionAlarm() {
  await chrome.alarms.clear(SUSPENSION_ALARM_NAME);
  await chrome.alarms.create(SUSPENSION_ALARM_NAME, {
    periodInMinutes: SUSPENSION_CHECK_INTERVAL_MINUTES,
  });
}

async function performAutoSave() {
  try {
    const timestamp = new Date().toLocaleString();
    const session = await saveCurrentSession(`Auto-save ${timestamp}`);
    await autoSaveMetaStorage.setValue({
      lastAutoSaveAt: Date.now(),
      lastAutoSaveSessionId: session.id,
    });
    const settings = await settingsStorage.getValue();
    await trimSessions(settings.maxSessionsToKeep);
  } catch {
    // Auto-save may fail if no window is open
  }
}

async function restoreLastSession() {
  const sessions = await sessionsStorage.getValue();
  if (sessions.length > 0) {
    const settings = await settingsStorage.getValue();
    await restoreSession(sessions[0], settings.openInNewWindow);
  }
}

export default defineBackground(() => {
  // Initialize on install/update
  chrome.runtime.onInstalled.addListener(async () => {
    await updateBadge();
    const settings = await settingsStorage.getValue();
    if (settings.autoSaveEnabled) {
      await setupAutoSaveAlarm(settings.autoSaveIntervalMinutes);
    }
    if (settings.suspensionEnabled) {
      await setupSuspensionAlarm();
    }
  });

  // Handle alarms
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === AUTO_SAVE_ALARM_NAME) {
      await performAutoSave();
    }
    if (alarm.name === SUSPENSION_ALARM_NAME) {
      const settings = await settingsStorage.getValue();
      if (settings.suspensionEnabled) {
        await checkAndSuspendInactiveTabs(settings.suspensionIdleMinutes);
      }
    }
  });

  // Keyboard shortcuts
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'save-session') {
      await saveCurrentSession(`Quick Save ${new Date().toLocaleString()}`);
    }
    if (command === 'restore-last-session') {
      await restoreLastSession();
    }
  });

  // Badge updates on tab changes
  chrome.tabs.onCreated.addListener(() => updateBadge());
  chrome.tabs.onRemoved.addListener(() => updateBadge());
  chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
    if (changeInfo.status === 'complete') updateBadge();
  });
  chrome.windows.onFocusChanged.addListener(() => updateBadge());

  // React to settings changes
  settingsStorage.watch(async (newSettings) => {
    if (!newSettings) return;
    if (newSettings.autoSaveEnabled) {
      await setupAutoSaveAlarm(newSettings.autoSaveIntervalMinutes);
    } else {
      await chrome.alarms.clear(AUTO_SAVE_ALARM_NAME);
    }
    if (newSettings.suspensionEnabled) {
      await setupSuspensionAlarm();
    } else {
      await chrome.alarms.clear(SUSPENSION_ALARM_NAME);
    }
  });
});
