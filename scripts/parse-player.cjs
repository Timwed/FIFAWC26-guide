const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) { console.log('Usage: node parse-player-infobox.cjs "Player Name"'); process.exit(1); }

const tempWikitext = path.join(__dirname, '..', 'temp-player-wikitext.txt');
const tempExtract = path.join(__dirname, '..', 'temp-player-extract.txt');

const wikitext = fs.readFileSync(tempWikitext, 'utf-8');
const extractText = fs.existsSync(tempExtract) ? fs.readFileSync(tempExtract, 'utf-8') : '';

function cleanWiki(text) {
  if (!text) return '';
  return text
    .replace(/'''/g, '')
    .replace(/\{\{(?:lang\|[^}]+?\|)?([^|}]+?)\}\}/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[([^\]|]+?)\]\]/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function getParam(text, paramName) {
  const re = new RegExp(`\\|\\s*${paramName}\\s*=\\s*(.+?)(?=\\n\\s*\\||$)`, 's');
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

function parseBirthDate(text) {
  const m = text.match(/\{\{birth date and age\|(\d{4})\|(\d{1,2})\|(\d{1,2})/);
  if (!m) return { date: '', age: 0 };
  const year = parseInt(m[1]), month = parseInt(m[2]), day = parseInt(m[3]);
  let age = 2026 - year;
  if (month > 6 || (month === 6 && day > 11)) age--;
  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    age
  };
}

function parseHeight(text) {
  if (!text) return null;
  const m = text.match(/([\d.]+)\s*m/);
  return m ? parseFloat(m[1]) : null;
}

function parseIntValue(text) {
  if (!text) return null;
  const clean = text.replace(/[^0-9-]/g, '');
  const n = parseInt(clean);
  return isNaN(n) ? null : n;
}

// Parse infobox
const infoboxMatch = wikitext.match(/\{\{Infobox football biography\n([\s\S]*?)\n\}\}\n/);
if (!infoboxMatch) { console.log('No infobox found'); process.exit(1); }
const infobox = infoboxMatch[1];

// Parse club career (clubsN, yearsN, capsN, goalsN)
const clubCareer = [];
let i = 1;
while (true) {
  const club = getParam(infobox, `clubs${i}`);
  if (!club) break;
  clubCareer.push({
    years: cleanWiki(getParam(infobox, `years${i}`)),
    club: cleanWiki(club),
    apps: parseIntValue(getParam(infobox, `caps${i}`)),
    goals: parseIntValue(getParam(infobox, `goals${i}`)),
  });
  i++;
}

// Parse youth clubs
const youthCareer = [];
let yi = 1;
while (true) {
  const club = getParam(infobox, `youthclubs${yi}`);
  if (!club) break;
  youthCareer.push({
    years: cleanWiki(getParam(infobox, `youthyears${yi}`)),
    club: cleanWiki(club),
  });
  yi++;
}

// Parse national team
const nationalTeams = [];
let ni = 1;
while (true) {
  const team = getParam(infobox, `nationalteam${ni}`);
  if (!team) break;
  nationalTeams.push({
    years: cleanWiki(getParam(infobox, `nationalyears${ni}`)),
    team: cleanWiki(team),
    caps: parseIntValue(getParam(infobox, `nationalcaps${ni}`)),
    goals: parseIntValue(getParam(infobox, `nationalgoals${ni}`)),
  });
  ni++;
}

// Parse medals
function parseMedals(text) {
  const medals = [];
  const medMatch = text.match(/\| medaltemplates\s*=\s*([\s\S]*?)(?:\n\}\}|\n\s*\|club-update|\n\s*\|nationalteam-update)/);
  if (!medMatch) return medals;
  
  let currentComp = '';
  const lines = medMatch[1].split('\n');
  for (const line of lines) {
    const compMatch = line.match(/\{\{MedalCompetition\|(.+?)\}\}/);
    if (compMatch) { currentComp = cleanWiki(compMatch[1]); continue; }
    
    const goldMatch = line.match(/\{\{Medal\|W\|(.+?)\}\}/);
    if (goldMatch) {
      medals.push({ competition: currentComp, result: '冠军', detail: cleanWiki(goldMatch[1]) });
      continue;
    }
    const silverMatch = line.match(/\{\{Medal\|RU\|(.+?)\}\}/);
    if (silverMatch) {
      medals.push({ competition: currentComp, result: '亚军', detail: cleanWiki(silverMatch[1]) });
      continue;
    }
    const bronzeMatch = line.match(/\{\{Medal\|3rd\|(.+?)\}\}/);
    if (bronzeMatch) {
      medals.push({ competition: currentComp, result: '季军', detail: cleanWiki(bronzeMatch[1]) });
      continue;
    }
  }
  return medals;
}

// Get image name and construct URL
const imageName = getParam(infobox, 'image');
const imageUrl = imageName
  ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${encodeURIComponent(imageName.replace(/ /g, '_'))}/220px-${imageName.replace(/ /g, '_')}`
  : '';

// Clean the extract: take first 800 chars
let bio = extractText
  .replace(/^.*?"([^"]+)" redirects here[\s\S]*?may refer to:/i, '') // Remove hatnotes
  .replace(/\s*Short description.*?(?=[A-Z])/s, '') // Remove short description
  .replace(/^[^A-Z]*/, '') // Remove leading non-alpha
  .trim();
if (bio.length > 1000) {
  bio = bio.substring(0, 1000).replace(/\s+\S*$/, '') + '...';
}

const player = {
  name: name,
  fullName: cleanWiki(getParam(infobox, 'full_name') || getParam(infobox, 'name')),
  birthDate: parseBirthDate(getParam(infobox, 'birth_date')).date,
  birthPlace: cleanWiki(getParam(infobox, 'birth_place')),
  height: parseHeight(getParam(infobox, 'height')),
  position: cleanWiki(getParam(infobox, 'position')),
  currentClub: cleanWiki(getParam(infobox, 'currentclub')),
  clubNumber: getParam(infobox, 'clubnumber'),
  image: imageUrl,
  clubCareer,
  nationalTeams,
  youthCareer,
  medals: parseMedals(infobox),
  bio,
};

console.log(JSON.stringify(player, null, 2));
