export function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {searching ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        )}
      </svg>
      <p className="text-sm font-medium">
        {searching ? 'No sessions match your search' : 'No saved sessions yet'}
      </p>
      <p className="text-xs mt-1">
        {searching ? 'Try a different search term' : 'Click "Save Current Session" to get started'}
      </p>
    </div>
  );
}
