import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import { searchPlayers } from '../utils/playerSearch';
import type { SearchPlayer } from '../utils/playerSearch';
import { fetchJson, clearJsonCache } from '../utils/jsonData';
import { clearDqdPlayerMapCache } from '../utils/dqdPlayerMap';

/* ---- types ---- */

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  group: string;
  olgIcon: string;
}

interface SquadPlayer {
  number: string;
  position: string;
  name: string;
  age: number;
  caps: number;
  goals: number;
  club: string;
}

interface SquadEntry {
  name: string;
  players: SquadPlayer[];
}

interface DqdRanking {
  rank: number;
  count: number;
  label: string;
}

interface DqdPlayerData {
  dqdId: string;
  cnName: string;
  enName: string;
  height: string;
  marketValue: string;
  currentTeam: string;
  rankings: Record<string, DqdRanking | undefined>;
  worldCup: {
    appearances: number;
    goals: number;
    assists: number;
    minutes: number;
    shots?: number;
    averageRating: number | null;
  };
}

type DqdStatsData = Record<string, Record<string, DqdPlayerData>>;

/* ---- constants ---- */

const teams = teamsData as TeamEntry[];
const squads = squadsData as SquadEntry[];

const teamByShortName = new Map<string, TeamEntry>();
const squadByEnName = new Map<string, SquadEntry>();

for (const t of teams) {
  teamByShortName.set(t.shortName, t);
}
for (const s of squads) {
  squadByEnName.set(s.name.toLowerCase(), s);
}

const POS_LABELS: Record<string, string> = { GK: '门将', DF: '后卫', MF: '中场', FW: '前锋' };

/* ---- helpers ---- */

function cn(text: string, n: number) {
  if (text.length <= n) return text;
  return text.slice(0, n) + '…';
}

function formatMarketVal(raw: string): string {
  const v = parseInt(raw, 10);
  if (Number.isNaN(v)) return '—';
  if (v >= 10000) return `${(v / 10000).toFixed(1)} 亿€`;
  return `${v} 万€`;
}

/* ---- player panel ---- */

interface PlayerStats {
  cnName: string;
  enName: string;
  teamFlag: string;
  teamCn: string;
  teamCode: string;
  position: string;
  age: number;
  height: string;
  caps: number;
  goals: number;
  club: string;
  marketVal: string;
  wcGoals: string;
  wcAssists: string;
  wcShots: string;
  wcRating: string;
  wikiExtract: string;
}

function computePlayerStats(
  player: SearchPlayer,
  dqd: DqdStatsData,
  wikiData: Record<string, { careerReview?: string; wcSpotlight?: string }>,
): PlayerStats | null {
  const squad = squadByEnName.get(
    teams.find((t) => t.shortName === player.teamCode)?.enName?.toLowerCase() ?? '',
  );
  const squadPlayer = squad?.players.find((p) => p.name === player.name);
  const team = teamByShortName.get(player.teamCode);
  if (!team) return null;

  const teamDqd = dqd[player.teamCode] ?? {};
  const dqdPlayer = teamDqd[player.name];

  const wikiPlayer = wikiData[player.name];
  const wikiText = wikiPlayer
    ? [wikiPlayer.careerReview, wikiPlayer.wcSpotlight].filter(Boolean).join('\n')
    : '';

  const position = squadPlayer?.position ?? player.position;
  const posLabel = POS_LABELS[position] ?? position;

  return {
    cnName: player.cnName || player.enName,
    enName: player.enName,
    teamFlag: team.olgIcon,
    teamCn: team.cnName,
    teamCode: player.teamCode,
    position: posLabel,
    age: squadPlayer?.age ?? 0,
    height: dqdPlayer?.height ? `${dqdPlayer.height}cm` : '—',
    caps: squadPlayer?.caps ?? 0,
    goals: squadPlayer?.goals ?? 0,
    club: dqdPlayer?.currentTeam || squadPlayer?.club || '—',
    marketVal: dqdPlayer ? formatMarketVal(dqdPlayer.marketValue) : '—',
    wcGoals: dqdPlayer?.worldCup?.goals != null ? String(dqdPlayer.worldCup.goals) : '—',
    wcAssists: dqdPlayer?.worldCup?.assists != null ? String(dqdPlayer.worldCup.assists) : '—',
    wcShots: dqdPlayer?.rankings?.shots ? String(dqdPlayer.rankings.shots.count) : '—',
    wcRating:
      dqdPlayer?.worldCup?.averageRating != null
        ? String(dqdPlayer.worldCup.averageRating)
        : '—',
    wikiExtract: wikiText ? cn(wikiText, 250) : '—',
  };
}

/* ---- components ---- */

function PlayerSelect({
  value,
  onChange,
  excludeName,
  label,
}: {
  value: SearchPlayer | null;
  onChange: (p: SearchPlayer) => void;
  excludeName?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPlayer[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function click(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const handleQuery = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.trim().length < 1) {
        setResults([]);
        return;
      }
      const r = searchPlayers(q, 10).filter((p) => p.name !== excludeName);
      setResults(r);
    },
    [excludeName],
  );

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 px-3 py-2.5 text-left text-slate-900 dark:text-white transition hover:border-slate-300 dark:hover:border-white/20"
      >
        {value ? (
          <>
            <span className="text-base">{value.teamFlag}</span>
            <span className="flex-1 truncate text-sm">
              {value.cnName || value.enName}{' '}
              <span className="text-slate-500 dark:text-slate-500">
                {value.teamCn} · {value.position}
              </span>
            </span>
          </>
        ) : (
          <span className="text-sm text-slate-500 dark:text-slate-500">选择球员…</span>
        )}
        <svg className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 shadow-xl">
          <div className="p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              placeholder="搜索球员…"
              className="w-full rounded-md bg-slate-200 dark:bg-white/10 px-2 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {results.length === 0 && query.trim() ? (
              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-500">无匹配球员</div>
            ) : results.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-500">输入球员名搜索…</div>
            ) : (
              results.map((p) => (
                <button
                  key={`${p.teamCode}-${p.name}`}
                  onClick={() => {
                    onChange(p);
                    setOpen(false);
                    setQuery('');
                    setResults([]);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:bg-white/5 ${
                    value?.name === p.name ? 'bg-sky-500/10 text-sky-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  <span className="text-base w-6 text-center">{p.teamFlag}</span>
                  <span className="truncate">
                    {p.cnName && <span>{p.cnName} </span>}
                    <span className="text-slate-500 dark:text-slate-400 text-xs">{p.enName}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-slate-500 dark:text-slate-500">
                    {p.teamCn} · {p.position}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({
  label,
  a,
  b,
  highlight,
}: {
  label: string;
  a: string;
  b: string;
  highlight?: 'higher' | 'lower';
}) {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  let aBetter = false;
  let bBetter = false;
  if (highlight && !Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    if (highlight === 'higher') {
      aBetter = aNum > bNum;
      bBetter = bNum > aNum;
    } else {
      aBetter = aNum < bNum;
      bBetter = bNum < aNum;
    }
  }

  return (
    <div className="flex items-center border-b border-slate-200 dark:border-white/5 py-2.5 text-sm">
      <div className="w-[45%] text-right">
        <span className={aBetter ? 'rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400 font-semibold' : 'text-slate-700 dark:text-slate-200'}>
          {a}
        </span>
      </div>
      <div className="w-[10%] text-center text-xs text-slate-500 dark:text-slate-500">{label}</div>
      <div className="w-[45%] text-left">
        <span className={bBetter ? 'rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-400 font-semibold' : 'text-slate-700 dark:text-slate-200'}>
          {b}
        </span>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 dark:bg-white/5 p-3">
      <div className="text-xs text-slate-500 dark:text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{value || '—'}</div>
    </div>
  );
}

function BarStatRow({
  label,
  a,
  b,
  highlight = 'higher',
}: {
  label: string;
  a: string;
  b: string;
  highlight?: 'higher' | 'lower';
}) {
  const aNum = parseFloat(a);
  const bNum = parseFloat(b);
  const valid = !Number.isNaN(aNum) && !Number.isNaN(bNum);
  const total = valid ? aNum + bNum : 0;
  const aPct = valid && total > 0 ? Math.round((aNum / total) * 100) : 50;
  const bPct = 100 - aPct;

  let aWin = false;
  let bWin = false;
  if (valid) {
    if (highlight === 'higher') {
      aWin = aNum > bNum;
      bWin = bNum > aNum;
    } else {
      aWin = aNum < bNum;
      bWin = bNum < aNum;
    }
  }

  return (
    <div className="border-b border-slate-200 dark:border-white/5 py-2.5">
      <div className="mb-1 flex items-center text-sm">
        <div className="w-[42%] text-right">
          <span className={aWin ? 'font-bold text-emerald-400' : 'text-slate-700 dark:text-slate-200'}>{a}</span>
        </div>
        <div className="w-[16%] text-center text-xs text-slate-500 dark:text-slate-500">{label}</div>
        <div className="w-[42%] text-left">
          <span className={bWin ? 'font-bold text-emerald-400' : 'text-slate-700 dark:text-slate-200'}>{b}</span>
        </div>
      </div>
      {valid && total > 0 && (
        <div className="flex items-center gap-px h-1.5">
          <div
            className={`h-full rounded-l-full transition-all ${aWin ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-white/20'}`}
            style={{ width: `${aPct}%` }}
          />
          <div
            className={`h-full rounded-r-full transition-all ${bWin ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-white/20'}`}
            style={{ width: `${bPct}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ---- main page ---- */

export default function Compare() {
  const [playerA, setPlayerA] = useState<SearchPlayer | null>(null);
  const [playerB, setPlayerB] = useState<SearchPlayer | null>(null);
  const [dqdData, setDqdData] = useState<DqdStatsData>({});
  const [wikiCache, setWikiCache] = useState<Record<string, Record<string, { careerReview?: string; wcSpotlight?: string }>>>({});
  const wikiFetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    fetchJson<DqdStatsData>('/data/dqd-worldcup-stats.json', { maxAge: 10 * 60_000 })
      .then((data) => { if (!cancelled) setDqdData(data); })
      .catch(() => { if (!cancelled) setDqdData({}); });
    return () => { cancelled = true; };
  }, []);

  const handleRefresh = () => {
    clearJsonCache('/data/dqd-');
    clearDqdPlayerMapCache();
    fetchJson<DqdStatsData>('/data/dqd-worldcup-stats.json', { force: true, maxAge: 10 * 60_000 })
      .then((data) => setDqdData(data))
      .catch(() => setDqdData({}));
  };

  useEffect(() => {
    const codes = [playerA?.teamCode, playerB?.teamCode].filter(Boolean) as string[];
    codes.forEach((code) => {
      if (wikiFetchedRef.current.has(code)) return;
      wikiFetchedRef.current.add(code);
      fetchJson<Record<string, { careerReview?: string; wcSpotlight?: string }>>(`/data/players-wiki/${code}.json`)
        .then((data) => setWikiCache((prev) => ({ ...prev, [code]: data })))
        .catch(() => { wikiFetchedRef.current.delete(code); });
    });
  }, [playerA?.teamCode, playerB?.teamCode]);

  const playerStatsA = useMemo(
    () => (playerA ? computePlayerStats(playerA, dqdData, wikiCache[playerA.teamCode] ?? {}) : null),
    [playerA, dqdData, wikiCache],
  );
  const playerStatsB = useMemo(
    () => (playerB ? computePlayerStats(playerB, dqdData, wikiCache[playerB.teamCode] ?? {}) : null),
    [playerB, dqdData, wikiCache],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">对比
            <button
              onClick={handleRefresh}
              className="inline-flex items-center rounded-lg border border-slate-300 dark:border-white/10 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              title="刷新数据"
            >
              <svg className="mr-1 h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 0 1 10.47-4M14 8a6 6 0 0 1-10.47 4" strokeLinecap="round"/><path d="M2 2v4h4M14 14v-4h-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              刷新
            </button>
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">球员数据并排比较</p>
        </div>
      </header>

      {/* ---- selectors ---- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <PlayerSelect
          value={playerA}
          onChange={setPlayerA}
          excludeName={playerB?.name}
          label="球员 A"
        />
        <PlayerSelect
          value={playerB}
          onChange={setPlayerB}
          excludeName={playerA?.name}
          label="球员 B"
        />
      </div>

      {/* ---- player comparison ---- */}
      {playerA && playerB && playerStatsA && playerStatsB && (
        <div className="space-y-4">
          {/* header cards */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-0">
            <Link
              to={`/players/${playerA.teamCode}/${encodeURIComponent(playerA.name)}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 transition hover:border-sky-500/30"
            >
              <span className="text-xl">{playerA.teamFlag}</span>
              <span className="text-lg font-bold">{playerStatsA.cnName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {playerStatsA.teamCn} · {playerStatsA.position}
              </span>
            </Link>
            <div className="flex items-center px-3">
              <div className="rounded-full bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-black text-sky-400 ring-1 ring-slate-200 dark:ring-white/10">
                VS
              </div>
            </div>
            <Link
              to={`/players/${playerB.teamCode}/${encodeURIComponent(playerB.name)}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4 transition hover:border-sky-500/30"
            >
              <span className="text-xl">{playerB.teamFlag}</span>
              <span className="text-lg font-bold">{playerStatsB.cnName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                {playerStatsB.teamCn} · {playerStatsB.position}
              </span>
            </Link>
          </div>

          {/* stat rows */}
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-4">
            <StatRow label="位置" a={playerStatsA.position} b={playerStatsB.position} />
            <BarStatRow label="年龄" a={String(playerStatsA.age)} b={String(playerStatsB.age)} highlight="lower" />
            <StatRow label="身高" a={playerStatsA.height} b={playerStatsB.height} />
            <BarStatRow label="国家队出场" a={String(playerStatsA.caps)} b={String(playerStatsB.caps)} highlight="higher" />
            <BarStatRow label="国家队进球" a={String(playerStatsA.goals)} b={String(playerStatsB.goals)} highlight="higher" />
            <StatRow label="当前俱乐部" a={playerStatsA.club} b={playerStatsB.club} />
            <StatRow label="市场价值" a={playerStatsA.marketVal} b={playerStatsB.marketVal} />
            <BarStatRow label="世界杯进球" a={playerStatsA.wcGoals} b={playerStatsB.wcGoals} highlight="higher" />
            <BarStatRow label="世界杯助攻" a={playerStatsA.wcAssists} b={playerStatsB.wcAssists} highlight="higher" />
            <BarStatRow label="射门" a={playerStatsA.wcShots} b={playerStatsB.wcShots} highlight="higher" />
            <BarStatRow label="评分" a={playerStatsA.wcRating} b={playerStatsB.wcRating} highlight="higher" />
          </div>

          {/* wiki extracts */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatBlock label="球员介绍" value={playerStatsA.wikiExtract} />
            <StatBlock label="球员介绍" value={playerStatsB.wikiExtract} />
          </div>
        </div>
      )}

      {(!playerA || !playerB) && (
        <div className="flex items-center justify-center py-20 text-sm text-slate-500 dark:text-slate-500">
          请选择两名球员进行对比
        </div>
      )}
    </div>
  );
}
