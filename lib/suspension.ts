export async function checkAndSuspendInactiveTabs(idleMinutes: number): Promise<void> {
  const tabs = await chrome.tabs.query({});
  const threshold = Date.now() - idleMinutes * 60 * 1000;

  for (const tab of tabs) {
    if (
      tab.id &&
      !tab.active &&
      !tab.audible &&
      !tab.discarded &&
      !tab.pinned &&
      tab.lastAccessed &&
      tab.lastAccessed < threshold
    ) {
      try {
        await chrome.tabs.discard(tab.id);
      } catch {
        // Tab may have been closed between query and discard
      }
    }
  }
}
