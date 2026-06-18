const fs = require('fs');
const path = require('path');

const WIKI_PATH = path.join(__dirname, '../src/data/players-wiki.json');
const MATCHES_PATH = path.join(__dirname, 'fm-face-matches.json');

const wiki = JSON.parse(fs.readFileSync(WIKI_PATH, 'utf8'));
const matches = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf8'));

const faceMap = new Map();
for (const m of matches) {
  if (m.hasFace) faceMap.set(m.player, `/players/${m.uid}.png`);
}

let added = 0;
let notFound = 0;
for (const [name, entry] of Object.entries(wiki)) {
  const img = faceMap.get(name);
  if (img) {
    entry.image = img;
    added++;
  } else {
    notFound++;
    if (entry.image) delete entry.image;
  }
}

fs.writeFileSync(WIKI_PATH, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`Added image: ${added}, No face: ${notFound}`);
