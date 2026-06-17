// Replace excessive em dashes in bios
// Rule: max 1 em dash per bio field. Extras become "，" or removed.
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

let fixed = 0;
let totalDashReplacements = 0;
for (const [name, player] of Object.entries(wiki)) {
  for (const field of ['careerReview', 'wcSpotlight']) {
    let text = player[field];
    if (!text) continue;
    const count = (text.match(/——/g) || []).length;
    if (count <= 1) continue;
    
    // Replace all dashes with "，" then put back one dash at the first occurrence
    // that was at a natural break point
    const parts = text.split('——');
    // Keep first dash, join rest with "，"
    const result = parts[0] + '——' + parts.slice(1).join('，');
    if (result !== text) {
      player[field] = result;
      totalDashReplacements += count - 1;
      fixed++;
    }
  }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log(`Fixed ${fixed} bio fields, removed ${totalDashReplacements} excessive dashes.`);
