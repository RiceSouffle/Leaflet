import { useState } from 'react';

interface SaveButtonProps {
  onSave: (name?: string) => Promise<void>;
}

export function SaveButton({ onSave }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
        saved
          ? 'bg-green-500 text-white'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      } disabled:opacity-50`}
    >
      {saved ? (
        <span className="flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Saved!
        </span>
      ) : saving ? (
        'Saving...'
      ) : (
        <span className="flex items-center justify-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Save Current Session
        </span>
      )}
    </button>
  );
}
