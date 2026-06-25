const fs = require('fs');
const path = require('path');

const wiki = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'players-wiki.json'), 'utf8'));
const squads = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'squads.json'), 'utf8'));
const teams = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'teams.json'), 'utf8'));

const outDir = path.join(__dirname, '..', 'public', 'data', 'players-wiki');

const nameToCode = {};
for (const t of teams) {
  nameToCode[t.enName] = t.shortName;
}

let totalExported = 0;
for (const squad of squads) {
  const code = nameToCode[squad.name];
  if (!code) {
    console.log('No code for:', squad.name);
    continue;
  }

  const teamData = {};
  for (const p of squad.players) {
    const altKey = p.name + ' (' + code + ')';
    const bio = wiki[altKey] || wiki[p.name];
    if (bio) teamData[p.name] = bio;
  }

  const outPath = path.join(outDir, code + '.json');
  fs.writeFileSync(outPath, JSON.stringify(teamData, null, 2), 'utf8');
  const count = Object.keys(teamData).length;
  if (count < 26) console.log(`  ${code}.json: ${count}/26`);
  totalExported += count;
}

console.log(`\nTotal exported: ${totalExported} players across ${squads.filter(s => nameToCode[s.name]).length} teams`);
