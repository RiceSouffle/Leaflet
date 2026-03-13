import { useSessions } from '@/hooks/useSessions';
import { useSearch } from '@/hooks/useSearch';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-gray-900">Tab Session Manager</h1>
          <span className="text-xs text-gray-400">{sessions.length} saved</span>
        </div>
        <SaveButton onSave={saveCurrentSession} />
      </div>

      {/* Search */}
      {sessions.length > 0 && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
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
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
        <ImportExportButtons onExport={exportSessions} onImport={importSessions} />
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default App;
