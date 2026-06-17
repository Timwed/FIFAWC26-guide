import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import fifaRankings from '../data/fifa-rankings.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

const teams = teamsData as TeamEntry[];

export default function Rankings() {
  const sorted = useMemo(() =>
    teams
      .filter((t) => fifaRankings[t.shortName as keyof typeof fifaRankings])
      .sort((a, b) =>
        (fifaRankings[a.shortName as keyof typeof fifaRankings]?.rank ?? 99) -
        (fifaRankings[b.shortName as keyof typeof fifaRankings]?.rank ?? 99)
      ),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">FIFA 世界排名</h2>
        <p className="mt-1 text-sm text-slate-400">
          2026年6月11日 · 开赛前最后一期排名 · 仅展示48支参赛队
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className="w-8 text-center">#</span>
          <span className="flex-1">球队</span>
          <span className="w-12 text-center">组别</span>
          <span className="w-24 text-right">积分</span>
        </div>

        {sorted.map((team) => {
          const rank = fifaRankings[team.shortName as keyof typeof fifaRankings];
          if (!rank) return null;

          return (
            <Link
              key={team.shortName}
              to={`/teams/${team.shortName}`}
              className="flex items-center gap-3 border-b border-white/5 px-4 py-3 transition hover:bg-sky-500/5 last:border-b-0"
            >
              <span className="w-8 text-center text-sm font-mono tabular-nums text-slate-400">
                {rank.rank}
              </span>
              <img
                src={team.olgIcon}
                alt={team.enName}
                className="h-7 w-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{team.cnName}</p>
                <p className="text-xs text-slate-500">{team.enName}</p>
              </div>
              <span className="w-12 text-center">
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {team.group}
                </span>
              </span>
              <span className="w-24 text-right font-mono tabular-nums text-sm text-slate-300">
                {rank.points.toFixed(2)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
