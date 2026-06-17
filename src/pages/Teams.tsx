import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import teamsData from '../data/teams.json';

interface TeamEntry {
  shortName: string;
  enName: string;
  cnName: string;
  cnExtract: string;
  group: string;
  olgId: number | null;
  olgIcon: string;
  olgName: string;
  playerCount: number;
}

const teams = teamsData as TeamEntry[];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

export default function Teams() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  const filtered = useMemo(() => {
    return teams.filter((t) => {
      const matchSearch =
        !search ||
        t.cnName.includes(search) ||
        t.enName.toLowerCase().includes(search.toLowerCase()) ||
        t.shortName.toLowerCase().includes(search.toLowerCase());
      const matchGroup = selectedGroup === 'All' || t.group === selectedGroup;
      return matchSearch && matchGroup;
    });
  }, [search, selectedGroup]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">参赛球队</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="搜索球队..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:w-64"
          />
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedGroup('All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedGroup === 'All' ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              全部
            </button>
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedGroup === g ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {g}组
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-400">
        找到 {filtered.length} 支球队（48支球队，12个小组）
      </p>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((team) => (
          <Link
            key={team.shortName}
            to={`/teams/${team.shortName}`}
            className="group rounded-xl border border-white/5 bg-white/5 p-5 transition hover:border-sky-500/30 hover:bg-sky-500/5"
          >
            <div className="flex items-center gap-4">
              <img
                src={team.olgIcon}
                alt={team.enName}
                className="h-14 w-14 object-contain transition group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold">{team.cnName}</h3>
                <p className="text-sm text-slate-400">{team.enName}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-sky-400">
                    {team.group}组
                  </span>
                  <span>{team.playerCount}名球员</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
