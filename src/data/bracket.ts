export interface BracketMatch {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | '3P' | 'F';
  matchNo: number;
  dateEvent: string;
  strTime: string;
  venue: string;
  homeSlot: string;
  awaySlot: string;
  homeLabel: string;
  awayLabel: string;
  homeTeam: string | null;
  awayTeam: string | null;
  homeScore: number | null;
  awayScore: number | null;
  winner: 'home' | 'away' | null;
  feedsInto: string | null;
  feedsAs: 'home' | 'away' | null;
}

const R32_MATCHES = [
  { no: 73, venue: 'Los Angeles', date: '2026-06-28', time: '13:00:00', home: '2A', away: '2B', hi: 'A组第二', ai: 'B组第二', feed: 'r16-90', feedAs: 'home' as const },
  { no: 74, venue: 'Boston', date: '2026-06-29', time: '13:00:00', home: '1E', away: '3rd*', hi: 'E组第一', ai: '3rd A/B/C/D/F', feed: 'r16-89', feedAs: 'home' as const },
  { no: 75, venue: 'Monterrey', date: '2026-06-29', time: '17:00:00', home: '1F', away: '2C', hi: 'F组第一', ai: 'C组第二', feed: 'r16-90', feedAs: 'away' as const },
  { no: 76, venue: 'Houston', date: '2026-06-29', time: '14:00:00', home: '1C', away: '2F', hi: 'C组第一', ai: 'F组第二', feed: 'r16-91', feedAs: 'home' as const },
  { no: 77, venue: 'NY/NJ', date: '2026-06-30', time: '13:00:00', home: '1I', away: '3rd*', hi: 'I组第一', ai: '3rd C/D/F/G/H', feed: 'r16-89', feedAs: 'away' as const },
  { no: 78, venue: 'Dallas', date: '2026-06-30', time: '14:00:00', home: '2E', away: '2I', hi: 'E组第二', ai: 'I组第二', feed: 'r16-91', feedAs: 'away' as const },
  { no: 79, venue: 'Mexico City', date: '2026-06-30', time: '19:00:00', home: '1A', away: '3rd*', hi: 'A组第一', ai: '3rd C/E/F/H/I', feed: 'r16-92', feedAs: 'home' as const },
  { no: 80, venue: 'SF Bay', date: '2026-07-01', time: '13:00:00', home: '1D', away: '3rd*', hi: 'D组第一', ai: '3rd B/E/F/I/J', feed: 'r16-92', feedAs: 'away' as const },
  { no: 81, venue: 'Seattle', date: '2026-07-01', time: '14:00:00', home: '1G', away: '3rd*', hi: 'G组第一', ai: '3rd A/E/H/I/J', feed: 'r16-93', feedAs: 'home' as const },
  { no: 82, venue: 'Atlanta', date: '2026-07-01', time: '17:00:00', home: '1L', away: '3rd*', hi: 'L组第一', ai: '3rd E/H/I/J/K', feed: 'r16-93', feedAs: 'away' as const },
  { no: 83, venue: 'Vancouver', date: '2026-07-02', time: '13:00:00', home: '1B', away: '3rd*', hi: 'B组第一', ai: '3rd E/F/G/I/J', feed: 'r16-94', feedAs: 'home' as const },
  { no: 84, venue: 'Toronto', date: '2026-07-02', time: '14:00:00', home: '2K', away: '2L', hi: 'K组第二', ai: 'L组第二', feed: 'r16-94', feedAs: 'away' as const },
  { no: 85, venue: 'Los Angeles', date: '2026-07-02', time: '19:00:00', home: '1H', away: '2J', hi: 'H组第一', ai: 'J组第二', feed: 'r16-95', feedAs: 'home' as const },
  { no: 86, venue: 'Kansas City', date: '2026-07-03', time: '13:00:00', home: '1K', away: '3rd*', hi: 'K组第一', ai: '3rd D/E/I/J/L', feed: 'r16-96', feedAs: 'home' as const },
  { no: 87, venue: 'Dallas', date: '2026-07-03', time: '14:00:00', home: '2D', away: '2G', hi: 'D组第二', ai: 'G组第二', feed: 'r16-95', feedAs: 'away' as const },
  { no: 88, venue: 'Miami', date: '2026-07-03', time: '17:00:00', home: '1J', away: '2H', hi: 'J组第一', ai: 'H组第二', feed: 'r16-96', feedAs: 'away' as const },
];

export function buildAllMatches(): BracketMatch[] {
  const all: BracketMatch[] = [];

  // R32
  for (const m of R32_MATCHES) {
    all.push({
      id: `r32-${m.no}`,
      round: 'R32',
      matchNo: m.no,
      dateEvent: m.date,
      strTime: m.time,
      venue: kv(m.venue),
      homeSlot: m.home,
      awaySlot: m.away,
      homeLabel: m.hi,
      awayLabel: m.ai,
      homeTeam: null,
      awayTeam: null,
      homeScore: null,
      awayScore: null,
      winner: null,
      feedsInto: m.feed,
      feedsAs: m.feedAs,
    });
  }

  // R16 (derived from R32 feed data)
  all.push(
    makeMatch('r16-89', 'R16', 89, 'Philadelphia', '2026-07-04', '13:00:00', 'r32-74', 'r32-77', 'qf-97', 'home'),
    makeMatch('r16-90', 'R16', 90, 'Houston', '2026-07-04', '14:00:00', 'r32-73', 'r32-75', 'qf-97', 'away'),
    makeMatch('r16-91', 'R16', 91, 'NY/NJ', '2026-07-05', '13:00:00', 'r32-76', 'r32-78', 'qf-99', 'home'),
    makeMatch('r16-92', 'R16', 92, 'Mexico City', '2026-07-05', '14:00:00', 'r32-79', 'r32-80', 'qf-99', 'away'),
    makeMatch('r16-93', 'R16', 93, 'Seattle', '2026-07-06', '13:00:00', 'r32-81', 'r32-82', 'qf-98', 'home'),
    makeMatch('r16-94', 'R16', 94, 'Dallas', '2026-07-06', '14:00:00', 'r32-83', 'r32-84', 'qf-98', 'away'),
    makeMatch('r16-95', 'R16', 95, 'Vancouver', '2026-07-07', '13:00:00', 'r32-85', 'r32-87', 'qf-100', 'home'),
    makeMatch('r16-96', 'R16', 96, 'Atlanta', '2026-07-07', '14:00:00', 'r32-86', 'r32-88', 'qf-100', 'away'),
  );

  // QF
  all.push(
    makeMatch('qf-97', 'QF', 97, 'Boston', '2026-07-09', '14:00:00', 'r16-89', 'r16-90', 'sf-101', 'home'),
    makeMatch('qf-98', 'QF', 98, 'Los Angeles', '2026-07-10', '14:00:00', 'r16-93', 'r16-94', 'sf-102', 'home'),
    makeMatch('qf-99', 'QF', 99, 'Miami', '2026-07-11', '13:00:00', 'r16-91', 'r16-92', 'sf-101', 'away'),
    makeMatch('qf-100', 'QF', 100, 'Kansas City', '2026-07-11', '14:00:00', 'r16-95', 'r16-96', 'sf-102', 'away'),
  );

  // SF
  all.push(
    makeMatch('sf-101', 'SF', 101, 'Dallas', '2026-07-14', '17:00:00', 'qf-97', 'qf-99', 'f-104', 'home'),
    makeMatch('sf-102', 'SF', 102, 'Atlanta', '2026-07-15', '17:00:00', 'qf-98', 'qf-100', 'f-104', 'away'),
  );

  // 3rd Place
  all.push(makeMatch('3p-103', '3P', 103, 'Miami', '2026-07-18', '14:00:00', 'sf-101', 'sf-102', null, null));
  // Final
  all.push(makeMatch('f-104', 'F', 104, 'NY/NJ', '2026-07-19', '14:00:00', 'sf-101', 'sf-102', null, null));
  // 3rd place feeds loser, final feeds winner

  return all;
}

function makeMatch(
  id: string,
  round: BracketMatch['round'],
  matchNo: number,
  venue: string,
  dateEvent: string,
  strTime: string,
  homeSlot: string,
  awaySlot: string,
  feedsInto: string | null,
  feedsAs: 'home' | 'away' | null,
): BracketMatch {
  const getLabel = (s: string) => {
    const m = s.match(/^r32-(\d+)$/);
    if (m) return `胜者 M${m[1]}`;
    return '胜者';
  };
  return {
    id, round, matchNo,
    dateEvent, strTime,
    venue: kv(venue),
    homeSlot, awaySlot,
    homeLabel: getLabel(homeSlot),
    awayLabel: getLabel(awaySlot),
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    winner: null,
    feedsInto,
    feedsAs,
  };
}

function kv(s: string): string {
  const map: Record<string, string> = {
    'Los Angeles': '洛杉矶',
    'Boston': '波士顿',
    'Monterrey': '蒙特雷',
    'Houston': '休斯顿',
    'NY/NJ': '纽约/新泽西',
    'Dallas': '达拉斯',
    'Mexico City': '墨西哥城',
    'SF Bay': '旧金山湾区',
    'Seattle': '西雅图',
    'Atlanta': '亚特兰大',
    'Vancouver': '温哥华',
    'Toronto': '多伦多',
    'Kansas City': '堪萨斯城',
    'Miami': '迈阿密',
    'Philadelphia': '费城',
  };
  return map[s] || s;
}

/** R32 visual order so adjacent pairs feed same R16 match */
export const R32_VISUAL = [
  'r32-73','r32-75','r32-74','r32-77',
  'r32-76','r32-78','r32-79','r32-80',
  'r32-81','r32-82','r32-83','r32-84',
  'r32-85','r32-87','r32-86','r32-88',
];

/** R16 visual order so adjacent pairs feed same QF match */
export const R16_VISUAL = ['r16-90','r16-89','r16-91','r16-92','r16-93','r16-94','r16-95','r16-96'];
export const QF_VISUAL = ['qf-97','qf-99','qf-98','qf-100'];
export const SF_VISUAL = ['sf-101','sf-102'];
export const FINAL_VISUAL = ['3p-103','f-104'];
