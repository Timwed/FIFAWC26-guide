// Cleanup: merge 51 duplicates, delete dead files
const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// -- STEP 1: Find all duplicate pairs --
const squads = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'squads.json'), 'utf8'));
const squadNames = new Set();
for (const t of squads) for (const p of t.players) squadNames.add(p.name);

function stripAccents(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const dupes = [];
for (const key of Object.keys(wiki)) {
  if (squadNames.has(key)) {
    const s = stripAccents(key);
    if (s !== key && wiki[s]) dupes.push({ accented: key, stripped: s });
  }
}

console.log(`Found ${dupes.length} duplicate pairs`);

// -- STEP 2: For pairs where stripped is better, copy to accented --
let merged = 0;
for (const d of dupes) {
  const a = wiki[d.accented];
  const b = wiki[d.stripped];
  const aTotal = (a.careerReview || '').length + (a.wcSpotlight || '').length;
  const bTotal = (b.careerReview || '').length + (b.wcSpotlight || '').length;

  // Stripped version is better if it's significantly longer and has actual content
  if (bTotal > aTotal + 50 && bTotal > 100) {
    console.log(`  MERGE: ${d.accented} (${aTotal} chars) <- ${d.stripped} (${bTotal} chars)`);
    wiki[d.accented] = JSON.parse(JSON.stringify(b)); // Deep copy
    merged++;
  }
}

// -- STEP 3: Delete all stripped entries --
for (const d of dupes) {
  delete wiki[d.stripped];
}
console.log(`Deleted ${dupes.length} stripped duplicates (${merged} merged first)`);

// -- STEP 4: Delete orphan Salah Zakariya --
if (wiki['Salah Zakariya']) {
  delete wiki['Salah Zakariya'];
  console.log('Deleted orphan: Salah Zakariya');
}

// -- STEP 5: Save --
fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`Saved: ${Object.keys(wiki).length} entries`);

// -- STEP 6: Verify no more duplicates --
const remaining = [];
for (const key of Object.keys(wiki)) {
  if (squadNames.has(key)) {
    const s = stripAccents(key);
    if (s !== key && wiki[s]) remaining.push(key);
  }
}
console.log(`Remaining duplicates: ${remaining.length}`);

// -- STEP 7: Delete dead files --
const deadFiles = [
  path.join(__dirname, '..', 'src', 'data', 'wiki-players.json'),
  path.join(__dirname, '..', 'src', 'api', 'wikipedia.ts'),
  path.join(__dirname, '..', 'TEAM_INTROS.md'),
];
for (const f of deadFiles) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`Deleted: ${path.relative(path.join(__dirname,'..'), f)}`);
  }
}

console.log('\nCleanup complete.');
