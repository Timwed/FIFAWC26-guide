const fs = require('fs');
const path = require('path');

const [,, teamName] = process.argv;
if (!teamName) {
  console.log('Usage: node scripts/export_team.cjs "Mexico"');
  process.exit(1);
}

const squads = require('../src/data/squads.json');
const names = require('../src/data/player-names.json');
const wiki = require('../src/data/players-wiki.json');

const team = squads.find(t => t.name === teamName);
if (!team) {
  console.log('Team not found:', teamName);
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const lines = [];
lines.push(teamName + '\n');
lines.push('='.repeat(60) + '\n\n');

for (let i = 0; i < team.players.length; i++) {
  const p = team.players[i];
  const cn = names[p.name];
  const bio = wiki[p.name];
  const cr = bio?.careerReview || '(暂无)';
  const ws = bio?.wcSpotlight || '(暂无)';

  lines.push(`${i + 1}. ${cn || p.name} (${p.name})`);
  lines.push(`   位置: ${p.position}  年龄: ${p.age}岁  出场: ${p.caps}场  进球: ${p.goals}球`);
  lines.push(`   俱乐部: ${p.club}`);
  lines.push(`\n   【职业生涯回顾】`);
  lines.push(`   ${cr}`);
  lines.push(`\n   【世界杯聚焦】`);
  lines.push(`   ${ws}`);
  lines.push('\n' + '-'.repeat(50) + '\n');
}

const outPath = path.join(outDir, teamName + '.txt');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('Exported to', outPath);
console.log('Players:', team.players.length);
