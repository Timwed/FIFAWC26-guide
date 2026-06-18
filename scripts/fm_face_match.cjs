const fs = require('fs');
const path = require('path');

const DB_PATH = 'C:/Users/datia/Downloads/Jugadorescompleto.txt';
const FACE_DIR = 'C:/baidunetdiskdownload/SI_cutout_megapack_2026.00/SI_cutout_megapack_2026.00/sortitoutsi/faces';
const SQUADS_PATH = path.join(__dirname, '../src/data/squads.json');

const squads = JSON.parse(fs.readFileSync(SQUADS_PATH, 'utf8'));
const faceSet = new Set(fs.readdirSync(FACE_DIR).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)));
const countryEs = {
  Argentina: ['argentina'], Brazil: ['brasil'], Germany: ['alemania'], France: ['francia'], England: ['inglaterra'], Netherlands: ['holanda', 'paises bajos'], Portugal: ['portugal'], Spain: ['espana'],
  'Czech Republic': ['republica checa', 'chequia'], Mexico: ['mexico'], 'South Africa': ['sudafrica'], 'South Korea': ['corea del sur'], 'Bosnia and Herzegovina': ['bosnia'], Canada: ['canada'], Qatar: ['catar'], Switzerland: ['suiza'], Haiti: ['haiti'], Morocco: ['marruecos'], Scotland: ['escocia'], Australia: ['australia'], Paraguay: ['paraguay'], Turkey: ['turquia'], USA: ['estados unidos'], Curacao: ['curazao'], Ecuador: ['ecuador'], 'Ivory Coast': ['costa de marfil'], Japan: ['japon'], Belgium: ['belgica'], Egypt: ['egipto'], Iran: ['iran'], 'New Zealand': ['nueva zelanda'], 'Cape Verde': ['cabo verde'], 'Saudi Arabia': ['arabia saudi'], Uruguay: ['uruguay'], Iraq: ['irak'], Norway: ['noruega'], Senegal: ['senegal'], Algeria: ['argelia'], Austria: ['austria'], Jordan: ['jordania'], Colombia: ['colombia'], 'DR Congo': ['republica democratica del congo', 'congo'], Uzbekistan: ['uzbekistan'], Croatia: ['croacia'], Ghana: ['ghana'], Panama: ['panama'], Tunisia: ['tunez']
};

function norm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(value) {
  return norm(value).split(' ').filter(Boolean);
}

function sortedKey(value) {
  return tokens(value).sort().join(' ');
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function hasFace(id) {
  return faceSet.has(String(id));
}

function lineToRecord(line) {
  const p = line.split('|');
  const rec = {
    id: p[0],
    full: p[1],
    first: p[2],
    last: p[3],
    nick: p[4] === '-' ? '' : p[4],
    age: Number(p[5]),
    nation: p[6] || '',
    club: p[7] || '',
  };
  rec.options = uniq([
    rec.full,
    rec.nick,
    `${rec.first} ${rec.last}`,
    `${rec.last} ${rec.first}`,
    `${rec.first} ${rec.nick}`,
    `${rec.nick} ${rec.last}`,
  ]).map(norm).filter(Boolean);
  rec.all = norm([rec.full, rec.first, rec.last, rec.nick, rec.nation, rec.club].join(' '));
  rec.hasFace = hasFace(rec.id);
  return rec;
}

const db = fs.readFileSync(DB_PATH, 'utf8')
  .split(/\r?\n/)
  .slice(1)
  .filter(Boolean)
  .map(lineToRecord);

const exact = new Map();
const sorted = new Map();
const pair = new Map();
const tokenIndex = new Map();

function add(map, key, rec) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(rec);
}

for (const rec of db) {
  for (const option of rec.options) {
    add(exact, option, rec);
    add(sorted, sortedKey(option), rec);
    const ts = tokens(option);
    if (ts.length >= 2) add(pair, `${ts[0]}|${ts[ts.length - 1]}`, rec);
    for (const t of ts) if (t.length >= 4) add(tokenIndex, t, rec);
  }
}

const aliases = {
  'Andy Robertson': ['Andrew Robertson'],
  'Cammy Devlin': ['Cameron Devlin'],
  'Willian Pacho': ['William Pacho'],
  'Hossam Abdelmaguid': ['Hossam Abdel Maguid'],
  'Hamdy Fathy': ['Hamdi Fathi'],
  'Marwan Attia': ['Marwan Ateya'],
  'Shojae Khalilzadeh': ['Shoja Khalilzadeh'],
  'Mohamed Kanno': ['Mohammed Kanno'],
  'Aymen Hussein': ['Ayman Hussein'],
  'Mustafa Saadoon': ['Mustafa Saadoun'],
  'Phillipp Mwene': ['Philipp Mwene'],
  'Nico Paz': ['Nicolás Paz', 'Nicolas Paz'],
  'Yazeed Abulaila': ['Yazid Abu Laila'],
  'Utkir Yusupov': ["O'tkir Yusupov"],
  'Khojiakbar Alijonov': ['Hojiakbar Alijonov'],
  'Rustam Ashurmatov': ['Rustamjon Ashurmatov'],
  'Oston Urunov': ["Oston O'runov"],
  'Sherzod Nasrullaev': ['Sherzod Nasrullayev'],
  'Dostonbek Khamdamov': ['Dostonbek Hamdamov'],
  'Abbosbek Fayzullaev': ['Abbosbek Fayzullayev'],
  'Eberechi Eze': ['Ebere Eze'],
  'Mahmud Abunada': ['Mahmoud Abunada'],
  'Redouane Halhal': ['Redouane Hal Hal'],
  'Munir Mohamedi': ['Munir Mohand'],
  'Hossein Kanaanizadegan': ['Hossein Kanani'],
  'Amirhossein Hosseinzadeh': ['Amir Hossein Hosseinzadeh'],
  'Khalil Ayari': ['Khaled Ayari'],
  'Ahmed Fatouh': ['Ahmed Aboul Fotouh'],
  'Meschak Elia': ['Meschack Elia'],
};

function automaticAliases(name) {
  const replacements = [
    ['mohamed', 'mohammed'], ['mohammed', 'mohamed'], ['mohammad', 'mohamed'],
    ['yazeed', 'yazid'], ['aymen', 'ayman'], ['saadoon', 'saadoun'],
    ['attia', 'ateya'], ['abdelmaguid', 'abdel maguid'],
    ['fayzullaev', 'fayzullayev'], ['nasrullaev', 'nasrullayev'],
    ['khamdamov', 'hamdamov'], ['willian', 'william'],
  ];
  const base = norm(name);
  return replacements
    .filter(([from]) => base.includes(from))
    .map(([from, to]) => base.replace(from, to));
}

function targetOptions(name) {
  const ts = tokens(name);
  const opts = [name, ...(aliases[name] || []), ...automaticAliases(name)];
  if (ts.length >= 2) opts.push(`${ts.slice(1).join(' ')} ${ts[0]}`);
  if (ts.length >= 3) opts.push(`${ts[0]} ${ts[ts.length - 1]}`);
  return uniq(opts.map(norm));
}

function editDistance(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 3) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[a.length][b.length];
}

function countryMatch(rec, team) {
  const n = norm(rec.nation);
  return (countryEs[team.name] || [norm(team.name)]).some(c => n.includes(c));
}

function commonTokenCount(rec, player) {
  const targetTokens = tokens(player.name);
  const allTokens = new Set(tokens(rec.all));
  return targetTokens.filter(t => allTokens.has(t)).length;
}

function scoreCandidate(rec, player, team, method) {
  const target = norm(player.name);
  let score = method;
  if (rec.hasFace) score += 20;
  if (Math.abs((player.age - 3) - rec.age) <= 1) score += 8;
  if (Math.abs((player.age - 4) - rec.age) <= 1) score += 8;
  if (norm(rec.club) && norm(player.club) && norm(rec.club).includes(norm(player.club))) score += 8;
  if (countryMatch(rec, team)) score += 8;
  if (rec.options.includes(target)) score += 30;
  if (rec.options.some(o => sortedKey(o) === sortedKey(target))) score += 25;
  score += commonTokenCount(rec, player) * 5;
  for (const option of rec.options) {
    const d = editDistance(target, option);
    if (d <= 1) score += 18;
    else if (d <= 2) score += 10;
  }
  return score;
}

function choose(candidates, player, team, method) {
  const unique = [...new Map(candidates.map(r => [r.id, r])).values()];
  const scored = unique.map(rec => ({ rec, score: scoreCandidate(rec, player, team, method) }))
    .sort((a, b) => b.score - a.score || Number(b.rec.hasFace) - Number(a.rec.hasFace));
  return scored[0] || null;
}

function findMatch(player, team) {
  const opts = targetOptions(player.name);
  for (const opt of opts) {
    const hit = choose(exact.get(opt) || [], player, team, 100);
    if (hit) return { ...hit, method: 'exact' };
  }
  for (const opt of opts) {
    const hit = choose(sorted.get(sortedKey(opt)) || [], player, team, 85);
    if (hit) return { ...hit, method: 'token-sort' };
  }
  const ts = tokens(player.name);
  if (ts.length >= 2) {
    const keys = [`${ts[0]}|${ts[ts.length - 1]}`, `${ts[ts.length - 1]}|${ts[0]}`];
    for (const key of keys) {
      const hit = choose(pair.get(key) || [], player, team, 70);
      if (hit && hit.score >= 88) return { ...hit, method: 'first-last' };
    }
  }
  const rare = ts.filter(t => t.length >= 4).sort((a, b) => (tokenIndex.get(a)?.length || 999999) - (tokenIndex.get(b)?.length || 999999)).slice(0, 2);
  let candidates = [];
  for (const t of rare) candidates = candidates.concat(tokenIndex.get(t) || []);
  const fuzzy = choose(candidates, player, team, 45);
  if (fuzzy && fuzzy.score >= 82 && commonTokenCount(fuzzy.rec, player) >= 2 && countryMatch(fuzzy.rec, team)) return { ...fuzzy, method: 'fuzzy' };
  return null;
}

const results = [];
const misses = [];
for (const team of squads) {
  for (const player of team.players) {
    const match = findMatch(player, team);
    if (match) {
      results.push({
        team: team.name,
        player: player.name,
        age: player.age,
        club: player.club,
        uid: match.rec.id,
        fmName: match.rec.full,
        fmAge: match.rec.age,
        fmClub: match.rec.club,
        hasFace: match.rec.hasFace,
        method: match.method,
        score: match.score,
      });
    } else {
      misses.push({ team: team.name, player: player.name, age: player.age, club: player.club });
    }
  }
}

const withFace = results.filter(r => r.hasFace).length;
const byMethod = results.reduce((acc, r) => { acc[r.method] = (acc[r.method] || 0) + 1; return acc; }, {});
const report = { total: 1248, matched: results.length, matchedPct: `${(results.length / 1248 * 100).toFixed(1)}%`, withFace, withFacePct: `${(withFace / 1248 * 100).toFixed(1)}%`, byMethod, missing: misses.length };

fs.writeFileSync(path.join(__dirname, 'fm-face-matches.json'), JSON.stringify(results, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'fm-face-misses.json'), JSON.stringify(misses, null, 2), 'utf8');
console.log(JSON.stringify(report, null, 2));
console.log('Low confidence sample:');
console.log(results.filter(r => r.score < 88).slice(0, 30).map(r => `${r.team}: ${r.player} => ${r.fmName} [${r.uid}] ${r.method} score=${r.score} face=${r.hasFace}`).join('\n'));
console.log('Missing sample:');
console.log(misses.slice(0, 50).map(r => `${r.team}: ${r.player}`).join('\n'));
