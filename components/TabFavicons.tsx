import type { SavedTab } from '@/lib/types';

const MAX_FAVICONS = 6;

export function TabFavicons({ tabs }: { tabs: SavedTab[] }) {
  const displayed = tabs.slice(0, MAX_FAVICONS);
  const remaining = tabs.length - MAX_FAVICONS;

  return (
    <div className="flex items-center gap-0.5">
      {displayed.map((tab, i) => (
        <img
          key={i}
          src={tab.favicon || `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}&sz=16`}
          alt=""
          className="w-4 h-4 rounded-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="%23e2e8f0"/><text x="8" y="12" text-anchor="middle" font-size="10" fill="%2394a3b8">?</text></svg>';
          }}
        />
      ))}
      {remaining > 0 && (
        <span className="text-xs text-gray-400 ml-1">+{remaining}</span>
      )}
    </div>
  );
}
