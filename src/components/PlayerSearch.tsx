import { useState, useRef, useCallback } from 'react';
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
    setOpen(r.length > 0);
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
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索球员..."
            className="w-full rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none ring-1 ring-white/10 focus:ring-sky-400/50"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            title="搜索球员"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        {expanded && (
          <button
            onClick={close}
            className="rounded-lg p-1 text-slate-400 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute right-0 top-full mt-1 w-72 overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-xl">
          {results.map((p, i) => (
            <button
              key={`${p.teamCode}-${p.name}`}
              onClick={() => select(p)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                i === selectedIdx ? 'bg-sky-500/20' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-lg w-7 text-center">{p.teamFlag}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {p.cnName && <span>{p.cnName} </span>}
                  <span className="text-slate-400">{p.enName}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {p.teamCn} · {p.position} · #{p.number}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-white/10 bg-slate-800 px-4 py-3 text-sm text-slate-400 shadow-xl">
          未找到匹配的球员
        </div>
      )}
    </div>
  );
}
