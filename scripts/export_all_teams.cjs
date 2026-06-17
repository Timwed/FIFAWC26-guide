const fs = require('fs');
const path = require('path');

const squads = require('../src/data/squads.json');
const names = require('../src/data/player-names.json');
const wiki = require('../src/data/players-wiki.json');

const outDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let exported = 0;
for (const team of squads) {
  const lines = [];
  lines.push(team.name + '\n');
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

  const group = team.group;
  const outPath = path.join(outDir, `${group} - ${team.name}.txt`);
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  exported++;
}

console.log('Exported', exported, 'teams to', outDir);
