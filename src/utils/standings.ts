import teamsData from '../data/teams.json';
import scheduleData from '../data/venue-schedule.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

interface FlatMatch {
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
  strGroup: string | null;
}

const teams = teamsData as TeamEntry[];
const allMatches: FlatMatch[] = Object.values(
  scheduleData as Record<string, FlatMatch[]>
).flat();

export interface GroupStanding {
  group: string;
  teams: {
    enName: string;
    shortName: string;
    cnName: string;
    flag: string;
    played: number;
    points: number;
    gd: number;
    gf: number;
    ga: number;
    won: number;
    drawn: number;
    lost: number;
  }[];
}

export function computeGroupStandings(): GroupStanding[] {
  const enToShort = new Map(teams.map((t) => [t.enName, t.shortName]));
  enToShort.set('Bosnia-Herzegovina', 'BIH');
  enToShort.set('USA', 'USA');

  const teamInfoMap = new Map(
    teams.map((t) => [t.shortName, { enName: t.enName, cnName: t.cnName, flag: t.olgIcon }])
  );

  type Row = {
    shortName: string;
    played: number;
    points: number;
    gf: number;
    ga: number;
    won: number;
    drawn: number;
    lost: number;
  };

  const rows = new Map<string, Row>();
  for (const t of teams) {
    rows.set(t.shortName, { shortName: t.shortName, played: 0, points: 0, gf: 0, ga: 0, won: 0, drawn: 0, lost: 0 });
  }

  for (const m of allMatches) {
    if (!m.strGroup || !m.intHomeScore || !m.intAwayScore) continue;
    const h = enToShort.get(m.strHomeTeam);
    const a = enToShort.get(m.strAwayTeam);
    if (!h || !a) continue;
    const hRow = rows.get(h);
    const aRow = rows.get(a);
    if (!hRow || !aRow) continue;

    const hg = parseInt(m.intHomeScore);
    const ag = parseInt(m.intAwayScore);

    hRow.played++; aRow.played++;
    hRow.gf += hg; aRow.gf += ag;
    hRow.ga += ag; aRow.ga += hg;

    if (hg > ag) { hRow.points += 3; hRow.won++; aRow.lost++; }
    else if (ag > hg) { aRow.points += 3; aRow.won++; hRow.lost++; }
    else { hRow.points++; aRow.points++; hRow.drawn++; aRow.drawn++; }
  }

  const groupResults = new Map<string, {
    enName: string;
    shortName: string;
    cnName: string;
    flag: string;
    played: number;
    points: number;
    gd: number;
    gf: number;
    ga: number;
    won: number;
    drawn: number;
    lost: number;
  }[]>();
  for (const t of teams) {
    const r = rows.get(t.shortName);
    if (!r) continue;
    if (!groupResults.has(t.group)) groupResults.set(t.group, []);
    groupResults.get(t.group)!.push({
      enName: '',
      shortName: r.shortName,
      cnName: '',
      flag: '',
      played: r.played,
      points: r.points,
      gd: r.gf - r.ga,
      gf: r.gf,
      ga: r.ga,
      won: r.won,
      drawn: r.drawn,
      lost: r.lost,
    });
  }

  return Array.from(groupResults.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, gr]) => ({
      group,
      teams: gr
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const gda = a.gf - a.ga;
          const gdb = b.gf - b.ga;
          if (gdb !== gda) return gdb - gda;
          return b.gf - a.gf;
        })
        .map((r) => {
          const info = teamInfoMap.get(r.shortName)!;
          return {
            enName: info.enName,
            shortName: r.shortName,
            cnName: info.cnName,
            flag: info.flag,
            played: r.played,
            points: r.points,
            gd: r.gd,
            gf: r.gf,
            ga: r.ga,
            won: r.won,
            drawn: r.drawn,
            lost: r.lost,
          };
        }),
    }));
}
