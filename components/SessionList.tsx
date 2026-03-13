import type { Session } from '@/lib/types';
import { SessionCard } from './SessionCard';
import { EmptyState } from './EmptyState';

interface SessionListProps {
  sessions: Session[];
  searching: boolean;
  onRestore: (session: Session, inNewWindow?: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function SessionList({ sessions, searching, onRestore, onDelete, onRename }: SessionListProps) {
  if (sessions.length === 0) {
    return <EmptyState searching={searching} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onRestore={onRestore}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
