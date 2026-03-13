import { useRef, useState } from 'react';
import type { ExportPayload, Session } from '@/lib/types';

interface ImportExportButtonsProps {
  onExport: () => void;
  onImport: (sessions: Session[]) => Promise<number>;
}

export function ImportExportButtons({ onExport, onImport }: ImportExportButtonsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data: ExportPayload = JSON.parse(text);

      if (!data.sessions || !Array.isArray(data.sessions)) {
        setStatus('Invalid file format');
        return;
      }

      // Basic validation
      const valid = data.sessions.every(
        (s) => s.id && s.name && Array.isArray(s.tabs) && s.createdAt,
      );
      if (!valid) {
        setStatus('Invalid session data');
        return;
      }

      const count = await onImport(data.sessions);
      setStatus(`Imported ${count} sessions`);
    } catch {
      setStatus('Failed to import file');
    }

    setTimeout(() => setStatus(null), 2000);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        Import
      </button>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <button
        onClick={onExport}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        Export
      </button>
      {status && <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-1">{status}</span>}
    </div>
  );
}
