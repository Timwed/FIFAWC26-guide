const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const egy = squad.find(t => t.name === 'Egypt');
const opps = squad.filter(t => t.group === egy.group && t.name !== 'Egypt').map(t => t.name);
const oppLabel = opps.join('、');

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/同组强敌/g, oppLabel)
    .replace(/比利时队/g, '比利时')
    .replace(/伊朗队/g, '伊朗')
    .replace(/新西兰队/g, '新西兰')
    .replace(/葡萄牙队/g, '')  // 报告误称葡萄牙，清理
    .replace(/葡萄牙/g, '');   // 报告中错误添加的对手名
}

function cleanProse(text) {
  return text
    // Fix Salah goal count inconsistency: squad says 67
    .replace(/65粒国家队进球/g, '67粒国家队进球')
    // League/opponent corrections
    .replace(/比利时由库尔图瓦镇守的世界级防线/g, '比利时由库尔图瓦镇守的防线')
    .replace(/伊朗顽强的防守体系/g, '伊朗的防守体系')
    .replace(/伊朗的铁血顽强防守体系/g, '伊朗的防守体系')
    .replace(/伊朗/ug, '伊朗')
    // Delete all fluff — this is the worst team for it
    .replace(/埃及足球的太阳法老和整个非洲大陆世界杯梦想的承载者与领航灯塔和信仰图腾。/g, '')
    .replace(/法老军团无可争辩的灵魂领袖和进攻绝对核心和整个阿拉伯世界乃至非洲大陆最伟大的现役足球运动员之一/g, '是埃及队绝对核心，非洲足坛历史最佳之一')
    .replace(/他的左脚内切弧线球射门已经成为足球历史教科书级别的经典进攻方式和视觉符号。/g, '左脚内切射门是其标志性武器。')
    .replace(/让他正式步入世界顶级巨星殿堂级行列/g, '标志其步入顶级巨星行列')
    .replace(/上届世界杯他带伤出战的精神让全世界动容落泪和肃然起敬/g, '2022世界杯他带伤出战')
    .replace(/只为带领埃及冲击历史性突破和创造了世界杯小组赛首次出线的历史伟业/g, '志在率队实现历史性突破')
    .replace(/他的个人爆发力和决定性进球能力将直接决定埃及这届世界杯能走多远能闯到哪里能完成什么样的/g, '他的发挥是埃及进攻的晴雨表')
    .replace(/是萨拉赫身边最近两年影响力飙升最为迅猛的进攻搭档和战术支点力量/g, '是萨拉赫的锋线搭档')
    .replace(/实现了职业生涯的关键一跃/g, '完成生涯关键一跃')
    .replace(/速度与射术的完美结合是他的核心竞争力标签左右脚均衡使他几乎能在禁区任何位置完成射门终结/g, '速度与射术结合、左右脚均衡是其特点')
    .replace(/在法兰克福那个令人惊叹的爆发赛季里他不仅以高效的进球数据震惊了全德甲更以充满自信和锐气的场上表现证明了自己已经完全准备好接受顶级豪门严密战术体系的淬炼和考验和挑战和转型和升级和腾飞和质变/g, '')
    .replace(/马尔穆什与萨拉赫组成的埃及锋线双核攻击组合是本届世界杯最令对手防线恐惧和忌惮的非洲进攻力量之一和最大化威胁来源/g, '与萨拉赫的双核组合是埃及进攻核心')
    .replace(/曼城顶级训练体系和瓜迪奥拉战术思想的浸润正在将他的综合进攻能力提升至前所未有的全新高度和境界这对他和埃及而言都意味着世界杯上最令人期待的X因素和超级武器/g, '')
    .replace(/他在曼城的顶级训练体系和瓜迪奥拉战术理念的细致打磨下持续进化为更全面更高水平更强的进攻武器和终结者和战术执行者和得分利器和攻坚力量和决胜王牌和终极武器和冠军级实力和精英级/g, '')
    .replace(/是国家队防线上绝对最不可动摇的定海神针和场上最后一道防线/g, '是防线上的定海神针')
    .replace(/作为队长率领球队多次夺得非洲冠军联赛冠军和埃及超级联赛冠军立下赫赫战功和不朽功勋/g, '作为队长多次率队夺得非冠联赛和埃超冠军')
    .replace(/非洲门将中极少有人能像他一样在国家队和俱乐部两个层面同时持续保持顶级水平超过十年成为埃及足球金字塔体系中最稳定最高效也最值得信赖的绝对核心和象征性图腾人物/g, '十年如一日保持顶级水准，是埃及足球的象征')
    .replace(/他的门线反应速度和对高空球的统治力在同代非洲门将中名列前茅无可争议/g, '门线反应和高空球处理能力出色')
    .replace(/上届世界杯埃及队在小组赛阶段令人遗憾地未能出线但艾尔谢纳维在门前的沉稳发挥和多次关键时刻的神奇扑救仍然让人看到了埃及防线的最后底牌和不可突破的坚固底线/g, '2022世界杯他在门前的沉稳发挥给人留下深刻印象')
    .replace(/本届世界杯这位37岁的老门将自己也坦言这或许是最后一届世界大赛他将全力守护法老军团的城池直到最后一秒和最后一口气/g, '这是他的最后一届世界杯')
    .replace(/与萨拉赫一前一后形成埃及队最关键的中轴线两端支点撑起整个球队的攻防大梁和骨架体系/g, '')
    .replace(/是法老军团近年来最忠诚也最高效的进攻输出者和多届非洲杯的绝对核心攻击手/g, '是埃及近年来进攻端的主力输出')
    .replace(/积累了深厚的大赛经验底蕴/g, '积累了丰富经验')
    .replace(/令人敬重/g, '获认可')
    .replace(/他的职业生涯单从数据看似乎缺少豪门光环但他的战术执行力和场上无私精神和拼搏态度的组合在任何一支球队都是极其难得和不可替代的宝贵品质和敬业榜样和精神标杆和战斗力源泉/g, '战术执行力出色')
    .replace(/萨拉赫身边最可靠的进攻搭档和战友也是埃及锋线丰富战术变化的最重要砝码和棋子/g, '萨拉赫身边的稳固搭档')
    .replace(/这对埃及攻击体系难以或缺的进攻宽度提供者和战术必需品/g, '是埃及进攻宽度的保障')
    .replace(/他的一脚任意球和角球直接射门质量在非洲球员中极为罕见亮眼令人印象深刻/g, '任意球和角球质量在非洲球员中突出')
    .replace(/他在埃及联赛和非洲冠军联赛多赛季积累的高效传射数据和丰富大赛经验使他当之无愧地成为萨拉赫身边最稳定也最高效的进攻输出搭档和战术体系中坚力量和核心成员和进攻枢纽和关键环节和得分保障和火力来源/g, '是萨拉赫身边可靠的搭档')
    .replace(/埃及边路最锋利也最稳定的进攻火力来源和战术输出端口/g, '埃及边路重要火力点')
    .replace(/与萨拉赫和马尔穆什共同组成让任何对手防线都寝食难安的非洲最强攻击三角阵型/g, '与萨拉赫和马尔穆什组成锋线三叉戟')
    .replace(/他在边路的一对一突破创造力和稳定的传中高质量是法老军团在世界杯上撕破任何严密防线的最可靠武器和开路工具/g, '他的边路突破和传中是撕破防线的武器')
    .replace(/整个非洲大陆在本届赛事中最为致命的进攻力量组合和最具得分潜力的前场王牌和终极核武器/g, '非洲最具威胁的攻击组合')
    .replace(/是埃及足球新生代最具潜力和最高期待的天赋型选手代表和未来的核心培养对象和希望之星/g, '是埃及锋线的未来储备')
    .replace(/被巴萨选中进入拉玛西亚体系本身就极为罕见地证明了他在天赋层面的顶级上限和未来可期的发展空间和潜力天花板/g, '')
    .replace(/速度和盘带是他在同龄人中脱颖而出的核心竞争优势和天赋标签/g, '速度和盘带是其优势')
    .replace(/巴塞罗那对他日复一日的细致培养和精准打磨正在将他从身体素质天赋球员逐步升级为具备欧洲战术素养的技术/g, '')
    .replace(/埃及未来的希望之星和本届世界杯上最年轻的参赛选手之一也是全队最被期待的未来潜力股和长期战略投资核心项目/g, '埃及最年轻的参赛球员')
    .replace(/哪怕只是短暂替补登场感受大赛氛围也将是受益终身的无价经历/g, '以积累大赛经验为主')
    .replace(/天赋上限和巴萨体系打磨叠加将是未来埃及攻击线最具爆炸性的超级天赋和战略武器/g, '')
    .replace(/年仅18岁即踏上世界杯赛场本身就已经是这个年龄段最耀眼的一项成就和最令人期待的起点和最引以为/g, '18岁踏上世界杯赛场已是重要里程碑')
    .replace(/是埃及近年来最令欧洲瞩目的本土后防线出口产品和新一代防守核心代表人物/g, '是埃及防线核心')
    .replace(/身兼不可动摇主力和战术核心基石/g, '是防线主力')
    .replace(/是非洲大陆最被看好的新生代中后卫之一/g, '是非洲顶尖中卫之一')
    .replace(/他的冷静出球和防守侵略性的完美平衡是现代中卫最理想的模板和品质组合也是埃及防线上近十年来最珍贵也最稀缺的天赋才俊和防守核心基石人选和战略资产和未来支柱/g, '出球能力和防守侵略性平衡出色')
    .replace(/埃及防线最核心的支柱力量和未来多年不可动摇的防守基石/g, '埃及防线支柱')
    .replace(/法甲尼斯顶级联赛的每周高强度对抗经验让他在世界杯赛场上能够以最从容不迫的心态和最冷静的判断力面对任何类型的进攻冲击和威胁/g, '法甲主力经验让他在世界杯上能从容应对各类进攻')
    .replace(/他与萨拉赫的同场征战是埃及攻防两端的双核齐聚/g, '')
    .replace(/他在法甲顶级防线中的每周高强度磨练确保了他能在世界杯最残酷环境下以最优状态和最冷静心态面对任何类型的进攻威胁和单兵冲击和战术考验和高压鞭策/g, '')
    // Generic/cross-player fluff cleanup
    .replace(/领航灯塔/g, '')
    .replace(/信仰图腾/g, '')
    .replace(/太阳法老/g, '')
    .replace(/历史教科书/g, '')
    .replace(/不朽功勋/g, '')
    .replace(/象征性图腾/g, '')
    .replace(/精神标杆/g, '')
    .replace(/战斗力源泉/g, '')
    .replace(/情感引擎/g, '')
    .replace(/信仰支柱/g, '')
    .replace(/定海神针/g, '')
    .replace(/超级武器/g, '')
    .replace(/终极武器/g, '')
    .replace(/核武器/g, '')
    .replace(/终极核/g, '')
    .replace(/寝食难安/g, '')
    .replace(/无价经历/g, '')
    .replace(/受益终身/g, '')
    .replace(/肃然起敬/g, '')
    .replace(/动容落泪/g, '')
    .replace(/永不言弃/g, '')
    .replace(/永不放弃/g, '')
    .replace(/战斗精神/g, '')
    .replace(/精神驱动力/g, '')
    .replace(/团队凝聚力源头/g, '')
    .replace(/最后底牌/g, '')
    .replace(/不可突破的坚固底线/g, '');
}

const corrections = {
  // GK
  'Mohamed El Shenawy': {
    careerReview: '希纳维，37岁门将，阿尔阿赫利队长。国家队76次出场。2025-26赛季继续担任阿赫利主力，非冠联赛和埃超表现稳定。十年如一日保持顶级水准。门线反应和高空球处理能力出色。',
    wcSpotlight: '这是希纳维的最后一届世界杯。2022世界杯他在门前的沉稳发挥给人留下深刻印象。面对比利时卢卡库领衔的攻击群和伊朗锋线，他的扑救和防线指挥是埃及最后的保障。'
  },
  'El Mahdy Soliman': {
    careerReview: '苏莱曼，39岁老门将，效力扎马雷克俱乐部。职业生涯丰富但国家队0次出场。入选大名单主要是基于经验和更衣室影响力考虑。',
    wcSpotlight: '苏莱曼以39岁零国家队出场身份入选世界杯大名单，是球队门将位置的应急选项——丰富的职业经验是他在训练和更衣室中最大的价值。'
  },
  'Mostafa Shobeir': {
    careerReview: '舒贝尔，26岁门将，效力阿尔阿赫利。天赋可观，在阿赫利体系中逐步成长为可靠的门将。9次国家队出场。',
    wcSpotlight: '舒贝尔是希纳维的替补，26岁的阿赫利主力身份保证了足够的比赛节奏——需要顶替时已有9场国家队经验做基础。'
  },
  'Mohamed Alaa': {
    careerReview: '阿拉，27岁门将，效力古纳俱乐部。埃及国内联赛的门将储备力量。尚未有国家队出场记录。',
    wcSpotlight: '阿拉是门将位置的边缘储备，本届以参与训练、积累大赛氛围为主。'
  },

  // DF
  'Yasser Ibrahim': {
    careerReview: '易卜拉欣，33岁中卫，效力阿尔阿赫利。经验丰富的老将，非冠联赛和埃超多次夺冠。17次国家队出场打入1球。',
    wcSpotlight: '易卜拉欣是防线轮换中的经验型选项——阿赫利多年的非冠赛场经历让他在面对高强度对抗时能保持冷静。'
  },
  'Mohamed Hany': {
    careerReview: '哈尼，30岁后卫，效力阿尔阿赫利。可胜任右后卫和中后卫，多位置适应性强。42次国家队出场。',
    wcSpotlight: '哈尼的多位置属性在密集赛程中是轮换的重要资源——阿赫利长期主力身份保证了对抗强度和比赛节奏。'
  },
  'Hossam Abdelmaguid': {
    careerReview: '阿卜杜勒马吉德，25岁中卫，效力扎马雷克俱乐部。年轻且上升势头明显，空中对抗和身体条件不错。13次国家队出场。',
    wcSpotlight: '阿卜杜勒马吉德是防线的年轻储备力量——在需要加强空中防守和禁区保护时是实用选项。'
  },
  'Ramy Rabia': {
    careerReview: '拉比亚，33岁中卫，效力阿联酋阿尔艾因。经历丰富的老将，身体对抗和定位球威胁是其特点。44次国家队出场打入5球。',
    wcSpotlight: '拉比亚是防线上的经验老将——非冠和亚洲赛场的多重经验让他在面对比利时和伊朗不同类型前锋时有更广的防守视角。'
  },
  'Mohamed Abdelmonem': {
    careerReview: '阿卜杜勒穆奈姆，27岁中卫，效力法甲尼斯。从阿尔阿赫利青训成长，2024年转会尼斯后在法甲稳步立足。2025-26赛季法甲稳定出场。出球能力和防守侵略性平衡出色，是非洲顶尖中卫之一。36次国家队出场打入3球。',
    wcSpotlight: '阿卜杜勒穆奈姆是埃及防线支柱——法甲主力经验让他在世界杯上能从容应对比利时卢卡库和伊朗的高强度冲击。是埃及防线最值得信赖的现役球员。'
  },
  'Ahmed Fatouh': {
    careerReview: '法图赫，28岁左后卫，效力扎马雷克俱乐部。攻防均衡的左路球员，传中和回防能力稳定。39次国家队出场打入1球。',
    wcSpotlight: '法图赫是左路防守的主力选项——国内联赛和非冠赛场的丰富经验在应对比利时边路冲击时是基础保障。'
  },
  'Karim Hafez': {
    careerReview: '哈菲兹，30岁左后卫，效力金字塔俱乐部。经验丰富的边路轮换球员。9次国家队出场。',
    wcSpotlight: '哈菲兹是左路的经验型轮换——30岁的年纪和多赛季的国内联赛主力经验保证了他在需要轮换时的基本可靠性。'
  },
  'Tarek Alaa': {
    careerReview: '阿拉（Tarek Alaa），24岁后卫，效力ZED俱乐部。年轻有潜力，国内联赛的主力球员。3次国家队出场。',
    wcSpotlight: '阿拉是防线年轻储备力量——24岁首次征战世界杯，以积累大赛经验和加速成长为当前主要目标。'
  },

  // MF
  'Emam Ashour': {
    careerReview: '阿舒尔，28岁中场，效力阿尔阿赫利。中场侵略性和带球推进能力是其特点，非冠赛场多次证明自己的大场面能力。29次国家队出场。',
    wcSpotlight: '阿舒尔是中场的冲击型选项——面对比利时中场（德布劳内等）时，他的逼抢和带球突破是埃及中场争取主动的变招。'
  },
  'Mostafa Ziko': {
    careerReview: '齐科，29岁中场，效力金字塔俱乐部。国家队出场极为有限但效率高——2次出场打入2球。',
    wcSpotlight: '齐科是中场末端的惊喜选项，2场2球的效率是教练考虑启用他的最大理由。世界杯出场时每一分钟都可能创造价值。'
  },
  'Hamdy Fathy': {
    careerReview: '法特希，31岁防守中场，效力卡塔尔阿尔瓦克拉俱乐部。中场扫荡和拦截是其核心职能，非冠和多国联赛经验丰富。63次国家队出场打入3球。',
    wcSpotlight: '法特希是中场防守屏障——63场国家队经验让他在对阵比利时快速传导时不会慌乱，拦截和跑动覆盖是破坏对手进攻节奏的关键。'
  },
  'Mohanad Lasheen': {
    careerReview: '拉辛，30岁中场，效力金字塔俱乐部。中场稳定型球员，控球和衔接是主要特点。23次国家队出场。',
    wcSpotlight: '拉辛是中场轮换力量——在需要稳住节奏和控制球权时是可靠选项。'
  },
  'Nabil Emad': {
    careerReview: '埃马德，30岁中场，效力巴林纳吉玛俱乐部。中场防守力量，拼抢积极。12次国家队出场。',
    wcSpotlight: '埃马德是中场的防守型轮换——在需要加强中场硬度时是补充选项。'
  },
  'Marwan Attia': {
    careerReview: '阿提亚，27岁中场，效力阿尔阿赫利。中场组织能力不错，阿赫利非冠主力经验是其最大资本。34次国家队出场打入1球。',
    wcSpotlight: '阿提亚是中场轮换力量——阿赫利的非冠冠军经验让他在大场面下有足够的自信，是中前场衔接的重要环节。'
  },
  'Mahmoud Saber': {
    careerReview: '萨贝尔，24岁中场，效力ZED俱乐部。年轻的中场储备，技术有一定亮点。15次国家队出场打入1球。',
    wcSpotlight: '萨贝尔是中场年轻储备——24岁首次征战世界杯，以积累经验为主，替补出场时可为中场注入活力。'
  },

  // FW
  'Trézéguet': {
    careerReview: '特雷泽盖，31岁边锋，效力阿尔阿赫利。从阿赫利出道后经历阿斯顿维拉和土耳其联赛的海外征战岁月。内切射门和无球跑动是其核心竞争力，96次国家队出场打入23球。',
    wcSpotlight: '特雷泽盖是萨拉赫身边最长久的搭档——96场国家队经验是埃及锋线最稳定的底蕴。世界杯上他的无球穿插和防守投入是平衡攻击火力的关键变量。面对新西兰防线时，他的经验尤为珍贵。'
  },
  'Hamza Abdelkarim': {
    careerReview: '阿卜杜勒卡里姆，18岁前锋，效力巴塞罗那B队。巴萨拉玛西亚青训出身，速度和盘带在同龄人中突出。国家队仅2次出场。',
    wcSpotlight: '阿卜杜勒卡里姆是埃及最年轻的参赛球员——18岁踏上世界杯赛场已是重要里程碑。巴萨青训的技术基础是他的核心资产，本届以感受大赛氛围为主，替补出场时可提供速度冲击。'
  },
  'Mohamed Salah': {
    careerReview: '萨拉赫，33岁，利物浦传奇。116次国家队出场打入67球，稳居埃及队史射手榜第二。2025-26赛季英超18球，2025年11月达成欧冠50球里程碑——首位完成此成就的非洲球员。世界杯期间因合同到期已为自由球员。利物浦生涯累计英超金靴×3、欧冠冠军、英超冠军各一座。左脚内切射门是其标志性武器。',
    wcSpotlight: '萨拉赫是埃及足球史上最伟大的球员。2022世界杯带伤出战的场景至今令人动容，本届以健康状态和欧冠50球里程碑的自信出征。面对比利时（库尔图瓦）和新西兰防线时，他的个人能力和大赛经验是埃及冲击小组出线的最大倚仗。'
  },
  'Haissem Hassan': {
    careerReview: '哈桑，24岁前锋，效力西乙奥维耶多。欧洲联赛磨炼出的速度和突破能力是其武器。4次国家队出场。',
    wcSpotlight: '哈桑是锋线的速度型轮换——西乙的主力经历保证了基本竞技状态，下半场替补冲击疲惫防线是最有效的使用方式。'
  },
  'Ibrahim Adel': {
    careerReview: '阿德尔，25岁前锋，效力丹麦北西兰。丹麦联赛的锻炼让他对北欧型防守有独特理解，技术细腻。24次国家队出场打入3球。',
    wcSpotlight: '阿德尔是锋线轮换力量——北西兰的技术型足球环境培养了他的控球和突破能力，面对伊朗防线时可提供不同的进攻方式。'
  },
  'Omar Marmoush': {
    careerReview: '马尔穆什，27岁前锋，德甲法兰克福成名后2025年夏以约6500万欧元转会曼城。2025-26赛季在曼城表现未达外界预期，赛季末可能离队。速度与射术结合、左右脚均衡是其核心特点。50次国家队出场打入11球。',
    wcSpotlight: '马尔穆什与萨拉赫组成埃及锋线双核，是进攻端最重要的辅助力量。曼城的顶级训练虽未充分转化为数据，但战术素养的提升仍然是世界杯上的隐形资产。面对比利时和新西兰防线时，他的速度和射术是埃及第二得分点。'
  },
  'Zizo': {
    careerReview: '齐佐，30岁边锋，效力阿尔阿赫利。边路突破和传中质量在非洲球员中突出，任意球和角球质量是其额外武器。在阿赫利非冠赛场积累了丰富的大赛经验。63次国家队出场打入5球。',
    wcSpotlight: '齐佐与萨拉赫和马尔穆什组成埃及锋线三叉戟——63场国家队经验是其最大资本。本届世界杯上，他的边路突破和高质量传中是撕破比利时和新西兰防线的可靠武器。'
  }
};

// Apply
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

  if (updates.careerReview) entry.careerReview = oppFix(cleanProse(updates.careerReview));
  if (updates.wcSpotlight) entry.wcSpotlight = oppFix(cleanProse(updates.wcSpotlight));

  applied++;
  results.push({
    name, status: 'UPDATED',
    careerChanged: original.careerReview !== entry.careerReview,
    wcChanged: original.wcSpotlight !== entry.wcSpotlight,
  });
}

// GC for any uncorrected players
const egyPlayers = egy.players.map(p => p.name);
for (const name of egyPlayers) {
  const entry = wiki[name];
  if (!entry || corrections[name]) continue;
  let changed = false;
  if ((entry.careerReview||'') + (entry.wcSpotlight||'').match(/定海|图腾|太阳|灯塔|教科书|不朽|象征|标杆|源泉|引擎|支柱|超级武器|终极|不可突破|底牌|肃然|动容|受益终身/)) {
    entry.careerReview = oppFix(cleanProse(entry.careerReview || ''));
    entry.wcSpotlight = oppFix(cleanProse(entry.wcSpotlight || ''));
    changed = true;
  }
  if (changed) { console.log(`GC cleaned: ${name}`); applied++; }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');

console.log(`\n=== Egypt Summary ===`);
console.log(`Applied: ${applied} / ${egyPlayers.length}`);
results.forEach(r => {
  if (r.status === 'UPDATED') {
    const c = [];
    if (r.careerChanged) c.push('CR');
    if (r.wcChanged) c.push('WS');
    console.log(`  ${r.name}: ${c.join(',')}`);
  } else { console.log(`  ${r.name}: ${r.status}`); }
});
