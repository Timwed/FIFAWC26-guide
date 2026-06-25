import type { Team, Player, MatchEvent } from '../types';

const API_KEY = import.meta.env.VITE_TSDB_KEY || '123';
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const WC_LEAGUE_ID = '4429';
const WC_SEASON = '2026';
const FETCH_TIMEOUT = 8000;

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchAllTeams(): Promise<Team[]> {
  const data = await fetchJson<{ teams?: Team[] }>(`${BASE}/search_all_teams.php?l=FIFA_World_Cup`, {});
  return data.teams || [];
}

export async function fetchTeam(id: string): Promise<Team | null> {
  const data = await fetchJson<{ teams?: Team[] }>(`${BASE}/lookupteam.php?id=${id}`, {});
  return data.teams?.[0] || null;
}

export async function fetchTeamPlayers(teamId: string): Promise<Player[]> {
  const data = await fetchJson<{ players?: Player[] }>(`${BASE}/lookup_all_players.php?id=${teamId}`, {});
  return data.players || [];
}

export async function fetchSeasonEvents(): Promise<MatchEvent[]> {
  const data = await fetchJson<{ events?: MatchEvent[] }>(`${BASE}/eventsseason.php?id=${WC_LEAGUE_ID}&s=${WC_SEASON}`, {});
  return data.events || [];
}

export async function fetchNextEvents(): Promise<MatchEvent[]> {
  const data = await fetchJson<{ events?: MatchEvent[] }>(`${BASE}/eventsnextleague.php?id=${WC_LEAGUE_ID}`, {});
  return data.events || [];
}

export async function fetchPastEvents(): Promise<MatchEvent[]> {
  const data = await fetchJson<{ events?: MatchEvent[] }>(`${BASE}/eventspastleague.php?id=${WC_LEAGUE_ID}`, {});
  return data.events || [];
}

export async function fetchEvent(id: string): Promise<MatchEvent | null> {
  const data = await fetchJson<{ events?: MatchEvent[] }>(`${BASE}/lookupevent.php?id=${id}`, {});
  return data.events?.[0] || null;
}
