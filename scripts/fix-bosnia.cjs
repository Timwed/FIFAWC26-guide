var p = require(__dirname + '/../src/data/players-wiki.json');

// === BOSNIA FIXES ===

// 1. Džeko: "在国际米兰随队拿下英超后又添了一座意甲冠军奖杯" → false (Inter doesn't play in EPL, and he left before they won Serie A)
p['Edin Džeko'].careerReview = p['Edin Džeko'].careerReview.replace(
  '后来在国际米兰随队拿下英超后又添了一座意甲冠军奖杯',
  '后来在国际米兰随队打入欧冠决赛并拿下两座意大利杯'
);

// 2. Džeko: "第六届世界杯" → second World Cup (Bosnia only qualified 2014 + 2026)
p['Edin Džeko'].wcSpotlight = p['Edin Džeko'].wcSpotlight.replace(
  '第六届世界杯？',
  '第二届世界杯。'
);

// 3. Džeko: Add Czech clubs (2005-2007) to clubCareer
p['Edin Džeko'].clubCareer.splice(1, 0, {years:'2005–2006',club:'Ústí nad Labem'},{years:'2006–2007',club:'Teplice'});
// Also add mention in careerReview
p['Edin Džeko'].careerReview = p['Edin Džeko'].careerReview.replace(
  '从热列兹尼察到沃尔夫斯堡',
  '从热列兹尼察到捷克特普利采（含租借拉贝河畔乌斯季），在捷克联赛的进球效率引起了德甲球探的注意后转会沃尔夫斯堡'
);

// 4. Kolašinac: "在阿森纳和埃梅里告别后短暂效力马赛" → Emery left 2+ years before him
p['Sead Kolašinac'].careerReview = p['Sead Kolašinac'].careerReview.replace(
  '在阿森纳和埃梅里告别后短暂效力马赛',
  '在阿森纳效力四个半赛季后短暂效力马赛'
);

// 5. Kolašinac: "已经在亚特兰大三年多的意甲淬炼" → exactly 3 seasons, not "more than 3"
p['Sead Kolašinac'].careerReview = p['Sead Kolašinac'].careerReview.replace(
  '在亚特兰大三年多的意甲淬炼',
  '在亚特兰大三个赛季的意甲淬炼'
);
p['Sead Kolašinac'].wcSpotlight = p['Sead Kolašinac'].wcSpotlight.replace(
  '在亚特兰大三年多的意甲淬炼',
  '在亚特兰大三个赛季的意甲淬炼'
);

// 6. Kolašinac: Marseille "2022–2023" should note Jan 2022 arrival
// (Keeping the year format consistent with other entries, just adding note in careerReview is sufficient)

// 7. Dedić: Missing FC Liefering (2019-2021) before RB Salzburg
p['Amar Dedić'].clubCareer.unshift({years:'2019–2021',club:'FC Liefering'});
p['Amar Dedić'].careerReview = p['Amar Dedić'].careerReview.replace(
  '萨尔茨堡红牛兵工厂出品——德迪奇在奥地利的三个赛季里',
  '萨尔茨堡红牛兵工厂出品——德迪奇在利弗灵完成职业首秀后被提拔至萨尔茨堡一线队，在奥地利的三个赛季里'
);

// 8. Dedić: "五大联赛级别俱乐部" → Portugal is not top-5 league
p['Amar Dedić'].careerReview = p['Amar Dedić'].careerReview.replace(
  '敲开了五大联赛级别俱乐部的大门',
  '敲开了欧冠常客级别俱乐部的大门'
);

// 9. Demirović: "西班牙阿拉维斯青训培养" → actually RB Leipzig youth
p['Ermedin Demirović'].careerReview = p['Ermedin Demirović'].careerReview.replace(
  '西班牙阿拉维斯青训培养出来的异类前锋——德米罗维奇踢着一种介于中锋和影锋之间的角色，19岁就为阿拉维斯出战西甲让他早早接触到了顶级联赛的残酷',
  '汉堡出生、莱比锡红牛青训培养出来的前锋——德米罗维奇在红牛体系中接受了德国足球的战术教育，19岁转会阿拉维斯出战西甲让他早早接触到了顶级联赛的残酷'
);

// 10. Tahirović: "从罗马青训" → started at Vasalunds IF (Sweden)
p['Benjamin Tahirović'].careerReview = p['Benjamin Tahirović'].careerReview.replace(
  '从罗马青训到阿贾克斯主力',
  '从瑞典瓦萨伦兹到罗马再到阿贾克斯主力'
);
p['Benjamin Tahirović'].clubCareer.unshift({years:'2020–2021',club:'Vasalunds IF'});

// 11. Katić: Missing Hajduk Split loan (2021-22)
p['Nikola Katić'].clubCareer.splice(2, 0, {years:'2021–2022',club:'Hajduk Split'});
p['Nikola Katić'].careerReview = p['Nikola Katić'].careerReview.replace(
  '在苏超他是著名的',
  '之后租借至哈伊杜克斯普利特恢复比赛状态，回归流浪者后他是著名的'
);

// 12. Hadžikadunić: Add Rostov return between Mallorca and Sampdoria
p['Dennis Hadžikadunić'].clubCareer.splice(3, 0, {years:'2024–2025',club:'Rostov'});
p['Dennis Hadžikadunić'].careerReview = p['Dennis Hadžikadunić'].careerReview.replace(
  '变得更加全面',
  '变得更加全面。马洛卡租借结束后回到罗斯托夫继续效力半个赛季，之后转会桑普多利亚重返意大利足坛'
);

require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Bosnia fixes applied');
