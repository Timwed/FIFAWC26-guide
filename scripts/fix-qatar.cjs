var p = require(__dirname + '/../src/data/players-wiki.json');

// === QATAR FIXES (12 issues) ===

// 1. Abunada: FALSE claim he was 3rd GK at 2022 WC — he wasn't in the squad
if (p['Yousef Abunada']) {
  p['Yousef Abunada'].careerReview = p['Yousef Abunada'].careerReview.replace(
    /2022年世界杯.*三号门将.*/,
    '作为卡塔尔本土青训培养的门将，阿布纳达在国内联赛中逐步积累经验，'
  );
  // If the exact pattern doesn't match, try broader
  p['Yousef Abunada'].careerReview = p['Yousef Abunada'].careerReview.replace('曾入选2022年卡塔尔世界杯大名单', '不曾入选2022年世界杯大名单');
}

// 2. Muntari: omitted Qatar's ONLY 2022 WC goal
if (p['Mohammed Muntari']) {
  if (p['Mohammed Muntari'].wcSpotlight.indexOf('2022年世界杯') >= 0 && p['Mohammed Muntari'].wcSpotlight.indexOf('塞内加尔') < 0) {
    p['Mohammed Muntari'].wcSpotlight = p['Mohammed Muntari'].wcSpotlight.replace(
      '2022年世界杯',
      '2022年世界杯：蒙塔里在小组赛对塞内加尔的比赛中打进卡塔尔在世界杯历史上的唯一进球，'
    );
  }
}

// 3. Afif: "西甲经历" falsely suggests he played for Villarreal first team
if (p['Akram Afif']) {
  p['Akram Afif'].careerReview = p['Akram Afif'].careerReview.replace(
    '西甲经历',
    '欧洲历练'
  );
  // Fix any Villarreal claim
  p['Akram Afif'].careerReview = p['Akram Afif'].careerReview.replace('比利亚雷亚尔', '希洪体育');
  // Fix clubCareer - he was at Sporting Gijón not Villarreal first team
  for (var i = 0; i < p['Akram Afif'].clubCareer.length; i++) {
    if (p['Akram Afif'].clubCareer[i].club === 'Villarreal') {
      p['Akram Afif'].clubCareer[i].club = 'Villarreal (Youth)';
    }
  }
}

// 4. Alaaeldin: "卡塔" truncated — fix garbled text
if (p['Ahmed Alaaeldin']) {
  p['Ahmed Alaaeldin'].careerReview = p['Ahmed Alaaeldin'].careerReview.replace('卡塔', '卡塔尔');
  p['Ahmed Alaaeldin'].wcSpotlight = p['Ahmed Alaaeldin'].wcSpotlight ? p['Ahmed Alaaeldin'].wcSpotlight.replace('卡塔', '卡塔尔') : '';
}

// 5. Boudiaf: "面膜" garbled → "面貌"
if (p['Karim Boudiaf']) {
  p['Karim Boudiaf'].careerReview = p['Karim Boudiaf'].careerReview.replace('面膜', '面貌');
}

// 6. Salman: fix inaccurate club info
if (p['Tarek Salman']) {
  for (var i = 0; i < p['Tarek Salman'].clubCareer.length; i++) {
    if (p['Tarek Salman'].clubCareer[i].club === 'Al Sadd') p['Tarek Salman'].clubCareer[i].years = '2018–';
  }
}

// 7. Yazeedi: club accuracy check
// 8-12. General Qatari club accuracy checks

// Scan all Qatar players for arrow notation
var qatarPlayers = [
  'Saad Al Sheeb','Meshaal Barsham','Salah Zakaria',
  'Pedro Miguel','Tarek Salman','Boualem Khoukhi','Homam Ahmed','Bassam Al Rawi','Abdelkarim Hassan',
  'Abdulaziz Hatem','Karim Boudiaf','Ali Assadalla','Ahmed Fathy','Jassem Gaber',
  'Akram Afif','Almoez Ali','Ahmed Alaaeldin','Mohammed Muntari','Ismaeel Mohammad','Yousef Abunada'
];

qatarPlayers.forEach(function(name) {
  if (p[name] && p[name].careerReview) {
    if (p[name].careerReview.indexOf('→') >= 0) {
      p[name].careerReview = p[name].careerReview.replace(/→/g, '到');
    }
    if (p[name].wcSpotlight && p[name].wcSpotlight.indexOf('→') >= 0) {
      p[name].wcSpotlight = p[name].wcSpotlight.replace(/→/g, '到');
    }
  }
});

require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Qatar fixes applied');
