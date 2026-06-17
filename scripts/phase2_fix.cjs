// Phase 2: Fix 1 derogatory + 21 fluff items
const fs = require('fs');
const wikiPath = 'src/data/players-wiki.json';
const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// 1. Derogatory: Ghana/Thomas Partey - "被击穿" -> "被渗透"
wiki['Thomas Partey'].wcSpotlight = wiki['Thomas Partey'].wcSpotlight.replace('不被击穿', '不被渗透');

// 2. Fluff: replace all 21 instances
const fluffFixes = [
  // Bosnia
  {name: 'Arjan Malić', field: 'wcSpotlight', pattern: '价值连城', replacement: '宝贵'},
  // Switzerland
  {name: 'Granit Xhaka', field: 'careerReview', pattern: '最伟大', replacement: '最重要'},
  // Ecuador
  {name: 'Enner Valencia', field: 'careerReview', pattern: '最伟大', replacement: '最具代表性'},
  // Germany
  {name: 'Manuel Neuer', field: 'careerReview', pattern: '最伟大', replacement: '最传奇'},
  // Japan
  {name: 'Zion Suzuki', field: 'wcSpotlight', pattern: '价值连城', replacement: '宝贵'},
  // Belgium
  {name: 'Thibaut Courtois', field: 'careerReview', pattern: '载入史册', replacement: '确立地位'},
  {name: 'Thibaut Courtois', field: 'wcSpotlight', pattern: '载入史册', replacement: '确立地位'},
  {name: 'Kevin De Bruyne', field: 'careerReview', pattern: '最伟大', replacement: '顶尖'},
  {name: 'Leandro Trossard', field: 'wcSpotlight', pattern: '价值连城', replacement: '关键'},
  // Egypt
  {name: 'Mohamed Salah', field: 'wcSpotlight', pattern: '最伟大', replacement: '最具影响力'},
  // Iran
  {name: 'Alireza Beiranvand', field: 'careerReview', pattern: '封神', replacement: '奠定地位'},
  {name: 'Mehdi Taremi', field: 'careerReview', pattern: '最伟大', replacement: '最出色'},
  {name: 'Rouzbeh Cheshmi', field: 'wcSpotlight', pattern: '载入史册', replacement: '令人铭记'},
  // Spain
  {name: 'Rodri', field: 'careerReview', pattern: '封神', replacement: '奠定历史地位'},
  {name: 'Lamine Yamal', field: 'careerReview', pattern: '最伟大', replacement: '顶尖'},
  // France
  {name: "N'Golo Kanté", field: 'careerReview', pattern: '最伟大', replacement: '顶尖'},
  // Algeria
  {name: 'Riyad Mahrez', field: 'careerReview', pattern: '最伟大', replacement: '最具代表性'},
  // DR Congo
  {name: 'Cédric Bakambu', field: 'wcSpotlight', pattern: '最伟大', replacement: '至关重要'},
  // Portugal
  {name: 'Diogo Costa', field: 'wcSpotlight', pattern: '封神', replacement: '奠定地位'},
  {name: 'Cristiano Ronaldo', field: 'careerReview', pattern: '最伟大', replacement: '最具标志性'},
  // Croatia
  {name: 'Luka Modrić', field: 'careerReview', pattern: '最伟大', replacement: '最具标志性'},
  // Ghana
  {name: 'Jordan Ayew', field: 'careerReview', pattern: '最伟大', replacement: '最重要'},
];

for (const f of fluffFixes) {
  if (!wiki[f.name]) { console.log('MISSING: ' + f.name); continue; }
  wiki[f.name][f.field] = wiki[f.name][f.field].replace(f.pattern, f.replacement);
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log('Phase 2 fixes applied. Verifying...');
// Verify
let wiki2 = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const derogatoryRe = /灾难|击穿|幼儿|粉碎.*防线|噪声.*数据|遥不可及.*世界杯|跑道上|不可能.*应对/g;
const fluffRe = /最伟大|封神|价值连城|大学课程|人生里程碑|人生资产|至高嘉奖|载入史册|史诗.*对决|全世界都相信|决定性的球员|终极舞台|最顶级.*实现/g;
let dero = 0, fluff = 0;
for (const [k, v] of Object.entries(wiki2)) {
  const all = (v.careerReview||'') + (v.wcSpotlight||'');
  if (derogatoryRe.test(all)) { dero++; console.log('DERO REMAINS: ' + k); }
  if (fluffRe.test(all)) { fluff++; console.log('FLUFF REMAINS: ' + k); }
}
console.log(`Derogatory remaining: ${dero}`);
console.log(`Fluff remaining: ${fluff}`);
console.log('DONE.');
