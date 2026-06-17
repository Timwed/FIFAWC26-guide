/** Stadium name → Chinese metro area label (WC 2026 16 venues) */
const venueCity: Record<string, string> = {
  'MetLife Stadium': '纽约',
  'AT&T Stadium': '达拉斯',
  'SoFi Stadium': '洛杉矶',
  'Hard Rock Stadium': '迈阿密',
  'Arrowhead Stadium': '堪萨斯城',
  'NRG Stadium': '休斯顿',
  'Mercedes-Benz Stadium': '亚特兰大',
  'Lincoln Financial Field': '费城',
  'Lumen Field': '西雅图',
  "Levi's Stadium": '旧金山',
  'Gillette Stadium': '波士顿',
  'BMO Field': '多伦多',
  'BC Place': '温哥华',
  'BC Place Stadium': '温哥华',
  'Estadio Azteca': '墨西哥城',
  'Azteca': '墨西哥城',
  'Estadio BBVA': '蒙特雷',
  'Estadio Akron': '瓜达拉哈拉',
  'Reliant Stadium': '休斯顿',
  'GEHA Field at Arrowhead Stadium': '堪萨斯城',
};

/** API venue name → venue ID (for routing to venue detail pages) */
const venueIdLookup: Record<string, string> = {
  'MetLife Stadium': 'metlife',
  'AT&T Stadium': 'att',
  'SoFi Stadium': 'sofi',
  'Hard Rock Stadium': 'hardrock',
  'Arrowhead Stadium': 'arrowhead',
  'NRG Stadium': 'nrg',
  'Mercedes-Benz Stadium': 'mercedesbenz',
  'Lincoln Financial Field': 'lincoln',
  'Lumen Field': 'lumen',
  "Levi's Stadium": 'levis',
  'Gillette Stadium': 'gillette',
  'BMO Field': 'bmofield',
  'BC Place': 'bcplace',
  'BC Place Stadium': 'bcplace',
  'Estadio Azteca': 'azteca',
  'Azteca': 'azteca',
  'Estadio BBVA': 'bbva',
  'Estadio Akron': 'akron',
  'Reliant Stadium': 'nrg',
  'GEHA Field at Arrowhead Stadium': 'arrowhead',
};

export function venueLabel(venueName: string): string {
  const city = venueCity[venueName];
  return city ? `${venueName} · ${city}` : venueName;
}

export function venueIdFromName(venueName: string): string | undefined {
  return venueIdLookup[venueName];
}
