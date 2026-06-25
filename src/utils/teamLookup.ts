import teamsData from '../data/teams.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

const teams = teamsData as TeamEntry[];

const enNameMap = new Map<string, TeamEntry>();
for (const t of teams) {
  enNameMap.set(t.enName.toLowerCase(), t);
}

/** Aliases for team names that differ from teams.json enName (case-insensitive) */
const NAME_ALIASES: Record<string, string> = {
  'bosnia-herzegovina': 'Bosnia and Herzegovina',
  'bosnia': 'Bosnia and Herzegovina',
  'usa': 'United States',
  'united states of america': 'United States',
};

/** known TSDB names that differ from our teams.json enName */
const tsdbAliases: Record<string, string> = {
  'ivory coast': 'Ivory Coast',
  'côte d\'ivoire': 'Ivory Coast',
  'korea republic': 'South Korea',
  'south korea': 'South Korea',
  'usa': 'United States',
  'united states of america': 'United States',
  'bosnia': 'Bosnia and Herzegovina',
  'bosnia-herzegovina': 'Bosnia and Herzegovina',
  'czechia': 'Czech Republic',
  'czech republic': 'Czech Republic',
};

/** Resolve any team name variant to the canonical teams.json entry */
function resolveTeam(name: string | undefined | null): TeamEntry | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  let entry = enNameMap.get(key);
  if (!entry) {
    const canonical = NAME_ALIASES[key] || tsdbAliases[key];
    if (canonical) entry = enNameMap.get(canonical.toLowerCase());
  }
  return entry ?? null;
}

export function lookupTeam(
  tsdbName: string | undefined | null
): { cnName: string; flagUrl: string; shortName: string } | null {
  const entry = resolveTeam(tsdbName);
  if (entry) {
    return { cnName: entry.cnName, flagUrl: entry.olgIcon, shortName: entry.shortName };
  }
  return null;
}

export function teamFlag(enName: string | undefined | null): string {
  return resolveTeam(enName)?.olgIcon ?? '';
}

export function teamCn(enName: string | undefined | null): string {
  return resolveTeam(enName)?.cnName ?? enName ?? '';
}

export function teamShort(enName: string | undefined | null): string {
  return resolveTeam(enName)?.shortName ?? '';
}

export function teamGroup(enName: string | undefined | null): string {
  return resolveTeam(enName)?.group ?? '';
}
