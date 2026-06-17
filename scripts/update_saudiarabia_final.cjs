const fs = require('fs');
const path = require('path');

const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');

const wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squad = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

const sa = squad.find(t => t.name === 'Saudi Arabia');
const opps = squad.filter(t => t.group === sa.group && t.name !== 'Saudi Arabia').map(t => t.name);
const oppLabel = opps.join('、');

function oppFix(text) {
  return text
    .replace(/同组对手/g, oppLabel)
    .replace(/小组赛对手/g, oppLabel)
    .replace(/同组强敌/g, oppLabel)
    .replace(/西班牙队/g, '西班牙')
    .replace(/乌拉圭队/g, '乌拉圭')
    .replace(/佛得角队/g, '佛得角');
}

function cleanProse(text) {
  return text
    // Remove triple/multiple periods
    .replace(/。。{2,}/g, '。')
    .replace(/。。。。{2,}/g, '。')
    // Remove fluff
    .replace(/防守端的定海神针/g, '防线核心中卫')
    .replace(/定海神针/g, '防线核心')
    .replace(/活传奇/g, '队史出场纪录保持者之一')
    .replace(/最后一支舞/g, '最后一届世界杯')
    .replace(/奇迹之门/g, '破门的可能性')
    .replace(/献给国家队的最后一支舞/g, '他的最后一届世界杯')
    // Remove repeated "2022 miracle" over-embellishment
    .replace(/世界杯历史上最大的冷门/g, '重大冷门')
    ;
}

const corrections = {
  // GK
  'Nawaf Al-Aqidi': {
    careerReview: '阿齐迪，26岁门将，效力利雅得胜利。身材接近一米九，扑救反应在沙特门将中属上乘，擅长点球扑救和一对一封堵。24次国家队出场，已从替补过渡到主力位置。2022年曾随队参加卡塔尔世界杯积累了大赛经验。',
    wcSpotlight: '阿齐迪大概率是本届沙特首发门将，面对西班牙、乌拉圭和佛得角的射门考验——尤其对阵乌拉圭努涅斯、西班牙莫拉塔的攻击群时，扑救成功率将直接影响比赛结果。亚冠中积累的扑点球能力在关键场合可能成为胜负手。'
  },
  'Mohammed Al-Owais': {
    careerReview: '奥韦斯，34岁老门将，效力阿尔乌拉。65次国家队出场稳居沙特门将历史前列。2022年世界杯对阿根廷一役做出五次扑救，获评当场最佳球员，帮助沙特完成2-1逆转。此后他的名字在国际足坛被频繁提及。',
    wcSpotlight: '奥韦斯本届角色从四年前的主力转为阿基迪的替补兼导师。但他2022年对阿根廷的表现让任何教练都不会在关键时刻完全放弃使用他——如果阿基迪状态波动，奥韦斯随时可能戴上手套再次成为最后一道防线。他已无需证明自己。'
  },
  'Ahmed Al-Kassar': {
    careerReview: '卡萨尔，35岁门将，效力卡迪西亚。国家队第三门将，极少获得首发机会，但在训练中始终保持高水准，是门将位置最可靠的备选。9次国家队出场。',
    wcSpotlight: '卡萨尔是门将位置的保险选项——35岁入选世界杯名单本身即是对其职业态度的认可。大概率全程坐替补席，但这就是完美的职业生涯谢幕方式。'
  },

  // DF
  'Ali Majrashi': {
    careerReview: '马吉拉希，26岁右后卫，效力吉达国民。国家队主要出场集中在友谊赛和亚洲区预选赛的轮换，真正的大赛首发经验有限。21次国家队出场。',
    wcSpotlight: '马吉拉希是防线轮换选项，但大赛经验不足让教练在首发选择上会偏向经验更丰富的球员。'
  },
  'Ali Lajami': {
    careerReview: '拉贾米，30岁中卫，效力利雅得新月。经验和稳定性可观，在沙特正处于新老交替的后防线上作用重要。24次国家队出场打入1球。',
    wcSpotlight: '拉贾米是防线上的经验补充，虽国际大赛经验有限，但亚冠面对亚洲顶级前锋的积累给了他一定的心理准备。面对乌拉圭和西班牙的锋线，经验和冷静是最大价值。'
  },
  'Abdulelah Al-Amri': {
    careerReview: '阿姆里，29岁中卫，效力利雅得胜利。44次国家队出场打入1球，是后防线上的资深成员。防守稳健，不轻易冒进上抢，面对快速前锋时虽会感到被动但极少犯错，防守纪律严明。',
    wcSpotlight: '阿姆里是防线上的稳健型中卫——面对西班牙和乌拉圭的高强度进攻时，他的防守纪律是沙特的基本保障。与坦巴克蒂的搭档经历过亚冠多场硬仗的检验。'
  },
  'Hassan Al-Tambakti': {
    careerReview: '坦巴克蒂，27岁中卫，效力利雅得新月。54次国家队出场打入1球，是防线上最核心的支柱。身高一米八五、力量充沛、弹跳出色，比赛阅读能力日益成熟。2023年世俱杯曾对阵曼城等欧洲顶级球队。后场发动进攻时的长传精准度相当不错，是沙特由守转攻的重要第一环。',
    wcSpotlight: '坦巴克蒂是防线核心——面对西班牙和乌拉圭时，任务是尽量维持体面的比分。他在2023世俱杯对曼城的经历虽非愉快回忆，却是难得的预习。本届世界杯他是沙特全线收紧防守时的战术核心。'
  },
  'Saud Abdulhamid': {
    careerReview: '阿卜杜勒哈米德，26岁右后卫，效力法甲朗斯。沙特唯一五大联赛主力后卫，从利雅得新月青训成长并确立主力右后卫位置，2025年以约四百万欧元转会朗斯，成为沙特球员登陆五大联赛的先锋。55次国家队出场打入1球。',
    wcSpotlight: '阿卜杜勒哈米德是沙特阵中最具世界杯比赛节奏的防守球员——法甲的日常训练和比赛强度与世界杯距离不远。右路将对位乌拉圭和西班牙的最强左边锋，速度和技术双重对决将决定沙特右路是否会被打穿。'
  },
  'Nawaf Boushal': {
    careerReview: '布沙勒，26岁后卫，效力利雅得胜利。边路轮换深度选项，通常作为阿卜杜勒哈米德的替补出场。27次国家队出场。',
    wcSpotlight: '布沙勒是边路替补选项——在阿卜杜勒哈米德需要轮换或战术调整时顶上。面对强队的防守弱项可能被放大，教练会在特定场景下选择其他方案。'
  },
  'Hassan Kadesh': {
    careerReview: '卡迪什，33岁后卫，效力吉达联合。经验丰富的老将防线选项。21次国家队出场打入2球。',
    wcSpotlight: '卡迪什是防线上的经验储备——33岁首次参加世界杯，出场机会有限但经验丰富，在需要关键时刻时被教练组信赖。'
  },
  'Moteb Al-Harbi': {
    careerReview: '哈尔比，26岁边后卫，效力利雅得新月。速度和传中是他在边路进攻中的主要贡献，防守方面虽仍有不足但已展现出成长潜力。13次国家队出场。',
    wcSpotlight: '哈尔比是边路轮换选项——在需要边路速度和传中时是实用替补。需要在训练中保持与主力相当的强度以随时准备上场。'
  },
  'Jehad Thakri': {
    careerReview: '萨克里，24岁后卫，效力卡迪西亚。年轻后场新秀，身体条件方面身高和力量不错，但速度和灵活性在更高水平比赛中需要检验。8次国家队出场。',
    wcSpotlight: '萨克里是年轻防线储备——真正属于他的世界杯也许在2030年，本届只是预演和积累大赛经验。'
  },
  'Mohammed Abu Al-Shamat': {
    careerReview: '阿布沙马特，23岁后卫，效力卡迪西亚。沙特足协青训改革的新一代产物，技术基础更好、战术理解力更强。8次国家队出场。',
    wcSpotlight: '阿布沙马特的世界杯在2030年而非2026年，本届以积累经验感受氛围为主。'
  },

  // MF
  'Nasser Al-Dawsari': {
    careerReview: '纳赛尔·达瓦萨里，27岁中场，效力利雅得新月。攻防均衡的中场力量，传球和跑动覆盖在沙特中场中属上流。弱点是面对速度型边锋时偶有跟不上节奏的场景。47次国家队出场打入1球。',
    wcSpotlight: '纳赛尔·达瓦萨里是中场轮换的重要选项——面对西班牙和乌拉圭的攻击群时不太可能频繁压上，但在定位球时埋伏在后点可能有意想不到的收获。'
  },
  'Musab Al-Juwayr': {
    careerReview: '朱韦尔，22岁年轻中场，效力卡迪西亚。技术全面，远射能力突出，37次国家队出场打入6球，对于一个22岁的球员来说相当惊人，充分体现了教练组对他天赋的高度认可。',
    wcSpotlight: '朱韦尔是年轻中场轮换——提供创造力和远射威胁，在沙特需要控球或打破僵局时是最有价值的替补选项。面对佛得角的比赛中可能获得更多展示机会。'
  },
  'Abdullah Al-Khaibari': {
    careerReview: '海巴里，29岁中场，效力利雅得胜利。防守型中场，防守任务是第一优先级，传球和组织是其次。42次国家队出场，是沙特中场防守屏障。',
    wcSpotlight: '海巴里是沙特中场拦截的专职人选——教练交给他的任务就是干净利落地完成拦截再加一次安全出球。面对西班牙和乌拉圭的中场，这就是他全部战术使命。'
  },
  'Ziyad Al-Johani': {
    careerReview: '朱哈尼，24岁中场，效力吉达国民。仍处于积累经验的阶段，尚未进入沙特中场首发序列。身体对抗在面对欧洲高大中场时可能成为短板。12次国家队出场。',
    wcSpotlight: '朱哈尼是年轻中场储备，身体素质短板是教练组在考虑让他上场时最担心的因素。对阵佛得角时可能获得上场机会。'
  },
  'Alaa Al-Hejji': {
    careerReview: '赫吉，30岁中场，效力尼奥姆。基本在中东国内联赛活动，几乎没有亚洲顶级赛事的出场纪录。具备基本的中场控球和传球能力。3次国家队出场。',
    wcSpotlight: '赫吉是入选世界杯的边缘人选——真实角色是在替补席上感受氛围，那也是他职业生涯最值得讲述的一天。'
  },
  'Mohamed Kanno': {
    careerReview: '卡努，31岁中场，效力利雅得新月。79次国家队出场打入8球，在沙特中场是不可或缺的攻防转换枢纽。禁区弧顶的迎球怒射是沙特打破僵局和逆转比赛的标志性武器。',
    wcSpotlight: '卡努是沙特中场攻防的纽带——世界杯上面对西班牙和乌拉圭的顶级中场，任何三十码开外的射门空间都不容浪费。他的远射是沙特少数能改变比分的个人武器之一。'
  },

  // FW
  'Ayman Yahya': {
    careerReview: '叶海亚，25岁边锋，效力利雅得胜利。速度是其最大武器，在边路提供纵向冲击力。26次国家队出场，但射门决断性和防守回追意识是目前最大的短板——曾有过多次浪费绝佳机会的记录。',
    wcSpotlight: '叶海亚是反击中的速度选项——面对西班牙和乌拉圭时，沙特全场能获得的反击机会屈指可数，他必须在有限的机会中把握每一次。速度在反击中是对对手防线最直接的威胁。'
  },
  'Firas Al-Buraikan': {
    careerReview: '布赖坎，26岁前锋，效力吉达国民。72次国家队出场打入16球，进球效率在沙特本土前锋中名列前茅。2025-26赛季联赛出场29次贡献9球。',
    wcSpotlight: '布赖坎是沙特锋线主力——面对西班牙和乌拉圭时，他的任务是在寥寥无几的进攻机会中完成致命一击。更早的预判和更果断的射门是他唯一的武器。'
  },
  'Salem Al-Dawsari': {
    careerReview: '萨勒姆·达瓦萨里，34岁攻击型中场，效力利雅得新月。111次国家队出场打入27球，是球队出场和进球双料纪录持有者。职业生涯全奉献给利雅得新月，超过300场俱乐部出场，七次联赛冠军、四次国王杯、2021年亚冠冠军。2018年曾短暂租借比利亚雷亚尔，体验了欧洲顶级联赛比赛强度。2022年世界杯对阿根廷一役制造点球并打入逆转世界波，成为沙特足球的永恒经典。',
    wcSpotlight: '达瓦萨里是沙特2026世界杯的精神旗帜和战术核心——全队唯一在世界杯上有过决定性表现的球员。他无法再跑满全场，但某个瞬间的左脚远射和突破灵光仍可能改变比赛走势。对西班牙和乌拉圭的教练一定有针对他的专门布置。以111次出场结束他的最后一届世界杯。'
  },
  'Saleh Al-Shehri': {
    careerReview: '谢赫里，32岁前锋，效力吉达联合。59次国家队出场打入17球，是锋线上的稳定力量。2022年世界杯曾获出场机会并帮助沙特在进攻端保持威胁。',
    wcSpotlight: '谢赫里是锋线轮换经验包——2022年就经历过世界杯的节奏，至少不会因为紧张而表现失常。在面对佛得角的比赛中可能是首发热门，是沙特小组赛拿分的关键人物之一。'
  },
  'Khalid Al-Ghannam': {
    careerReview: '加纳姆，25岁边锋，效力达曼协作。年轻边锋力量，速度有一定冲击力，但表现不够稳定——在7次国家队出场中尚未取得进球。',
    wcSpotlight: '加纳姆是边缘前锋储备——25岁首次征战世界杯，现实的目标是积累大赛经验。真正的舞台可能在2030年世界杯。'
  },
  'Abdullah Al-Hamdan': {
    careerReview: '哈姆丹，26岁攻击手，效力利雅得胜利。技术全面，可在多个进攻位置切换，战术灵活性高。52次国家队出场打入13球，数据显示了他在国家队体系中的定位和价值。',
    wcSpotlight: '哈姆丹是进攻端的灵活拼图——多位置属性让教练可以不换人就调整战术。面对佛得角时可能是打破密集防守的重要变招。'
  },
  'Sultan Mandash': {
    careerReview: '曼达什，31岁前锋，效力利雅得新月。国家队边缘人选，偶尔因伤病或轮换需要被征召。7次国家队出场打入2球。',
    wcSpotlight: '曼达什是锋线末尾选项——31岁首次入选世界杯名单已是最大的成就。无论出场几分钟都是难以替代的回忆。'
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

// GC for any fluff not explicitly rewritten
const saPlayers = sa.players.map(p => p.name);
for (const name of saPlayers) {
  const e = wiki[name];
  if (!e || corrections[name]) continue;
  let changed = false;
  const t = (e.careerReview||'') + (e.wcSpotlight||'');
  if (t.match(/定海|活传奇|奇迹之门|最后一支舞|奇迹|传奇人物/)) {
    e.careerReview = oppFix(cleanProse(e.careerReview || ''));
    e.wcSpotlight = oppFix(cleanProse(e.wcSpotlight || ''));
    changed = true;
  }
  if (changed) { console.log('GC:', name); applied++; }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2), 'utf8');
console.log(`\n=== Saudi Arabia Summary ===`);
console.log(`Applied: ${applied} / ${saPlayers.length}`);
