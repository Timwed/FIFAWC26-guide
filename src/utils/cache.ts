import type { StaticGoal } from '../types';

const PREFIX = 'wc26_cache_';

interface CacheEntry<T> {
  data: T;
  at: number;
}

function set<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, at: Date.now() };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

function get<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.at > maxAgeMs) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

function clearAll(): void {
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

/** Clears only temporary caches (bulk, per-match detail) — keeps permanent event data. */
function clearTemporary(): void {
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.startsWith(PREFIX) && !k.startsWith(PREFIX + 'evt_')) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // ignore
  }
}

/** match status helpers */
function isMatchLive(status: string | null): boolean {
  return status !== null && status !== 'FT' && status !== 'NS' && status !== 'TBD';
}

function isMatchFinished(status: string | null): boolean {
  return status === 'FT';
}

function isMatchSoon(timestamp: string | null, withinHours: number): boolean {
  if (!timestamp) return false;
  const ms = Date.parse(timestamp);
  if (isNaN(ms)) return false;
  return ms - Date.now() < withinHours * 3600_000;
}

const FINISHED_TTL = 7 * 24 * 3600_000; // finished matches: 7 days
const UPCOMING_TTL = 6 * 3600_000;       // distant future: 6 hours
const SOON_TTL = 5 * 60_000;             // match starting soon: 5 min
const PERMANENT = Number.MAX_SAFE_INTEGER;
const EVENT_TTL = 60 * 60_000; // events: 1 hour to avoid stale cache

interface CachedEvent {
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  goals?: StaticGoal[];
}

export const cache = {
  get,
  set,
  remove,
  clearAll,
  clearTemporary,

  /**
   * Returns cached bulk match list if still fresh.
   * TTL is short because we don't know which individual matches changed.
   */
  getBulkMatches: () => get<unknown>('matches_bulk', 30 * 60_000),
  setBulkMatches: (data: unknown) => set('matches_bulk', data),

  /**
   * Match detail (goals etc): cache with strategy based on match status.
   * - finished → keep 7 days
   * - starting soon → keep 5 min
   * - far future → keep 6 hours
   * - live → never cache
   */
  getMatchDetail: (matchId: number, status: string | null, timestamp: string | null) => {
    if (isMatchLive(status)) return null;
    if (isMatchFinished(status)) return get<unknown>(`match_${matchId}`, FINISHED_TTL);
    if (isMatchSoon(timestamp, 6)) return get<unknown>(`match_${matchId}`, SOON_TTL);
    return get<unknown>(`match_${matchId}`, UPCOMING_TTL);
  },
  setMatchDetail: (matchId: number, data: unknown) => set(`match_${matchId}`, data),

  getEvent: (eventId: string) => get<CachedEvent>(`evt_${eventId}`, EVENT_TTL),
  setEvent: (eventId: string, data: CachedEvent) => set(`evt_${eventId}`, data),
};
