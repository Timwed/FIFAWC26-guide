const fs = require('fs');
const p = require('../src/data/players-wiki.json');
const s = require('../src/data/squads.json');
const hr = s.find(t => t.name === 'Croatia');

function cleanProse(t) {
  return t.replace(/。。+/g, '');
}

let applied = 0;

// 1. Dominik Livaković — season data
p['Dominik Livaković'].careerReview = p['Dominik Livaković'].careerReview
  .replace('从后场的组织推进中不算顶级。', '从后场的组织推进中不算顶级。2025-26赛季在萨格勒布迪纳摩出场33次保持11场零封。');

// 2. Josip Stanišić — CR periods + WS periods
p['Josip Stanišić'].careerReview = cleanProse(p['Josip Stanišić'].careerReview);
p['Josip Stanišić'].wcSpotlight = '26岁多面手后卫，2025-26赛季在拜仁慕尼黑出场22次。能打右后卫和右中卫的万金油属性在小组赛轮换中提供战术灵活性。面对英格兰边路冲击时，他的防守纪律和战术执行力是右路屏障的重要选项。';

// 3. Marin Pongračić — WS periods
p['Marin Pongračić'].wcSpotlight = cleanProse(p['Marin Pongračić'].wcSpotlight);

// 4. Joško Gvardiol — CR truncation + WS periods
p['Joško Gvardiol'].careerReview = p['Joško Gvardiol'].careerReview
  .replace('他是世界最好的中后卫之一。', '他是世界最好的中后卫之一。2025-26赛季在曼城出场32次，防守统治力和出球精度同时在线。');
p['Joško Gvardiol'].wcSpotlight = cleanProse(p['Joško Gvardiol'].wcSpotlight);

// 5. Duje Ćaleta-Car — CR truncation + WS periods
p['Duje Ćaleta-Car'].careerReview = cleanProse(p['Duje Ćaleta-Car'].careerReview
  .replace('身体对抗和头球。', '身体对抗和头球是他的核心防守武器。2025-26赛季在皇家社会出场27次，西甲环境保持了他的对抗强度。'));
p['Duje Ćaleta-Car'].wcSpotlight = cleanProse(p['Duje Ćaleta-Car'].wcSpotlight);

// 6. Josip Šutalo — WS periods
p['Josip Šutalo'].wcSpotlight = cleanProse(p['Josip Šutalo'].wcSpotlight);

// 7. Nikola Moro — CR periods + WS all periods
p['Nikola Moro'].careerReview = cleanProse(p['Nikola Moro'].careerReview);
p['Nikola Moro'].wcSpotlight = '28岁中场，10次国家队出场。2025-26赛季在博洛尼亚的意甲环境保持了控球和组织能力。在克罗地亚竞争最激烈的中场位置上更多是深度选项，面对加纳和巴拿马时可能获得轮换出场。';

// 8. Mateo Kovačić — CR truncation + WS periods
p['Mateo Kovačić'].careerReview = cleanProse(p['Mateo Kovačić'].careerReview
  .replace('（5个进球），', '（5个进球），但这个数字无法体现他在中场的推进和节奏控制对球队的贡献。2025-26赛季在曼城出场28次。'));
p['Mateo Kovačić'].wcSpotlight = cleanProse(p['Mateo Kovačić'].wcSpotlight);

// 9. Andrej Kramarić — CR truncation + WS periods
p['Andrej Kramarić'].careerReview = cleanProse(p['Andrej Kramarić'].careerReview
  .replace('更多是。', '更多是一个连接中场和锋线的9号半角色。2025-26赛季在霍芬海姆出场29次贡献10球5助攻。'));
p['Andrej Kramarić'].wcSpotlight = cleanProse(p['Andrej Kramarić'].wcSpotlight);

// 10. Luka Modrić — CR truncation + WS periods
p['Luka Modrić'].careerReview = cleanProse(p['Luka Modrić'].careerReview
  .replace('最美的故事之。', '最动人的故事之一。2025-26赛季在米兰出场28次，传球成功率保持90%以上。'));
p['Luka Modrić'].wcSpotlight = cleanProse(p['Luka Modrić'].wcSpotlight);

// 11. Ante Budimir — WS periods
p['Ante Budimir'].careerReview = p['Ante Budimir'].careerReview
  .replace('顶级联赛雕琢的产品。', '顶级联赛雕琢的产品。2025-26赛季在奥萨苏纳出场30次贡献9球3助攻。');
p['Ante Budimir'].wcSpotlight = cleanProse(p['Ante Budimir'].wcSpotlight);

// 12. Ivor Pandur — CR periods + WS all periods
p['Ivor Pandur'].careerReview = cleanProse(p['Ivor Pandur'].careerReview);
p['Ivor Pandur'].wcSpotlight = '26岁第三门将，2025-26赛季在赫尔城的英冠环境中获得稳定出场。世界杯期间在训练中为前场球员提供射门对抗，保持门将组的训练强度。';

// 13. Nikola Vlašić — WS periods
p['Nikola Vlašić'].wcSpotlight = cleanProse(p['Nikola Vlašić'].wcSpotlight);

// 14. Ivan Perišić — WS periods
p['Ivan Perišić'].careerReview = p['Ivan Perišić'].careerReview
  .replace('2018年世界杯决赛打入。', '2018年世界杯决赛打入扳平进球。2025-26赛季在PSV埃因霍温出场30次贡献7球6助攻。');
p['Ivan Perišić'].wcSpotlight = cleanProse(p['Ivan Perišić'].wcSpotlight);

// 15. Mario Pašalić — WS periods
p['Mario Pašalić'].careerReview = p['Mario Pašalić'].careerReview
  .replace('季军争夺战打入关键助攻。。。。。', '季军争夺战打入关键助攻。2025-26赛季在亚特兰大出场31次贡献8球6助攻。');
p['Mario Pašalić'].wcSpotlight = cleanProse(p['Mario Pašalić'].wcSpotlight);

// 16. Martin Baturina — CR periods + WS periods
p['Martin Baturina'].careerReview = cleanProse(p['Martin Baturina'].careerReview
  .replace('顶级联赛的检验。。。。。。。。', '顶级联赛的充分检验。'));
p['Martin Baturina'].wcSpotlight = cleanProse(p['Martin Baturina'].wcSpotlight);

// 17. Petar Sučić — CR periods + WS periods
p['Petar Sučić'].careerReview = cleanProse(p['Petar Sučić'].careerReview);
p['Petar Sučić'].wcSpotlight = cleanProse(p['Petar Sučić'].wcSpotlight);

// 18. Kristijan Jakić — WS periods
p['Kristijan Jakić'].wcSpotlight = cleanProse(p['Kristijan Jakić'].wcSpotlight);

// 19. Toni Fruk — WS all periods
p['Toni Fruk'].careerReview = cleanProse(p['Toni Fruk'].careerReview);
p['Toni Fruk'].wcSpotlight = '25岁技术型中场，7次国家队出场1球。2025-26赛季在里耶卡的克罗地亚联赛保持创造力输出。在克罗地亚的中场深度中更多是为下个周期做准备。';

// 20. Igor Matanović — WS all periods
p['Igor Matanović'].careerReview = cleanProse(p['Igor Matanović'].careerReview);
p['Igor Matanović'].wcSpotlight = '23岁大个子中锋（194cm），9次国家队出场2球。2025-26赛季在弗赖堡获得德甲轮换出场，头球能力是主要武器。作为禁区高点在需要改变进攻方式时提供战术选项。';

// 21. Luka Sučić — WS periods
p['Luka Sučić'].careerReview = cleanProse(p['Luka Sučić'].careerReview);
p['Luka Sučić'].wcSpotlight = cleanProse(p['Luka Sučić'].wcSpotlight);

// 22. Luka Vušković — WS periods
p['Luka Vušković'].wcSpotlight = cleanProse(p['Luka Vušković'].wcSpotlight);

// 23. Dominik Kotarski — WS all periods
p['Dominik Kotarski'].careerReview = cleanProse(p['Dominik Kotarski'].careerReview);
p['Dominik Kotarski'].wcSpotlight = '26岁替补门将，4次国家队出场。2025-26赛季在哥本哈根的丹麦超级联赛保持出场节奏。作为利瓦科维奇的替补在训练中提供竞争和备用保障。';

// 24. Marco Pašalić — WS all periods
p['Marco Pašalić'].careerReview = cleanProse(p['Marco Pašalić'].careerReview);
p['Marco Pašalić'].wcSpotlight = '25岁速度型边锋，15次国家队出场1球。2025-26赛季在MLS奥兰多城获得稳定出场时间。作为边路速度选项在需要改变进攻节奏时提供深度轮换。';

// 25. Martin Erlić — WS all periods
p['Martin Erlić'].careerReview = cleanProse(p['Martin Erlić'].careerReview);
p['Martin Erlić'].wcSpotlight = '28岁中卫，13次国家队出场1球。2025-26赛季在中日德兰的丹麦超级联赛保持稳定出场。2022年世界杯已有出场经验，作为防线深度在需要轮换时提供选项。';

// 26. Petar Musa — WS all periods
p['Petar Musa'].wcSpotlight = '28岁大个子中锋，11次国家队出场1球。2025-26赛季在MLS达拉斯FC保持了进球节奏。作为锋线深度在特定战术场景中提供禁区支点。';

// === Final cleanProse + period check ===
hr.players.forEach(pl => {
  const v = p[pl.name];
  if (!v) return;
  if (v.careerReview) v.careerReview = cleanProse(v.careerReview);
  if (v.wcSpotlight) v.wcSpotlight = cleanProse(v.wcSpotlight);
  if (v.careerReview && !v.careerReview.endsWith('。')) v.careerReview += '。';
  if (v.wcSpotlight && !v.wcSpotlight.endsWith('。')) v.wcSpotlight += '。';
  applied++;
});

fs.writeFileSync('./src/data/players-wiki.json', JSON.stringify(p, null, 2));
console.log('=== Croatia Summary ===');
console.log('Applied:', applied, '/', hr.players.length);
