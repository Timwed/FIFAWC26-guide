// Fix Canada player bios to fit tier word boundaries — v2
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

// ===== A-TIER (CR: 220-280, WS: 160-220) =====

// Cyle Larin: CR 173→220+, WS 131→160+
d['Cyle Larin'].careerReview =
  '加拿大国家队历史射手王——赛尔·拉林从奥兰多城起步，在MLS时期就展现了出色的进球天赋。土超贝西克塔斯四年是他最精彩的篇章：2020-21赛季以19球荣膺土超射手王，在伊斯坦布尔多次关键场次打入制胜球。此后辗转布鲁日、巴拉多利德、马洛卡，2024年落脚南安普顿。90次国家队出场打入30球，2022世界杯对阵克罗地亚时打入加拿大世界杯历史首球——这个进球将永远铭刻在加拿大足球史上。拉林的射门嗅觉是他穿越六国联赛后始终不变的核心标签。31岁的老将依然在刷新纪录。';
d['Cyle Larin'].wcSpotlight =
  '拉林将以加拿大历史射手王的身份第二次站上世界杯舞台。2022年卡塔尔对阵克罗地亚打入加拿大世界杯历史首球，这粒进球让全世界意识到加拿大不再是世界杯的过客。2025-26赛季在南安普顿的表现将决定他本届是主力还是轮换——他的禁区终结能力是加拿大锋线中唯一经过五大联赛长期验证的得分保障。31岁的最后一届世界杯，也可能是最完整的一届。';

// Jonathan David: WS 150→160+
d['Jonathan David'].wcSpotlight =
  '大卫是加拿大本届最大的王牌。尤文图斯赛季让他习惯在最苛刻的战术体系中担任箭头，意甲后卫的贴身防守已帮他建立「在压力下保持射门品质」的肌肉记忆。77场国家队39球的惊人效率——距离拉林的历史射手王纪录仅一步之遥。加拿大小组出线的最大筹码就是大卫在禁区内的终结本能，这种进球嗅觉无法被战术完全限制。26岁，正值前锋黄金年龄。';

// Alphonso Davies: CR 198→220+, WS 215 OK
d['Alphonso Davies'].careerReview =
  '出生于加纳难民营、随家人逃难到加拿大的移民少年——戴维斯的故事就是加拿大移民梦最光辉的体现。在温哥华白帽出道后迅速轰动MLS，2018年以创纪录价格转会拜仁慕尼黑，用不到两年让所有质疑者闭嘴。2020年随拜仁夺得六冠王，欧冠1/4决赛对阵巴萨时回追拦截并助攻基米希得分的经典画面载入足球史。在拜仁先后踢过左后卫、左中场甚至边锋，战术柔韧性在顶级俱乐部中极为稀缺。58次国家队出场15个进球——作为名义上的左后卫能打入15球，影响力远不止防守。';

// ===== B-TIER (CR: 170-220, WS: 130-170) =====

// Alistair Johnston: CR 155→170+, WS 101→130+
d['Alistair Johnston'].careerReview =
  '加拿大右后卫位置上的绝对主力——约翰斯顿从纳什维尔到蒙特利尔的MLS历练后，2023年跨越大西洋来到凯尔特人，不到半年就稳稳地坐上首发位置。在格拉斯哥德比中的强硬表现证明了他的战斗精神：苏格兰足球是暴力美学高地，而他如鱼得水。27岁的他已有58次国家队出场1个进球，2022世界杯上他是为数不多未被压制的加拿大外场球员，这一点足以证明他的大场面能力。';
d['Alistair Johnston'].wcSpotlight =
  '约翰斯顿是2022世界杯上少数打出欧战级别表现的加拿大球员——在卡塔尔的三个对手面前，他顶住了压力。两年凯尔特人生涯让身体和战术理解力进一步提升，欧冠级别的对抗中积累了宝贵的回追和一对一防守经验。本届世界杯作为首发右后卫，他的防守硬度将决定加拿大右路能否顶住对手的进攻重心。';

// Ismaël Koné: PASS (CR=171, WS=130)
// Tani Oluwaseyi: CR 154→170+
d['Tani Oluwaseyi'].careerReview =
  '出生于尼日利亚、在加拿大成长、在MLS爆炸式崛起——奥卢瓦塞伊在明尼苏达联三年间从无名之辈成长为MLS最具爆发力的前锋之一，擅长用速度和身体对抗创造射门机会。2025年转会西甲比利亚雷亚尔是从MLS直接跃入西甲的跳级——黄色潜水艇的球探在他身上看到了MLS最佳级别前锋的潜力。24次国家队出场2个进球尚在积累中，但他的上升曲线已让全联盟侧目。';

// Derek Cornelius: CR 152→170+, WS 113→130+
d['Derek Cornelius'].careerReview =
  '温哥华白帽青训出品——从MLS到希腊联赛再到瑞典马尔默，科尼利厄斯的职业生涯是一幅马赛克：每一块不同，拼在一起构成完整的优秀中卫。在马尔默FF三年间赢得瑞典超冠军并积累了欧冠及欧联预选赛的稳定出场经验。2025年转会流浪者让他和队友约翰斯顿在苏格兰汇聚——格拉斯哥德比的暴力环境正在锤炼他的防守硬度。44次国家队出场1个进球，加拿大防线上的稳定一环。';
d['Derek Cornelius'].wcSpotlight =
  '科尼利厄斯的独特价值在于「经验密度」——他踢过北美、希腊、北欧、苏格兰四种不同足球文化，面对任何对手都不会陌生。在流浪者的格拉斯哥德比和欧战经验为世界杯做好了精神与身体的双重准备。苏格兰足球永不放弃的防守精神已内化为他的本能，本届世界杯是加拿大防线上的定海针之一。';

// Tajon Buchanan: PASS
// Jonathan Osorio: PASS
// Richie Laryea: PASS
// Nathan Saliba: PASS

// ===== C-TIER (CR: 120-170, WS: 120-160) =====

// Dayne St. Clair: WS 111→120+
d['Dayne St. Clair'].wcSpotlight =
  '圣克莱尔即将迎来他的第一届世界杯。在迈阿密国际的一年让他适应了聚光灯下的压力，面对顶级前锋的日常训练让他在心理上不惧怕任何级别的进攻火力。加拿大所在的B组意味着他将直面瑞士和卡塔尔的攻击线——这不再是北美预选赛级别的考验。29岁的年龄对于门将来说正值巅峰。';

// Alfie Jones: CR 114→120+, WS 94→120+
d['Alfie Jones'].careerReview =
  '出生于英格兰但选择为加拿大出战的中卫——南安普顿青训体系出身，接受了英超级别的后卫教育。在赫尔城四年证明了自己是可靠的英冠级中卫，比赛风格偏重防守直觉和位置感。2025年转会米德尔斯堡后继续在英冠沉淀中卫技能。国家队仅2次出场，作为后防线深度储备入选大名单。';
d['Alfie Jones'].wcSpotlight =
  '琼斯的世界杯出场机会取决于后防线的伤病情况。作为第三或第四中卫储备，他在英冠赛季30+场的比赛节奏保持了他的竞技状态。28岁正值中卫成熟期，英冠的日常强度足以承接突然降临的世界杯出场任务——这正是26人大名单中深度球员核心价值的体现与印证。';

// Luc de Fougerolles: WS 119→120+
d['Luc de Fougerolles'].wcSpotlight =
  '德富热罗勒是加拿大后防线的「2030投资」，但2026他就已准备好交作业——在比利时登德尔的赛季让他获得了稳定的首发时间，这对20岁的后卫至关重要。富勒姆青训的背景给了他面对英超前锋的身体记忆，他可能是加拿大后防线上最快的一对一追防选项。13次国家队出场对于20岁的后卫来说已是超额成长。';

// Joel Waterman: WS 90→120+
d['Joel Waterman'].wcSpotlight =
  '沃特曼的故事会让所有30岁还在坚持的半职业球员看到希望。作为加拿大后防线上的轮换中卫，他的核心价值是稳定和少犯错误——在世界杯淘汰赛当替补中卫被突然换上时，能守住位置就是最大贡献。30岁才首次站上世界杯舞台，这份经历的重量远超任何技术统计。';

// Mathieu Choinière: PASS
// Stephen Eustáquio: WS 119→120+
d['Stephen Eustáquio'].wcSpotlight =
  '作为加拿大最被欧洲足坛认可的中场球员，尤斯塔基奥在2026世界杯的表现决定加拿大小组赛命运。29岁、波尔图的欧冠经验加上洛杉矶FC的进攻节奏适应，他需要在瑞士和卡塔尔的压迫下保持传球的冷静——加拿大的中场能否正常运转全看他。他是加拿大体系里那个「如果他不掉链子，我们就不会掉链子」的人。';

// Liam Millar: WS 94→120+
d['Liam Millar'].wcSpotlight =
  '米拉尔的世界杯价值很明确——当加拿大首发边锋65分钟后耗尽体能时，一个腿脚新鲜、盘带技术仍在、且对瑞士足球文化有所了解的替补边锋可以改变比赛。26岁的年龄让他处于「即战力替补」的黄金阶段。在巴塞尔效力时期积累的瑞士超经验或许能在对阵瑞士时成为意想不到的情报优势。';

// Jacob Shaffelburg: WS 117→120+
d['Jacob Shaffelburg'].wcSpotlight =
  '沙费尔伯格的左脚内切射门是加拿大在边路最直接的进球威胁——他在纳什维尔赛季中多次用左路内切后精准的远角推射让对手门将绝望。本届世界杯作为轮换左边锋出场时，他的射门精度将是加拿大攻击线的重要变数。洛杉矶FC的比赛节奏也与世界杯强度最为接近，31次国家队出场6球是他效率的最大注脚。';

// Moïse Bombito: PASS
// Maxime Crépeau: WS 105→120+
d['Maxime Crépeau'].wcSpotlight =
  '克雷波和圣克莱尔的门将竞争是加拿大世界杯前最大看点之一。两人在MLS的表现难分伯仲——真正决定谁首发的可能是热身赛状态和与后防线的沟通质量。32岁的克雷波拥有更多大赛经验和更深的比赛阅读能力，这一点在世界杯氛围中可能成为决定性优势。在洛杉矶FC夺得MLS杯的经历证明了他能在大赛中保持冷静。';

// Owen Goodman: CR 105→120+, WS 110→120+
d['Owen Goodman'].careerReview =
  '水晶宫青训培养的青年门将——在水晶宫梯队三年后在科尔切斯特联的短期租借积累了第一份职业联赛出场经验。2025年转会巴恩斯利继续在英冠梯队中磨练门将技能。22岁尚无国家队出场记录，但身高超过1米9的硬件条件加上英冠体系的训练，入选26人大名单是加拿大对他潜力的最大认可。';
d['Owen Goodman'].wcSpotlight =
  '作为加拿大队中的第三门将，古德曼的世界杯之旅是一堂「沉浸式大师课」——每天和圣克莱尔、克雷波一起训练，在世界杯聚光灯下体验门将职责的每个细节。22岁的年龄意味着他的世界杯征途从2026年才正式开始，这届是为未来十年打下的坚实起点。即使不上场，世界杯的体验本身就是一种升级。';

// Ali Ahmed: CR 114→120+, WS 108→120+
d['Ali Ahmed'].careerReview =
  '多伦多FC青训产品——在温哥华白帽环境中逐步成长，2025年转会英冠诺维奇城敲开英格兰足球大门。他是左边锋，以盘带精度和空间嗅觉见长，在MLS中的助攻数据在同位置球员中相当亮眼。24次国家队出场1个进球，场上定位更偏向创造者而非终结者——他的任务是制造机会。';
d['Ali Ahmed'].wcSpotlight =
  '艾哈迈德将以「戴维斯的替补」身份入选世界杯阵容——给阿方索·戴维斯当替补这件事本身就说明了一定的水准。25岁、英冠诺维奇城的体能节奏让他在替补登场时具备即战力，他的左路突破能力可以帮助疲惫的戴维斯分担进攻压力，同时也能在训练中为戴维斯提供高质量的对抗准备。';

// Niko Sigur: WS 111→120+
d['Niko Sigur'].wcSpotlight =
  '西古尔是世界杯26人阵容中最不可或缺的「工具箱球员」——右后卫、右中场、甚至三后卫体系中的右中卫都能胜任，这种通用性在现代足球中无价。哈伊杜克在欧战中的历练让他不惧怕与欧洲顶级球员直接对话。22岁的他可能是加拿大在本届最大的战术变数之一——多位置属性意味着他随时可能被派上场。';

// Promise David: PASS
// Jayden Nelson: WS 119→120+
d['Jayden Nelson'].wcSpotlight =
  '内尔森作为加拿大边锋选择中的X因素进入本届世界杯——他在奥斯汀FC的数据可能不会太惊艳，但一对一情况下的直觉型突破仍是一种不可替代的进攻资产。23岁的年龄和MLS的比赛环境意味着他更适配作为替补冲击手，在对手体力下降时用个人能力制造混乱，这是26人大名单中板凳深度的真正意义所在。';

// Write back
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(d, null, 2), 'utf8');

// Verification
const tiers = {
  A: {crMin:220, crMax:280, wsMin:160, wsMax:220},
  B: {crMin:170, crMax:220, wsMin:130, wsMax:170},
  C: {crMin:120, crMax:170, wsMin:120, wsMax:160}
};
const pt = {
  'Alphonso Davies':'A','Cyle Larin':'A','Jonathan David':'A',
  'Alistair Johnston':'B','Ismaël Koné':'B','Tani Oluwaseyi':'B','Derek Cornelius':'B','Tajon Buchanan':'B','Jonathan Osorio':'B','Richie Laryea':'B','Nathan Saliba':'B',
  'Dayne St. Clair':'C','Alfie Jones':'C','Luc de Fougerolles':'C','Joel Waterman':'C','Mathieu Choinière':'C','Stephen Eustáquio':'C','Liam Millar':'C','Jacob Shaffelburg':'C','Moïse Bombito':'C','Maxime Crépeau':'C','Owen Goodman':'C','Ali Ahmed':'C','Niko Sigur':'C','Promise David':'C','Jayden Nelson':'C'
};

console.log('=== VERIFICATION ===');
let fails = [];
Object.keys(pt).forEach(n => {
  const b = d[n];
  if (!b) { fails.push(n + ' MISSING'); return; }
  const r = tiers[pt[n]];
  const cr = (b.careerReview||'').length, ws = (b.wcSpotlight||'').length;
  const crOk = cr >= r.crMin && cr <= r.crMax;
  const wsOk = ws >= r.wsMin && ws <= r.wsMax;
  if (!crOk || !wsOk) fails.push(n + ' [' + pt[n] + '] CR=' + cr + ' (' + (crOk?'OK':'FAIL') + ':' + r.crMin + '-' + r.crMax + ') WS=' + ws + ' (' + (wsOk?'OK':'FAIL') + ':' + r.wsMin + '-' + r.wsMax + ')');
  console.log((crOk && wsOk ? 'PASS' : 'FAIL') + ' ' + n + ' CR=' + cr + ' WS=' + ws + ' [' + pt[n] + ']');
});

console.log('\nFAILURES: ' + fails.length + '/26');
fails.forEach(f => console.log('  ' + f));
