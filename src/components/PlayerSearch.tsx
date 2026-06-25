import { useId, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPlayers } from '../utils/playerSearch';
import type { SearchPlayer } from '../utils/playerSearch';

export default function PlayerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPlayer[]>([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const idPrefix = useId().replace(/:/g, '');
  const listboxId = `${idPrefix}-player-search-results`;
  const navigate = useNavigate();

  const handleQuery = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length < 1) {
      setResults([]);
      setOpen(false);
      setSelectedIdx(-1);
      return;
    }
    const r = searchPlayers(value, 8);
    setResults(r);
    setOpen(true);
    setSelectedIdx(-1);
  }, []);

  const close = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setSelectedIdx(-1);
    setExpanded(false);
  };

  const select = (player: SearchPlayer) => {
    close();
    navigate(`/players/${player.teamCode}/${encodeURIComponent(player.name)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && selectedIdx < results.length) {
        select(results[selectedIdx]);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div className="relative">
      <div className={`flex items-center gap-1 transition-all ${expanded ? 'w-56' : 'w-10'}`}>
        {expanded ? (
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="搜索球员"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={selectedIdx >= 0 ? `${idPrefix}-player-search-option-${selectedIdx}` : undefined}
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索球员..."
            className="w-full rounded-lg bg-slate-200 px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-slate-300 focus:ring-sky-500 dark:bg-white/10 dark:text-white dark:ring-white/10 dark:focus:ring-sky-400/50"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            title="搜索球员"
            aria-label="打开球员搜索"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        {expanded && (
          <button
            onClick={close}
            aria-label="关闭球员搜索"
            className="rounded-lg p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div id={listboxId} role="listbox" className="absolute right-0 top-full mt-1 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-800">
          {results.map((p, i) => (
            <button
              key={`${p.teamCode}-${p.name}`}
              id={`${idPrefix}-player-search-option-${i}`}
              role="option"
              aria-selected={i === selectedIdx}
              onClick={() => select(p)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                i === selectedIdx ? 'bg-sky-500/20' : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg w-7 text-center">{p.teamFlag}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {p.cnName && <span>{p.cnName} </span>}
                  <span className="text-slate-500 dark:text-slate-400">{p.enName}</span>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {p.teamCn} · {p.position} · #{p.number}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-xl dark:border-white/10 dark:bg-slate-800 dark:text-slate-400">
          未找到匹配的球员
        </div>
      )}
    </div>
  );
}
