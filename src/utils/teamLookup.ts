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

export function lookupTeam(
  tsdbName: string | undefined | null
): { cnName: string; flagUrl: string; shortName: string } | null {
  if (!tsdbName) return null;
  const key = tsdbName.trim().toLowerCase();

  let entry = enNameMap.get(key);
  if (!entry) {
    const canonical = tsdbAliases[key];
    if (canonical) entry = enNameMap.get(canonical.toLowerCase());
  }

  if (entry) {
    return { cnName: entry.cnName, flagUrl: entry.olgIcon, shortName: entry.shortName };
  }
  return null;
}
