import { lazy, Suspense, useState } from 'react';

const Rankings = lazy(() => import('./Rankings'));
const Stats = lazy(() => import('./Stats'));

type Tab = 'rankings' | 'stats';

const TABS: { key: Tab; label: string }[] = [
  { key: 'rankings', label: '排名' },
  { key: 'stats', label: '数据榜' },
];

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
    </div>
  );
}

export default function DataHub() {
  const [tab, setTab] = useState<Tab>('rankings');

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg bg-slate-100 dark:bg-white/5 p-0.5 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-sky-500/20 text-sky-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<TabLoader />}>
        {tab === 'rankings' ? <Rankings /> : <Stats />}
      </Suspense>
    </div>
  );
}
