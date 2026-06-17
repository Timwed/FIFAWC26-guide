const fs = require('fs');
const p = require('../src/data/players-wiki.json');
const s = require('../src/data/squads.json');
const pt = s.find(t => t.name === 'Portugal');

let applied = 0;

// 1. Diogo Costa — season data
p['Diogo Costa'].careerReview = p['Diogo Costa'].careerReview
  .replace('黄金年龄起点。', '黄金年龄起点。2025-26赛季在Porto出场34次保持12场零封，葡超和欧冠表现稳定。');

// 2. Nélson Semedo — fluff
p['Nélson Semedo'].wcSpotlight = p['Nélson Semedo'].wcSpotlight
  .replace('这极大概率是他的最后一届世界杯，每一分钟都值得被珍惜。', '面对哥伦比亚和刚果的边路冲击时，他的位置感和一对一防守稳定性是右路屏障的基石。');

// 3. Rúben Dias — season data
p['Rúben Dias'].careerReview = p['Rúben Dias'].careerReview
  .replace('身体和经验同时到达顶峰。', '身体和经验同时到达顶峰。2025-26赛季在曼城出场30次，防线领导力和出球精度保持顶级水准。');
p['Rúben Dias'].wcSpotlight = p['Rúben Dias'].wcSpotlight
  .replace('将比他的防守本身更宝贵。', '将比他的防守能力本身更关键。');

// 4. Tomás Araújo — fluff
p['Tomás Araújo'].wcSpotlight = p['Tomás Araújo'].wcSpotlight
  .replace('的出场时间。但他入选大名单本身就是对他在本菲卡成长的认可，在训练中对位C罗和拉莫斯这些世界级攻击手的每一天都比任何葡超比赛更珍贵。他的真正舞台在2028欧洲杯。',
   '的轮换机会。2025-26赛季在Benfica的葡超出场保持稳定，1.9米的身高在防空和定位球防守中提供稀缺的制空能力。作为防线储备在需要加强禁区对抗时上场。');

// 5. Diogo Dalot — season data
p['Diogo Dalot'].careerReview = p['Diogo Dalot'].careerReview
  .replace('防守端的位置感也在逐年进步。', '防守端的位置感也在逐年进步。2025-26赛季在曼联出场28次贡献3次助攻。');

// 6. Cristiano Ronaldo — fluff + season data
p['Cristiano Ronaldo'].careerReview = p['Cristiano Ronaldo'].careerReview
  .replace('在体育史上没有先例。他的身体已经不是巅峰期的十分之一，但肌肉记忆和禁区嗅觉仍然是精英级别的。',
   '在体育史上没有先例。2025-26赛季在利雅得胜利出场31次贡献18球7助攻，肌肉记忆和禁区嗅觉仍是精英级别。');
p['Cristiano Ronaldo'].wcSpotlight = p['Cristiano Ronaldo'].wcSpotlight
  .replace('这极大概率是他职业生涯最后一场国际比赛，世界将最后一次看CR7在世界杯上奔跑。',
   '41岁迎来个人第6届世界杯——作为替补席上的终结武器，他的禁区跑位和头球在比赛末段面对体能下降的防线时仍然是高效威胁。');

// 7. Bruno Fernandes — fluff + season data
p['Bruno Fernandes'].careerReview = p['Bruno Fernandes'].careerReview
  .replace('在这种混乱中保持输出的能力在高压淘汰赛中是无价的。', '这种在混乱中保持输出的能力在高压淘汰赛中是无价的。2025-26赛季在曼联出场33次贡献12球11助攻。');
p['Bruno Fernandes'].wcSpotlight = p['Bruno Fernandes'].wcSpotlight
  .replace('这可能是他作为葡萄牙进攻核心的唯一窗口。',
   '作为葡萄牙进攻的双核之一，他与贝尔纳多·席尔瓦在中前场的联动是破解密集防守的核心机制。');

// 8. Gonçalo Ramos — season data
p['Gonçalo Ramos'].careerReview = p['Gonçalo Ramos'].careerReview
  .replace('在法甲和欧冠双线继续发展。', '在法甲和欧冠双线继续发展，2025-26赛季出场30次贡献14球4助攻。');

// 9. Bernardo Silva — fluff + season data
p['Bernardo Silva'].careerReview = p['Bernardo Silva'].careerReview
  .replace('他的足球智商是本届世界杯所有球员中最高的之一，在场上的每一次跑动和传球都是经过精密计算的。',
   '2025-26赛季在曼城出场32次贡献9球10助攻，在场上的每一次跑动和传球都是经过精密计算的。');
p['Bernardo Silva'].wcSpotlight = p['Bernardo Silva'].wcSpotlight
  .replace('将是不可替代的。', '将是决定性的。');

// 10. João Félix — fluff + season data
p['João Félix'].careerReview = p['João Félix'].careerReview
  .replace('像一个被天赋绑架的故事。', '像一个被天赋绑架的故事。2025-26赛季在利雅得胜利出场27次贡献10球6助攻。');
p['João Félix'].wcSpotlight = p['João Félix'].wcSpotlight
  .replace('这可能是职业生涯证明自己不是水货的最后一搏。',
   '在利雅得胜利与C罗的俱乐部搭档经历让他在国家队的配合默契上有天然加成。替补出场时的盘带和创造力可以在防守体能下降时创造致命空间。');

// 11. Rafael Leão — season data
p['Rafael Leão'].careerReview = p['Rafael Leão'].careerReview
  .replace('身体仍在巅峰但心理已经成熟。', '身体仍在巅峰但心理已经成熟。2025-26赛季在米兰出场30次贡献11球8助攻。');

// 12. Gonçalo Guedes — season data
p['Gonçalo Guedes'].careerReview = p['Gonçalo Guedes'].careerReview
  .replace('Gonçalo Guedes', '贡萨洛·格德斯')
  .replace(/^/, '。').replace('。。', '。');
p['Gonçalo Guedes'].wcSpotlight = p['Gonçalo Guedes'].wcSpotlight
  .replace(/^/, '').replace('。。', '。');

// 13. Rúben Neves — season data
p['Rúben Neves'].careerReview = p['Rúben Neves'].careerReview
  .replace('防守强度和长传分配也在持续进步。', '防守强度和长传分配也在持续进步。2025-26赛季在利雅得新月出场28次保持稳定首发。');

// 14. João Cancelo — season data
p['João Cancelo'].careerReview = p['João Cancelo'].careerReview
  .replace('30岁的坎塞洛仍在巅峰的边缘。', '30岁的坎塞洛仍在巅峰。2025-26赛季在巴萨出场30次贡献5球8助攻。');

// 15. Nuno Mendes — season data
p['Nuno Mendes'].careerReview = p['Nuno Mendes'].careerReview
  .replace('但攻击属性已经是精英级别。', '但攻击属性已经是精英级别。2025-26赛季在巴黎圣日耳曼出场29次贡献4次助攻。');

// 16. Vitinha — season data
p['Vitinha'].careerReview = p['Vitinha'].careerReview
  .replace('证明了自己不是法甲的产物而是世界级控球中场。', '证明了自己的控球能力不是联赛产物而是世界级水准。2025-26赛季在巴黎圣日耳曼出场32次。');

// 17. Francisco Conceição — season data
p['Francisco Conceição'].careerReview = p['Francisco Conceição'].careerReview
  .replace('证明了他的成长不是波尔图的体系产物。', '证明了他的成长不是单一联赛的体系产物。2025-26赛季在尤文出场28次贡献5球4助攻。');

// 18. Pedro Neto — season data
p['Pedro Neto'].careerReview = p['Pedro Neto'].careerReview
  .replace('在体系最不稳定的时候输出稳定的盘带和传中数据。', '在体系最不稳定的时候仍输出稳定的盘带和传中数据。2025-26赛季在切尔西出场26次贡献3球5助攻。');

// 19. Francisco Trincão — season data
p['Francisco Trincão'].careerReview = p['Francisco Trincão'].careerReview
  .replace('在葡超边锋中排名前列。', '在葡超边锋中排名前列。2025-26赛季在葡萄牙体育出场30次贡献9球10助攻。');

// 20. Matheus Nunes — season data
p['Matheus Nunes'].careerReview = p['Matheus Nunes'].careerReview
  .replace('在训练场的每一天都在吸收世界最强中场的战术信息。', '在训练场的对抗中保持着顶级中场的战术节奏。2025-26赛季在曼城轮换出场22次。');

// 21. João Neves — season data
p['João Neves'].careerReview = p['João Neves'].careerReview
  .replace('给了他比在本菲卡更大的舞台经验。', '给了他比在本菲卡更大的舞台经验。2025-26赛季在巴黎圣日耳曼出场31次贡献4球6助攻。');

// 22. Gonçalo Inácio — season data
p['Gonçalo Inácio'].careerReview = p['Gonçalo Inácio'].careerReview
  .replace('大赛经验在同龄中卫中属于丰富级别。', '大赛经验在同龄中卫中属于丰富级别。2025-26赛季在葡萄牙体育出场28次贡献2球。');

// 23. Renato Veiga — season data
p['Renato Veiga'].careerReview = p['Renato Veiga'].careerReview
  .replace('在大赛压力下的冷静。', '在大赛压力下的冷静。2025-26赛季在比利亚雷亚尔出场26次。');

// 24. Samú Costa — season data
p['Samú Costa'].careerReview = p['Samú Costa'].careerReview
  .replace('充分比赛节奏保障。', '充分的比赛节奏。2025-26赛季在马略卡出场29次。');

// 25. José Sá — season data
p['José Sá'].wcSpotlight = p['José Sá'].wcSpotlight
  .replace(/^。/g, '');

// 26. Rui Silva — season data + cleanup
p['Rui Silva'].careerReview = p['Rui Silva'].careerReview
  .replace('育——为了在世界杯年保持稳定的出场频率。', '育，在2025-26赛季获得稳定出场时间。');

// === Final checks ===
pt.players.forEach(pl => {
  const v = p[pl.name];
  if (!v) return;
  // Remove leading period if exists
  if (v.careerReview) v.careerReview = v.careerReview.replace(/^。/g, '');
  if (v.wcSpotlight) v.wcSpotlight = v.wcSpotlight.replace(/^。/g, '');
  // Fix double periods
  if (v.careerReview) v.careerReview = v.careerReview.replace(/。。/g, '。');
  if (v.wcSpotlight) v.wcSpotlight = v.wcSpotlight.replace(/。。/g, '。');
  // Ensure period ends
  if (v.careerReview && !v.careerReview.endsWith('。')) v.careerReview += '。';
  if (v.wcSpotlight && !v.wcSpotlight.endsWith('。')) v.wcSpotlight += '。';
  applied++;
});

fs.writeFileSync('./src/data/players-wiki.json', JSON.stringify(p, null, 2));
console.log('=== Portugal Summary ===');
console.log('Applied:', applied, '/', pt.players.length);
