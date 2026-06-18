import { useEffect, useMemo, useState } from 'react';
import { fetchSeasonEvents, fetchPastEvents } from '../api/thesportsdb';
import { buildMatchPatchMap, mergeMatchPatches } from '../utils/matchMerge';
import type { MatchEvent } from '../types';
import type { OpenLigaGroupTable, OpenLigaGroupTableTeam } from '../api/openligadb';
import teamsData from '../data/teams.json';
import scheduleData from '../data/venue-schedule.json';

interface FlatMatch {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
  strGroup: string | null;
}

const allMatches: FlatMatch[] = Object.values(scheduleData as Record<string, FlatMatch[]>).flat();

const groupLabels: Record<string, string> = {
  'A': 'A组', 'B': 'B组', 'C': 'C组', 'D': 'D组',
  'E': 'E组', 'F': 'F组', 'G': 'G组', 'H': 'H组',
  'I': 'I组', 'J': 'J组', 'K': 'K组', 'L': 'L组',
};

function computeStandings(matches: FlatMatch[]): OpenLigaGroupTable[] {
  const teamList = Object.values(teamsData);
  const enToShort = new Map(teamList.map((t) => [t.enName, t.shortName]));
  // Schedule JSON uses alternate names for these
  enToShort.set('Bosnia-Herzegovina', 'BIH');
  enToShort.set('USA', 'USA');
  const shortToInfo = new Map(teamList.map((t) => [t.shortName, { id: t.olgId, icon: t.olgIcon, olgName: t.olgName, cn: t.cnName }]));

  type GroupRow = {
    shortName: string;
    cnName: string;
    teamIconUrl: string;
    teamInfoId: number;
    points: number;
    matches: number;
    won: number;
    draw: number;
    lost: number;
    goals: number;
    opponentGoals: number;
  };

  const groups = new Map<string, GroupRow[]>();

  // Initialize all teams
  for (const t of teamList) {
    const info = shortToInfo.get(t.shortName)!;
    if (!groups.has(t.group)) groups.set(t.group, []);
    groups.get(t.group)!.push({
      shortName: t.shortName,
      cnName: info.cn,
      teamIconUrl: t.olgIcon,
      teamInfoId: info.id,
      points: 0, matches: 0, won: 0, draw: 0, lost: 0, goals: 0, opponentGoals: 0,
    });
  }

  // Process finished group stage matches
  for (const m of matches) {
    if (!m.strGroup || !m.intHomeScore || !m.intAwayScore) continue;
    const hShort = enToShort.get(m.strHomeTeam);
    const aShort = enToShort.get(m.strAwayTeam);
    if (!hShort || !aShort) continue;

    const gName = m.strGroup;
    const rows = groups.get(gName);
    if (!rows) continue;

    const hRow = rows.find((r) => r.shortName === hShort);
    const aRow = rows.find((r) => r.shortName === aShort);
    if (!hRow || !aRow) continue;

    const hg = parseInt(m.intHomeScore);
    const ag = parseInt(m.intAwayScore);

    hRow.matches++; aRow.matches++;
    hRow.goals += hg; aRow.goals += ag;
    hRow.opponentGoals += ag; aRow.opponentGoals += hg;

    if (hg > ag) { hRow.points += 3; hRow.won++; aRow.lost++; }
    else if (ag > hg) { aRow.points += 3; aRow.won++; hRow.lost++; }
    else { hRow.points++; aRow.points++; hRow.draw++; aRow.draw++; }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, rows], idx) => ({
      groupName,
      groupOrderID: idx + 1,
      groupID: idx,
      teamInfoEntries: rows
        .sort((t1, t2) => {
          if (t2.points !== t1.points) return t2.points - t1.points;
          const gd1 = t1.goals - t1.opponentGoals;
          const gd2 = t2.goals - t2.opponentGoals;
          if (gd2 !== gd1) return gd2 - gd1;
          return t2.goals - t1.goals;
        })
        .map((r) => ({
          teamInfoId: r.teamInfoId,
          teamName: '',
          shortName: r.cnName,
          teamIconUrl: r.teamIconUrl,
          points: r.points,
          opponentGoals: r.opponentGoals,
          goals: r.goals,
          matches: r.matches,
          won: r.won,
          lost: r.lost,
          draw: r.draw,
        }) satisfies OpenLigaGroupTableTeam),
    }));
}

export default function Standings() {
  const [liveMatches, setLiveMatches] = useState<FlatMatch[]>(allMatches);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [season, past] = await Promise.all([
        fetchSeasonEvents(),
        fetchPastEvents(),
      ]).catch(() => [[], []] as [MatchEvent[], MatchEvent[]]);
      if (cancelled) return;
      const liveMap = buildMatchPatchMap(season, past);
      setLiveMatches(mergeMatchPatches(allMatches, liveMap));
    })();
    return () => { cancelled = true; };
  }, []);

  const tables = useMemo(() => computeStandings(liveMatches), [liveMatches]);

  const thirdPlace = useMemo(() => {
    return tables
      .flatMap((g) => {
        const t = g.teamInfoEntries[2];
        if (!t) return [];
        return [{ ...t, group: groupLabels[g.groupName] || g.groupName }] as (OpenLigaGroupTableTeam & { group: string })[];
      })
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gdA = a.goals - a.opponentGoals;
        const gdB = b.goals - b.opponentGoals;
        if (gdB !== gdA) return gdB - gdA;
        return b.goals - a.goals;
      });
  }, [tables]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">小组积分榜</h2>
      <p className="text-sm text-slate-400">
        12个小组，每组前2名及8支最佳第3名晋级32强
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((group) => (
          <GroupTable key={group.groupID} group={group} />
        ))}
      </div>

      <h2 className="text-2xl font-bold">小组第三排名</h2>
      <p className="text-sm text-slate-400">12个小组第3名，前8名晋级32强淘汰赛</p>
      <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden max-w-2xl">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="w-6 px-1 py-2 text-center">#</th>
                <th className="px-2 py-2 text-left">球队</th>
                <th className="w-10 px-0.5 py-2 text-center">组别</th>
                <th className="w-8 px-0.5 py-2 text-center">赛</th>
                <th className="w-8 px-0.5 py-2 text-center">胜</th>
                <th className="w-8 px-0.5 py-2 text-center">平</th>
                <th className="w-8 px-0.5 py-2 text-center">负</th>
                <th className="w-10 px-0.5 py-2 text-center">进球</th>
                <th className="w-10 px-0.5 py-2 text-center">失球</th>
                <th className="w-10 px-0.5 py-2 text-center font-bold">积分</th>
              </tr>
            </thead>
            <tbody>
              {thirdPlace.map((team, idx) => (
                <tr
                  key={team.teamInfoId}
                  className={`border-t border-white/5 ${
                    idx < 8 ? 'bg-green-500/5' : ''
                  }`}
                >
                  <td className="px-1 py-2.5 text-center text-slate-500">{idx + 1}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src={team.teamIconUrl}
                        alt=""
                        className="h-4 w-4 shrink-0 object-contain"
                      />
                      <span className="font-medium truncate">{team.shortName}</span>
                    </div>
                  </td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500">{team.group}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.matches}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.won}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.draw}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.lost}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.goals}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400">{team.opponentGoals}</td>
                  <td className="px-0.5 py-2.5 text-center font-bold text-white">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/5 px-4 py-2 text-[10px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-sm bg-green-500/30" /> 前8名晋级
        </div>
      </div>
    </div>
  );
}

function GroupTable({ group }: { group: OpenLigaGroupTable }) {
  const label = groupLabels[group.groupName] || group.groupName;

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
      <div className="border-b border-white/5 bg-white/5 px-4 py-3">
        <h3 className="font-bold text-sky-400">{label}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="w-6 px-1 py-2 text-center">#</th>
              <th className="px-2 py-2 text-left">球队</th>
              <th className="w-8 px-0.5 py-2 text-center">赛</th>
              <th className="w-8 px-0.5 py-2 text-center">胜</th>
              <th className="w-8 px-0.5 py-2 text-center">平</th>
              <th className="w-8 px-0.5 py-2 text-center">负</th>
              <th className="w-10 px-0.5 py-2 text-center">进球</th>
              <th className="w-10 px-0.5 py-2 text-center">失球</th>
              <th className="w-10 px-0.5 py-2 text-center font-bold">积分</th>
            </tr>
          </thead>
          <tbody>
            {group.teamInfoEntries.map((team, idx) => (
              <tr
                key={team.teamInfoId}
                className={`border-t border-white/5 ${
                  idx < 2 ? 'bg-green-500/5' : ''
                }`}
              >
                <td className="px-1 py-2.5 text-center text-slate-500">{idx + 1}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={team.teamIconUrl}
                      alt=""
                      className="h-4 w-4 shrink-0 object-contain"
                    />
                    <span className="font-medium truncate">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.matches}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.won}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.draw}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.lost}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.goals}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-400">{team.opponentGoals}</td>
                <td className="px-0.5 py-2.5 text-center font-bold text-white">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/5 px-4 py-2 text-[10px] text-slate-500">
        <span className="inline-block h-2 w-2 rounded-sm bg-green-500/30" /> 前2名晋级
      </div>
    </div>
  );
}
