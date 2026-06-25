const BASE = 'https://api.openligadb.de';
const FETCH_TIMEOUT = 8000;

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(input, { cache: 'no-store', ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export interface OpenLigaGoal {
  goalID: number;
  scoreTeam1: number;
  scoreTeam2: number;
  matchMinute: number | null;
  goalGetterName: string;
  isPenalty: boolean;
  isOwnGoal: boolean;
  isOvertime: boolean;
  comment: string | null;
}

export interface OpenLigaMatchResult {
  resultName: string;
  pointsTeam1: number;
  pointsTeam2: number;
  resultTypeID: number;
}

export interface OpenLigaTeam {
  teamId: number;
  teamName: string;
  shortName: string;
  teamIconUrl: string;
}

export interface OpenLigaGroup {
  groupName: string;
  groupOrderID: number;
  groupID: number;
}

export interface OpenLigaMatch {
  matchID: number;
  matchDateTime: string;
  matchDateTimeUTC: string;
  leagueShortcut: string;
  group: OpenLigaGroup;
  team1: OpenLigaTeam;
  team2: OpenLigaTeam;
  matchIsFinished: boolean;
  matchResults: OpenLigaMatchResult[];
  goals: OpenLigaGoal[];
  numberOfViewers: number | null;
  location: string | null;
}

export interface OpenLigaGroupTableTeam {
  teamInfoId: number;
  teamName: string;
  shortName: string;
  teamIconUrl: string;
  points: number;
  opponentGoals: number;
  goals: number;
  matches: number;
  won: number;
  lost: number;
  draw: number;
}

export interface OpenLigaGroupTable {
  groupName: string;
  groupOrderID: number;
  groupID: number;
  teamInfoEntries: OpenLigaGroupTableTeam[];
}

export async function fetchMatchday(
  matchday: number = 1
): Promise<OpenLigaMatch[]> {
  try {
    const res = await fetchWithTimeout(`${BASE}/getmatchdata/wm26/2026/${matchday}`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchAllMatches(): Promise<OpenLigaMatch[]> {
  try {
    const res = await fetchWithTimeout(`${BASE}/getmatchdata/wm26/2026`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchGroupTables(): Promise<OpenLigaGroupTable[]> {
  try {
    const res = await fetchWithTimeout(`${BASE}/getbltable/wm26/2026`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchMatchGoals(matchId: number): Promise<OpenLigaMatch | null> {
  try {
    const res = await fetchWithTimeout(`${BASE}/getmatchdata/${matchId}`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchCurrentMatchday(): Promise<OpenLigaMatch[]> {
  try {
    const res = await fetchWithTimeout(`${BASE}/getcurrentgroup/wm26`);
    if (!res.ok) return [];
    const group = await res.json();
    const matchday = group?.groupOrderID || 1;
    return fetchMatchday(matchday);
  } catch { return []; }
}
