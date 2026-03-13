import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@/lib/types';
import { sessionsStorage, settingsStorage } from '@/lib/storage';
import {
  saveCurrentSession as saveCurrent,
  deleteSession as deleteS,
  updateSessionName as renameS,
  importSessions as importS,
} from '@/lib/sessions';
import { restoreSession as restoreS } from '@/lib/tabs';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionsStorage.getValue().then((s) => {
      setSessions(s);
      setLoading(false);
    });

    const unwatch = sessionsStorage.watch((newVal) => {
      if (newVal) setSessions(newVal);
    });

    return unwatch;
  }, []);

  const saveCurrentSession = useCallback(async (name?: string) => {
    const sessionName = name || `Session ${new Date().toLocaleString()}`;
    await saveCurrent(sessionName);
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    await deleteS(id);
  }, []);

  const restoreSession = useCallback(async (session: Session, inNewWindow?: boolean) => {
    const settings = await settingsStorage.getValue();
    await restoreS(session, inNewWindow ?? settings.openInNewWindow);
  }, []);

  const renameSession = useCallback(async (id: string, name: string) => {
    await renameS(id, name);
  }, []);

  const importSessions = useCallback(async (incoming: Session[]) => {
    return importS(incoming);
  }, []);

  const exportSessions = useCallback(() => {
    const payload = {
      version: 1 as const,
      exportedAt: Date.now(),
      sessions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaflet-sessions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sessions]);

  return {
    sessions,
    loading,
    saveCurrentSession,
    deleteSession,
    restoreSession,
    renameSession,
    importSessions,
    exportSessions,
  };
}
