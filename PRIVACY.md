# Privacy Policy — Leaflet

**Last updated:** March 2025

## Overview

Leaflet is a Chrome extension for saving and managing browser tab sessions. Your privacy matters — Leaflet is designed to keep all your data local.

## Data Collection

Leaflet does **not** collect, transmit, or share any personal data. Period.

## Data Storage

- **Session data** (tab URLs, titles, favicons) is stored locally on your device using Chrome's `chrome.storage.local` API.
- **User preferences** (settings like auto-save interval, dark mode) are stored via `chrome.storage.sync`, which syncs across your signed-in Chrome browsers through your Google account. This is handled entirely by Chrome — Leaflet has no access to your Google account.

## Permissions

Leaflet requests the following Chrome permissions:

| Permission | Why it's needed |
|------------|----------------|
| `tabs` | Read open tab URLs and titles to save sessions |
| `storage` | Store sessions locally and sync preferences |
| `alarms` | Schedule auto-save and tab suspension checks |
| `favicon` | Display tab favicons in the session list |

## Network Requests

Leaflet makes **zero** network requests. It has no analytics, no telemetry, no ads, and no external API calls. The only network activity is Chrome's built-in favicon fetching.

## Third Parties

Leaflet does not integrate with or send data to any third-party services.

## Open Source

Leaflet is fully open source. You can audit the entire codebase at [github.com/RiceSouffle/tab-session-manager](https://github.com/RiceSouffle/tab-session-manager).

## Contact

For questions about this privacy policy, open an issue on the [GitHub repository](https://github.com/RiceSouffle/tab-session-manager/issues).
