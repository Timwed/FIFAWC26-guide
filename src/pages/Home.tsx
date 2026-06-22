import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { lookupTeam } from '../utils/teamLookup';
import { venueLabel } from '../utils/venueLabels';
import { formatBeijingTime, formatBeijingDate } from '../utils/datetime';
import { mergeMatchPatches } from '../utils/matchMerge';
import { fetchMatchScorePatches } from '../utils/matchData';
import teamsData from '../data/teams.json';
import fifaRankings from '../data/fifa-rankings.json';
import scheduleData from '../data/venue-schedule.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

interface FlatMatch {
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
}

const teams = teamsData as TeamEntry[];

const staticSchedule = (scheduleData as Record<string, FlatMatch[]>);

const allMatches = Object.values(staticSchedule).flat();

const CACHE_KEY = 'wc26_home_scores';

function loadCachedPatches(): Map<string, { idEvent: string; intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return new Map();
    const entries: [string, { idEvent: string; intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }][] = JSON.parse(raw);
    return new Map(entries.filter(([, v]) => v.strStatus === 'FT'));
  } catch { return new Map(); }
}

function saveCachedPatches(patches: Map<string, { idEvent: string; intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }>) {
  const finished = new Map([...patches].filter(([, v]) => v.strStatus === 'FT'));
  try { localStorage.setItem(CACHE_KEY, JSON.stringify([...finished])); } catch {}
}

export default function Home() {
  const [liveMap, setLiveMap] = useState<Map<string, { idEvent: string; intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }>>(() => loadCachedPatches());

  useEffect(() => {
    let cancelled = false;
    fetchMatchScorePatches()
      .then((patches) => {
        if (cancelled) return;
        setLiveMap(patches);
        saveCachedPatches(patches);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const merged = useMemo(() => mergeMatchPatches(allMatches, liveMap), [liveMap]);

  const pastMatches = useMemo(() =>
    merged
      .filter((m) => m.strStatus === 'FT')
      .sort((a, b) => (b.dateEvent + b.strTime).localeCompare(a.dateEvent + a.strTime))
      .slice(0, 6), [merged]);

  const today = new Date().toISOString().slice(0, 10);

  const upcomingMatches = useMemo(() =>
    merged
      .filter((m) => m.strStatus !== 'FT' && m.dateEvent >= today)
      .sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime))
      .slice(0, 6),
    [merged, today]);

  const featuredMatch = useMemo(() => {
    const live = merged.find((m) => m.strStatus && m.strStatus !== 'FT' && m.strStatus !== 'NS');
    if (live) return live;
    return upcomingMatches[0] || null;
  }, [merged, upcomingMatches]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-700 p-6 md:p-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Title & buttons */}
          <div className="lg:max-w-md">
            <p className="text-sm font-medium uppercase tracking-widest text-sky-200">
              2026 FIFA World Cup
            </p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-5xl">
              美加墨世界杯
            </h2>
            <p className="mt-4 text-sky-100">
              2026年6月11日 — 7月19日 &middot; 美国 · 加拿大 · 墨西哥
              <br />
              首届48队参赛的世界杯，12个小组，104场比赛
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/teams"
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 shadow-lg transition hover:bg-sky-50"
              >
                浏览球队
              </Link>
              <Link
                to="/schedule"
                className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                查看赛程
              </Link>
            </div>
          </div>

          {/* Right: Featured match card */}
          {featuredMatch && (
            <div className="shrink-0 lg:w-80">
              <FeaturedMatchCard match={featuredMatch} />
            </div>
          )}
        </div>
      </section>

      {pastMatches.length > 0 && (
        <section>
          <h3 className="mb-4 text-xl font-bold">最新赛果</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pastMatches.map((m) => (
              <MatchCard key={m.idEvent} match={m} />
            ))}
          </div>
        </section>
      )}

      {upcomingMatches.length > 0 && (
        <section>
          <h3 className="mb-4 text-xl font-bold">即将开赛</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((m) => (
              <MatchCard key={m.idEvent} match={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">参赛球队（按 FIFA 排名）</h3>
          <div className="flex items-center gap-3">
            <Link to="/rankings" className="text-sm text-sky-400 hover:text-sky-300">
              查看完整排名 →
            </Link>
            <Link to="/teams" className="text-sm text-slate-400 hover:text-slate-300">
              全部球队 →
            </Link>
          </div>
        </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {teams
              .slice()
              .sort((a, b) => (fifaRankings[a.shortName as keyof typeof fifaRankings]?.rank ?? 99) - (fifaRankings[b.shortName as keyof typeof fifaRankings]?.rank ?? 99))
              .slice(0, 24)
              .map((team) => (
            <Link
              key={team.shortName}
              to={`/teams/${team.shortName}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-sky-500/30 hover:bg-sky-500/10"
            >
              <img
                src={team.olgIcon}
                alt={team.enName}
                className="h-12 w-12 object-contain transition group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-center text-xs font-medium leading-tight">
                {team.cnName}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedMatchCard({ match }: { match: FlatMatch }) {
  const home = lookupTeam(match.strHomeTeam);
  const away = lookupTeam(match.strAwayTeam);
  const isLive = match.strStatus && match.strStatus !== 'FT' && match.strStatus !== 'NS';
  const isFinished = match.strStatus === 'FT';
  const bjNow = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour12: false }).format(new Date()).replace(/\//g, '-');
  const bjDate = formatBeijingDate(match.dateEvent, match.strTime);
  const isToday = bjDate.iso === bjNow;
  const bjTime = formatBeijingTime(match.dateEvent, match.strTime);

  return (
    <Link
      to={`/match/${match.idEvent}`}
      className="block rounded-xl bg-white/10 backdrop-blur p-5 ring-1 ring-white/20 transition hover:bg-white/15"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-sky-200">
          {isToday ? '今日' : bjDate.label} {bjTime.slice(bjTime.lastIndexOf(' ')+1)}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/30 px-2.5 py-0.5 text-xs font-medium text-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            进行中
          </span>
        )}
        {isFinished && (
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-sky-200">
            已结束
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Home team */}
        <div className="flex flex-1 flex-col items-center gap-1.5 min-w-0">
          {home && (
            <img src={home.flagUrl} alt="" className="h-10 w-10 object-contain" />
          )}
          <span className="text-center text-xs font-medium leading-tight truncate w-full">
            {home?.cnName ?? match.strHomeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="shrink-0 text-center">
          <div className="text-3xl font-bold tabular-nums tracking-tight">
            <span>{isFinished || isLive ? (match.intHomeScore ?? '0') : '-'}</span>
            <span className="mx-1 text-white/40">:</span>
            <span>{isFinished || isLive ? (match.intAwayScore ?? '0') : '-'}</span>
          </div>
          {isLive && (
            <div className="mt-0.5 text-xs font-medium text-red-300 animate-pulse">
              {match.strStatus === '1H' ? '上半场' : match.strStatus === '2H' ? '下半场' : match.strStatus}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-1 flex-col items-center gap-1.5 min-w-0">
          {away && (
            <img src={away.flagUrl} alt="" className="h-10 w-10 object-contain" />
          )}
          <span className="text-center text-xs font-medium leading-tight truncate w-full">
            {away?.cnName ?? match.strAwayTeam}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-sky-200/70">
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{match.strVenue}</span>
        {match.strGroup && (
          <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">
            {match.strGroup} 组
          </span>
        )}
      </div>
    </Link>
  );
}

function MatchCard({ match }: { match: FlatMatch }) {
  const home = lookupTeam(match.strHomeTeam);
  const away = lookupTeam(match.strAwayTeam);
  const isFinished = match.strStatus === 'FT';
  const isLive = match.strStatus !== 'FT' && match.strStatus !== 'NS' && match.strStatus !== null;

  return (
    <Link to={`/match/${match.idEvent}`} className="block rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-sky-500/20">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{formatBeijingTime(match.dateEvent, match.strTime)}</span>
        {isFinished && (
          <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
            已结束
          </span>
        )}
        {isLive && (
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400 animate-pulse">
            进行中
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 min-w-0 items-center gap-2">
          {home && (
            <span className="shrink-0">
              <img src={home.flagUrl} alt="" className="h-8 w-8 object-contain" />
            </span>
          )}
          <span className="min-w-0 truncate text-sm font-medium">
            {home?.cnName ?? match.strHomeTeam}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span>{match.intHomeScore ?? '-'}</span>
          <span className="text-slate-500">:</span>
          <span>{match.intAwayScore ?? '-'}</span>
        </div>
        <div className="flex flex-1 min-w-0 items-center gap-2 justify-end">
          <span className="min-w-0 truncate text-sm font-medium">
            {away?.cnName ?? match.strAwayTeam}
          </span>
          {away && (
            <span className="shrink-0">
              <img src={away.flagUrl} alt="" className="h-8 w-8 object-contain" />
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">{venueLabel(match.strVenue)}</p>
    </Link>
  );
}
