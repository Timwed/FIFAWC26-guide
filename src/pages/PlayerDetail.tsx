import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import squadsData from '../data/squads.json';
import teamsData from '../data/teams.json';
import { lookupPlayerByExactName } from '../utils/playerLookup';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  group: string;
  olgIcon: string;
}

interface SquadEntry {
  name: string;
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

interface WikiPlayer {
  fullName: string;
  position: string;
  currentClub: string;
  nationalTeam?: string;
  nationalCaps: number;
  nationalGoals: number;
  image: string;
  clubCareer: { years: string; club: string; apps?: number; goals?: number }[] | null;
  careerReview: string;
  wcSpotlight: string;
}

const teams = teamsData as TeamEntry[];

const POSITION_LABELS: Record<string, string> = {
  GK: '守门员', DF: '后卫', MF: '中场', FW: '前锋',
};

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400',
  DF: 'bg-green-500/20 text-green-400',
  MF: 'bg-blue-500/20 text-blue-400',
  FW: 'bg-red-500/20 text-red-400',
};

export default function PlayerDetail() {
  const { teamCode, playerName } = useParams<{ teamCode: string; playerName: string }>();
  const [wikiPlayers, setWikiPlayers] = useState<Record<string, WikiPlayer> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (teamCode) {
      fetch(`/data/players-wiki/${teamCode.toUpperCase()}.json`)
        .then((res) => res.json())
        .then((data) => { if (!cancelled) setWikiPlayers(data); })
        .catch(() => { if (!cancelled) setWikiPlayers({}); });
    }
    return () => { cancelled = true; };
  }, [teamCode]);

  const decodedName = useMemo(() => decodeURIComponent(playerName || ''), [playerName]);
  const team = useMemo(
    () => teams.find((t) => t.shortName.toUpperCase() === teamCode?.toUpperCase()),
    [teamCode]
  );
  const squad = useMemo(
    () => team ? (squadsData as SquadEntry[]).find((s) => s.name.toLowerCase() === team.enName.toLowerCase()) : null,
    [team]
  );
  const player = useMemo(
    () => squad?.players.find((p) => p.name === decodedName),
    [squad, decodedName]
  );
  const wiki = useMemo(
    () => (wikiPlayers != null ? wikiPlayers[decodedName] ?? null : null),
    [decodedName, wikiPlayers]
  );

  if (!team || !player) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-slate-400">未找到球员</p>
        <Link to="/teams" className="text-sm text-sky-400 hover:text-sky-300">
          ← 返回球队列表
        </Link>
      </div>
    );
  }

  const teamCnName = team.cnName;
  const initials = player.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const info = lookupPlayerByExactName(player.name);
  const cnName = info?.cnName || null;

  return (
    <div className="space-y-8">
      <Link to={`/teams/${team.shortName}`} className="text-sm text-sky-400 hover:text-sky-300">
        ← {teamCnName}大名单
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {wiki?.image ? (
          <img
            src={wiki.image}
            alt={player.name}
            className="h-40 w-40 shrink-0 rounded-2xl border-2 border-white/10 object-cover md:h-48 md:w-48"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-5xl font-bold text-white/50 md:h-48 md:w-48">
            {initials}
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-extrabold">
              {cnName || player.name}
            </h2>
            <span className="text-2xl font-bold text-sky-400">#{player.number}</span>
          </div>
          {cnName && (
            <p className="text-base text-slate-400">{wiki?.fullName || player.name}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded px-2 py-0.5 font-medium ${POSITION_COLORS[player.position] || 'bg-white/10 text-slate-400'}`}>
              {POSITION_LABELS[player.position] || player.position}
            </span>
            <span className="text-slate-400">{teamCnName} &middot; {team.group}组</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Stat label="年龄" value={`${player.age}岁`} />
            <Stat label="国家队出场" value={`${wiki?.nationalCaps || player.caps}场`} />
            <Stat label="国家队进球" value={`${wiki?.nationalGoals || player.goals}球`} />
            <Stat label="俱乐部" value={wiki?.currentClub || player.club} />
          </div>
        </div>
      </div>

      {/* Career Review */}
      {wiki?.careerReview && (
        <section className="rounded-xl border border-l-4 border-l-sky-500 border-white/5 bg-white/5 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            生涯回顾
          </h3>
          <p className="leading-relaxed text-slate-300">{wiki.careerReview}</p>
        </section>
      )}

      {/* WC Spotlight */}
      {wiki?.wcSpotlight && (
        <section className="rounded-xl border border-l-4 border-l-amber-500 border-white/5 bg-white/5 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
            本届看点
          </h3>
          <p className="leading-relaxed text-slate-300">{wiki.wcSpotlight}</p>
        </section>
      )}

      <div className="flex justify-center">
        <Link
          to={`/teams/${team.shortName}`}
          className="rounded-lg bg-sky-500/10 px-6 py-2 text-sm text-sky-400 transition hover:bg-sky-500/20"
        >
          返回{teamCnName}全部球员
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-white">{value}</p>
    </div>
  );
}
