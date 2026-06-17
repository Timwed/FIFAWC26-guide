const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const iq = squad.find(t => t.name === 'Iraq');
const opps = squad.filter(t => t.group === iq.group && t.name !== 'Iraq').map(t => t.name);
const oppLabel = opps.join('、');

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/同组强敌/g, oppLabel)
    .replace(/欧洲强队/g, oppLabel)
    .replace(/世界强队/g, oppLabel)
    .replace(/法国队/g, '法国')
    .replace(/挪威队/g, '挪威')
    .replace(/塞内加尔队/g, '塞内加尔');
}

function cleanProse(text) {
  return text
    .replace(/34岁/g, '35岁')
    .replace(/Ipswich Town/g, '卢顿镇')
    .replace(/伊普斯维奇/g, '卢顿镇')
    // Fluff removals
    .replace(/宝贵的经验/g, '')
    .replace(/宝贵的国际比赛经验/g, '')
    .replace(/重要的成长契机/g, '')
    .replace(/不可多得的历练机会/g, '')
    .replace(/不可复制的成长经历/g, '')
    .replace(/关键变量/g, '')
    .replace(/胜负手/g, '')
    .replace(/值得重点关注/g, '')
    .replace(/定海神针/g, '')
    .replace(/压舱石/g, '')
    .replace(/定心丸/g, '')
    .replace(/数据本身就是一座丰碑/g, '')
    .replace(/最伟大的射手之一/g, '队史射手王')
    .replace(/超级射手特有的自信个性和比赛气质/g, '射手素质')
    .replace(/A级超级球星/g, '核心')
    .replace(/B级核心/g, '')
    .replace(/轮番轰炸和狂轰滥炸/g, '射门考验')
    .replace(/伊拉克足球史上最伟大的射手之一/g, '伊拉克队史射手王')
    .replace(/这一纪录在可预见的未来都难以被撼动/g, '')
    .replace(/整个国家的热切期待和足球梦想/g, '')
    .replace(/全世界防守教练都将为研究如何有效限制他而绞尽脑汁和制定专门方案/g, '')
    .replace(/绞尽脑汁/g, '')
    .replace(/伊拉克最——具杀伤力和威慑力的/g, '伊拉克')
    .replace(/伊拉克足坛传奇门将/g, '伊拉克老门将')
    .replace(/最难攻克的心理防线/g, '')
    .replace(/定海神针和最后防线/g, '最后防线')
    .replace(/稳定得近乎机械的发挥和丰富到难以量化的比赛经验著称/g, '经验丰富')
    .replace(/西亚足坛享有崇高声誉/g, '')
    .replace(/一座丰碑/g, '')
    .replace(/伊拉克足球史上最伟大的射手之一/g, '伊拉克队史射手王')
    .replace(/在可预见的未来都难以被撼动/g, '')
    .replace(/承载着整个国家的热切期待和足球梦想/g, '')
    .replace(/晴雨表和生命线/g, '关键')
    .replace(/值得在赛前布置中进行重点研究并制定针对性防范方案/g, '')
    .replace(/核心变量和胜负手/g, '核心')
    .replace(/战术弹性和阵容深度的具体体现和人员保障/g, '')
    .replace(/改变比赛走向和攻防节奏/g, '')
    .replace(/重要的组成部分和未来希望/g, '')
    .replace(/稳定压舱石和定心丸/g, '')
    .replace(/宝贵的排兵布阵灵活性和战术选择空间/g, '')
    .replace(/初生牛犊不怕虎的冲击力和毫无包袱/g, '')
    .replace(/意外之喜和/g, '')
    .replace(/战术效果和惊喜/g, '变数')
    .replace(/进攻贡献度/g, '表现')
    .replace(/X因素/g, '')
    .replace(/保证战术弹性和人员深度/g, '')
    .replace(/战术弹性/g, '')
    .replace(/人员深度/g, '')
    .replace(/值得在赛前进行重点关注和持续观察/g, '')
    .replace(/晴雨表和生命线/g, '关键')
    .replace(/比赛转折点/g, '选择')
    .replace(/战术想象力和创造力上限/g, '创造力')
    .replace(/进攻组织上限和战术想象力/g, '上限')
    .replace(/进球希望的最大寄托和战术支柱/g, '得分核心')
    .replace(/最重要的舞台/g, '重要舞台')
    .replace(/最锋利的武器/g, '主要武器')
    .replace(/一个关键观察点和隐患所在/g, '考验')
    .replace(/排兵布阵灵活性和战术选择空间/g, '灵活性')
    .replace(/核心支撑力量和战术根基/g, '支撑')
    .replace(/值得对手在赛前布置中进行重点研究并制定针对性防范方案/g, '')
    .replace(/最后的希望/g, '最后选择')
    .replace(/传奇门将/g, '老门将')
    .replace(/雷打不动的/g, '')
    .replace(/最重要的/g, '')
    .replace(/最关键/g, '')
    .replace(/极其/g, '')
    .replace(/极具/g, '')
    // Normalize multi-periods only
    .replace(/。。{2,}/g, '。')
    ;
}

const corrections = {
  // GK
  'Fahad Talib': {
    careerReview: '塔利卜，31岁门将，效力塔拉巴。21次国家队出场，立足稳健，反应扑救能力突出。',
    wcSpotlight: '塔利卜是第三门将，面对法国、挪威和塞内加尔时主要任务是训练中模拟强队射门，保持竞技状态。'
  },
  'Jalal Hassan': {
    careerReview: '哈桑，35岁老门将，效力扎拉瓦。102次国家队出场，是伊拉克队史出场次数最多的门将。多年国家队主力，经验丰富。',
    wcSpotlight: '哈桑以102场国家队经验来到本届世界杯——面对法国姆巴佩、挪威哈兰德和塞内加尔的攻击群，他的扑救经验和防线指挥是伊拉克防守的最后保障。35岁高龄的反应速度是唯一变数。'
  },
  'Ahmed Basil': {
    careerReview: '巴兹尔，29岁门将，效力警察队。16次国家队出场，在有限的出场机会中多次展现了可靠的扑救能力和临场冷静。',
    wcSpotlight: '巴兹尔是门将轮换的可靠保险，紧急情况下可提供稳定表现。'
  },

  // DF
  'Rebin Sulaka': {
    careerReview: '苏莱卡，34岁中卫，效力泰国港口。56次国家队出场打入1球，强悍的身体对抗和高空球争顶是核心武器。',
    wcSpotlight: '苏莱卡是防线上的经验中卫——面对哈兰德和法国攻击群时，他的头球争顶是防空关键。定位球进攻中也是前场威胁点。'
  },
  'Hussein Ali': {
    careerReview: '侯赛因·阿里，24岁中卫，效力波兰什切青波贡。现代中卫类型，出球能力和后场组织视野突出，防守抢断时机日趋成熟。27次国家队出场打入1球。',
    wcSpotlight: '阿里是防线上的出球型中卫——面对法国和挪威的高位逼抢时，他的后场组织推进能力是伊拉克由守转攻的起点。'
  },
  'Zaid Tahseen': {
    careerReview: '塔赫辛，25岁中卫，效力乌兹别克斯坦棉农。28次国家队出场打入1球，预判和身体平衡感良好，具备后场出球视野。',
    wcSpotlight: '塔赫辛是防线轮换主力——面对塞内加尔的快速进攻时，贴身防守和预判能力将直接影响伊拉克防守整体性。'
  },
  'Akam Hashim': {
    careerReview: '哈希姆，27岁后卫，效力扎拉瓦。老派硬汉型防守者，14次国家队出场打入1球。关键时刻敢于用身体封堵射门线路。',
    wcSpotlight: '哈希姆是防线深度选项，面对法国和挪威的边路冲击时他的右路一对一防守将经受考验。'
  },
  'Manaf Younis': {
    careerReview: '尤尼斯，29岁中卫，效力警察队。34次国家队出场打入1球，防线组织体系中的核心成员，承担防守指挥和战术纪律职责。',
    wcSpotlight: '尤尼斯与苏莱卡的中卫搭档配合默契，面对法国和挪威的高强度进攻时防线紧凑性是最大考验。'
  },
  'Ahmed Maknzi': {
    careerReview: '马克恩齐，24岁后卫，效力卡尔马。身体对抗意愿强，7次国家队出场。是后防线储备人才。',
    wcSpotlight: '马克恩齐是防线年轻储备，面对挪威和塞内加尔的强者对抗是对他成长的最大检验。'
  },
  'Merchas Doski': {
    careerReview: '多斯基，26岁边后卫，效力比尔森胜利。欧洲青训体系出身，战术理解力和位置感扎实。31次国家队出场打入1球。',
    wcSpotlight: '多斯基是边路攻防主力——捷克联赛的主力经验保证了对欧洲足球节奏的熟悉。面对法国和挪威边锋时，他的攻防覆盖将直接影响边路博弈。'
  },
  'Mustafa Saadoon': {
    careerReview: '萨阿敦，25岁后卫，效力警察队。预判和比赛阅读准确，身高在定位球攻防中具实际价值。17次国家队出场。',
    wcSpotlight: '萨阿敦是防线轮换选项，亚冠赛场的硬仗经历是他在大赛高压下保持冷静的心理资本。'
  },
  'Frans Putros': {
    careerReview: '普特罗斯，32岁后卫，效力万隆。多面手属性出色，可胜任中卫和左右边后卫。28次国家队出场。',
    wcSpotlight: '普特罗斯是后场万金油——在世界杯密集赛程中他的多位置灵活性为教练组提供了调度空间。'
  },

  // MF
  'Youssef Amyn': {
    careerReview: '阿明，22岁中场，效力AEK拉纳卡。伊拉克中场新生代代表人物，攻防转换中的串联组织日趋成熟。27次国家队出场打入2球。',
    wcSpotlight: '阿明是中场年轻力量——面对法国和挪威的技术型中场时，他能否在压力下保持传接球质量将直接影响伊拉克中场控制力。'
  },
  'Ibrahim Bayesh': {
    careerReview: '巴耶什，26岁中场，效力迪哈夫拉。76次国家队出场打入8球，是近年来伊拉克最稳定的中场核心。覆盖面积大、跑动能力出众、攻防转换节奏感强，远射颇具威胁。',
    wcSpotlight: '巴耶什是中场引擎——面对法国、挪威和塞内加尔时，他的体能分配和战术执行力是伊拉克能否与三支强队周旋的关键。有限机会中的远射特长是得分补充。'
  },
  'Zidane Iqbal': {
    careerReview: '伊克巴尔，23岁中场，效力乌得勒支。曼联卡灵顿青训体系出身，技术流训练背景扎实。25次国家队出场打入2球，持球推进和穿透性传球能力突出。',
    wcSpotlight: '伊克巴尔是中场创造力来源——面对法国和挪威中场的绞杀式防守时，他的持球摆脱和直塞传球是伊拉克破解高位压迫的关键武器。荷甲主力经验是重要底气。'
  },
  'Amir Al-Ammari': {
    careerReview: '阿马里，28岁防守中场，效力克拉科维亚。51次国家队出场打入3球，抢断凶狠且准确性高，是中场防线前的防守屏障。',
    wcSpotlight: '阿马里是中场专职拦截者——面对法国和塞内加尔的身体对抗时，他的战术纪律和拦截覆盖比创造力更关键。'
  },
  'Kevin Yakob': {
    careerReview: '雅各布，25岁中场，效力奥胡斯。北欧联赛系统训练背景，无球跑动带有欧式足球印记，9次国家队出场。',
    wcSpotlight: '雅各布是中场轮换中的战术变招——北欧联赛对抗环境中磨练出的勤勉跑动和策应能力在面对挪威和塞内加尔时是重要补充。'
  },
  'Aimar Sher': {
    careerReview: '谢尔，23岁中场，效力萨尔普斯堡。北欧联赛的务实风格与伊拉克技术流在他身上融合，7次国家队出场。',
    wcSpotlight: '谢尔是板凳席上的技术储备，在比赛末段需要控球和维持节奏时是候选选项。'
  },
  'Zaid Ismail': {
    careerReview: '伊斯梅尔，24岁中场，效力塔拉巴。中场体系的替补选项，6次国家队出场。',
    wcSpotlight: '伊斯梅尔是边缘中场储备，在比赛末段可帮助维持中场人数均衡和防守覆盖。'
  },

  // FW
  'Ali Al-Hamadi': {
    careerReview: '哈马迪，24岁前锋，效力英冠卢顿镇。英冠高强度对抗中磨练了锋线技术和心理素质。20次国家队出场打入5球，爆发力和冲击力突出，善于利用防线身后空当制造威胁。',
    wcSpotlight: '哈马迪是锋线轮换中的速度选项——英冠的比赛经验让他在身体对抗和攻防转换节奏上具备亚洲球员中的明显优势。下半场利用体能和速度冲击对手疲惫防线是伊拉克的战术选择。'
  },
  'Mohanad Ali': {
    careerReview: '莫哈纳德·阿里，25岁中锋，效力迪巴。72次国家队出场打入27球，头球技术突出，背身拿球和做球能力扎实。',
    wcSpotlight: '阿里是伊拉克锋线主要得分点——面对法国和挪威中卫时，他的禁区支点作用和头球争顶是定位球和阵地进攻的关键环节。'
  },
  'Ahmed Qasem': {
    careerReview: '卡西姆，22岁边锋，效力纳什维尔。边路突破和一对一过人具观赏性，3次国家队出场。',
    wcSpotlight: '卡西姆是锋线年轻储备——22岁首次征战世界杯，国际比赛经验尚浅但边路冲击力可能带来变数。'
  },
  'Ali Yousif': {
    careerReview: '优素福，30岁前锋，效力塔拉巴。禁区内的位置感和拼抢积极，替补出场时能为前场注入活力。7次国家队出场打入1球。',
    wcSpotlight: '优素福是锋线老将替补，30岁首次征战世界杯，31岁的年龄和沉稳心理在关键时刻可能成为选择。'
  },
  'Ali Jasim': {
    careerReview: '贾西姆，22岁边锋，效力纳贾玛。边路一对一突破制造威胁的能力在同龄球员中突出。36次国家队出场打入2球。',
    wcSpotlight: '贾西姆是边路年轻火力——面对法国和挪威防线时，他能否在高强度压迫下保持技术动作稳定性将决定他在世界杯赛场上的实际表现。'
  },
  'Aymen Hussein': {
    careerReview: '侯赛因，30岁中锋，效力卡尔马。95次国家队出场打入33球，是伊拉克队史射手王。职业生涯先后效力警察队、扎拉瓦和突尼斯斯法克西恩等西亚及北非俱乐部，始终保持高效进球率。身体对抗、禁区抢点、头球和背身护球能力突出，是亚洲足坛最具统治力的传统中锋之一。2023年亚洲杯以经典进球成为焦点。',
    wcSpotlight: '侯赛因是伊拉克进攻的绝对核心——面对法国、挪威和塞内加尔时，对手防线对他实施双人协防是必然选择。定位球进攻中他的头球是伊拉克最大得分武器。95场33球的国家队纪录让他在最大舞台上值得信赖。'
  },
  'Marko Farji': {
    careerReview: '法尔吉，22岁边锋，效力威尼斯。意大利联赛防守文化让他在高强度贴身防守下学会了寻找空间。12次国家队出场。',
    wcSpotlight: '法尔吉是锋线年轻选项——22岁首次世界杯即面对法国和挪威防线，战术执行力和团队意识在最大舞台上需要检验。'
  }
};

let applied = 0;
for (const [name, updates] of Object.entries(corrections)) {
  const entry = wiki[name];
  if (!entry) { console.log('NOT_FOUND:', name); continue; }
  if (updates.careerReview) entry.careerReview = oppFix(cleanProse(updates.careerReview));
  if (updates.wcSpotlight) entry.wcSpotlight = oppFix(cleanProse(updates.wcSpotlight));
  applied++;
}

// GC fluff
const iqPlayers = iq.players.map(p => p.name);
for (const name of iqPlayers) {
  const e = wiki[name];
  if (!e || corrections[name]) continue;
  let changed = false;
  const t = (e.careerReview||'') + (e.wcSpotlight||'');
  if (t.match(/定海|灵魂|信仰|神话|不朽|不死|不灭|永不|燃烧|太阳|上帝|X因素|活传奇|唯一的神|唯一的太阳|唯一的希望|定心丸|图腾|无可替代的珍贵体验|成长加速器|战略投资|丰碑|绞尽脑汁|晴雨表|生命线|压舱石|战术弹性|人员深度|未来希望|宝贵的|雷打不动|传奇人物/)) {
    e.careerReview = oppFix(cleanProse(e.careerReview || ''));
    e.wcSpotlight = oppFix(cleanProse(e.wcSpotlight || ''));
    changed = true;
  }
  if (changed) { console.log('GC:', name); applied++; }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`\n=== Iraq Summary ===`);
console.log(`Applied: ${applied} / ${iqPlayers.length}`);
