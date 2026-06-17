const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const d = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// ============================================================
// FIX 1: Yassine Bounou — birthplace is Montreal, not Casablanca
// ============================================================
const bounou = d['Yassine Bounou'];
bounou.careerReview = bounou.careerReview.replace(
  '卡萨布兰卡出生，维达德青训起步',
  '加拿大蒙特利尔出生、卡萨布兰卡长大，维达德青训起步'
);

// ============================================================
// FIX 2: Munir Mohamedi — missing Málaga CF 2017–2020 in clubCareer
// ============================================================
const munir = d['Munir Mohamedi'];
// Insert Málaga CF between Numancia and RS Berkane
munir.clubCareer = [
  { years: '2010–2017', club: 'Numancia' },
  { years: '2017–2020', club: 'Málaga' },
  { years: '2020–', club: 'RS Berkane' }
];

// ============================================================
// FIX 3: Sofyan Amrabat — "22次抢断全部成功" is unverifiable
// FIFA official stats tracked 14 tackles; 22 conflates tackles with
// ball recoveries/interceptions. Change to defensible language.
// ============================================================
const amrabat = d['Sofyan Amrabat'];
amrabat.careerReview = amrabat.careerReview.replace(
  '场均跑动12.3公里、22次抢断全部成功',
  '场均跑动12.3公里、抢断数据领跑全队'
);

// ============================================================
// FIX 4: Azzedine Ounahi — "场均4.3次盘带过人" is inflated
// Commonly cited WC 2022 stats put him at ~2.8–3.1 per game.
// ============================================================
const ounahi = d['Azzedine Ounahi'];
ounahi.careerReview = ounahi.careerReview.replace(
  '卡塔尔世界杯上他场均4.3次盘带过人',
  '卡塔尔世界杯上他场均盘带过人名列赛事前茅'
);

fs.writeFileSync(wikiPath, JSON.stringify(d, null, 2), 'utf8');

console.log('fix-morocco-audit.cjs: Applied 4 fixes');
console.log('  1. Bounou birthplace: Casablanca -> Montreal/Casablanca');
console.log('  2. Munir Mohamedi clubCareer: added Málaga CF (2017–2020)');
console.log('  3. Amrabat: "22次抢断全部成功" -> "抢断数据领跑全队"');
console.log('  4. Ounahi: "场均4.3次盘带过人" -> "场均盘带过人名列赛事前茅"');
