import type { SavedTab, Session } from './types';

export async function captureCurrentWindowTabs(): Promise<SavedTab[]> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter((tab) => tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'))
    .map((tab) => ({
      url: tab.url!,
      title: tab.title || '',
      favicon: tab.favIconUrl || '',
      pinned: tab.pinned || false,
      groupId: tab.groupId ?? -1,
    }));
}

export async function restoreSession(session: Session, inNewWindow: boolean): Promise<void> {
  const validTabs = session.tabs.filter(
    (tab) => !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://'),
  );

  if (validTabs.length === 0) return;

  if (inNewWindow) {
    const window = await chrome.windows.create({ url: validTabs[0].url, focused: true });
    const firstTabId = window.tabs?.[0]?.id;

    for (let i = 1; i < validTabs.length; i++) {
      const tab = validTabs[i];
      const created = await chrome.tabs.create({
        windowId: window.id,
        url: tab.url,
        pinned: tab.pinned,
        active: false,
      });
      if (tab.pinned && created.id) {
        await chrome.tabs.update(created.id, { pinned: true });
      }
    }

    // Pin the first tab if needed
    if (validTabs[0].pinned && firstTabId) {
      await chrome.tabs.update(firstTabId, { pinned: true });
    }
  } else {
    for (const tab of validTabs) {
      await chrome.tabs.create({
        url: tab.url,
        pinned: tab.pinned,
        active: false,
      });
    }
  }
}
