# Leaflet

A Chrome extension that lets you save, restore, and manage your browser tab sessions with one click.

## Features

- **Save sessions** — capture all open tabs in your current window
- **Restore sessions** — reopen tabs in the current or a new window
- **Search & filter** — find sessions by name, tab title, or URL
- **Auto-save** — automatically save tabs at a configurable interval
- **Tab suspension** — discard inactive tabs to free memory
- **Keyboard shortcuts** — `Cmd+Shift+S` to save, `Cmd+Shift+R` to restore
- **Export/Import** — back up your sessions as JSON
- **Inline rename** — double-click any session name to edit it
- **Favicon previews** — see tab icons at a glance
- **Tab count badge** — shows your current tab count on the extension icon

## Getting Started

```bash
npm install
npm run dev
```

Then load the extension in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked** and select the `.output/chrome-mv3` folder

## Build for Production

```bash
npm run build
```

## Package for Chrome Web Store

```bash
npm run zip
```

## Tech Stack

- [WXT](https://wxt.dev) — extension framework with hot reload
- React 19 + TypeScript
- Tailwind CSS 3
- Chrome Storage API (Manifest V3)
