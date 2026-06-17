import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchSeasonEvents, fetchPastEvents } from '../api/thesportsdb';
import { lookupTeam } from '../utils/teamLookup';
import { venueLabel, venueIdFromName } from '../utils/venueLabels';
import { formatBeijingTime } from '../utils/datetime';
import teamsData from '../data/teams.json';
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

export default function Home() {
  const [liveMap, setLiveMap] = useState<Record<string, { intHomeScore: string | null; intAwayScore: string | null; strStatus: string | null }>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSeasonEvents(), fetchPastEvents()])
      .then(([season, past]) => {
        if (cancelled) return;
        const map: typeof liveMap = {};
        for (const e of [...past, ...season]) {
          map[e.idEvent] = {
            intHomeScore: e.intHomeScore,
            intAwayScore: e.intAwayScore,
            strStatus: e.strStatus,
          };
        }
        setLiveMap(map);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const merged = useMemo(() =>
    allMatches.map((m) => {
      const live = liveMap[m.idEvent];
      return live
        ? { ...m, intHomeScore: live.intHomeScore, intAwayScore: live.intAwayScore, strStatus: live.strStatus }
        : m;
    }), [liveMap]);

  const pastMatches = useMemo(() =>
    merged
      .filter((m) => m.strStatus === 'FT')
      .sort((a, b) => (b.dateEvent + b.strTime).localeCompare(a.dateEvent + a.strTime))
      .slice(0, 6), [merged]);

  const today = new Date().toISOString().slice(0, 10);

  const upcomingMatches = useMemo(() =>
    allMatches
      .filter((m) => m.strStatus !== 'FT' && m.dateEvent >= today)
      .sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime))
      .slice(0, 6),
    [today]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-700 p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-widest text-sky-200">
            2026 FIFA World Cup
          </p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-5xl">
            美加墨世界杯
          </h2>
          <p className="mt-4 max-w-xl text-sky-100">
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
          <h3 className="text-xl font-bold">参赛球队（48队）</h3>
          <Link to="/teams" className="text-sm text-sky-400 hover:text-sky-300">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {teams.slice(0, 24).map((team) => (
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

function MatchCard({ match }: { match: FlatMatch }) {
  const home = lookupTeam(match.strHomeTeam);
  const away = lookupTeam(match.strAwayTeam);
  const isFinished = match.strStatus === 'FT' || match.intHomeScore !== null;
  const isLive = match.strStatus !== 'FT' && match.strStatus !== 'NS' && match.strStatus !== null;

  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-4">
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {home && (
            <img src={home.flagUrl} alt="" className="h-8 w-8 object-contain" />
          )}
          <span className="text-sm font-medium">{home?.cnName ?? match.strHomeTeam}</span>
        </div>
        <div className="flex items-center gap-2 text-lg font-bold">
          <span>{match.intHomeScore ?? '-'}</span>
          <span className="text-slate-500">:</span>
          <span>{match.intAwayScore ?? '-'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{away?.cnName ?? match.strAwayTeam}</span>
          {away && (
            <img src={away.flagUrl} alt="" className="h-8 w-8 object-contain" />
          )}
        </div>
      </div>
      {(() => {
        const vid = venueIdFromName(match.strVenue);
        const label = venueLabel(match.strVenue);
        return vid ? (
          <Link
            to={`/venues/${vid}`}
            className="mt-2 block text-xs text-slate-500 transition hover:text-sky-400 hover:underline"
          >
            {label}
          </Link>
        ) : (
          <p className="mt-2 text-xs text-slate-500">{label}</p>
        );
      })()}
    </div>
  );
}
