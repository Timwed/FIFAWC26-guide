import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { getNotifyPrefs, setNotifyPrefs, requestPermission } from '../utils/notifications';
import { getStorageString, setStorageString } from '../utils/storage';

const GlobalSearch = lazy(() => import('./GlobalSearch'));
const LiveBadge = lazy(() => import('./LiveBadge'));

const navItems = [
  { path: '/', label: '首页', activePaths: ['/'], group: 'home' },
  { path: '/schedule', label: '赛程', activePaths: ['/schedule', '/match', '/matches'], group: 'comp' },
  { path: '/standings', label: '积分榜', activePaths: ['/standings'], group: 'comp' },
  { path: '/bracket', label: '对阵图', activePaths: ['/bracket'], group: 'comp' },
  { path: '/teams', label: '球队', activePaths: ['/teams', '/players'], group: 'data' },
  { path: '/data', label: '数据', activePaths: ['/data'], group: 'data' },
  { path: '/compare', label: '对比', activePaths: ['/compare'], group: 'data' },
  { path: '/venues', label: '场馆', activePaths: ['/venues'], group: 'other' },
  { path: '/bracket-predict', label: '竞猜', activePaths: ['/bracket-predict'], group: 'other' },
];

function isNavActive(pathname: string, activePaths: string[]) {
  return activePaths.some((path) =>
    path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    const stored = getStorageString('theme');
    return stored !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      setStorageString('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setStorageString('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      waitingWorkerRef.current = (event as CustomEvent<ServiceWorker>).detail;
      setUpdateAvailable(true);
    };
    window.addEventListener('app-update-available', handleUpdate);
    return () => window.removeEventListener('app-update-available', handleUpdate);
  }, []);

  const applyUpdate = () => {
    const worker = waitingWorkerRef.current;
    if (!worker) {
      setUpdateAvailable(false);
      return;
    }
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    }, { once: true });
    worker.postMessage({ type: 'SKIP_WAITING' });
  };

  const themeToggle = (
    <button
      onClick={() => setIsDark(!isDark)}
      className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
      aria-label={isDark ? '切换亮色模式' : '切换暗色模式'}
    >
      {isDark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );

  const [notifyPrefs, setNotifyPrefsState] = useState(getNotifyPrefs);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    queueMicrotask(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    });
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleNotifyToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notifyPrefs.enabled) {
      const perm = await requestPermission();
      if (perm === 'granted') {
        const next = { enabled: true, preMatch: true, goals: true };
        setNotifyPrefs(next);
        setNotifyPrefsState(next);
      }
    } else {
      setNotifyOpen((prev) => !prev);
    }
  };

  const handlePrefToggle = (key: 'preMatch' | 'goals') => {
    const next = { ...notifyPrefs, [key]: !notifyPrefs[key] };
    setNotifyPrefs(next);
    setNotifyPrefsState(next);
  };

  const handleDisableAll = () => {
    const next = { enabled: false, preMatch: false, goals: false };
    setNotifyPrefs(next);
    setNotifyPrefsState(next);
    setNotifyOpen(false);
  };

  const searchNode = searchLoaded ? (
    <Suspense fallback={null}>
      <GlobalSearch initialExpanded />
    </Suspense>
  ) : (
    <button
      onClick={() => setSearchLoaded(true)}
      className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
      title="全局搜索"
      aria-label="打开全局搜索"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );

  const bellButton = (
    <div className="relative" ref={notifyRef}>
      <button
        onClick={handleNotifyToggle}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
        aria-label={notifyPrefs.enabled ? '通知设置' : '开启通知'}
      >
        <span className="text-lg">{notifyPrefs.enabled ? '🔔' : '🔕'}</span>
      </button>
      {notifyOpen && notifyPrefs.enabled && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-slate-800">
          <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyPrefs.preMatch}
              onChange={() => handlePrefToggle('preMatch')}
              className="h-3.5 w-3.5 accent-sky-500"
            />
            赛前提醒
          </label>
          <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyPrefs.goals}
              onChange={() => handlePrefToggle('goals')}
              className="h-3.5 w-3.5 accent-sky-500"
            />
            进球通知
          </label>
          <hr className="my-1 border-slate-200 dark:border-white/10" />
          <button
            onClick={handleDisableAll}
            className="w-full px-3 py-1.5 text-left text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            关闭通知
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white">
      {updateAvailable && (
        <div role="status" aria-live="polite" className="no-print fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-sky-500/30 bg-white px-4 py-3 text-sm shadow-xl dark:bg-slate-800">
          <span>发现新版本</span>
          <button onClick={applyUpdate} className="rounded-lg bg-sky-500 px-3 py-1.5 font-medium text-white hover:bg-sky-400">
            刷新更新
          </button>
          <button onClick={() => setUpdateAvailable(false)} aria-label="关闭更新提示" className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">
            ✕
          </button>
        </div>
      )}
      <header className="no-print sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
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
            {navItems.map((item, i) => {
              const showSep = i > 0 && item.group !== navItems[i - 1].group;
              return (
                <span key={item.path} className="flex items-center gap-1">
                  {showSep && <span className="mx-1 h-4 w-px bg-slate-300 dark:bg-white/20" />}
                  <Link
                    to={item.path}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isNavActive(location.pathname, item.activePaths)
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </span>
              );
            })}
            {!menuOpen && (
              <Suspense fallback={null}>
                <LiveBadge />
              </Suspense>
            )}
            {!menuOpen && searchNode}
            {bellButton}
            {themeToggle}
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            {themeToggle}
            <button
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
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
        </div>
        {menuOpen && (
          <nav id="mobile-nav" ref={mobileMenuRef} className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-white/5">
            {navItems.map((item, i) => {
              const showSep = i > 0 && item.group !== navItems[i - 1].group;
              return (
                <div key={item.path}>
                  {showSep && <div className="my-1 border-t border-slate-200 dark:border-white/10" />}
                  <Link
                    to={item.path}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                      isNavActive(location.pathname, item.activePaths)
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
            {menuOpen && (
              <Suspense fallback={null}>
                <LiveBadge />
              </Suspense>
            )}
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5">
              {menuOpen && searchNode}
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="no-print border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-white/5 dark:text-slate-500">
        FIFA World Cup 2026 Guide &middot; 数据来源: TheSportsDB + OpenLigaDB + Wikipedia
      </footer>
    </div>
  );
}
