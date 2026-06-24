import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { lookupTeam } from '../utils/teamLookup';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import { venueLabel } from '../utils/venueLabels';
import { formatBeijingTime, formatBeijingDate } from '../utils/datetime';
import { mergeMatchPatches } from '../utils/matchMerge';
import { useLiveScorePatches } from '../utils/liveScores';
import teamsData from '../data/teams.json';
import { getAllScheduleMatches } from '../utils/schedule';
import { useFavorites } from '../utils/favorites';
import { fetchJson } from '../utils/jsonData';
import { fetchOpenLigaMatches, findOpenLigaMatch } from '../utils/matchData';

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
  strTimestamp?: string | null;
}

const teams = teamsData as TeamEntry[];

const bundledMatches = getAllScheduleMatches<FlatMatch>();

export default function Home() {
  const [matches, setMatches] = useState<FlatMatch[]>(bundledMatches);
  const [openLigaMatches, setOpenLigaMatches] = useState<Awaited<ReturnType<typeof fetchOpenLigaMatches>>>([]);
  const livePatches = useLiveScorePatches();
  const favorites = useFavorites();

  useEffect(() => {
    let cancelled = false;
    fetchJson<Record<string, FlatMatch[]>>('/data/venue-schedule.json', { force: true, maxAge: 60_000 })
      .then((data) => {
        if (!cancelled) setMatches(Object.values(data).flat());
      })
      .catch(() => {});
    fetchOpenLigaMatches(true)
      .then((data) => {
        if (!cancelled) setOpenLigaMatches(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const openLigaPatches = useMemo(() => {
    const patches = new Map<string, { idEvent: string; intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }>();
    for (const match of matches) {
      const olm = findOpenLigaMatch(openLigaMatches, match.strHomeTeam, match.strAwayTeam, match.strTimestamp);
      if (!olm) continue;
      const result = olm.matchResults.find((r) => r.resultTypeID === 2) || olm.matchResults[olm.matchResults.length - 1];
      if (!result) continue;
      const home = lookupTeam(match.strHomeTeam);
      const team1IsHome = home ? olm.team1.shortName === home.shortName : true;
      patches.set(match.idEvent, {
        idEvent: match.idEvent,
        intHomeScore: String(team1IsHome ? result.pointsTeam1 : result.pointsTeam2),
        intAwayScore: String(team1IsHome ? result.pointsTeam2 : result.pointsTeam1),
        strStatus: olm.matchIsFinished ? 'FT' : match.strStatus,
      });
    }
    return patches;
  }, [matches, openLigaMatches]);

  const mergedLivePatches = useMemo(() => new Map([...livePatches, ...openLigaPatches]), [livePatches, openLigaPatches]);

  const merged = useMemo(() => mergeMatchPatches(matches, mergedLivePatches), [matches, mergedLivePatches]);

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

  const favoriteTeams = useMemo(() =>
    teams.filter((t) => favorites.teams.includes(t.shortName)),
    [favorites.teams]);

  const teamByShort = useMemo(() => new Map(teams.map((t) => [t.shortName.toUpperCase(), t])), []);

  const favoritePlayers = useMemo(() =>
    favorites.players
      .map((entry) => {
        const idx = entry.indexOf(':');
        if (idx === -1) return null;
        const teamCode = entry.slice(0, idx);
        const playerName = entry.slice(idx + 1);
        const team = teamByShort.get(teamCode.toUpperCase());
        const info = lookupPlayerByExactName(playerName);
        return team ? { teamCode, playerName, team, cnName: info?.cnName || null } : null;
      })
      .filter((p): p is { teamCode: string; playerName: string; team: TeamEntry; cnName: string | null } => !!p),
    [favorites.players, teamByShort]);

  const favoriteMatches = useMemo(() =>
    favorites.matches
      .map((id) => {
        const m = merged.find((x) => x.idEvent === id);
        if (!m) return null;
        const home = lookupTeam(m.strHomeTeam);
        const away = lookupTeam(m.strAwayTeam);
        return { ...m, home, away };
      })
      .filter((m): m is NonNullable<typeof m> => !!m),
    [favorites.matches, merged]);

  const todayMatches = useMemo(() =>
    merged.filter((m) => formatBeijingDate(m.dateEvent, m.strTime).iso === today),
    [merged, today]);

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
                className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-slate-900 dark:border-white/30 dark:bg-white/10 dark:text-white backdrop-blur transition hover:bg-amber-500/20 dark:hover:bg-white/20"
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

      {todayMatches.length > 0 && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            今日比赛
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-500">{todayMatches.length}场</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayMatches.map((m) => (
              <MatchCard key={m.idEvent} match={m} />
            ))}
          </div>
        </section>
      )}

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
        <h3 className="mb-4 text-xl font-bold">快速入口</h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {([
            { to: '/standings', label: '积分榜', icon: '📊', color: 'border-l-emerald-500' },
            { to: '/schedule', label: '完整赛程', icon: '📅', color: 'border-l-amber-500' },
            { to: '/teams', label: '球队一览', icon: '⚽', color: 'border-l-sky-500' },
            { to: '/data', label: '数据', icon: '📊', color: 'border-l-violet-500' },
            { to: '/compare', label: '球员对比', icon: '↔', color: 'border-l-pink-500' },
            { to: '/bracket', label: '淘汰赛对阵', icon: '🏟️', color: 'border-l-orange-500' },
          ]).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 rounded-xl border border-l-4 ${item.color} border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-3 transition hover:bg-slate-200 dark:hover:bg-white/10`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {(favoriteTeams.length > 0 || favoritePlayers.length > 0 || favoriteMatches.length > 0) && (
        <section>
          <div className="mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><span className="text-yellow-400">★</span> 我的收藏</h3>
          </div>

          {favoriteTeams.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">球队</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {favoriteTeams.map((team) => (
                  <Link key={team.shortName} to={`/teams/${team.shortName}`}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-500/30 hover:bg-sky-500/10 dark:border-white/5 dark:bg-white/5 dark:hover:bg-sky-500/10">
                    <img src={team.olgIcon} alt={team.enName} className="h-12 w-12 object-contain transition group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className="text-center text-xs font-medium leading-tight">{team.cnName}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favoritePlayers.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">球员</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {favoritePlayers.map((p) => (
                  <Link key={`${p.teamCode}:${p.playerName}`} to={`/players/${p.teamCode}/${encodeURIComponent(p.playerName)}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-sky-500/30 hover:bg-sky-500/5 dark:border-white/5 dark:bg-white/5">
                    <img src={p.team.olgIcon} alt="" className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.cnName || p.playerName}</p>
                      <p className="text-xs text-slate-400">{p.team.cnName}{p.cnName && <span className="ml-1">· {p.playerName}</span>}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {favoriteMatches.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">比赛</p>
              <div className="space-y-2">
                {favoriteMatches.map((m) => (
                  <Link key={m.idEvent} to={`/match/${m.idEvent}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-sky-500/30 hover:bg-sky-500/5 dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img src={m.home?.flagUrl || ''} alt="" className="h-6 w-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="truncate text-sm font-semibold">{m.home?.cnName || m.strHomeTeam}</span>
                      <span className="text-xs text-slate-400 font-bold">VS</span>
                      <img src={m.away?.flagUrl || ''} alt="" className="h-6 w-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <span className="truncate text-sm font-semibold">{m.away?.cnName || m.strAwayTeam}</span>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{formatBeijingTime(m.dateEvent, m.strTime)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {favoriteTeams.length === 0 && favoritePlayers.length === 0 && favoriteMatches.length === 0 && (
        <section>
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">点击球队/球员/比赛页面的 ⭐ 即可收藏</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">收藏后会显示在这里，方便快速访问</p>
          </div>
        </section>
      )}
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
      className="block rounded-xl bg-slate-50 dark:bg-white/10 backdrop-blur p-5 ring-1 ring-slate-200 dark:ring-white/20 transition hover:bg-slate-100 dark:hover:bg-white/15"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-sky-600 dark:text-sky-200">
          {isToday ? '今日' : bjDate.label} {bjTime.slice(bjTime.lastIndexOf(' ')+1)}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            进行中
          </span>
        )}
        {isFinished && (
          <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-600 dark:bg-white/10 dark:text-sky-200">
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
          <span className="text-center text-xs font-medium leading-tight truncate w-full text-slate-900 dark:text-white">
            {home?.cnName ?? match.strHomeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="shrink-0 text-center">
          <div className="text-3xl font-bold tabular-nums tracking-tight">
            <span>{isFinished || isLive ? (match.intHomeScore ?? '0') : '-'}</span>
            <span className="mx-1 text-slate-300 dark:text-white/40">:</span>
            <span>{isFinished || isLive ? (match.intAwayScore ?? '0') : '-'}</span>
          </div>
          {isLive && (
            <div className="mt-0.5 text-xs font-medium text-red-500 dark:text-red-300 animate-pulse">
              {match.strStatus === '1H' ? '上半场' : match.strStatus === '2H' ? '下半场' : match.strStatus}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-1 flex-col items-center gap-1.5 min-w-0">
          {away && (
            <img src={away.flagUrl} alt="" className="h-10 w-10 object-contain" />
          )}
          <span className="text-center text-xs font-medium leading-tight truncate w-full text-slate-900 dark:text-white">
            {away?.cnName ?? match.strAwayTeam}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-sky-500/70 dark:text-sky-200/70">
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{match.strVenue}</span>
        {match.strGroup && (
          <span className="ml-auto rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
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
    <Link to={`/match/${match.idEvent}`} className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-500/20 dark:border-white/5 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">{formatBeijingTime(match.dateEvent, match.strTime)}</span>
        {isFinished && (
          <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
            已结束
          </span>
        )}
        {isLive && (
          <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-500/70 dark:text-red-400 animate-pulse">
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
          <span className="text-slate-400 dark:text-slate-500">:</span>
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
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{venueLabel(match.strVenue)}</p>
    </Link>
  );
}
