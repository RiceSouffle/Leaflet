export interface SavedTab {
  url: string;
  title: string;
  favicon: string;
  pinned: boolean;
  groupId: number;
}

export interface Session {
  id: string;
  name: string;
  tabs: SavedTab[];
  createdAt: number;
  updatedAt: number;
}

export interface UserSettings {
  autoSaveEnabled: boolean;
  autoSaveIntervalMinutes: number;
  suspensionEnabled: boolean;
  suspensionIdleMinutes: number;
  maxSessionsToKeep: number;
  openInNewWindow: boolean;
  darkMode: boolean;
}

export interface AutoSaveMetadata {
  lastAutoSaveAt: number | null;
  lastAutoSaveSessionId: string | null;
}

export interface ExportPayload {
  version: 1;
  exportedAt: number;
  sessions: Session[];
}
