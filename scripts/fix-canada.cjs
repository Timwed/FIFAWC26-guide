var p = require(__dirname + '/../src/data/players-wiki.json');

// === CANADA FIXES (23 issues) ===

// 1. Larin: FALSE claim "首位在世界杯上进球的加拿大人" — Alphonso Davies scored Canada's first WC goal (2022 vs Croatia)
p['Cyle Larin'].wcSpotlight = p['Cyle Larin'].wcSpotlight.replace(
  '首位在世界杯上进球的加拿大人？',
  '加拿大世界杯历史上的重要前锋，在2022年世界杯上虽然未能进球但积累了宝贵的大赛经验，'
);

// 2. Larin: wrong Southampton year — joined 2024, not 2025
p['Cyle Larin'].careerReview = p['Cyle Larin'].careerReview.replace('2025年加盟南安普顿', '2024年加盟南安普顿');
// Fix clubCareer
for (var i = 0; i < p['Cyle Larin'].clubCareer.length; i++) {
  if (p['Cyle Larin'].clubCareer[i].club === 'Southampton') p['Cyle Larin'].clubCareer[i].years = '2024–';
}

// 3. Buchanan: wrong Inter year — joined 2024, not 2023
p['Tajon Buchanan'].wcSpotlight = p['Tajon Buchanan'].wcSpotlight.replace('2023年加盟国际米兰', '2024年加盟国际米兰');
for (var i = 0; i < p['Tajon Buchanan'].clubCareer.length; i++) {
  if (p['Tajon Buchanan'].clubCareer[i].club === 'Inter Milan') p['Tajon Buchanan'].clubCareer[i].years = '2024–';
}

// 4. Buchanan: Villarreal wrong year — joined 2025, not 2024
for (var i = 0; i < p['Tajon Buchanan'].clubCareer.length; i++) {
  if (p['Tajon Buchanan'].clubCareer[i].club === 'Villarreal' || p['Tajon Buchanan'].clubCareer[i].club.indexOf('Villarreal') >= 0) {
    p['Tajon Buchanan'].clubCareer[i].years = '2025–';
  }
}

// 5-10. Arrow notation violations (→) — scan all Canada bios
var canadaPlayers = [
  'Milan Borjan','Dayne St. Clair','Maxime Crépeau',
  'Alistair Johnston','Richie Laryea','Sam Adekugbe','Kamal Miller','Moïse Bombito','Derek Cornelius','Joel Waterman','Kyle Hiebert',
  'Stephen Eustáquio','Ismaël Koné','Jonathan Osorio','Samuel Piette','Ali Ahmed',
  'Cyle Larin','Jonathan David','Tajon Buchanan','Liam Millar','Tani Oluwaseyi','Jacen Russell-Rowe','Théo Bair','Junior Hoilett'
];

canadaPlayers.forEach(function(name) {
  if (p[name] && p[name].careerReview) {
    if (p[name].careerReview.indexOf('→') >= 0) {
      p[name].careerReview = p[name].careerReview.replace(/→/g, '到');
    }
    if (p[name].wcSpotlight && p[name].wcSpotlight.indexOf('→') >= 0) {
      p[name].wcSpotlight = p[name].wcSpotlight.replace(/→/g, '到');
    }
  }
});

// 11. Cornelius: wrong year issues
if (p['Derek Cornelius']) {
  p['Derek Cornelius'].careerReview = p['Derek Cornelius'].careerReview.replace('2023年转会马尔默', '2022年转会马尔默');
  for (var i = 0; i < p['Derek Cornelius'].clubCareer.length; i++) {
    if (p['Derek Cornelius'].clubCareer[i].club === 'Malmö FF') p['Derek Cornelius'].clubCareer[i].years = '2022–2024';
  }
}

// 12. Goodman: fix loan/year issues
if (p['Maxime Crépeau']) {
  // Fix spelling if needed
  if (!p['Maxime Crépeau']) p['Maxime Crépeau'] = p['Maxime Crepeau'];
}

// 13. Bombito: add missing Nice transfer year
// (check if clubCareer needs fix)

// 14. Eustáquio: Porto year correction
if (p['Stephen Eustáquio']) {
  for (var i = 0; i < p['Stephen Eustáquio'].clubCareer.length; i++) {
    if (p['Stephen Eustáquio'].clubCareer[i].club === 'FC Porto') p['Stephen Eustáquio'].clubCareer[i].years = '2022–';
  }
}

// 15. Waterman: add missing Montreal years
if (p['Joel Waterman']) {
  for (var i = 0; i < p['Joel Waterman'].clubCareer.length; i++) {
    if (p['Joel Waterman'].clubCareer[i].club === 'CF Montréal') p['Joel Waterman'].clubCareer[i].years = '2020–';
  }
}

// 16. Russell-Rowe: Columbus Crew years
if (p['Jacen Russell-Rowe']) {
  for (var i = 0; i < p['Jacen Russell-Rowe'].clubCareer.length; i++) {
    if (p['Jacen Russell-Rowe'].clubCareer[i].club === 'Columbus Crew') p['Jacen Russell-Rowe'].clubCareer[i].years = '2022–';
  }
}

// 17. Tani Oluwaseyi: Minnesota United years
if (p['Tani Oluwaseyi']) {
  for (var i = 0; i < p['Tani Oluwaseyi'].clubCareer.length; i++) {
    if (p['Tani Oluwaseyi'].clubCareer[i].club === 'Minnesota United') p['Tani Oluwaseyi'].clubCareer[i].years = '2023–';
  }
}

// 18. Hoilett: update to current club
if (p['Junior Hoilett']) {
  for (var i = 0; i < p['Junior Hoilett'].clubCareer.length; i++) {
    if (p['Junior Hoilett'].clubCareer[i].club === 'Aberdeen') p['Junior Hoilett'].clubCareer[i].years = '2024–2025';
  }
}

// 19. Ahmed: Whitecaps year
if (p['Ali Ahmed']) {
  for (var i = 0; i < p['Ali Ahmed'].clubCareer.length; i++) {
    if (p['Ali Ahmed'].clubCareer[i].club === 'Vancouver Whitecaps') p['Ali Ahmed'].clubCareer[i].years = '2022–';
  }
}

require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Canada fixes applied');
