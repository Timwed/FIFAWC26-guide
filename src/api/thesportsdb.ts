import type { Team, Player, MatchEvent } from '../types';

const BASE = 'https://www.thesportsdb.com/api/v1/json/123';
const WC_LEAGUE_ID = '4429';
const WC_SEASON = '2026';

export async function fetchAllTeams(): Promise<Team[]> {
  const res = await fetch(`${BASE}/search_all_teams.php?l=FIFA_World_Cup`);
  const data = await res.json();
  return data.teams || [];
}

export async function fetchTeam(id: string): Promise<Team | null> {
  const res = await fetch(`${BASE}/lookupteam.php?id=${id}`);
  const data = await res.json();
  return data.teams?.[0] || null;
}

export async function fetchTeamPlayers(teamId: string): Promise<Player[]> {
  const res = await fetch(`${BASE}/lookup_all_players.php?id=${teamId}`);
  const data = await res.json();
  return data.players || [];
}

export async function fetchSeasonEvents(): Promise<MatchEvent[]> {
  const res = await fetch(`${BASE}/eventsseason.php?id=${WC_LEAGUE_ID}&s=${WC_SEASON}`);
  const data = await res.json();
  return data.events || [];
}

export async function fetchNextEvents(): Promise<MatchEvent[]> {
  const res = await fetch(`${BASE}/eventsnextleague.php?id=${WC_LEAGUE_ID}`);
  const data = await res.json();
  return data.events || [];
}

export async function fetchPastEvents(): Promise<MatchEvent[]> {
  const res = await fetch(`${BASE}/eventspastleague.php?id=${WC_LEAGUE_ID}`);
  const data = await res.json();
  return data.events || [];
}

export async function fetchEvent(id: string): Promise<MatchEvent | null> {
  const res = await fetch(`${BASE}/lookupevent.php?id=${id}`);
  const data = await res.json();
  return data.events?.[0] || null;
}
