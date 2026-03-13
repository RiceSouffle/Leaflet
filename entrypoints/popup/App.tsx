import { useSessions } from '@/hooks/useSessions';
import { useSearch } from '@/hooks/useSearch';
import { useDarkMode } from '@/hooks/useDarkMode';
import { SaveButton } from '@/components/SaveButton';
import { SearchBar } from '@/components/SearchBar';
import { SessionList } from '@/components/SessionList';
import { ImportExportButtons } from '@/components/ImportExportButtons';

function App() {
  const {
    sessions,
    loading,
    saveCurrentSession,
    deleteSession,
    restoreSession,
    renameSession,
    importSessions,
    exportSessions,
  } = useSessions();

  const { query, setQuery, filteredSessions } = useSearch(sessions);
  const { darkMode, toggleDarkMode } = useDarkMode();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full dark:bg-gray-900">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">Leaflet</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">{sessions.length} saved</span>
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <SaveButton onSave={saveCurrentSession} />
      </div>

      {/* Search */}
      {sessions.length > 0 && (
        <div className="px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>
      )}

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <SessionList
          sessions={filteredSessions}
          searching={query.length > 0}
          onRestore={restoreSession}
          onDelete={deleteSession}
          onRename={renameSession}
        />
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
        <ImportExportButtons onExport={exportSessions} onImport={importSessions} />
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default App;
