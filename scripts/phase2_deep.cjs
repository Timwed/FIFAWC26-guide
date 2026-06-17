// Phase 2: Find and fix derogatory + fluff + wrong opponents
const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));
const teams = JSON.parse(fs.readFileSync('src/data/teams.json', 'utf8'));

// Group opponents map
const groupMap = {};
for (const t of teams) {
  if (!groupMap[t.group]) groupMap[t.group] = [];
  groupMap[t.group].push(t.cnName);
}

// Find ALL derogatory and fluff items
const derogatoryRe = /灾难|击穿|幼儿|粉碎.*防线|噪声.*数据|遥不可及.*世界杯|跑道上|不可能.*应对/g;
const fluffRe = /最伟大|封神|价值连城|大学课程|人生里程碑|人生资产|至高嘉奖|载入史册|史诗.*对决|全世界都相信|决定性的球员|终极舞台|最顶级.*实现/g;

console.log('=== DEROGATORY ITEMS ===');
for (const team of squads) {
  for (const p of team.players) {
    const e = wiki[p.name];
    if (!e) continue;
    for (const [label, text] of [['CR', e.careerReview||''], ['WS', e.wcSpotlight||'']]) {
      const m = text.match(derogatoryRe);
      if (m) {
        console.log(`${team.name} / ${p.name} (${label}): "${m[0]}" in: ${text.substring(Math.max(0,text.indexOf(m[0])-20), text.indexOf(m[0])+m[0].length+20)}`);
      }
    }
  }
}

console.log('\n=== FLUFF ITEMS ===');
for (const team of squads) {
  for (const p of team.players) {
    const e = wiki[p.name];
    if (!e) continue;
    for (const [label, text] of [['CR', e.careerReview||''], ['WS', e.wcSpotlight||'']]) {
      const m = text.match(fluffRe);
      if (m) {
        console.log(`${team.name} / ${p.name} (${label}): "${m[0]}"`);
      }
    }
  }
}

// Wrong opponents - check each player against their actual group
console.log('\n=== WRONG OPPONENTS (sampling top offenders) ===');
const opponentNames = ['阿根廷','巴西','德国','法国','英格兰','荷兰','西班牙','葡萄牙','意大利','比利时','克罗地亚','乌拉圭','日本','韩国','美国','墨西哥','加拿大','摩洛哥','塞内加尔','加纳','喀麦隆','尼日利亚','突尼斯','阿尔及利亚','埃及','伊朗','沙特','卡塔尔','澳大利亚','新西兰','哥伦比亚','智利','秘鲁','厄瓜多尔','巴拉圭','挪威','瑞典','丹麦','瑞士','波兰','捷克','奥地利','土耳其','乌克兰','塞尔维亚','科特迪瓦','伊拉克','阿联酋','中国'];
let wrongCount = 0;
for (const team of squads) {
  const tn = team.name;
  const group = teams.find(t => t.enName === tn)?.group || '?';
  const groupOpponents = (groupMap[group] || []).filter(n => n !== teams.find(t => t.enName === tn)?.cnName);
  
  for (const p of team.players) {
    const e = wiki[p.name];
    if (!e) continue;
    const all = (e.careerReview||'') + (e.wcSpotlight||'');
    
    for (const opp of opponentNames) {
      if (groupOpponents.includes(opp)) continue;
      
      const contexts = all.match(new RegExp(`对[阵位抗].{0,4}${opp}|${opp}.{0,3}(的)?左[路后卫]|${opp}.{0,3}(的)?右[路后卫]|${opp}.{0,3}(的)?防[线守]|${opp}.{0,3}(的)?锋[线群]|${opp}.{0,4}的速|${opp}.{0,4}的压|${opp}.{0,4}的进|${opp}.{0,4}(的)?反[击抢]|${opp}.{0,4}(的)?中[场路]|${opp}.{0,4}边[路锋]`, 'g'));
      if (contexts && contexts.length > 0) {
        wrongCount++;
        if (wrongCount <= 40) {
          console.log(`${team.name}[${group}] / ${p.name}: "${contexts[0]}" (not in group, real = ${groupOpponents.join('/')})`);
        }
      }
    }
  }
}
console.log(`Total wrong opponent refs: ${wrongCount}`);
