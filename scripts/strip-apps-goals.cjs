// Strip apps/goals from all clubCareer entries
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

let count = 0;
for (const [name, player] of Object.entries(wiki)) {
  if (player.clubCareer && Array.isArray(player.clubCareer)) {
    for (const entry of player.clubCareer) {
      if (entry.apps !== undefined || entry.goals !== undefined) {
        delete entry.apps;
        delete entry.goals;
        count++;
      }
    }
  }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log(`Stripped apps/goals from ${count} clubCareer entries across ${Object.keys(wiki).length} players.`);
