import { Link } from 'react-router-dom';
import venuesData from '../data/venues.json';
import scheduleData from '../data/venue-schedule.json';

interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  opened: number;
  surface: string;
}

const venues = venuesData as Venue[];
const schedule = scheduleData as Record<string, { strHomeTeam: string }[]>;

const venueRegion: Record<string, { label: string; color: string }> = {};
const WEST = ['温哥华', '西雅图', '旧金山', '洛杉矶'];
const CENTRAL = ['瓜达拉哈拉', '墨西哥城', '蒙特雷', '休斯顿', '达拉斯', '堪萨斯城'];
for (const v of venues) {
  if (WEST.includes(v.city)) venueRegion[v.id] = { label: '西区', color: 'bg-blue-500/15 text-blue-400' };
  else if (CENTRAL.includes(v.city)) venueRegion[v.id] = { label: '中区', color: 'bg-amber-500/15 text-amber-400' };
  else venueRegion[v.id] = { label: '东区', color: 'bg-emerald-500/15 text-emerald-400' };
}

function getMatchCount(venueId: string) {
  return schedule[venueId]?.length ?? 0;
}

export default function Venues() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold">比赛场馆</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          2026 年世界杯由美国、加拿大、墨西哥三国联合主办，共有 16 座场馆
        </p>
      </header>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-blue-400">西区 · 温哥华 / 西雅图 / 旧金山 / 洛杉矶</span>
        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-400">中区 · 墨西哥三城 / 休斯顿 / 达拉斯 / 堪萨斯城</span>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400">东区 · 多伦多 / 亚特兰大 / 迈阿密 / 波士顿 / 费城 / 纽约</span>
      </div>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const count = getMatchCount(venue.id);
            const region = venueRegion[venue.id];
            return (
              <Link
                key={venue.id}
                to={`/venues/${venue.id}`}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-bold group-hover:text-sky-400 transition">
                      {venue.name}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {venue.city} · {venue.country}
                    </p>
                  </div>
                  {region && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${region.color}`}>
                      {region.label}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <span>
                    容量{' '}
                    <span className="font-semibold tabular-nums">
                      {venue.capacity.toLocaleString()}
                    </span>
                  </span>
                  <span>{venue.surface}</span>
                  <span>{venue.opened} 年</span>
                  {count > 0 && (
                    <span className="text-sky-500">{count} 场比赛</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
