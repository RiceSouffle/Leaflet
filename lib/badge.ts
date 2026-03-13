export async function updateBadge(): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const count = tabs.length;
    await chrome.action.setBadgeText({ text: count.toString() });
    await chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
  } catch {
    // Ignore errors when no window is focused
  }
}
