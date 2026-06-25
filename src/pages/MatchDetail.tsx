import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import scheduleData from '../data/venue-schedule.json';
import squadsData from '../data/squads.json';
import { fetchOpenLigaGoalsForMatch } from '../utils/matchData';
import { formatBeijingTime } from '../utils/datetime';
import { venueIdFromName, venueLabel } from '../utils/venueLabels';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import { fetchDqdIdMap, fetchDqdCnMap, lookupDqdPlayer, lookupCnPlayer } from '../utils/dqdPlayerMap';
import type { DqdIdMap, PlayerLinkInfo } from '../utils/dqdPlayerMap';
import type { StaticGoal } from '../types';
import { fetchJson, clearJsonCache } from '../utils/jsonData';
import LoadingState from '../components/LoadingState';
import { teamFlag, teamCn, teamShort } from '../utils/teamLookup';
import { useLiveScorePatches } from '../utils/liveScores';

interface SquadEntry {
  name: string;
  players: {
    number: string;
    position: string;
    name: string;
  }[];
}

interface MatchData {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
  strVenue: string;
  strGroup: string | null;
  dateEvent: string;
  strTimestamp?: string;
  strTime: string;
  strTimeLocal: string | null;
  goals?: StaticGoal[];
}

interface DqdLineupPlayer {
  personId: string;
  name: string;
  logo: string;
  shirtNumber: string;
  position: string;
  x: string;
  y: string;
  rating: string;
  captain: boolean;
  mvp: boolean;
  height: string;
  foot: string;
  events: number[];
  keyStats: Record<string, string>;
}

interface DqdTeamLineup {
  teamName: string;
  formation: string;
  coach: string;
  marketValue: string;
  averageAge: string;
  starters: DqdLineupPlayer[];
  substitutes: DqdLineupPlayer[];
}

interface DqdMatchDetail {
  detail: {
    group: string;
    gameweek: string;
    halfScore: string;
    title: string;
  } | null;
  overview: {
    events: { side: string; key?: string; minute?: string; minuteExtra?: string; code: string; person: string; personId: string; score: string; reason: string }[];
    stats: { type: string; home: number; away: number; homePercent: number; awayPercent: number }[];
    tendencies: { data: { x: number; y: string; minute: string; team_a_goal?: unknown; team_b_goal?: unknown }[] } | null;
    bestPlayers: {
      home: { personId: string; name: string; logo: string; rating: string; events: { type: string; minute: string }[] } | null;
      away: { personId: string; name: string; logo: string; rating: string; events: { type: string; minute: string }[] } | null;
    };
    archive: { title: string; thumb: string; commentsTotal: string } | null;
  };
  lineup: {
    base: { field: string; weather: string; temperature: string; referee: string } | null;
    home: DqdTeamLineup | null;
    away: DqdTeamLineup | null;
  } | null;
}

const LIVE_STATUSES = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT']);

const allMatches: MatchData[] = Object.values(
  scheduleData as unknown as Record<string, MatchData[]>
).flat();

const squads = squadsData as SquadEntry[];

const POSITION_LABELS: Record<string, string> = {
  GK: '守门员', DF: '后卫', MF: '中场', FW: '前锋',
};

const DQD_EVENT_LABELS: Record<string, string> = {
  G: '进球', PG: '点球', OG: '乌龙',
  AS: '助攻',
  VAR: 'VAR',
  SI: '换上', SO: '换下',
  YC: '黄牌', RC: '红牌',
  HT: '半场',
};


export default function MatchDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const liveScores = useLiveScorePatches();
  const [dqdMatches, setDqdMatches] = useState<Record<string, DqdMatchDetail> | null>(null);
  const [dqdIdMap, setDqdIdMap] = useState<DqdIdMap>({});
  const [dqdCnMap, setDqdCnMap] = useState<Map<string, PlayerLinkInfo[]>>(new Map());

  const match = useMemo(
    () => allMatches.find((m) => m.idEvent === eventId),
    [eventId]
  );

  useEffect(() => {
    let cancelled = false;
    if (!eventId) return;
    fetchJson<DqdMatchDetail>(`/data/dqd-matches/${eventId}.json`, { maxAge: 2 * 60_000 })
      .then((data) => { if (!cancelled) setDqdMatches({ [eventId]: data }); })
      .catch(() => { if (!cancelled) setDqdMatches({}); });
    return () => { cancelled = true; };
  }, [eventId]);

  const isLiveMatch = useMemo(() => {
    if (!match) return false;
    const live = liveScores.get(match.idEvent);
    const status = live?.strStatus ?? match.strStatus;
    return status !== null && LIVE_STATUSES.has(status);
  }, [match, liveScores]);

  useEffect(() => {
    if (!isLiveMatch || !eventId) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const refresh = () => {
      clearJsonCache(`/data/dqd-matches/${eventId}.json`);
      fetchJson<DqdMatchDetail>(`/data/dqd-matches/${eventId}.json`, { maxAge: 2 * 60_000 })
        .then((data) => {
          if (!cancelled) setDqdMatches({ [eventId]: data });
        })
        .catch(() => {});
    };

    interval = setInterval(refresh, 60_000);

    const handleVisibility = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isLiveMatch, eventId]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchDqdIdMap(), fetchDqdCnMap()]).then(([idMap, cnMap]) => {
      if (!cancelled) { setDqdIdMap(idMap); setDqdCnMap(cnMap); }
    });
    return () => { cancelled = true; };
  }, []);

  const homeSquad = useMemo(
    () => match ? squads.find((s) => s.name === match.strHomeTeam) ?? null : null,
    [match]
  );
  const awaySquad = useMemo(
    () => match ? squads.find((s) => s.name === match.strAwayTeam) ?? null : null,
    [match]
  );

  const [openLigaGoals, setOpenLigaGoals] = useState<StaticGoal[]>([]);

  useEffect(() => {
    if (!match) return;
    let cancelled = false;
    fetchOpenLigaGoalsForMatch(match.strHomeTeam, match.strAwayTeam, match.strTimestamp)
      .then((goals) => {
        if (!cancelled) setOpenLigaGoals(goals);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [match]);


  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-500 dark:text-slate-400">未找到比赛</p>
        <Link to="/schedule" className="text-sm text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
          ← 返回赛程
        </Link>
      </div>
    );
  }

  const live = liveScores.get(match.idEvent);
  const homeScore = live?.intHomeScore ?? match.intHomeScore;
  const awayScore = live?.intAwayScore ?? match.intAwayScore;
  const status = live?.strStatus ?? match.strStatus;
  const finished = status === 'FT';
  const isLive = status && status !== 'FT' && status !== 'NS' && status !== null;
  const bjTime = formatBeijingTime(match.dateEvent, match.strTime);
  const venueId = venueIdFromName(match.strVenue);
  const venueName = venueLabel(match.strVenue);

  const homeFlag = teamFlag(match.strHomeTeam);
  const awayFlag = teamFlag(match.strAwayTeam);
  const homeCn = teamCn(match.strHomeTeam);
  const awayCn = teamCn(match.strAwayTeam);
  const homeShort = match.strHomeTeam ? teamShort(match.strHomeTeam) : '';
  const awayShort = match.strAwayTeam ? teamShort(match.strAwayTeam) : '';

  const dqdMatch = dqdMatches?.[match.idEvent] ?? null;
  const keyMan = (() => {
    if (!dqdMatch?.lineup) return null;
    const players = [
      ...(dqdMatch.lineup.home?.starters || []),
      ...(dqdMatch.lineup.home?.substitutes || []),
      ...(dqdMatch.lineup.away?.starters || []),
      ...(dqdMatch.lineup.away?.substitutes || []),
    ].filter((player) => player.rating);
    const best = players.sort((a, b) => Number(b.rating) - Number(a.rating))[0];
    if (!best) return null;
    const reasons = [];
    if (best.keyStats.xg) reasons.push(`xG ${best.keyStats.xg}`);
    if (best.keyStats.xa) reasons.push(`xA ${best.keyStats.xa}`);
    if (best.keyStats.shots) reasons.push(`射门 ${best.keyStats.shots}`);
    if (best.keyStats.keyPasses) reasons.push(`关键传球 ${best.keyStats.keyPasses}`);
    if (best.keyStats.saves) reasons.push(`扑救 ${best.keyStats.saves}`);
    return { player: best, reasons };
  })();
  const goals = openLigaGoals.length > 0
    ? openLigaGoals
    : (match.goals || []);
  goals.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));
  const tendencyData = dqdMatch?.overview.tendencies?.data ?? [];
  const tendencyGoalEvents = (dqdMatch?.overview.events || []).filter((event) => ['G','PS','OG'].includes(event.code));

  return (
    <div className="space-y-6">
      <Link to="/schedule" className="text-sm text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
        ← 返回赛程
      </Link>

      {/* Match Header */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-center gap-1">
          <span
            className={`rounded px-3 py-1 text-xs font-medium ${
              finished
                ? 'bg-emerald-500/20 text-emerald-400 dark:text-emerald-300'
                : isLive
                  ? 'bg-red-500/20 text-red-400 dark:text-red-300 animate-pulse'
                  : 'bg-slate-500/20 text-slate-500 dark:text-slate-400'
            }`}
          >
            {finished ? '已结束' : isLive ? '进行中' : '未开始'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Home */}
          <div className="flex w-32 flex-col items-center gap-2 md:w-40">
            <img
              src={homeFlag}
              alt=""
              className="h-16 w-16 object-contain md:h-20 md:w-20"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <Link
              to={homeShort ? `/teams/${homeShort}` : '#'}
              className="text-center text-sm font-bold hover:text-sky-600 dark:text-sky-400 md:text-base"
            >
              {homeCn}
            </Link>
          </div>

          {/* Score */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tabular-nums md:text-5xl">
              {homeScore ?? '-'}
            </span>
            <span className="text-2xl text-slate-400 dark:text-slate-500">:</span>
            <span className="text-4xl font-extrabold tabular-nums md:text-5xl">
              {awayScore ?? '-'}
            </span>
          </div>

          {/* Away */}
          <div className="flex w-32 flex-col items-center gap-2 md:w-40">
            <img
              src={awayFlag}
              alt=""
              className="h-16 w-16 object-contain md:h-20 md:w-20"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <Link
              to={awayShort ? `/teams/${awayShort}` : '#'}
              className="text-center text-sm font-bold hover:text-sky-600 dark:text-sky-400 md:text-base"
            >
              {awayCn}
            </Link>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span>{bjTime}</span>
          {match.strGroup && (
            <span className="rounded bg-slate-200 dark:bg-white/10 px-2 py-0.5">{match.strGroup}组</span>
          )}
          {venueId ? (
            <Link to={`/venues/${venueId}`} className="hover:text-sky-500 dark:hover:text-sky-400">
              <span aria-hidden="true">📍</span> <span className="sr-only">比赛场地：</span>{venueName}
            </Link>
          ) : (
            <span><span aria-hidden="true">📍</span> {venueName}</span>
          )}
        </div>
      </div>

      {keyMan && (
        <section className="rounded-xl border border-l-4 border-l-amber-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-3 text-lg font-bold">本场关键先生</h3>
          <div className="flex flex-wrap items-center gap-3">
            {keyMan.player.logo && <img src={keyMan.player.logo} alt="" className="h-12 w-12 rounded-full object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {linkedDqdPlayer(keyMan.player, homeShort || awayShort || '', dqdIdMap, dqdCnMap, 'text-base font-bold text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-sky-300 hover:underline')}
                <span className="rounded bg-amber-500/15 px-2 py-0.5 text-sm font-bold text-amber-600 dark:text-amber-300">评分 {keyMan.player.rating}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {keyMan.reasons.length > 0 ? keyMan.reasons.join(' · ') : '综合评分全场最高'}
              </p>
            </div>
          </div>
        </section>
      )}

      {dqdMatches === null && (
        <LoadingState label="加载比赛数据" />
      )}

      {dqdMatch && (
        <section className="rounded-xl border border-l-4 border-l-sky-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">比赛数据</h3>
          {(dqdMatch.overview.bestPlayers.home || dqdMatch.overview.bestPlayers.away) && (
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {[dqdMatch.overview.bestPlayers.home, dqdMatch.overview.bestPlayers.away].filter(Boolean).map((player) => (
                <div key={player!.name} className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-white/[0.03] p-3">
                  {player!.logo && <img src={player!.logo} alt="" className="h-10 w-10 rounded-full object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{player!.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">评分 {player!.rating}</p>
                  </div>
                  <div className="flex gap-1 text-xs text-emerald-400">
                    {player!.events.filter((event) => event.type === 'G').length > 0 && `${player!.events.filter((event) => event.type === 'G').length}球`}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {dqdMatch.overview.stats
              .filter((stat) => ['控球率','射门','射正','角球','传球','传球成功率','抢断','拦截','解围'].includes(stat.type))
              .map((stat) => {
                const total = Number(stat.home || 0) + Number(stat.away || 0);
                const homePct = total > 0 ? (Number(stat.home || 0) / total) * 100 : 50;
                const awayPct = total > 0 ? 100 - homePct : 50;
                return (
                  <div key={stat.type} className="grid grid-cols-[1fr_3rem_4rem_3rem_1fr] items-center gap-2 text-xs">
                    <div className="h-1.5 overflow-hidden rounded bg-slate-200 dark:bg-white/10">
                      <div className="ml-auto h-full rounded bg-sky-500" style={{ width: `${homePct}%` }} />
                    </div>
                    <span className="text-right font-semibold text-slate-700 dark:text-slate-300">{stat.home}</span>
                    <span className="text-center text-slate-400 dark:text-slate-500">{stat.type}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{stat.away}</span>
                    <div className="h-1.5 overflow-hidden rounded bg-slate-200 dark:bg-white/10">
                      <div className="h-full rounded bg-rose-500" style={{ width: `${awayPct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {tendencyData.length > 0 ? (
        <MomentumChart
          data={tendencyData}
          goalEvents={tendencyGoalEvents}
          homeCn={homeCn}
          awayCn={awayCn}
        />
      ) : (
        <section className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5 text-center">
          <p className="text-sm text-slate-400">暂无进攻势头数据</p>
        </section>
      )}

      {dqdMatch?.lineup && (dqdMatch.lineup.home || dqdMatch.lineup.away) && (
        <section className="rounded-xl border border-l-4 border-l-violet-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">首发阵容</h3>
            {dqdMatch.lineup.base && (
              <div className="flex flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500">
                {dqdMatch.lineup.base.referee && <span>主裁 {dqdMatch.lineup.base.referee}</span>}
                {dqdMatch.lineup.base.weather && <span>{dqdMatch.lineup.base.weather} {dqdMatch.lineup.base.temperature}</span>}
              </div>
            )}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {dqdMatch.lineup.home && (
              <FormationCard
                teamCn={homeCn}
                teamCode={homeShort || ''}
                side="home"
                lineup={dqdMatch.lineup.home}
                dqdIdMap={dqdIdMap}
                dqdCnMap={dqdCnMap}
              />
            )}
            {dqdMatch.lineup.away && (
              <FormationCard
                teamCn={awayCn}
                teamCode={awayShort || ''}
                side="away"
                lineup={dqdMatch.lineup.away}
                dqdIdMap={dqdIdMap}
                dqdCnMap={dqdCnMap}
              />
            )}
          </div>
        </section>
      )}

      {dqdMatch && dqdMatch.overview.events.length > 0 && (
        <EventTimeline
          events={dqdMatch.overview.events}
          homeCn={homeCn}
          awayCn={awayCn}
          homeShort={homeShort || ''}
          awayShort={awayShort || ''}
          dqdIdMap={dqdIdMap}
          dqdCnMap={dqdCnMap}
        />
      )}

      {/* Goal Timeline */}
      {!dqdMatch && goals.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">进球时间线</h3>
          <div className="space-y-3">
            {goals.map((g, i) => {
              const isHome = g.team === 'home';
              const scorerInfo = lookupPlayerByExactName(g.name);
              const cnName = scorerInfo?.cnName || g.name;
              const teamCode = isHome ? homeShort : awayShort;
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] px-3 py-2">
                  <span className="min-w-[2.5rem] text-center text-lg font-bold tabular-nums text-emerald-400">
                    {g.minute ?? '?'}'
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={g.isOwnGoal ? 'text-red-400 line-through' : 'text-slate-900 dark:text-white'}>
                        {scorerInfo ? (
                          <Link
                            to={`/players/${scorerInfo.teamCode}/${encodeURIComponent(g.name)}`}
                             className="hover:text-sky-500 dark:hover:text-sky-400"
                          >
                            {cnName}
                          </Link>
                        ) : (
                          cnName
                        )}
                      </span>
                      {teamCode && scorerInfo && (
                        <img
                          src={isHome ? homeFlag : awayFlag}
                          alt=""
                          className="h-4 w-4 object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <span className="tabular-nums">{g.homeScore} - {g.awayScore}</span>
                      {g.isPenalty && (
                        <span className="rounded bg-amber-500/20 px-1 py-0.5 text-[10px] text-amber-400">点球</span>
                      )}
                      {g.isOwnGoal && (
                        <span className="rounded bg-red-500/20 px-1 py-0.5 text-[10px] text-red-400">乌龙</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Squads */}
      <div className="grid gap-6 md:grid-cols-2">
        <SquadSection
          teamCn={homeCn}
          teamFlag={homeFlag}
          teamCode={homeShort || ''}
          squad={homeSquad}
        />
        <SquadSection
          teamCn={awayCn}
          teamFlag={awayFlag}
          teamCode={awayShort || ''}
          squad={awaySquad}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Link to="/schedule" className="rounded-lg bg-sky-500/10 px-6 py-2 text-sm text-sky-600 dark:text-sky-400 transition hover:bg-sky-500/20">
          返回赛程
        </Link>
        {homeShort && (
          <Link to={`/teams/${homeShort}`} className="rounded-lg bg-slate-100 dark:bg-white/5 px-6 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-white/10">
            {homeCn}阵容
          </Link>
        )}
        {awayShort && (
          <Link to={`/teams/${awayShort}`} className="rounded-lg bg-slate-100 dark:bg-white/5 px-6 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:bg-white/10">
            {awayCn}阵容
          </Link>
        )}
      </div>
    </div>
  );
}

function linkedDqdPlayer(
  player: { personId: string; name: string },
  teamCode: string,
  dqdIdMap: DqdIdMap,
  dqdCnMap: Map<string, PlayerLinkInfo[]>,
  className: string,
) {
  if (!player.name) return <span className={className}>{player.personId || '??'}</span>;
  const byId = lookupDqdPlayer(dqdIdMap, player.personId);
  const byCn = byId ? null : lookupCnPlayer(dqdCnMap, player.name, teamCode);
  const info = byId || byCn;
  if (!info || !info.enName) return <span className={className}>{player.name}</span>;
  return (
    <Link to={`/players/${info.team}/${encodeURIComponent(info.enName)}`} className={className}>
      {player.name}
    </Link>
  );
}

function FormationCard({
  teamCn,
  teamCode,
  side,
  lineup,
  dqdIdMap,
  dqdCnMap,
}: {
  teamCn: string;
  teamCode: string;
  side: 'home' | 'away';
  lineup: DqdTeamLineup;
  dqdIdMap: DqdIdMap;
  dqdCnMap: Map<string, PlayerLinkInfo[]>;
}) {
  const accent = side === 'home' ? 'bg-sky-500' : 'bg-rose-500';
  const border = side === 'home' ? 'border-sky-500/30' : 'border-rose-500/30';
  const topRated = [...lineup.starters, ...lineup.substitutes]
    .filter((player) => player.rating)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 3);
  return (
    <div className={`rounded-xl border ${border} bg-slate-50 dark:bg-white/[0.03] p-4`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-bold">{teamCn} {lineup.formation && <span className="text-slate-400">· {lineup.formation}</span>}</h4>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {lineup.coach && `主帅 ${lineup.coach}`}
            {lineup.marketValue && ` · 总身价 ${lineup.marketValue}`}
            {lineup.averageAge && ` · 平均 ${lineup.averageAge}`}
          </p>
        </div>
      </div>
      <div className="relative h-80 overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/40">
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300 dark:bg-white/20" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300 dark:border-white/20" />
        {(lineup.starters || []).map((player) => {
          const px = Number(player.x);
          const py = Number(player.y);
          const left = `${Math.max(8, Math.min(92, Number.isFinite(px) ? px : 50))}%`;
          const top = `${Math.max(8, Math.min(92, 100 - (Number.isFinite(py) ? py : 50)))}%`;
          return (
            <div key={player.personId || player.name} className="absolute w-20 -translate-x-1/2 -translate-y-1/2 text-center" style={{ left, top }}>
              <div className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full ${accent} text-[11px] font-bold text-slate-900 dark:text-white shadow-lg`}>
                {player.shirtNumber || '?'}
              </div>
              {linkedDqdPlayer(player, teamCode, dqdIdMap, dqdCnMap, 'block truncate text-[10px] font-medium text-slate-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-300 hover:underline')}
              {player.rating && <div className="mx-auto mt-0.5 w-fit rounded bg-slate-200 dark:bg-black/40 px-1 text-[10px] text-amber-600 dark:text-amber-300">{player.rating}</div>}
            </div>
          );
        })}
      </div>
      {topRated.length > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {topRated.map((player) => (
            <div key={player.personId || player.name} className="rounded-lg bg-slate-100 dark:bg-white/[0.04] px-2 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">{player.rating}</span>
                {linkedDqdPlayer(player, teamCode, dqdIdMap, dqdCnMap, 'truncate font-medium text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-300 hover:underline')}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                {player.keyStats.xg && <span>xG {player.keyStats.xg}</span>}
                {player.keyStats.shots && <span>射门 {player.keyStats.shots}</span>}
                {player.keyStats.keyPasses && <span>关键传球 {player.keyStats.keyPasses}</span>}
                {player.keyStats.saves && <span>扑救 {player.keyStats.saves}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {(lineup.substitutes || []).length > 0 && (
        <div className="mt-3">
          <h5 className="mb-2 text-xs font-semibold text-slate-400">替补席</h5>
          <div className="flex flex-wrap gap-1.5">
            {(lineup.substitutes || []).map((player) => (
              <span key={player.personId || player.name} className="rounded-full bg-slate-100 dark:bg-white/5 px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300">
                #{player.shirtNumber} {linkedDqdPlayer(player, teamCode, dqdIdMap, dqdCnMap, 'hover:text-sky-500 dark:hover:text-sky-300 hover:underline')}
                {player.rating && <span className="ml-1 text-amber-600 dark:text-amber-300">{player.rating}</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SquadSection({
  teamCn,
  teamFlag,
  teamCode,
  squad,
}: {
  teamCn: string;
  teamFlag: string;
  teamCode: string;
  squad: SquadEntry | null;
}) {
  if (!squad) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4">
        <h4 className="mb-2 text-sm font-bold text-slate-400">{teamCn}</h4>
        <p className="text-xs text-slate-600">阵容数据暂无</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <img
          src={teamFlag}
          alt=""
          className="h-6 w-6 object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <h4 className="text-sm font-bold">{teamCn} · 大名单</h4>
      </div>
      <div className="space-y-1">
        {squad.players.map((p) => {
          const info = lookupPlayerByExactName(p.name);
          return (
            <Link
              key={p.number}
              to={`/players/${teamCode}/${encodeURIComponent(p.name)}`}
              className="flex items-center gap-2 rounded px-2 py-1 text-xs transition hover:bg-slate-100 dark:bg-white/5"
            >
              <span className="w-6 text-center tabular-nums text-slate-400 dark:text-slate-500">{p.number}</span>
              <span className="flex-1 truncate text-slate-700 dark:text-slate-300">
                {info?.cnName || p.name}
              </span>
              <span className="text-[10px] text-slate-600">
                {POSITION_LABELS[p.position] || p.position}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MomentumChart({
  data,
  goalEvents,
  homeCn,
  awayCn,
}: {
  data: { x: number; y: string; minute: string; team_a_goal?: unknown; team_b_goal?: unknown }[];
  goalEvents: { key?: string; side: string; score: string }[];
  homeCn: string;
  awayCn: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgW, setSvgW] = useState(400);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setSvgW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const svgH = 220;
  const pad = { l: 44, r: 16, t: 16, b: 26 };
  const chartW = svgW - pad.l - pad.r;
  const chartH = svgH - pad.t - pad.b;

  const maxX = useMemo(() => Math.max(...data.map((d) => d.x), 90), [data]);
  const sx = useCallback((x: number) => pad.l + (x / maxX) * chartW, [pad.l, maxX, chartW]);
  const sy = useCallback((y: number) => pad.t + ((100 - y) / 200) * chartH, [pad.t, chartH]);

  const y0 = sy(0);

  const polylinePoints = useMemo(
    () => data.map((d) => `${sx(d.x)},${sy(Number(d.y))}`).join(' '),
    [data, sx, sy]
  );

  const homeFill = useMemo(() => {
    const pts = data.map((d) => `${sx(d.x)},${sy(Math.max(0, Number(d.y)))}`).join(' ');
    return `${sx(0)},${y0} ${pts} ${sx(maxX)},${y0}`;
  }, [data, sx, sy, y0, maxX]);

  const awayFill = useMemo(() => {
    const pts = data.map((d) => `${sx(d.x)},${sy(Math.min(0, Number(d.y)))}`).join(' ');
    return `${sx(0)},${y0} ${pts} ${sx(maxX)},${y0}`;
  }, [data, sx, sy, y0, maxX]);

  const goalMarkers = useMemo(
    () =>
      goalEvents.map((e) => {
        const m = parseInt(e.key || '0');
        return { minute: m, isHome: e.side === 'teamAEvents', score: e.score };
      }),
    [goalEvents]
  );

  const labels = useMemo(
    () => [
      { x: 0, label: "0'" },
      { x: 15, label: "15'" },
      { x: 30, label: "30'" },
      { x: 45, label: 'HT' },
      { x: 60, label: "60'" },
      { x: 75, label: "75'" },
      { x: 90, label: 'FT' },
    ],
    []
  );

  if (svgW < 100) return null;

  return (
    <section className="rounded-xl border border-l-4 border-l-amber-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
      <h3 className="mb-4 text-lg font-bold">进攻势头</h3>
      <div className="mb-3 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span className="text-sky-600 dark:text-sky-400">▲ {homeCn}主导</span>
        <span className="text-rose-400">{awayCn}主导 ▼</span>
      </div>
      <div ref={containerRef} className="w-full">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block"
        >
          {/* Center y=0 line */}
          <line
            x1={pad.l}
            y1={y0}
            x2={svgW - pad.r}
            y2={y0}
            className="stroke-slate-300 dark:stroke-white/10"
            strokeDasharray="4,5"
            strokeWidth={1}
          />

          {/* Half-time line */}
          <line
            x1={sx(45)}
            y1={pad.t}
            x2={sx(45)}
            y2={svgH - pad.b}
            className="stroke-slate-200 dark:stroke-white/5"
            strokeDasharray="3,3"
            strokeWidth={1}
          />

          {/* Home fill (sky-500 above center) */}
          {data.some((d) => Number(d.y) > 0) && (
            <polygon points={homeFill} fill="rgba(14,165,233,0.18)" />
          )}

          {/* Away fill (rose-500 below center) */}
          {data.some((d) => Number(d.y) < 0) && (
            <polygon points={awayFill} fill="rgba(244,63,94,0.18)" />
          )}

          {/* Data polyline */}
          <polyline
            points={polylinePoints}
            fill="none"
            className="stroke-slate-500 dark:stroke-white/50"
            strokeWidth={1.5}
          />

          {/* Goal markers */}
          {goalMarkers.map((g, i) => (
            <circle
              key={i}
              cx={sx(g.minute)}
              cy={g.isHome ? y0 - 10 : y0 + 10}
              r={4}
              fill={g.isHome ? '#0ea5e9' : '#f43f5e'}
              stroke="#fff"
              strokeWidth={1}
            />
          ))}

          {/* X-axis labels */}
          {labels.map((l) => (
            <text
              key={l.label}
              x={sx(l.x)}
              y={svgH - 4}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-white/30"
              fontSize={10}
              fontFamily="ui-monospace, monospace"
            >
              {l.label}
            </text>
          ))}

          {/* Left team label */}
          <text
            x={pad.l - 6}
            y={pad.t + 10}
            textAnchor="end"
            fill="rgba(14,165,233,0.45)"
            fontSize={10}
          >
            {homeCn}
          </text>

          {/* Right team label */}
          <text
            x={pad.l - 6}
            y={svgH - pad.b - 2}
            textAnchor="end"
            fill="rgba(244,63,94,0.45)"
            fontSize={10}
          >
            {awayCn}
          </text>
        </svg>
      </div>
    </section>
  );
}

function EventTimeline({
  events,
  homeCn,
  awayCn,
  homeShort,
  awayShort,
  dqdIdMap,
  dqdCnMap,
}: {
  events: { side: string; key?: string; minute?: string; minuteExtra?: string; code: string; person: string; personId: string; score: string; reason: string }[];
  homeCn: string;
  awayCn: string;
  homeShort: string;
  awayShort: string;
  dqdIdMap: DqdIdMap;
  dqdCnMap: Map<string, PlayerLinkInfo[]>;
}) {
  const refined = useMemo(() => {
    return events
      .filter((e) => ['G', 'PS', 'PM', 'OG', 'YC', 'RC', 'ST', 'AS', 'HT', 'SI', 'SO', 'PG'].includes(e.code))
      .map((e) => ({ ...e, sortKey: parseInt(e.key || '0') }))
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [events]);

  if (refined.length === 0) return null;

  const isGoal = (code: string) => ['G', 'PS', 'OG', 'PG'].includes(code);
  const isPenaltyMiss = (code: string) => code === 'PM';
  const isCard = (code: string) => code === 'YC' || code === 'RC';
  const isSub = (code: string) => code === 'ST' || code === 'SI' || code === 'SO';
  const iconFor = (code: string) => {
    if (isGoal(code)) return '\u26BD';
    if (isPenaltyMiss(code)) return '\u2716';
    if (code === 'RC') return '\u{1F7E5}';
    if (code === 'YC') return '\u{1F7E8}';
    if (isSub(code)) return '\u{1F504}';
    return '';
  };

  const lastMinute = refined[refined.length - 1].sortKey;

  return (
    <section className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
      <h3 className="mb-4 text-lg font-bold">比赛事件</h3>
      <div className="relative">
        {refined.map((event, idx) => {
          const isHome = event.side === 'teamAEvents';
          const isNeutral = event.side === 'neutralEvents';
          const minute = event.key || event.minute || '';
          const isLast = idx === refined.length - 1;
          const isHt = event.code === 'HT';
          const accent = isHome ? 'sky' : 'rose';

          if (isNeutral || isHt) {
            return (
              <div key={`${minute}-${event.code}-${idx}`} className="flex items-center py-1">
                <div className="flex w-14 shrink-0 flex-col items-center">
                  {!isHt && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                      {minute}{!minute.endsWith("'") ? "'" : ''}
                    </span>
                  )}
                  <div className="my-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-600 bg-white dark:bg-slate-800" />
                  {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-white/10" style={{ minHeight: 16 }} />}
                </div>
                <div
                  className={`rounded-lg px-3 py-1.5 text-xs w-full ${
                    isHt ? 'bg-slate-100 dark:bg-white/5 text-center font-medium text-slate-400' : 'bg-slate-50 dark:bg-white/[0.03] text-slate-400'
                  }`}
                >
                  {event.person || (isHt ? '半场' : DQD_EVENT_LABELS[event.code] || event.code)}
                  {event.reason && <span className="ml-1 text-amber-400">({event.reason})</span>}
                </div>
              </div>
            );
          }

          return (
            <div key={`${minute}-${event.code}-${idx}`} className="flex items-start py-0.5">
              {/* Timeline: minute + dot + connecting line */}
              <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">{minute}'</span>
                <div
                  className={`my-0.5 h-2.5 w-2.5 rounded-full border-2 ${
                    isGoal(event.code)
                      ? `${isHome ? 'border-sky-400 bg-sky-500' : 'border-rose-400 bg-rose-500'} ring-2 ring-white/20`
                      : isCard(event.code)
                        ? `${event.code === 'RC' ? 'border-red-500 bg-red-600' : 'border-yellow-500 bg-yellow-500'}`
                        : isSub(event.code)
                          ? 'border-slate-500 bg-slate-600'
                          : `${isHome ? 'border-sky-400/40 bg-sky-500/50' : 'border-rose-400/40 bg-rose-500/50'}`
                  }`}
                />
                {!isLast && (
                  <div
                    className="w-px flex-1 bg-slate-200 dark:bg-white/10"
                    style={{ minHeight: isGoal(event.code) ? 20 : 12 }}
                  />
                )}
              </div>

              {/* Event card */}
              <div
                className={`flex flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg px-3 py-1.5 text-sm ${
                  isGoal(event.code) ? `bg-${accent}-500/10` : isCard(event.code) ? 'bg-slate-50 dark:bg-white/[0.03]' : 'bg-slate-50 dark:bg-white/[0.02]'
                }`}
              >
                {/* Team badge */}
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    isHome ? 'bg-sky-500/20 text-sky-400 dark:text-sky-300' : 'bg-rose-500/20 text-rose-400 dark:text-rose-300'
                  }`}
                >
                  {isHome ? homeCn : awayCn}
                </span>

                {/* Icon */}
                <span className="text-base leading-none">{iconFor(event.code)}</span>

                {/* Event type label */}
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{DQD_EVENT_LABELS[event.code] || event.code}</span>

                {/* Player name */}
                {event.person && (
                  <span className={`font-medium ${isGoal(event.code) ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    {(() => {
                      const name = event.person;
                      const teamShort = event.code === 'OG'
                        ? (isHome ? awayShort : homeShort)
                        : (isHome ? homeShort : awayShort);
                      const byId = lookupDqdPlayer(dqdIdMap, event.personId);
                      const byCn = byId ? null : lookupCnPlayer(dqdCnMap, name, teamShort);
                      const info = byId || byCn;
                      if (info) {
                        return (
                          <Link
                            to={`/players/${info.team}/${encodeURIComponent(info.enName)}`}
                            className="hover:text-sky-500 dark:hover:text-sky-400 hover:underline transition"
                          >
                            {name}
                          </Link>
                        );
                      }
                      return name;
                    })()}
                  </span>
                )}

                {/* Score */}
                {event.score && (
                  <span className="ml-auto rounded bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                    {event.score}
                  </span>
                )}

                {/* Reason */}
                {event.reason && (
                  <span className={`text-[10px] italic ${event.code === 'RC' ? 'text-red-400' : 'text-amber-400'}`}>
                    {event.reason}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* FT marker */}
        <div className="flex items-start py-0.5">
          <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{lastMinute > 90 ? `${lastMinute}'` : 'FT'}</span>
            <div className="my-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-700 bg-white dark:bg-slate-800" />
          </div>
          <div className="flex-1 rounded-lg px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500">终场</div>
        </div>
      </div>
    </section>
  );
}
