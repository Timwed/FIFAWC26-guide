const fs = require('fs');

const wikitext = fs.readFileSync('temp-messi.txt', 'utf-8');

// Parse infobox
const infoboxMatch = wikitext.match(/\{\{Infobox football biography\n([\s\S]*?)\n\}\}\n/);
if (!infoboxMatch) { console.log('No infobox found'); process.exit(1); }
const infobox = infoboxMatch[1];

function getParam(text, name) {
  const re = new RegExp(`\\|\\s*${name}\\s*=\\s*(.+?)(?:\\n\\||$)`, 's');
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

function cleanWiki(text) {
  return text
    .replace(/''/g, '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[([^\]|]+?)\]\]/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, '\u00A0')
    .trim();
}

function parseList(text, prefix) {
  const results = [];
  let i = 1;
  while (true) {
    const club = getParam(text, `${prefix}${i}`);
    if (!club) break;
    const caps = getParam(text, `caps${i}`);
    const goals = getParam(text, `goals${i}`);
    const years = getParam(text, `years${i}`);
    results.push({
      years: cleanWiki(years),
      club: cleanWiki(club),
      apps: caps ? parseInt(caps) : null,
      goals: goals ? parseInt(goals) : null,
    });
    i++;
  }
  return results;
}

function parseMedals(text) {
  const medals = [];
  // Look for medaltemplates section
  const medMatch = text.match(/\| medaltemplates\s*=\s*([\s\S]*?)(?:\n\}\}|\n\s*\|club-update)/);
  if (!medMatch) return medals;
  const medText = medMatch[1];
  
  let currentComp = '';
  const lines = medText.split('\n');
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

function parseBirthDate(text) {
  const m = text.match(/\{\{birth date and age\|(\d{4})\|(\d{1,2})\|(\d{1,2})/);
  if (!m) return { date: cleanWiki(text), age: 0 };
  const year = parseInt(m[1]), month = parseInt(m[2]), day = parseInt(m[3]);
  // Age from June 11 2026
  let age = 2026 - year;
  if (month > 6 || (month === 6 && day > 11)) age--;
  return { date: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, age };
}

function parseHeight(text) {
  const m = text.match(/([\d.]+)\s*m/);
  if (m) return parseFloat(m[1]);
  return null;
}

const fullName = cleanWiki(getParam(infobox, 'full_name') || getParam(infobox, 'name'));
const birthDateRaw = getParam(infobox, 'birth_date');
const { date: birthDate, age } = parseBirthDate(birthDateRaw);
const birthPlace = cleanWiki(getParam(infobox, 'birth_place'));
const height = parseHeight(getParam(infobox, 'height'));
const position = cleanWiki(getParam(infobox, 'position'));
const currentClub = cleanWiki(getParam(infobox, 'currentclub'));
const clubNumber = getParam(infobox, 'clubnumber');
const imageRaw = getParam(infobox, 'image');

const clubCareer = parseList(infobox, 'clubs');
const youthCareer = parseList(infobox, 'youthclubs');
const nationalTeam = getParam(infobox, 'nationalteam');
const nationalCaps = getParam(infobox, 'nationalcaps');
const nationalGoals = getParam(infobox, 'nationalgoals');
const medals = parseMedals(infobox);

console.log(JSON.stringify({
  name: fullName,
  birthDate,
  age,
  birthPlace,
  height,
  position,
  currentClub,
  clubNumber,
  clubCareer,
  youthCareer,
  nationalTeam,
  nationalCaps,
  nationalGoals,
  medals,
  image: imageRaw,
}, null, 2));
