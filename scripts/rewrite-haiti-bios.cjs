const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

// Fix B-tier WS overshoots (trim 2-4 chars)
d['Johny Placide'].wcSpotlight = d['Johny Placide'].wcSpotlight.replace('起点就是他的手。','起点就是这双手。');
d['Ricardo Adé'].wcSpotlight = d['Ricardo Adé'].wcSpotlight.replace('他就是防线的备选答案。','他就是防线备选。');

// Fix Danley Jean Jacques WS (trim 3 chars) - change "任务简朴" to "任务简单"
d['Danley Jean Jacques'].wcSpotlight = d['Danley Jean Jacques'].wcSpotlight.replace('任务简朴：','任务简单：');

// Fix C-tier CR overshoots (trim each ~7 chars)
d['Keeto Thermoncy'].careerReview = d['Keeto Thermoncy'].careerReview.replace('加速成长。','成长加速。');
d['Keeto Thermoncy'].careerReview = d['Keeto Thermoncy'].careerReview.replace('就是加速成长。但入选','但入选');
d['Keeto Thermoncy'].careerReview = d['Keeto Thermoncy'].careerReview.replace('的速度在同龄中','在同龄中');

d['Martin Expérience'].careerReview = d['Martin Expérience'].careerReview.replace('南锡青训赋予了他法式老派中卫的沉稳——不是最快的但永远知道站住什么位置。','南锡青训赋予他法式老派中卫沉稳——不快但永远知道站什么位置。');
d['Martin Expérience'].careerReview = d['Martin Expérience'].careerReview.replace('的比赛节奏','节奏');

d['Garven Metusala'].careerReview = d['Garven Metusala'].careerReview.replace('——空中争顶成功率在USL排名前列，','——空中争顶领先USL，');
d['Garven Metusala'].careerReview = d['Garven Metusala'].careerReview.replace('更注重身体对抗，更习惯北美式','更偏身体对抗和北美');

d['Jean-Kévin Duverne'].careerReview = d['Jean-Kévin Duverne'].careerReview.replace('对巴黎里昂马赛豪门锋线','对法甲豪门锋线');

d['Woodensky Pierre'].careerReview = d['Woodensky Pierre'].careerReview.replace('皮埃尔是极少数','皮埃尔是少数');

// Fix C-tier WS undershoots (add 2-6 chars)
d['Carl Sainté'].wcSpotlight = d['Carl Sainté'].wcSpotlight.replace('就是给贝勒加德打扫卫生。','就是为贝勒加德扫清障碍。');
d['Alexandre Pierre'].wcSpotlight = d['Alexandre Pierre'].wcSpotlight.replace('普拉西德38岁身体','普拉西德38岁的身体');
d['Ruben Providence'].wcSpotlight = d['Ruben Providence'].wcSpotlight.replace('阵地战中为数不多的','阵地战中为数极少且');
d['Josué Casimir'].wcSpotlight = d['Josué Casimir'].wcSpotlight.replace('法国式攻防对抗','法式攻防对抗');
d['Josué Casimir'].wcSpotlight = d['Josué Casimir'].wcSpotlight.replace('积累信心。','积累坚实信心。');
d['Josué Duverger'].wcSpotlight = d['Josué Duverger'].wcSpotlight.replace('德式门将训练能给','德式门将训练方法能给');
d['Wilguens Paugain'].wcSpotlight = d['Wilguens Paugain'].wcSpotlight.replace('他的名字可能在','他的名字或许就将在');

// Save
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(d, null, 2), 'utf8');
console.log('Fixes applied.\n');

// Verify
const ranges = {
  A: { totalMin: 380, totalMax: 480, crMin: 220, crMax: 280, wsMin: 160, wsMax: 220 },
  B: { totalMin: 300, totalMax: 380, crMin: 170, crMax: 220, wsMin: 130, wsMax: 170 },
  C: { totalMin: 250, totalMax: 320, crMin: 120, crMax: 170, wsMin: 120, wsMax: 160 },
};

const list = [
  { n: 'Duckens Nazon', t: 'A' }, { n: 'Jean-Ricner Bellegarde', t: 'A' }, { n: 'Frantzdy Pierrot', t: 'A' },
  { n: 'Johny Placide', t: 'B' }, { n: 'Carlens Arcus', t: 'B' }, { n: 'Ricardo Adé', t: 'B' },
  { n: 'Derrick Etienne Jr.', t: 'B' }, { n: 'Louicius Deedson', t: 'B' }, { n: 'Danley Jean Jacques', t: 'B' },
  { n: 'Wilson Isidor', t: 'B' }, { n: 'Hannes Delcroix', t: 'B' },
  { n: 'Keeto Thermoncy', t: 'C' }, { n: 'Carl Sainté', t: 'C' }, { n: 'Martin Expérience', t: 'C' },
  { n: 'Alexandre Pierre', t: 'C' }, { n: 'Duke Lacroix', t: 'C' }, { n: 'Garven Metusala', t: 'C' },
  { n: 'Ruben Providence', t: 'C' }, { n: 'Lenny Joseph', t: 'C' }, { n: 'Yassin Fortuné', t: 'C' },
  { n: 'Josué Casimir', t: 'C' }, { n: 'Jean-Kévin Duverne', t: 'C' }, { n: 'Josué Duverger', t: 'C' },
  { n: 'Wilguens Paugain', t: 'C' }, { n: 'Dominique Simon', t: 'C' }, { n: 'Woodensky Pierre', t: 'C' },
];

let passes = 0, fails = 0;
const totalsByTier = { A: [], B: [], C: [] };

list.forEach(({ n, t }) => {
  const p = d[n];
  const cr = (p.careerReview || '').length;
  const ws = (p.wcSpotlight || '').length;
  const total = cr + ws;
  const r = ranges[t];

  const issues = [];
  if (cr < r.crMin || cr > r.crMax) issues.push('CR ' + cr + '/' + r.crMin + '-' + r.crMax);
  if (ws < r.wsMin || ws > r.wsMax) issues.push('WS ' + ws + '/' + r.wsMin + '-' + r.wsMax);
  if (total < r.totalMin || total > r.totalMax) issues.push('TOT ' + total + '/' + r.totalMin + '-' + r.totalMax);

  if (issues.length === 0) { passes++; } else { fails++; }
  console.log('[' + t + '] ' + n + ': CR=' + cr + ' WS=' + ws + ' TOT=' + total + (issues.length ? ' !! ' + issues.join(' ') : ''));
  totalsByTier[t].push(total);
});

console.log('\n=== TIER SUMMARIES ===');
['A', 'B', 'C'].forEach(t => {
  const arr = totalsByTier[t], r = ranges[t];
  const min = Math.min(...arr), max = Math.max(...arr), avg = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  console.log(t + '-tier: target ' + r.totalMin + '-' + r.totalMax + ' | min=' + min + ' max=' + max + ' avg=' + avg);
});

console.log('\n' + passes + ' PASS, ' + fails + ' FAIL');
