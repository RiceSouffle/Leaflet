import { useState, useMemo } from 'react';
import type { Session } from '@/lib/types';

export function useSearch(sessions: Session[]) {
  const [query, setQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!query.trim()) return sessions;

    const lower = query.toLowerCase();
    return sessions.filter(
      (session) =>
        session.name.toLowerCase().includes(lower) ||
        session.tabs.some(
          (tab) => tab.title.toLowerCase().includes(lower) || tab.url.toLowerCase().includes(lower),
        ),
    );
  }, [sessions, query]);

  return { query, setQuery, filteredSessions };
}
