const fs = require('fs');
const path = require('path');

const olgTeams = JSON.parse(fs.readFileSync('temp-olg-teams.json', 'utf-8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf-8'));
const wikiTeams = JSON.parse(fs.readFileSync('src/data/wiki-teams.json', 'utf-8'));

// FIFA 3-letter code → English name mapping
const codeToEn = {
  ARG: 'Argentina', AUS: 'Australia', AUT: 'Austria', BEL: 'Belgium',
  BIH: 'Bosnia and Herzegovina', BRA: 'Brazil', CAN: 'Canada',
  CHE: 'Switzerland', CIV: 'Ivory Coast', COD: 'DR Congo',
  COL: 'Colombia', CPV: 'Cape Verde', CUW: 'Curaçao', CZE: 'Czech Republic',
  DEU: 'Germany', DZA: 'Algeria', ECU: 'Ecuador', EGY: 'Egypt',
  ENG: 'England', ESP: 'Spain', FRA: 'France', GHA: 'Ghana',
  HRV: 'Croatia', HTI: 'Haiti', IRN: 'Iran', IRQ: 'Iraq',
  JOR: 'Jordan', JPN: 'Japan', KOR: 'South Korea', MAR: 'Morocco',
  MEX: 'Mexico', NLD: 'Netherlands', NOR: 'Norway', NZL: 'New Zealand',
  PAN: 'Panama', PAR: 'Paraguay', PRT: 'Portugal', QAT: 'Qatar',
  RSA: 'South Africa', SAU: 'Saudi Arabia', SCT: 'Scotland', SEN: 'Senegal',
  SWE: 'Sweden', TUN: 'Tunisia', TUR: 'Turkey', URY: 'Uruguay',
  USA: 'United States', UZB: 'Uzbekistan',
};

// English name → Wikipedia CN name (from wiki-teams.json)
const enToWiki = {};
for (const [key, val] of Object.entries(wikiTeams)) {
  enToWiki[key.toLowerCase()] = { title: val.title, extract: val.extract };
}

// Fallback CN names for missing teams
const cnFallback = {
  'south africa': '南非国家足球队',
  'curaçao': '库拉索国家足球队',
  'united states': '美国国家足球队',
  'dr congo': '刚果民主共和国国家足球队',
  'ivory coast': '科特迪瓦国家足球队',
  'bosnia and herzegovina': '波斯尼亚和黑塞哥维那国家足球队',
};

// Build team → group index from squads.json
const teamGroup = {};
for (const t of squads) {
  teamGroup[t.name.toLowerCase()] = t.group;
}

// Build the final teams list
const teams = [];

for (const [code, enName] of Object.entries(codeToEn)) {
  const olgInfo = olgTeams[code];
  const lowerEn = enName.toLowerCase();
  
  const wiki = enToWiki[lowerEn] || { title: cnFallback[lowerEn] || enName, extract: '' };
  const group = teamGroup[lowerEn] || '';
  
  teams.push({
    shortName: code,
    enName,
    cnName: wiki.title,
    cnExtract: wiki.extract,
    group,
    olgId: olgInfo?.id || null,
    olgIcon: olgInfo?.icon || '',
    olgName: olgInfo?.name || '',
  });
}

// Sort by group then name
teams.sort((a, b) => {
  if (a.group !== b.group) return a.group.localeCompare(b.group);
  return a.enName.localeCompare(b.enName);
});

fs.writeFileSync('src/data/teams.json', JSON.stringify(teams, null, 2), 'utf-8');
fs.unlinkSync('temp-olg-teams.json');

console.log(`Total teams: ${teams.length}`);
console.log('First:', teams[0].enName, '→', teams[0].cnName);
console.log('Last:', teams[teams.length - 1].enName, '→', teams[teams.length - 1].cnName);

// Verify all have CN names
const missing = teams.filter(t => !t.cnName || t.cnName === t.enName);
if (missing.length) console.log('MISSING CN:', missing.map(t => t.enName));
else console.log('All teams have CN names ✓');

// Verify all have groups
const noGroup = teams.filter(t => !t.group);
if (noGroup.length) console.log('NO GROUP:', noGroup.map(t => t.enName));
else console.log('All teams have groups ✓');
