import { useState, useRef, useEffect } from 'react';
import type { Session } from '@/lib/types';
import { TabFavicons } from './TabFavicons';
import { ConfirmDialog } from './ConfirmDialog';

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60) return rtf.format(-seconds, 'second');
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');
  const months = Math.round(days / 30);
  return rtf.format(-months, 'month');
}

interface SessionCardProps {
  session: Session;
  onRestore: (session: Session, inNewWindow?: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function SessionCard({ session, onRestore, onDelete, onRename }: SessionCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(session.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleRename = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== session.name) {
      onRename(session.id, trimmed);
    }
    setEditing(false);
    setEditName(session.name);
  };

  return (
    <div className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all">
      {confirming && (
        <ConfirmDialog
          message={`Delete "${session.name}"?`}
          onConfirm={() => {
            onDelete(session.id);
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setEditing(false);
                  setEditName(session.name);
                }
              }}
              className="text-sm font-medium w-full px-1 py-0.5 border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-indigo-500"
            />
          ) : (
            <h3
              className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
              onDoubleClick={() => setEditing(true)}
              title="Double-click to rename"
            >
              {session.name}
            </h3>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatRelativeTime(session.createdAt)}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onRestore(session, false)}
            className="p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="Restore in current window"
            aria-label="Restore session"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => onRestore(session, true)}
            className="p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="Restore in new window"
            aria-label="Restore in new window"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-500"
            title="Delete session"
            aria-label="Delete session"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <TabFavicons tabs={session.tabs} />
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 whitespace-nowrap">
          {session.tabs.length} {session.tabs.length === 1 ? 'tab' : 'tabs'}
        </span>
      </div>
    </div>
  );
}
