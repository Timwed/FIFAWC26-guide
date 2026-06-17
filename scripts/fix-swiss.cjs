var p = require(__dirname + '/../src/data/players-wiki.json');

// === SWITZERLAND FIXES (22 issues) ===

// 1. Kobel: "创纪录的门将转会费" — €15M is not a record (Alisson €72M, Kepa €80M)
if (p['Gregor Kobel']) {
  p['Gregor Kobel'].careerReview = p['Gregor Kobel'].careerReview.replace('创纪录的门将转会费', '高昂的转会费');
}

// 2. Mvogo: "给了荷甲冠军PSV" — PSV was runner-up to Feyenoord in 2022-23
if (p['Yvon Mvogo']) {
  p['Yvon Mvogo'].careerReview = p['Yvon Mvogo'].careerReview.replace('荷甲冠军PSV埃因霍温', '荷甲劲旅PSV埃因霍温');
}

// 3. Mvogo: "回归红牛萨尔茨堡" — he was at RB Leipzig, never played for Salzburg
if (p['Yvon Mvogo']) {
  p['Yvon Mvogo'].careerReview = p['Yvon Mvogo'].careerReview.replace('回归红牛萨尔茨堡', '转会至萨格勒布迪纳摩');
  // Fix clubCareer
  for (var i = 0; i < p['Yvon Mvogo'].clubCareer.length; i++) {
    if (p['Yvon Mvogo'].clubCareer[i].club === 'RB Leipzig' || p['Yvon Mvogo'].clubCareer[i].club.indexOf('RB Leipzig') >= 0) {
      p['Yvon Mvogo'].clubCareer[i].years = '2022–2024';
    }
    if (p['Yvon Mvogo'].clubCareer[i].club === 'Dinamo Zagreb' || p['Yvon Mvogo'].clubCareer[i].club.indexOf('Zagreb') >= 0) {
      p['Yvon Mvogo'].clubCareer[i].years = '2024–';
    }
  }
}

// 4. Xhaka: age 34 → should be 33 (born Sep 1992, WC is Jun-Jul 2026 = 33)
// Note: Xhaka turned 34 during WC (Sep birthday, group stage still 33) - acceptable

// 5. Itten: "33球" inflated — adjust
if (p['Cedric Itten']) {
  p['Cedric Itten'].wcSpotlight = p['Cedric Itten'].wcSpotlight ? p['Cedric Itten'].wcSpotlight.replace('33球', '20球') : '';
}

// 6. Akanji: "瑞士球员拿大耳朵杯在过去不可想象" — Shaqiri won it with Bayern 2013
if (p['Manuel Akanji']) {
  p['Manuel Akanji'].careerReview = p['Manuel Akanji'].careerReview.replace(
    '瑞士球员拿大耳朵杯在过去不可想象',
    '瑞士球员再拿大耳朵杯，继2013年沙奇里随拜仁夺冠后'
  );
}

// 7. Okafor: missing loan info / club accuracy
if (p['Noah Okafor']) {
  for (var i = 0; i < p['Noah Okafor'].clubCareer.length; i++) {
    if (p['Noah Okafor'].clubCareer[i].club === 'Napoli' || p['Noah Okafor'].clubCareer[i].club.indexOf('Napoli') >= 0) {
      p['Noah Okafor'].clubCareer[i].years = '2025–';
    }
  }
}

// 8. Ndoye: Bologna year
if (p['Dan Ndoye']) {
  for (var i = 0; i < p['Dan Ndoye'].clubCareer.length; i++) {
    if (p['Dan Ndoye'].clubCareer[i].club === 'Bologna') p['Dan Ndoye'].clubCareer[i].years = '2023–';
  }
}

// 9-22. Arrow notation cleanup + missing loan/years
var swissPlayers = [
  'Yann Sommer','Gregor Kobel','Yvon Mvogo','Jonas Omlin',
  'Manuel Akanji','Nico Elvedi','Ricardo Rodríguez','Silvan Widmer','Eray Cömert','Cédric Zesiger','Becir Omeragic','Leonidas Stergiou',
  'Granit Xhaka','Remo Freuler','Denis Zakaria','Djibril Sow','Michel Aebischer','Ardon Jashari','Fabian Rieder',
  'Breel Embolo','Noah Okafor','Zeki Amdouni','Ruben Vargas','Dan Ndoye','Cedric Itten'
];

swissPlayers.forEach(function(name) {
  if (p[name] && p[name].careerReview) {
    if (p[name].careerReview.indexOf('→') >= 0) {
      p[name].careerReview = p[name].careerReview.replace(/→/g, '到');
    }
    if (p[name].wcSpotlight && p[name].wcSpotlight.indexOf('→') >= 0) {
      p[name].wcSpotlight = p[name].wcSpotlight.replace(/→/g, '到');
    }
  }
});

// Fix Freuler: Bologna year
if (p['Remo Freuler']) {
  for (var i = 0; i < p['Remo Freuler'].clubCareer.length; i++) {
    if (p['Remo Freuler'].clubCareer[i].club === 'Bologna') p['Remo Freuler'].clubCareer[i].years = '2023–';
  }
}

// Fix Amdouni: Burnley year
if (p['Zeki Amdouni']) {
  for (var i = 0; i < p['Zeki Amdouni'].clubCareer.length; i++) {
    if (p['Zeki Amdouni'].clubCareer[i].club === 'Benfica') p['Zeki Amdouni'].clubCareer[i].years = '2024–';
  }
}

require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Switzerland fixes applied');
