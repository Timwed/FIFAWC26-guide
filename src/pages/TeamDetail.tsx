import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import teamsData from '../data/teams.json';
import squadsData from '../data/squads.json';
import wikiTeamsData from '../data/wiki-teams.json';
import scheduleData from '../data/venue-schedule.json';
import { buildOpenLigaGoals, mergeMatchPatches } from '../utils/matchMerge';
import { fetchMatchScorePatches, fetchOpenLigaMatches, findOpenLigaMatch } from '../utils/matchData';
import type { MatchScorePatch } from '../utils/matchMerge';
import { formatBeijingTime } from '../utils/datetime';
import { lookupPlayerByExactName } from '../utils/playerLookup';
import type { MatchEvent, StaticGoal } from '../types';
import type { OpenLigaMatch } from '../api/openligadb';

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

  const [liveMap, setLiveMap] = useState<Map<string, MatchScorePatch>>(new Map());
  const [openLigaMatches, setOpenLigaMatches] = useState<OpenLigaMatch[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchMatchScorePatches().then((patches) => {
      if (cancelled) return;
      setLiveMap(patches);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

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

  const [posFilter, setPosFilter] = useState('All');

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

  const positions = ['All', 'GK', 'DF', 'MF', 'FW'];
  const players = squad?.players || [];
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
            <span className="rounded bg-sky-500/20 px-2 py-1 text-sm text-sky-400">
              {team.group}组
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{team.enName}</p>
          {squad?.coach && (
            <p className="mt-2 text-sm text-slate-300">
              主教练: <span className="font-medium text-white">{squad.coach}</span>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{squad?.players.length || 0}名球员入选</span>
          </div>
        </div>
      </div>

      {(() => {
        const sections = parseCnExtract(team.cnExtract);
        if (sections.length > 0) {
          return (
            <section className="rounded-xl border border-white/5 bg-white/5 p-5">
              <h3 className="mb-4 text-lg font-bold">球队简介</h3>
              <div className="space-y-5">
                {sections.map((sec, i) => (
                  <div key={i}>
                    <h4 className="mb-1.5 text-sm font-bold text-sky-400">{sec.label}</h4>
                    <p className="leading-relaxed text-slate-300">{sec.body}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (wikiExtract) {
          return (
            <section className="rounded-xl border border-white/5 bg-white/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="text-lg font-bold">球队简介</h3>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                  Wikipedia
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">{wikiExtract}</p>
            </section>
          );
        }
        return null;
      })()}

      {teamMatches.length > 0 && (
        <section className="rounded-xl border border-white/5 bg-white/5 p-5">
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
                  className="block rounded-lg border border-white/5 bg-white/[0.03] p-4 transition hover:border-sky-500/20"
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
                    <span className="text-xs text-slate-500">
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
                          <span className="text-2xl font-bold tabular-nums text-white">
                            {m.intHomeScore ?? '-'}
                          </span>
                          <span className="text-slate-500">-</span>
                          <span className="text-2xl font-bold tabular-nums text-white">
                            {m.intAwayScore ?? '-'}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-slate-500">VS</span>
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
                    <div className="mt-3 flex gap-4 border-t border-white/5 pt-3">
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
                    ? 'bg-sky-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {pos === 'All' ? '全部' : POSITION_LABELS[pos] || pos}
              </button>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="text-sm text-slate-500">暂无球员数据</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlayers.map((player, idx) => (
              <PlayerCard key={idx} player={player} teamCode={team.shortName} />
            ))}
          </div>
        )}
      </section>
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
      className="rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-sky-500/30 hover:bg-sky-500/5 cursor-pointer block"
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
            <span className="shrink-0 text-xs text-slate-500">#{player.number}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {cnName && (
              <span className="text-slate-500">{player.name}</span>
            )}
            <span className={`rounded px-2 py-0.5 ${POSITION_COLORS[player.position] || 'bg-white/10 text-slate-400'}`}>
              {POSITION_LABELS[player.position] || player.position}
            </span>
            {player.club && <span className="text-slate-500">{player.club}</span>}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-4 border-t border-white/5 pt-3 text-xs text-slate-400">
        <span>{player.age}岁</span>
        <span>{player.caps}场</span>
        <span>{player.goals}球</span>
      </div>
    </Link>
  );
}
