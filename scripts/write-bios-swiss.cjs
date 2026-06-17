var p = require(__dirname + '/../src/data/players-wiki.json');
var entries = {};

// === SWITZERLAND ===

entries['Gregor Kobel'] = {
    number:'1', fullName:'Gregor Kobel', position:'Goalkeeper', currentClub:'Borussia Dortmund', image:'',
    clubCareer:[{years:'2016–2020',club:'1899 Hoffenheim'},{years:'2020–2021',club:'VfB Stuttgart'},{years:'2021–',club:'Borussia Dortmund'}],
    nationalCaps:21, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'目前世界上状态最好的门将之一——科贝尔在霍芬海姆成长后在斯图加特的租借期彻底爆发，随即以创纪录的门将转会费加盟多特蒙德并迅速成为黄黑军团后防线上最稳定的保障。他的扑救技术结合了现代门将的全面性——脚下传球、远距离长传发动反击、以及在大赛中扑出点球的"大心脏"——是德甲近几个赛季以来最被一致认可的门将。虽然瑞典国门索默的长期霸占让他在国家队的出场次数仅为21次，但在索默离开后，科贝尔已经自然而然地成为瑞士一号门将的唯一候选。',
    wcSpotlight:'科贝尔的首次世界杯将以"世界顶级门将"的身份开始——而不是"有个不错的赛季的门将"。他在多特蒙德的每一场德甲和欧冠比赛中都在证明他是门将位置上最接近完美的答案：反应、出球、指挥防线、在压力下保持冷静。瑞士在小组赛中将面对的所有前锋都在五大联赛效力，科贝尔日常已经习惯了面对这些面孔——在德甲对阵过拜仁的戴维斯，在欧冠防过尤文的大卫。他将成为瑞士后防线上最不可替代的安全锚。如果瑞士本届有任何晋级的可能，科贝尔的扑救集锦中一定有它的核心理由。'
};

entries['Miro Muheim'] = {
    number:'2', fullName:'Miro Muheim', position:'Defender', currentClub:'Hamburger SV', image:'',
    clubCareer:[{years:'2017–2020',club:'FC Zürich'},{years:'2020–2021',club:'St. Gallen'},{years:'2021–2024',club:'Hamburger SV'},{years:'2024–2025',club:'→ FC Zürich'},{years:'2025–',club:'Hamburger SV'}],
    nationalCaps:10, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'苏黎世出生的左后卫——穆海姆在经历了苏黎世和圣加仑的瑞士超历练后转会德乙汉堡，得到在德国足球环境中接受更有对抗性的足球教育的机会。他在左路的体能分配非常均衡——进攻时能提供深度传中，防守时能及时回收到位，在两个禁区之间的往返能力在同位置的瑞士后卫中属于靠谱水平。10次国家队出场且0失误（在他出场的比赛中）的记录给了他教练组继续考察的信心。',
    wcSpotlight:'穆海姆在瑞士左后卫的备选序列中排在第一位——当罗德里格斯需要休息或球队需要更多的攻击性时，穆海姆的速度和体能优势将变得更加重要。在德乙汉堡的环境中他每周都在面对试图冲刺到底线的德国式边锋，这种持续的压力训练让他在身体上具备了"吃不消也不崩溃"的能力——对阵加拿大或波黑的边锋时，这个能力可能决定瑞士的左路是否被完全破坏。'
};

entries['Silvan Widmer'] = {
    number:'3', fullName:'Silvan Widmer', position:'Defender', currentClub:'Mainz 05', image:'',
    clubCareer:[{years:'2011–2018',club:'FC Aarau'},{years:'2018–2021',club:'FC Basel'},{years:'2021–',club:'Mainz 05'}],
    nationalCaps:60, nationalGoals:5, extractPreview:'', introPreview:'',
    careerReview:'瑞士右后卫中最具攻击性的选项——维德默在阿劳和巴塞尔的瑞士足球土壤中成长后在2021年转会德甲美因茨，在德国顶级联赛的节奏和对抗中进一步升级了自己的比赛。他的进攻端贡献在瑞士后卫中是非常突出的——5个国家队进球（对于一个边后卫来说）证明他在前插和禁区内最后时刻的嗅觉上有着前锋级别的敏锐。60次国家队出场记录加上在欧洲杯和世界杯上的稳定表现让他成为瑞士右路最自然的答案。',
    wcSpotlight:'维德默将迎来他的连续第三届大赛——在2022世界杯和2024欧洲杯上的经验让他对世界杯的舞台毫不陌生。在美因茨的每个周末他都在德甲中面对着欧洲最富有天赋的左边锋，这种"每周都被考试"的生活方式在大赛临近时反而是最大的优势——你不需要突然适应强度，因为你永远处在这种强度中。他将在小组赛中用右路的跑动量为瑞士的中场输送宽度，并确保对手的左路不会轻易变成自家后院的打卡圣地。'
};

entries['Nico Elvedi'] = {
    number:'4', fullName:'Nico Elvedi', position:'Defender', currentClub:'Borussia Mönchengladbach', image:'',
    clubCareer:[{years:'2013–2015',club:'FC Zürich'},{years:'2015–',club:'Borussia Mönchengladbach'}],
    nationalCaps:67, nationalGoals:3, extractPreview:'', introPreview:'',
    careerReview:'从苏黎世到门兴的"一签定终身"转会——埃尔维迪在2015年加盟门兴后再未转会，十年的忠诚在现代足球近乎绝迹。他的中卫风格充满北欧式的理性和德甲培养的技术性——在防线上的站位和出球决策是他最被认可的素质，虽然他在身体对抗上相比顶级中卫略显温和，但他的足球智商足以弥补任何对抗的差距。67次国家队出场3个进球的记录反映了他在瑞士中卫序列中的稳固地位。',
    wcSpotlight:'埃尔维迪和阿坎吉的中卫组合是瑞士足球的长期遗产——两人在国家队并肩作战了接近十年，在德甲的交锋经验中对对方的风格了如指掌。在世界杯舞台上中卫搭档的默契是无价的——尤其是在面对加拿大快速的双前锋转换时，两人之间的沟通效率将决定瑞士的防线是否会被从中路穿透。十年门兴的忠诚不应该被"老将"的平淡叙事淹没——他的位置感和在防线上的领导力是瑞士无法用其他中卫替代的。'
};

entries['Manuel Akanji'] = {
    number:'5', fullName:'Manuel Akanji', position:'Defender', currentClub:'Inter Milan', image:'',
    clubCareer:[{years:'2015–2018',club:'FC Basel'},{years:'2018–2022',club:'Borussia Dortmund'},{years:'2022–2025',club:'Manchester City'},{years:'2025–',club:'Inter Milan'}],
    nationalCaps:81, nationalGoals:4, extractPreview:'', introPreview:'',
    careerReview:'从巴塞尔到多特蒙德再到曼城再到国际米兰——阿坎吉的职业生涯是对"瑞士球员天花板"的一次次暴力突破。在多特蒙德的四年他作为后防核心接受了德甲最快速反击的日常考验，转会曼城后在瓜迪奥拉的"中卫改后腰"实验中表现出的适应能力让所有人都重新评估了他的足球智商。在曼城期间他赢得了英超冠军和欧冠冠军——瑞士球员在欧洲顶级俱乐部拿到大耳朵杯的场面在过去是不可想象的。2025年转会国际米兰后他在意甲的防守体系中继续着顶级中卫的进化。81次国家队出场4个进球数据之外，他实际上是瑞士后防线上的"另一个大脑"。',
    wcSpotlight:'阿坎吉将以欧冠冠军和意甲顶级中卫的双重身份进入2026世界杯——这可能是瑞士足球史上在世界杯开赛前"最豪华"的球员履历。他在曼城被训练出了"中场脚法"——这在瑞士的控球型打法中是决定性的品质，因为瑞士教练要求中卫不仅防守还要"在压力下把球送到前场"。对阵加拿大的前场压迫和波黑的快速反击时，阿坎吉的两个特质——在压迫下的控球和在反击中的速度回追——将同时被需要。他是瑞士防线上的"进口系统"，没有他，整个防线会像一台掉了关键螺丝的机器一样响而不转。'
};

entries['Denis Zakaria'] = {
    number:'6', fullName:'Denis Zakaria', position:'Midfielder', currentClub:'Monaco', image:'',
    clubCareer:[{years:'2015–2017',club:'Young Boys'},{years:'2017–2022',club:'Borussia Mönchengladbach'},{years:'2022–2023',club:'Juventus'},{years:'2023–2024',club:'→ Chelsea'},{years:'2024–',club:'Monaco'}],
    nationalCaps:65, nationalGoals:3, extractPreview:'', introPreview:'',
    careerReview:'瑞士中场的身材担当——扎卡里亚拥有一种不正常的运动能力：1米91的身高结合后腰位置上的跑动和覆盖面积，这种组合在欧洲中场中是极其稀有的。在伯尔尼年轻人开始职业生涯后在门兴成长为一台防守收割机——拦截、争顶、带球推进三项技能在同代人中都处于欧洲顶级水准。转会尤文图斯和短暂租借切尔西的两年经历虽然不算成功，但在意甲和英超两种截然不同的比赛文化中接受教育对于一个中场球员来说是隐性财富。加盟摩纳哥后他回到了类似门兴时期的核心角色，65次国家队出场3个进球的定位完美映射了他的战术角色。',
    wcSpotlight:'扎卡里亚在瑞士国家队的角色就是"让扎卡可以放心组织"——扎卡负责创造，扎卡里亚负责消灭。瑞士面对加拿大和波黑时中场的对抗不处于劣势，但扎卡里亚的存在让这种优势更加极端——当一名身高190+的中场以速度和侵略性向你扑来时，正常的组织节奏会彻底被破坏。他的摩纳哥赛季为他提供了一份稳定的出场时间和持续的比赛节奏——这两种东西是进入世界杯之前的最重要的"软性准备"。'
};

entries['Breel Embolo'] = {
    number:'7', fullName:'Breel Embolo', position:'Forward', currentClub:'Rennes', image:'',
    clubCareer:[{years:'2014–2016',club:'FC Basel'},{years:'2016–2019',club:'Schalke 04'},{years:'2019–2022',club:'Borussia Mönchengladbach'},{years:'2022–2025',club:'Monaco'},{years:'2025–',club:'Rennes'}],
    nationalCaps:86, nationalGoals:24, extractPreview:'', introPreview:'',
    careerReview:'巴塞尔青训的不朽传奇——在年仅18岁时就被沙尔克04以高价签下，恩博洛的身上从青训时代就被贴满了"下一个瑞士巨星"的标签。在沙尔克和门兴的德甲生涯中他屡次因伤病被中断节奏——这是他职业生涯最大的敌人——但在健康状态下他是一个无法用任何单一策略完全锁死的前锋：身体、速度、射门精度、在禁区内的进球直觉都是顶级的。转会摩纳哥后在法甲的两年是他最接近兑现全部潜力的时段，86次国家队出场24球的效率虽然距离瑞士传奇的数据还有距离，但他在大赛中的关键进球（包括2022世界杯小组赛对阵喀麦隆的制胜球）已经证明了他对国家队而言是不可替代的。现在在雷恩，他继续在法甲的顶级联赛中占据着攻击线上的核心位置。',
    wcSpotlight:'恩博洛在2022世界杯上的表现早就自我宣示了他在大赛中的价值——他是瑞士在进攻端最"暴力"的攻击点，也是瑞士在反击中最重要的武器。但问题依然是：他的身体能在这个赛事中撑多久？在法甲的两个赛季已经展示了一个"不被伤病打断的恩博洛"有多危险，而世界杯的密集赛程将是对他身体管理能力的终极测试。如果他在三场小组赛中都健康，瑞士有资格认真考虑淘汰赛。如果没有恩博洛，瑞士的进攻会从一个"完整的武器系统"退化成一个"只有部分功能可用的系统"。'
};

entries['Remo Freuler'] = {
    number:'8', fullName:'Remo Freuler', position:'Midfielder', currentClub:'Bologna', image:'',
    clubCareer:[{years:'2014–2016',club:'FC Luzern'},{years:'2016–2022',club:'Atalanta'},{years:'2022–2023',club:'Nottingham Forest'},{years:'2023–',club:'Bologna'}],
    nationalCaps:88, nationalGoals:11, extractPreview:'', introPreview:'',
    careerReview:'瑞士中场的勤勉代表——弗鲁勒的职业生涯在两个截然不同的意大利半程中被定义：在亚特兰大六年，他在加斯佩里尼的进攻狂潮中承担了中场最重要的扫荡和组织衔接任务；在博洛尼亚三年，他在莫塔的控球哲学中进一步升华了自己的传球精度。88次国家队出场11个进球的数据远超一名纯防守中场的基础预期——他在禁区附近的后插上嗅觉是一种被严重低估的隐藏武器。在诺丁汉森林的短暂英超经历并不出色，但这也许反而强化了他对"最适合自己的足球在哪里"的认知。',
    wcSpotlight:'弗鲁勒是那种让扎卡可以更自由地去在进攻中创造的中场伙伴——他的每一次无球跑动、每一次提前拦截、每一次在扎卡前插时自动回补的位置选择，构成了瑞士中场体系的"隐形结构工程"。在博洛尼亚的意甲环境中他被训练出了更好的传球选择能力——不再是简单的"抢到球后传给最近的人"，而是"抢到球后传给能让进攻最安全的队友"。面对加拿大速度快的中场转换时，他的拦截将是第一道防线。'
};

entries['Johan Manzambi'] = {
    number:'9', fullName:'Johan Manzambi', position:'Midfielder', currentClub:'SC Freiburg', image:'',
    clubCareer:[{years:'2022–2023',club:'FC Basel'},{years:'2023–2024',club:'FC Luzern'},{years:'2024–',club:'SC Freiburg'}],
    nationalCaps:12, nationalGoals:3, extractPreview:'', introPreview:'',
    careerReview:'瑞士最新出产的攻击型中场新星——曼赞比在巴塞尔和卢塞恩的青训体系中迅速蹿升后被德甲弗赖堡带到了德国，20岁的年龄入选世界杯26人大名单本身就是一个令人瞠目的成就。他的比赛风格建立在出色的技术和进攻直觉之上——在禁区前沿的射门精准度和在前场的创造力是他的核心长板。12次国家队出场3个进球的效率对于一名年仅20岁的中场来说是极其卓越的——很多球员在他这个年龄还没有国家队处子球。',
    wcSpotlight:'曼赞比将是本届世界杯瑞士在进攻端的"最大未知数"——在训练中他已经展示了让人眼前一亮的天赋，但世界杯的聚光灯完全不一样。当他坐在替补席上而比赛在焦灼中进行时，如果瑞士需要最后一脚关键传中或一记禁区外的远射来打破僵局，曼赞比就是那个会被教练从板凳上叫起的年轻人。瑞士教练组在热身赛中的用法将揭示他们对这位新星的实际信任程度——但他已经在弗赖堡证明了他不是只靠运气才入队的。'
};

entries['Granit Xhaka'] = {
    number:'10', fullName:'Granit Xhaka', position:'Midfielder', currentClub:'Sunderland', image:'',
    clubCareer:[{years:'2010–2012',club:'FC Basel'},{years:'2012–2016',club:'Borussia Mönchengladbach'},{years:'2016–2023',club:'Arsenal'},{years:'2023–2025',club:'Bayer Leverkusen'},{years:'2025–',club:'Sunderland'}],
    nationalCaps:146, nationalGoals:17, extractPreview:'', introPreview:'',
    careerReview:'瑞士足球史上最伟大的中场球员——从巴塞尔到门兴、从阿森纳到勒沃库森再到桑德兰，扎卡的职业生涯就是一部关于"第二层含义"的传记。在阿森纳的七年他是被人诟病的出球失误、是被人嘲笑的红牌收集者、是被人质疑无法成为冠军核心的"永远差一点"的球员——但任何人都不会质疑的是他的钢铁般的精神意志和他的领袖气质。转会勒沃库森后他亲手撕碎了所有质疑：2023-24赛季他带领药厂以不可思议的不败战绩夺得德甲冠军，在这个被他亲手洗白的赛季中，他展示了一个"被低估了一辈子"的球员在最巅峰时可以爆发出何种能量。146次国家队出场让他成为瑞士队长和队史出场最多的球员，17个进球数据无法计量他对国家队的全部贡献——他每一次在球场上拉高嗓门、每一次用眼神告诉队友"我们还没输"、每一次在中场做出决定性传球时，都是瑞士足球的精神血脉在上演。',
    wcSpotlight:'34岁的扎卡将以瑞士足球史上最具革命意义的队长的身份踏上他的最后一次世界杯——而这不会只是一个"致敬传奇"的篇章，因为扎卡的身体里不流淌温情，只竞争血液。他在勒沃库森的不败赛季是他的终极名片：当所有人都在质疑你时，你用一整个赛季的不败和在安联球场举起奖盘的画面来回答他们。他在2026世界杯上的角色将不再是单纯的球场指挥官——他是这支瑞士队中唯一经历过"被全世界否定后自己重塑自己"的人，此人在场上的每一分钟都在告诉队友：别人说的不可能是他们的局限，不是你的。对阵加拿大、波黑、卡塔尔——没有一场比赛会让扎卡认为"这很轻松"，因为他知道自己需要踢的每一场世界杯比赛都是最后一场。'
};

entries['Dan Ndoye'] = {
    number:'11', fullName:'Dan Ndoye', position:'Forward', currentClub:'Nottingham Forest', image:'',
    clubCareer:[{years:'2018–2020',club:'Lausanne-Sport'},{years:'2020–2023',club:'Nice'},{years:'2023–2025',club:'Bologna'},{years:'2025–',club:'Nottingham Forest'}],
    nationalCaps:31, nationalGoals:8, extractPreview:'', introPreview:'',
    careerReview:'瑞士边路最令人生畏的速度武器——恩多耶从洛桑体育起步，在法甲尼斯的三年积累了在顶级边锋竞争环境中生存的关键经验，转会博洛尼亚后他的职业生涯迎来了一次质的飞跃。在意甲他接受了更系统性的战术教育——知道什么时候该冲刺、什么时候该内切、什么时候该传中给空位的队友。2025年转会诺丁汉森林加入英超生态后，他正在学习在更快节奏的环境中保持技术的精确性。31次国家队出场8个进球的效率对于一个边锋来说已经是顶级水平——他在2024欧洲杯上的进球已经向全世界证明了他的大赛适应性。',
    wcSpotlight:'恩多耶在2026世界杯上将是瑞士在反击中最重要的速度出口——当球队处于防守反击模式时，他是第一个被传中去找的人。诺丁汉森林的英超赛季在节奏上给了他最接近世界杯的比赛体验——每周都在和英超顶级后卫以最高速度进行一对一的对抗，这种经历在世界杯上就是"我见过这种情况"的保障。他的速度不是一般的快，而是那种"在你意识到来不及回追之前我已经在禁区内了"的快——这种爆发力在进球能力相对均衡的瑞士锋线上是最稀缺的稀缺性优势。'
};

entries['Yvon Mvogo'] = {
    number:'12', fullName:'Yvon Mvogo', position:'Goalkeeper', currentClub:'Lorient', image:'',
    clubCareer:[{years:'2013–2017',club:'Young Boys'},{years:'2017–2022',club:'RB Leipzig'},{years:'2022–2023',club:'→ PSV Eindhoven'},{years:'2023–2025',club:'Lorient'},{years:'2025–',club:'→ Red Bull Salzburg'}],
    nationalCaps:13, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'伯尔尼年轻人青训出生的喀麦隆裔瑞士门将——姆沃戈的职业生涯在红牛体系中得到了独特的塑形：在莱比锡作为古拉西奇的长期替补他接受了红牛式的门将训练（强调出击、扫荡和高位防守覆盖），这在传统门将教育中是很少见的。租借PSV埃因霍温给了他荷甲冠军和一个完整的赛季作为主力门将的经历——但对于门将来说，出场节奏比什么都重要。在洛里昂的法甲赛季和红牛萨尔茨堡的回归中，他继续保持着门将的日常状态。13次国家队出场对于一名32岁的门将来说不算多，但瑞士球迷知道他只要站在球门前就是安全级别的保障。',
    wcSpotlight:'姆沃戈将是科贝尔的替补——而在瑞士这支球队中，替补门将的准备工作可能决定了整个赛事的走向，因为如果科贝尔在小组赛中受伤，姆沃戈就将是接下来所有瑞士人寄托希望的人。他在红牛体系中的训练（尤其是高位的覆盖能力和出色的脚法）完全匹配瑞士的控球型打法的需求，而他在洛里昂和PSV的赛季证明了他在面对真正的强队前锋时不会惊慌。他是一份高质量的保险单——没有人希望用到它，但拥有它会让人睡得安稳。'
};

Object.assign(p, entries);
require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Switzerland batch 1 (12 players) written. Total keys:', Object.keys(p).length);
