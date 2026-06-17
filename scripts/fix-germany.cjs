// Fix all Germany player data
const fs = require('fs');
const path = require('path');
const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

function setBasic(name, birthDate, birthPlace, height, clubNum) {
  if (!wiki[name]) return;
  Object.assign(wiki[name], { birthDate, birthPlace, height, clubNumber: clubNum || "", image: "", extractPreview: "", introPreview: "" });
}

// ========== 1. MANUEL NEUER (#1) — Fix skiing year (2022 not 2023) ==========
setBasic("Manuel Neuer", "1986-03-27", "Gelsenkirchen, Germany", 1.93, "1");
wiki["Manuel Neuer"].currentClub = "Bayern Munich";
wiki["Manuel Neuer"].clubCareer = [
  { years: "2005–2011", club: "Schalke 04", apps: 203, goals: 0 },
  { years: "2011–", club: "Bayern Munich", apps: 520, goals: 0 }
];
wiki["Manuel Neuer"].nationalCaps = 130;
wiki["Manuel Neuer"].nationalGoals = 0;
wiki["Manuel Neuer"].careerReview = "沙尔克04青训→拜仁慕尼黑。足球史上最伟大的门将之一——\"清道夫门将\"定义者，将门将的活动范围从禁区扩展到了整个半场。2014世界杯冠军（7场仅失4球，金手套奖），2011-2026在拜仁14年间拿下11座德甲冠军、2座欧冠冠军。2022年12月滑雪骨折导致赛季报销——40岁高龄从骨折中复出并重返拜仁首发，展现了近乎变态的职业态度。2022世界杯德国小组出局——这是他职业生涯的最大耻辱，他需要用一届有尊严的世界杯来告别。";
wiki["Manuel Neuer"].wcSpotlight = "诺伊尔在2026年将年满40岁——这将是他的第5届世界杯（2010-2026），追平了马特乌斯和布冯的纪录。膝盖和腿伤的后遗症让他失去了早期巅峰时期的爆发力，但他的阅读比赛能力和大赛经验仍然让他在德国门将位置上不可替代。这不是在追求个人荣誉——是在为2022年小组出局的耻辱做一个体面的收尾。只要他健康，他就是德国队的长期队长和一号门将——但如果德国再次小组出局，他的世界杯告别将带着永远无法抹去的污点。";

// ========== 2. RÜDIGER (#2) ==========
setBasic("Antonio Rüdiger", "1993-03-03", "Berlin, Germany", 1.90, "2");
wiki["Antonio Rüdiger"].currentClub = "Real Madrid";
wiki["Antonio Rüdiger"].clubCareer = [
  { years: "2011–2015", club: "VfB Stuttgart", apps: 80, goals: 2 },
  { years: "2015–2016", club: "→ Roma (loan)", apps: 37, goals: 2 },
  { years: "2016–2017", club: "Roma", apps: 35, goals: 0 },
  { years: "2017–2022", club: "Chelsea", apps: 203, goals: 12 },
  { years: "2022–", club: "Real Madrid", apps: 150, goals: 7 }
];
wiki["Antonio Rüdiger"].nationalCaps = 75;
wiki["Antonio Rüdiger"].nationalGoals = 3;
wiki["Antonio Rüdiger"].careerReview = "斯图加特青训→罗马→切尔西→皇家马德里。2021年欧冠冠军（切尔西）和2023-24赛季西甲+欧冠双冠王（皇马），两条完全不同体系的防线核心。身高1.90米、速度极快的左中卫——一对一防守时几乎是不可逾越的墙。侵略性极强的防守风格，不怕身体对抗，敢于前压。2022世界杯德国小组出局后，他是少数能被免于批评的球员之一。2024欧洲杯德国进入四强——他在本土踢出了职业生涯最好的国家队表现。";
wiki["Antonio Rüdiger"].wcSpotlight = "吕迪格是德国后防的绝对核心。他在皇马2025-26赛季继续维持世界级水准——作为后卫，他已经不必再证明什么。唯一的问题：32岁的高强度打法是否会在密集的世界杯赛程中支撑住。他的前压倾向暴露了身后空档——这在对阵速度型前锋的国家队时常被利用。德国的防守上限取决于他，同时也取决于与他搭档的中卫能否弥补他的激进性。如果德国打到后期淘汰赛，他的经验将是最重要的防守资产。";

// ========== 3. WALDEMAR ANTON (#3) ==========
setBasic("Waldemar Anton", "1996-07-20", "Almalyk, Uzbekistan", 1.89, "3");
wiki["Waldemar Anton"].currentClub = "Borussia Dortmund";
wiki["Waldemar Anton"].clubCareer = [
  { years: "2015–2020", club: "Hannover 96", apps: 137, goals: 5 },
  { years: "2020–2024", club: "VfB Stuttgart", apps: 126, goals: 4 },
  { years: "2024–", club: "Borussia Dortmund", apps: 58, goals: 2 }
];
wiki["Waldemar Anton"].nationalCaps = 8;
wiki["Waldemar Anton"].nationalGoals = 0;
wiki["Waldemar Anton"].careerReview = "汉诺威96青训→斯图加特→多特蒙德。在斯图加特的四年从德乙到德甲亚军，他是防线领袖——2023-24赛季作为队长带领球队拿到德甲亚军。2024年以2200万欧元转会多特蒙德，快速成为主力中卫。可踢中卫和右后卫，出球能力不俗，但速度在高位防线中偶有短板。2023年首次被德国国家队征召——乌兹别克斯坦出生，选择为德国效力。";
wiki["Waldemar Anton"].wcSpotlight = "安东在德国中卫顺位中排在吕迪格和施洛特贝克之后，但他的多位置属性（中卫+右后卫）让他在26人大名单中显得更有价值。多特蒙德2025-26赛季在欧冠的深度推进让他积累了重要的大赛经验。他是典型的功能型后卫——不是明星，但能在体系内高水平完成任务。";

// ========== 4. JONATHAN TAH (#4) — Fix club: Leverkusen, not Bayern ==========
setBasic("Jonathan Tah", "1996-02-11", "Hamburg, Germany", 1.95, "4");
wiki["Jonathan Tah"].currentClub = "Bayer Leverkusen";
wiki["Jonathan Tah"].clubCareer = [
  { years: "2013–2015", club: "Hamburger SV", apps: 38, goals: 0 },
  { years: "2014–2015", club: "→ Fortuna Düsseldorf (loan)", apps: 28, goals: 0 },
  { years: "2015–", club: "Bayer Leverkusen", apps: 360, goals: 16 }
];
wiki["Jonathan Tah"].nationalCaps = 32;
wiki["Jonathan Tah"].nationalGoals = 0;
wiki["Jonathan Tah"].careerReview = "汉堡青训→杜塞尔多夫→勒沃库森。在勒沃库森11年成长为德甲顶级中卫——2023-24赛季在阿隆索带领下拿下队史首个德甲冠军，赛季不败夺冠，塔是全赛季仅失24球的防线核心。身高1.95米，制空能力顶级，定位球进攻威胁大——2023-24赛季各项赛事5球。2022世界杯德国队小组出局但他表现稳定——他是德国后防线上身体条件最好但始终未被完全发挥的资产。";
wiki["Jonathan Tah"].wcSpotlight = "塔以不败冠军的身份进入2026世界杯——勒沃库森的奇迹赛季让全世界看到了一条防守纪律达到极致的防线。他在三中卫体系（德国队常用阵型）中担任居中中卫的潜力很高——1.95米的身高和勒沃库森体系培养的阅读比赛能力，让他在吕迪格的搭档中提供了完全不同的防守风格。最大风险是他的转身速度在对抗速度型前锋时会被放大——但高空轰炸方面他是德国最好的选项。";

// ========== 5. PAVLOVIĆ (#5) — Fix age: debut at 19 not 18 ==========
setBasic("Aleksandar Pavlović", "2004-05-03", "Munich, Germany", 1.88, "45");
wiki["Aleksandar Pavlović"].currentClub = "Bayern Munich";
wiki["Aleksandar Pavlović"].clubCareer = [
  { years: "2023–", club: "Bayern Munich", apps: 55, goals: 3 }
];
wiki["Aleksandar Pavlović"].nationalCaps = 5;
wiki["Aleksandar Pavlović"].nationalGoals = 0;
wiki["Aleksandar Pavlović"].careerReview = "拜仁青训出品——2023年19岁一线队首秀，2024-25赛季进入常规轮换。1.88米的后腰，拦截能力高于组织能力——在拜仁中场体系中他承担的是\"基米希的保镖\"角色。年轻、身体素质好、跑动覆盖面积大，但传球的创意性和比赛的阅读还需要更多顶级比赛锻炼。2024年首次入选德国国家队。塞尔维亚裔，选择代表德国。";
wiki["Aleksandar Pavlović"].wcSpotlight = "帕夫洛维奇是德国中场替补中上限最高的人选——22岁已经在拜仁站稳脚跟，这本身就是极高的起点。德国小组赛前两场如果结果提前确定，帕夫洛维奇大概率会在第三场获得首发机会——这是他向纳格尔斯曼证明自己是2028欧洲杯核心候选的最佳机会。";

// ========== 6. KIMMICH (#6) ==========
setBasic("Joshua Kimmich", "1995-02-08", "Rottweil, Germany", 1.77, "6");
wiki["Joshua Kimmich"].currentClub = "Bayern Munich";
wiki["Joshua Kimmich"].clubCareer = [
  { years: "2012–2013", club: "RB Leipzig", apps: 29, goals: 1 },
  { years: "2013–2015", club: "→ VfB Stuttgart (loan)", apps: 37, goals: 0 },
  { years: "2015–", club: "Bayern Munich", apps: 420, goals: 42 }
];
wiki["Joshua Kimmich"].nationalCaps = 95;
wiki["Joshua Kimmich"].nationalGoals = 6;
wiki["Joshua Kimmich"].careerReview = "莱比锡青训→斯图加特→拜仁。瓜迪奥拉亲手提拔的中场全能战士——后腰、右后卫、中前卫皆可胜任。2020年欧冠冠军的核心中场，拜仁11年8座德甲。德国队2022世界杯小组出局后成为队长——他身上肩负着带领德国从16年来的最低点走出来的巨大期望。传中精准度世界级、长传转移视野开阔、比赛阅读能力和赢家心态都已达到顶级。短板是1.77米的身高在头球对抗中吃亏——但这从未阻止他成为世界最佳后腰之一。";
wiki["Joshua Kimmich"].wcSpotlight = "基米希作为队长参加的第一届世界杯——2022年小组出局时他还不是正式队长，但媒体已经把责任堆在了他身上。2026年他身上背负的压力比任何德国球员都大：德国连续两届小组出局（2018、2022）后，民众的耐心彻底耗尽，基米希必须带队至少进入八强才能被认可。他的右脚任意球是德国队在定位球上的最大武器——在多特蒙德和拜仁连年失冠后，世界杯是他整个赛季的出口。";

// ========== 7. KAI HAVERTZ (#7) ==========
setBasic("Kai Havertz", "1999-06-11", "Aachen, Germany", 1.93, "29");
wiki["Kai Havertz"].currentClub = "Arsenal";
wiki["Kai Havertz"].clubCareer = [
  { years: "2016–2020", club: "Bayer Leverkusen", apps: 150, goals: 46 },
  { years: "2020–2023", club: "Chelsea", apps: 139, goals: 32 },
  { years: "2023–", club: "Arsenal", apps: 105, goals: 38 }
];
wiki["Kai Havertz"].nationalCaps = 55;
wiki["Kai Havertz"].nationalGoals = 17;
wiki["Kai Havertz"].careerReview = "勒沃库森青训（17岁德甲最年青进球纪录保持者）→切尔西→阿森纳。2021年欧冠决赛打进制胜球——他的职业生涯最高光时刻。在切尔西的三年未完全兑现天赋，但2023年转会阿森纳后找到了最适合他的伪9号体系——阿尔特塔让他在回撤接应和禁区抢点之间找到了完美的平衡。身高1.93米但脚下技术流畅——不是传统中锋而是一个\"十号位的身躯装在九号位的身体里\"。2022世界杯德国小组出局他打入2球——进攻端是少数被免于批评的球员。";
wiki["Kai Havertz"].wcSpotlight = "哈弗茨在2026世界杯上的角色将是全欧洲最受争议的话题之一——他到底应该踢9号还是10号？纳格尔斯曼的体系可能需要他在两个角色之间不断切换。他在阿森纳的2025-26赛季继续在英超输出稳定的进球数据——但围绕他的最大疑问始终如一：他能在关键比赛中接管球队吗？他的2021欧冠决赛进球是他唯一的\"关键比赛\"证据——德国球迷需要他拿出比这个更多的证明。";

// ========== 8. GORETZKA (#8) — Fix title count: 5 not 6 ==========
setBasic("Leon Goretzka", "1995-02-06", "Bochum, Germany", 1.89, "8");
wiki["Leon Goretzka"].currentClub = "Bayern Munich";
wiki["Leon Goretzka"].clubCareer = [
  { years: "2012–2013", club: "VfL Bochum", apps: 33, goals: 4 },
  { years: "2013–2018", club: "Schalke 04", apps: 147, goals: 19 },
  { years: "2018–", club: "Bayern Munich", apps: 240, goals: 44 }
];
wiki["Leon Goretzka"].nationalCaps = 58;
wiki["Leon Goretzka"].nationalGoals = 14;
wiki["Leon Goretzka"].careerReview = "波鸿青训→沙尔克04→拜仁。1.89米的全能中场——身体素质爆炸、后插上得分能力顶级、2020年欧冠冠军核心成员。在拜仁8年拿到5座德甲冠军。2022世界杯德国出局后，他在纳格尔斯曼手下失去了铁打首发位置——2024-25赛季虽然留在了拜仁，但轮换属性明显。不过他在重要比赛中的表现（后插上的头球和禁区外的远射）始终优于他在一般比赛中的表现——\"大场面球员\"的标签没有丢掉。";
wiki["Leon Goretzka"].wcSpotlight = "戈雷茨卡在2026世界杯上大概率是替补——帕夫洛维奇和基米希的中场组合是他的主要竞争对手。但他有一个无人能替代的价值：他的后插上得分能力——在需要进球的局面下，他冲入禁区的能力比任何德国中场都强。他可能是德国队在80分钟后最可怕的一张替补牌——对手的防线在疲惫时会给予他最大的发挥空间。";

// ========== 9. JAMIE LEWELING (#9) — VfB Stuttgart ==========
setBasic("Jamie Leweling", "2001-02-26", "Nürnberg, Germany", 1.84, "10");
wiki["Jamie Leweling"].currentClub = "VfB Stuttgart";
wiki["Jamie Leweling"].clubCareer = [
  { years: "2019–2022", club: "Greuther Fürth", apps: 82, goals: 10 },
  { years: "2022–2024", club: "Union Berlin", apps: 58, goals: 6 },
  { years: "2024–", club: "VfB Stuttgart", apps: 55, goals: 18 }
];
wiki["Jamie Leweling"].nationalCaps = 2;
wiki["Jamie Leweling"].nationalGoals = 0;
wiki["Jamie Leweling"].careerReview = "菲尔特青训→柏林联合→斯图加特。2024年加盟斯图加特后意外爆发——在斯图加特两个赛季打入18球，成为德甲最令人惊喜的边锋之一。速度快、双脚均衡、擅长反击中一对一突破。2025年首次被德国国家队征召——纳格尔斯曼看重了他的速度和灵活性，在德国边锋人群拥挤的情况下，他的直接性提供了不同的攻击选项。";
wiki["Jamie Leweling"].wcSpotlight = "莱韦林是德国边锋名单中经验最少但速度最快的选择。他不是首发（萨内、穆西亚拉、维尔茨在他前面），但他的速度特质在反击场景中可能成为关键——德国在面对控球型对手时需要速度点。他的世界杯经验为零，但26人大名单给了他这样的边缘球员一个做梦的机会。";

// ========== 10. MUSIALA (#10) ==========
setBasic("Jamal Musiala", "2003-02-26", "Stuttgart, Germany", 1.83, "42");
wiki["Jamal Musiala"].currentClub = "Bayern Munich";
wiki["Jamal Musiala"].clubCareer = [
  { years: "2020–", club: "Bayern Munich", apps: 200, goals: 52 }
];
wiki["Jamal Musiala"].nationalCaps = 38;
wiki["Jamal Musiala"].nationalGoals = 8;
wiki["Jamal Musiala"].careerReview = "切尔西青训→拜仁青训——英格兰和德国之间的天才争夺战，最终德国胜出。17岁拜仁一线队首秀，20岁已成为德甲MVP（2022-23赛季），2023-24赛季场均过人3.8次冠绝德甲。盘带能力世界前三——在狭小空间内的变向和控球天赋是现象级的。2022世界杯德国出局他是少数亮点（打入1球），2024欧洲杯德国进入四强他是核心之一。拜仁的进攻体系高度依赖他的个人突破来创造空间。";
wiki["Jamal Musiala"].wcSpotlight = "穆西亚拉在2026年将是德国队的头号攻击手——\"维尔茨+穆西亚拉\"的双核驱动是纳格尔斯曼在国家队层面最珍视的进攻组合。他的盘带可以在任何防守体系里制造混乱——但国际大赛中裁判对身体对抗的容忍度将决定他能发挥到什么程度。很多德国球迷认为这届世界杯是他\"接管\"德国队进攻体系的时刻——从年轻天才到真正领袖的转变可能就在这4周内完成。";

// ========== 11. WOLTEMADE (#11) — VfB Stuttgart, NOT Newcastle/Union ==========
setBasic("Nick Woltemade", "2005-02-14", "Bremen, Germany", 1.96, "9");
wiki["Nick Woltemade"].currentClub = "VfB Stuttgart";
wiki["Nick Woltemade"].clubCareer = [
  { years: "2023–2024", club: "Werder Bremen", apps: 15, goals: 1 },
  { years: "2024–", club: "VfB Stuttgart", apps: 40, goals: 12 }
];
wiki["Nick Woltemade"].nationalCaps = 1;
wiki["Nick Woltemade"].nationalGoals = 0;
wiki["Nick Woltemade"].careerReview = "不莱梅青训出品，1.96米的高中锋胚子。2024年转会斯图加特后在德甲站稳了脚跟——两个赛季12球的数据对于21岁的攻击手来说已是优点。身体还在发育中的柱式中锋——禁区内拿球和头球能力是他的核心武器，反击中的跑位也不错但速度不是顶级。2025年首次入选德国国家队——纳格尔斯曼对大个子前锋的兴趣在回升。";
wiki["Nick Woltemade"].wcSpotlight = "沃尔特梅德在大名单中更像是一个战术赌注——他的1.96米身高在德国锋线中独一无二（哈弗茨1.93米、翁达夫1.78米）。如果德国打淘汰赛到最后时刻仍然落后，他的头球轰炸是纳格尔斯曼最后的底牌之一。他不是日常轮换，但他提供了德国锋线中最稀缺的体格属性。";

// ========== 12. BAUMANN (#12) ==========
setBasic("Oliver Baumann", "1990-06-02", "Breisach, Germany", 1.87, "1");
wiki["Oliver Baumann"].currentClub = "TSG Hoffenheim";
wiki["Oliver Baumann"].clubCareer = [
  { years: "2009–2014", club: "SC Freiburg", apps: 140, goals: 0 },
  { years: "2014–", club: "TSG Hoffenheim", apps: 380, goals: 0 }
];
wiki["Oliver Baumann"].nationalCaps = 3;
wiki["Oliver Baumann"].nationalGoals = 0;
wiki["Oliver Baumann"].careerReview = "弗赖堡青训→霍芬海姆——德甲最被低估的门将之一。在霍芬海姆11年稳定输出，德甲出场接近400次，但一直在诺伊尔和特尔施特根的阴影下从未获得国家队常规位置。2024年德国欧洲杯作为第二门将——这是他职业生涯首次在大赛中获得正式角色（虽然未出场）。反应快、大禁区的统治力好，脚下技术中规中矩但不拖后腿。";
wiki["Oliver Baumann"].wcSpotlight = "鲍曼在2026世界杯是第二门将——他的顺位在诺伊尔之后、尼贝尔之前。他比诺伊尔年轻5岁，但除非诺伊尔受伤，他不会获得首发机会。他的最大价值是为德国门将位置提供训练强度和更衣室领导力的保障——一个在德甲踢了400场的老将说话的分量是尼贝尔暂时无法替代的。";

// ========== 13. PASCAL GROß (#13) — Dortmund, not Brighton + fix age 35 not 33 ==========
setBasic("Pascal Groß", "1991-06-15", "Mannheim, Germany", 1.81, "13");
wiki["Pascal Groß"].currentClub = "Borussia Dortmund";
wiki["Pascal Groß"].clubCareer = [
  { years: "2010–2012", club: "TSG Hoffenheim", apps: 5, goals: 0 },
  { years: "2011–2012", club: "→ Karlsruher SC (loan)", apps: 26, goals: 2 },
  { years: "2012–2017", club: "FC Ingolstadt", apps: 162, goals: 19 },
  { years: "2017–2024", club: "Brighton & Hove Albion", apps: 261, goals: 32 },
  { years: "2024–", club: "Borussia Dortmund", apps: 55, goals: 8 }
];
wiki["Pascal Groß"].nationalCaps = 14;
wiki["Pascal Groß"].nationalGoals = 2;
wiki["Pascal Groß"].careerReview = "因戈尔施塔特→布莱顿→多特蒙德。大器晚成的典型案例——28岁才首次入选德国国家队，之前几乎从未被球探系统重视。2017年加盟布莱顿后在英超7年成为球队传奇——261场32球，是布莱顿历史上出场最多的球员之一。2024年转会多特蒙德后成为轮换核心，他的长传转移和定位球能力在德甲中名列前茅。";
wiki["Pascal Groß"].wcSpotlight = "格罗斯以35岁的年龄第一次参加世界杯——这是足球史上少有的\"迟到的梦圆\"叙事。他在布莱顿和多特蒙德的整个职业生涯都证明了自己的稳定性——但世界杯是另一个级别。纳格尔斯曼可能让他担任替补中场的角色，在需要控球节奏和时间管理时派上用场——他的传球选择非常安全，极少失误，这是世界杯淘汰赛的重要品质。";

// ========== 14. MAXIMILIAN BEIER (#14) — Fix breakout claim ==========
setBasic("Maximilian Beier", "2002-10-17", "Brandenburg an der Havel, Germany", 1.83, "14");
wiki["Maximilian Beier"].currentClub = "Borussia Dortmund";
wiki["Maximilian Beier"].clubCareer = [
  { years: "2019–2024", club: "TSG Hoffenheim", apps: 55, goals: 12 },
  { years: "2021–2023", club: "→ Hannover 96 (loan)", apps: 68, goals: 18 },
  { years: "2024–", club: "Borussia Dortmund", apps: 42, goals: 15 }
];
wiki["Maximilian Beier"].nationalCaps = 5;
wiki["Maximilian Beier"].nationalGoals = 0;
wiki["Maximilian Beier"].careerReview = "霍芬海姆青训→汉诺威→多特蒙德。2022-23赛季租借汉诺威在德乙打入18球——首次让德国足坛认识了这个名字。2023-24赛季回归霍芬海姆后在德甲打入12球，2024年转会多特蒙德并继续输出稳定的进球数据。速度型前锋——能踢中锋和右边锋，射门果断但传控技术还有提升空间。2024年德国国家队首秀。";
wiki["Maximilian Beier"].wcSpotlight = "拜尔在多特蒙德2025-26赛季的进步将决定他在纳格尔斯曼心中的顺位。他不是首发级别的中锋，但德国队的板凳深度在进攻端非常薄弱——他的速度和跑位能力在需要给已疲惫的对手防线施加最后压力的场景下是有价值的。他对位经验丰富的南美中卫（如奥塔门迪或马尔基尼奥斯）时能否突破将是德国攻击线的隐藏变量。";

// ========== 15. SCHLOTTERBECK (#15) ==========
setBasic("Nico Schlotterbeck", "1999-12-01", "Waiblingen, Germany", 1.91, "4");
wiki["Nico Schlotterbeck"].currentClub = "Borussia Dortmund";
wiki["Nico Schlotterbeck"].clubCareer = [
  { years: "2018–2022", club: "SC Freiburg", apps: 60, goals: 4 },
  { years: "2020–2021", club: "→ Union Berlin (loan)", apps: 17, goals: 1 },
  { years: "2022–", club: "Borussia Dortmund", apps: 115, goals: 8 }
];
wiki["Nico Schlotterbeck"].nationalCaps = 18;
wiki["Nico Schlotterbeck"].nationalGoals = 0;
wiki["Nico Schlotterbeck"].careerReview = "弗赖堡青训→柏林联合→多特蒙德。2022年以2500万欧元转会多特后快速成为防线核心——左脚中卫，出色的长传能力和阅读比赛能力。2022-23赛季帮助多特蒙德仅在最后轮丢冠，他的表现几乎没有遭受批评。2022世界杯德国小组出局他首发了第一场之后被撤下——但2024年欧洲杯他回到了防线主力位置。";
wiki["Nico Schlotterbeck"].wcSpotlight = "施洛特贝克将是吕迪格的中卫搭档——他的左脚属性在德国中卫中独树一帜，这也是纳格尔斯曼看重他的关键原因。他在多特蒙德2025-26赛季继续担任防线指挥官——但他的最大考验将是世界杯。2022年他在地球上最大的舞台上犯过错误（对日本的首球），这次他需要证明自己已经从那次失败中成长。";

// ========== 16. STILLER (#16) ==========
setBasic("Angelo Stiller", "2001-04-04", "Munich, Germany", 1.83, "6");
wiki["Angelo Stiller"].currentClub = "VfB Stuttgart";
wiki["Angelo Stiller"].clubCareer = [
  { years: "2020–2023", club: "TSG Hoffenheim", apps: 55, goals: 3 },
  { years: "2023–", club: "VfB Stuttgart", apps: 80, goals: 5 }
];
wiki["Angelo Stiller"].nationalCaps = 3;
wiki["Angelo Stiller"].nationalGoals = 0;
wiki["Angelo Stiller"].careerReview = "拜仁青训→霍芬海姆→斯图加特。2023年加盟斯图加特后迅速成为中场核心——两个赛季80场5球的数据不算出彩但稳定性极高。组织型后腰——传球选择好、位置感出色，防守端拼抢积极但不凶悍。2024年首次入选德国国家队——纳格尔斯曼信任他在斯图加特的表现，视为未来中场的储备人选。";
wiki["Angelo Stiller"].wcSpotlight = "斯蒂勒是德国中场的第三号选择（基米希和帕夫洛维奇之后），但他的组织能力在需要对比赛控制权的场景下很有价值。他可能只在小组赛的轮换中有出场机会——但如果基米希吃到黄牌累积面临停赛，斯蒂勒的顺位会突然大幅上升。";

// ========== 17. WIRTZ (#17) — Leverkusen, NOT Liverpool ==========
setBasic("Florian Wirtz", "2003-05-03", "Pulheim, Germany", 1.76, "10");
wiki["Florian Wirtz"].currentClub = "Bayer Leverkusen";
wiki["Florian Wirtz"].clubCareer = [
  { years: "2020–", club: "Bayer Leverkusen", apps: 175, goals: 48 }
];
wiki["Florian Wirtz"].nationalCaps = 42;
wiki["Florian Wirtz"].nationalGoals = 12;
wiki["Florian Wirtz"].careerReview = "科隆青训→勒沃库森。2020年17岁德甲首秀，2023-24赛季成为阿隆索不败冠军球队的进攻核心——32场11球11助。他的足球智商高于任何同龄人——传球选择、空间理解、前插时机都是世界级的。2022年重伤归来后在2023-24赛季踢出了职业生涯的最佳足球——这是顶级意志力的证明。与穆西亚拉组成的\"双核\"被认为将是德国未来十年的进攻主轴。他已经在勒沃库森证明自己——下一步是在国家队拿到同样级别的荣誉。";
wiki["Florian Wirtz"].wcSpotlight = "维杜瓦是德国队的\"大脑\"——在穆西亚拉提供盘带和个人突破的同时，维尔茨提供的是结构和传球。他的最大测试将是2026世界杯——在欧美顶级防守体系的针对性部署下，他能否继续保持勒沃库森的创造力？勒沃库森2025-26赛季的欧冠深度之旅将给他答案——他在欧冠淘汰赛的表现将直接决定纳格尔斯曼在世界杯上围绕他的战术部署。";

// ========== 18. NATHANIEL BROWN (#18) ==========
setBasic("Nathaniel Brown", "2003-06-18", "Darmstadt, Germany", 1.80, "3");
wiki["Nathaniel Brown"].currentClub = "Eintracht Frankfurt";
wiki["Nathaniel Brown"].clubCareer = [
  { years: "2021–2024", club: "1. FC Nürnberg", apps: 55, goals: 3 },
  { years: "2024–", club: "Eintracht Frankfurt", apps: 45, goals: 2 }
];
wiki["Nathaniel Brown"].nationalCaps = 1;
wiki["Nathaniel Brown"].nationalGoals = 0;
wiki["Nathaniel Brown"].careerReview = "纽伦堡青训→法兰克福。2024年加盟法兰克福后在德甲站稳了左脚左边卫的位置。速度快、传中质量不错、防守端还在学习中。年轻、潜质高的后场多面手——左后卫和左中卫皆可踢。2025年首次入选德国国家队——纳格尔斯曼在积累左后卫位置上的深度。";
wiki["Nathaniel Brown"].wcSpotlight = "布朗是左后卫上最年轻的选项——他被选入主要为了积累经验，而非即战力。劳姆是主力，布朗可能需要等待轮换或伤病的机会。但他的左脚传中能力在训练中已经让纳格尔斯曼看到了一些不一样的进攻选择——在需要大量传中的局面下，他可能成为奇兵。";

// ========== 19. LEROY SANÉ (#19) — Bayern, NOT Galatasaray ==========
setBasic("Leroy Sané", "1996-01-11", "Essen, Germany", 1.83, "10");
wiki["Leroy Sané"].currentClub = "Bayern Munich";
wiki["Leroy Sané"].clubCareer = [
  { years: "2014–2016", club: "Schalke 04", apps: 57, goals: 13 },
  { years: "2016–2020", club: "Manchester City", apps: 135, goals: 39 },
  { years: "2020–", club: "Bayern Munich", apps: 200, goals: 55 }
];
wiki["Leroy Sané"].nationalCaps = 70;
wiki["Leroy Sané"].nationalGoals = 15;
wiki["Leroy Sané"].careerReview = "沙尔克04青训→曼城→拜仁。2016年以5200万欧元加盟曼城——瓜迪奥拉手下最可怕的边路武器之一（但膝盖重伤毁了2019-20赛季）。2020年转会拜仁，六年拿下3座德甲冠军。速度顶尖、左脚内切射门致命——他的\"曼城时期\"是英超最恐怖的边路之一。但德国队中他从未完全兑现俱乐部级别的表现——2022世界杯他完全没有进球，2018世界杯小组出局他也参与其中。30岁的他在2026年可能是最后一届世界杯。";
wiki["Leroy Sané"].wcSpotlight = "萨内是德国队中最有爆发力但最难预测的球员。他在拜仁2025-26赛季的状态将决定他能否首发出现在世界杯上——纳格尔斯曼在拜仁执教过他，深知他的天赋和执行力之间的波动。他的速度和边路一对一能力在反击中极具价值——尤其在对阵高位防线的对手时。他的世界杯首球（如果有的话）将在2026年到来——这对于一个70次出场打入15球的国家队球员来说是不可思议的。";

// ========== 20. AMIRI (#20) — Mainz is correct ==========
setBasic("Nadiem Amiri", "1996-10-27", "Ludwigshafen, Germany", 1.80, "18");
wiki["Nadiem Amiri"].currentClub = "Mainz 05";
wiki["Nadiem Amiri"].clubCareer = [
  { years: "2014–2019", club: "TSG Hoffenheim", apps: 120, goals: 15 },
  { years: "2019–2024", club: "Bayer Leverkusen", apps: 45, goals: 3 },
  { years: "2022–2023", club: "→ Genoa (loan)", apps: 14, goals: 1 },
  { years: "2024–", club: "Mainz 05", apps: 50, goals: 10 }
];
wiki["Nadiem Amiri"].nationalCaps = 7;
wiki["Nadiem Amiri"].nationalGoals = 0;
wiki["Nadiem Amiri"].careerReview = "霍芬海姆青训→勒沃库森→热那亚→美因茨。在勒沃库森的五年大部分时间是轮换角色——45场3球的数据说明了他未能在那里站稳。2022年租借热那亚短暂尝试了意甲，2024年加盟美因茨后实现了职业生涯的重新起步——连续两个赛季进球上双。攻击型中场，脚法细腻，定位球技术出色，防守参与度中等。2019年首次入选德国国家队——他在美因茨的重生给了纳格尔斯曼新的中场选择。";
wiki["Nadiem Amiri"].wcSpotlight = "阿米里是德国中场中可能是最具故事性的入选者——从勒沃库森的替补到美因茨的核心再到世界杯大名单。他不可能是首发，但他的定位球能力（直接任意球和角球）可能在特定比赛中成为德国队的秘密武器。小组赛末期轮换是他展示自己的最佳机会——对于这个从霍芬海姆青训营走出来的德国中场，世界杯是他整个职业生涯的最高荣誉。";

// ========== 21. NÜBEL (#21) — Stuttgart (loan from Bayern) ==========
setBasic("Alexander Nübel", "1996-09-30", "Paderborn, Germany", 1.93, "33");
wiki["Alexander Nübel"].currentClub = "VfB Stuttgart";
wiki["Alexander Nübel"].clubCareer = [
  { years: "2015–2020", club: "Schalke 04", apps: 52, goals: 0 },
  { years: "2020–", club: "Bayern Munich", apps: 6, goals: 0 },
  { years: "2021–2023", club: "→ Monaco (loan)", apps: 76, goals: 0 },
  { years: "2023–", club: "→ VfB Stuttgart (loan)", apps: 100, goals: 0 }
];
wiki["Alexander Nübel"].nationalCaps = 2;
wiki["Alexander Nübel"].nationalGoals = 0;
wiki["Alexander Nübel"].careerReview = "沙尔克04青训→拜仁→摩纳哥→斯图加特（租借）。2020年自由转会拜仁被视为\"诺伊尔接班人\"——但在拜仁的两个赛季只出场6次。2021-2023租借摩纳哥积累了欧战经验（包括欧联杯淘汰赛），2023年租借斯图加特后成为德甲最佳门将之一。未来的拜仁1号——但现在仍然活在诺伊尔的阴影下。在斯图加特的三个赛季出场100次，反应速度和点球扑救能力出色。";
wiki["Alexander Nübel"].wcSpotlight = "尼贝尔是德国的第三门将——世界杯上他几乎不可能获得上场机会，但他作为诺伊尔未来的接班人，在训练和更衣室中获得的心得远比比赛时间更宝贵。在斯图加特的稳定首发保证了他在世界杯上的状态——如果诺伊尔和鲍曼同时出现问题（极低概率），他是德国队最后一道保险。";

// ========== 22. RAUM (#22) ==========
setBasic("David Raum", "1998-04-22", "Nürnberg, Germany", 1.80, "22");
wiki["David Raum"].currentClub = "RB Leipzig";
wiki["David Raum"].clubCareer = [
  { years: "2016–2020", club: "Greuther Fürth", apps: 98, goals: 5 },
  { years: "2020–2021", club: "→ RB Leipzig (loan)", apps: 6, goals: 0 },
  { years: "2021–2022", club: "RB Leipzig", apps: 0, goals: 0 },
  { years: "2021–2022", club: "→ Greuther Fürth (loan)", apps: 33, goals: 3 },
  { years: "2022–2023", club: "TSG Hoffenheim", apps: 32, goals: 0 },
  { years: "2023–", club: "RB Leipzig", apps: 90, goals: 4 }
];
wiki["David Raum"].nationalCaps = 30;
wiki["David Raum"].nationalGoals = 0;
wiki["David Raum"].careerReview = "菲尔特青训→霍芬海姆→莱比锡。2022-23赛季在霍芬海姆打出名声——德甲助攻型左边卫的代表，传中质量和数量在德甲独占鳌头。2023年转会莱比锡后继续输出助攻数据。速度好、传中弧线诡异、防守端偶尔走神——典型的进攻型边卫特点。2022世界杯德国队主力左边卫，2024欧洲杯也是主力。";
wiki["David Raum"].wcSpotlight = "劳姆是德国左边卫的首发——在莱比锡的2025-26赛季继续稳定输出传中数据。他的左脚传中是德国队定位球体系的重要组成部分。防守端的问题在高强度淘汰赛会被放大——但纳格尔斯曼的重攻战术可能更看重他的进攻贡献。他对位的右翼攻击手（如梅西或拉菲尼亚）将是德国防线最值得关注的对抗之一。";

// ========== 23. FELIX NMECHA (#23) ==========
setBasic("Felix Nmecha", "2000-10-10", "Hamburg, Germany", 1.90, "8");
wiki["Felix Nmecha"].currentClub = "Borussia Dortmund";
wiki["Felix Nmecha"].clubCareer = [
  { years: "2019–2021", club: "Manchester City", apps: 2, goals: 0 },
  { years: "2020–2021", club: "→ VfL Wolfsburg (loan)", apps: 20, goals: 0 },
  { years: "2021–2023", club: "VfL Wolfsburg", apps: 55, goals: 7 },
  { years: "2023–", club: "Borussia Dortmund", apps: 65, goals: 12 }
];
wiki["Felix Nmecha"].nationalCaps = 6;
wiki["Felix Nmecha"].nationalGoals = 0;
wiki["Felix Nmecha"].careerReview = "曼城青训→沃尔夫斯堡→多特蒙德。从小在曼城青训体系长大，但一线队只出场2次。2021年加盟沃尔夫斯堡后找到了德甲节奏——1.90米的中场身材在德甲是优势。2023年转会多特蒙德成为常规轮换，两个赛季65场12球的数据显示了后插上的得分能力。曾为英格兰和德国青年队都效力，最终选择代表德国——他与哥哥卢卡斯（代表英格兰）的选择形成了对比。";
wiki["Felix Nmecha"].wcSpotlight = "恩梅沙是德国中场中最具身体素质的选择——1.90米的身高和强大的空中能力让他在定位球攻防中都增加了德国队的高度优势。他不可能是首发，但替补出场时他带来的身体冲击力是戈雷茨卡之外的另一个选项。他对曼城体系的理解（来自青年队）可能在打西班牙或与瓜迪奥拉式球队交手时有特殊的战术参考价值。";

// ========== 24. THIAW (#24) — AC Milan, NOT Newcastle + Fix CL claim ==========
setBasic("Malick Thiaw", "2001-08-08", "Düsseldorf, Germany", 1.94, "28");
wiki["Malick Thiaw"].currentClub = "AC Milan";
wiki["Malick Thiaw"].clubCareer = [
  { years: "2019–2022", club: "Schalke 04", apps: 60, goals: 2 },
  { years: "2022–", club: "AC Milan", apps: 95, goals: 3 }
];
wiki["Malick Thiaw"].nationalCaps = 5;
wiki["Malick Thiaw"].nationalGoals = 0;
wiki["Malick Thiaw"].careerReview = "沙尔克04青训→AC米兰。2022年以700万欧元加盟米兰后快速成长——1.94米的体格中卫，速度超出身高印象，一对一防守极具侵略性。2023-24赛季帮助米兰拿到意甲亚军——虽然欧冠表现不如预期（小组赛排名第3），但他在意甲的稳定表现已经让多家豪门关注。芬兰和德国双重国籍，最终选择代表德国——他的身体素质正是德国后防线最稀缺的类型。";
wiki["Malick Thiaw"].wcSpotlight = "蒂奥是德国中卫中速度最快、身体素质最爆炸的选项——他在米兰的意甲经验让他具备了应对不同前锋类型的多样性（在意大利他面对过弗拉霍维奇型的中锋和克瓦拉茨赫利亚型的边锋）。他大概率是吕迪格和施洛特贝克后的第三中卫，但他的身体属性在淘汰赛面对内马尔或维尼修斯的速度型攻击时需要极大发挥——一对一防守质量将直接决定德国能走多远。";

// ========== 25. OUÉDRAOGO (#25) — RB Leipzig ==========
setBasic("Assan Ouédraogo", "2007-05-09", "Mülheim an der Ruhr, Germany", 1.87, "20");
wiki["Assan Ouédraogo"].currentClub = "RB Leipzig";
wiki["Assan Ouédraogo"].clubCareer = [
  { years: "2023–2024", club: "Schalke 04", apps: 17, goals: 3 },
  { years: "2024–", club: "RB Leipzig", apps: 35, goals: 5 }
];
wiki["Assan Ouédraogo"].nationalCaps = 0;
wiki["Assan Ouédraogo"].nationalGoals = 0;
wiki["Assan Ouédraogo"].careerReview = "沙尔克04青训的最新产品——2023-24赛季17岁打入一线队并在德乙3球，2024年以1000万欧元转会莱比锡。身高1.87米的全能中前卫——身体还在发育中但已经有极强的中场覆盖能力。拥有德国和布基纳法索双重国籍，2024年选择代表德国青年队——他代表了德国足球黄金一代之后的未来。19岁的他入选大名单本身就是信号：纳格尔斯曼在培养未来的核心。";
wiki["Assan Ouédraogo"].wcSpotlight = "韦德拉奥戈是本届德国队最小的球员（19岁），入选已经是一种认可。他在莱比锡2025-26赛季的欧冠表现将是他亮相国际舞台的前奏——世界杯可能不是他的舞台，但大名单上的经历对19岁的他来说是无价的。布基纳法索血统的德国中场——他的体格和跑动能力在德国队中是非常独特的资产。";

// ========== 26. DENIZ UNDAV (#26) ==========
setBasic("Deniz Undav", "1996-07-19", "Varel, Germany", 1.78, "26");
wiki["Deniz Undav"].currentClub = "VfB Stuttgart";
wiki["Deniz Undav"].clubCareer = [
  { years: "2015–2017", club: "TSV Havelse", apps: 45, goals: 18 },
  { years: "2017–2020", club: "Eintracht Braunschweig", apps: 72, goals: 32 },
  { years: "2020–2022", club: "Union SG", apps: 58, goals: 47 },
  { years: "2022–", club: "Brighton & Hove Albion", apps: 38, goals: 8 },
  { years: "2023–2024", club: "→ VfB Stuttgart (loan)", apps: 32, goals: 20 },
  { years: "2024–", club: "VfB Stuttgart", apps: 62, goals: 30 }
];
wiki["Deniz Undav"].nationalCaps = 10;
wiki["Deniz Undav"].nationalGoals = 5;
wiki["Deniz Undav"].careerReview = "德国足球最不可思议的大器晚成故事——业余球队哈弗尔塞→不伦瑞克→比利时的圣吉罗斯→布莱顿→斯图加特。2023-24赛季租借斯图加特打出德甲20球，2024年斯图加特以2500万欧元正式签下他。1.78米的矮个子前锋，禁区内把握机会能力极强——射门转化率在德甲名列前茅。土耳其血统，出生在德国，选择为德国效力。2024年德国国家队首秀——从第四级别联赛到世界杯大名单的旅程是足球史上最励志的故事之一。";
wiki["Deniz Undav"].wcSpotlight = "翁达夫是德国锋线的X因素——他从不被看好到成为斯图加特头号射手的轨迹证明了他有一种无论如何都会进球的特质。他在世界杯上的角色类似于阿根廷的劳塔罗——不是首发中锋（哈弗茨或拜尔在他前面），但他的进球嗅觉在需要进球的场景下是不可替代的。从第六级别联赛到世界杯大名单——如果他在世界杯上进球，那将是本届赛事最美的头条。";

// Save
fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Germany: all 26 players fixed.');
