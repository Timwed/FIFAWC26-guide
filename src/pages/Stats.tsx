import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import { fetchJson, clearJsonCache } from '../utils/jsonData';
import { clearDqdPlayerMapCache } from '../utils/dqdPlayerMap';
import LoadingState from '../components/LoadingState';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

interface SquadPlayer {
  name: string;
  position: string;
}

interface SquadEntry {
  name: string;
  players: SquadPlayer[];
}

interface DqdPlayerStats {
  dqdId: string;
  cnName: string;
  rankings: Record<string, { rank: number; count: number; label: string }>;
}

interface DqdMatchEvent {
  type: string;
  minute: string;
  minute_extra: string;
}

interface DqdLineupPlayer {
  personId: string;
  name: string;
  position: string;
  events: DqdMatchEvent[];
}

interface DqdMatchDetail {
  score: string;
  home: string;
  away: string;
  lineup: {
    home: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
    away: { starters: DqdLineupPlayer[]; substitutes: DqdLineupPlayer[] } | null;
  } | null;
}

interface PlayerLinkInfo {
  enName: string;
  team: string;
  cnName: string;
}

interface RankingRow {
  enName: string;
  cnName: string;
  team: string;
  teamCn: string;
  olgIcon: string;
  count: number;
}

interface CardRow {
  enName: string;
  cnName: string;
  team: string;
  teamCn: string;
  olgIcon: string;
  yellows: number;
  straightReds: number;
  totalCards: number;
}

const teams = teamsData as TeamEntry[];

const CATEGORY_LABELS: Record<string, string> = {
  goals: '进球',
  assists: '助攻',
  shots: '射门',
  shots_on_target: '射正',
  big_chance_missed: '错失绝佳机会',
  key_passes: '关键传球',
  crosses: '传中',
  success_crosses: '成功传中',
  rating: '评分',
  pass_accuracy: '传球成功率',
  tackles: '抢断',
  interceptions: '拦截',
  was_dribbled: '被过',
  fouls: '犯规',
  big_chance_created: '创造进球机会',
  last_man_tackle: '最后铲球',
  long_balls: '长传',
  success_long_balls: '成功长传',
  goal_penalty: '点球进球',
  aerials: '争顶',
  aerials_won: '争顶成功',
  dispossessed: '丧失球权',
  dribbles_won: '成功过人',
  passes: '传球',
  touches: '触球',
  clearances: '解围',
  ground_duels_won: '成功地面争抢',
  dribbles_attempted: '尝试过人',
  fouled: '被犯规',
  ground_duels: '地面争抢',
  error_lead_to_shot: '失误导致射门',
  error_lead_to_goal: '失误导致失球',
  saves: '扑救',
  runs_out: '出击',
  runs_out_success: '成功出击',
  yellow_cards: '黄牌',
  box_shot_saves: '禁区射门扑救',
  punches: '击球',
  claims_high: '摘高球',
  red_cards: '红牌',
};

interface SectionConfig {
  key: string;
  title: string;
  categories: string[];
  topN: number;
  accent: string;
  countColor: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'attack',
    title: '进攻火力',
    categories: ['goals', 'assists', 'shots', 'shots_on_target', 'goal_penalty', 'big_chance_created', 'big_chance_missed'],
    topN: 10,
    accent: 'border-l-amber-500',
    countColor: 'text-amber-600 dark:text-amber-300',
  },
  {
    key: 'passing',
    title: '传球组织',
    categories: ['passes', 'pass_accuracy', 'key_passes', 'crosses', 'success_crosses', 'long_balls', 'success_long_balls', 'touches'],
    topN: 10,
    accent: 'border-l-sky-500',
    countColor: 'text-sky-600 dark:text-sky-300',
  },
  {
    key: 'dribbling',
    title: '过人突破',
    categories: ['dribbles_attempted', 'dribbles_won', 'fouled', 'dispossessed'],
    topN: 10,
    accent: 'border-l-pink-500',
    countColor: 'text-pink-600 dark:text-pink-300',
  },
  {
    key: 'defense',
    title: '防守抢断',
    categories: ['tackles', 'interceptions', 'clearances', 'ground_duels', 'ground_duels_won', 'was_dribbled', 'last_man_tackle'],
    topN: 10,
    accent: 'border-l-emerald-500',
    countColor: 'text-emerald-600 dark:text-emerald-300',
  },
  {
    key: 'aerial',
    title: '争顶对抗',
    categories: ['aerials', 'aerials_won'],
    topN: 10,
    accent: 'border-l-violet-500',
    countColor: 'text-violet-600 dark:text-violet-300',
  },
  {
    key: 'goalkeeper',
    title: '门将数据',
    categories: ['saves', 'box_shot_saves', 'runs_out', 'runs_out_success', 'punches', 'claims_high'],
    topN: 5,
    accent: 'border-l-teal-500',
    countColor: 'text-teal-600 dark:text-teal-300',
  },
  {
    key: 'discipline',
    title: '纪律失误',
    categories: ['fouls', 'yellow_cards', 'red_cards', 'error_lead_to_shot', 'error_lead_to_goal'],
    topN: 10,
    accent: 'border-l-red-500',
    countColor: 'text-red-600 dark:text-red-300',
  },
];

const ALL_CATEGORIES = SECTIONS.flatMap((s) => s.categories);

function formatCount(category: string, count: number): string {
  if (category === 'rating' || category === 'pass_accuracy') {
    return count.toFixed(1);
  }
  if (Number.isInteger(count)) return String(count);
  return count.toFixed(1);
}

export default function Stats() {
  const [dqdStatsData, setDqdStatsData] = useState<Record<string, Record<string, DqdPlayerStats>>>({});
  const [dqdMatchData, setDqdMatchData] = useState<Record<string, DqdMatchDetail>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ attack: true });
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const loading = Object.keys(dqdStatsData).length === 0;

  const squads = squadsData as SquadEntry[];

  useEffect(() => {
    let cancelled = false;
    fetchJson<Record<string, Record<string, DqdPlayerStats>>>('/data/dqd-worldcup-stats.json', { maxAge: 10 * 60_000 })
      .then((data) => { if (!cancelled) setDqdStatsData(data); })
      .catch(() => { if (!cancelled) setDqdStatsData({}); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchJson<Record<string, DqdMatchDetail>>('/data/dqd-match-details.json', { maxAge: 5 * 60_000 })
      .then((data) => { if (!cancelled) setDqdMatchData(data); })
      .catch(() => { if (!cancelled) setDqdMatchData({}); });
    return () => { cancelled = true; };
  }, []);

  const { idMap, shortToTeam } = useMemo(() => {
    const idMap = new Map<string, PlayerLinkInfo>();
    const shortToTeam = new Map<string, TeamEntry>();

    for (const t of teams) {
      shortToTeam.set(t.shortName, t);
    }

    for (const shortName of Object.keys(dqdStatsData)) {
      const players = dqdStatsData[shortName];
      if (!players || typeof players !== 'object') continue;
      for (const enName of Object.keys(players)) {
        const p = players[enName];
        if (p.dqdId) {
          idMap.set(p.dqdId, { enName, team: shortName, cnName: p.cnName });
        }
      }
    }

    return { idMap, shortToTeam };
  }, [dqdStatsData]);

  const positionByPlayer = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of teams) {
      const squad = squads.find((s) => s.name === t.enName);
      if (!squad) continue;
      for (const p of squad.players) {
        map.set(`${p.name}||${t.shortName}`, p.position);
      }
    }
    return map;
  }, []);

  const rankingBoards = useMemo(() => {
    const boards: Record<string, RankingRow[]> = {};
    for (const cat of ALL_CATEGORIES) {
      boards[cat] = [];
    }

    for (const shortName of Object.keys(dqdStatsData)) {
      const players = dqdStatsData[shortName];
      if (!players || typeof players !== 'object') continue;
      const team = shortToTeam.get(shortName);
      for (const enName of Object.keys(players)) {
        const p = players[enName];
        if (!p.rankings) continue;
        for (const cat of ALL_CATEGORIES) {
          const entry = p.rankings[cat];
          if (entry && entry.count > 0) {
            boards[cat].push({
              enName,
              cnName: p.cnName,
              team: shortName,
              teamCn: team?.cnName || shortName,
              olgIcon: team?.olgIcon || '',
              count: entry.count,
            });
          }
        }
      }
    }

    for (const cat of ALL_CATEGORIES) {
      boards[cat].sort((a, b) => b.count - a.count);
    }

    return boards;
  }, [dqdStatsData, shortToTeam]);

  const cleanSheetBoard = useMemo(() => {
    const counts = new Map<string, number>();
    for (const match of Object.values(dqdMatchData)) {
      if (!match.lineup || !match.score) continue;
      const sep = match.score.includes(':') ? ':' : '-';
      const [homeScore, awayScore] = match.score.split(sep).map(Number);

      if (awayScore === 0) {
        for (const starter of match.lineup.home?.starters || []) {
          if (starter.position === '门将') {
            counts.set(starter.personId, (counts.get(starter.personId) || 0) + 1);
            break;
          }
        }
      }

      if (homeScore === 0) {
        for (const starter of match.lineup.away?.starters || []) {
          if (starter.position === '门将') {
            counts.set(starter.personId, (counts.get(starter.personId) || 0) + 1);
            break;
          }
        }
      }
    }

    const rows: RankingRow[] = [];
    for (const [personId, count] of counts) {
      const info = idMap.get(personId);
      if (!info) continue;
      if (positionByPlayer.get(`${info.enName}||${info.team}`) !== 'GK') continue;
      const team = shortToTeam.get(info.team);
      rows.push({
        enName: info.enName,
        cnName: info.cnName,
        team: info.team,
        teamCn: team?.cnName || info.team,
        olgIcon: team?.olgIcon || '',
        count,
      });
    }
    return rows.sort((a, b) => b.count - a.count).slice(0, 10);
  }, [dqdMatchData, idMap, shortToTeam, positionByPlayer]);

  const cardBoard = useMemo(() => {
    const accum = new Map<string, { yellows: number; straightReds: number }>();
    for (const match of Object.values(dqdMatchData)) {
      if (!match.lineup) continue;
      for (const side of [match.lineup.home, match.lineup.away]) {
        for (const player of [...(side?.starters || []), ...(side?.substitutes || [])]) {
          if (!player.events || player.events.length === 0) continue;
          let yellows = 0;
          let straightReds = 0;
          for (const event of player.events) {
            if (event.type === 'YC') yellows++;
            if (event.type === 'Y2R') { yellows++; straightReds++; }
            if (event.type === 'RC') straightReds++;
          }
          if (yellows === 0 && straightReds === 0) continue;
          const existing = accum.get(player.personId);
          if (existing) {
            existing.yellows += yellows;
            existing.straightReds += straightReds;
          } else {
            accum.set(player.personId, { yellows, straightReds });
          }
        }
      }
    }

    const rows: CardRow[] = [];
    for (const [personId, data] of accum) {
      const info = idMap.get(personId);
      if (!info) continue;
      const team = shortToTeam.get(info.team);
      rows.push({
        enName: info.enName,
        cnName: info.cnName,
        team: info.team,
        teamCn: team?.cnName || info.team,
        olgIcon: team?.olgIcon || '',
        yellows: data.yellows,
        straightReds: data.straightReds,
        totalCards: data.yellows + data.straightReds,
      });
    }
    return rows.sort((a, b) => b.totalCards - a.totalCards || b.straightReds - a.straightReds).slice(0, 10);
  }, [dqdMatchData, idMap, shortToTeam]);

  const highlightCards = useMemo(() => {
    const topScorer = (rankingBoards.goals || [])[0];
    const topAssist = (rankingBoards.assists || [])[0];
    const topCleanSheet = cleanSheetBoard[0];
    const topCard = cardBoard[0];
    return [
      topScorer ? { label: '射手王', icon: '⚽', cnName: topScorer.cnName, teamCn: topScorer.teamCn, value: `${topScorer.count}球` } : null,
      topAssist ? { label: '助攻王', icon: '🎯', cnName: topAssist.cnName, teamCn: topAssist.teamCn, value: `${topAssist.count}助` } : null,
      topCleanSheet ? { label: '零封王', icon: '🧤', cnName: topCleanSheet.cnName, teamCn: topCleanSheet.teamCn, value: `${topCleanSheet.count}场` } : null,
      topCard ? { label: '纪律榜第一', icon: '🟨', cnName: topCard.cnName, teamCn: topCard.teamCn, value: `${topCard.yellows}黄${topCard.straightReds > 0 ? `+${topCard.straightReds}红` : ''}` } : null,
    ].filter(Boolean) as { label: string; icon: string; cnName: string; teamCn: string; value: string }[];
  }, [rankingBoards, cleanSheetBoard, cardBoard]);

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshError(false);
    clearJsonCache('/data/dqd-');
    clearDqdPlayerMapCache();
    Promise.all([
      fetchJson<Record<string, Record<string, DqdPlayerStats>>>('/data/dqd-worldcup-stats.json', { force: true, maxAge: 10 * 60_000 }),
      fetchJson<Record<string, DqdMatchDetail>>('/data/dqd-match-details.json', { force: true, maxAge: 5 * 60_000 }),
    ])
      .then(([stats, matches]) => { setDqdStatsData(stats); setDqdMatchData(matches); })
      .catch(() => setRefreshError(true))
      .finally(() => setRefreshing(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">数据榜
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center rounded-lg border border-slate-300 dark:border-white/10 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-50 transition"
            title="刷新数据"
          >
            <svg className={`mr-1 h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 0 1 10.47-4M14 8a6 6 0 0 1-10.47 4" strokeLinecap="round"/><path d="M2 2v4h4M14 14v-4h-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {refreshing ? '刷新中' : '刷新'}
          </button>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          进攻 · 传球 · 过人 · 防守 · 争顶 · 门将 · 纪律 — 共{SECTIONS.length}类
        </p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">点击下方类别展开查看详情</p>
        {refreshError && <p className="mt-1 text-xs text-red-500">刷新失败，请稍后重试</p>}
      </div>

      {highlightCards.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {highlightCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4">
              <span className="text-lg">{card.icon}</span>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{card.cnName}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{card.teamCn} · {card.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading && <LoadingState label="加载数据" />}

      {SECTIONS.map((section) => {
        const isExpanded = !!expanded[section.key];

        return (
          <section
            key={section.key}
            className={`rounded-xl border border-l-4 ${section.accent} border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/5`}
          >
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <h3 className="text-lg font-bold">
                {section.title}
                <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                  ({section.categories.length} 项)
                </span>
              </h3>
              <span className={`text-slate-500 dark:text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isExpanded && (
              <div className="space-y-4 px-5 pb-5">
                {section.key === 'goalkeeper' && cleanSheetBoard.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">零封 · Top 10</h4>
                    <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">仅统计首发门将所在球队零封对手的场次</p>
                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span className="w-8 text-center">#</span>
                        <span className="flex-1">球员</span>
                        <span className="w-16 text-right">零封</span>
                      </div>
                      {cleanSheetBoard.map((player, idx) => (
                        <Link
                          key={`cs-${player.team}-${player.enName}`}
                          to={`/players/${player.team}/${encodeURIComponent(player.enName)}`}
                          className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2.5 transition hover:bg-slate-200 dark:hover:bg-white/[0.04] last:border-b-0"
                        >
                          <span className="w-8 text-center font-mono text-sm tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                          <img
                            src={player.olgIcon}
                            alt={player.team}
                            className="h-5 w-5 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{player.cnName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{player.teamCn}</p>
                          </div>
                          <span className="w-16 text-right text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-300">{player.count}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {section.key === 'discipline' && cardBoard.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">纪律榜 Top 10</h4>
                    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span className="w-8 text-center">#</span>
                        <span className="flex-1">球员</span>
                        <span className="w-10 text-center">黄牌</span>
                        <span className="w-10 text-center">直红</span>
                        <span className="w-12 text-right">总计</span>
                      </div>
                      {cardBoard.map((player, idx) => (
                        <Link
                          key={`card-${player.team}-${player.enName}`}
                          to={`/players/${player.team}/${encodeURIComponent(player.enName)}`}
                          className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2.5 transition hover:bg-slate-200 dark:hover:bg-white/[0.04] last:border-b-0"
                        >
                          <span className="w-8 text-center font-mono text-sm tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                          <img
                            src={player.olgIcon}
                            alt={player.team}
                            className="h-5 w-5 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{player.cnName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{player.teamCn}</p>
                          </div>
                          <span className="w-10 text-center font-mono text-sm tabular-nums text-amber-600 dark:text-amber-300">{player.yellows}</span>
                          <span className="w-10 text-center font-mono text-sm tabular-nums text-red-600 dark:text-red-400">{player.straightReds}</span>
                          <span className="w-12 text-right text-sm font-bold tabular-nums text-red-600 dark:text-red-300">{player.totalCards}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {section.categories.map((cat) => {
                  const board = rankingBoards[cat] || [];
                  const sliced = board.slice(0, section.topN);
                  if (sliced.length === 0) return null;
                  return (
                    <div key={cat}>
                      <h4 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {CATEGORY_LABELS[cat] || cat} · Top {section.topN}
                      </h4>
                      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <span className="w-8 text-center">#</span>
                          <span className="flex-1">球员</span>
                          <span className="w-20 text-right">{CATEGORY_LABELS[cat] || cat}</span>
                        </div>
                        {sliced.map((player, idx) => (
                          <Link
                            key={`${cat}-${player.team}-${player.enName}`}
                            to={`/players/${player.team}/${encodeURIComponent(player.enName)}`}
                            className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 px-4 py-2.5 transition hover:bg-slate-200 dark:hover:bg-white/[0.04] last:border-b-0"
                          >
                            <span className="w-8 text-center font-mono text-sm tabular-nums text-slate-400 dark:text-slate-500">{idx + 1}</span>
                            <img
                              src={player.olgIcon}
                              alt={player.team}
                              className="h-5 w-5 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{player.cnName}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">{player.teamCn}</p>
                            </div>
                            <span className={`w-20 text-right text-sm font-bold tabular-nums ${section.countColor}`}>
                              {formatCount(cat, player.count)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
