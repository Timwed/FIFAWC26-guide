import { fetchPastEvents, fetchSeasonEvents } from '../api/thesportsdb';
import { fetchAllMatches } from '../api/openligadb';
import { buildMatchPatchMap, buildOpenLigaGoals } from './matchMerge';
import { lookupTeam } from './teamLookup';
import { cache } from './cache';
import type { OpenLigaMatch } from '../api/openligadb';
import type { StaticGoal } from '../types';
import type { MatchScorePatch } from './matchMerge';

const OPENLIGA_TTL = 5 * 60_000;
const MATCH_SCORE_TTL = 30_000;
let matchScorePatchesPromise: Promise<Map<string, MatchScorePatch>> | null = null;
let matchScorePatchesAt = 0;
let openLigaMatchesPromise: Promise<OpenLigaMatch[]> | null = null;
let openLigaMatchesAt = 0;

export function fetchMatchScorePatches(force = false): Promise<Map<string, MatchScorePatch>> {
  if (!force && matchScorePatchesPromise && Date.now() - matchScorePatchesAt < MATCH_SCORE_TTL) return matchScorePatchesPromise;
  matchScorePatchesPromise = Promise.all([
    fetchSeasonEvents(),
    fetchPastEvents(),
  ])
    .then(([season, past]) => {
      matchScorePatchesAt = Date.now();
      return buildMatchPatchMap(season, past);
    })
    .catch((err) => {
      matchScorePatchesPromise = null;
      throw err;
    });
  return matchScorePatchesPromise;
}

export async function fetchSeasonScorePatches(): Promise<Map<string, MatchScorePatch>> {
  const season = await fetchSeasonEvents();
  return buildMatchPatchMap(season, []);
}

export function fetchOpenLigaMatches(force = false): Promise<OpenLigaMatch[]> {
  if (!force && openLigaMatchesPromise && Date.now() - openLigaMatchesAt < OPENLIGA_TTL) {
    return openLigaMatchesPromise;
  }
  const cached = force ? null : cache.getBulkMatches() as OpenLigaMatch[] | null;
  if (cached && !openLigaMatchesPromise) {
    openLigaMatchesPromise = Promise.resolve(cached);
    openLigaMatchesAt = Date.now();
    return openLigaMatchesPromise;
  }
  openLigaMatchesPromise = fetchAllMatches()
    .then((matches) => {
      if (matches.length > 0) cache.setBulkMatches(matches);
      openLigaMatchesAt = Date.now();
      return matches;
    })
    .catch((err) => {
      openLigaMatchesPromise = null;
      throw err;
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
