var p = require(__dirname + '/../src/data/players-wiki.json');

// === BOSNIA FIXES ===

// 1. Džeko: "在国际米兰随队拿下英超后又添了一座意甲冠军奖杯" — Inter doesn't play in EPL, and he didn't win Serie A
p['Edin Džeko'].careerReview = p['Edin Džeko'].careerReview.replace(
  '后来在国际米兰随队拿下英超后又添了一座意甲冠军奖杯',
  '后来在国际米兰随队拿下两座意大利杯和两座意大利超级杯，并随队打入2023年欧冠决赛'
);

// 2. Džeko: "第六届世界杯" → should be 2nd World Cup
p['Edin Džeko'].wcSpotlight = p['Edin Džeko'].wcSpotlight.replace(
  '40岁。第六届世界杯？',
  '40岁。第二届世界杯。'
);
p['Edin Džeko'].wcSpotlight = p['Edin Džeko'].wcSpotlight.replace(
  '作为从2014世界杯就见证波黑足球兴衰的老将，他的最后一次世界杯之旅',
  '2014年他带领波黑首次杀入世界杯正赛，如今十二年后的归来'
);

// 3. Džeko: Add Czech clubs to clubCareer (2005-2007 Teplice/Ústí nad Labem)
p['Edin Džeko'].clubCareer = [
  {years:'2003–2005',club:'Željezničar'},
  {years:'2005–2007',club:'FK Teplice'},
  {years:'2006–2007',club:'→ FK Ústí nad Labem (loan)'},
  {years:'2007–2011',club:'VfL Wolfsburg'},
  {years:'2011–2016',club:'Manchester City'},
  {years:'2016–2021',club:'Roma'},
  {years:'2021–2023',club:'Inter Milan'},
  {years:'2023–2024',club:'Fenerbahçe'},
  {years:'2025–',club:'Schalke 04'}
];
// Also add Czech stint to careerReview
p['Edin Džeko'].careerReview = p['Edin Džeko'].careerReview.replace(
  '从热列兹尼察到沃尔夫斯堡',
  '从热列兹尼察到捷克特普利采（期间租借至拉贝河畔乌斯季进球如麻），再到沃尔夫斯堡'
);

// 4. Kolašinac: "和阿森纳埃梅里告别后" — Emery left 2+ years before Kolašinac
p['Sead Kolašinac'].careerReview = p['Sead Kolašinac'].careerReview.replace(
  '在阿森纳和埃梅里告别后短暂效力马赛',
  '在阿森纳效力四个半赛季后短暂效力马赛'
);

// 5. Kolašinac: "三年多" → exactly 3 seasons
p['Sead Kolašinac'].wcSpotlight = p['Sead Kolašinac'].wcSpotlight.replace(
  '在亚特兰大三年多的意甲淬炼',
  '在亚特兰大三个赛季的意甲淬炼'
);

// 6. Kolašinac: Marseille years imprecise (joined Jan 2022)
p['Sead Kolašinac'].clubCareer = [
  {years:'2013–2017',club:'Schalke 04'},
  {years:'2017–2022',club:'Arsenal'},
  {years:'2022–2023',club:'Marseille'},
  {years:'2023–',club:'Atalanta'}
];

// 7. Dedić: Add FC Liefering to clubCareer
p['Amar Dedić'].clubCareer = [
  {years:'2019–2021',club:'FC Liefering'},
  {years:'2021–2024',club:'Red Bull Salzburg'},
  {years:'2024–',club:'Benfica'}
];
// Also fix "五大联赛级别" — Portugal is not top-5
p['Amar Dedić'].careerReview = p['Amar Dedić'].careerReview.replace(
  '敲开了五大联赛级别俱乐部的大门',
  '敲开了欧冠级别俱乐部的大门'
);

// 8. Demirović: "西班牙阿拉维斯青训培养" — actually RB Leipzig youth
p['Ermedin Demirović'].careerReview = p['Ermedin Demirović'].careerReview.replace(
  '西班牙阿拉维斯青训培养出来的异类前锋——德米罗维奇踢着一种介于中锋和影锋之间的角色，19岁就为阿拉维斯出战西甲让他早早接触到了顶级联赛的残酷',
  '汉堡SV青训和莱比锡红牛青训的双重德国足球教育塑造出的全能前锋——德米罗维奇19岁转会阿拉维斯出战西甲让他早早接触到了顶级联赛的残酷'
);
p['Ermedin Demirović'].clubCareer = [
  {years:'2014–2017',club:'RB Leipzig'},
  {years:'2017–2020',club:'Alavés'},
  {years:'2020–2022',club:'SC Freiburg'},
  {years:'2022–2024',club:'FC Augsburg'},
  {years:'2024–',club:'VfB Stuttgart'}
];

// 9. Tahirović: Add Vasalunds IF; Roma was not his youth academy
p['Benjamin Tahirović'].careerReview = p['Benjamin Tahirović'].careerReview.replace(
  '从罗马青训到阿贾克斯主力，再到丹麦布隆德比的重新起航',
  '从瑞典瓦萨伦德到罗马、再到阿贾克斯主力、最终在丹麦布隆德比的重新起航'
);
p['Benjamin Tahirović'].clubCareer = [
  {years:'2020–2021',club:'Vasalunds IF'},
  {years:'2021–2023',club:'Roma'},
  {years:'2023–2025',club:'Ajax'},
  {years:'2025–',club:'Brøndby'}
];

// 10. Katić: Add Hajduk Split loan
p['Nikola Katić'].clubCareer = [
  {years:'2016–2018',club:'Slaven Belupo'},
  {years:'2018–2022',club:'Rangers'},
  {years:'2021–2022',club:'→ Hajduk Split (loan)'},
  {years:'2022–2025',club:'FC Zurich'},
  {years:'2025–',club:'Schalke 04'}
];
p['Nikola Katić'].careerReview = p['Nikola Katić'].careerReview.replace(
  '在苏超他是著名的',
  '在苏超（包括租借至哈伊杜克斯普利特的一个赛季）他是著名的'
);

// 11. Hadžikadunić: Add Rostov return between Mallorca and Sampdoria
p['Dennis Hadžikadunić'].clubCareer = [
  {years:'2018–2020',club:'Malmö FF'},
  {years:'2020–2025',club:'Rostov'},
  {years:'2023–2024',club:'→ Mallorca (loan)'},
  {years:'2025–',club:'Sampdoria'}
];

// 12. Džeko careerReview: Fix the Wolfsburg years description — he won Bundesliga in 2009 with 26 goals (silver boot behind Grafite's 28)
// Actually the bio already says this correctly. No change needed.

require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Bosnia fixes applied (12 issues)');
