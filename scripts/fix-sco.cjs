const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

// Each fix: find the truncated string and replace with completed version
const fixes = [
  // 1. Angus Gunn | careerReview
  {name: 'Angus Gunn', field: 'careerReview',
   oldSuffix: '超过15次国',
   newSuffix: '超过15次国家队出场奠定了他苏格兰一号门将的地位。'},
  // 2. Angus Gunn | wcSpotlight
  {name: 'Angus Gunn', field: 'wcSpotlight',
   oldSuffix: '的门将选择，',
   newSuffix: '的门将选择，而是在未来几年内持续镇守苏格兰球门的长期答案。'},
  // 3. Aaron Hickey | careerReview
  {name: 'Aaron Hickey', field: 'careerReview',
   oldSuffix: '纪律性。超过',
   newSuffix: '纪律性。超过15次国家队出场，年仅24岁的他已经是苏格兰防线不可动摇的基石。'},
  // 4. Aaron Hickey | wcSpotlight
  {name: 'Aaron Hickey', field: 'wcSpotlight',
   oldSuffix: '冲击时希基的',
   newSuffix: '冲击时希基的一对一防守能力和战术纪律将受到最直接的检验。'},
  // 5. Andy Robertson | wcSpotlight
  {name: 'Andy Robertson', field: 'wcSpotlight',
   oldSuffix: '突围，罗伯逊',
   newSuffix: '突围，罗伯逊的边路传中精准度和续航里程缺一不可。'},
  // 6. Scott McTominay | careerReview
  {name: 'Scott McTominay', field: 'careerReview',
   oldSuffix: '射和头球抢点',
   newSuffix: '射和头球抢点能力已经达到了欧洲中场里的精英级别。'},
  // 7. Scott McTominay | wcSpotlight
  {name: 'Scott McTominay', field: 'wcSpotlight',
   oldSuffix: '场，反而可能',
   newSuffix: '场，反而可能在聚光灯下踢出更高一档的表现。'},
  // 8. Grant Hanley | careerReview
  {name: 'Grant Hanley', field: 'careerReview',
   oldSuffix: '的上下移动和',
   newSuffix: '的上下移动和造越位时机的统一。'},
  // 9. Grant Hanley | wcSpotlight
  {name: 'Grant Hanley', field: 'wcSpotlight',
   oldSuffix: '年龄带来的运',
   newSuffix: '年龄带来的运动能力下降。'},
  // 10. John McGinn | careerReview
  {name: 'John McGinn', field: 'careerReview',
   oldSuffix: '的斗志和感染',
   newSuffix: '的斗志和感染力是仅次于罗伯逊队长袖标的苏格兰精神资产。'},
  // 11. John McGinn | wcSpotlight
  {name: 'John McGinn', field: 'wcSpotlight',
   oldSuffix: '斯和拜仁慕尼',
   newSuffix: '斯和拜仁慕尼黑级别豪门时的表现证明了他的大赛上限。'},
  // 12. Tyler Fletcher | careerReview
  {name: 'Tyler Fletcher', field: 'careerReview',
   oldSuffix: '出色、传球的',
   newSuffix: '出色、传球的选择和执行在同龄人中属于上乘。'},
  // 13. Tyler Fletcher | wcSpotlight
  {name: 'Tyler Fletcher', field: 'wcSpotlight',
   oldSuffix: '今作为曼联教',
   newSuffix: '今作为曼联教练组成员跟随一线队工作——弗莱彻家族这对父子组合是苏格兰足球最美的叙事线之一。'},
  // 14. Lyndon Dykes | careerReview
  {name: 'Lyndon Dykes', field: 'careerReview',
   oldSuffix: '系中他是标准',
   newSuffix: '系中他是标准的支点中锋，负责用身体为身后的攻击手撑出空间。'},
  // 15. Lyndon Dykes | wcSpotlight
  {name: 'Lyndon Dykes', field: 'wcSpotlight',
   oldSuffix: '克托米奈创造',
   newSuffix: '克托米奈创造空间和射门机会——他的战术价值远超进球数据本身。'},
  // 16. Ché Adams | careerReview
  {name: 'Ché Adams', field: 'careerReview',
   oldSuffix: '出场打入约6',
   newSuffix: '出场打入约6球，在苏格兰锋线竞争中他的支点能力和全面性比纯射手更有战术价值。'},
  // 17. Ché Adams | wcSpotlight
  {name: 'Ché Adams', field: 'wcSpotlight',
   oldSuffix: '能提供完全不',
   newSuffix: '能提供完全不同的战术选择——他的意甲锤炼出的背身技术和做球能力是改变比赛节奏的关键。'},
  // 18. Ryan Christie | careerReview
  {name: 'Ryan Christie', field: 'careerReview',
   oldSuffix: '次国家队出场',
   newSuffix: '次国家队出场，他是苏格兰前场攻击群中经验最丰富的轮换球员之一。'},
  // 19. Ryan Christie | wcSpotlight
  {name: 'Ryan Christie', field: 'wcSpotlight',
   oldSuffix: '赛中——比如',
   newSuffix: '赛中——比如面对三中卫体系时需要从边路撕开缺口时，克里斯蒂的远射和传中质量就是解锁关键。'},
  // 20. Liam Kelly | careerReview
  {name: 'Liam Kelly', field: 'careerReview',
   oldSuffix: '加盟流浪者后',
   newSuffix: '加盟流浪者后他在欧联杯赛场上获得了珍贵的欧战出场经验。'},
  // 21. Liam Kelly | wcSpotlight
  {name: 'Liam Kelly', field: 'wcSpotlight',
   oldSuffix: '。他可能整届',
   newSuffix: '。他可能整届世界杯都不会登场——但一旦被叫到名字，他需要在最极端的情况下交出完美答卷。'},
  // 22. John Souttar | careerReview
  {name: 'John Souttar', field: 'careerReview',
   oldSuffix: '队出场，在苏',
   newSuffix: '队出场，在苏格兰三中卫体系中他是重要的轮换选项。'},
  // 23. John Souttar | wcSpotlight
  {name: 'John Souttar', field: 'wcSpotlight',
   oldSuffix: '和准备程度将',
   newSuffix: '和准备程度将直接影响苏格兰在淘汰赛中的防线深度。'},
  // 24. Dominic Hyam | careerReview
  {name: 'Dominic Hyam', field: 'careerReview',
   oldSuffix: '但教练们恰恰',
   newSuffix: '但教练们恰恰看重的就是这种稳定到近乎透明的防守品质。'},
  // 25. Dominic Hyam | wcSpotlight
  {name: 'Dominic Hyam', field: 'wcSpotlight',
   oldSuffix: '走远需要的不',
   newSuffix: '走远需要的不仅是十一人首发，而是二十六人都能在不同时刻顶上的整体深度。'},
  // 26. Ben Gannon-Doak | careerReview
  {name: 'Ben Gannon-Doak', field: 'careerReview',
   oldSuffix: '岁已成为英格',
   newSuffix: '岁已成为英格兰足坛最受关注的年轻边锋之一，2025-26赛季正式转会伯恩茅斯征战英超。'},
  // 27. Ben Gannon-Doak | wcSpotlight
  {name: 'Ben Gannon-Doak', field: 'wcSpotlight',
   oldSuffix: '克斯的顺位在',
   newSuffix: '克斯的顺位在他之前——但在比赛最后二十分钟面对疲惫的防线时，甘农-多克的爆发力就是最锋利的匕首。'},
  // 28. Lewis Ferguson | careerReview
  {name: 'Lewis Ferguson', field: 'careerReview',
   oldSuffix: '苏格兰战术体',
   newSuffix: '苏格兰战术体系中他不可或缺的印记——他的攻守平衡和技战术素养在苏格兰中场中独树一帜。'},
  // 29. Lewis Ferguson | wcSpotlight
  {name: 'Lewis Ferguson', field: 'wcSpotlight',
   oldSuffix: '森就是那个在',
   newSuffix: '森就是那个用意甲磨砺出的战术嗅觉为苏格兰中场注入意大利足球DNA的关键拼图。'},
  // 30. Lawrence Shankland | careerReview
  {name: 'Lawrence Shankland', field: 'careerReview',
   oldSuffix: '头号得分手，',
   newSuffix: '头号得分手，连续两个赛季在苏超射手榜名列前茅。'},
  // 31. Lawrence Shankland | wcSpotlight
  {name: 'Lawrence Shankland', field: 'wcSpotlight',
   oldSuffix: '苏超多次替补',
   newSuffix: '苏超多次替补登场即进球的表现证明他可以迅速进入比赛节奏。'},
  // 32. Craig Gordon | careerReview
  {name: 'Craig Gordon', field: 'careerReview',
   oldSuffix: '稳居苏超前四',
   newSuffix: '稳居苏超前四，并在欧战中持续为球队把守大门。'},
  // 33. Craig Gordon | wcSpotlight
  {name: 'Craig Gordon', field: 'wcSpotlight',
   oldSuffix: '业素养课：他',
   newSuffix: '业素养课：他在四十岁后依然保持高水平的训练投入和身体管理，这份自律在苏格兰队内没有第二个人能做到。'},
  // 34. Kenny McLean | careerReview
  {name: 'Kenny McLean', field: 'careerReview',
   oldSuffix: '场的绝对组织',
   newSuffix: '场的绝对组织核心，长传和定位球的质量在英冠层面属于顶级。'},
  // 35. Kenny McLean | wcSpotlight
  {name: 'Kenny McLean', field: 'wcSpotlight',
   oldSuffix: '年轻中场都更',
   newSuffix: '年轻中场都更适合在这种时刻被教练从替补席上召唤出来。'},
  // 36. Anthony Ralston | careerReview
  {name: 'Anthony Ralston', field: 'careerReview',
   oldSuffix: '森之外最可靠',
   newSuffix: '森之外最可靠的右后卫选项，防守端极少出现低级失误。'},
  // 37. Anthony Ralston | wcSpotlight
  {name: 'Anthony Ralston', field: 'wcSpotlight',
   oldSuffix: '左边锋的冲击',
   newSuffix: '左边锋的冲击——罗尔斯顿在欧冠赛场积累的防守经验是苏格兰在锁定胜局时最可靠的右边路选项。'},
  // 38. Findlay Curtis | careerReview
  {name: 'Findlay Curtis', field: 'careerReview',
   oldSuffix: '正的年轻爆点',
   newSuffix: '正的年轻爆点，柯蒂斯的存在至少给了一个值得等待的理由。'},
  // 39. Findlay Curtis | wcSpotlight
  {name: 'Findlay Curtis', field: 'wcSpotlight',
   oldSuffix: '锋都会在冬季',
   newSuffix: '锋都会在冬季转会窗口收到来自英冠和欧洲二级联赛的认真报价。'},
  // 40. Scott McKenna | careerReview
  {name: 'Scott McKenna', field: 'careerReview',
   oldSuffix: '格勒布迪纳摩',
   newSuffix: '格勒布迪纳摩——在克罗地亚联赛和欧冠赛场的双线历练让他的比赛经验库比大多数中游球队中卫更加丰富。'},
  // 41. Scott McKenna | wcSpotlight
  {name: 'Scott McKenna', field: 'wcSpotlight',
   oldSuffix: '逼抢时用精准',
   newSuffix: '逼抢时用精准的左路长传直接找到前场支点，越过对方中场压迫线——这是苏格兰从防守转为进攻最快的路径。'},
];

let applied = 0;
let errors = [];

fixes.forEach(fix => {
  const player = d[fix.name];
  if (!player) {
    errors.push('MISSING PLAYER: ' + fix.name);
    return;
  }
  const original = player[fix.field];
  if (!original) {
    errors.push('MISSING FIELD: ' + fix.name + ' ' + fix.field);
    return;
  }
  
  // Find the position of oldSuffix
  const idx = original.lastIndexOf(fix.oldSuffix);
  if (idx === -1) {
    errors.push('NOT FOUND: ' + fix.name + ' ' + fix.field + ' suffix=' + fix.oldSuffix);
    return;
  }
  
  // Replace: take everything up to and including oldSuffix, then append newSuffix
  const newText = original.substring(0, idx + fix.oldSuffix.length) + fix.newSuffix;
  player[fix.field] = newText;
  applied++;
});

console.log('Applied: ' + applied);
if (errors.length > 0) {
  console.log('Errors:');
  errors.forEach(e => console.log('  ' + e));
}

fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(d, null, 2), 'utf8');
console.log('Saved.');
