import { fetchPastEvents, fetchSeasonEvents } from '../api/thesportsdb';
import { fetchAllMatches } from '../api/openligadb';
import { buildMatchPatchMap, buildOpenLigaGoals } from './matchMerge';
import { lookupTeam } from './teamLookup';
import { cache } from './cache';
import type { OpenLigaMatch } from '../api/openligadb';
import type { StaticGoal } from '../types';
import type { MatchScorePatch } from './matchMerge';

let matchScorePatchesPromise: Promise<Map<string, MatchScorePatch>> | null = null;
let openLigaMatchesPromise: Promise<OpenLigaMatch[]> | null = null;

export function fetchMatchScorePatches(force = false): Promise<Map<string, MatchScorePatch>> {
  if (!force && matchScorePatchesPromise) return matchScorePatchesPromise;
  matchScorePatchesPromise = Promise.all([
    fetchSeasonEvents(),
    fetchPastEvents(),
  ]).then(([season, past]) => buildMatchPatchMap(season, past));
  return matchScorePatchesPromise;
}

export async function fetchSeasonScorePatches(): Promise<Map<string, MatchScorePatch>> {
  const season = await fetchSeasonEvents();
  return buildMatchPatchMap(season, []);
}

export function fetchOpenLigaMatches(force = false): Promise<OpenLigaMatch[]> {
  if (!force && openLigaMatchesPromise) return openLigaMatchesPromise;
  const cached = force ? null : cache.getBulkMatches() as OpenLigaMatch[] | null;
  if (cached) {
    openLigaMatchesPromise = Promise.resolve(cached);
    return openLigaMatchesPromise;
  }
  openLigaMatchesPromise = fetchAllMatches().then((matches) => {
    if (matches.length > 0) cache.setBulkMatches(matches);
    return matches;
  });
  return openLigaMatchesPromise;
}

export function findOpenLigaMatch(
  matches: OpenLigaMatch[],
  homeTeamName: string,
  awayTeamName: string,
  timestamp?: string | null
): OpenLigaMatch | undefined {
  const home = lookupTeam(homeTeamName);
  const away = lookupTeam(awayTeamName);
  const homeSC = home?.shortName;
  const awaySC = away?.shortName;
  return matches.find(
    (match) =>
      (homeSC && awaySC &&
        ((match.team1.shortName === homeSC && match.team2.shortName === awaySC) ||
         (match.team1.shortName === awaySC && match.team2.shortName === homeSC))) ||
      (timestamp &&
        Math.abs(new Date(match.matchDateTimeUTC).getTime() - new Date(timestamp).getTime()) < 3600000)
  );
}

export async function fetchOpenLigaGoalsForMatch(
  homeTeamName: string,
  awayTeamName: string,
  timestamp?: string | null
): Promise<StaticGoal[]> {
  const match = findOpenLigaMatch(await fetchOpenLigaMatches(), homeTeamName, awayTeamName, timestamp);
  return match && match.goals.length > 0 ? buildOpenLigaGoals(match, homeTeamName) : [];
}
