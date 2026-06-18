import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import scheduleData from '../data/venue-schedule.json';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import { fetchSeasonEvents } from '../api/thesportsdb';
import { buildMatchPatchMap } from '../utils/matchMerge';
import { fetchAllMatches } from '../api/openligadb';
import type { OpenLigaMatch } from '../api/openligadb';
import { lookupTeam } from '../utils/teamLookup';
import { formatBeijingTime } from '../utils/datetime';
import { venueIdFromName, venueLabel } from '../utils/venueLabels';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import type { StaticGoal } from '../types';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

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
  strTime: string;
  strTimeLocal: string | null;
  goals?: StaticGoal[];
}

const allMatches: MatchData[] = Object.values(
  scheduleData as unknown as Record<string, MatchData[]>
).flat();

const teams = teamsData as TeamEntry[];
const squads = squadsData as SquadEntry[];

const teamFlagMap = new Map<string, string>();
const teamCnMap = new Map<string, string>();
const teamShortMap = new Map<string, string>();
for (const t of teams) {
  teamFlagMap.set(t.enName, t.olgIcon);
  teamCnMap.set(t.enName, t.cnName);
  teamShortMap.set(t.enName, t.shortName);
}
teamFlagMap.set('Bosnia-Herzegovina', '/flags/BIH.png');
teamCnMap.set('Bosnia-Herzegovina', '波黑');
teamShortMap.set('Bosnia-Herzegovina', 'BIH');
teamFlagMap.set('USA', '/flags/USA.png');
teamCnMap.set('USA', '美国');
teamShortMap.set('USA', 'USA');

const POSITION_LABELS: Record<string, string> = {
  GK: '守门员', DF: '后卫', MF: '中场', FW: '前锋',
};

export default function MatchDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [liveScores, setLiveScores] = useState<Map<string, { intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }>>(new Map());

  const match = useMemo(
    () => allMatches.find((m) => m.idEvent === eventId),
    [eventId]
  );

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
    const homeTeam = lookupTeam(match.strHomeTeam);
    const awayTeam = lookupTeam(match.strAwayTeam);
    if (!homeTeam || !awayTeam) return;
    let cancelled = false;
    fetchAllMatches().then((matches: OpenLigaMatch[]) => {
      if (cancelled) return;
      const ol = matches.find(
        (m: OpenLigaMatch) =>
          (m.team1.shortName === homeTeam.shortName && m.team2.shortName === awayTeam.shortName) ||
          (m.team1.shortName === awayTeam.shortName && m.team2.shortName === homeTeam.shortName)
      );
      if (!ol || !ol.goals.length) return;
      const team1IsHome = ol.team1.shortName === homeTeam.shortName;
      const gs: StaticGoal[] = [];
      let hs = 0, as = 0;
      for (const g of ol.goals) {
        const goalTeam = team1IsHome
          ? (g.scoreTeam1 > hs ? 'home' : 'away')
          : (g.scoreTeam2 > as ? 'away' : 'home');
        hs = g.scoreTeam1;
        as = g.scoreTeam2;
        gs.push({
          team: goalTeam,
          name: g.goalGetterName,
          minute: g.matchMinute,
          homeScore: team1IsHome ? g.scoreTeam1 : g.scoreTeam2,
          awayScore: team1IsHome ? g.scoreTeam2 : g.scoreTeam1,
          isPenalty: g.isPenalty,
          isOwnGoal: g.isOwnGoal,
        });
      }
      setOpenLigaGoals(gs);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [match]);

  const pollingRef = useRef(false);

  const pollScores = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const events = await fetchSeasonEvents();
      setLiveScores(buildMatchPatchMap(events, []));
    } catch { /* ignore */ } finally {
      pollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    pollScores();
  }, [pollScores]);

  const hasLiveRef = useRef(false);
  useEffect(() => {
    const live = liveScores.get(match?.idEvent ?? '');
    hasLiveRef.current = !!(live && live.strStatus && live.strStatus !== 'FT' && live.strStatus !== 'NS');
  }, [liveScores, match]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasLiveRef.current) pollScores();
    }, 30_000);
    return () => clearInterval(interval);
  }, [pollScores]);

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-400">未找到比赛</p>
        <Link to="/schedule" className="text-sm text-sky-400 hover:text-sky-300">
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

  const homeFlag = teamFlagMap.get(match.strHomeTeam) || '';
  const awayFlag = teamFlagMap.get(match.strAwayTeam) || '';
  const homeCn = teamCnMap.get(match.strHomeTeam) || match.strHomeTeam;
  const awayCn = teamCnMap.get(match.strAwayTeam) || match.strAwayTeam;
  const homeShort = match.strHomeTeam ? teamShortMap.get(match.strHomeTeam) : '';
  const awayShort = match.strHomeTeam ? teamShortMap.get(match.strAwayTeam) : '';

  const goals = openLigaGoals.length > 0
    ? openLigaGoals
    : (match.goals || []);
  goals.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

  return (
    <div className="space-y-6">
      <Link to="/schedule" className="text-sm text-sky-400 hover:text-sky-300">
        ← 返回赛程
      </Link>

      {/* Match Header */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-center gap-1">
          <span
            className={`rounded px-3 py-1 text-xs font-medium ${
              finished
                ? 'bg-emerald-500/20 text-emerald-400'
                : isLive
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'bg-slate-500/20 text-slate-400'
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
              className="text-center text-sm font-bold hover:text-sky-400 md:text-base"
            >
              {homeCn}
            </Link>
          </div>

          {/* Score */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tabular-nums md:text-5xl">
              {homeScore ?? '-'}
            </span>
            <span className="text-2xl text-slate-500">:</span>
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
              className="text-center text-sm font-bold hover:text-sky-400 md:text-base"
            >
              {awayCn}
            </Link>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span>{bjTime}</span>
          {match.strGroup && (
            <span className="rounded bg-white/10 px-2 py-0.5">{match.strGroup}组</span>
          )}
          {venueId ? (
            <Link to={`/venues/${venueId}`} className="hover:text-sky-400">
              📍 {venueName}
            </Link>
          ) : (
            <span>📍 {venueName}</span>
          )}
        </div>
      </div>

      {/* Goal Timeline */}
      {goals.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-emerald-500 border-white/5 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">进球时间线</h3>
          <div className="space-y-3">
            {goals.map((g, i) => {
              const isHome = g.team === 'home';
              const scorerInfo = lookupPlayerByExactName(g.name);
              const cnName = scorerInfo?.cnName || g.name;
              const teamCode = isHome ? homeShort : awayShort;
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                  <span className="min-w-[2.5rem] text-center text-lg font-bold tabular-nums text-emerald-400">
                    {g.minute ?? '?'}'
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={g.isOwnGoal ? 'text-red-400 line-through' : 'text-white'}>
                        {scorerInfo ? (
                          <Link
                            to={`/players/${scorerInfo.teamCode}/${encodeURIComponent(g.name)}`}
                            className="hover:text-sky-400"
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
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
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
        <Link to="/schedule" className="rounded-lg bg-sky-500/10 px-6 py-2 text-sm text-sky-400 transition hover:bg-sky-500/20">
          返回赛程
        </Link>
        {homeShort && (
          <Link to={`/teams/${homeShort}`} className="rounded-lg bg-white/5 px-6 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            {homeCn}阵容
          </Link>
        )}
        {awayShort && (
          <Link to={`/teams/${awayShort}`} className="rounded-lg bg-white/5 px-6 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            {awayCn}阵容
          </Link>
        )}
      </div>
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
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <h4 className="mb-2 text-sm font-bold text-slate-400">{teamCn}</h4>
        <p className="text-xs text-slate-600">阵容数据暂无</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
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
              className="flex items-center gap-2 rounded px-2 py-1 text-xs transition hover:bg-white/5"
            >
              <span className="w-6 text-center tabular-nums text-slate-500">{p.number}</span>
              <span className="flex-1 truncate text-slate-300">
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
