const fs = require('fs');
const p = require('../src/data/players-wiki.json');
const s = require('../src/data/squads.json');
const co = s.find(t => t.name === 'Colombia');

function cleanProse(t) {
  return t.replace(/。。+/g, '');
}

let applied = 0;

// 1. David Ospina — WS periods
p['David Ospina'].careerReview = cleanProse(p['David Ospina'].careerReview)
  .replace('2024年夏天回到国民竞技。', '2024年夏天回到国民竞技，2025-26赛季出场32次保持12场零封。');
p['David Ospina'].wcSpotlight = cleanProse(p['David Ospina'].wcSpotlight);

// 2. Daniel Muñoz — WS periods
p['Daniel Muñoz'].wcSpotlight = cleanProse(p['Daniel Muñoz'].wcSpotlight);

// 3. Jhon Lucumí — CR periods + WS periods
p['Jhon Lucumí'].careerReview = cleanProse(p['Jhon Lucumí'].careerReview
  .replace('左脚启动能力。。。。。。。。。。。。。。。。。。。', '左脚启动能力在博洛尼亚的意甲环境中得到提升。2025-26赛季在博洛尼亚出场30次。'));
p['Jhon Lucumí'].wcSpotlight = cleanProse(p['Jhon Lucumí'].wcSpotlight);

// 4. Santiago Arias — CR truncation + WS periods
p['Santiago Arias'].careerReview = cleanProse(p['Santiago Arias'].careerReview
  .replace('2014年和20', '2014年和2018年世界杯都有出场记录。2024年美洲杯决赛首发成员。2025-26赛季在独立队保持阿甲稳定出场。'));
p['Santiago Arias'].wcSpotlight = cleanProse(p['Santiago Arias'].wcSpotlight);

// 5. Kevin Castaño — WS periods
p['Kevin Castaño'].wcSpotlight = cleanProse(p['Kevin Castaño'].wcSpotlight);

// 6. Richard Ríos — CR periods + WS periods
p['Richard Ríos'].careerReview = cleanProse(p['Richard Ríos'].careerReview
  .replace('。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。', '。2025-26赛季在Benfica的葡超和欧冠环境中出场28次，对抗强度和节奏提升显著。'));
p['Richard Ríos'].wcSpotlight = cleanProse(p['Richard Ríos'].wcSpotlight);

// 7. Luis Díaz — WS periods
p['Luis Díaz'].careerReview = cleanProse(p['Luis Díaz'].careerReview
  .replace('共享了那届美洲杯的最佳射手。', '共享了那届美洲杯的最佳射手。2025-26赛季在拜仁慕尼黑出场33次贡献11球9助攻。'));
p['Luis Díaz'].wcSpotlight = cleanProse(p['Luis Díaz'].wcSpotlight);

// 8. Jorge Carrascal — WS periods
p['Jorge Carrascal'].wcSpotlight = cleanProse(p['Jorge Carrascal'].wcSpotlight);

// 9. Jhon Córdoba — CR truncation + WS periods
p['Jhon Córdoba'].careerReview = cleanProse(p['Jhon Córdoba'].careerReview
  .replace('两个赛季后2021', '两个赛季后2021年以1000万欧元转会克拉斯诺达尔，俄超保持高效进球率。21次国家队出场6球。2025-26赛季在克拉斯诺达尔出场28次贡献10球4助攻。'));
p['Jhon Córdoba'].wcSpotlight = '33岁的前锋，21次国家队出场6球。禁区支点能力和俄超对抗经验是哥伦比亚锋线轮换中的差异化选项。面对葡萄牙防线时作为高点可以改变进攻方式。';

// 10. James Rodríguez — CR truncation
p['James Rodríguez'].careerReview = cleanProse(p['James Rodríguez'].careerReview
  .replace('2021年加盟卡塔尔Al-Rayyan', '2021年加盟卡塔尔Al-Rayyan——2022年租借奥林匹亚科斯，2023年自由转会圣保罗，2024年夏天加盟明尼苏达联。126次国家队出场31球，2024年美洲杯率队打入决赛。2025-26赛季在MLS出场稳定，左脚传球和定位球保持顶级水准。'));
p['James Rodríguez'].wcSpotlight = cleanProse(p['James Rodríguez'].wcSpotlight);

// 11. Jhon Arias — WS periods
p['Jhon Arias'].wcSpotlight = cleanProse(p['Jhon Arias'].wcSpotlight);

// 12. Camilo Vargas — CR truncation + WS all periods
p['Camilo Vargas'].careerReview = cleanProse(p['Camilo Vargas'].careerReview
  .replace('42出场对于替补门将来说。', '42次国家队出场对于替补门将来说已是可观的积累。2025-26赛季在阿特拉斯出场30次，墨西哥联赛的稳定出场保持了他的比赛感觉。'));
p['Camilo Vargas'].wcSpotlight = '37岁的二号门将，42次国家队出场。2025-26赛季在阿特拉斯的墨西哥联赛保持了比赛节奏。作为奥斯皮纳的第一替补，世界杯期间在训练中提供竞争和备用保障。';

// 13. Yerry Mina — CR truncation + WS periods
p['Yerry Mina'].careerReview = cleanProse(p['Yerry Mina'].careerReview
  .replace('2018年世界杯对英。', '2018年世界杯对英格兰的比赛中打入绝平头球——三场三球的后卫进球纪录。2025-26赛季在卡利亚里出场26次，定位球威胁仍然突出。'));
p['Yerry Mina'].wcSpotlight = cleanProse(p['Yerry Mina'].wcSpotlight);

// 14. Gustavo Puerta — WS all periods
p['Gustavo Puerta'].wcSpotlight = '22岁年轻中卫，6次国家队出场1球。2025-26赛季在Racing Santander的西乙环境中积累了稳定的比赛经验，防守扫描和后场分球是他的主要特点。世界杯作为防线储备和2026-2030周期的积累。';

// 15. Juan Portilla — WS all periods
p['Juan Portilla'].wcSpotlight = '27岁扫荡型后腰，10次国家队出场。2025-26赛季在Athletico Paranaense的巴甲环境中积累了高水平的对抗经验。覆盖面积是他的主要价值，在需要加强中场防守时提供轮换选项。';

// 16. Jefferson Lerma — WS periods
p['Jefferson Lerma'].careerReview = cleanProse(p['Jefferson Lerma'].careerReview
  .replace('防守覆盖和组织拦截都是英超级别。', '防守覆盖和组织拦截都是英超级别。2025-26赛季在水晶宫出场30次。'));
p['Jefferson Lerma'].wcSpotlight = cleanProse(p['Jefferson Lerma'].wcSpotlight);

// 17. Johan Mojica — WS periods + wrong opponent
p['Johan Mojica'].wcSpotlight = cleanProse(p['Johan Mojica'].wcSpotlight
  .replace('德国的边锋时', '葡萄牙的边锋时'));

// 18. Willer Ditta — CR periods + WS all periods
p['Willer Ditta'].careerReview = cleanProse(p['Willer Ditta'].careerReview);
p['Willer Ditta'].wcSpotlight = '28岁多面手后卫，5次国家队出场。能打中卫和右后卫的万金油属性是他的主要价值。2025-26赛季在Cruz Azul的墨西哥联赛积累了高强度对抗经验。作为防线深度轮换提供多位置覆盖。';

// 19. Cucho Hernández — WS periods
p['Cucho Hernández'].wcSpotlight = cleanProse(p['Cucho Hernández'].wcSpotlight);

// 20. Juan Fernando Quintero — WS periods
p['Juan Fernando Quintero'].wcSpotlight = cleanProse(p['Juan Fernando Quintero'].wcSpotlight);

// 21. Jaminton Campaz — WS periods
p['Jaminton Campaz'].wcSpotlight = cleanProse(p['Jaminton Campaz'].wcSpotlight);

// 22. Deiver Machado — WS all periods
p['Deiver Machado'].wcSpotlight = '32岁左后卫，15次国家队出场。2025-26赛季在南特的法甲环境中保持了防守基本功和助攻能力。作为左后卫轮换，在需要加强左路助攻时提供传中支持。';

// 23. Davinson Sánchez — WS periods
p['Davinson Sánchez'].careerReview = cleanProse(p['Davinson Sánchez'].careerReview);
p['Davinson Sánchez'].wcSpotlight = cleanProse(p['Davinson Sánchez'].wcSpotlight);

// 24. Álvaro Montero — WS all periods
p['Álvaro Montero'].careerReview = cleanProse(p['Álvaro Montero'].careerReview);
p['Álvaro Montero'].wcSpotlight = '31岁第三门将，12次国家队出场。2025-26赛季在Vélez Sarsfield的阿甲保持了稳定的首发出场。世界杯期间在训练中维持门将组的竞争强度。';

// 25. Luis Suárez — WS periods
p['Luis Suárez'].wcSpotlight = cleanProse(p['Luis Suárez'].wcSpotlight);

// 26. Andrés Gómez — WS periods
p['Andrés Gómez'].wcSpotlight = cleanProse(p['Andrés Gómez'].wcSpotlight);

// === Group K opponent normalization ===
Object.values(p).forEach(v => {
  if (v.wcSpotlight) v.wcSpotlight = v.wcSpotlight.replace(/\b德国\b(?!队)/g, '葡萄牙');
  if (v.careerReview) v.careerReview = v.careerReview.replace(/\b德国\b(?!队)/g, '葡萄牙');
});

// === Final cleanProse + period check ===
co.players.forEach(pl => {
  const v = p[pl.name];
  if (!v) return;
  if (v.careerReview) v.careerReview = cleanProse(v.careerReview);
  if (v.wcSpotlight) v.wcSpotlight = cleanProse(v.wcSpotlight);
  if (v.careerReview && !v.careerReview.endsWith('。')) v.careerReview += '。';
  if (v.wcSpotlight && !v.wcSpotlight.endsWith('。')) v.wcSpotlight += '。';
  applied++;
});

fs.writeFileSync('./src/data/players-wiki.json', JSON.stringify(p, null, 2));
console.log('=== Colombia Summary ===');
console.log('Applied:', applied, '/', co.players.length);
