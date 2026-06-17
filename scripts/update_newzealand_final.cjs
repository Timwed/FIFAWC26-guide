const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const nzl = squad.find(t => t.name === 'New Zealand');
const opps = squad.filter(t => t.group === nzl.group && t.name !== 'New Zealand').map(t => t.name);
const oppLabel = opps.join('、');

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/同组强敌/g, oppLabel)
    .replace(/比利时队/g, '比利时')
    .replace(/埃及队/g, '埃及')
    .replace(/伊朗队/g, '伊朗')
    .replace(/葡萄牙/g, '');
}

function cleanProse(text) {
  return text
    // League corrections
    .replace(/新西兰国内顶级联赛/g, '澳超')
    .replace(/新西兰惠灵顿凤凰/g, '澳超惠灵顿凤凰')
    .replace(/效力于惠灵顿凤凰/g, '效力于澳超惠灵顿凤凰')
    .replace(/效力于英冠谢菲尔德联/g, '效力于谢菲尔德联')
    .replace(/英格兰非联赛俱乐部/g, '英格兰国家联赛（第五级别）')
    // Truncation fixes: remove incomplete sentence endings
    .replace(/冲击力极$/g, '冲击力极强的攻击型球队中持续成长')
    .replace(/天然的优势和$/g, '天然的身体对抗优势')
    .replace(/攻击手的实际$/g, '攻击手时的实战检验')
    .replace(/团队$/g, '')
    .replace(/是$/g, '')
    .replace(/体系和$/g, '')
    .replace(/队友$/g, '')
    .replace(/即$/g, '')
    .replace(/赛$/g, '')
    .replace(/都$/g, '')
    // Chris Wood — the worst offender
    .replace(/赤军团有史以来最伟大最致命最高效也最具国际影响力的射手和象征性图腾和国家英雄和绝对核心/g, '新西兰队史射手王，英超多年的稳定输出证明了其顶级水准')
    .replace(/包括头球破门、禁区支点作用、背身护球和为队友创造空间等各项中锋职能的完善掌握和不懈打磨和执行力和身体对抗和逆境生存能力和绝地反击爆发力/g, '头球、支点和背身护球技术全面')
    .replace(/新西兰所有世界杯梦想和全部得分希望的不可替代的绝对核心承载者和最致命也最令对手防线胆寒的唯一世界级射手和全国球迷眼中唯一的神和唯一的太阳和唯一的光和唯一的希望和唯一的救赎和最后的审判和最高的荣耀和最深的骄傲和质量最大也最有力的存在证明和最大的寄托和最重的责任和最光荣的使命和最崇高的信仰和最虔诚的祈祷和最热切的希望和唯一的答案和唯一的终结和唯一的得分来源和唯一的不灭希望和全部的世界杯梦想和所有的新西兰人的世界杯精神和足球信仰/g, '是新西兰进攻端最依赖的得分点')
    // Singh — off-topic rambling
    .replace(/展示了可观的技术天赋和中前场创造力和新西兰本土联赛中最令人印象深刻的技术含量和华丽球风和美妙观感和观赏性和娱乐性和流量担当以及人气保障和粉丝聚集和商标人物和招牌球星/g, '是新西兰技术含量最高的球员之一')
    .replace(/但至少体味和学习和吸收了世界顶级训练体系的精髓和前卫理念和先进方/g, '')
    .replace(/新西兰中前场技术含量最高和最具创造力和想象力和即兴发挥天马行空的不羁灵魂和自由奔放的浪漫艺术家和随性即兴的爵士乐手和嘻哈说唱者和街头篮球手和沙滩足球爱好者和五人制足球的快乐玩家和游戏人间和笑傲江湖和放浪形骸和不拘一格和独辟蹊径的最不可预测的战术变量和最令人惊喜的X因素和最大娱乐价值持有者/g, '是新西兰中前场最具创造力的球员')
    // Barbarouses — poetry overload
    .replace(/赤军团多年最稳定也最高效的攻击手之一和深受球迷爱戴和热爱的球队功勋和传奇人物和受全队无条件敬重的更衣室灵魂和数代年轻人崇拜和模仿的偶像和向往和奔跑和追逐的目标和方向和灯塔/g, '是新西兰攻击线上最资深的球员')
    .replace(/积累了极为丰富和极为宝贵和极为难得和极为复杂的进球经验和高强度对抗经验和高效得分技巧和把握机会的嗅觉，即使在体力下降/g, '积累了丰富的大赛经验')
    .replace(/新西兰攻击线上年龄和资历双最老兵但精神和斗志也是最强大最不屈最不服老最不服输的不死老战士和不灭老兵魂和不朽的战功传奇和不死的神话传说和永远年轻的足球心和不计岁月的老兵热血和永不止息的奔跑和永不归于沉寂的怒吼和永不熄灭的复仇之火和永远燃烧的战斗欲之火和不灭的英雄之魂和无敌的将士之身和不老的神话和永生的传奇/g, '是新西兰攻击线上的可靠老将')
    // Bindon — financial jargon
    .replace(/是新西兰防线上最被期待的未来核心基石和最具培养价值和战略意义的长期重点投资方向和着力培养对象和举国关注的年轻防守天才/g, '是新西兰防线最具潜力的年轻中卫')
    .replace(/这种高强度比赛节奏的日常化训练是他在同龄新西兰中卫中遥遥领先拉开档次的根本原因和核心竞争力和差异化的独家资源储备/g, '高强度比赛节奏加速了他的成长')
    .replace(/新西兰防线未来的希望之星和本届世界杯上最被全球球探和媒体共同聚焦和关注的年轻防守力量黑马/g, '新西兰防线的未来基石')
    .replace(/在任何足球小国都极为罕见也已经提前锁定了未来十年新西兰防线基石的无可争议的候选人和必然人选和不二选择和绝不出卖的核心资产和最保值也最具溢价空间的优质投资标的和令欧洲豪门垂涎的潜力新星/g, '已在同龄人中遥遥领先')
    // Crocombe
    .replace(/新西兰防线最稳固的最后堡垒和定海神针也是全队心理上最深层的安全感和定心丸来源/g, '新西兰防线的最后保障')
    .replace(/豪华火力群以及埃及萨拉赫和马尔穆什的英超级别攻击波时将被推上前所未有的极限考验也是证明自己的最佳舞台和最宝贵的亮相机会/g, '攻击群时将被推向极限考验')
    // Payne
    .replace(/毫无争议地稳居防线轮换主力序列和稳定战术输出角色和球队长期信赖的可靠团队贡献者和战术多面手/g, '是防线上的主力轮换')
    .replace(/在面对世界级攻击力的重重包围和反复高强度撕扯的残酷世界杯对抗赛场上他的平和心态和不急不躁的沉稳防守风格能够成为新西兰防线中的压舱石和稳定器为团队提供关键时刻的冷静判断和正确决策和不变的执行力和刚性的防守意志和坚定不移的阵脚把守和寸土不让/g, '他的沉稳防守风格在高压时刻对球队尤其重要')
    // Generic heavy fluff
    .replace(/最致命/g, '')
    .replace(/最高效/g, '')
    .replace(/不可突破的坚固堡垒和最终安全保障和全队信赖的终极防线/g, '最后保障')
    .replace(/唯一的神/g, '')
    .replace(/唯一的太阳/g, '')
    .replace(/唯一的光/g, '')
    .replace(/唯一的希望/g, '')
    .replace(/唯一的救赎/g, '')
    .replace(/唯一的答案/g, '')
    .replace(/战略投资/g, '')
    .replace(/成长加速器/g, '')
    .replace(/里程碑和无可替代的珍贵体验/g, '')
    .replace(/无可替代的珍贵体验/g, '')
    .replace(/定海神针/g, '')
    .replace(/压舱石/g, '')
    .replace(/神话传说/g, '')
    .replace(/X因素/g, '')
    .replace(/黑马/g, '')
    .replace(/图腾/g, '')
    .replace(/灯塔/g, '')
    .replace(/不死/g, '')
    .replace(/不灭/g, '')
    .replace(/不朽/g, '')
    .replace(/永不/g, '')
    .replace(/燃烧/g, '')
    .replace(/灵魂/g, '')
    .replace(/信仰/g, '')
    .replace(/上帝/g, '')
    .replace(/太阳/g, '')
    // Remove orphaned commas and periods
    .replace(/集，/g, '')
    .replace(/和$/g, '')
    .replace(/的$/g, '');
}

const corrections = {
  // GK
  'Max Crocombe': {
    careerReview: '克罗科姆，32岁门将，效力英冠米尔沃尔。2025-26赛季英冠首发，积累了高水平对抗经验。24次国家队出场，稳居新西兰头号门将。',
    wcSpotlight: '克罗科姆是新西兰防线的最后保障——英冠多年的高强度比赛让他在面对比利时（德布劳内、卢卡库）和埃及（萨拉赫）的攻击群时有充分的实战准备。他的扑救和门线指挥是本组密集赛程中最基本的防线保障。'
  },
  'Alex Paulsen': {
    careerReview: '保尔森，23岁年轻门将，效力波兰格但斯克莱吉亚。有潜力的门将储备，欧洲联赛经历正在加速其成长。8次国家队出场。',
    wcSpotlight: '保尔森是门将位置的年轻储备，23岁的欧洲联赛主力经验是新西兰门将未来的希望。本届以积累大赛经验为主。'
  },
  'Michael Woud': {
    careerReview: '伍德（Michael Woud），27岁门将，效力奥克兰FC。国内联赛主力门将，是门将位置的轮换选项。6次国家队出场。',
    wcSpotlight: '伍德是门将位置的保险选项——奥克兰FC的主力身份保证了基本的竞技状态。'
  },

  // DF
  'Tim Payne': {
    careerReview: '佩恩，32岁多面手后卫，效力澳超惠灵顿凤凰。身体对抗硬度在大洋洲球员中名列前茅，可胜任防线多个位置。51次国家队出场打入3球。',
    wcSpotlight: '佩恩是防线上经验最丰富的老将之一——51场国家队经历在应对比利时和伊朗的强硬对位时是重要的经验储备，多位置属性在密集赛程中具有额外价值。'
  },
  'Francis de Vries': {
    careerReview: '德弗里斯，31岁左后卫，效力奥克兰FC。防守稳健的左路球员，经验丰富。20次国家队出场打入1球。',
    wcSpotlight: '德弗里斯是左路防守的轮换选项——在需要巩固边路防线时是可靠的防守执行者。'
  },
  'Tyler Bindon': {
    careerReview: '宾登，21岁中卫，效力谢菲尔德联。25次国家队出场打入3球，在21岁的年纪积累了惊人的国家队经验。联赛中的高质量对抗正加速他的成长。',
    wcSpotlight: '宾登是新西兰防线的未来基石——21岁25场国家队经验在任何小国都极为罕见。与博克索尔搭档中卫，面对比利时卢卡库和埃及萨拉赫的冲击，是他职业生涯最大的考验与最佳展示舞台。'
  },
  'Michael Boxall': {
    careerReview: '博克索尔，37岁老将中卫，效力明尼苏达联。美职联多年主力，是新西兰防线上经验最丰富的球员。63次国家队出场打入1球。',
    wcSpotlight: '博克索尔是防线的定心丸——37岁的美职联主力身份和63场国家队经验在应对比利时攻击群时是不可替代的经验来源。这是他最后一届世界杯。'
  },
  'Liberato Cacace': {
    careerReview: '卡卡切，25岁左后卫，效力雷克瑟姆。攻防兼备的左路球员，边路插上和传中是其武器。37次国家队出场打入1球。',
    wcSpotlight: '卡卡切是左路攻防的主力——对位比利时的边路冲击和埃及的锋线时，他的跑动覆盖和传中反击是新西兰边路最稳定的战术选项。'
  },
  'Nando Pijnaker': {
    careerReview: '皮伊纳克，27岁中卫，效力奥克兰FC。身体条件不错，是防线轮换力量。25次国家队出场。',
    wcSpotlight: '皮伊纳克是防线轮换选项——在需要补充防守高度和对抗时是实用替补。'
  },
  'Finn Surman': {
    careerReview: '瑟曼，22岁中卫，效力波特兰伐木者。年轻中卫新秀，美职联的经历正加速其成长。19次国家队出场打入2球。',
    wcSpotlight: '瑟曼是防线年轻储备——22岁的美职联主力经验让他在高强度对抗中不会吃亏，世界杯是检验潜力的最佳平台。'
  },
  'Callan Elliot': {
    careerReview: '埃利奥特，26岁后卫，效力奥克兰FC。防线轮换成员，多位置适应性强。11次国家队出场。',
    wcSpotlight: '埃利奥特是防线深度保障，多位置属性在密集赛程中是战术弹性的来源。'
  },
  'Tommy Smith': {
    careerReview: '史密斯，36岁老将中卫，效力英格兰国家联赛（第五级别）布伦特里镇。经验极为丰富，是球队防线上的活化石。56次国家队出场打入2球。',
    wcSpotlight: '史密斯以36岁高龄入选世界杯大名单——56场国家队经验是他在更衣室和训练场上最宝贵的价值来源。出场机会有限，但经验传导无可替代。'
  },

  // MF
  'Joe Bell': {
    careerReview: '贝尔，27岁中场，效力挪威维京。中场控制和组织能力是其特点，挪威联赛主力经验保证了比赛节奏。32次国家队出场打入1球。',
    wcSpotlight: '贝尔是中场组织环节的重要齿轮——面对比利时严密的配合进攻和伊朗的对抗型中场时，他的控球和出球是新西兰保持球权转换节奏的关键。'
  },
  'Matthew Garbett': {
    careerReview: '加贝特，24岁中场，效力彼得堡联。年轻有为的中场力量，联赛主力经验正在丰富其比赛理解。37次国家队出场打入5球。',
    wcSpotlight: '加贝特是中场轮换中的活力来源——24岁37场国家队经验在同龄人中领先，面对强队高压时他的跑动覆盖是稳住中场的基本保证。'
  },
  'Marko Stamenić': {
    careerReview: '斯塔梅尼奇，24岁防守型中场，效力斯旺西。中场扫荡和拦截是其核心职能，联赛主力经验丰富。39次国家队出场打入3球。',
    wcSpotlight: '斯塔梅尼奇是中场防守屏障——面对比利时（德布劳内）和埃及（斯基里）的中场群时，他的拦截和跑动覆盖是新西兰破坏对手进攻节奏的第一道防线。'
  },
  'Sarpreet Singh': {
    careerReview: '辛格，27岁攻击型中场，效力澳超惠灵顿凤凰。技术含量在新西兰球员中突出，曾效力拜仁二队。28次国家队出场打入3球。',
    wcSpotlight: '辛格是新西兰中前场最具创造力的球员——状态好时他的盘带和传球能创造出意想不到的机会。面对比利时和伊朗的紧逼防守时，他的个人技术是撕开缺口的关键武器。'
  },
  'Elijah Just': {
    careerReview: '贾斯特，26岁中场/边锋，效力苏格兰马瑟韦尔。速度和跑动是其核心优势。44次国家队出场打入9球。',
    wcSpotlight: '贾斯特是前场轮换中的重要速度选项——苏超主力经验保证了对抗强度，边路奔跑和中场衔接是他的核心战术价值。'
  },
  'Alex Rufer': {
    careerReview: '鲁弗，29岁中场，效力澳超惠灵顿凤凰。中场防守型力量，拼抢和覆盖是其核心职责。26次国家队出场。',
    wcSpotlight: '鲁弗是中场轮换中的防守补充——在需要加固中场防线时是可靠选项。澳超多年主力经验是基本保障。'
  },
  'Ben Old': {
    careerReview: '奥尔德，23岁中场，效力圣埃蒂安。技术出色的年轻中场，在法国联赛中持续成长。24次国家队出场打入2球。',
    wcSpotlight: '奥尔德是中场的年轻技术流——圣埃蒂安的法乙主力经验对他的比赛理解提升有切实帮助，替补出场时可注入脚下技术。'
  },
  'Callum McCowatt': {
    careerReview: '麦考瓦特，27岁中场/边锋，效力丹麦锡尔克堡。跑动灵活、战术执行能力不错。32次国家队出场打入4球。',
    wcSpotlight: '麦考瓦特是前场轮换的灵活选项——丹麦联赛的主力经验保证了基本竞技水平，替补登场时跑动和串联能为进攻注入活力。'
  },
  'Ryan Thomas': {
    careerReview: '托马斯，31岁中场，效力荷甲兹沃勒。经验丰富的中场组织者，荷甲多年主力。25次国家队出场打入3球。',
    wcSpotlight: '托马斯是中场的经验型组织者——荷甲主力身份和31岁的大赛经验在需要控制节奏和调整攻防转换时是重要依靠。'
  },
  'Lachlan Bayliss': {
    careerReview: '贝利斯，23岁中场，效力纽卡斯尔喷气机。年轻的中场储备力量，澳超经历正加速成长。4次国家队出场。',
    wcSpotlight: '贝利斯是年轻中场储备——23岁首次征战世界杯，以积累大赛经验和感受氛围为主要目标。'
  },

  // FW
  'Chris Wood': {
    careerReview: '伍德，34岁中锋，90次国家队出场打入45球，稳居新西兰队史射手王。英超伯恩利和诺丁汉森林多年稳定输出，头球、支点和背身护球技术全面。2025-26赛季各项赛事26场8球3助攻。',
    wcSpotlight: '伍德是新西兰进攻端最依赖的得分点——90场45球的国家队纪录无人能及。面对比利时（库尔图瓦）和伊朗防线时，他的身体对抗和禁区威胁是新西兰得分的最主要来源。34岁可能是他最后一届世界杯。'
  },
  'Kosta Barbarouses': {
    careerReview: '巴巴鲁塞斯，36岁老将边锋，效力澳超西悉尼流浪者。澳超多年主力的丰富进球经验。76次国家队出场打入10球。',
    wcSpotlight: '巴巴鲁塞斯是新西兰攻击线上最资深的球员——36岁仍入选世界杯大名单本身即说明他在队内的战术价值。替补出场时的边路经验和进攻嗅觉是锋线变阵的重要补充。'
  },
  'Ben Waine': {
    careerReview: '韦恩，25岁前锋，效力韦尔港。年轻有冲击力，是伍德身边的重要锋线补充。31次国家队出场打入9球。',
    wcSpotlight: '韦恩是与伍德搭配的锋线轮换——25岁的年轻身体在世界杯密集赛程中是宝贵的体能补充，替补登场时可提供不同的进攻节奏。'
  },
  'Jesse Randall': {
    careerReview: '兰德尔，23岁前锋，效力奥克兰FC。年轻的本土前锋，国内联赛主力。11次国家队出场打入2球。',
    wcSpotlight: '兰德尔是锋线的年轻储备——23岁首次征战世界杯，以积累经验和把握有限的出场机会为主要目标。'
  }
};

let applied = 0;
const results = [];
for (const [name, updates] of Object.entries(corrections)) {
  const entry = wiki[name];
  if (!entry) { results.push({ name, status: 'NOT_FOUND' }); continue; }
  const orig = { cr: entry.careerReview, ws: entry.wcSpotlight };
  if (updates.careerReview) entry.careerReview = oppFix(cleanProse(updates.careerReview));
  if (updates.wcSpotlight) entry.wcSpotlight = oppFix(cleanProse(updates.wcSpotlight));
  applied++;
  results.push({ name, status: 'UPDATED', cr: orig.cr !== entry.careerReview, ws: orig.ws !== entry.wcSpotlight });
}

// GC for uncorrected
const nzlPlayers = nzl.players.map(p => p.name);
for (const name of nzlPlayers) {
  const e = wiki[name];
  if (!e || corrections[name]) continue;
  let changed = false;
  if ((e.careerReview||'') + (e.wcSpotlight||'').match(/唯一|最致命|最高效|定海|图腾|灯塔|灵魂|信仰|神话|不朽|不死|不灭|永不|燃烧|太阳|上帝|X因素|黑马|战略投资|成长加速器|无可替代/)) {
    e.careerReview = oppFix(cleanProse(e.careerReview || ''));
    e.wcSpotlight = oppFix(cleanProse(e.wcSpotlight || ''));
    changed = true;
  }
  if (changed) { console.log('GC: ' + name); applied++; }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`\n=== New Zealand Summary ===`);
console.log(`Applied: ${applied} / ${nzlPlayers.length}`);
results.forEach(r => {
  if (r.status === 'UPDATED') {
    const c = [];
    if (r.cr) c.push('CR');
    if (r.ws) c.push('WS');
    console.log(`  ${r.name}: ${c.join(',')}`);
  }
});
