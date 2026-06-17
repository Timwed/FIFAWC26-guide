// Add coach/manager context to bios
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

const replacements = [
  ['斯卡洛尼', '阿根廷主帅斯卡洛尼'],
  ['多里瓦尔', '巴西主帅多里瓦尔'],
  ['德拉富恩特', '西班牙主帅德拉富恩特'],
  ['纳格尔斯曼', '德国主帅纳格尔斯曼'],
  ['德尚', '法国主帅德尚'],
  ['科曼', '荷兰主帅科曼'],
  ['马丁内斯', '葡萄牙主帅马丁内斯'],
];

// But only if not already prefixed with a title
for (const [name, fullName] of replacements) {
  const pattern = new RegExp(`(?<!主帅|教练|主教练)${name}`, 'g');
  for (const [playerName, player] of Object.entries(wiki)) {
    for (const field of ['careerReview', 'wcSpotlight']) {
      if (player[field] && player[field].includes(name)) {
        player[field] = player[field].replace(pattern, fullName);
      }
    }
  }
}

// Fix club-level coach names
const clubCoaches = [
  ['克洛普', '前利物浦主帅克洛普'],
  ['斯洛特', '利物浦主帅斯洛特'],
  ['阿尔特塔', '阿森纳主帅阿尔特塔'],
  ['西蒙尼', '马竞主帅西蒙尼'],
  ['瓜迪奥拉', '曼城主帅瓜迪奥拉'],
];

for (const [name, fullName] of clubCoaches) {
  const pattern = new RegExp(`(?<!主帅|教练|主教练|前)${name}`, 'g');
  for (const [playerName, player] of Object.entries(wiki)) {
    for (const field of ['careerReview', 'wcSpotlight']) {
      if (player[field] && player[field].includes(name)) {
        player[field] = player[field].replace(pattern, fullName);
      }
    }
  }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Added coach context labels to bios.');
