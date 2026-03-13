import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  extensionApi: 'chrome',
  manifest: {
    name: 'Leaflet',
    description: 'Save, restore, and manage your browser tab sessions with one click',
    version: '1.0.0',
    permissions: ['tabs', 'storage', 'alarms', 'favicon'],
    commands: {
      'save-session': {
        suggested_key: {
          default: 'Ctrl+Shift+S',
          mac: 'Command+Shift+S',
        },
        description: 'Save current session',
      },
      'restore-last-session': {
        suggested_key: {
          default: 'Ctrl+Shift+R',
          mac: 'Command+Shift+R',
        },
        description: 'Restore most recent session',
      },
    },
  },
});
