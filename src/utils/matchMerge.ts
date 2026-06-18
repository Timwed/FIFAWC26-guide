import type { MatchEvent, StaticGoal } from '../types';
import type { OpenLigaMatch } from '../api/openligadb';
import { lookupTeam } from './teamLookup';

export interface MatchScorePatch {
  idEvent: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
}

export interface MatchLike {
  idEvent: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
}

function statusRank(match: MatchScorePatch): number {
  if (match.strStatus === 'FT') return 4;
  if (match.strStatus && match.strStatus !== 'NS') return 3;
  if (match.intHomeScore !== null || match.intAwayScore !== null) return 2;
  return 1;
}

function betterMatch(a: MatchScorePatch | undefined, b: MatchScorePatch): MatchScorePatch {
  if (!a) return b;
  const ar = statusRank(a);
  const br = statusRank(b);
  if (br > ar) return b;
  if (br < ar) return a;
  if (b.intHomeScore !== null && a.intHomeScore === null) return b;
  return b;
}

export function buildMatchPatchMap(season: MatchEvent[], past: MatchEvent[]): Map<string, MatchScorePatch> {
  const map = new Map<string, MatchScorePatch>();
  for (const event of [...season, ...past]) {
    const patch: MatchScorePatch = {
      idEvent: event.idEvent,
      intHomeScore: event.intHomeScore,
      intAwayScore: event.intAwayScore,
      strStatus: event.strStatus,
    };
    map.set(event.idEvent, betterMatch(map.get(event.idEvent), patch));
  }
  return map;
}

export function mergeMatchPatches<T extends MatchLike>(matches: T[], patches: Map<string, MatchScorePatch>): T[] {
  return matches.map((match) => {
    const patch = patches.get(match.idEvent);
    return patch
      ? { ...match, intHomeScore: patch.intHomeScore, intAwayScore: patch.intAwayScore, strStatus: patch.strStatus }
      : match;
  });
}

export function buildOpenLigaGoals(olm: OpenLigaMatch, homeTeamName: string): StaticGoal[] {
  const home = lookupTeam(homeTeamName);
  const team1IsHome = home ? olm.team1.shortName === home.shortName : true;
  let lastH = 0;
  const goals: StaticGoal[] = [];
  for (const goal of olm.goals) {
    const homeScore = team1IsHome ? goal.scoreTeam1 : goal.scoreTeam2;
    const awayScore = team1IsHome ? goal.scoreTeam2 : goal.scoreTeam1;
    const team: 'home' | 'away' = homeScore > lastH ? 'home' : 'away';
    goals.push({
      team,
      name: goal.goalGetterName || '',
      minute: goal.matchMinute,
      homeScore,
      awayScore,
      isPenalty: !!goal.isPenalty,
      isOwnGoal: !!goal.isOwnGoal,
    });
    lastH = homeScore;
  }
  return goals;
}
