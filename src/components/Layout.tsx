import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import PlayerSearch from './PlayerSearch';

const navItems = [
  { path: '/', label: '首页', activePaths: ['/'] },
  { path: '/teams', label: '球队', activePaths: ['/teams', '/players'] },
  { path: '/schedule', label: '赛程', activePaths: ['/schedule', '/match'] },
  { path: '/standings', label: '积分榜', activePaths: ['/standings'] },
  { path: '/bracket', label: '淘汰赛', activePaths: ['/bracket'] },
  { path: '/venues', label: '场馆', activePaths: ['/venues'] },
  { path: '/rankings', label: '排名', activePaths: ['/rankings'] },
];

function isNavActive(pathname: string, activePaths: string[]) {
  return activePaths.some((path) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-wide">
                FIFA WORLD CUP 2026
              </h1>
              <p className="text-xs tracking-widest text-sky-400">
                美加墨世界杯指南
              </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isNavActive(location.pathname, item.activePaths)
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <PlayerSearch />
          </nav>
          <button
            className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/5 px-4 py-2 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                  isNavActive(location.pathname, item.activePaths)
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/5">
              <PlayerSearch />
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        FIFA World Cup 2026 Guide &middot; 数据来源: TheSportsDB + OpenLigaDB + Wikipedia
      </footer>
    </div>
  );
}
