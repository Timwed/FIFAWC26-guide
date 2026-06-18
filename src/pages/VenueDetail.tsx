import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import venuesData from '../data/venues.json';
import venueScheduleData from '../data/venue-schedule.json';
import { fetchSeasonEvents, fetchPastEvents } from '../api/thesportsdb';
import { buildMatchPatchMap, mergeMatchPatches } from '../utils/matchMerge';
import { lookupTeam } from '../utils/teamLookup';
import { formatBeijingTime } from '../utils/datetime';
import type { MatchScorePatch } from '../utils/matchMerge';

interface Venue {
  id: string;
  name: string;
  city: string;
  cityEn: string;
  country: string;
  capacity: number;
  opened: number;
  surface: string;
  architect: string;
  story: string;
  wc2026: string;
  trivia: string[];
}

interface ScheduleMatch {
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

const countryCode: Record<string, string> = {
  '美国': 'us',
  '加拿大': 'ca',
  '墨西哥': 'mx',
};

const venues = venuesData as Venue[];
const scheduleByVenue = venueScheduleData as Record<string, ScheduleMatch[]>;

export default function VenueDetail() {
  const { venueId } = useParams<{ venueId: string }>();
  const venue = useMemo(
    () => venues.find((v) => v.id === venueId),
    [venueId]
  );

  const staticMatches: ScheduleMatch[] = venueId ? (scheduleByVenue[venueId] ?? []) : [];
  const [liveScores, setLiveScores] = useState<Map<string, MatchScorePatch>>(new Map());

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchSeasonEvents(), fetchPastEvents()])
      .then(([season, past]) => {
        if (cancelled) return;
        setLiveScores(buildMatchPatchMap(season, past));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-400">未找到场馆</p>
        <Link to="/venues" className="text-sm text-sky-400 hover:text-sky-300">
          ← 返回场馆列表
        </Link>
      </div>
    );
  }

  const mergedMatches = mergeMatchPatches(staticMatches, liveScores);

  const grouped = mergedMatches.reduce<Record<string, ScheduleMatch[]>>((acc, m) => {
    if (!acc[m.dateEvent]) acc[m.dateEvent] = [];
    acc[m.dateEvent].push(m);
    return acc;
  }, {});

  const getStatus = (m: ScheduleMatch) => {
    if (m.strStatus === 'FT') return 'completed';
    if (m.strStatus && m.strStatus !== 'NS') return 'live';
    return 'upcoming';
  };

  const statusStyle: Record<string, string> = {
    completed: 'text-green-400',
    live: 'animate-pulse text-red-400',
    upcoming: 'text-slate-500',
  };

  return (
    <div className="space-y-8">
      <Link to="/venues" className="text-sm text-sky-400 hover:text-sky-300">
        ← 返回场馆列表
      </Link>

      <header>
        <div className="flex items-center gap-3">
          <img
            src={`https://flagcdn.com/w80/${countryCode[venue.country]}.png`}
            alt={venue.country}
            className="h-10 w-10 rounded object-cover"
          />
          <h2 className="text-3xl font-extrabold">{venue.name}</h2>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {venue.city} · {venue.country}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-white/5 p-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">容量</p>
          <p className="text-lg font-bold tabular-nums">
            {venue.capacity.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">开放年份</p>
          <p className="text-lg font-bold tabular-nums">{venue.opened} 年</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">草皮类型</p>
          <p className="text-lg font-bold">{venue.surface}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">所在城市</p>
          <p className="text-lg font-bold">{venue.city}</p>
        </div>
      </div>

      <section className="rounded-xl border border-white/5 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-bold">场馆故事</h3>
        <p className="leading-relaxed text-slate-300 whitespace-pre-line">{venue.story}</p>
      </section>

      <section className="rounded-xl border border-white/5 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-bold">2026 世界杯</h3>
        <p className="leading-relaxed text-slate-300">{venue.wc2026}</p>
      </section>

      <section className="rounded-xl border border-white/5 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-bold">
          本届比赛
          <span className="ml-2 text-xs font-normal text-slate-500">{staticMatches.length} 场</span>
        </h3>
        {staticMatches.length === 0 ? (
          <p className="text-sm text-slate-500">赛程尚未发布</p>
        ) : (
          <div className="space-y-2">
            {Object.keys(grouped).sort().map((date) => (
              <div key={date}>
                <p className="mb-1.5 text-xs font-medium uppercase text-slate-500">{date}</p>
                {grouped[date].map((m) => {
                  const home = lookupTeam(m.strHomeTeam);
                  const away = lookupTeam(m.strAwayTeam);
                  const s = getStatus(m);
                  return (
                    <Link
                      key={m.idEvent}
                      to={`/match/${m.idEvent}`}
                      className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 justify-end">
                        <span className="truncate">{home?.cnName ?? m.strHomeTeam}</span>
                        {home && (
                          <img src={home.flagUrl} alt="" className="h-5 w-5 shrink-0 object-contain" />
                        )}
                      </div>
                      <span className={`text-center text-sm font-bold tabular-nums ${statusStyle[s]}`}>
                        {s === 'completed'
                          ? `${m.intHomeScore}:${m.intAwayScore}`
                          : s === 'live'
                            ? `${m.intHomeScore ?? '-'}:${m.intAwayScore ?? '-'}`
                            : formatBeijingTime(m.dateEvent, m.strTime).split(' ').pop()}
                      </span>
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        {away && (
                          <img src={away.flagUrl} alt="" className="h-5 w-5 shrink-0 object-contain" />
                        )}
                        <span className="truncate">{away?.cnName ?? m.strAwayTeam}</span>
                      </div>
                      {m.strGroup && (
                        <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-500">
                          {m.strGroup}组
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-white/5 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-bold">你知道吗</h3>
        <ul className="space-y-3">
          {venue.trivia.map((t, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <span className="mt-0.5 shrink-0 text-xs font-bold text-sky-400">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
