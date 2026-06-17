const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const sn = squad.find(t => t.name === 'Senegal');
const opps = squad.filter(t => t.group === sn.group && t.name !== 'Senegal').map(t => t.name);
const oppLabel = opps.join('、');

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/同组强敌/g, oppLabel)
    .replace(/法国队/g, '法国')
    .replace(/挪威队/g, '挪威')
    .replace(/伊拉克队/g, '伊拉克');
}

function cleanProse(text) {
  return text
    .replace(/。。。。。。+/g, '。')
    .replace(/再再/gi, '')
    // Fluff
    .replace(/全民国家英雄/gi, '')
    .replace(/神秘天才/gi, '')
    .replace(/令人瞠目结舌和惊叹不已/gi, '')
    .replace(/最具天赋和创造想象力的新生代技术核心/gi, '技术天赋突出的年轻中场')
    .replace(/最具天赋和最高上限的中场超新星/gi, '中场核心')
    .replace(/最伟大/gi, '')
    .replace(/定海神针/gi, '')
    .replace(/压舱石/gi, '')
    .replace(/定心丸/gi, '')
    .replace(/成长加速器/gi, '')
    .replace(/全部希望/gi, '希望')
    .replace(/极重要推动因素/g, '重要')
    .replace(/以显微镜级别的关注度审视和分析评估/g, '关注')
    .replace(/珍贵展示舞台和成长里程碑纪念/g, '展示机会')
    .replace(/核心功能节点意义/g, '节点')
    .replace(/战术阀门保障和攻防转换开关的/g, '')
    .replace(/终极决定因素和技术核心解法所在/g, '关键')
    .replace(/关键战术平衡器/g, '关键球员')
    .replace(/最直接最猛烈的进攻武器和守转攻提速的致命终结环节之一/g, '最直接的进攻武器')
    .replace(/塞内加尔足球历史上最伟大的前锋/g, '塞内加尔队史最佳射手')
    .replace(/塞内加尔足球历史上最伟大的中后卫/g, '塞内加尔防线核心')
    .replace(/宝贵的/gi, '')
    .replace(/未来防守领袖成长的根本铺垫工程/gi, '成长经历')
    .replace(/多维度多风格的对位适应能力和战术弹性保障和深层防守厚度支撑基础储备/gi, '多维度对位适应能力')
    ;
}

const corrections = {
  // GK
  'Yehvann Diouf': {
    careerReview: '迪乌夫，26岁门将，效力尼斯。法甲主力门将，2次国家队出场。反应速度不错，但大赛经验有限。',
    wcSpotlight: '迪乌夫是门将替补——门迪和迪亚身后第三选择，主要在训练中提供对抗。获出场机会时将面对法国和挪威的顶级射手考验。'
  },
  'Édouard Mendy': {
    careerReview: '门迪，34岁门将，效力吉达国民。57次国家队出场，2021年非洲杯夺冠主力门将，同年荣膺FIFA年度最佳男足门将。切尔西时期随队夺得欧冠冠军。',
    wcSpotlight: '门迪是塞内加尔门将核心——面对法国姆巴佩和挪威哈兰德的射门考验时，34岁的门线技术和反应速度是否仍在巅峰是决定塞内加尔防线稳固程度的关键因素。'
  },
  'Mory Diaw': {
    careerReview: '迪亚，32岁门将，效力勒阿弗尔。扎实的门将基本功和比赛经验，5次国家队出场。',
    wcSpotlight: '迪亚是门将轮换的保险选项，训练场上为锋线队友提供高质量拍门陪练。'
  },

  // DF
  'Mamadou Sarr': {
    careerReview: '萨尔，20岁年轻中卫，效力切尔西。身体素质在同龄中卫中属顶尖，空中对抗和正面抢断潜力突出。8次国家队出场。',
    wcSpotlight: '萨尔是防线的年轻力量——20岁即入选世界杯名单说明天赋突出。面对哈兰德和法国攻击群时若能出场，将迎来职业生涯最大考验。'
  },
  'Kalidou Koulibaly': {
    careerReview: '库利巴利，34岁中卫，效力利雅得新月。103次国家队出场打入2球，是防线上的领袖。一对一对位极少被正面突破，出球能力和阅读比赛是其突出标签。',
    wcSpotlight: '库利巴利是塞内加尔防线的绝对核心——面对法国攻击群和挪威哈兰德的冲击时，他的一对一防守和指挥能力是防线最基本的保障。103场国家队经验在这支塞内加尔队中无人能及。'
  },
  'Abdoulaye Seck': {
    careerReview: '塞克，34岁中卫，效力海法马卡比。正面对抗硬度可靠，22次国家队出场打入4球。面对极高速攻击手时略有不足。',
    wcSpotlight: '塞克是防线轮换的老将选项——当库利巴利和尼亚卡特需要轮换或遭遇停赛时，他的经验能提供防线稳定性。'
  },
  'Ismail Jakobs': {
    careerReview: '雅各布斯，26岁左后卫，效力加拉塔萨雷。2025年从摩纳哥转会土超，继续在欧战和联赛中保持高水平边路攻防输出。30次国家队出场。',
    wcSpotlight: '雅各布斯是左路攻防主力——他对欧洲攻击手的出球习惯有天然的阅读理解优势，面对法国、挪威和伊拉克截然不同的边路攻击风格时是重要的对位棋子。'
  },
  'Krépin Diatta': {
    careerReview: '迪亚塔，27岁边后卫/边翼，效力摩纳哥。61次国家队出场打入2球，速度快爆发力强，攻防两端具备大赛级别的战术可用性。',
    wcSpotlight: '迪亚塔是右路攻防主力——他的突破质量和禁区边缘传中效率是塞内加尔右路进攻的关键。面对伊拉克左路防守和挪威边后卫时是重要的战术武器。'
  },
  'Moussa Niakhaté': {
    careerReview: '尼亚卡特，30岁中卫，效力里昂。在英超和法甲顶级联赛的快速攻防转换节奏中积累了丰富的防守经验。31次国家队出场。',
    wcSpotlight: '尼亚卡特是库利巴利的常规搭档——法甲主力身份保证了竞技状态，面对哈兰德和法国攻击群时提供了多维度对位适应能力和防线深度保障。'
  },
  'Antoine Mendy': {
    careerReview: '安托万·门迪，22岁后卫，效力尼斯。身体素质和速度在同年龄段中不错，但比赛经验仍需积累。7次国家队出场。',
    wcSpotlight: '安托万·门迪是防线年轻储备——22岁征战世界杯，法甲体系运作逻辑对年轻中卫而言是珍贵的成长经历。'
  },
  'El Hadji Malick Diouf': {
    careerReview: '迪乌夫，21岁左后卫，效力西汉姆联。防守覆盖面广，身体对抗能力在同龄左后卫中明显突出。20次国家队出场打入1球。',
    wcSpotlight: '迪乌夫是左路年轻力量——西汉姆英超主力身份让他在密集小组赛中具备体能竞争优势，防守持久力是他在高强度赛程中的重要卖点。'
  },

  // MF
  'Idrissa Gueye': {
    careerReview: '盖耶，36岁防守中场，效力埃弗顿。131次国家队出场打入7球，现役出场纪录保持者。他的价值从来不在于进攻数据，而在于对手每一次推进都不得不绕过他的防区。',
    wcSpotlight: '盖耶是中场防守屏障——面对法国和挪威的强大中场时，他36岁的跑动覆盖和拦截还能维持多高是塞内加尔防守体系的基础性命题。不需要进球或助攻，只需要继续当好那个永远在追球跑的人。'
  },
  'Pathé Ciss': {
    careerReview: '西斯，32岁中场，效力巴列卡诺。西甲主力经验让他在高强度比赛节奏下能维持中场平衡。30次国家队出场。',
    wcSpotlight: '西斯是中场轮换的节奏调节器——在需要控球时段或特定比赛阶段帮助塞内加尔维持球权回收效率。'
  },
  'Lamine Camara': {
    careerReview: '卡马拉，22岁中场，效力摩纳哥。33次国家队出场打入7球，技术风格以狭小空间内灵巧摆脱、精准直塞和突然远射为核心特点，是塞内加尔中场最具创造力的年轻大脑。',
    wcSpotlight: '卡马拉是中场创造力来源——面对法国和挪威高强度压迫时，他的持球摆脱和分球选择将是塞内加尔在对手防守缝隙中创造得分机会的关键。他的远射是破密集防守的武器。'
  },
  'Pape Matar Sarr': {
    careerReview: '萨尔，23岁中场，效力托特纳姆热刺。2022-23赛季逐步融入热刺主力阵容，在英超和欧冠双线中以稳定控球、精准分球和强力反抢为核心能力。40次国家队出场打入4球。',
    wcSpotlight: '萨尔是中场攻防枢纽——热刺的英超主力经验让他在世界杯高压下不落下风。面对法国和挪威的中场群时，他的控制力和反抢是塞内加尔能否对抗并主导比赛节奏的关键。23岁即承担世界杯中场核心角色。'
  },
  'Habib Diarra': {
    careerReview: '迪亚拉，22岁中场，效力桑德兰。英冠高强度身体对抗和快节奏攻防中磨练技术和适应力。21次国家队出场打入4球。',
    wcSpotlight: '迪亚拉是年轻中场储备——22岁首次世界杯，沉浸体验本身就是重要推动。出场时间有限。'
  },
  'Bara Sapoko Ndiaye': {
    careerReview: '巴拉·恩迪亚耶，18岁中场，效力拜仁慕尼黑。定期与拜仁一线队世界级球员陪练互动，技术风格以中场盘带和精准短传为人所知。1次国家队出场。',
    wcSpotlight: '巴拉·恩迪亚耶是年龄最小的入选者——18岁拜仁青训背景，本届以感受氛围为主，是所有年轻天才最珍贵的展示机会。'
  },
  'Pape Gueye': {
    careerReview: '帕佩·盖耶，27岁防守中场，效力比利亚雷亚尔。西甲和欧战环境中深耕纯防守型中场角色。41次国家队出场打入5球。',
    wcSpotlight: '帕佩·盖耶是中场拦截轮换——在需要切断对手从中场到锋线的传输链条时是关键的战术节点。'
  },

  // FW
  'Assane Diao': {
    careerReview: '迪奥，20岁边锋，效力科莫。速度和左右脚均衡是其最大卖点，身体对抗仍需打磨。5次国家队出场。',
    wcSpotlight: '迪奥是锋线年轻奇兵——20岁的身体暂时扛不住成年国家队级别的对抗强度，但速度和双足优势在特定战术场景中可能派上用场。'
  },
  'Bamba Dieng': {
    careerReview: '迪昂，26岁前锋，效力洛里昂。非洲杯打入决赛并夺冠的经历积累了大赛层面的心理自信。23次国家队出场打入2球。',
    wcSpotlight: '迪昂是锋线轮换中的灵活选项——法乙联赛的高比赛频率为他维持了状态基础。'
  },
  'Sadio Mané': {
    careerReview: '马内，34岁攻击核心，效力利雅得胜利。128次国家队出场打入55球，稳居塞内加尔队史最佳射手。职业生涯巅峰献给了利物浦，随队夺得欧冠冠军和英超亚军，2018-19赛季打入22球与萨拉赫共享联赛金靴。2022年转会拜仁，2023年转投利雅得胜利。2025-26赛季沙特联赛出场30次贡献12球6助攻。',
    wcSpotlight: '马内是塞内加尔进攻的旗帜和灵魂——34岁第128次为国家队出场，极可能是最后一届世界杯。他速度仍保持相当水平，反击中仍是最主要的威胁来源。面对法国、挪威和伊拉克防线的不同特点时，他的经验和突破判断是塞内加尔最大财富。'
  },
  'Nicolas Jackson': {
    careerReview: '杰克逊，24岁前锋，效力拜仁慕尼黑。切尔西时期展现了速度、突破和跑位的全面攻击潜质，2025年夏天转会拜仁慕尼黑。33次国家队出场打入8球。',
    wcSpotlight: '杰克逊是锋线上的全能火力——拜仁一个赛季的顶级训练和比赛对抗赋予他面对任何级别防守者的技术自信。面对伊拉克防线时他的速度和突破是重要突破口。'
  },
  'Cherif Ndiaye': {
    careerReview: '谢里夫·恩迪亚耶，30岁前锋，效力萨姆松体育。速度快，擅长反击中的攻防快速切换。19次国家队出场打入4球。',
    wcSpotlight: '谢里夫·恩迪亚耶是锋线轮换中的速度选项——全力投入的比赛态度在体能消耗剧烈的密集小组赛中将是深度不足的弥补方案。'
  },
  'Iliman Ndiaye': {
    careerReview: '伊利曼·恩迪亚耶，26岁攻击手，效力埃弗顿。谢菲尔德联时期展示了创造力和灵活跑位，转会马赛一年后回归英超加盟埃弗顿，在新的战术体系中继续展现脚下技术。40次国家队出场打入4球。',
    wcSpotlight: '伊利曼·恩迪亚耶是前场创造力补充——他的灵活跑位可在对方密集防守中提供突破路径和进攻创意，但首发机会有限。'
  },
  'Ismaïla Sarr': {
    careerReview: '伊斯梅拉·萨尔，28岁边锋，效力水晶宫。83次国家队出场打入19球。沃特福德三个赛季打入可观的进球数，证明了在英格兰各级联赛的得分能力。',
    wcSpotlight: '伊斯梅拉·萨尔是反击中最直接的进攻武器——他的爆发速度和突破是塞内加尔守转攻提速的致命武器。面对法国和伊拉克的后防线时是最具威胁的反击利器。'
  },
  'Ibrahim Mbaye': {
    careerReview: '姆巴耶，18岁边锋，效力巴黎圣日耳曼。与PSG一线队世界级球员并肩学习和训练，速度和突破勇气已初具顶级边锋的早期雏形。11次国家队出场打入3球。',
    wcSpotlight: '姆巴耶是年龄最小的攻击手之一——18岁已在PSG精英级别训练体系中浸染，比赛视野远超同龄人。本届出场时间可能极为有限，但体验本身就是最大收获。'
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
const snPlayers = sn.players.map(p => p.name);
for (const name of snPlayers) {
  const e = wiki[name];
  if (!e || corrections[name]) continue;
  let changed = false;
  const t = (e.careerReview||'') + (e.wcSpotlight||'');
  if (t.match(/定海|活传奇|唯一的神|唯一的太阳|唯一的希望|图腾|灵魂|信仰|神话|不朽|不死|不灭|永不|燃烧|太阳|上帝|X因素|定心丸|无可替代的珍贵体验|成长加速器|战略投资|丰碑|绞尽脑汁|晴雨表|生命线|压舱石|全部希望|最具天赋|最伟大/)) {
    e.careerReview = oppFix(cleanProse(e.careerReview || ''));
    e.wcSpotlight = oppFix(cleanProse(e.wcSpotlight || ''));
    changed = true;
  }
  if (changed) { console.log('GC:', name); applied++; }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`\n=== Senegal Summary ===`);
console.log(`Applied: ${applied} / ${snPlayers.length}`);
