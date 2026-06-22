import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatchScorePatches } from '../utils/matchData';
import { fetchAllMatches, fetchMatchGoals } from '../api/openligadb';
import { lookupTeam } from '../utils/teamLookup';
import { lookupGoalScorer } from '../utils/playerLookup';
import { venueLabel } from '../utils/venueLabels';
import { formatBeijingTime, formatBeijingDate } from '../utils/datetime';
import { cache } from '../utils/cache';
import { mergeMatchPatches, buildOpenLigaGoals } from '../utils/matchMerge';
import scheduleData from '../data/venue-schedule.json';
import { buildAllMatches, type BracketMatch } from '../data/bracket';
import type { MatchEvent, StaticGoal } from '../types';
import type { OpenLigaMatch } from '../api/openligadb';

interface StaticMatchEvent extends MatchEvent {
  goals?: StaticGoal[];
  stageKey?: StageFilter;
}

type StageFilter = 'all' | 'G1' | 'G2' | 'G3' | BracketMatch['round'];

const stageOptions: { key: StageFilter; label: string }[] = [
  { key: 'all', label: '全部阶段' },
  { key: 'G1', label: '小组第1轮' },
  { key: 'G2', label: '小组第2轮' },
  { key: 'G3', label: '小组第3轮' },
  { key: 'R32', label: '1/16决赛' },
  { key: 'R16', label: '1/8决赛' },
  { key: 'QF', label: '1/4决赛' },
  { key: 'SF', label: '半决赛' },
  { key: '3P', label: '三四名' },
  { key: 'F', label: '决赛' },
];

const groupFlat: StaticMatchEvent[] = (Object.values(scheduleData as unknown as Record<string, StaticMatchEvent[]>).flat())
  .sort((a, b) => a.dateEvent.localeCompare(b.dateEvent));

const knockoutFlat: StaticMatchEvent[] = buildAllMatches().map((m) => ({
  idEvent: m.id,
  strEvent: `${m.homeLabel} vs ${m.awayLabel}`,
  strEventAlternate: '',
  strSeason: '2026',
  idLeague: '',
  strLeague: 'FIFA World Cup',
  strHomeTeam: m.homeLabel,
  strAwayTeam: m.awayLabel,
  idHomeTeam: '',
  idAwayTeam: '',
  intRound: String(m.matchNo),
  intHomeScore: null,
  intAwayScore: null,
  strTimestamp: `${m.dateEvent}T${m.strTime}Z`,
  dateEvent: m.dateEvent,
  dateEventLocal: m.dateEvent,
  strTime: m.strTime,
  strTimeLocal: '',
  strHomeTeamBadge: '',
  strAwayTeamBadge: '',
  strVenue: m.venue,
  strCountry: '',
  strThumb: '',
  strPoster: '',
  strStatus: 'NS',
  strPostponed: '',
  strGroup: undefined,
  strFilename: '',
  stageKey: m.round,
}));

const staticFlat = [...groupFlat, ...knockoutFlat]
  .sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime));

const roundMap: Record<string, string> = (() => {
  const grouped: Record<string, MatchEvent[]> = {};
  for (const e of staticFlat) {
    if (!e.strGroup) continue;
    if (!grouped[e.strGroup]) grouped[e.strGroup] = [];
    grouped[e.strGroup].push(e);
  }
  const map: Record<string, string> = {};
  for (const matches of Object.values(grouped)) {
    matches.sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime));
    for (let i = 0; i < matches.length; i++) {
      map[matches[i].idEvent] = String(Math.floor(i / 2) + 1);
    }
  }
  return map;
})();

const cachedFlat: StaticMatchEvent[] = staticFlat.map(e => {
  const cached = cache.getEvent(e.idEvent);
  if (cached) {
    return { ...e, ...cached } as StaticMatchEvent;
  }
  return e;
});

function beijingPeriod(strTime: string): { label: string; color: string } {
  const bjHour = (parseInt(strTime.split(':')[0], 10) + 8) % 24;
  if (bjHour < 6) return { label: '凌晨', color: 'text-indigo-400' };
  return { label: '上午', color: 'text-amber-400' };
}

const isLive = (e: StaticMatchEvent) =>
  e.strStatus !== 'FT' && e.strStatus !== 'NS' && e.strStatus !== null;
const isFinished = (e: StaticMatchEvent) =>
  e.strStatus === 'FT' || e.intHomeScore !== null;
const isUpcoming = (e: StaticMatchEvent) => !isFinished(e) && !isLive(e);
const getStageKey = (e: StaticMatchEvent): StageFilter => {
  if (e.stageKey) return e.stageKey;
  const round = roundMap[e.idEvent];
  if (round === '1') return 'G1';
  if (round === '2') return 'G2';
  if (round === '3') return 'G3';
  return 'all';
};
const getStageLabel = (e: StaticMatchEvent): string =>
  stageOptions.find((stage) => stage.key === getStageKey(e))?.label ?? '';

export default function Schedule() {
  const [events, setEvents] = useState<StaticMatchEvent[]>(cachedFlat);
  const [openLigaMatches, setOpenLigaMatches] = useState<OpenLigaMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'all' | 'upcoming' | 'completed' | 'live'>('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStage, setSelectedStage] = useState<StageFilter>('all');
  const cancelledRef = useRef(false);
  const scrolledRef = useRef(false);

  const load = useCallback(async (skipCache: boolean) => {
    if (skipCache) {
      cache.clearTemporary();
      setLoading(true);
      setSyncing(true);
    }
    cancelledRef.current = false;
    const liveMap = await fetchMatchScorePatches(skipCache);
    if (cancelledRef.current) return;

    // Merge API results into static schedule: keep static as base, overlay live scores
    const merged = mergeMatchPatches(staticFlat, liveMap) as StaticMatchEvent[];
    merged.sort((a, b) => a.dateEvent.localeCompare(b.dateEvent));
    setEvents(merged);

    let allMatches = skipCache ? null : cache.getBulkMatches() as OpenLigaMatch[] | null;
    if (!allMatches) {
      allMatches = await fetchAllMatches();
      if (allMatches && allMatches.length > 0) {
        cache.setBulkMatches(allMatches);
      }
    }
    if (cancelledRef.current || !allMatches) {
      setLoading(false);
      setRefreshing(false);
      setSyncing(false);
      return;
    }
    setOpenLigaMatches(allMatches);
    setLoading(false);
    setSyncing(false);

    const toFetch: { match: OpenLigaMatch; idx: number }[] = [];
    for (let i = 0; i < allMatches.length; i++) {
      const m = allMatches[i];
      if (m.goals.length === 0 || !m.goals.some((g) => !g.goalGetterName)) continue;
      const cached = skipCache ? null : cache.getMatchDetail(
        m.matchID,
        m.matchIsFinished ? 'FT' : 'NS',
        m.matchDateTimeUTC
      ) as OpenLigaMatch | null;
      if (cached) {
        allMatches[i] = cached;
      } else {
        toFetch.push({ match: m, idx: i });
      }
    }

    if (toFetch.length > 0) {
      const details = await Promise.all(
        toFetch.map(({ match }) => fetchMatchGoals(match.matchID))
      );
      if (cancelledRef.current) {
        setRefreshing(false);
        return;
      }
      for (let i = 0; i < toFetch.length; i++) {
        const detail = details[i];
        if (detail) {
          const m = toFetch[i].match;
          m.goals = detail.goals;
          allMatches![toFetch[i].idx] = m;
          cache.setMatchDetail(m.matchID, m);
        }
      }
      setOpenLigaMatches([...allMatches!]);
    }
    if (allMatches) {
      for (const event of merged) {
        if (!isFinished(event)) continue;
        const home = lookupTeam(event.strHomeTeam);
        const away = lookupTeam(event.strAwayTeam);
        const olm = allMatches.find(
          (m) =>
            (home?.shortName && away?.shortName &&
              ((m.team1.shortName === home.shortName && m.team2.shortName === away.shortName) ||
               (m.team1.shortName === away.shortName && m.team2.shortName === home.shortName))) ||
            (event.strTimestamp &&
              Math.abs(
                new Date(m.matchDateTimeUTC).getTime() -
                new Date(event.strTimestamp).getTime()
              ) < 3600000)
        );
        const goals = olm && olm.goals.length > 0
          ? buildOpenLigaGoals(olm, event.strHomeTeam)
          : event.goals;
        cache.setEvent(event.idEvent, {
          intHomeScore: event.intHomeScore,
          intAwayScore: event.intAwayScore,
          strStatus: event.strStatus || 'FT',
          goals,
        });
      }
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(false);
    return () => { cancelledRef.current = true; };
  }, [load]);

  useEffect(() => {
    if (scrolledRef.current || events.length === 0) return;
    let anchorDate: string | undefined;
    const liveMatch = events.find(isLive);
    if (liveMatch) {
      anchorDate = liveMatch.dateEvent;
    } else {
      const finished = events.filter(isFinished);
      const upcoming = events.filter(isUpcoming);
      if (finished.length > 0) anchorDate = finished[finished.length - 1].dateEvent;
      else if (upcoming.length > 0) anchorDate = upcoming[0].dateEvent;
    }
    if (anchorDate) {
      setTimeout(() => {
        document.getElementById(`schedule-${anchorDate}`)?.scrollIntoView({ block: 'start' });
      }, 100);
      scrolledRef.current = true;
    }
  }, [events]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  const pollingRef = useRef(false);

  const pollScores = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const liveMap = await fetchMatchScorePatches(true);
      setEvents(prev => mergeMatchPatches(prev, liveMap));
    } finally {
      pollingRef.current = false;
    }
  }, []);

  const hasLiveRef = useRef(false);
  useEffect(() => {
    hasLiveRef.current = events.some(isLive);
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasLiveRef.current) pollScores();
    }, 30_000);
    return () => clearInterval(interval);
  }, [pollScores]);

  const filtered =
    (tab === 'all'
      ? events
      : tab === 'upcoming'
        ? events.filter(isUpcoming)
        : tab === 'completed'
          ? events.filter(isFinished)
          : events.filter(isLive))
    .filter((e) => selectedGroup === 'all' || e.strGroup === selectedGroup)
    .filter((e) => selectedStage === 'all' || getStageKey(e) === selectedStage);

  const dateGroups = new Map<string, { iso: string; label: string; matches: StaticMatchEvent[] }>();
  for (const e of filtered) {
    const bjDate = formatBeijingDate(e.dateEvent, e.strTime);
    if (!dateGroups.has(bjDate.iso)) {
      dateGroups.set(bjDate.iso, { iso: bjDate.iso, label: bjDate.label, matches: [] });
    }
    dateGroups.get(bjDate.iso)!.matches.push(e);
  }
  for (const group of dateGroups.values()) {
    group.matches.sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime));
  }
  const groupedByDate = [...dateGroups.values()].sort((a, b) => a.iso.localeCompare(b.iso));

  function findOpenLigaMatch(event: MatchEvent): OpenLigaMatch | undefined {
    const home = lookupTeam(event.strHomeTeam);
    const away = lookupTeam(event.strAwayTeam);
    const homeSC = home?.shortName;
    const awaySC = away?.shortName;
    return openLigaMatches.find(
      (m) =>
        (homeSC && awaySC &&
          ((m.team1.shortName === homeSC && m.team2.shortName === awaySC) ||
           (m.team1.shortName === awaySC && m.team2.shortName === homeSC))) ||
        (event.strTimestamp &&
          Math.abs(
            new Date(m.matchDateTimeUTC).getTime() -
              new Date(event.strTimestamp).getTime()
          ) < 3600000)
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-14 z-40 -mx-4 -mt-6 px-4 pt-6 pb-3 bg-slate-900/95 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">赛程与赛果</h2>
          {syncing && !refreshing && (
            <span className="animate-pulse text-xs text-sky-400">同步中...</span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:text-white disabled:opacity-50"
        >
          {refreshing ? '刷新中...' : '强制刷新'}
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto mt-3">
        {(['all', 'upcoming', 'completed', 'live'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {t === 'all' ? '全部' : t === 'upcoming' ? '未开赛' : t === 'completed' ? '已结束' : '进行中'}
            {t === 'live' && events.filter(isLive).length > 0 && (
              <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1 mt-2">
        <span className="mr-1 text-xs text-slate-500">小组</span>
        <button
          onClick={() => setSelectedGroup('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            selectedGroup === 'all' ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
          }`}
        >
          全部
        </button>
        {['A','B','C','D','E','F','G','H','I','J','K','L'].map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedGroup === g ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {g}组
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1 mt-2">
        <span className="mr-1 text-xs text-slate-500">阶段</span>
        {stageOptions.map((stage) => (
          <button
            key={stage.key}
            onClick={() => setSelectedStage(stage.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedStage === stage.key ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>
      </div>

      {groupedByDate.length === 0 && (
        <p className="text-sm text-slate-500">暂无比赛数据</p>
      )}

      {groupedByDate.map(({ iso, label, matches }) => (
        <section key={iso} id={`schedule-${iso}`}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {label}
          </h3>
          <div className="space-y-2">
            {matches.map((e) => {
              const olm = findOpenLigaMatch(e);
              const home = lookupTeam(e.strHomeTeam);
              const away = lookupTeam(e.strAwayTeam);
              return (
                <Link
                  key={e.idEvent}
                  to={e.stageKey ? '/bracket' : `/match/${e.idEvent}`}
                  className={`block rounded-xl border p-4 transition hover:border-sky-500/20 ${
                    isLive(e)
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  {(() => {
                    const staticGoals = e.goals;
                    const finished = isFinished(e);
                    const hCode = home?.shortName ?? '';
                    const aCode = away?.shortName ?? '';

                    const goalPill = (key: string | number, scorerName: string, teamCode: string, minute: number | null, isPenalty: boolean, isOwnGoal: boolean) => {
                      const player = lookupGoalScorer(scorerName, teamCode);
                      const displayName = player?.cnName || player?.exactName || scorerName || '未知';
                      const nameEl = displayName;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs text-green-400"
                        >
                          {nameEl}
                          {minute != null && (
                            <span className="text-green-500/60">{minute}'</span>
                          )}
                          {isPenalty && (
                            <span className="text-amber-400">(点球)</span>
                          )}
                          {isOwnGoal && (
                            <span className="text-red-400">(乌龙)</span>
                          )}
                        </span>
                      );
                    };

                    let hg: ReturnType<typeof goalPill>[] = [];
                    let ag: ReturnType<typeof goalPill>[] = [];
                    let showHalf = false;
                    let htH = 0;
                    let htA = 0;
                    let showIncomplete = false;

                    if (finished && staticGoals && staticGoals.length > 0) {
                      // ── Static goals baked into venue-schedule.json ──
                      hg = staticGoals
                        .filter((g) => g.team === 'home')
                        .map((g, i) => goalPill(`s${i}`, g.name, hCode, g.minute, g.isPenalty, g.isOwnGoal));
                      ag = staticGoals
                        .filter((g) => g.team === 'away')
                        .map((g, i) => goalPill(`sA${i}`, g.name, aCode, g.minute, g.isPenalty, g.isOwnGoal));

                      const halftimeGoal = staticGoals
                        .filter((g) => g.minute != null && g.minute <= 45)
                        .sort((a, b) => (b.minute ?? 0) - (a.minute ?? 0))[0];
                      showHalf = true;
                      htH = halftimeGoal?.homeScore ?? 0;
                      htA = halftimeGoal?.awayScore ?? 0;

                      const last = staticGoals[staticGoals.length - 1];
                      showIncomplete =
                        last.homeScore !== Number(e.intHomeScore) ||
                        last.awayScore !== Number(e.intAwayScore);
                    } else {
                      // ── API goals from OpenLigaDB (live / not yet baked) ──
                      const goals = olm?.goals ?? [];
                      const team1IsHome = olm && home && olm.team1.shortName === home.shortName;
                      const pick = <T,>(t1: T, t2: T) => team1IsHome ? t1 : t2;
                      let ht = 0, at = 0;
                      for (const g of goals) {
                        const hScore = pick(g.scoreTeam1, g.scoreTeam2);
                        const aScore = pick(g.scoreTeam2, g.scoreTeam1);
                        if (hScore > ht) {
                          hg.push(goalPill(g.goalID, g.goalGetterName, hCode, g.matchMinute, g.isPenalty, g.isOwnGoal));
                          ht = hScore;
                        } else if (aScore > at) {
                          ag.push(goalPill(g.goalID, g.goalGetterName, aCode, g.matchMinute, g.isPenalty, g.isOwnGoal));
                          at = aScore;
                        }
                      }
                      if (olm && olm.matchIsFinished && goals.length > 0) {
                        const halftimeGoal = goals
                          .filter((g) => g.matchMinute != null && g.matchMinute <= 45)
                          .sort((a, b) => (b.matchMinute ?? 0) - (a.matchMinute ?? 0))[0];
                        showHalf = true;
                        htH = halftimeGoal ? pick(halftimeGoal.scoreTeam1, halftimeGoal.scoreTeam2) : 0;
                        htA = halftimeGoal ? pick(halftimeGoal.scoreTeam2, halftimeGoal.scoreTeam1) : 0;
                        const last = goals[goals.length - 1];
                        const goalFinalH = pick(last.scoreTeam1, last.scoreTeam2);
                        const goalFinalA = pick(last.scoreTeam2, last.scoreTeam1);
                        showIncomplete =
                          goalFinalH !== Number(e.intHomeScore) ||
                          goalFinalA !== Number(e.intAwayScore);
                      }
                    }

                    return (
                      <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-3">
                          {(home || e.strHomeTeamBadge) && (
                            <span className="shrink-0">
                              <img
                                src={home ? home.flagUrl : e.strHomeTeamBadge}
                                alt=""
                                className="mt-0.5 h-10 w-10 object-contain"
                              />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">
                              {home?.cnName ?? e.strHomeTeam}
                            </span>
                            <p className="text-xs text-slate-500">主场</p>
                            {hg.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {hg}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-center shrink-0">
                          {isFinished(e) ? (
                            <div className="text-2xl font-extrabold tabular-nums">
                              <span className={Number(e.intHomeScore) > Number(e.intAwayScore) ? 'text-green-400' : ''}>
                                {e.intHomeScore}
                              </span>
                              <span className="mx-1 text-slate-500">:</span>
                              <span className={Number(e.intAwayScore) > Number(e.intHomeScore) ? 'text-green-400' : ''}>
                                {e.intAwayScore}
                              </span>
                            </div>
                          ) : isLive(e) ? (
                            <div className="text-2xl font-extrabold tabular-nums">
                              <span>{e.intHomeScore ?? 0}</span>
                              <span className="mx-1 text-slate-500">:</span>
                              <span>{e.intAwayScore ?? 0}</span>
                            </div>
                          ) : (
                            (() => {
                              const period = beijingPeriod(e.strTime);
                              return (
                                <div className="flex flex-col items-center text-sm font-medium text-slate-400">
                                  <span>{formatBeijingTime(e.dateEvent, e.strTime).split(' ').pop()}</span>
                                  <span className={`text-xs ${period.color}`}>{period.label}</span>

                  </div>
                              );
                            })()
                          )}
                          {isLive(e) && (
                            <span className="mt-0.5 rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400 animate-pulse">
                              LIVE
                            </span>
                          )}
                          {isFinished(e) && (
                            <span className="mt-0.5 text-xs text-green-400">FT</span>
                          )}
                        </div>

                        <div className="flex flex-1 items-start gap-3 justify-end">
                          <div className="min-w-0 flex-1 text-right">
                            <span className="block truncate font-semibold">
                              {away?.cnName ?? e.strAwayTeam}
                            </span>
                            <p className="text-xs text-slate-500">客场</p>
                            {ag.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap justify-end gap-1">
                                {ag}
                              </div>
                            )}
                          </div>
                          {(away || e.strAwayTeamBadge) && (
                            <span className="shrink-0">
                              <img
                                src={away ? away.flagUrl : e.strAwayTeamBadge}
                                alt=""
                                className="mt-0.5 h-10 w-10 object-contain"
                              />
                            </span>
                          )}
                        </div>
                      </div>
                      {showHalf && (
                        <div className="mt-2 flex gap-3 text-xs text-slate-500">
                          <span>半场: {htH}-{htA}</span>
                          {showIncomplete && (
                            <span className="text-amber-400/80">进球数据可能不完整</span>
                          )}
                        </div>
                      )}
                      </>
                    );
                  })()}

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{venueLabel(e.strVenue)}</span>
                    <span>
                      {e.strGroup && `第 ${e.strGroup} 组`}
                      {e.strGroup && roundMap[e.idEvent] && '    '}
                      {roundMap[e.idEvent] && `第 ${roundMap[e.idEvent]} 轮`}
                      {!e.strGroup && getStageLabel(e)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
