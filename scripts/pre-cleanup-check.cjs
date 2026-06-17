// Pre-cleanup safety check
const fs = require('fs');
const path = require('path');

const wiki = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'players-wiki.json'), 'utf8'));
const squads = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'squads.json'), 'utf8'));

// Build set of ALL player names in squads (accented)
const squadNames = new Set();
for (const t of squads) {
  for (const p of t.players) {
    squadNames.add(p.name);
  }
}

// Find duplicate pairs: accented vs stripped
function stripAccents(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const dupes = [];
const orphans = [];

for (const key of Object.keys(wiki)) {
  if (squadNames.has(key)) {
    const stripped = stripAccents(key);
    if (stripped !== key && wiki[stripped]) {
      dupes.push({ accented: key, stripped });
    }
  } else {
    // Not in any squad — check if stripped version is in a squad
    const accented = Object.keys(wiki).find(k => stripAccents(k) === stripAccents(key) && squadNames.has(k));
    if (!accented) {
      orphans.push(key);
    }
  }
}

console.log(`=== DUPLICATE PAIRS: ${dupes.length} ===`);
console.log('(accented = in squad, stripped = orphan)\n');

// For each pair, compare content
let diffCount = 0;
let sameCount = 0;
for (const d of dupes) {
  const a = wiki[d.accented];
  const b = wiki[d.stripped];
  const aJson = JSON.stringify(a);
  const bJson = JSON.stringify(b);
  const same = aJson === bJson;

  const aHas26 = /2025-26/.test(a.careerReview || '');
  const bHas26 = /2025-26/.test(b.careerReview || '');

  if (same) {
    sameCount++;
  } else {
    diffCount++;
    console.log(`DIFF: ${d.accented} vs ${d.stripped}`);
    console.log(`  accented: CR=${(a.careerReview||'').length} WS=${(a.wcSpotlight||'').length} has26=${aHas26}`);
    console.log(`  stripped: CR=${(b.careerReview||'').length} WS=${(b.wcSpotlight||'').length} has26=${bHas26}`);
    console.log('');
  }
}

console.log(`Same content: ${sameCount}`);
console.log(`Different content: ${diffCount}\n`);

console.log(`=== ORPHANS (not in any squad): ${orphans.length} ===`);
orphans.forEach(o => console.log(`  ${o}: CR=${(wiki[o].careerReview||'').length} WS=${(wiki[o].wcSpotlight||'').length}`));

// Check which scripts reference file-to-be-deleted
console.log('\n=== File dependency checks ===');

// Check wiki-players.json
const scriptsDir = path.join(__dirname);
const scripts = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.cjs') || f.endsWith('.js'));
const wikiPlayersRefs = [];
for (const s of scripts) {
  const content = fs.readFileSync(path.join(scriptsDir, s), 'utf8');
  if (content.includes('wiki-players.json')) wikiPlayersRefs.push(s);
}
console.log(`Scripts referencing wiki-players.json: ${wikiPlayersRefs.length} — ${wikiPlayersRefs.join(', ') || 'NONE'}`);

// Check wikipedia.ts references  
const srcDir = path.join(__dirname, '..', 'src');
function findFiles(dir, ext) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    if (entry.endsWith(ext)) results.push(path.join(dir, entry));
  }
  return results;
}
const tsFiles = findFiles(srcDir, '.ts').concat(findFiles(srcDir, '.tsx'));
let wpApiRefs = 0;
for (const f of tsFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('wikipedia') && !f.includes('api\\wikipedia')) wpApiRefs++;
}
console.log(`TS files importing wikipedia.ts (excluding self): ${wpApiRefs}`);

// Check TEAM_INTROS.md references
for (const s of scripts) {
  const content = fs.readFileSync(path.join(scriptsDir, s), 'utf8');
  if (content.includes('TEAM_INTROS')) console.log(`  Script referencing TEAM_INTROS: ${s}`);
}
