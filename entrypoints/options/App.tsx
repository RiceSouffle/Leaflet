import { useSettings } from '@/hooks/useSettings';
import { useDarkMode } from '@/hooks/useDarkMode';

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </label>
  );
}

function NumberInput({
  label,
  description,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n) && n >= min && n <= max) onChange(n);
          }}
          className="w-16 text-sm text-right px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

function App() {
  const { settings, loading, updateSettings } = useSettings();
  useDarkMode();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Leaflet</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Configure your session management preferences</p>

      {/* Appearance section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Appearance</h2>
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <Toggle
            label="Dark mode"
            description="Use a dark color scheme"
            checked={settings.darkMode}
            onChange={(val) => updateSettings({ darkMode: val })}
          />
        </div>
      </section>

      {/* Auto-save section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Auto-save</h2>
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <Toggle
            label="Enable auto-save"
            description="Automatically save your current tabs at regular intervals"
            checked={settings.autoSaveEnabled}
            onChange={(val) => updateSettings({ autoSaveEnabled: val })}
          />
          {settings.autoSaveEnabled && (
            <NumberInput
              label="Save interval"
              description="How often to auto-save your session"
              value={settings.autoSaveIntervalMinutes}
              min={1}
              max={60}
              suffix="min"
              onChange={(val) => updateSettings({ autoSaveIntervalMinutes: val })}
            />
          )}
        </div>
      </section>

      {/* Tab suspension section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Tab Suspension</h2>
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <Toggle
            label="Enable tab suspension"
            description="Automatically suspend inactive tabs to free up memory"
            checked={settings.suspensionEnabled}
            onChange={(val) => updateSettings({ suspensionEnabled: val })}
          />
          {settings.suspensionEnabled && (
            <NumberInput
              label="Idle threshold"
              description="Suspend tabs that have been inactive for this long"
              value={settings.suspensionIdleMinutes}
              min={5}
              max={120}
              suffix="min"
              onChange={(val) => updateSettings({ suspensionIdleMinutes: val })}
            />
          )}
        </div>
      </section>

      {/* General section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">General</h2>
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <NumberInput
            label="Max sessions"
            description="Maximum number of sessions to keep stored"
            value={settings.maxSessionsToKeep}
            min={10}
            max={500}
            suffix="sessions"
            onChange={(val) => updateSettings({ maxSessionsToKeep: val })}
          />
          <Toggle
            label="Open in new window"
            description="Restore sessions in a new window by default"
            checked={settings.openInNewWindow}
            onChange={(val) => updateSettings({ openInNewWindow: val })}
          />
        </div>
      </section>

      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Keyboard shortcuts: <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs border dark:border-gray-600 dark:text-gray-300">Ctrl+Shift+S</kbd> Save
          {' '}<kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs border dark:border-gray-600 dark:text-gray-300">Ctrl+Shift+R</kbd> Restore
        </p>
      </div>
    </div>
  );
}

export default App;
