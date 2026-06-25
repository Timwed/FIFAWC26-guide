import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import wikiTeamsData from '../data/wiki-teams.json';
import scheduleData from '../data/venue-schedule.json';
import { buildOpenLigaGoals, mergeMatchPatches } from '../utils/matchMerge';
import { fetchOpenLigaMatches, findOpenLigaMatch } from '../utils/matchData';
import { formatBeijingTime } from '../utils/datetime';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import StarButton from '../components/StarButton';
import LoadingState from '../components/LoadingState';
import type { MatchEvent, StaticGoal } from '../types';
import type { OpenLigaMatch } from '../api/openligadb';
import { fetchJson } from '../utils/jsonData';
import { useLiveScorePatches } from '../utils/liveScores';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  cnExtract: string;
  group: string;
  olgId: number | null;
  olgIcon: string;
  olgName: string;
}

interface SquadEntry {
  name: string;
  group: string;
  coach: string;
  players: PlayerEntry[];
}

interface PlayerEntry {
  number: string;
  position: string;
  name: string;
  age: number;
  caps: number;
  goals: number;
  club: string;
}

interface WikiEntry {
  title: string;
  extract: string;
}

interface DqdPlayerStat {
  cnName: string;
  dqdId: string;
  rankings?: {
    goals?: { rank: number; count: number };
    assists?: { rank: number; count: number };
    rating?: { rank: number; count: number | string };
  };
}

type DqdTeamStats = Record<string, DqdPlayerStat>;
type DqdStatsData = Record<string, DqdTeamStats>;

interface DqdLineupPlayer {
  personId: string;
  name: string;
  rating: string;
  keyStats: Record<string, string>;
}

interface DqdMatchDetail {
  home: string;
  away: string;
  score: string;
  date: string;
  overview: {
    stats: { type: string; home: number | string; away: number | string }[];
  };
  lineup: {
    home: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
    away: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
  } | null;
}

const teams = teamsData as TeamEntry[];
const wiki = wikiTeamsData as Record<string, WikiEntry>;

const POSITION_LABELS: Record<string, string> = {
  GK: '守门员',
  DF: '后卫',
  MF: '中场',
  FW: '前锋',
};

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400',
  DF: 'bg-green-500/20 text-green-400',
  MF: 'bg-blue-500/20 text-blue-400',
  FW: 'bg-red-500/20 text-red-400',
};

function parseCnExtract(text: string): { label: string; body: string }[] {
  const sections = text.split(/\n\n(?=\*\*)/);
  return sections.map((s) => {
    const match = s.match(/^\*\*(.+?)\*\*\s*[—–-]\s*/);
    if (match) {
      return { label: match[1], body: s.slice(match[0].length) };
    }
    return { label: '', body: s };
  }).filter((s) => s.body.length > 0);
}

function findTeamWiki(enName: string): string | null {
  const key = enName.toLowerCase();
  // Try direct match
  for (const [k, v] of Object.entries(wiki)) {
    if (k.toLowerCase() === key) return v.extract;
  }
  // Try aliases
  const aliases: Record<string, string> = {
    'united states': 'USA',
    'bosnia and herzegovina': 'Bosnia-Herzegovina',
    'czech republic': 'Czech Republic',
    'ivory coast': 'Ivory Coast',
    'netherlands': 'Netherlands',
    'south korea': 'South Korea',
    'dr congo': 'DR Congo',
  };
  const aliasKey = aliases[key];
  if (aliasKey && wiki[aliasKey]) return wiki[aliasKey].extract;
  return null;
}

interface TeamMatch extends MatchEvent {
  goals?: StaticGoal[];
}

const allScheduleMatches: TeamMatch[] = (
  Object.values(scheduleData as unknown as Record<string, TeamMatch[]>).flat()
);

const EN_NAME_ALIASES: Record<string, string> = {
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  'USA': 'United States',
};

function findOpponentFlag(enName: string): string | undefined {
  const t = teams.find((x) => x.enName === enName);
  if (t) return t.olgIcon;
  const alias = EN_NAME_ALIASES[enName];
  if (alias) {
    const a = teams.find((x) => x.enName === alias);
    if (a) return a.olgIcon;
  }
  return undefined;
}

function findOpponentCn(enName: string): string | undefined {
  const t = teams.find((x) => x.enName === enName);
  if (t) return t.cnName;
  const alias = EN_NAME_ALIASES[enName];
  if (alias) {
    const a = teams.find((x) => x.enName === alias);
    if (a) return a.cnName;
  }
  return undefined;
}

function statNumber(value: number | string | undefined) {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function TeamDetail() {
  const { shortName } = useParams<{ shortName: string }>();

  const team = useMemo(
    () => teams.find((t) => t.shortName.toUpperCase() === shortName?.toUpperCase()),
    [shortName]
  );
  const squad = useMemo(
    () => team ? (squadsData as SquadEntry[]).find((s) => s.name.toLowerCase() === team.enName.toLowerCase()) : null,
    [team]
  );
  const wikiExtract = useMemo(() => (team ? findTeamWiki(team.enName) : null), [team]);

  const liveMap = useLiveScorePatches();
  const [openLigaMatches, setOpenLigaMatches] = useState<OpenLigaMatch[]>([]);
  const [dqdStatsData, setDqdStatsData] = useState<DqdStatsData>({});
  const [dqdMatchData, setDqdMatchData] = useState<Record<string, DqdMatchDetail>>({});
  const [posFilter, setPosFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'matches' | 'stats'>('overview');

  useEffect(() => {
    let cancelled = false;
    if (!team) return;
    fetchJson<DqdStatsData[string]>(`/data/dqd-stats/${team.shortName}.json`, { maxAge: 5 * 60_000 })
      .then((data) => { if (!cancelled) setDqdStatsData({ [team.shortName]: data }); })
      .catch(() => { if (!cancelled) setDqdStatsData({}); });
    return () => { cancelled = true; };
  }, [team]);

  useEffect(() => {
    let cancelled = false;
    if (!team) return;
    fetchJson<Record<string, string[]>>('/data/dqd-team-match-index.json')
      .then(async (index) => {
        const ids = index[team.shortName] || [];
        const entries = await Promise.all(
          ids.map((id) => fetchJson<DqdMatchDetail>(`/data/dqd-matches/${id}.json`, { maxAge: 2 * 60_000 }).then((data) => [id, data] as const))
        );
        return Object.fromEntries(entries);
      })
      .then((data) => { if (!cancelled) setDqdMatchData(data); })
      .catch(() => { if (!cancelled) setDqdMatchData({}); });
    return () => { cancelled = true; };
  }, [team]);


  useEffect(() => {
    let cancelled = false;
    fetchOpenLigaMatches().then((matches) => {
      if (cancelled) return;
      setOpenLigaMatches(matches);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const teamMatches = useMemo(() => {
    if (!team) return [];
    return mergeMatchPatches(
      allScheduleMatches.filter((m) => m.strHomeTeam === team.enName || m.strAwayTeam === team.enName),
      liveMap
    ).sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime));
  }, [team, liveMap]);

  const teamStyle = useMemo(() => {
    if (!team) return null;
    const totals: Record<string, number> = {};
    let count = 0;
    for (const [idEvent, detail] of Object.entries(dqdMatchData)) {
      const local = allScheduleMatches.find((m) => m.idEvent === idEvent);
      if (!local || local.strHomeTeam !== team.enName && local.strAwayTeam !== team.enName) continue;
      const isHome = local.strHomeTeam === team.enName;
      count++;
      for (const stat of detail.overview?.stats || []) {
        totals[stat.type] = (totals[stat.type] || 0) + statNumber(isHome ? stat.home : stat.away);
      }
    }
    if (count === 0) return null;
    const avg = (key: string) => Number(((totals[key] || 0) / count).toFixed(1));
    const possession = avg('控球率');
    const shots = avg('射门');
    const shotsOnTarget = avg('射正');
    const passRate = avg('传球成功率');
    const tackles = avg('抢断');
    const clearances = avg('解围');
    const tags = [];
    if (possession >= 55 && passRate >= 84) tags.push('控球型');
    if (shots >= 13 || shotsOnTarget >= 5) tags.push('进攻主动');
    if (tackles >= 17) tags.push('高压逼抢');
    if (clearances >= 20 && possession < 50) tags.push('防守反击');
    if (tags.length === 0) tags.push('均衡型');
    return { count, possession, shots, shotsOnTarget, passRate, tackles, clearances, tags };
  }, [dqdMatchData, team]);

  const teamStatsProfile = useMemo(() => {
    if (!team) return null;
    const keys = Object.keys(dqdMatchData);
    if (keys.length === 0) return null;

    const perTeam: Record<string, Record<string, { total: number; count: number }>> = {};
    const perTeamMatches: Record<string, number> = {};
    for (const detail of Object.values(dqdMatchData)) {
      perTeamMatches[detail.home] = (perTeamMatches[detail.home] || 0) + 1;
      perTeamMatches[detail.away] = (perTeamMatches[detail.away] || 0) + 1;
      for (const stat of detail.overview?.stats || []) {
        const valH = statNumber(stat.home);
        const valA = statNumber(stat.away);
        if (!perTeam[detail.home]) perTeam[detail.home] = {};
        if (!perTeam[detail.home][stat.type]) perTeam[detail.home][stat.type] = { total: 0, count: 0 };
        perTeam[detail.home][stat.type].total += valH;
        perTeam[detail.home][stat.type].count++;
        if (!perTeam[detail.away]) perTeam[detail.away] = {};
        if (!perTeam[detail.away][stat.type]) perTeam[detail.away][stat.type] = { total: 0, count: 0 };
        perTeam[detail.away][stat.type].total += valA;
        perTeam[detail.away][stat.type].count++;
      }
    }

    const perTeamAvg: Record<string, Record<string, number>> = {};
    for (const [tcn, stats] of Object.entries(perTeam)) {
      perTeamAvg[tcn] = {};
      for (const [statType, acc] of Object.entries(stats)) {
        perTeamAvg[tcn][statType] = acc.count > 0 ? acc.total / acc.count : 0;
      }
    }

    const teamAvgs = perTeamAvg[team.cnName] ?? {};
    const statTypes = Object.keys(teamAvgs);
    if (statTypes.length === 0) return null;

    const medians: Record<string, number> = {};
    const maxes: Record<string, number> = {};
    for (const statType of statTypes) {
      const values = Object.values(perTeamAvg)
        .map((t) => t[statType])
        .filter((v) => v != null && v > 0)
        .sort((a, b) => a - b);
      if (values.length > 0) {
        const mid = Math.floor(values.length / 2);
        medians[statType] = values.length % 2 === 0
          ? (values[mid - 1] + values[mid]) / 2
          : values[mid];
        maxes[statType] = values[values.length - 1];
      }
    }

    return { teamAvgs, medians, maxes, matchCount: perTeamMatches[team.cnName] || 0 };
  }, [dqdMatchData, team]);

  const topLineupPerformances = useMemo(() => {
    if (!team) return [];
    const idToPlayer = new Map<string, { enName: string; cnName: string }>();
    const teamStats = dqdStatsData[team.shortName.toUpperCase()] || {};
    for (const [enName, stat] of Object.entries(teamStats)) {
      if (stat.dqdId) idToPlayer.set(stat.dqdId, { enName, cnName: stat.cnName });
    }
    const rows: {
      idEvent: string;
      name: string;
      enName: string;
      opponent: string;
      rating: number;
      score: string;
      role: string;
      keyStats: Record<string, string>;
    }[] = [];
    for (const [idEvent, detail] of Object.entries(dqdMatchData)) {
      const local = allScheduleMatches.find((m) => m.idEvent === idEvent);
      if (!local || local.strHomeTeam !== team.enName && local.strAwayTeam !== team.enName) continue;
      const side = local.strHomeTeam === team.enName ? detail.lineup?.home : detail.lineup?.away;
      if (!side) continue;
      const opponentEn = local.strHomeTeam === team.enName ? local.strAwayTeam : local.strHomeTeam;
      for (const [role, players] of [['首发', side.starters], ['替补', side.substitutes]] as const) {
        for (const player of players) {
          const rating = Number(player.rating);
          if (!Number.isFinite(rating)) continue;
          const localPlayer = idToPlayer.get(player.personId);
          rows.push({
            idEvent,
            name: localPlayer?.cnName || player.name,
            enName: localPlayer?.enName || '',
            opponent: findOpponentCn(opponentEn) || opponentEn,
            rating,
            score: detail.score,
            role,
            keyStats: player.keyStats,
          });
        }
      }
    }
    return rows.sort((a, b) => b.rating - a.rating).slice(0, 8);
  }, [dqdMatchData, dqdStatsData, team]);

  const players = squad?.players || [];
  const posCounts = useMemo(() => {
    const counts: Record<string, number> = { All: players.length };
    for (const p of players) { counts[p.position] = (counts[p.position] || 0) + 1; }
    return counts;
  }, [players]);

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-400">未找到球队</p>
        <Link to="/teams" className="text-sm text-sky-400 hover:text-sky-300">
          ← 返回球队列表
        </Link>
      </div>
    );
  }

  const positions = (['All', 'GK', 'DF', 'MF', 'FW'] as const);
  const filteredPlayers =
    posFilter === 'All' ? players : players.filter((p) => p.position === posFilter);

  return (
    <div className="space-y-8">
      <Link to="/teams" className="text-sm text-sky-400 hover:text-sky-300">
        ← 返回球队列表
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <img
          src={team.olgIcon}
          alt={team.enName}
          className="h-28 w-28 object-contain md:h-36 md:w-36"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold">{team.cnName}</h2>
            <StarButton type="team" id={team.shortName} />
            <span className="rounded bg-sky-500/20 px-2 py-1 text-sm text-sky-400">
              {team.group}组
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{team.enName}</p>
          {squad?.coach && (
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              主教练: <span className="font-medium text-slate-900 dark:text-white">{squad.coach}</span>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{squad?.players.length || 0}名球员入选</span>
          </div>
        </div>
      </div>

      <div className="sticky top-[60px] z-30 -mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-white/10 pb-px">
        {([
          ['overview', '概览'],
          ['squad', `名单${squad ? ` (${squad.players.length})` : ''}`],
          ['matches', '比赛'],
          ['stats', '数据'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === key
                ? 'border-b-2 border-sky-500 text-sky-500'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
      <>
      {(() => {
        const sections = parseCnExtract(team.cnExtract);
        if (sections.length > 0) {
          return (
            <section className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
              <h3 className="mb-4 text-lg font-bold">球队简介</h3>
              <div className="space-y-5">
                {sections.map((sec, i) => (
                  <div key={i}>
                    <h4 className="mb-1.5 text-sm font-bold text-sky-400">{sec.label}</h4>
                    <p className="leading-relaxed text-slate-700 dark:text-slate-300">{sec.body}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (wikiExtract) {
          return (
            <section className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-bold">球队简介</h3>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                  Wikipedia
                </span>
              </div>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">{wikiExtract}</p>
            </section>
          );
        }
        return null;
      })()}

      {Object.keys(dqdMatchData).length === 0 && (
        <LoadingState label="加载比赛数据" />
      )}

      {teamStyle && (
        <section className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold">球队风格画像</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">基于 {teamStyle.count} 场 DQD 技术统计</span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {teamStyle.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">{tag}</span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            <Stat label="控球率" value={`${teamStyle.possession}%`} />
            <Stat label="射门" value={`${teamStyle.shots}次`} />
            <Stat label="射正" value={`${teamStyle.shotsOnTarget}次`} />
            <Stat label="传球成功率" value={`${teamStyle.passRate}%`} />
            <Stat label="抢断" value={`${teamStyle.tackles}次`} />
            <Stat label="解围" value={`${teamStyle.clearances}次`} />
          </div>
        </section>
      )}

      </>
      )}

      {activeTab === 'stats' && (
      <>
      {Object.keys(dqdMatchData).length === 0 && (
        <LoadingState label="加载比赛数据" />
      )}

      {/* Team Statistics Profile */}
      {teamStatsProfile && (() => {
        const DISPLAY_STATS: { type: string; label: string; suffix: string }[] = [
          { type: '控球率', label: '控球率', suffix: '%' },
          { type: '射门', label: '射门/场', suffix: '' },
          { type: '射正', label: '射正/场', suffix: '' },
          { type: '角球', label: '角球/场', suffix: '' },
          { type: '传球成功率', label: '传球成功率', suffix: '%' },
          { type: '抢断', label: '抢断/场', suffix: '' },
          { type: '拦截', label: '拦截/场', suffix: '' },
          { type: '犯规', label: '犯规/场', suffix: '' },
        ];
        const shown = DISPLAY_STATS.filter((s) => teamStatsProfile.teamAvgs[s.type] != null);
        if (shown.length === 0) return null;
        return (
          <section className="rounded-xl border border-l-4 border-l-teal-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">比赛数据画像</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">基于 {teamStatsProfile.matchCount} 场 DQD 技术统计 · 场均</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {shown.map((stat) => {
                const val = teamStatsProfile.teamAvgs[stat.type];
                const median = teamStatsProfile.medians[stat.type];
                const max = teamStatsProfile.maxes[stat.type];
                const aboveMedian = median !== undefined && val >= median;
                const pct = max > 0 ? (val / max) * 100 : 0;
                const displayVal = stat.suffix === '%' ? `${val.toFixed(1)}%` : val.toFixed(1);
                return (
                  <div key={stat.type} className="rounded-lg bg-slate-50 dark:bg-white/[0.03] p-3">
                    <div className="mb-1.5 flex items-baseline justify-between gap-2">
                      <span className="text-xs text-slate-400">{stat.label}</span>
                      <span className={`text-sm font-bold tabular-nums ${aboveMedian ? 'text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {displayVal}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all ${aboveMedian ? 'bg-emerald-500/60' : 'bg-slate-500/40'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    {median !== undefined && (
                      <div className="mt-0.5 text-[10px] text-slate-600">
                        联赛均值 {stat.suffix === '%' ? `${median.toFixed(1)}%` : median.toFixed(1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      </>
      )}

      {activeTab === 'matches' && (
      <>
      {teamMatches.length > 0 && (
        <section className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">比赛战况</h3>
          <div className="space-y-3">
            {teamMatches.map((m) => {
              const isHomeTeam = m.strHomeTeam === team.enName;
              const homeFlag = isHomeTeam ? team.olgIcon : findOpponentFlag(m.strHomeTeam);
              const awayFlag = isHomeTeam ? findOpponentFlag(m.strAwayTeam) : team.olgIcon;
              const homeCn = isHomeTeam ? team.cnName : findOpponentCn(m.strHomeTeam);
              const awayCn = isHomeTeam ? findOpponentCn(m.strAwayTeam) : team.cnName;
              const finished = m.strStatus === 'FT';
              const live = m.strStatus && m.strStatus !== 'FT' && m.strStatus !== 'NS' && m.strStatus !== null;
              const bjTime = formatBeijingTime(m.dateEvent, m.strTime);
              const openLigaMatch = findOpenLigaMatch(openLigaMatches, m.strHomeTeam, m.strAwayTeam, m.strTimestamp);
              const goals = openLigaMatch && openLigaMatch.goals.length > 0
                ? buildOpenLigaGoals(openLigaMatch, m.strHomeTeam)
                : m.goals || [];
              const homeGoals = goals.filter((g) => g.team === 'home');
              const awayGoals = goals.filter((g) => g.team === 'away');

              return (
                <Link
                  to={`/match/${m.idEvent}`}
                  key={m.idEvent}
                  className="block rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4 transition hover:border-sky-500/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        finished
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : live
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {finished ? '已结束' : live ? '进行中' : '即将开始'}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {bjTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="flex w-24 flex-col items-center">
                      <img
                        src={homeFlag}
                        alt=""
                        className="mb-1 h-9 w-9 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="w-full truncate text-center text-sm font-bold">
                        {homeCn || m.strHomeTeam}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {finished || live ? (
                        <>
                          <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                            {m.intHomeScore ?? '-'}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                          <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                            {m.intAwayScore ?? '-'}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-slate-400 dark:text-slate-500">VS</span>
                      )}
                    </div>
                    <div className="flex w-24 flex-col items-center">
                      <img
                        src={awayFlag}
                        alt=""
                        className="mb-1 h-9 w-9 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="w-full truncate text-center text-sm font-bold">
                        {awayCn || m.strAwayTeam}
                      </span>
                    </div>
                  </div>

                  {finished && goals.length > 0 && (
                    <div className="mt-3 flex gap-4 border-t border-slate-200 dark:border-white/5 pt-3">
                      <div className="flex-1 space-y-0.5 text-xs text-slate-400">
                        {homeGoals.map((g, i) => (
                          <div key={i}>
                            {g.name} {g.minute}&apos;
                            {g.isPenalty ? ' (P)' : ''}
                            {g.isOwnGoal ? ' (OG)' : ''}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 space-y-0.5 text-right text-xs text-slate-400">
                        {awayGoals.map((g, i) => (
                          <div key={i}>
                            {g.name} {g.minute}&apos;
                            {g.isPenalty ? ' (P)' : ''}
                            {g.isOwnGoal ? ' (OG)' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
      </>
      )}

      {activeTab === 'squad' && (
      <>
      {/* 本队世界杯状态榜 */}
      {(() => {
        const teamStats = dqdStatsData[team.shortName.toUpperCase()];
        if (!teamStats) return null;
        const topGoals = Object.entries(teamStats)
          .filter(([, p]) => p.rankings?.goals && p.rankings.goals.count > 0)
          .sort(([, a], [, b]) => (b.rankings?.goals?.count || 0) - (a.rankings?.goals?.count || 0))
          .slice(0, 5);
        const topAssists = Object.entries(teamStats)
          .filter(([, p]) => p.rankings?.assists && p.rankings.assists.count > 0)
          .sort(([, a], [, b]) => (b.rankings?.assists?.count || 0) - (a.rankings?.assists?.count || 0))
          .slice(0, 5);
        const topRating = Object.entries(teamStats)
          .filter(([, p]) => p.rankings?.rating != null)
          .sort(([, a], [, b]) => Number(b.rankings?.rating?.count || 0) - Number(a.rankings?.rating?.count || 0))
          .slice(0, 5);
        if (topGoals.length === 0 && topAssists.length === 0 && topRating.length === 0) return null;
        return (
          <section className="rounded-xl border border-l-4 border-l-cyan-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
            <h3 className="mb-4 text-lg font-bold">世界杯状态榜</h3>
            <div className="grid gap-5 md:grid-cols-3">
              {topGoals.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-rose-400">射手榜 Top5</h4>
                  <div className="space-y-1.5">
                    {topGoals.map(([name, p], i) => (
                      <div key={name} className="flex items-center gap-2 text-sm">
                        <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{i + 1}</span>
                        <span className="flex-1 truncate text-slate-200">{p.cnName || name}</span>
                        <span className="tabular-nums font-bold text-rose-400">{String(p.rankings!.goals!.count)}⚽</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {topAssists.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-amber-400">助攻榜 Top5</h4>
                  <div className="space-y-1.5">
                    {topAssists.map(([name, p], i) => (
                      <div key={name} className="flex items-center gap-2 text-sm">
                        <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{i + 1}</span>
                        <span className="flex-1 truncate text-slate-200">{p.cnName || name}</span>
                        <span className="tabular-nums font-bold text-amber-400">{p.rankings!.assists!.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {topRating.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-sky-400">评分榜 Top5</h4>
                  <div className="space-y-1.5">
                    {topRating.map(([name, p], i) => (
                      <div key={name} className="flex items-center gap-2 text-sm">
                        <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{i + 1}</span>
                        <span className="flex-1 truncate text-slate-200">{p.cnName || name}</span>
                        <span className="tabular-nums font-bold text-sky-400">{p.rankings!.rating!.count as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {topLineupPerformances.length > 0 && (
        <section className="rounded-xl border border-l-4 border-l-violet-500 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-bold">单场评分表现</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {topLineupPerformances.map((row, idx) => (
              <Link key={`${row.idEvent}-${row.name}-${idx}`} to={row.enName ? `/players/${team.shortName}/${encodeURIComponent(row.enName)}` : `/match/${row.idEvent}`} className="rounded-lg bg-slate-50 dark:bg-white/[0.03] px-3 py-2 text-sm transition hover:bg-slate-200 dark:hover:bg-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-200">{row.name}</span>
                  <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-300">{row.rating.toFixed(1)}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 pl-7 text-xs text-slate-400 dark:text-slate-500">
                  <span>vs {row.opponent}</span>
                  <span>{row.score}</span>
                  <span>{row.role}</span>
                  {row.keyStats.xg && <span>xG {row.keyStats.xg}</span>}
                  {row.keyStats.shots && <span>射门 {row.keyStats.shots}</span>}
                  {row.keyStats.keyPasses && <span>关键传球 {row.keyStats.keyPasses}</span>}
                  {row.keyStats.saves && <span>扑救 {row.keyStats.saves}</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold">
            球员名单
            {squad && <span className="ml-2 text-sm font-normal text-slate-400">({squad.players.length}人)</span>}
          </h3>
          <div className="flex flex-wrap gap-1">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  posFilter === pos
                    ? 'bg-sky-500 text-slate-900 dark:text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200 dark:bg-white/10'
                }`}
              >
                {pos === 'All' ? `全部 (${posCounts.All})` : `${POSITION_LABELS[pos] || pos} (${posCounts[pos] || 0})`}
              </button>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">暂无球员数据</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player, idx) => (
              <PlayerCard key={idx} player={player} teamCode={team.shortName} />
            ))}
          </div>
        )}
      </section>
      </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-2">
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function PlayerCard({ player, teamCode }: { player: PlayerEntry; teamCode: string }) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const info = lookupPlayerByExactName(player.name);
  const cnName = info?.cnName || null;

  return (
    <Link
      to={`/players/${teamCode}/${encodeURIComponent(player.name)}`}
      className="group rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 p-4 transition hover:border-sky-500/30 hover:bg-sky-500/5 cursor-pointer block"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-base font-bold text-sky-400">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-bold group-hover:text-sky-300">
              {cnName || player.name}
            </h4>
            <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">#{player.number}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {cnName && (
              <span className="text-slate-400 dark:text-slate-500">{player.name}</span>
            )}
            <span className={`rounded px-2 py-0.5 ${POSITION_COLORS[player.position] || 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
              {POSITION_LABELS[player.position] || player.position}
            </span>
            {player.club && <span className="text-slate-400 dark:text-slate-500">{player.club}</span>}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-4 border-t border-slate-200 dark:border-white/5 pt-3 text-xs text-slate-400">
        <span>{player.age}岁</span>
        <span>{player.caps}场</span>
        <span>{player.goals}球</span>
      </div>
    </Link>
  );
}
