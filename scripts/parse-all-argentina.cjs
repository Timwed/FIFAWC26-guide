const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

const tmpDir = path.join(__dirname, '..', 'temp-players');
const squads = readJSON(path.join(__dirname, '..', 'src', 'data', 'squads.json'));
const argSquad = squads.find(s => s.name === 'Argentina');

function cleanWiki(text) {
  if (!text) return '';
  return text
    .replace(/'''/g, '')
    .replace(/\{\{(?:lang\|[^}]+?\|)?([^|}]+?)\}\}/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[([^\]|]+?)\]\]/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&nbsp;/g, ' ')
    .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function getParam(infobox, name) {
  const re = new RegExp(`\\|\\s*${name}\\s*=\\s*(.+?)(?=\\n\\s*\\||$)`, 's');
  const m = infobox.match(re);
  return m ? m[1].trim() : '';
}

function parseIntValue(text) {
  if (!text) return null;
  const cleanText = cleanWiki(text).replace(/[^0-9]/g, '');
  const n = parseInt(cleanText);
  return isNaN(n) ? null : n;
}

function parseBirthDate(text) {
  const m = text.match(/\{\{birth date and age\|(\d{4})\|(\d{1,2})\|(\d{1,2})/);
  if (!m) return '';
  return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
}

function parseHeight(text) {
  if (!text) return null;
  const m = text.match(/([\d.]+)\s*m/);
  return m ? parseFloat(m[1]) : null;
}

function parseClubCareer(infobox) {
  const careers = [];
  let i = 1;
  while (true) {
    const club = getParam(infobox, `clubs${i}`);
    if (!club) break;
    careers.push({
      years: cleanWiki(getParam(infobox, `years${i}`)),
      club: cleanWiki(club),
      apps: parseIntValue(getParam(infobox, `caps${i}`)),
      goals: parseIntValue(getParam(infobox, `goals${i}`)),
    });
    i++;
  }
  return careers;
}

function parseNationalTeam(infobox) {
  const teams = [];
  let i = 1;
  while (true) {
    const team = cleanWiki(getParam(infobox, `nationalteam${i}`));
    if (!team) break;
    // Only take senior national team
    if (!team.includes('U') || i > 3) {
      teams.push({
        years: cleanWiki(getParam(infobox, `nationalyears${i}`)),
        team,
        caps: parseIntValue(getParam(infobox, `nationalcaps${i}`)),
        goals: parseIntValue(getParam(infobox, `nationalgoals${i}`)),
      });
    }
    i++;
  }
  return teams;
}

const allPlayers = {};

for (const player of argSquad.players) {
  const safeName = player.name.replace(/[^a-zA-Z0-9]/g, '_');
  const wikiFile = path.join(tmpDir, `${safeName}_wiki.json`);
  const rawFile = path.join(tmpDir, `${safeName}_raw.json`);
  
  if (!fs.existsSync(wikiFile)) {
    console.log(`NO WIKI: ${player.name}`);
    continue;
  }
  
  const wikitext = fs.readFileSync(wikiFile, 'utf-8');
  const raw = fs.existsSync(rawFile) ? readJSON(rawFile) : { extract: '' };
  
  // Parse infobox
  const ibMatch = wikitext.match(/\{\{Infobox football biography\n([\s\S]*?)\n\}\}\n/);
  const infobox = ibMatch ? ibMatch[1] : '';
  
  // Get first paragraph from wikitext (before first == heading ==)
  const introMatch = wikitext.match(/'''[\s\S]*?\n\n(.+?)(?=\n==)/s);
  const intro = introMatch ? introMatch[1].trim() : '';
  
  const image = cleanWiki(getParam(infobox, 'image'));
  const imageUrl = image
    ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${encodeURIComponent(image.replace(/ /g, '_'))}/220px-${encodeURIComponent(image.replace(/ /g, '_'))}`
    : '';
  
  const fullName = cleanWiki(getParam(infobox, 'full_name') || getParam(infobox, 'name'));
  const position = cleanWiki(getParam(infobox, 'position'));
  const currentClub = cleanWiki(getParam(infobox, 'currentclub'));
  const clubNumber = getParam(infobox, 'clubnumber');
  const birthDate = parseBirthDate(getParam(infobox, 'birth_date'));
  const birthPlace = cleanWiki(getParam(infobox, 'birth_place'));
  const height = parseHeight(getParam(infobox, 'height'));
  
  const clubCareer = parseClubCareer(infobox);
  const nationalTeams = parseNationalTeam(infobox);
  const seniorNT = nationalTeams.find(nt => !nt.team.includes('U')) || nationalTeams[nationalTeams.length - 1] || {};
  
  const extract = raw.extract || '';
  
  allPlayers[player.name] = {
    number: player.number,
    fullName: fullName || player.name,
    birthDate,
    birthPlace,
    height,
    position: position || player.position,
    currentClub: currentClub || player.club,
    clubNumber: clubNumber || player.number,
    image: imageUrl,
    clubCareer: clubCareer.length > 0 ? clubCareer : null,
    nationalCaps: seniorNT.caps || player.caps,
    nationalGoals: seniorNT.goals || player.goals,
    extractPreview: extract.substring(0, 600),
    introPreview: cleanWiki(intro).substring(0, 600),
    careerReview: "",
    wcSpotlight: "",
  };
}

const outPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
fs.writeFileSync(outPath, JSON.stringify(allPlayers, null, 2), 'utf-8');
console.log(`Written ${Object.keys(allPlayers).length} players to players-wiki.json`);

