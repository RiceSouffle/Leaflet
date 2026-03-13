import type { Session } from './types';
import { sessionsStorage } from './storage';
import { captureCurrentWindowTabs } from './tabs';

export async function getSessions(): Promise<Session[]> {
  return sessionsStorage.getValue();
}

export async function saveCurrentSession(name: string): Promise<Session> {
  const tabs = await captureCurrentWindowTabs();
  const now = Date.now();
  const session: Session = {
    id: crypto.randomUUID(),
    name,
    tabs,
    createdAt: now,
    updatedAt: now,
  };

  const sessions = await sessionsStorage.getValue();
  sessions.unshift(session);
  await sessionsStorage.setValue(sessions);
  return session;
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await sessionsStorage.getValue();
  await sessionsStorage.setValue(sessions.filter((s) => s.id !== id));
}

export async function updateSessionName(id: string, name: string): Promise<void> {
  const sessions = await sessionsStorage.getValue();
  const session = sessions.find((s) => s.id === id);
  if (session) {
    session.name = name;
    session.updatedAt = Date.now();
    await sessionsStorage.setValue(sessions);
  }
}

export async function trimSessions(maxToKeep: number): Promise<void> {
  const sessions = await sessionsStorage.getValue();
  if (sessions.length > maxToKeep) {
    await sessionsStorage.setValue(sessions.slice(0, maxToKeep));
  }
}

export async function importSessions(incoming: Session[]): Promise<number> {
  const sessions = await sessionsStorage.getValue();
  const existingIds = new Set(sessions.map((s) => s.id));

  const newSessions = incoming.map((s) => ({
    ...s,
    id: existingIds.has(s.id) ? crypto.randomUUID() : s.id,
  }));

  await sessionsStorage.setValue([...newSessions, ...sessions]);
  return newSessions.length;
}
