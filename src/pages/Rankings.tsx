import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import fifaRankings from '../data/fifa-rankings.json';
import { fetchJson, clearJsonCache } from '../utils/jsonData';
import { clearDqdPlayerMapCache } from '../utils/dqdPlayerMap';
import LoadingState from '../components/LoadingState';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

interface SquadEntry {
  name: string;
  players: { name: string; position: string }[];
}

interface DqdPlayerStats {
  dqdId: string;
  cnName: string;
  worldCup: {
    appearances: number;
    minutes: number;
    goals: number;
    assists: number;
    averageRating: number | null;
  };
}

interface DqdLineupPlayer {
  personId: string;
  name: string;
  rating: string;
  keyStats: Record<string, string>;
}

interface DqdMatchDetail {
  score: string;
  lineup: {
    home: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
    away: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
  } | null;
}

const teams = teamsData as TeamEntry[];

const POSITION_LABELS: Record<string, string> = {
  GK: '门将',
  DF: '后卫',
  MF: '中场',
  FW: '前锋',
};

export default function Rankings() {
  const [dqdStatsData, setDqdStatsData] = useState<Record<string, Record<string, DqdPlayerStats>>>({});
  const [dqdMatchData, setDqdMatchData] = useState<Record<string, DqdMatchDetail>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const squads = squadsData as SquadEntry[];
  const loading = Object.keys(dqdStatsData).length === 0;

  useEffect(() => {
    let cancelled = false;
    fetchJson<Record<string, Record<string, DqdPlayerStats>>>('/data/dqd-worldcup-stats.json', { maxAge: 10 * 60_000 })
      .then((data) => { if (!cancelled) setDqdStatsData(data); })
      .catch(() => { if (!cancelled) setDqdStatsData({}); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchJson<Record<string, DqdMatchDetail>>('/data/dqd-match-details.json', { maxAge: 5 * 60_000 })
      .then((data) => { if (!cancelled) setDqdMatchData(data); })
      .catch(() => { if (!cancelled) setDqdMatchData({}); });
    return () => { cancelled = true; };
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshError(false);
    clearJsonCache('/data/dqd-');
    clearDqdPlayerMapCache();
    Promise.all([
      fetchJson<Record<string, Record<string, DqdPlayerStats>>>('/data/dqd-worldcup-stats.json', { force: true, maxAge: 10 * 60_000 }),
      fetchJson<Record<string, DqdMatchDetail>>('/data/dqd-match-details.json', { force: true, maxAge: 5 * 60_000 }),
    ])
      .then(([stats, matches]) => { setDqdStatsData(stats); setDqdMatchData(matches); })
      .catch(() => setRefreshError(true))
      .finally(() => setRefreshing(false));
  }, []);

  const playerRows = useMemo(() => {
    const rows: {
      name: string;
      cnName: string;
      teamCode: string;
      teamCn: string;
      position: string;
      rating: number;
      appearances: number;
      minutes: number;
      goals: number;
      assists: number;
      dqdId: string;
    }[] = [];
    for (const team of teams) {
      const squad = squads.find((item) => item.name === team.enName);
      const positionMap = new Map((squad?.players || []).map((player) => [player.name, player.position]));
      for (const [name, stat] of Object.entries(dqdStatsData[team.shortName] || {})) {
        const rating = stat.worldCup.averageRating;
        if (rating == null || stat.worldCup.appearances <= 0) continue;
        rows.push({
          name,
          cnName: stat.cnName || name,
          teamCode: team.shortName,
          teamCn: team.cnName,
          position: positionMap.get(name) || 'MF',
          rating,
          appearances: stat.worldCup.appearances,
          minutes: stat.worldCup.minutes,
          goals: stat.worldCup.goals,
          assists: stat.worldCup.assists,
          dqdId: stat.dqdId,
        });
      }
    }
    return rows.sort((a, b) => b.rating - a.rating || b.minutes - a.minutes);
  }, [dqdStatsData]);

  const bestXI = useMemo(() => {
    const picked = [
      ...playerRows.filter((p) => p.position === 'GK').slice(0, 1),
      ...playerRows.filter((p) => p.position === 'DF').slice(0, 4),
      ...playerRows.filter((p) => p.position === 'MF').slice(0, 3),
      ...playerRows.filter((p) => p.position === 'FW').slice(0, 3),
    ];
    return picked;
  }, [playerRows]);

  const positionBoards = useMemo(() => ({
    FW: playerRows.filter((p) => p.position === 'FW').slice(0, 6),
    MF: playerRows.filter((p) => p.position === 'MF').slice(0, 6),
    DF: playerRows.filter((p) => p.position === 'DF').slice(0, 6),
    GK: playerRows.filter((p) => p.position === 'GK').slice(0, 6),
  }), [playerRows]);

  const substituteImpact = useMemo(() => {
    const idMap = new Map<string, typeof playerRows[number]>();
    for (const player of playerRows) {
      if (player.dqdId) idMap.set(player.dqdId, player);
    }
    const rows: {
      player: typeof playerRows[number];
      rating: number;
      score: string;
      xg: string;
      xa: string;
      keyPasses: string;
      saves: string;
    }[] = [];
    for (const detail of Object.values(dqdMatchData)) {
      for (const side of [detail.lineup?.home, detail.lineup?.away]) {
        for (const sub of side?.substitutes || []) {
          const local = idMap.get(sub.personId);
          const rating = Number(sub.rating);
          if (!local || !Number.isFinite(rating)) continue;
          rows.push({
            player: local,
            rating,
            score: detail.score,
            xg: sub.keyStats.xg || '',
            xa: sub.keyStats.xa || '',
            keyPasses: sub.keyStats.keyPasses || '',
            saves: sub.keyStats.saves || '',
          });
        }
      }
    }
    return rows.sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [dqdMatchData, playerRows]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">排名与数据榜
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center rounded-lg border border-slate-300 dark:border-white/10 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 transition"
            title="刷新数据"
          >
            <svg className={`mr-1 h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 0 1 10.47-4M14 8a6 6 0 0 1-10.47 4" strokeLinecap="round"/><path d="M2 2v4h4M14 14v-4h-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {refreshing ? '刷新中' : '刷新'}
          </button>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          FIFA 世界排名 + 懂球帝世界杯实时表现榜
        </p>
        {refreshError && <p className="mt-1 text-xs text-red-500">刷新失败，请稍后重试</p>}
      </div>

      {loading && <LoadingState label="加载数据" />}

      {playerRows.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-amber-500 border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">全赛事评分榜 Top20</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">按平均评分排序</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {playerRows.slice(0, 20).map((player, idx) => (
              <Link key={`${player.teamCode}-${player.name}`} to={`/players/${player.teamCode}/${encodeURIComponent(player.name)}`} className="flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 transition hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
                <span className="w-6 text-right text-sm tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{player.cnName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{player.teamCn} · {POSITION_LABELS[player.position] || player.position} · {player.appearances}场 {player.minutes}分钟</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 dark:text-amber-300">{player.rating.toFixed(1)}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{player.goals}球 {player.assists}助</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {bestXI.length === 11 && (
        <section className="rounded-xl border border-l-4 border-l-violet-500 border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-bold">当前最佳阵容 · 4-3-3</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bestXI.map((player) => (
              <Link key={`${player.teamCode}-${player.name}`} to={`/players/${player.teamCode}/${encodeURIComponent(player.name)}`} className="rounded-lg bg-slate-100 p-3 transition hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-400">{POSITION_LABELS[player.position] || player.position}</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-300">{player.rating.toFixed(1)}</span>
                </div>
                <p className="truncate font-medium text-slate-700 dark:text-slate-200">{player.cnName}</p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{player.teamCn} · {player.appearances}场 · {player.goals}球 {player.assists}助</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {playerRows.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-cyan-500 border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-bold">位置专项榜</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(['FW', 'MF', 'DF', 'GK'] as const).map((pos) => (
              <div key={pos}>
                <h4 className="mb-2 text-sm font-semibold text-cyan-600 dark:text-cyan-300">{POSITION_LABELS[pos]}</h4>
                <div className="space-y-1.5">
                  {positionBoards[pos].map((player, idx) => (
                    <Link key={`${pos}-${player.teamCode}-${player.name}`} to={`/players/${player.teamCode}/${encodeURIComponent(player.name)}`} className="flex items-center gap-2 rounded bg-slate-100 px-2 py-1.5 text-sm hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
                      <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{player.cnName}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-300">{player.rating.toFixed(1)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {substituteImpact.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-4 text-lg font-bold">替补影响力榜 Top10</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {substituteImpact.map((row, idx) => (
              <Link key={`${row.player.teamCode}-${row.player.name}-${idx}`} to={`/players/${row.player.teamCode}/${encodeURIComponent(row.player.name)}`} className="rounded-lg bg-slate-100 px-3 py-2 text-sm transition hover:bg-slate-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-700 dark:text-slate-200">{row.player.cnName}</span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-300">{row.rating.toFixed(1)}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-2 pl-7 text-xs text-slate-500">
                  <span>{row.player.teamCn}</span>
                  <span>{row.score}</span>
                  {row.xg && <span>xG {row.xg}</span>}
                  {row.xa && <span>xA {row.xa}</span>}
                  {row.keyPasses && <span>关键传球 {row.keyPasses}</span>}
                  {row.saves && <span>扑救 {row.saves}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-bold">FIFA 世界排名</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            开赛前最后一期排名 · 按分组展示
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {['A','B','C','D','E','F','G','H','I','J','K','L'].map((group) => {
            const groupTeams = teams
              .filter((t) => t.group === group)
              .sort((a, b) => {
                const rankA = fifaRankings[a.shortName as keyof typeof fifaRankings]?.rank ?? 99;
                const rankB = fifaRankings[b.shortName as keyof typeof fifaRankings]?.rank ?? 99;
                return rankA - rankB;
              });
            if (groupTeams.length === 0) return null;
            return (
              <div key={group} className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4">
                <h4 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">{group} 组</h4>
                <div className="space-y-2">
                  {groupTeams.map((team) => {
                    const rank = fifaRankings[team.shortName as keyof typeof fifaRankings];
                    return (
                      <Link
                        key={team.shortName}
                        to={`/teams/${team.shortName}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-200 dark:hover:bg-white/[0.06]"
                      >
                        <img src={team.olgIcon} alt={team.enName} className="h-5 w-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-700 dark:text-slate-200">{team.cnName}</span>
                        {rank && <span className="text-xs tabular-nums text-slate-400 dark:text-slate-500">#{rank.rank}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
