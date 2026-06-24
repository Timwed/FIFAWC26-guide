import { useCallback, useMemo, useState } from 'react';
import { buildAllMatches, type BracketMatch, R32_VISUAL, R16_VISUAL, QF_VISUAL, SF_VISUAL } from '../data/bracket';
import teamsData from '../data/teams.json';
import { getStorageJson, removeStorageItem, setStorageJson } from '../utils/storage';

const STORAGE_RANK = 'bracket_group_rank';
const STORAGE_THIRD = 'bracket_third_qual';
const STORAGE_WINNERS = 'bracket_predictions';
const STORAGE_CONFIRMED = 'bracket_rank_confirmed';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  olgIcon: string;
  group: string;
}

const teams = teamsData as TeamEntry[];
const teamByCode = new Map<string, TeamEntry>();
const teamsByGroup = new Map<string, TeamEntry[]>();
for (const t of teams) {
  teamByCode.set(t.shortName, t);
  const g = teamsByGroup.get(t.group) || [];
  g.push(t);
  teamsByGroup.set(t.group, g);
}
const GROUP_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const ROUND_LABELS: Record<string, string> = { R32: '1/16 决赛', R16: '1/8 决赛', QF: '1/4 决赛', SF: '半决赛', '3P': '三四名', F: '决赛' };

type GroupRank = Record<string, string[]>;

function loadRank(): GroupRank {
  return getStorageJson<GroupRank>(STORAGE_RANK, {});
}
function loadThirdQ(): string[] {
  return getStorageJson<string[]>(STORAGE_THIRD, []);
}
function loadWinners(): Record<string, string> {
  return getStorageJson<Record<string, string>>(STORAGE_WINNERS, {});
}

function parseThirdEligible(label: string): string[] {
  const m = label.match(/3rd\s+([A-L](?:\/[A-L])*)/);
  if (!m) return [];
  return m[1].split('/');
}

function assignThirds(qualifyingGroups: string[], bracketMatches: BracketMatch[]): Record<string, string> {
  const thirdSlots: { matchId: string; side: 'home' | 'away'; eligible: string[] }[] = [];
  for (const m of bracketMatches) {
    for (const side of ['home', 'away'] as const) {
      const slot = side === 'home' ? m.homeSlot : m.awaySlot;
      if (slot === '3rd*') {
        const label = side === 'home' ? m.homeLabel : m.awayLabel;
        thirdSlots.push({ matchId: m.id, side, eligible: parseThirdEligible(label) });
      }
    }
  }
  const assignment: Record<string, string> = {};
  const used = new Set<string>();
  const sortedQual = [...qualifyingGroups].sort();
  for (const g of sortedQual) {
    const slot = thirdSlots.find((s) => s.eligible.includes(g) && !used.has(s.matchId + s.side));
    if (slot) {
      assignment[`${slot.matchId}:${slot.side}`] = g;
      used.add(slot.matchId + slot.side);
    }
  }
  return assignment;
}

export default function BracketPredict() {
  const bracketMatches = useMemo(() => buildAllMatches(), []);
  const matchMap = useMemo(() => { const map = new Map<string, BracketMatch>(); for (const m of bracketMatches) map.set(m.id, m); return map; }, [bracketMatches]);

  const [step, setStep] = useState<'groups' | 'knockout'>('groups');
  const [rank, setRank] = useState<GroupRank>(() => loadRank());
  const [rankConfirmed, setRankConfirmed] = useState<boolean>(() => getStorageJson<boolean>(STORAGE_CONFIRMED, false));
  const [thirdQ, setThirdQ] = useState<string[]>(() => loadThirdQ());
  const [predictions, setPredictions] = useState<Record<string, string>>(() => loadWinners());

  const persistRank = useCallback((next: GroupRank) => { setRank(next); setStorageJson(STORAGE_RANK, next); }, []);
  const persistThirdQ = useCallback((next: string[]) => { setThirdQ(next); setStorageJson(STORAGE_THIRD, next); }, []);
  const persistPreds = useCallback((next: Record<string, string>) => { setPredictions(next); setStorageJson(STORAGE_WINNERS, next); }, []);

  const slotPicks = useMemo(() => {
    const slots: Record<string, string> = {};
    for (const g of GROUP_ORDER) {
      const order = rank[g];
      if (order?.[0]) slots[`1${g}`] = order[0];
      if (order?.[1]) slots[`2${g}`] = order[1];
    }
    if (thirdQ.length === 8) {
      const thirdAssign = assignThirds(thirdQ, bracketMatches);
      Object.assign(slots, thirdAssign);
    }
    return slots;
  }, [rank, thirdQ, bracketMatches]);

  const [dragGroup, setDragGroup] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overGroup, setOverGroup] = useState<string | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = useCallback((group: string, idx: number) => {
    setDragGroup(group);
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);

  const handleDragEnter = useCallback((group: string, idx: number) => {
    setOverGroup(group);
    setOverIdx(idx);
  }, []);

  const handleDragLeave = useCallback(() => {
    setOverGroup(null);
    setOverIdx(null);
  }, []);

  const handleDrop = useCallback((group: string, idx: number) => {
    if (dragGroup === null || dragIdx === null) return;
    const fromOrder = rank[dragGroup] || teamsByGroup.get(dragGroup)!.map((t) => t.shortName);
    if (dragGroup === group) {
      const next = [...fromOrder];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      persistRank({ ...rank, [group]: next });
    } else {
      const toOrder = rank[group] || teamsByGroup.get(group)!.map((t) => t.shortName);
      const fromNext = [...fromOrder];
      const toNext = [...toOrder];
      const [moved] = fromNext.splice(dragIdx, 1);
      toNext.splice(idx, 0, moved);
      persistRank({ ...rank, [dragGroup]: fromNext, [group]: toNext });
    }
    setDragGroup(null);
    setDragIdx(null);
    setOverGroup(null);
    setOverIdx(null);
  }, [rank, dragGroup, dragIdx, persistRank]);

  const handleDragEnd = useCallback(() => {
    setDragGroup(null);
    setDragIdx(null);
    setOverGroup(null);
    setOverIdx(null);
  }, []);

  const handleConfirmRank = useCallback(() => {
    setRankConfirmed(true);
    setStorageJson(STORAGE_CONFIRMED, true);
  }, []);

  const handleToggleThird = useCallback((group: string) => {
    const current = thirdQ.includes(group)
      ? thirdQ.filter((g) => g !== group)
      : thirdQ.length < 8 ? [...thirdQ, group] : thirdQ;
    persistThirdQ(current);
    if (current.length === 8 && step === 'groups') {
      setTimeout(() => setStep('knockout'), 400);
    }
  }, [thirdQ, persistThirdQ, step]);

  const resolveTeam = useCallback((match: BracketMatch, side: 'home' | 'away'): TeamEntry | null => {
    const slot = side === 'home' ? match.homeSlot : match.awaySlot;
    const isGroupOrThird = /^[12][A-L]$/.test(slot) || slot === '3rd*';
    if (isGroupOrThird) {
      const key = slot === '3rd*' ? `${match.id}:${side}` : slot;
      const code = slotPicks[key];
      if (code && code.length <= 3 && !teamByCode.has(code)) {
        const g = code;
        const gOrder = rank[g];
        return gOrder?.[2] ? teamByCode.get(gOrder[2]) ?? null : null;
      }
      return code ? teamByCode.get(code) ?? null : null;
    }
    if (match.round === '3P') {
      const getSfLoser = (sfId: string): TeamEntry | null => {
        const sfMatch = matchMap.get(sfId);
        if (!sfMatch) return null;
        const sfWinner = predictions[sfId];
        const homePred = predictions[sfMatch.homeSlot];
        const awayPred = predictions[sfMatch.awaySlot];
        const homeTeam = homePred ? teamByCode.get(homePred) ?? null : null;
        const awayTeam = awayPred ? teamByCode.get(awayPred) ?? null : null;
        if (homeTeam && awayTeam) return sfWinner === homeTeam.shortName ? awayTeam : homeTeam;
        return null;
      };
      return side === 'home' ? getSfLoser('sf-101') : getSfLoser('sf-102');
    }
    const winner = predictions[slot];
    return winner ? teamByCode.get(winner) ?? null : null;
  }, [slotPicks, predictions, matchMap, rank]);

  const getDownstreamIds = useCallback((matchId: string): string[] => {
    const ids: string[] = [];
    const queue = [matchId];
    while (queue.length > 0) {
      const id = queue.shift()!;
      for (const m of bracketMatches) {
        if ((m.homeSlot === id || m.awaySlot === id) && !ids.includes(m.id)) { ids.push(m.id); queue.push(m.id); }
      }
    }
    return ids;
  }, [bracketMatches]);

  const handleToggleWinner = (matchId: string, teamCode: string) => {
    const current = predictions[matchId];
    const next = { ...predictions };
    if (current === teamCode) { delete next[matchId]; const ds = getDownstreamIds(matchId); for (const id of ds) delete next[id]; }
    else { next[matchId] = teamCode; }
    persistPreds(next);
  };

  const handleReset = () => {
    if (!window.confirm('确定要清除所有预测吗？')) return;
    setRank({}); setRankConfirmed(false); setThirdQ([]); setPredictions({});
    removeStorageItem(STORAGE_RANK); removeStorageItem(STORAGE_CONFIRMED); removeStorageItem(STORAGE_THIRD); removeStorageItem(STORAGE_WINNERS);
  };

  const getGrouped = (round: string): BracketMatch[][] => {
    const ms = bracketMatches.filter((m) => m.round === round);
    const orderMap: Record<string, string[]> = { R32: R32_VISUAL, R16: R16_VISUAL, QF: QF_VISUAL, SF: SF_VISUAL };
    const visual = orderMap[round];
    if (!visual) return [ms];
    const groups: BracketMatch[][] = [];
    for (let i = 0; i < visual.length; i += 2) {
      const a = ms.find((m) => m.id === visual[i]); const b = ms.find((m) => m.id === visual[i + 1]);
      if (a && b) groups.push([a, b]);
    }
    return groups;
  };

  const groupsCompleted = GROUP_ORDER.filter((g) => (rank[g] || teamsByGroup.get(g)!.map((t) => t.shortName)).length === 4).length;
  const pickCount = Object.keys(predictions).length;
  const thirdTeams = useMemo(() => GROUP_ORDER.map((g) => ({ group: g, team: (rank[g]?.[2]) ? teamByCode.get(rank[g][2]) : null })).filter((t) => t.team), [rank]);

  const renderMatchCard = (match: BracketMatch) => (
    <PredMatchCard key={match.id} match={match} resolveTeam={resolveTeam} predictions={predictions} onToggleWinner={handleToggleWinner} />
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">世界杯竞猜</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {step === 'groups' ? `已完成 ${groupsCompleted}/12 个小组排名 · 已选 ${thirdQ.length}/8 个小组第三` : `已预测 ${pickCount} 场淘汰赛胜者`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-100 dark:bg-white/5 p-0.5">
            <button onClick={() => setStep('groups')} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${step === 'groups' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}>1. 小组排名</button>
            <button onClick={() => setStep('knockout')} className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${step === 'knockout' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}>2. 淘汰赛</button>
          </div>
          <button onClick={handleReset} className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm text-slate-500 hover:text-red-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">重置</button>
        </div>
      </div>

      {step === 'groups' ? (
        <>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-sm text-slate-600 dark:text-slate-300">
            {!rankConfirmed
              ? '拖动球队排列每组 1-4 名，完成后点击「确认排名」。'
              : '排名已确认。从 12 个小组第三中选出 8 支晋级球队，选完自动跳转淘汰赛。'}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {GROUP_ORDER.map((g) => {
              const order = rank[g] || teamsByGroup.get(g)!.map((t) => t.shortName);
              const done = order.length === 4;
              const rankLabels = ['1', '2', '3', '4'];
              const rankColors = ['text-emerald-400 bg-emerald-500/15', 'text-amber-400 bg-amber-500/15', 'text-sky-400 bg-sky-500/15', 'text-slate-400 bg-slate-500/15'];
              return (
                <div key={g} className={`rounded-xl border p-3 ${done ? 'border-emerald-500/30' : 'border-slate-200 dark:border-white/10'} bg-slate-50 dark:bg-white/5`}>
                  <h4 className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">{g} 组</h4>
                  <div className="space-y-1">
                    {order.map((code, i) => {
                      const team = teamByCode.get(code);
                      if (!team) return null;
                      const isDragging = dragGroup === g && dragIdx === i;
                      const isOver = overGroup === g && overIdx === i && !isDragging;
                      return (
                        <div
                          key={code}
                          draggable
                          onDragStart={() => handleDragStart(g, i)}
                          onDragOver={handleDragOver}
                          onDragEnter={() => handleDragEnter(g, i)}
                          onDragLeave={handleDragLeave}
                          onDrop={() => handleDrop(g, i)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1 cursor-grab active:cursor-grabbing transition-all ${
                            isDragging ? 'opacity-30 scale-95' : isOver ? 'border-t-2 border-sky-400 pt-2' : 'hover:bg-slate-200/50 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${rankColors[i]}`}>{rankLabels[i]}</span>
                          <img src={team.olgIcon} alt="" className="h-5 w-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          <span className="flex-1 truncate text-xs text-slate-700 dark:text-slate-300">{team.cnName}</span>
                          <svg className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {groupsCompleted === 12 && !rankConfirmed && (
            <div className="flex justify-center">
              <button onClick={handleConfirmRank} className="rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400">确认排名</button>
            </div>
          )}

          {rankConfirmed && (
            <section className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 p-4 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">选择 8 支晋级的小组第三</h3>
                <span className={`text-xs ${thirdQ.length === 8 ? 'text-emerald-400' : 'text-slate-400'}`}>{thirdQ.length}/8</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {thirdTeams.map(({ group, team }) => {
                  const selected = thirdQ.includes(group);
                  return (
                    <button
                      key={group}
                      onClick={() => handleToggleThird(group)}
                      disabled={!selected && thirdQ.length >= 8}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition disabled:opacity-30 ${
                        selected ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-200 dark:border-white/10 hover:border-sky-500/30'
                      }`}
                    >
                      {team && <img src={team.olgIcon} alt="" className="h-5 w-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{team?.cnName || `${group}组第三`}</p>
                        <p className="text-[10px] text-slate-400">{group} 组第三</p>
                      </div>
                      {selected && <span className="text-xs text-emerald-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-white/10 dark:bg-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {groupsCompleted < 12 && `⚠ ${12 - groupsCompleted} 个小组未完成排名`}
              {groupsCompleted === 12 && thirdQ.length < 8 && `⚠ 需选择 8 支小组第三，已选 ${thirdQ.length}`}
              {groupsCompleted === 12 && thirdQ.length === 8 && '对阵图已自动生成，点击球队预测胜者'}
            </span>
            <button onClick={() => setStep('groups')} className="text-xs text-sky-400 hover:text-sky-300">← 返回小组排名</button>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <div className="flex gap-4 min-w-[1100px] justify-center pb-4">
              {(['R32', 'R16', 'QF', 'SF', 'F+3P'] as const).map((stage) => {
                if (stage === 'F+3P') {
                  const final = bracketMatches.find((m) => m.id === 'f-104');
                  const third = bracketMatches.find((m) => m.id === '3p-103');
                  return (
                    <div key="final" className="flex flex-col justify-center gap-8 w-[210px] shrink-0">
                      <div className="text-center text-xs font-semibold uppercase tracking-widest text-sky-400">{ROUND_LABELS.F}</div>
                      {final && renderMatchCard(final)}
                      <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mt-4">{ROUND_LABELS['3P']}</div>
                      {third && renderMatchCard(third)}
                    </div>
                  );
                }
                const round = stage as 'R32' | 'R16' | 'QF' | 'SF';
                const groups = getGrouped(round);
                const gap = round === 'R32' ? 'gap-6' : round === 'SF' ? 'gap-24' : round === 'QF' ? 'gap-12' : 'gap-6';
                return (
                  <div key={stage} className={`flex flex-col justify-center ${gap} w-[210px] shrink-0`}>
                    <div className="text-center text-xs font-semibold uppercase tracking-widest text-sky-400 mb-1">{ROUND_LABELS[round]}</div>
                    {groups.map((grp, gi) => (
                      <div key={gi} className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-white/[0.02]">
                        {grp.map((m) => renderMatchCard(m))}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {(['R32', 'R16', 'QF', 'SF', '3P', 'F'] as const).map((round) => {
              const ms = bracketMatches.filter((m) => m.round === round);
              if (ms.length === 0) return null;
              return (
                <section key={round} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-400">{ROUND_LABELS[round]}</h3>
                  <div className="space-y-2">{ms.map((m) => renderMatchCard(m))}</div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function PredMatchCard({ match, resolveTeam, predictions, onToggleWinner }: {
  match: BracketMatch;
  resolveTeam: (m: BracketMatch, side: 'home' | 'away') => TeamEntry | null;
  predictions: Record<string, string>;
  onToggleWinner: (matchId: string, teamCode: string) => void;
}) {
  const homeTeam = resolveTeam(match, 'home');
  const awayTeam = resolveTeam(match, 'away');
  const winner = predictions[match.id];
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-white/5 dark:bg-white/[0.03]">
      <TeamSlot team={homeTeam} label={match.homeLabel} isWinner={!!(homeTeam && winner === homeTeam.shortName)} clickable={!!homeTeam} onClick={() => homeTeam && onToggleWinner(match.id, homeTeam.shortName)} />
      <TeamSlot team={awayTeam} label={match.awayLabel} isWinner={!!(awayTeam && winner === awayTeam.shortName)} clickable={!!awayTeam} onClick={() => awayTeam && onToggleWinner(match.id, awayTeam.shortName)} />
      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500"><span>{match.venue}</span><span>{match.dateEvent}</span></div>
    </div>
  );
}

function TeamSlot({ team, label, isWinner, clickable, onClick }: {
  team: TeamEntry | null; label: string; isWinner: boolean; clickable: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={clickable ? onClick : undefined} disabled={!clickable} aria-pressed={isWinner}
      className={`flex w-full items-center gap-1.5 py-0.5 rounded text-left transition-all ${clickable ? 'cursor-pointer' : 'cursor-default'} ${isWinner ? '-mx-1 border border-emerald-500/50 bg-emerald-500/10 px-3 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : team ? 'px-2 opacity-50 hover:opacity-80' : 'px-2'}`}>
      {team ? (
        <>
          <img src={team.olgIcon} alt="" className="h-3.5 w-3.5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className={`text-xs flex-1 truncate ${isWinner ? 'font-bold text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{team.cnName}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">{team.shortName}</span>
        </>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-500 px-1 truncate">{label}</span>
      )}
    </button>
  );
}
