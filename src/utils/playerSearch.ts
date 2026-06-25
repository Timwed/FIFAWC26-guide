import squadsData from '../data/squads.json';
import teamsData from '../data/teams.json';
import playerNamesData from '../data/player-names.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
}

export interface SearchPlayer {
  name: string;       // exact English name (for URL)
  cnName: string | null;
  enName: string;     // English name
  enNameNorm: string; // pre-normalized for search
  teamCode: string;
  teamCn: string;
  teamFlag: string;
  position: string;
  number: string;
}

const teams = teamsData as TeamEntry[];
const cnNames = playerNamesData as Record<string, string>;

const teamMap = new Map<string, { code: string; cn: string; flag: string }>();
for (const t of teams) {
  teamMap.set(t.enName, { code: t.shortName, cn: t.cnName, flag: t.olgIcon });
}

let index: SearchPlayer[] | null = null;

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function buildIndex(): SearchPlayer[] {
  if (index) return index;
  index = [];
  for (const squad of squadsData as { name: string; players: { number: string; position: string; name: string }[] }[]) {
    const tm = teamMap.get(squad.name);
    if (!tm) continue;
    for (const p of squad.players) {
      index.push({
        name: p.name,
        cnName: cnNames[p.name] || null,
        enName: p.name,
        enNameNorm: normalize(p.name),
        teamCode: tm.code,
        teamCn: tm.cn,
        teamFlag: tm.flag,
        position: p.position,
        number: p.number,
      });
    }
  }
  return index;
}

export function searchPlayers(query: string, limit = 10): SearchPlayer[] {
  const q = query.trim();
  if (q.length < 1) return [];

  const players = buildIndex();
  const qNorm = normalize(q);
  const hasChinese = /[\u4e00-\u9fff]/.test(q);

  type Scored = { player: SearchPlayer; score: number };
  const results: Scored[] = [];

  for (const p of players) {
    let score = 0;
    const enNorm = p.enNameNorm;
    const cn = p.cnName || '';

    // Exact match on English name
    if (enNorm === qNorm) { score = 100; }
    // Prefix match on English name
    else if (enNorm.startsWith(qNorm)) { score = 80; }
    // English name contains query
    else if (enNorm.includes(qNorm)) { score = 60; }
    // Fuzzy: all query words appear in English name
    else {
      const qWords = qNorm.split(/\s+/);
      const allMatch = qWords.every((w) => enNorm.includes(w));
      if (allMatch) score = 40;
    }

    // Chinese name match
    if (hasChinese && cn) {
      if (cn === q) score += 90;
      else if (cn.startsWith(q)) score += 70;
      else if (cn.includes(q)) score += 50;
    }

    // Match on team name
    const teamCnNorm = p.teamCn;
    if (teamCnNorm.includes(q)) score += 5;
    if (normalize(p.teamCn).includes(qNorm)) score += 3;

    // Match on shirt number
    if (p.number === q) score += 30;

    if (score > 0) results.push({ player: p, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map((r) => r.player);
}
