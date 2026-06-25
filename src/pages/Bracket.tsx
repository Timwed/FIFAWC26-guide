import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildAllMatches, type BracketMatch, R32_VISUAL, R16_VISUAL, QF_VISUAL, SF_VISUAL } from '../data/bracket';
import { formatBeijingTime } from '../utils/datetime';
import { computeGroupStandings, computeThirdPlaceRanking, resolveThirdPlaceSlot } from '../utils/standings';
import { useLiveScorePatches } from '../utils/liveScores';
import { mergeMatchPatches } from '../utils/matchMerge';
import type { StandingsMatch } from '../utils/standings';
import { getAllScheduleMatches } from '../utils/schedule';
import teamsData from '../data/teams.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

const teams = teamsData as TeamEntry[];

const teamFlagMap = new Map<string, string>();
const teamCnMap = new Map<string, string>();
const teamGroupMap = new Map<string, string>();
for (const t of teams) {
  teamFlagMap.set(t.enName, t.olgIcon);
  teamCnMap.set(t.enName, t.cnName);
  teamGroupMap.set(t.enName, t.group);
}

const ROUND_LABELS: Record<string, string> = {
  R32: '1/16 决赛', R16: '1/8 决赛', QF: '1/4 决赛', SF: '半决赛', '3P': '三四名', F: '决赛',
};

const staticMatches = getAllScheduleMatches<StandingsMatch & { idEvent: string }>();

export default function Bracket() {
  const bracketMatches = useMemo(() => buildAllMatches(), []);
  const livePatches = useLiveScorePatches();
  const liveStandings = useMemo(() => mergeMatchPatches(staticMatches, livePatches), [livePatches]);

  const matchMap = useMemo(() => {
    const m = new Map<string, BracketMatch>();
    for (const x of bracketMatches) m.set(x.id, x);
    return m;
  }, [bracketMatches]);

  const groupTeams = useMemo(() => {
    const s = computeGroupStandings(liveStandings);
    const map = new Map<string, string>();
    for (const g of s) {
      const grp = g.group;
      if (g.teams.length >= 1) map.set(`1${grp}`, g.teams[0].enName);
      if (g.teams.length >= 2) map.set(`2${grp}`, g.teams[1].enName);
    }
    return map;
  }, [liveStandings]);

  const thirdPlaceRanking = useMemo(
    () => computeThirdPlaceRanking(liveStandings),
    [liveStandings],
  );

  const resolveTeam = (match: BracketMatch, side: 'home' | 'away'): BracketMatch['homeTeam'] => {
    const slot = side === 'home' ? match.homeSlot : match.awaySlot;
    if (slot.startsWith('r32-') || slot.startsWith('r16-') || slot.startsWith('qf-') || slot.startsWith('sf-')) {
      const prev = matchMap.get(slot);
      if (prev?.winner) {
        if (match.round === '3P') {
          return prev.winner === 'home' ? prev.awayTeam : prev.homeTeam;
        }
        return prev.winner === 'home' ? prev.homeTeam : prev.awayTeam;
      }
      return null;
    }
    const groupMatch = slot.match(/^([12])([A-L])$/);
    if (groupMatch) return groupTeams.get(slot) || null;
    if (slot === '3rd*') {
      const label = side === 'home' ? match.homeLabel : match.awayLabel;
      const groups = (label.match(/[A-L]/g) || []);
      return resolveThirdPlaceSlot(groups, thirdPlaceRanking)?.enName || null;
    }
    return null;
  };

  const formatTeam = (enName: string | null) => {
    if (!enName) return { cn: '待定', flag: '', code: '' };
    const cn = teamCnMap.get(enName) || enName;
    const flag = teamFlagMap.get(enName) || '';
    const teamEntry = teams.find((t) => t.enName === enName);
    return { cn, flag, code: teamEntry?.shortName || '' };
  };

  const getGrouped = (round: string): BracketMatch[][] => {
    const ms = bracketMatches.filter((m) => m.round === round);
    if (round === 'R32') {
      const groups: BracketMatch[][] = [];
      for (let i = 0; i < R32_VISUAL.length; i += 2) {
        const a = ms.find((m) => m.id === R32_VISUAL[i]);
        const b = ms.find((m) => m.id === R32_VISUAL[i + 1]);
        if (a && b) groups.push([a, b]);
      }
      return groups;
    }
    if (round === 'R16') {
      const groups: BracketMatch[][] = [];
      for (let i = 0; i < R16_VISUAL.length; i += 2) {
        const a = ms.find((m) => m.id === R16_VISUAL[i]);
        const b = ms.find((m) => m.id === R16_VISUAL[i + 1]);
        if (a && b) groups.push([a, b]);
      }
      return groups;
    }
    if (round === 'QF') {
      const groups: BracketMatch[][] = [];
      for (let i = 0; i < QF_VISUAL.length; i += 2) {
        const a = ms.find((m) => m.id === QF_VISUAL[i]);
        const b = ms.find((m) => m.id === QF_VISUAL[i + 1]);
        if (a && b) groups.push([a, b]);
      }
      return groups;
    }
    if (round === 'SF') {
      const groups: BracketMatch[][] = [];
      for (let i = 0; i < SF_VISUAL.length; i += 2) {
        const a = ms.find((m) => m.id === SF_VISUAL[i]);
        const b = ms.find((m) => m.id === SF_VISUAL[i + 1]);
        if (a && b) groups.push([a, b]);
      }
      return groups;
    }
    return [ms];
  };

  const hasWinners = (matchIds: string[]): boolean => {
    return matchIds.some((id) => {
      const m = matchMap.get(id);
      return m && m.winner !== null;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">淘汰赛对阵图</h2>
         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          小组赛结束后自动填充。标注 * 的第三名队伍取决于各组第三名出线组合。
        </p>
      </div>

      {/* Desktop bracket */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="flex gap-4 min-w-[1100px] justify-center pb-4">
          {(['R32', 'R16', 'QF', 'SF', '3P+F'] as const).map((stage) => {
            if (stage === '3P+F') {
              const third = bracketMatches.find((m) => m.id === '3p-103');
              const final = bracketMatches.find((m) => m.id === 'f-104');
              return (
                <div key="final" className="flex flex-col justify-center gap-8 w-[210px] shrink-0">
                  {final && <MatchCard match={final} resolveTeam={resolveTeam} formatTeam={formatTeam}  />}
                  {third && <MatchCard match={third} resolveTeam={resolveTeam} formatTeam={formatTeam}  compact />}
                </div>
              );
            }

            const groups = getGrouped(stage);
            return (
              <div key={stage} className="flex flex-col justify-center gap-12 w-[210px] shrink-0">
                <div className="text-center text-xs font-semibold uppercase tracking-widest text-sky-400 mb-2">
                  {ROUND_LABELS[stage] || stage}
                </div>
                {groups.map((group, gi) => (
                  <div key={gi} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.02]">
                    {hasWinners(group.map((m) => m.id)) && (
                      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
                        {feedLabel(matchMap, group[0])}
                      </div>
                    )}
                    {group.map((m) => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        resolveTeam={resolveTeam}
                        formatTeam={formatTeam}
                        compact
                      />
                    ))}
                    {!hasWinners(group.map((m) => m.id)) && (
                      <div className="text-center text-[10px] text-slate-500 dark:text-slate-600">
                        {feedLabel(matchMap, group[0])}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: round-by-round */}
      <div className="lg:hidden space-y-4">
        {(['R32', 'R16', 'QF', 'SF', '3P', 'F'] as const).map((round) => {
          const ms = bracketMatches.filter((m) => m.round === round);
          if (ms.length === 0) return null;
          return (
            <section key={round} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-400">
                {ROUND_LABELS[round]}
              </h3>
              <div className="space-y-2">
                {ms.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    resolveTeam={resolveTeam}
                    formatTeam={formatTeam}
                    compact
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="text-center">
        <Link to="/schedule" className="text-sm text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300">
          查看完整赛程 →
        </Link>
      </div>
    </div>
  );
}

function feedLabel(map: Map<string, BracketMatch>, m: BracketMatch): string {
  if (!m.feedsInto) return '';
  const target = map.get(m.feedsInto);
  if (!target) return '';
  const rl = ROUND_LABELS[target.round] || target.round;
  const mStr = target.round === '3P' ? ' (败者)' : target.round === 'F' ? ' (胜者)' : '';
  return `→ ${rl}${mStr}`;
}

function MatchCard({
  match,
  resolveTeam,
  formatTeam,
  compact,
}: {
  match: BracketMatch;
  resolveTeam: (m: BracketMatch, side: 'home' | 'away') => string | null;
  formatTeam: (en: string | null) => { cn: string; flag: string; code: string };
  compact?: boolean;
}) {
  const homeTeam = resolveTeam(match, 'home');
  const awayTeam = resolveTeam(match, 'away');
  const h = formatTeam(homeTeam);
  const a = formatTeam(awayTeam);
  const bjTime = formatBeijingTime(match.dateEvent, match.strTime);

  const finished = match.winner !== null;
  const homeWin = match.winner === 'home';
  const awayWin = match.winner === 'away';

  return (
    <div className={`rounded border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/[0.03] ${
      compact ? 'px-2 py-1.5' : 'px-3 py-2.5'
    }`}>
      {/* Home team */}
      <div className="flex items-center gap-1.5">
        {h.flag ? (
          <img src={h.flag} alt="" className="h-4 w-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="h-4 w-4 rounded-full bg-slate-300 dark:bg-white/10" />
        )}
        <span className={`text-xs flex-1 truncate ${homeWin ? 'font-bold text-slate-900 dark:text-white' : h.code ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
          {h.code ? (
            <Link to={`/teams/${h.code}`} className="hover:text-sky-400">
              {h.cn}
            </Link>
          ) : (
            h.cn || match.homeLabel
          )}
        </span>
        {finished && (
          <span className={`text-xs tabular-nums font-bold ${homeWin ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
            {match.homeScore}
          </span>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-1.5">
        {a.flag ? (
          <img src={a.flag} alt="" className="h-4 w-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="h-4 w-4 rounded-full bg-slate-300 dark:bg-white/10" />
        )}
        <span className={`text-xs flex-1 truncate ${awayWin ? 'font-bold text-slate-900 dark:text-white' : a.code ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
          {a.code ? (
            <Link to={`/teams/${a.code}`} className="hover:text-sky-400">
              {a.cn}
            </Link>
          ) : (
            a.cn || match.awayLabel
          )}
        </span>
        {finished && (
          <span className={`text-xs tabular-nums font-bold ${awayWin ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
            {match.awayScore}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
        <span>{bjTime}</span>
        <span>{match.venue}</span>
      </div>
    </div>
  );
}
