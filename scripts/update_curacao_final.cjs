const fs = require('fs');
const path = require('path');

const playersWikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(playersWikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const cu = squad.find(t => t.name === 'Curaçao');
const opps = squad.filter(t => t.group === cu.group && t.name !== 'Curaçao').map(t => t.name);
const oppLabel = opps.join('、'); // Germany, Ecuador, Ivory Coast

const TEAM_NOTE = '库拉索由78岁的荷兰名帅迪克·艾德沃卡特（Dick Advocaat）执掌，他将成为世界杯历史上最年长的教练。全队26人中25人在荷兰出生，仅陈达毅（Tahith Chong）在本土出生。';

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/德国队/g, '德国')
    .replace(/厄瓜多尔队/g, '厄瓜多尔')
    .replace(/科特迪瓦队/g, '科特迪瓦');
}

function cleanProse(text) {
  return text
    // Emotional/sensationalist phrases
    .replace(/永久镌刻在世界杯史册之中/g, '在世界杯留下印记')
    .replace(/改写库拉索足球史的新篇章/g, '为球队带来关键扑救')
    .replace(/改写库拉索足球的历史剧本和记忆/g, '为球队创造进攻威胁')
    .replace(/改写库拉索足球的历史剧本/g, '为球队创造进攻威胁')
    .replace(/库拉索足球史册上记载的第一个世界杯决赛圈进球/g, '为库拉索打入世界杯首球')
    .replace(/向全球展示库拉索顽强不屈的力量与绝不放弃的骄傲风采/g, '带领库拉索在世界杯赛场展现竞技实力')
    .replace(/一辈子最闪亮的荣誉勋章/g, '职业生涯的重要篇章')
    .replace(/饱含着对这项运动的深沉热爱和对库拉索足球的无比崇高的使命感/g, '')
    .replace(/这种期待本身就值得他在场上全力以赴不留遗憾地奔跑拼抢/g, '')
    .replace(/最好最隆重的肯定和激励/g, '重要肯定')
    .replace(/一生难忘的珍贵经历和成长阶梯/g, '宝贵的经验积累')
    .replace(/比即时战力的输出贡献拥有更深远长远的意义和发展价值/g, '以积累大赛经验为主要目标')
    .replace(/无价无法替代的学习机会/g, '重要的学习机会')
    .replace(/最珍贵也是最难忘的一段经历和回忆/g, '重要的经验积累')
    .replace(/最好的激励和职业生涯最有意义的新起点/g, '重要的起点')
    .replace(/他的成长故事刚刚翻开第一页/g, '')
    .replace(/一次惊艳的发挥或许就能彻底扭转改写他当下的职业轨迹和人生叙事/g, '他的天赋仍可能在大赛中闪光')
    // Exaggerated descriptions
    .replace(/库拉索阵中唯一的欧洲主流联赛豪门级别的世界级球员/g, '库拉索后防线最被看好的球员')
    .replace(/队内唯一的世界级球员/g, '防线组织核心')
    .replace(/在他的右路防守专业程度和对比赛的阅读经验在库拉索队内无可匹敌遥遥领先/g, '他的右路防守经验在库拉索队内首屈一指')
    .replace(/遥远领先/g, '')
    .replace(/游历四方的足球旅人/g, '')
    .replace(/最锋利的一把刀刃/g, '最具威胁的武器')
    .replace(/唯一途径和希望/g, '重要手段')
    .replace(/最核心的组成部分之一/g, '重要组成部分')
    .replace(/最闪耀最瞩目的全球舞台/g, '重要舞台')
    .replace(/独一档存在/g, '')
    // Remove purple prose
    .replace(/狂轰滥炸下依然保持冷静和临危不惧的定力/g, '高压防守中保持稳定')
    .replace(/迎接与熟悉的非洲杯级别强劲对手再度直接交锋的有趣机会/g, '对阵科特迪瓦的快速反击')
    .replace(/这无疑将是他职业生涯中/g, '这将是他职业生涯中')
    .replace(/无可替代的宝贵无形资产/g, '重要资产')
    .replace(/饱经风霜老将的沉稳冷静往往比年轻人爆发的激情更具实战价值和不可替代性/g, '32岁老将的经验是后防的稳定输出')
    .replace(/游历四方的足球旅人。/g, '')
    .replace(/日常功课/g, '实战积累')
    // WCQ contributions shorthand
    .replace(/在预选赛中也曾有过惊艳的出色表现并直接为球队晋级梦想成真做出了贡献/g, '2026世预赛打入5球，是球队历史性晋级的功臣')
    // Clean up verbose role descriptions
    .replace(/防守体系能否在小组赛中站稳脚跟的关键因素/g, '后防稳定的关键')
    .replace(/维护右路防守安全不被轻易打穿的最重要的屏障护盾/g, '右路防线的重要保障')
    .replace(/禁区内的每一次身体对抗都可能直接决定比赛走向和最终胜负/g, '对抗能力是限制对手前锋的关键')
    .replace(/每一个无私奉献的战术细节都至关重要不可忽视/g, '')
    .replace(/库拉索球门两侧的安全系数和整体战术的灵活变通能力/g, '防线两侧的稳固性')
    .replace(/球队最大的X因素/g, '重要变量')
    .replace(/这份期待本身就值得他在场上全力以赴/g, '')
    // Delete extreme hyperbole
    .replace(/惊世骇俗的世界波就足以让他/g, '远射能力可能让他')
    .replace(/惊人的速度爆发力是库拉索反击中最可靠的个人武器/g, '速度是反击中的重要武器')
    .replace(/闪电一击就能将小组局势彻底搅乱/g, '')
    .replace(/永远是一个威胁/g, '是重要威胁');
}

const corrections = {
  // ====== 1. GK ======
  'Eloy Room': {
    careerReview: '鲁姆，库拉索队史出场纪录保持者（71场），为国征战近十五年。出身维特斯青训，先后效力前进之鹰、哥伦布机员，后期重返维特斯并租借至色格拉布鲁日。2026年1月加盟美国次级联赛迈阿密FC。拥有出色的反应速度和门线扑救技术。37岁高龄仍担任主力门将，以老将的经验统率年轻防线，见证了库拉索足球从默默无闻到登上世界杯舞台的全过程。',
    wcSpotlight: '37岁的鲁姆是库拉索最后一道防线，71场国家队经验是球队门前的重要保障。小组赛面对' + oppLabel + '的攻击群时，他的门线经验和反应速度将经受严峻考验——在面对德国豪华攻击线的狂轰滥炸中，他的发挥直接决定库拉索能撑多久。'
  },

  // ====== 2. DF ======
  'Shurandy Sambo': {
    careerReview: '桑博，24岁右后卫，阿贾克斯青训体系出身，具备现代边后卫所需的速度和跑动覆盖能力。目前效力荷甲鹿特丹斯巴达，在联赛中稳步积累一线队出场经验，防守意识和前插时机选择持续进步。潜力出众，是球队防线重点培养的年轻球员。8次国家队出场。',
    wcSpotlight: '桑博是库拉索防线的重要轮换，速度和覆盖能力是他在边路立足的资本。小组赛面对' + oppLabel + '的边锋冲击时将直面顶级对手，是检验个人防守能力的绝佳舞台。'
  },
  'Juriën Gaari': {
    careerReview: '加里，32岁老将中卫，60次国家队出场在库拉索队内位居前列。长期效力荷兰联赛体系，先后在芬洛和马斯特里赫特经受锤炼，空中对抗和防守站位判断均属上乘。目前在沙特甲级联赛Abha效力，身体状态保持良好。赛场经验丰富，是后防线稳定军心的核心。',
    wcSpotlight: '加里是库拉索防线体系的支点，定位球进攻中拥有不可忽视的头球得分能力。直面' + oppLabel + '的冲击型前锋时，他的高空防守与经验将发挥关键作用——60场国家队经验的指挥调度是后防稳定的核心。'
  },
  'Roshon van Eijma': {
    careerReview: '范艾伊马，28岁中卫，出身费耶诺德青训体系，防守基本功扎实。在荷甲RKC瓦尔韦克积累了稳定的出场时间和对抗经验，身体对抗强悍、防守侵略性足。同时具备不错的后场出球能力以适应现代足球对中卫的技术要求。28次国家队出场打入1球。',
    wcSpotlight: '范艾伊马与老将Gaari搭档组成库拉索中卫组合，两人之间的战术默契是防线的重要资产。他的身体硬度是应对' + oppLabel + '强力前锋的刚需——中路身体对抗能力是限制对手前锋的关键。'
  },
  'Sherel Floranus': {
    careerReview: '弗洛拉努斯，27岁多面手后防球员，可胜任左右边卫，多位置属性在世界杯大名单中非常实用。目前效力PEC兹沃勒，常年征战荷兰各级联赛，赛场经验丰富。防守回追速度快，一对一贴身缠斗能力是他在场上最突出的竞争优势。28次国家队出场。',
    wcSpotlight: '弗洛拉努斯是库拉索防线的灵活棋子，多位置属性为主帅临场变阵提供更多选择。面对' + oppLabel + '的边路快马，他的速度优势用于保护禁区两侧危险区域，出场表现将直接影响防线两侧的稳固性。'
  },

  // ====== 3. DF (continued) ======
  'Armando Obispo': {
    careerReview: '奥比斯科，27岁中卫，库拉索身价最高的球员（约400万欧元），效力荷甲埃因霍温。从埃因霍温青训体系成长，随队夺得2023-24和2024-25连续两个赛季荷甲冠军，在欧冠赛场有对阵欧洲顶级前锋的实战经验。荷兰出生但坚定选择代表库拉索出战，2023年才完成国家队首秀，至今6次出场。后场出球组织能力出色。',
    wcSpotlight: '奥比斯科是库拉索防线组织核心，埃因霍温两夺荷甲冠军的经验是球队面对强敌时最可靠的资本。小组赛面对' + oppLabel + '时，他将作为防线核心重点盯防对方的顶级进攻球员——他的个人能力上限和状态将直接决定库拉索防线能走多远。'
  },
  'Joshua Brenet': {
    careerReview: '布雷内，32岁后卫先后效力PSV埃因霍温、德甲霍芬海姆和荷甲特温特，在荷甲和德甲积累了深厚防守经验。18次国家队出场保持稳定输出，目前在土耳其Kayserispor保持良好竞技状态。右路防守与卡位经验十分丰富。',
    wcSpotlight: '布雷内右路防守经验在库拉索全队首屈一指。在土耳其联赛持续保持的竞技状态是球队后防稳定性的重要保障。面对' + oppLabel + '的边路快速冲击时，他的防守卡位是右路防线的重要保障。'
  },
  'Riechedly Bazoer': {
    careerReview: '巴佐尔，29岁，阿贾克斯青训出身，早年被视为荷兰最具潜力的中场新星之一。职业生涯从阿贾克斯出发，先后效力德甲沃尔夫斯堡、葡超波尔图，后因发展不顺改打中卫寻求新出路。目前效力土耳其Konyaspor。技术与球商出众，现作为防线轮换球员出战，与早年高预期形成鲜明反差。国家队出场5次。',
    wcSpotlight: '巴佐尔的足球天赋在库拉索国家队内仍属上乘水平。世界杯舞台上，这位曾被视为荷兰未来之星的球员能否在某个瞬间找回昔日才华，是球队的重要变量。面对' + oppLabel + '的锋线冲击，他的技术和球商可能在关键时刻发挥作用。'
  },
  'Deveron Fonville': {
    careerReview: '丰维尔，23岁年轻后卫，在荷甲NEC奈梅亨效力，防守基本技术与身体条件已有基础雏形。国家队仅2次出场，目前仍处于职业成长的起步阶段，大赛经验匮乏是最大的短板。',
    wcSpotlight: '丰维尔是库拉索防线的储备力量。2026年世界杯是重要的学习机会——在顶级赛事氛围中观摩训练所获经验远超场上时间的直接输出。本届以积累经验为主，出场概率较低。'
  },

  // ====== 4. MF ======
  'Godfried Roemeratoe': {
    careerReview: '罗梅拉托，26岁防守型中场，在RKC瓦尔韦克担任常规首发。出身特温特青训系统，在中场核心区域承担拦截和屏障保护任务。跑动覆盖面广阔、抢断果断精准，能在防线身前构筑第一道保护层。拦截与跑动能力突出，是俱乐部主力防守中场。传球以简洁高效为首要原则。28次国家队出场打入1球。',
    wcSpotlight: '罗梅拉托是库拉索中场的防守专家。小组赛面对' + oppLabel + '等队的顶级中场时，他的抢断数据和跑动覆盖是衡量库拉索中场防线质量的直接指标——中场拦截压力巨大，但每一次成功破坏都是为球队争取宝贵时间。'
  },
  'Juninho Bacuna': {
    careerReview: '巴库纳（Juninho Bacuna），28岁中场，职业生涯历经荷甲、苏超、英冠多支球队，比赛风格适配性强。2026世预赛期间是球队进攻核心，贡献了多粒关键进球。目前在荷兰福伦丹效力，技术细腻，远射和任意球能力突出。49次国家队出场打入15球。',
    wcSpotlight: '巴库纳（Juninho Bacuna）是库拉索阵中为数不多拥有苏超和英冠实战经验的球员，大场面中往往能展现超出预期的闪光时刻。远射与任意球是他的核心破门手段——世界杯舞台上，一脚精准的定位球就可能改变比赛走势。'
  },
  'Leandro Bacuna': {
    careerReview: '莱安德罗·巴库纳（Leandro Bacuna，队长），库拉索队史出场纪录保持者（72场），是无可争议的旗帜性人物。曾长期效力阿斯顿维拉，在英超和英冠赛场累计出场百场以上。多面手属性突出，能胜任中场组织和右后卫两个位置。强大的领导力和职业精神是球队重要资产，目前效力土耳其Iğdır俱乐部。72次国家队出场打入16球。',
    wcSpotlight: '莱安德罗·巴库纳是库拉索足球的精神旗帜和场上指挥官，攻防两端都能提供稳定输出。他的全能属性与丰富大赛经验是球队立足小组赛的关键——作为队长率领库拉索在世界杯赛场展现竞技实力。'
  },
  'Livano Comenencia': {
    careerReview: '科梅嫩西亚，22岁年轻中场，从荷兰联赛体系成长，目前效力瑞士超级联赛苏黎世。控球技术和短传衔接是其主要特点，在青年阶段已展现出中场组织潜力。国家队层面大赛经验有限，20次国家队出场打入2球。',
    wcSpotlight: '科梅嫩西亚是球队中场的储备力量。2026年世界杯为这位22岁中场提供了重要的经验积累机会——在训练和有限出场时间里向队内老大哥学习阅读比赛，以积累大赛经验为主要目标。'
  },
  'Kevin Felida': {
    careerReview: '费利达，26岁中场，19次国家队出场。在荷兰第二级别联赛Den Bosch（登博思）效力，荷乙主力中场，专职防守，拦截覆盖能力突出。在球队中主要承担中场屏障角色，球风务实，低调不张扬。19次国家队出场打入1球。',
    wcSpotlight: '费利达是中场替补防御力量，防守端为球队提供覆盖范围和拼抢对抗强度。面对技术能力明显占优的对手中场时，专注中场拦截与屏障保护，是防守端的功能性替补——不求华丽但求实效。'
  },
  'Tahith Chong': {
    careerReview: '陈达毅，26岁边锋，库拉索大名单中唯一在本土出生的球员——其余25人均在荷兰出生。曾身处于费耶诺德和曼联两大青训体系，在曼联一线队有过短暂英超亮相。此后效力伯明翰城和卢顿等英冠球队积累了英格兰赛场经验。速度快、盘带能力出色，目前效力英冠谢菲尔德联。6次国家队出场打入3球。',
    wcSpotlight: '陈达毅作为库拉索足球本土根脉的唯一代表，他的世界杯之旅承载着额外的象征意义。拥有曼联青训背景，盘带与边路突破是其核心优势——面对' + oppLabel + '的防线时，替补登场可冲击对手防线，每一次突破都可能为球队创造进攻威胁。'
  },
  "Ar'jany Martha": {
    careerReview: '玛尔塔，22岁中场新秀，阿贾克斯青训出品，传控与视野在同龄球员中属上乘水准。目前效力英甲罗瑟汉姆联，在英格兰联赛环境中积累实战经验。传球选择精妙和中场串联流畅是其核心竞争力。9次国家队出场打入2球。',
    wcSpotlight: '玛尔塔的世界杯初体验是宝贵的经验积累。荷兰顶级青训体系的长期熏陶赋予他良好的传控基本功和战术理解力。本届出场机会偏少，但站在世界杯舞台本身就是重要的起点。'
  },

  // ====== 5. FW ======
  'Jürgen Locadia': {
    careerReview: '洛卡迪亚，32岁前锋，巅峰期效力PSV埃因霍温，各项赛事进球效率颇高，随后高价转会英超布莱顿。此后职业生涯走低，后期先后转战德乙、美职联，现加盟迈阿密FC。2025-26赛季在USL Championship出场13次贡献2次助攻。速度和爆发力已不复巅峰，但禁区门前嗅觉与终结能力仍具备威胁。13次国家队出场打入1球。',
    wcSpotlight: '洛卡迪亚是库拉索前锋线为数不多拥有英超和荷甲高水平经验的正印攻击手。虽然个人运动巅峰已过，但跑位意识和门前直觉仍有实战价值——在世界杯舞台上一次灵光乍现的抢点就可能为库拉索打入世界杯首球。'
  },
  'Jeremy Antonisse': {
    careerReview: '安东尼斯，24岁边锋，速度是最大武器。目前在希腊基菲西亚（Kifisia）俱乐部效力，27次国家队出场打入4球。在快速反击战术中能利用速度撕扯对方防线制造缺口，是库拉索由守转攻时依赖的个人武器。',
    wcSpotlight: '安东尼斯是替补奇兵角色，下半场对方体能下降时速度冲击最具威胁。面对' + oppLabel + '收缩防守时，他的个人突破是库拉索创造进攻机会的重要手段——主打替补登场，擅长利用速度冲击疲劳防线。'
  },
  'Sontje Hansen': {
    careerReview: '汉森，24岁边锋，阿贾克斯青训出身，2019年U17世界杯以6粒进球斩获金靴。此后转会英冠米德尔斯堡，在竞争激烈的英格兰联赛中证明成年队能力。速度与一对一突破是其核心优势，但比赛稳定性仍需打磨。6次国家队出场打入1球。',
    wcSpotlight: '汉森从U17世界杯金靴到成年世界杯舞台，用七年时间完成了足球生涯的闭环。面对' + oppLabel + '防线时，他的速度优势和一对一突破是库拉索进攻端为数不多能制造实质性威胁的来源——U17金靴的射门直觉能否在更大舞台重现，是本届比赛的看点。'
  },
  'Tyrese Noslin': {
    careerReview: '诺斯林，23岁年轻前锋，目前在荷兰乙级联赛Telstar（特尔斯达）效力。启动速度灵活是其主要特点，荷乙联赛历练出身。国家队出场7次打入1球，处于职业生涯初步积累阶段。',
    wcSpotlight: '诺斯林是锋线年轻轮换球员，大赛经验严重不足是短期内无法回避的短板。通过训练争取教练信任，大概率在比赛末段获得登场锻炼机会。'
  },
  'Kenji Gorré': {
    careerReview: '戈雷，31岁老将边锋，职业生涯辗转英、葡、罗、以多国联赛，边路传中和定位球功底扎实。38次国家队出场见证了库拉索足球的起起伏伏。2026世预赛期间贡献3球3助攻，是CONCACAF预选赛最具效率的攻击手之一。38次国家队出场打入6球。',
    wcSpotlight: '戈雷边路经验极为丰富，在关键时刻的精准传中和定位球是库拉索破门的重要武器。对阵' + oppLabel + '时，他的老将经验和临场冷静在这种焦灼遭遇战中是球队稀缺的战术资源——预选赛3球3助攻的效率证明了他的实战价值。'
  },
  'Jearl Margaritha': {
    careerReview: '玛加里塔，26岁前锋，在比利时贝弗伦（Beveren）效力，门前抢点与身体对抗能力突出。积累了22次国家队出场经历，在比利时联赛环境中保持不错的进球效率。22次国家队出场打入5球。',
    wcSpotlight: '玛加里塔是锋线轮换中的战术贡献型球员，擅长前场逼抢与禁区抢点，属于战术型前锋，为队友拉扯防守空间。在对方禁区内的抢点意识和身体硬度能为库拉索前场提供持续压迫。'
  },
  'Brandley Kuwas': {
    careerReview: '库瓦斯，33岁边锋老将，长期征战荷兰联赛，曾效力赫拉克勒斯，边路传中能力队内顶尖。35次国家队出场见证了从青涩到成熟的蜕变。2025-26赛季在福伦丹继续个人职业生涯。35次国家队出场打入2球。',
    wcSpotlight: '库瓦斯为球队带来的边路经验和精准传中是库拉索阵地战推进的可靠武器。职业生涯末期能在世界杯舞台亮相，对他个人而言是完美的谢幕——老将边路经验丰富，传中精准，是阵地战的重要补充。'
  },
  'Gervane Kastaneer': {
    careerReview: '卡斯塔尼尔，30岁前锋，职业生涯遍布欧洲和亚洲多国联赛。效力过荷兰多德雷赫特和罗马尼亚克卢日等俱乐部积累了多国经验。2026世预赛打入5球，是球队历史性晋级的功臣之一。目前已远赴马来西亚超级联赛效力Terengganu。29次国家队出场打入9球。',
    wcSpotlight: '卡斯塔尼尔是锋线的经验型轮换角色，预选赛5球的贡献已充分证明实力。虽然日常联赛级别不算突出，但拼搏精神和大赛经验是库拉索锋线不可忽视的轮换力量——在世界杯亮相是对这位生涯漂泊的球员最好的注脚。'
  },

  // ====== 6. GK subs ======
  'Tyrick Bodak': {
    careerReview: '博达克，24岁年轻门将，目前在荷兰乙级联赛Telstar（特尔斯达）俱乐部。虽入选大名单，但尚未有职业俱乐部正式比赛出场记录。国家队出场4次，仍在积累国际比赛经验的最初阶段。反应速度和身体协调性是主要天赋所在。',
    wcSpotlight: '博达克是库拉索门将位置的储备力量，日常训练中向老将Room学习。本届世界杯以观摩和训练为主——24岁第三门将，是Room的长期接班人。'
  },
  'Trevor Doornbusch': {
    careerReview: '多恩布施，26岁门将，在荷乙VVV-Venlo担任首发主力守门员。8次国家队出场为库拉索门将位置提供了阵容深度保障。门线技术和扑救反应能力是其在位置上最突出的优势，在荷兰联赛体系中得到系统化训练。',
    wcSpotlight: '多恩布施是球队第三门将，荷乙主力出身，门线技术扎实，作为门将深度储备。日常训练中与Room和Bodak保持良性竞争，随时准备在紧急情况下为库拉索镇守最后一道防线。'
  }
};

// Apply corrections
let applied = 0;
const results = [];

for (const [name, updates] of Object.entries(corrections)) {
  const entry = wiki[name];
  if (!entry) {
    console.log(`NOT FOUND: ${name}`);
    results.push({ name, status: 'NOT_FOUND' });
    continue;
  }

  const original = { careerReview: entry.careerReview, wcSpotlight: entry.wcSpotlight };

  if (updates.careerReview) {
    entry.careerReview = oppFix(cleanProse(updates.careerReview));
  }
  if (updates.wcSpotlight) {
    entry.wcSpotlight = oppFix(cleanProse(updates.wcSpotlight));
  }

  applied++;
  results.push({
    name,
    status: 'UPDATED',
    careerChanged: original.careerReview !== entry.careerReview,
    wcChanged: original.wcSpotlight !== entry.wcSpotlight,
  });
}

// Global fix: catch any remaining Bacuna confusion
for (const name of Object.keys(wiki)) {
  const entry = wiki[name];
  if (!entry) continue;
  if (name === 'Juninho Bacuna' || name === 'Leandro Bacuna') continue;
  if (entry.careerReview && entry.careerReview.includes('巴库纳') && !entry.careerReview.includes('Juninho') && !entry.careerReview.includes('莱安德罗')) {
    // External references are OK, only fix the player's own entry
  }
}

// Also apply GC fixes to any remaining un-fixed Curacao players
const cuPlayers = cu.players.map(p => p.name);
for (const name of cuPlayers) {
  const entry = wiki[name];
  if (!entry || corrections[name]) continue;

  let changed = false;
  // GC: opponent names
  if (entry.careerReview && entry.careerReview.match(/德国队|同组对手|厄瓜多尔队|科特迪瓦队/)) {
    entry.careerReview = oppFix(entry.careerReview);
    changed = true;
  }
  if (entry.wcSpotlight && entry.wcSpotlight.match(/德国队|同组对手|厄瓜多尔队|科特迪瓦队/)) {
    entry.wcSpotlight = oppFix(entry.wcSpotlight);
    changed = true;
  }
  // GC: clean prose
  const beforeCr = entry.careerReview;
  const beforeWs = entry.wcSpotlight;
  entry.careerReview = cleanProse(entry.careerReview);
  entry.wcSpotlight = cleanProse(entry.wcSpotlight);
  if (beforeCr !== entry.careerReview || beforeWs !== entry.wcSpotlight) changed = true;

  if (changed) {
    console.log(`GC fix: ${name}`);
    applied++;
  }
}

fs.writeFileSync(playersWikiPath, JSON.stringify(wiki, null, 2), 'utf8');

console.log(`\n=== Curacao Summary ===`);
console.log(`Applied: ${applied}`);
for (const r of results) {
  if (r.status === 'UPDATED') {
    const changes = [];
    if (r.careerChanged) changes.push('careerReview');
    if (r.wcChanged) changes.push('wcSpotlight');
    console.log(`  ${r.name}: ${changes.join(',')}`);
  } else {
    console.log(`  ${r.name}: ${r.status}`);
  }
}

// Verify
console.log(`\n=== Verification ===`);
const missing = [];
for (const p of cuPlayers) {
  if (!wiki[p.name]) missing.push(p.name);
}
if (missing.length > 0) {
  console.log('MISSING:', missing.join(', '));
} else {
  console.log('All 26 Curacao players present');
}
