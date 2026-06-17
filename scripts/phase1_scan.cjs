// Phase 1: Full audit scan of all 48 teams
const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));
const teams = JSON.parse(fs.readFileSync('src/data/teams.json', 'utf8'));

// Build group map
const groupMap = {};
for (const t of teams) {
  if (!groupMap[t.group]) groupMap[t.group] = [];
  groupMap[t.group].push(t.cnName);
}

// Build squad lookup: playerName -> {team, club, caps, goals, position, age}
const playerSquad = {};
for (const team of squads) {
  for (const p of team.players) {
    playerSquad[p.name] = { team: team.name, club: p.club, caps: p.caps, goals: p.goals, position: p.position, age: p.age };
  }
}

const results = [];

for (const team of squads) {
  const tn = team.name;
  const group = teams.find(t => t.enName === tn)?.group || '?';
  const groupOpponents = (groupMap[group] || []).filter(n => n !== teams.find(t => t.enName === tn)?.cnName);
  
  const issues = { team: tn, group, dotFill: [], truncated: [], derogatory: [], fluff: [], underSize: [], overSize: [], clubMismatch: [], missing2026: [], wrongOpponents: [] };

  for (const p of team.players) {
    const e = wiki[p.name];
    if (!e) { issues.dotFill.push(`MISSING: ${p.name}`); continue; }

    const cr = e.careerReview || '';
    const ws = e.wcSpotlight || '';
    const all = cr + ws;
    const tot = cr.length + ws.length;

    // 1. Dot-fills (>=5 dots)
    if (/。。。。。。。。/g.test(all)) {
      issues.dotFill.push(`${p.name} (${tot}c)`);
    }

    // 2. Truncated sentences (ends mid-sentence with no period)
    const truncatedPattern = /[^\n]{10,}[，、但而在和与的著][^\n。！？]{0,5}$/;
    for (const [label, text] of [['CR', cr], ['WS', ws]]) {
      if (truncatedPattern.test(text)) {
        issues.truncated.push(`${p.name} ${label}`);
      }
    }

    // 3. Derogatory language
    const derogatoryRe = /灾难|击穿|幼儿|粉碎.*防线|噪声.*数据|遥不可及.*世界杯|跑道上|不可能.*应对/g;
    for (const [label, text] of [['CR', cr], ['WS', ws]]) {
      const m = text.match(derogatoryRe);
      if (m) {
        issues.derogatory.push(`${p.name} ${label}: "${m[0]}"`);
      }
    }

    // 4. Fluff templates
    const fluffRe = /最伟大|封神|价值连城|大学课程|人生里程碑|人生资产|至高嘉奖|载入史册|史诗.*对决|无可替代.*价值|全世界都相信|决定性的球员|终极舞台|最顶级.*实现/g;
    for (const [label, text] of [['CR', cr], ['WS', ws]]) {
      const m = text.match(fluffRe);
      if (m) {
        issues.fluff.push(`${p.name} ${label}: "${m[0].substring(0,20)}"`);
      }
    }

    // 5. Size anomalies (<180 or >600 total)
    if (tot < 180) issues.underSize.push(`${p.name} (${tot}c)`);
    if (tot > 600) issues.overSize.push(`${p.name} (${tot}c)`);

    // 6. Club mismatch (check if squad club appears in careerReview)
    if (p.club && !cr.includes(p.club)) {
      // Allow abbreviation variants
      const clubWords = p.club.split(' ').filter(w => w.length > 2);
      const allMatch = clubWords.every(w => cr.includes(w));
      if (!allMatch && clubWords.length > 0) {
        issues.clubMismatch.push(`${p.name}: squad=${p.club} vs cr="${cr.substring(0,50)}..."`);
      }
    }

    // 7. Missing 2025-26 season data
    const has2026 = /2025-26|2025\/26|2025–26|2025—26|2025.26|202526/.test(all);
    if (!has2026) {
      // Only flag A/B tier players (core/important)
      // For weak teams, flag if > 15 caps
      if (p.caps > 15) {
        issues.missing2026.push(`${p.name} (${tot}c, ${p.caps}cap)`);
      }
    }

    // 8. Check for opponents NOT in the actual group
    const opponentNames = ['阿根廷','巴西','德国','法国','英格兰','荷兰','西班牙','葡萄牙','意大利','比利时','克罗地亚','乌拉圭','日本','韩国','美国','墨西哥','加拿大','摩洛哥','塞内加尔','加纳','喀麦隆','尼日利亚','突尼斯','阿尔及利亚','埃及','伊朗','沙特','卡塔尔','澳大利亚','新西兰','哥伦比亚','智利','秘鲁','厄瓜多尔','巴拉圭','挪威','瑞典','丹麦','瑞士','波兰','捷克','奥地利','土耳其','乌克兰','塞尔维亚','科特迪瓦','伊拉克','阿联酋','中国'];
    for (const opp of opponentNames) {
      if (!groupOpponents.includes(opp) && all.includes(opp)) {
        // Check it's not just part of a player name or common word
        // Only flag if appears in a matchup context
        const contexts = all.match(new RegExp(`对[阵位抗].{0,3}${opp}|${opp}.{0,3}的左.{0,3}|${opp}.{0,3}的右.{0,3}|${opp}.{0,3}的防|${opp}.{0,3}的锋`, 'g'));
        if (contexts && contexts.length > 0) {
          issues.wrongOpponents.push(`${p.name}: "${contexts[0]}" (group=${group}, real=(${groupOpponents.join(',')}))`);
        }
      }
    }
  }

  results.push(issues);
}

// --- OUTPUT ---

// Summary: Score each team by issue count
const scored = results.map(r => ({
  team: r.team,
  group: r.group,
  score: r.dotFill.length * 10 + r.truncated.length * 8 + r.derogatory.length * 6 + r.fluff.length * 4 + r.missing2026.length * 3 + r.clubMismatch.length * 5 + r.wrongOpponents.length * 7 + r.underSize.length * 1 + r.overSize.length * 1,
  ...r
}));

scored.sort((a, b) => b.score - a.score);

console.log('=========================================');
console.log('PHASE 1 SCAN — ALL 48 TEAMS (sorted by severity)');
console.log('=========================================\n');

let totalDot = 0, totalTrunc = 0, totalDero = 0, totalFluff = 0, totalUnder = 0, totalOver = 0, totalClub = 0, totalMiss26 = 0, totalWrongOpp = 0;

for (const r of scored) {
  const parts = [];
  if (r.dotFill.length) parts.push(`DOT(${r.dotFill.length})`);
  if (r.truncated.length) parts.push(`TRUNC(${r.truncated.length})`);
  if (r.derogatory.length) parts.push(`DERO(${r.derogatory.length})`);
  if (r.fluff.length) parts.push(`FLUFF(${r.fluff.length})`);
  if (r.missing2026.length) parts.push(`-26(${r.missing2026.length})`);
  if (r.clubMismatch.length) parts.push(`CLUB(${r.clubMismatch.length})`);
  if (r.wrongOpponents.length) parts.push(`OPP(${r.wrongOpponents.length})`);
  if (r.underSize.length) parts.push(`<180(${r.underSize.length})`);
  if (r.overSize.length) parts.push(`>600(${r.overSize.length})`);

  const status = parts.length === 0 ? 'CLEAN' : `⚠ ${parts.join(' ')}`;
  console.log(`${r.team.padEnd(18)} [${r.group}]  ${String(r.score).padStart(3)}  ${status}`);

  totalDot += r.dotFill.length;
  totalTrunc += r.truncated.length;
  totalDero += r.derogatory.length;
  totalFluff += r.fluff.length;
  totalUnder += r.underSize.length;
  totalOver += r.overSize.length;
  totalClub += r.clubMismatch.length;
  totalMiss26 += r.missing2026.length;
  totalWrongOpp += r.wrongOpponents.length;
}

console.log('\n=========================================');
console.log('TOTALS ACROSS ALL 48 TEAMS');
console.log('=========================================');
console.log(`Dot-fills:       ${totalDot}`);
console.log(`Truncated:       ${totalTrunc}`);
console.log(`Derogatory:      ${totalDero}`);
console.log(`Fluff:           ${totalFluff}`);
console.log(`Under 180 chars: ${totalUnder}`);
console.log(`Over 600 chars:  ${totalOver}`);
console.log(`Club mismatch:   ${totalClub}`);
console.log(`No 2025-26 data: ${totalMiss26} (players >15 caps)`);
console.log(`Wrong opponents: ${totalWrongOpp}`);

// Detailed report for top 5 worst
console.log('\n\n=========================================');
console.log('TOP 5 WORST TEAMS — DETAILED');
console.log('=========================================\n');

for (let i = 0; i < Math.min(5, scored.length); i++) {
  const r = scored[i];
  if (r.score === 0) continue;
  console.log(`#${i+1} ${r.team} (${r.group}组) — Score: ${r.score}`);
  if (r.dotFill.length) {
    console.log(`  DOT-FILLS (${r.dotFill.length}):`);
    r.dotFill.slice(0, 5).forEach(d => console.log(`    - ${d}`));
    if (r.dotFill.length > 5) console.log(`    ... +${r.dotFill.length - 5} more`);
  }
  if (r.truncated.length) {
    console.log(`  TRUNCATED (${r.truncated.length}):`);
    r.truncated.slice(0, 5).forEach(d => console.log(`    - ${d}`));
    if (r.truncated.length > 5) console.log(`    ... +${r.truncated.length - 5} more`);
  }
  if (r.derogatory.length) {
    console.log(`  DEROGATORY (${r.derogatory.length}):`);
    r.derogatory.forEach(d => console.log(`    - ${d}`));
  }
  if (r.fluff.length) {
    console.log(`  FLUFF (${r.fluff.length}):`);
    r.fluff.slice(0, 5).forEach(d => console.log(`    - ${d}`));
    if (r.fluff.length > 5) console.log(`    ... +${r.fluff.length - 5} more`);
  }
  if (r.clubMismatch.length) {
    console.log(`  CLUB MISMATCH (${r.clubMismatch.length}):`);
    r.clubMismatch.forEach(d => console.log(`    - ${d}`));
  }
  if (r.missing2026.length) {
    console.log(`  NO 2025-26 (${r.missing2026.length} players):`);
    r.missing2026.slice(0, 10).forEach(d => console.log(`    - ${d}`));
    if (r.missing2026.length > 10) console.log(`    ... +${r.missing2026.length - 10} more`);
  }
  console.log();
}

console.log('DONE.');
