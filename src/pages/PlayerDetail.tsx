import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import squadsData from '../data/squads.json';
import teamsData from '../data/teams.json';
import scheduleData from '../data/venue-schedule.json';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import { teamCn, teamFlag } from '../utils/teamLookup';
import { formatBeijingTime } from '../utils/datetime';
import StarButton from '../components/StarButton';
import type { StaticGoal } from '../types';
import { fetchJson } from '../utils/jsonData';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  group: string;
  olgIcon: string;
}

interface SquadEntry {
  name: string;
  players: PlayerEntry[];
}

interface PlayerEntry {
  number: string;
  position: string;
  name: string;
  age: number;
  caps: number;
  goals: number;
  club: string;
}

interface WikiPlayer {
  fullName: string;
  position: string;
  currentClub: string;
  nationalTeam?: string;
  nationalCaps: number;
  nationalGoals: number;
  image: string;
  clubCareer: { years: string; club: string; apps?: number; goals?: number }[] | null;
  careerReview: string;
  wcSpotlight: string;
}

interface MatchData {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  dateEvent: string;
  strTime: string;
  strStatus: string;
  goals?: StaticGoal[];
}

interface PlayerMatchGoals {
  idEvent: string;
  dateEvent: string;
  strTime: string;
  opponentEn: string;
  opponentCn: string;
  opponentFlag: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  isHomeTeam: boolean;
  goals: StaticGoal[];
}

interface DqdLineupPlayer {
  personId: string;
  name: string;
  rating: string;
  shirtNumber: string;
  position: string;
  keyStats: Record<string, string>;
}

interface DqdHeatmap {
  direction: string;
  points: [number, number][];
}

interface DqdPlayerIndexEntry {
  matches: string[];
  heatmaps: string[];
}

interface DqdMatchDetail {
  idEvent: string;
  home: string;
  away: string;
  score: string;
  date: string;
  lineup: {
    home: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
    away: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
  } | null;
}

interface DqdCareerEntry {
  team: string;
  start: string;
  end: string;
  appearances: string;
  goals: string;
  assists: string;
}

interface DqdPlayerStats {
  dqdId: string;
  cnName: string;
  currentTeam: string;
  marketValue: string;
  rankings: Record<string, { rank: number | null; count: number; label: string }>;
  worldCup: {
    appearances: number;
    goals: number;
    assists: number;
    minutes: number;
    averageRating: number | null;
    matches: {
      matchId: string;
      title: string;
      date: string;
      home: string;
      away: string;
      score: string;
      goals: number;
      assists: number;
      minute: string;
      rating: string;
      reason: string;
    }[];
  };
  career?: DqdCareerEntry[];
}

const teams = teamsData as TeamEntry[];

const allMatches: MatchData[] = Object.values(scheduleData as unknown as Record<string, MatchData[]>).flat();

const POSITION_LABELS: Record<string, string> = {
  GK: '守门员', DF: '后卫', MF: '中场', FW: '前锋',
};

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400',
  DF: 'bg-green-500/20 text-green-400',
  MF: 'bg-blue-500/20 text-blue-400',
  FW: 'bg-red-500/20 text-red-400',
};

export default function PlayerDetail() {
  const { teamCode, playerName } = useParams<{ teamCode: string; playerName: string }>();
  const [wikiPlayers, setWikiPlayers] = useState<Record<string, WikiPlayer> | null>(null);
  const [dqdStatsData, setDqdStatsData] = useState<Record<string, Record<string, DqdPlayerStats>> | null>(null);
  const [dqdMatchData, setDqdMatchData] = useState<Record<string, DqdMatchDetail>>({});
  const [dqdHeatmaps, setDqdHeatmaps] = useState<Record<string, Record<string, DqdHeatmap>>>({});
  const [dqdLoading, setDqdLoading] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (teamCode) {
      fetchJson<Record<string, WikiPlayer>>(`/data/players-wiki/${teamCode.toUpperCase()}.json`)
        .then((data) => { if (!cancelled) setWikiPlayers(data); })
        .catch(() => { if (!cancelled) setWikiPlayers({}); });
    }
    return () => { cancelled = true; };
  }, [teamCode]);

  useEffect(() => {
    let cancelled = false;
    if (!teamCode) return;
    const code = teamCode.toUpperCase();
    fetchJson<Record<string, DqdPlayerStats>>(`/data/dqd-stats/${code}.json`, { maxAge: 5 * 60_000 })
      .then((data) => { if (!cancelled) setDqdStatsData({ [code]: data }); })
      .catch(() => { if (!cancelled) setDqdStatsData({}); });
    return () => { cancelled = true; };
  }, [teamCode]);


  const decodedName = useMemo(() => decodeURIComponent(playerName || ''), [playerName]);
  const team = useMemo(
    () => teams.find((t) => t.shortName.toUpperCase() === teamCode?.toUpperCase()),
    [teamCode]
  );
  const squad = useMemo(
    () => team ? (squadsData as SquadEntry[]).find((s) => s.name.toLowerCase() === team.enName.toLowerCase()) : null,
    [team]
  );
  const player = useMemo(
    () => squad?.players.find((p) => p.name === decodedName),
    [squad, decodedName]
  );
  const wiki = useMemo(
    () => (wikiPlayers != null ? wikiPlayers[decodedName] ?? null : null),
    [decodedName, wikiPlayers]
  );
  const dqdStats = useMemo(
    () => (teamCode && dqdStatsData ? dqdStatsData[teamCode.toUpperCase()]?.[decodedName] ?? null : null),
    [decodedName, dqdStatsData, teamCode]
  );

  useEffect(() => {
    let cancelled = false;
    if (!dqdStats?.dqdId) {
      queueMicrotask(() => {
        if (!cancelled) {
          setDqdMatchData({});
          setDqdHeatmaps({});
          setDqdLoading(false);
        }
      });
      return () => { cancelled = true; };
    }

    queueMicrotask(() => {
      if (!cancelled) setDqdLoading(true);
    });
    fetchJson<Record<string, DqdPlayerIndexEntry>>('/data/dqd-player-index.json')
      .then(async (index) => {
        const entry = index[dqdStats.dqdId];
        if (!entry) return { matches: {}, heatmaps: {} };
        const [matches, heatmaps] = await Promise.all([
          Promise.allSettled(entry.matches.map((id) => fetchJson<DqdMatchDetail>(`/data/dqd-matches/${id}.json`, { maxAge: 2 * 60_000 }).then((data) => [id, data] as const))),
          Promise.allSettled(entry.heatmaps.map((id) => fetchJson<Record<string, DqdHeatmap>>(`/data/dqd-heatmaps/${id}.json`, { maxAge: 2 * 60_000 }).then((data) => [id, data] as const))),
        ]);
        return {
          matches: Object.fromEntries(matches.filter((result) => result.status === 'fulfilled').map((result) => result.value)),
          heatmaps: Object.fromEntries(heatmaps.filter((result) => result.status === 'fulfilled').map((result) => result.value)),
        };
      })
      .then((data) => {
        if (!cancelled) {
          setDqdMatchData(data.matches);
          setDqdHeatmaps(data.heatmaps);
          setDqdLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDqdMatchData({});
          setDqdHeatmaps({});
          setDqdLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [dqdStats?.dqdId]);

  const playerGoals = useMemo((): PlayerMatchGoals[] => {
    if (!player || !team) return [];
    const pName = player.name;
    const results: PlayerMatchGoals[] = [];
    for (const m of allMatches) {
      if (!m.goals || m.goals.length === 0) continue;
      const myGoals = m.goals.filter((g) => g.name === pName);
      if (myGoals.length === 0) continue;
      const isHomeTeam = m.strHomeTeam === team.enName;
      const opponentEn = isHomeTeam ? m.strAwayTeam : m.strHomeTeam;
      results.push({
        idEvent: m.idEvent,
        dateEvent: m.dateEvent,
        strTime: m.strTime,
        opponentEn,
        opponentCn: teamCn(opponentEn),
        opponentFlag: teamFlag(opponentEn),
        intHomeScore: m.intHomeScore,
        intAwayScore: m.intAwayScore,
        isHomeTeam,
        goals: myGoals,
      });
    }
    results.sort((a, b) => `${a.dateEvent}${a.strTime}`.localeCompare(`${b.dateEvent}${b.strTime}`));
    return results;
  }, [player, team]);

  const totalGoals = playerGoals.reduce((sum, m) => sum + m.goals.length, 0);

  const lineupMatches = useMemo(() => {
    if (!team || !dqdStats?.dqdId) return [];
    const rows: {
      idEvent: string;
      opponent: string;
      score: string;
      date: string;
      role: string;
      rating: string;
      keyStats: Record<string, string>;
      heatmap: DqdHeatmap | null;
    }[] = [];
    for (const [idEvent, detail] of Object.entries(dqdMatchData)) {
      const local = allMatches.find((m) => m.idEvent === idEvent);
      if (!local || local.strHomeTeam !== team.enName && local.strAwayTeam !== team.enName) continue;
      const side = local.strHomeTeam === team.enName ? detail.lineup?.home : detail.lineup?.away;
      const starter = side?.starters.find((p) => p.personId === dqdStats.dqdId);
      const substitute = side?.substitutes.find((p) => p.personId === dqdStats.dqdId);
      const found = starter || substitute;
      if (!found) continue;
      const opponentEn = local.strHomeTeam === team.enName ? local.strAwayTeam : local.strHomeTeam;
      rows.push({
        idEvent,
        opponent: teamCn(opponentEn),
        score: detail.score,
        date: detail.date,
        role: starter ? '首发' : '替补',
        rating: found.rating,
        keyStats: found.keyStats,
        heatmap: dqdHeatmaps[idEvent]?.[dqdStats.dqdId] || null,
      });
    }
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }, [dqdHeatmaps, dqdMatchData, dqdStats, team]);

  const careerEntries = useMemo(() => {
    const career = dqdStats?.career;
    if (!career || career.length === 0) return null;
    const filtered = career.filter(
      (c) => c.appearances !== '0' || c.goals !== '0'
    );
    if (filtered.length === 0) return null;
    return filtered;
  }, [dqdStats]);

  if (!team || !player) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-400">未找到球员</p>
        <Link to="/teams" className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-300">
          ← 返回球队列表
        </Link>
      </div>
    );
  }

  const teamCnName = team.cnName;
  const initials = player.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const info = lookupPlayerByExactName(player.name);
  const cnName = info?.cnName || null;
  const imageSrc = wiki?.image || '';
  const showImage = imageSrc && failedImage !== imageSrc;

  return (
    <div className="space-y-8">
      <Link to={`/teams/${team.shortName}`} className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-300">
        ← {teamCnName}大名单
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {showImage ? (
          <img
            src={imageSrc}
            alt={player.name}
            loading="lazy"
            decoding="async"
            width={192}
            height={192}
            className="h-40 w-40 shrink-0 rounded-2xl border-2 border-slate-200 dark:border-white/10 object-cover md:h-48 md:w-48"
            onError={() => setFailedImage(imageSrc)}
          />
        ) : (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-5xl font-bold text-slate-900 dark:text-white/50 md:h-48 md:w-48">
            {initials}
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-extrabold">
              {cnName || player.name}
            </h2>
            <StarButton type="player" id={`${team.shortName}:${player.name}`} />
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">#{player.number}</span>
          </div>
          {cnName && (
            <p className="text-base text-slate-400">{wiki?.fullName || player.name}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded px-2 py-0.5 font-medium ${POSITION_COLORS[player.position] || 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
              {POSITION_LABELS[player.position] || player.position}
            </span>
            <span className="text-slate-400">{teamCnName} &middot; {team.group}组</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Stat label="年龄" value={`${player.age}岁`} />
            <Stat label="国家队出场" value={`${wiki?.nationalCaps || player.caps}场`} />
            <Stat label="国家队进球" value={`${wiki?.nationalGoals || player.goals}球`} />
            <Stat label="俱乐部" value={wiki?.currentClub || player.club} />
          </div>
        </div>
      </div>

      {wiki?.careerReview && (
        <section className="rounded-xl border border-l-4 border-l-sky-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-3 text-lg font-bold">生涯回顾</h3>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">{wiki.careerReview}</p>
        </section>
      )}

      {wiki?.wcSpotlight && (
        <section className="rounded-xl border border-l-4 border-l-amber-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-3 text-lg font-bold">本届看点</h3>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">{wiki.wcSpotlight}</p>
        </section>
      )}

      {dqdStats && (
        <section className="rounded-xl border border-l-4 border-l-sky-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">本届世界杯状态</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Stat label="出场" value={`${dqdStats.worldCup.appearances}场`} />
            <Stat label="时间" value={`${dqdStats.worldCup.minutes}分钟`} />
            <Stat label="进球" value={`${dqdStats.worldCup.goals}球`} />
            <Stat label="助攻" value={`${dqdStats.worldCup.assists}次`} />
            <Stat label="评分" value={dqdStats.worldCup.averageRating != null ? String(dqdStats.worldCup.averageRating) : '-'} />
          </div>
          {Object.keys(dqdStats.rankings).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['goals','assists','shots','shots_on_target','key_passes','tackles','saves','rating']
                .filter((key) => dqdStats.rankings[key])
                .map((key) => {
                  const item = dqdStats.rankings[key];
                  return (
                    <span key={key} className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
                      {item.label}: {item.count}{item.rank ? ` · 第${item.rank}` : ''}
                    </span>
                  );
                })}
            </div>
          )}
          {dqdLoading && (
            <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400 dark:bg-white/[0.03]">
              正在加载逐场技术数据...
            </div>
          )}
          {lineupMatches.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">逐场技术表现</h4>
              <div className="space-y-2">
                {lineupMatches.map((match) => (
                  <Link key={match.idEvent} to={`/match/${match.idEvent}`} className="block rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3 py-2 text-xs transition hover:bg-slate-200 dark:hover:bg-white/[0.06]">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span>vs {match.opponent}</span>
                      <span className="text-slate-400 dark:text-slate-500">{match.score}</span>
                      <span className="rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">{match.role}</span>
                      {match.rating && <span className="ml-auto text-amber-600 dark:text-amber-300">评分 {match.rating}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-400 dark:text-slate-500">
                      {match.keyStats.xg && <span>xG {match.keyStats.xg}</span>}
                      {match.keyStats.xa && <span>xA {match.keyStats.xa}</span>}
                      {match.keyStats.shots && <span>射门 {match.keyStats.shots}</span>}
                      {match.keyStats.shotsOnTarget && <span>射正 {match.keyStats.shotsOnTarget}</span>}
                      {match.keyStats.keyPasses && <span>关键传球 {match.keyStats.keyPasses}</span>}
                      {match.keyStats.passSuccess && <span>传球成功率 {match.keyStats.passSuccess}</span>}
                      {match.keyStats.tackles && <span>抢断 {match.keyStats.tackles}</span>}
                      {match.keyStats.saves && <span>扑救 {match.keyStats.saves}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {lineupMatches.some((match) => match.heatmap) && (
            <div className="mt-5">
              <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">活动热区</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lineupMatches.filter((match) => match.heatmap).map((match) => (
                  <div key={`${match.idEvent}-heatmap`} className="rounded-lg bg-slate-50 dark:bg-white/[0.03] p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span>vs {match.opponent}</span>
                      {match.rating && <span>评分 {match.rating}</span>}
                    </div>
                    <HeatmapMini heatmap={match.heatmap!} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Goals This Tournament */}
      {!dqdStats && totalGoals > 0 && (
        <section className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            本届进球
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-sm font-medium text-emerald-400">
              {totalGoals}球
            </span>
          </h3>
          <div className="space-y-3">
            {playerGoals.map((m) => (
              <div
                key={m.idEvent}
                className="rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <img
                    src={m.opponentFlag}
                    alt=""
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    vs {m.opponentCn}
                  </span>
                  <span className="ml-auto text-xs tabular-nums text-slate-400 dark:text-slate-500">
                    {formatBeijingTime(m.dateEvent, m.strTime)}
                  </span>
                </div>
                <div className="mb-2 text-sm tabular-nums text-slate-400">
                  全场 {m.intHomeScore ?? '?'} - {m.intAwayScore ?? '?'}
                </div>
                <div className="space-y-1">
                  {m.goals.map((g, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="tabular-nums text-emerald-400 font-medium min-w-[1.2rem]">
                        {g.minute ?? "?"}'
                      </span>
                      <span className={g.isOwnGoal ? 'text-red-400' : 'text-slate-900 dark:text-white'}>
                        {g.homeScore} - {g.awayScore}
                      </span>
                      {g.isPenalty && (
                        <span className="rounded bg-amber-500/20 px-1 py-0.5 text-[10px] text-amber-400">
                          点球
                        </span>
                      )}
                      {g.isOwnGoal && (
                        <span className="rounded bg-red-500/20 px-1 py-0.5 text-[10px] text-red-400">
                          乌龙
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Link
                  to="/schedule"
                  className="mt-2 inline-block text-xs text-sky-600 dark:text-sky-400 hover:text-sky-300"
                >
                  查看赛程 →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career Timeline */}
      {careerEntries && (
        <section className="rounded-xl border border-l-4 border-l-indigo-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-5 text-lg font-bold">职业生涯</h3>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-white/10" />
            <div className="space-y-4">
              {careerEntries.map((entry, idx) => {
                const startLabel = entry.start.slice(0, 7).replace('-', '.');
                const endLabel = entry.end === '至今' ? '至今' : entry.end.slice(0, 7).replace('-', '.');
                return (
                  <div key={idx} className="relative flex gap-4 pl-8">
                    <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-indigo-950" />
                    <div className="min-w-0 flex-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] p-3">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-semibold text-slate-200">{entry.team}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{startLabel} &ndash; {endLabel}</span>
                      </div>
                      <div className="mt-1.5 flex gap-3 text-xs text-slate-400">
                        <span>出场 {entry.appearances}</span>
                        <span className="text-emerald-400">进球 {entry.goals}</span>
                        <span className="text-sky-600 dark:text-sky-400">助攻 {entry.assists}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {careerEntries === null && dqdStats && (
        <section className="rounded-xl border border-l-4 border-l-slate-300 dark:border-l-slate-600 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-3 text-lg font-bold">职业生涯</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500">暂无职业生涯数据</p>
        </section>
      )}

      <div className="flex justify-center">
        <Link
          to={`/teams/${team.shortName}`}
          className="rounded-lg bg-sky-500/10 px-6 py-2 text-sm text-sky-600 dark:text-sky-400 transition hover:bg-sky-500/20"
        >
          返回{teamCnName}全部球员
        </Link>
      </div>
    </div>
  );
}

function HeatmapMini({ heatmap }: { heatmap: DqdHeatmap }) {
  return (
    <div className="relative h-40 overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-950/40">
      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200 dark:bg-white/15" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300 dark:border-white/15" />
      <div className="absolute bottom-0 left-1/2 h-6 w-16 -translate-x-1/2 rounded-t-full border border-slate-300 dark:border-white/15" />
      <div className="absolute left-1/2 top-0 h-6 w-16 -translate-x-1/2 rounded-b-full border border-slate-300 dark:border-white/15" />
      {heatmap.points.slice(0, 220).map(([x, y], idx) => (
        <span
          key={idx}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/25 shadow-[0_0_8px_rgba(252,211,77,0.35)]"
          style={{ left: `${x}%`, top: `${100 - y}%` }}
        />
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-2">
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
