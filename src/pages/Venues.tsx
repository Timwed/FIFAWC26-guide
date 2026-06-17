import { Link } from 'react-router-dom';
import venuesData from '../data/venues.json';

interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  opened: number;
  surface: string;
  description?: string;
  highlights?: string[];
}

const venues = venuesData as Venue[];

const countryCode: Record<string, string> = {
  '美国': 'us',
  '加拿大': 'ca',
  '墨西哥': 'mx',
};

export default function Venues() {
  const countries = ['美国', '加拿大', '墨西哥'] as const;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-2xl font-bold">比赛场馆</h2>
        <p className="mt-2 text-sm text-slate-400">
          2026 年世界杯由美国、加拿大、墨西哥三国联合主办，共有 16 座场馆
        </p>
      </header>

      {countries.map((c) => {
        const list = venues.filter((v) => v.country === c);
        if (list.length === 0) return null;
        return (
          <section key={c}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-sky-400">
              <img
                src={`https://flagcdn.com/w80/${countryCode[c]}.png`}
                alt={c}
                className="h-6 w-6 rounded object-cover"
              />
              <span>{c}</span>
              <span className="text-sm font-normal text-slate-500">
                {list.length} 座
              </span>
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/venues/${venue.id}`}
                  className="group rounded-xl border border-white/5 bg-white/5 p-5 transition hover:border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-bold group-hover:text-sky-400 transition">
                        {venue.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-400">
                        {venue.city} · {venue.country}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500 opacity-0 group-hover:opacity-100 transition">
                      →
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-300">
                    <span>
                      容量{' '}
                      <span className="font-semibold tabular-nums">
                        {venue.capacity.toLocaleString()}
                      </span>
                    </span>
                    <span>{venue.surface}</span>
                    <span>{venue.opened} 年</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
