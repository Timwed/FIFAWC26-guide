import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mergeMatchPatches } from '../utils/matchMerge';
import { useLiveScorePatches } from '../utils/liveScores';
import { computeOpenLigaGroupTables } from '../utils/standings';
import type { OpenLigaGroupTable, OpenLigaGroupTableTeam } from '../api/openligadb';
import type { StandingsMatch } from '../utils/standings';
import { getAllScheduleMatches } from '../utils/schedule';
import teamsData from '../data/teams.json';

interface FlatMatch extends StandingsMatch {
  idEvent: string;
  dateEvent: string;
  strTime: string;
}

const allMatches = getAllScheduleMatches<FlatMatch>();

const enToShortCode = new Map<string, string>();
const tsdbAliases: Record<string, string> = { 'Bosnia-Herzegovina': 'Bosnia and Herzegovina', 'USA': 'United States' };
for (const t of teamsData) {
  enToShortCode.set(t.enName.toLowerCase(), t.shortName);
}
for (const [alias, canonical] of Object.entries(tsdbAliases)) {
  if (!enToShortCode.has(alias.toLowerCase())) {
    enToShortCode.set(alias.toLowerCase(), enToShortCode.get(canonical.toLowerCase()) || alias);
  }
}

const groupLabels: Record<string, string> = {
  'A': 'A组', 'B': 'B组', 'C': 'C组', 'D': 'D组',
  'E': 'E组', 'F': 'F组', 'G': 'G组', 'H': 'H组',
  'I': 'I组', 'J': 'J组', 'K': 'K组', 'L': 'L组',
};

export default function Standings() {
  const livePatches = useLiveScorePatches();
  const liveMatches = useMemo(() => mergeMatchPatches(allMatches, livePatches), [livePatches]);

  const tables = useMemo(() => computeOpenLigaGroupTables(liveMatches), [liveMatches]);

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
      <p className="text-sm text-slate-500 dark:text-slate-400">
        12个小组，每组前2名及8支最佳第3名晋级32强
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((group) => (
          <GroupTable key={group.groupID} group={group} />
        ))}
      </div>

      <h2 className="text-2xl font-bold">小组第三排名</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">12个小组第3名，前8名晋级32强淘汰赛</p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden max-w-2xl dark:border-white/5 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-slate-400 dark:text-slate-500">
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
              {thirdPlace.map((team, idx) => {
                const teamCode = enToShortCode.get(team.shortName?.toLowerCase() || '');
                return (
                <tr
                  key={team.teamInfoId}
                  className={`border-t border-slate-200 dark:border-white/5 ${
                    idx < 8 ? 'bg-green-500/5' : ''
                  } ${idx === 8 ? 'border-t-2 border-t-slate-300 dark:border-t-slate-600' : ''}`}
                >
                  <td className="px-1 py-2.5 text-center text-slate-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src={team.teamIconUrl}
                        alt=""
                        className="h-4 w-4 shrink-0 object-contain"
                      />
                      {teamCode ? (
                        <Link to={`/teams/${teamCode}`} className="font-medium truncate hover:text-sky-500 dark:hover:text-sky-400">{team.shortName}</Link>
                      ) : (
                        <span className="font-medium truncate">{team.shortName}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-0.5 py-2.5 text-center text-slate-400 dark:text-slate-500">{team.group}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.matches}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.won}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.draw}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.lost}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.goals}</td>
                  <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.opponentGoals}</td>
                  <td className="px-0.5 py-2.5 text-center font-bold text-slate-900 dark:text-white">{team.points}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 dark:border-white/5 px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="inline-block h-2 w-2 rounded-sm bg-green-500/15 align-[-1px]" /> 前8名晋级（绿色底色 / 分隔线上方）
        </div>
      </div>
    </div>
  );
}

function GroupTable({ group }: { group: OpenLigaGroupTable }) {
  const label = groupLabels[group.groupName] || group.groupName;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-white/5 dark:bg-white/5">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-white/5">
        <h3 className="font-bold text-sky-400">{label}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-xs text-slate-400 dark:text-slate-500">
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
            {group.teamInfoEntries.map((team, idx) => {
              const teamCode = enToShortCode.get(team.shortName?.toLowerCase() || '');
              return (
              <tr
                key={team.teamInfoId}
                className={`border-t border-slate-200 dark:border-white/5 ${
                  idx < 2 ? 'bg-green-500/5' : ''
                }`}
              >
                <td className="px-1 py-2.5 text-center text-slate-400 dark:text-slate-500">{idx + 1}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={team.teamIconUrl}
                      alt=""
                      className="h-4 w-4 shrink-0 object-contain"
                    />
                    {teamCode ? (
                      <Link to={`/teams/${teamCode}`} className="font-medium truncate hover:text-sky-500 dark:hover:text-sky-400">{team.shortName}</Link>
                    ) : (
                      <span className="font-medium truncate">{team.shortName}</span>
                    )}
                  </div>
                </td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.matches}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.won}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.draw}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.lost}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.goals}</td>
                <td className="px-0.5 py-2.5 text-center text-slate-500 dark:text-slate-400">{team.opponentGoals}</td>
                <td className="px-0.5 py-2.5 text-center font-bold text-slate-900 dark:text-white">{team.points}</td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-200 dark:border-white/5 px-4 py-2 text-[10px] text-slate-400 dark:text-slate-500">
        <span className="inline-block h-2 w-2 rounded-sm bg-green-500/30" /> 前2名晋级
      </div>
    </div>
  );
}
