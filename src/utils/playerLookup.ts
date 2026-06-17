import squadsData from '../data/squads.json';
import teamsData from '../data/teams.json';
import playerNamesData from '../data/player-names.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
}

const teams = teamsData as TeamEntry[];
const teamMap = new Map<string, string>();
for (const t of teams) {
  teamMap.set(t.enName, t.shortName);
}

interface SquadTeam {
  name: string;
  players: { name: string }[];
}

const squads = squadsData as SquadTeam[];

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export interface PlayerInfo {
  teamCode: string;
  exactName: string;
  cnName: string | null;
}

const playerIndex = new Map<string, PlayerInfo>();
const teamPlayers = new Map<string, Array<{ key: string; info: PlayerInfo; parts: string[] }>>();

for (const team of squads) {
  const teamCode = teamMap.get(team.name);
  if (!teamCode) continue;
  const entries: Array<{ key: string; info: PlayerInfo; parts: string[] }> = [];
  for (const p of team.players) {
    const key = normalize(p.name);
    if (!playerIndex.has(key)) {
      const cn = (playerNamesData as Record<string, string>)[p.name] || null;
      const info = { teamCode, exactName: p.name, cnName: cn };
      playerIndex.set(key, info);
      entries.push({ key, info, parts: key.split(' ').filter(Boolean) });
    }
  }
  teamPlayers.set(teamCode, entries);
}

/** try reversed word order for Korean/etc names, and "Last, First" format */
function tryReversed(key: string): PlayerInfo | undefined {
  const cleaned = key.replace(/,/g, '');
  const parts = cleaned.split(' ');
  if (parts.length < 2) return undefined;
  return playerIndex.get(parts.reverse().join(' '));
}

/** OpenLigaDB player name typos → correct squads.json name */
const olgTypos: Record<string, string> = {
  'keito nakamuro': 'Keito Nakamura',
  'cyrensio summerville': 'Crysencio Summerville',
};

export function lookupPlayer(
  olgName: string | null | undefined
): PlayerInfo | null {
  if (!olgName) return null;
  const key = normalize(olgName.trim());
  const direct = playerIndex.get(key);
  if (direct) return direct;
  const reversed = tryReversed(key);
  if (reversed) return reversed;
  const corrected = olgTypos[key];
  if (corrected) return playerIndex.get(normalize(corrected)) ?? null;
  return null;
}

function lookupInTeam(olgName: string, teamCode: string): PlayerInfo | null {
  const entry = lookupPlayer(olgName);
  if (entry) return entry;

  const roster = teamPlayers.get(teamCode);
  if (!roster) return null;

  const raw = normalize(olgName.trim())
    .replace(/,/g, '')
    .replace(/\./g, '');
  const olgParts = raw.split(' ').filter(Boolean);
  if (olgParts.length === 0) return null;

  // Direct match after removing commas/dots
  const cleaned = olgParts.join(' ');
  const cleanedMatch = playerIndex.get(cleaned);
  if (cleanedMatch && cleanedMatch.teamCode === teamCode) return cleanedMatch;

  // "Last, First" → "First Last"
  if (olgParts.length >= 2) {
    const alt = [...olgParts.slice(1), olgParts[0]].join(' ');
    const altMatch = playerIndex.get(alt);
    if (altMatch && altMatch.teamCode === teamCode) return altMatch;
  }

  // Fuzzy match: full-word matches + initial-letter matches
  const olgFull = new Set(olgParts.filter((p) => p.length > 1));
  const olgInitials = new Set(olgParts.filter((p) => p.length === 1));

  let best: PlayerInfo | null = null;
  let bestScore = 0;
  let bestMatchPart = '';

  const FULL_WEIGHT = 10;
  for (const { info, parts } of roster) {
    let score = 0;
    let matchedPart = '';
    for (const p of parts) {
      if (olgFull.has(p)) { score += FULL_WEIGHT; matchedPart = p; }
      else if (p.length > 0 && olgInitials.has(p[0])) score += 1;
    }
    if (score > bestScore) {
      best = info;
      bestScore = score;
      bestMatchPart = matchedPart;
    }
  }

  if (bestScore >= FULL_WEIGHT + 1) return best;

  // Single full-word match — accept iff that word is unique in this team
  if (bestScore === FULL_WEIGHT && bestMatchPart) {
    let count = 0;
    for (const { parts: ps } of roster) {
      if (ps.includes(bestMatchPart)) count++;
    }
    if (count === 1) return best;
  }

  return null;
}

export function lookupGoalScorer(
  olgName: string | null | undefined,
  teamCode: string | null | undefined
): PlayerInfo | null {
  if (!olgName) return null;
  const exact = lookupPlayer(olgName);
  if (exact) return exact;
  if (teamCode) return lookupInTeam(olgName, teamCode);
  return null;
}

export function lookupPlayerByExactName(exactName: string): PlayerInfo | null {
  const key = normalize(exactName);
  return playerIndex.get(key) ?? null;
}
