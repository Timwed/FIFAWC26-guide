// Fix all Brazil player data: clubCareer, birthDate, height, mismatched clubs, empty bios
const fs = require('fs');
const path = require('path');
const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// ========== HELPERS ==========
function setBasic(name, birthDate, birthPlace, height, clubNum, image, extract, intro) {
  if (!wiki[name]) return;
  Object.assign(wiki[name], {
    birthDate, birthPlace, height, clubNumber: clubNum || "",
    image: image || "",
    extractPreview: extract || "",
    introPreview: intro || ""
  });
}

// ========== 1. ALISSON (#1) — Liverpool GK, had empty bios ==========
setBasic("Alisson", "1992-10-02", "Novo Hamburgo, Brazil", 1.93, "1", "",
  "Alisson Ramses Becker, known as Alisson, is a Brazilian professional footballer who plays as a goalkeeper for Premier League club Liverpool and the Brazil national team.",
  "Alisson joined Liverpool from Roma in 2018 for a then-world record goalkeeper fee of £66.8 million."
);
wiki["Alisson"].clubCareer = [
  { years: "2013–2016", club: "Internacional", apps: 110, goals: 0 },
  { years: "2016–2018", club: "Roma", apps: 64, goals: 0 },
  { years: "2018–", club: "Liverpool", apps: 290, goals: 1 }
];
wiki["Alisson"].nationalCaps = 74;
wiki["Alisson"].nationalGoals = 0;
wiki["Alisson"].currentClub = "Liverpool";
wiki["Alisson"].careerReview = "国际队青训出品，2016年以800万欧元加盟罗马，2018年以7250万欧元创当时门将转会费纪录转会利物浦。英超7年拿下1座欧冠、1座英超、1座足总杯、2座联赛杯——完成英格兰俱乐部荣誉大满贯。2019和2020连续两年获FIFA最佳门将。2020-21赛季对阵西布朗的头球绝杀（95分钟）让他成为英超历史上首个进球的门将。脚下技术顶级，适合从后场出球的体系，扑救反应和一对一能力均属世界级。2018和2022世界杯主力，合计9场零封。";
wiki["Alisson"].wcSpotlight = "阿利松在2026世界杯的角色很明确：巴西一号门将，没有争议。他在利物浦2025-26赛季继续稳定输出，场均扑救在英超名列前茅。最大的不确定性是年龄——33岁已进入门将巅峰期的末尾，但上一届世界杯（2022）他让巴西球迷失望的四分之一决赛扑救失误会是他最想偿还的债。巴西的淘汰赛命运很可能系于他的手套——如果打到点球大战，他面对梅西或姆巴佩级别的罚球手时能否挺身而出，将决定巴西能否终结24年无冠。";

// ========== 2. ÉDERSON SILVA (#2) — Atalanta midfielder ==========
setBasic("Éderson Silva", "1999-07-07", "Campo Grande, Brazil", 1.83, "13", "",
  "Éderson José dos Santos Lourenço da Silva, known as Éderson, is a Brazilian professional footballer who plays as a central midfielder for Atalanta.",
  "Éderson joined Atalanta from Salernitana in 2022."
);
wiki["Éderson Silva"].clubCareer = [
  { years: "2018–2019", club: "Cruzeiro", apps: 25, goals: 2 },
  { years: "2019–2020", club: "Corinthians", apps: 31, goals: 1 },
  { years: "2020–2022", club: "Salernitana", apps: 52, goals: 2 },
  { years: "2022–", club: "Atalanta", apps: 148, goals: 8 }
];
wiki["Éderson Silva"].currentClub = "Atalanta";
wiki["Éderson Silva"].nationalCaps = 15;
wiki["Éderson Silva"].nationalGoals = 1;

// ========== 3. GABRIEL MAGALHÃES (#3) ==========
setBasic("Gabriel Magalhães", "1997-12-19", "São Paulo, Brazil", 1.90, "6", "",
  "Gabriel dos Santos Magalhães, known as Gabriel, is a Brazilian professional footballer who plays as a centre-back for Arsenal.",
  "Gabriel joined Arsenal from Lille in 2020 for £27 million."
);
wiki["Gabriel Magalhães"].clubCareer = [
  { years: "2016–2017", club: "Avaí", apps: 34, goals: 1 },
  { years: "2017–2020", club: "Lille", apps: 52, goals: 2 },
  { years: "2020–", club: "Arsenal", apps: 200, goals: 17 }
];
wiki["Gabriel Magalhães"].currentClub = "Arsenal";
wiki["Gabriel Magalhães"].nationalCaps = 22;
wiki["Gabriel Magalhães"].nationalGoals = 1;

// ========== 4. MARQUINHOS (#4) ==========
setBasic("Marquinhos", "1994-05-14", "São Paulo, Brazil", 1.83, "5", "",
  "Marcos Aoás Corrêa, known as Marquinhos, is a Brazilian professional footballer who plays as a centre-back for Paris Saint-Germain.",
  "Marquinhos joined PSG from Roma in 2013."
);
wiki["Marquinhos"].clubCareer = [
  { years: "2012", club: "Corinthians", apps: 14, goals: 0 },
  { years: "2012–2013", club: "Roma", apps: 30, goals: 0 },
  { years: "2013–", club: "Paris Saint-Germain", apps: 450, goals: 40 }
];
wiki["Marquinhos"].currentClub = "PSG";
wiki["Marquinhos"].nationalCaps = 95;
wiki["Marquinhos"].nationalGoals = 7;

// ========== 5. CASEMIRO (#5) ==========
setBasic("Casemiro", "1992-02-23", "São José dos Campos, Brazil", 1.85, "18", "",
  "Carlos Henrique Casimiro, known as Casemiro, is a Brazilian professional footballer who plays as a defensive midfielder for Manchester United.",
  "Casemiro spent nine years at Real Madrid, winning five Champions League titles."
);
wiki["Casemiro"].clubCareer = [
  { years: "2010–2013", club: "São Paulo", apps: 112, goals: 11 },
  { years: "2013", club: "→ Real Madrid B (loan)", apps: 15, goals: 1 },
  { years: "2013–2014", club: "→ Real Madrid (loan)", apps: 27, goals: 0 },
  { years: "2014–2015", club: "→ Porto (loan)", apps: 40, goals: 4 },
  { years: "2015–2022", club: "Real Madrid", apps: 336, goals: 31 },
  { years: "2022–", club: "Manchester United", apps: 100, goals: 12 }
];
wiki["Casemiro"].currentClub = "Manchester United";
wiki["Casemiro"].nationalCaps = 83;
wiki["Casemiro"].nationalGoals = 7;

// ========== 6. ALEX SANDRO (#6) ==========
setBasic("Alex Sandro", "1991-01-26", "Catanduva, Brazil", 1.81, "26", "",
  "Alex Sandro Lobo Silva, known as Alex Sandro, is a Brazilian professional footballer who plays as a left-back for Flamengo.",
  "Alex Sandro spent nine seasons at Juventus, winning five Serie A titles."
);
wiki["Alex Sandro"].clubCareer = [
  { years: "2008–2010", club: "Atlético Paranaense", apps: 37, goals: 1 },
  { years: "2010–2011", club: "→ Santos (loan)", apps: 38, goals: 2 },
  { years: "2011–2015", club: "Porto", apps: 137, goals: 3 },
  { years: "2015–2024", club: "Juventus", apps: 327, goals: 15 },
  { years: "2024–", club: "Flamengo", apps: 45, goals: 1 }
];
wiki["Alex Sandro"].currentClub = "Flamengo";
wiki["Alex Sandro"].nationalCaps = 42;
wiki["Alex Sandro"].nationalGoals = 2;

// ========== 7. VINÍCIUS JÚNIOR (#7) — Fix Ballon d'Or claim ==========
setBasic("Vinícius Júnior", "2000-07-12", "São Gonçalo, Brazil", 1.76, "7", "",
  "Vinícius José Paixão de Oliveira Júnior, known as Vinícius Júnior or Vini Jr, is a Brazilian professional footballer who plays as a winger for Real Madrid.",
  "Vinícius joined Real Madrid from Flamengo in 2018 for €46 million."
);
wiki["Vinícius Júnior"].currentClub = "Real Madrid";
wiki["Vinícius Júnior"].clubCareer = [
  { years: "2017–2018", club: "Flamengo", apps: 69, goals: 14 },
  { years: "2018–", club: "Real Madrid", apps: 282, goals: 98 }
];
wiki["Vinícius Júnior"].nationalCaps = 37;
wiki["Vinícius Júnior"].nationalGoals = 5;
wiki["Vinícius Júnior"].careerReview = "弗拉门戈青训的最璀璨明珠，2017年17岁即以4600万欧元提前签约皇马，2018年正式报到。在皇马8个赛季成长为世界最佳左边锋——2021-22赛季欧冠决赛打进制胜球，2023-24赛季西甲+欧冠双冠，2024 FIFA最佳球员得主。职业生涯272场98球，两座欧冠在手。速度撕裂防线、内切弧线球致命、大场面属性已反复验证。2022世界杯八强战对克罗地亚加时进球后却在点球大战前被换下——这是巴西队近年的最大战术争议之一。2026年他将肩负巴西足球的全部希望。";
wiki["Vinícius Júnior"].wcSpotlight = "维尼修斯以世界足球先生的身份进入2026世界杯，全世界都在看他能否填补内马尔之后巴西队领袖的空缺。2022世界杯他打进1球后就因巴西被克罗地亚淘汰而成为悲剧英雄，四年后他的复仇剧本已经写就。皇马欧冠决赛的辉煌证明了他有能力在最关键的时刻接管比赛——问题在于巴西队体系能否像皇马那样完全为他服务。如果巴西走远，维尼修斯将有机会追平甚至超越内马尔在国家队层面的历史地位。";

// ========== 8. BRUNO GUIMARÃES (#8) ==========
setBasic("Bruno Guimarães", "1997-11-16", "Rio de Janeiro, Brazil", 1.82, "39", "",
  "Bruno Guimarães Rodriguez Moura, known as Bruno Guimarães, is a Brazilian professional footballer who plays as a central midfielder for Newcastle United.",
  "Bruno joined Newcastle United from Lyon in January 2022 for £40 million."
);
wiki["Bruno Guimarães"].currentClub = "Newcastle United";
wiki["Bruno Guimarães"].clubCareer = [
  { years: "2015–2017", club: "Audax", apps: 8, goals: 0 },
  { years: "2017–2020", club: "Athletico Paranaense", apps: 112, goals: 7 },
  { years: "2020–2022", club: "Lyon", apps: 71, goals: 3 },
  { years: "2022–", club: "Newcastle United", apps: 148, goals: 14 }
];
wiki["Bruno Guimarães"].nationalCaps = 32;
wiki["Bruno Guimarães"].nationalGoals = 2;

// ========== 9. MATHEUS CUNHA (#9) — currently at Wolves, not Man Utd ==========
setBasic("Matheus Cunha", "1999-05-27", "João Pessoa, Brazil", 1.84, "10", "",
  "Matheus Santos Carneiro da Cunha, known as Matheus Cunha, is a Brazilian professional footballer who plays as a forward for Wolverhampton Wanderers.",
  "Cunha joined Wolves from Atlético Madrid in January 2023."
);
wiki["Matheus Cunha"].currentClub = "Wolverhampton Wanderers";
wiki["Matheus Cunha"].clubCareer = [
  { years: "2017–2019", club: "RB Leipzig", apps: 52, goals: 9 },
  { years: "2019–2021", club: "Hertha BSC", apps: 40, goals: 13 },
  { years: "2021–2023", club: "Atlético Madrid", apps: 54, goals: 7 },
  { years: "2023–", club: "Wolverhampton Wanderers", apps: 110, goals: 34 }
];
wiki["Matheus Cunha"].nationalCaps = 22;
wiki["Matheus Cunha"].nationalGoals = 4;
wiki["Matheus Cunha"].careerReview = "莱比锡青训→柏林赫塔→马竞→狼队。在赫塔的两个德甲赛季首次证明自己（40场13球），马竞阶段因不符合西蒙尼体系而未完全发挥，2023年加盟狼队后彻底爆发——连续两个英超赛季进球上双，是狼队保级和冲击中游的头号射手。身高1.84米、速度快、左右脚均衡，能在锋线所有位置出场。2021年奥运会金牌，2022世界杯有短暂替补出场。2024美洲杯开始进入常规轮换，被视为巴西锋线最可靠的多面手之一。";
wiki["Matheus Cunha"].wcSpotlight = "库尼亚的2026世界杯前景很有想象空间——他不是首发（维尼修斯+拉菲尼亚+内马尔占据前场三个位置），但他可以踢中锋、边锋和影锋的特点让他在16强以后的淘汰赛中价值飙升。狼队的2025-26赛季继续证明他是英超最被低估的攻击手之一。如果内马尔体能透支或者维尼修斯被严密包夹，库尼亚的多面属性将给多里瓦尔提供灵活的战术方案。";

// ========== 10. NEYMAR (#10) ==========
setBasic("Neymar", "1992-02-05", "Mogi das Cruzes, Brazil", 1.75, "10", "",
  "Neymar da Silva Santos Júnior, known as Neymar, is a Brazilian professional footballer who plays as a forward for Santos.",
  "Neymar is Brazil's all-time top scorer with 79 goals, surpassing Pelé's record in 2023."
);
wiki["Neymar"].currentClub = "Santos";
wiki["Neymar"].clubCareer = [
  { years: "2009–2013", club: "Santos", apps: 225, goals: 136 },
  { years: "2013–2017", club: "Barcelona", apps: 186, goals: 105 },
  { years: "2017–2023", club: "Paris Saint-Germain", apps: 173, goals: 118 },
  { years: "2023–2025", club: "Al-Hilal", apps: 7, goals: 1 },
  { years: "2025–", club: "Santos", apps: 32, goals: 12 }
];
wiki["Neymar"].nationalCaps = 128;
wiki["Neymar"].nationalGoals = 79;
wiki["Neymar"].careerReview = "桑托斯→巴萨→巴黎→利雅得新月→桑托斯。巴西足球史上最伟大的球员之一，职业生涯总进球超过450球，欧冠冠军（2015巴萨三冠王核心）、2016奥运金牌、美洲杯冠军。巴西国家队历史射手王（79球），超越贝利的77球纪录。2022世界杯八强——他的最后一次欧冠级别决赛周，加时进球后被扳平的噩梦。膝盖重伤几乎毁掉2023-2024赛季，被利雅得新月解约后重回桑托斯。34岁的内马尔在2026世界杯上已经不是在踢身体足球——他踢的是经验、视野和最后一届世界杯的执念。";
wiki["Neymar"].wcSpotlight = "这是内马尔的最后一届世界杯。34岁，回到桑托斯踢球来保持状态——巴西国内舆论给了他极高的期望但也给了巨大的压力。2014因伤退赛（巴西1-7惨败于德国）、2018对战比利时的孤立无援、2022加时领先又被克罗地亚扳平——这三次未能拿到世界杯的经历塑造了内马尔悲情英雄的形象。2026年是他最后一枪——不是在巴黎那套豪华阵容里，而是在一支更年轻、战术更务实的巴西队里。他将接受比以往任何时候都要少的球权，但他在禁区前15米的灵光一现仍然是巴西最致命的进攻武器。";

// ========== 11. RAPHINHA (#11) ==========
setBasic("Raphinha", "1996-12-14", "Porto Alegre, Brazil", 1.76, "11", "",
  "Raphael Dias Belloli, known as Raphinha, is a Brazilian professional footballer who plays as a winger for Barcelona.",
  "Raphinha joined Barcelona from Leeds United in 2022 for €58 million."
);
wiki["Raphinha"].currentClub = "Barcelona";
wiki["Raphinha"].clubCareer = [
  { years: "2016–2018", club: "Vitória Guimarães B", apps: 16, goals: 5 },
  { years: "2018–2019", club: "Sporting CP", apps: 41, goals: 9 },
  { years: "2019–2020", club: "Rennes", apps: 36, goals: 8 },
  { years: "2020–2022", club: "Leeds United", apps: 67, goals: 17 },
  { years: "2022–", club: "Barcelona", apps: 155, goals: 42 }
];
wiki["Raphinha"].nationalCaps = 28;
wiki["Raphinha"].nationalGoals = 8;
wiki["Raphinha"].careerReview = "巴西草根型球员的典范——阿维河青训→葡萄牙体育→雷恩→利兹联→巴萨。没有南美解放者杯光环，纯靠欧洲联赛一步步打出名堂。2020-22在利兹联成为英超最佳右边锋之一，保级战中独造17球，2022年以5800万欧元加盟巴萨。头两个赛季适应期后，2023-24赛季突然爆发——西甲28球14助拿下金靴、欧冠表现抢眼。左脚内切弧线球+精准传中+极高的防守投入度，符合多里瓦尔的反击和压迫体系。2022世界杯他还没完全融入，2026年已经是巴西队的进攻轴心之一。";
wiki["Raphinha"].wcSpotlight = "拉菲尼亚身上的有趣之处在于：他可能是世界上最好的巴西球员中\"最不像巴西球员\"的那一个——他没有花哨的盘带，但他的传中精准度、反击速度和防守投入度正好是这支巴西队最需要的东西。在维尼修斯在左路单挑、内马尔在中路寻找空间的体系中，拉菲尼亚在右路不需要太多球权就能制造威胁——他的左脚传中找到禁区内的内马尔或库尼亚，可能是巴西在2026世界杯上最高效的非对称进攻模式。";

// ========== 12. WEVERTON (#12) — Palmeiras, not Grêmio ==========
setBasic("Weverton", "1987-12-13", "Rio Branco, Brazil", 1.89, "21", "",
  "Weverton Pereira da Silva, known as Weverton, is a Brazilian professional footballer who plays as a goalkeeper for Palmeiras.",
  "Weverton has won four Brasileirão titles and three Copa Libertadores with Palmeiras."
);
wiki["Weverton"].currentClub = "Palmeiras";
wiki["Weverton"].clubCareer = [
  { years: "2007–2009", club: "Corinthians", apps: 8, goals: 0 },
  { years: "2010–2012", club: "Portuguesa", apps: 82, goals: 0 },
  { years: "2012–2017", club: "Athletico Paranaense", apps: 245, goals: 0 },
  { years: "2018–", club: "Palmeiras", apps: 320, goals: 0 }
];
wiki["Weverton"].nationalCaps = 12;
wiki["Weverton"].nationalGoals = 0;
wiki["Weverton"].careerReview = "科里蒂巴→巴拉纳竞技→帕尔梅拉斯。在帕尔梅拉斯的7年是俱乐部历史上最成功的门将之一——4座巴甲、3座解放者杯。2020-21赛季解放者杯决赛点球扑出桑托斯关键点球，为帕尔梅拉斯卫冕冠军立下汗马功劳。巴西国家队第三门将，2016奥运金牌阵容成员（未出场）。38岁仍保持极佳状态，是巴西门将位置的经验保障。反应速度和一vs一能力强，扑救距离覆盖宽阔。";
wiki["Weverton"].wcSpotlight = "韦弗顿在2026世界杯的角色纯粹是保险——阿利松和埃德森在他前面，他几乎不可能获得首发。但他的存在对更衣室至关重要——他是巴西队中为数不多经历过2016奥运夺冠、2018世界杯和2022世界杯三次大赛的老将。如果巴西进入点球大战且阿利松和埃德森先后伤退（极端情况），韦弗顿的心理素质和大赛经验远超他的第三门将身份。";

// ========== 13. DANILO LUIZ (#13) — Flamengo, had empty bios ==========
setBasic("Danilo Luiz", "1991-07-15", "Bicas, Brazil", 1.84, "13", "",
  "Danilo Luiz da Silva, known as Danilo, is a Brazilian professional footballer who plays as a right-back for Flamengo.",
  "Danilo previously played for Real Madrid, Manchester City, and Juventus."
);
wiki["Danilo Luiz"].currentClub = "Flamengo";
wiki["Danilo Luiz"].clubCareer = [
  { years: "2009–2010", club: "América-MG", apps: 45, goals: 6 },
  { years: "2010–2011", club: "Santos", apps: 60, goals: 9 },
  { years: "2012–2015", club: "Porto", apps: 136, goals: 11 },
  { years: "2015–2017", club: "Real Madrid", apps: 56, goals: 3 },
  { years: "2017–2019", club: "Manchester City", apps: 60, goals: 4 },
  { years: "2019–2025", club: "Juventus", apps: 207, goals: 9 },
  { years: "2025–", club: "Flamengo", apps: 20, goals: 2 }
];
wiki["Danilo Luiz"].nationalCaps = 65;
wiki["Danilo Luiz"].nationalGoals = 2;
wiki["Danilo Luiz"].careerReview = "阿美利加MG→桑托斯→波尔图→皇马→曼城→尤文→弗拉门戈。纵观他的履历，他是足坛少有的\"冠军收割机\"——皇马两座欧冠、曼城两座英超、尤文五座意甲冠军、波尔图两座葡超，还有解放者杯（桑托斯2011）。左右边卫都能踢，战术纪律性极强，速度不突出但阅读比赛能力和防守专注度弥补了缺点。2022世界杯是巴西队长，但因伤在八强战前退出。2025年为了保持世界杯状态转投弗拉门戈——这将是他的第三届世界杯。";
wiki["Danilo Luiz"].wcSpotlight = "达尼洛是本届巴西队的精神领袖之一。他的俱乐部荣誉清单长到足以让任何球员羡慕，但他缺少一个世界杯——这是他和内马尔共同的最深执念。2025年从尤文图斯转投弗拉门戈不是衰退的信号，而是他为了保持2026世界杯状态而做出的主动取舍。在右后卫位置上他与年轻的丹尼洛·桑托斯形成双保险——他可能不会是每场首发，但淘汰赛最后时刻如果需要稳固防守，换他上场是教科书级别的战术换人。";

// ========== 14. BREMER (#14) ==========
setBasic("Bremer", "1997-03-18", "Itapitanga, Brazil", 1.88, "3", "",
  "Gleison Bremer Silva Nascimento, known as Bremer, is a Brazilian professional footballer who plays as a centre-back for Juventus.",
  "Bremer was named Serie A Defender of the Year in 2022 while at Torino."
);
wiki["Bremer"].currentClub = "Juventus";
wiki["Bremer"].clubCareer = [
  { years: "2015–2017", club: "São Paulo", apps: 35, goals: 1 },
  { years: "2017–2018", club: "→ Atlético Mineiro (loan)", apps: 27, goals: 1 },
  { years: "2018–2022", club: "Torino", apps: 110, goals: 11 },
  { years: "2022–", club: "Juventus", apps: 112, goals: 8 }
];
wiki["Bremer"].nationalCaps = 9;
wiki["Bremer"].nationalGoals = 1;

// ========== 15. LÉO PEREIRA (#15) ==========
setBasic("Léo Pereira", "1996-01-31", "Curitiba, Brazil", 1.86, "4", "",
  "Leonardo Pereira, known as Léo Pereira, is a Brazilian professional footballer who plays as a centre-back for Flamengo.",
  "Léo Pereira won two Copa Libertadores titles with Flamengo."
);
wiki["Léo Pereira"].currentClub = "Flamengo";
wiki["Léo Pereira"].clubCareer = [
  { years: "2015–2019", club: "Athletico Paranaense", apps: 120, goals: 5 },
  { years: "2020–", club: "Flamengo", apps: 180, goals: 10 }
];
wiki["Léo Pereira"].nationalCaps = 3;
wiki["Léo Pereira"].nationalGoals = 0;

// ========== 16. DOUGLAS SANTOS (#16) ==========
setBasic("Douglas Santos", "1994-03-22", "João Pessoa, Brazil", 1.76, "3", "",
  "Douglas dos Santos Justino de Melo, known as Douglas Santos, is a Brazilian professional footballer who plays as a left-back for Zenit Saint Petersburg.",
  "Douglas Santos joined Zenit from Hamburger SV in 2019."
);
wiki["Douglas Santos"].currentClub = "Zenit Saint Petersburg";
wiki["Douglas Santos"].clubCareer = [
  { years: "2012–2013", club: "Náutico", apps: 40, goals: 2 },
  { years: "2013–2014", club: "Granada", apps: 1, goals: 0 },
  { years: "2013–2014", club: "→ Udinese (loan)", apps: 3, goals: 0 },
  { years: "2014–2015", club: "Udinese", apps: 0, goals: 0 },
  { years: "2014–2016", club: "→ Atlético Mineiro (loan)", apps: 89, goals: 2 },
  { years: "2016–2019", club: "Hamburger SV", apps: 88, goals: 3 },
  { years: "2019–", club: "Zenit Saint Petersburg", apps: 200, goals: 7 }
];
wiki["Douglas Santos"].nationalCaps = 1;
wiki["Douglas Santos"].nationalGoals = 0;

// ========== 17. FABINHO (#17) ==========
setBasic("Fabinho", "1993-10-23", "Campinas, Brazil", 1.88, "3", "",
  "Fábio Henrique Tavares, known as Fabinho, is a Brazilian professional footballer who plays as a defensive midfielder for Al-Ittihad.",
  "Fabinho was a key member of Liverpool's Champions League and Premier League-winning teams."
);
wiki["Fabinho"].currentClub = "Al-Ittihad";
wiki["Fabinho"].clubCareer = [
  { years: "2012", club: "Fluminense", apps: 2, goals: 0 },
  { years: "2012–2013", club: "→ Real Madrid B (loan)", apps: 30, goals: 2 },
  { years: "2013", club: "→ Real Madrid (loan)", apps: 1, goals: 0 },
  { years: "2013–2015", club: "→ Monaco (loan)", apps: 68, goals: 1 },
  { years: "2015–2018", club: "Monaco", apps: 165, goals: 28 },
  { years: "2018–2023", club: "Liverpool", apps: 219, goals: 11 },
  { years: "2023–", club: "Al-Ittihad", apps: 55, goals: 4 }
];
wiki["Fabinho"].nationalCaps = 31;
wiki["Fabinho"].nationalGoals = 0;

// ========== 18. DANILO SANTOS (#18) — Nottingham Forest ==========
setBasic("Danilo Santos", "2001-04-20", "Salvador, Brazil", 1.78, "28", "",
  "Danilo dos Santos de Oliveira, known as Danilo, is a Brazilian professional footballer who plays as a central midfielder for Nottingham Forest.",
  "Danilo joined Nottingham Forest from Palmeiras in January 2023."
);
wiki["Danilo Santos"].currentClub = "Nottingham Forest";
wiki["Danilo Santos"].clubCareer = [
  { years: "2018–2023", club: "Palmeiras", apps: 132, goals: 12 },
  { years: "2023–", club: "Nottingham Forest", apps: 82, goals: 8 }
];
wiki["Danilo Santos"].nationalCaps = 2;
wiki["Danilo Santos"].nationalGoals = 0;
wiki["Danilo Santos"].careerReview = "帕尔梅拉斯青训的又一颗明珠（与恩德里克同门），2023年以2000万英镑加盟诺丁汉森林。英超三年站稳主力，是森林中场覆盖面积最大的球员——场均跑动11公里以上，兼具拦截和向前出球的双重职责。在帕尔梅拉斯拿下两座解放者杯，2021世俱杯决赛对切尔西是他职业生涯首个国际大赛舞台。2025年首次被征召入巴西国家队——他在英超三年对吉马良斯和帕奎塔的熟悉将有助于他快速融入中场轮换。";
wiki["Danilo Santos"].wcSpotlight = "丹尼洛·桑托斯是巴西中场中最年轻、上限最不确定但最令人兴奋的选项之一。森林的2025-26赛季继续稳定在英超中游，丹尼洛是其中的关键球员。他和吉马良斯在英超的长期对抗让他具备了应对任何欧洲顶级强度的身体条件——这是巴西队传统上在中场最有隐患的环节。如果他在小组赛有首发机会，对欧洲对手（如葡萄牙或英格兰）的出球压力是他证明自己的最佳舞台。";

// ========== 19. ENDRICK (#19) — Real Madrid, not Lyon ==========
setBasic("Endrick", "2006-07-21", "Taguatinga, Brazil", 1.73, "16", "",
  "Endrick Felipe Moreira de Sousa, known as Endrick, is a Brazilian professional footballer who plays as a forward for Real Madrid.",
  "Endrick joined Real Madrid from Palmeiras in July 2024 for €60 million."
);
wiki["Endrick"].currentClub = "Real Madrid";
wiki["Endrick"].clubCareer = [
  { years: "2022–2024", club: "Palmeiras", apps: 60, goals: 18 },
  { years: "2024–", club: "Real Madrid", apps: 45, goals: 12 }
];
wiki["Endrick"].nationalCaps = 12;
wiki["Endrick"].nationalGoals = 4;
wiki["Endrick"].careerReview = "帕尔梅拉斯青训，2022年16岁进入巴甲，立即展现出超过同龄人的冷静和射门力量。2022年即以6000万欧元被皇马提前签下（17岁前不能转会），2024年7月年满18岁后正式报到。皇马处子赛季各项赛事出场30次打入10球——对于一个18岁的欧洲菜鸟已属惊艳。身高仅1.73米但爆发力极强——第一步起速能甩开大部分中卫。2024年巴西国家队首秀即进球。2026年他将以19岁的年龄参加世界杯——比贝利和罗纳尔多都早。";
wiki["Endrick"].wcSpotlight = "恩德里克是巴西的\"罗纳尔多2.0\"幻想——巴西媒体几乎把所有18岁天才都这样称呼，但恩德里克确实比他的前辈们拥有更特别的硬件条件：170CM的低重心+爆发力+禁区内的射门嗅觉。他在皇马2024-25赛季的进球效率远超同龄人的任何先例（包括维尼修斯同期的数据）。多里瓦尔很可能让他以奇兵身份登场——他不是首发，但他以替补出场的15-20分钟来冲击已经疲惫的对手防线是最恐怖的使用方式。如果巴西打到半决赛后他还没有爆发，那才是新闻。";

// ========== 20. LUCAS PAQUETÁ (#20) — West Ham, not Flamengo ==========
setBasic("Lucas Paquetá", "1997-08-27", "Rio de Janeiro, Brazil", 1.80, "10", "",
  "Lucas Tolentino Coelho de Lima, known as Lucas Paquetá, is a Brazilian professional footballer who plays as an attacking midfielder for West Ham United.",
  "Paquetá joined West Ham from Lyon in 2022 for a club-record £51 million."
);
wiki["Lucas Paquetá"].currentClub = "West Ham United";
wiki["Lucas Paquetá"].clubCareer = [
  { years: "2016–2019", club: "Flamengo", apps: 100, goals: 21 },
  { years: "2019–2020", club: "AC Milan", apps: 44, goals: 1 },
  { years: "2020–2022", club: "Lyon", apps: 80, goals: 21 },
  { years: "2022–", club: "West Ham United", apps: 122, goals: 18 }
];
wiki["Lucas Paquetá"].nationalCaps = 48;
wiki["Lucas Paquetá"].nationalGoals = 11;
wiki["Lucas Paquetá"].careerReview = "弗拉门戈青训→AC米兰（失败）→里昂（重生）→西汉姆联（巅峰）。2019年以3500万欧元加盟米兰，在意甲几乎完全迷失，2020年加盟里昂后重新证明了自己——21球80场的数据让他成为里昂进攻核心。2022年西汉姆联以5100万英镑签下他，四个赛季他在英超确立了自己作为联赛最佳攻击型中场之一的地位。技术特点：控球在脚时极其难抢，创造空间的能力出众，传球视野顶级，防守端投入度是新加入的技能。2022世界杯巴西八强战对克罗地亚他是全场表现最好的巴西球员直到加时赛被换下——他可能永远不会原谅蒂特。";
wiki["Lucas Paquetá"].wcSpotlight = "帕奎塔是2026巴西队最关键但又最容易被忽视的球员——他的角色类似于阿根廷的德保罗：不是最耀眼的名字，但球队攻守转换的流畅度完全依赖于他的跑动和传球选择。他在西汉姆联的2025-26赛季继续在英超提供稳定的创造力输出。但是——他身上有一个巨大的不确定性：英格兰足总对他涉嫌参与赌球的调查。如果他最终被禁赛，巴西队将失去在中场最不可替代的拼图。假设他能够参赛，他对欧洲对手的理解和对比赛节奏的把控将是蒂特的战术体系的基石。";

// ========== 21. LUIZ HENRIQUE (#21) — Botafogo, not Zenit ==========
setBasic("Luiz Henrique", "2001-01-02", "Petrópolis, Brazil", 1.82, "7", "",
  "Luiz Henrique André Rosa da Silva, known as Luiz Henrique, is a Brazilian professional footballer who plays as a winger for Botafogo.",
  "Luiz Henrique returned to Brazil to join Botafogo after a spell at Real Betis."
);
wiki["Luiz Henrique"].currentClub = "Botafogo";
wiki["Luiz Henrique"].clubCareer = [
  { years: "2019–2022", club: "Fluminense", apps: 106, goals: 18 },
  { years: "2022–2024", club: "Real Betis", apps: 64, goals: 6 },
  { years: "2024–", club: "Botafogo", apps: 55, goals: 14 }
];
wiki["Luiz Henrique"].nationalCaps = 4;
wiki["Luiz Henrique"].nationalGoals = 0;
wiki["Luiz Henrique"].careerReview = "弗鲁米嫩塞青训→皇家贝蒂斯→博塔福戈。2022年以1300万欧元加盟贝蒂斯，西甲两年虽然出场稳定但进球效率偏低（64场6球）。2024年重返巴甲加盟博塔福戈后实现突破——回归巴甲的赛季打入14球，成为博塔福戈的进攻核心。左脚右边锋，内切射门是他的招牌动作，速度不错但不是顶级，更依赖技术和位置感创造机会。2025年首次被多里瓦尔征召入国家队——巴甲的表现给他赢得了世界杯大名单的一席之地。";
wiki["Luiz Henrique"].wcSpotlight = "路易斯·恩里克是巴西边锋深度的一个有趣注脚——他在博塔福戈的爆发让多里瓦尔在面对密集赛程时有更多前场选择。他不是首发级别的球员（维尼修斯、拉菲尼亚、马丁内利都在他前面），但他作为第5-6边锋入选的价值在于他能提供与其他人都不同的内切左脚线路。如果巴西在小组赛提前出线，他大概率会在第三场获得机会——这种比赛对多里瓦尔评估替补深度非常重要。";

// ========== 22. GABRIEL MARTINELLI (#22) ==========
setBasic("Gabriel Martinelli", "2001-06-18", "Guarulhos, Brazil", 1.78, "11", "",
  "Gabriel Teodoro Martinelli Silva, known as Gabriel Martinelli, is a Brazilian professional footballer who plays as a winger for Arsenal.",
  "Martinelli joined Arsenal from Ituano in 2019 for £6 million."
);
wiki["Gabriel Martinelli"].currentClub = "Arsenal";
wiki["Gabriel Martinelli"].clubCareer = [
  { years: "2018–2019", club: "Ituano", apps: 34, goals: 10 },
  { years: "2019–", club: "Arsenal", apps: 225, goals: 52 }
];
wiki["Gabriel Martinelli"].nationalCaps = 18;
wiki["Gabriel Martinelli"].nationalGoals = 2;

// ========== 23. EDERSON MORAES (#23) — Man City GK, not Fenerbahçe ==========
setBasic("Ederson Moraes", "1993-08-17", "Osasco, Brazil", 1.88, "31", "",
  "Ederson Santana de Moraes, known as Ederson, is a Brazilian professional footballer who plays as a goalkeeper for Manchester City.",
  "Ederson has won six Premier League titles and one Champions League with Manchester City."
);
wiki["Ederson Moraes"].currentClub = "Manchester City";
wiki["Ederson Moraes"].clubCareer = [
  { years: "2011–2012", club: "Ribeirão", apps: 30, goals: 0 },
  { years: "2012–2015", club: "Rio Ave", apps: 44, goals: 0 },
  { years: "2012–2014", club: "→ Benfica B (loan)", apps: 35, goals: 0 },
  { years: "2015–2017", club: "Benfica", apps: 58, goals: 0 },
  { years: "2017–", club: "Manchester City", apps: 320, goals: 0 }
];
wiki["Ederson Moraes"].nationalCaps = 28;
wiki["Ederson Moraes"].nationalGoals = 0;
wiki["Ederson Moraes"].careerReview = "本菲卡青训→曼城。2017年瓜迪奥拉以4000万欧元把他带到伊蒂哈德——这是世界足坛对门将脚下技术的第一次系统性投资。在曼城的8年他证明了自己是世界上最好的传球型门将——超远距离长传准确率超过60%、对压迫从容出球。6座英超冠军+1座欧冠+1座世俱杯，荣誉上已超越巴西历史上任何门将。2018和2022世界杯都是替补（阿利松先发）——这是巴西门将历史上最奢侈的\"双重保险\"。他的弱点是扑救反应有时不如传统门将犀利，但曼城的体系掩盖了这个缺陷。";
wiki["Ederson Moraes"].wcSpotlight = "埃德森在2026世界杯的角色是完美的二号门将——只有当阿利松出现伤病或状态危机时他才会首发。他的脚下技术特点在特定场景下（如对手高位压迫巴西后场出球时）可能让多里瓦尔考虑特殊战术部署，但常规情况下阿利松的首发位罝是牢固的。有趣的是：埃德森职业生涯从未在关键国际比赛中首发证明过自己——他最好的世界杯表现是2022年的零分钟出场——这让他的国家队履历和俱乐部履历形成了巨大的反差。";

// ========== 24. ROGER IBAÑEZ (#24) ==========
setBasic("Roger Ibañez", "1998-11-23", "Canela, Brazil", 1.85, "3", "",
  "Roger Ibañez da Silva, known as Roger Ibañez, is a Brazilian professional footballer who plays as a centre-back for Al-Ahli.",
  "Ibañez previously played for Roma and Atalanta in Serie A."
);
wiki["Roger Ibañez"].currentClub = "Al-Ahli";
wiki["Roger Ibañez"].clubCareer = [
  { years: "2017", club: "→ Sergipe (loan)", apps: 4, goals: 0 },
  { years: "2017–2018", club: "→ Fluminense (loan)", apps: 16, goals: 0 },
  { years: "2018–2019", club: "Fluminense", apps: 32, goals: 2 },
  { years: "2019–2021", club: "→ Roma (loan)", apps: 49, goals: 1 },
  { years: "2021–2023", club: "Roma", apps: 100, goals: 6 },
  { years: "2023–", club: "Al-Ahli", apps: 60, goals: 4 }
];
wiki["Roger Ibañez"].nationalCaps = 3;
wiki["Roger Ibañez"].nationalGoals = 0;

// ========== 25. IGOR THIAGO (#25) — Brentford, not 伯恩茅斯 ==========
setBasic("Igor Thiago", "2001-06-26", "Rio de Janeiro, Brazil", 1.88, "9", "",
  "Igor Thiago Nascimento Rodrigues, known as Igor Thiago, is a Brazilian professional footballer who plays as a forward for Brentford.",
  "Igor Thiago joined Brentford from Club Brugge in 2024."
);
wiki["Igor Thiago"].currentClub = "Brentford";
wiki["Igor Thiago"].clubCareer = [
  { years: "2021–2023", club: "Ludogorets Razgrad", apps: 55, goals: 24 },
  { years: "2023–2024", club: "Club Brugge", apps: 45, goals: 30 },
  { years: "2024–", club: "Brentford", apps: 62, goals: 22 }
];
wiki["Igor Thiago"].nationalCaps = 1;
wiki["Igor Thiago"].nationalGoals = 0;
wiki["Igor Thiago"].careerReview = "卢多戈雷茨→布鲁日→布伦特福德。保加利亚到比利时到英超的\"三级跳\"——在卢多戈雷茨拿下保超冠军（24球），在布鲁日进一步爆发（30球），2024年布伦特福德以3000万英镑签下他替代伊万·托尼。英超两个赛季稳定贡献20+进球，成为布伦特福德攻防体系中最关键的那个点。1.88米的体格中锋，禁区内对抗和头球是他的核心武器，射门转化率极高。2025年首次被巴西国家队征召——布伦特福德的曝光度远低于豪门，但他的进球数据是多里瓦尔无法忽视的。";
wiki["Igor Thiago"].wcSpotlight = "伊戈尔·蒂亚戈是巴西锋线最被低估的选择——他的身高（1.88米）和头球能力恰好弥补了巴西中锋位置上的体格不足（库尼亚1.84米，恩德里克仅1.73米）。他不是日常首发的选择，但如果巴西在淘汰赛需要打高空轰炸（比如落后时最后10分钟的绝望搏命时刻），蒂亚戈的身体条件会让任何防线感到不适——这是一种纯粹的战术型选人。";

// ========== 26. RAYAN (#26) — Vasco da Gama, correct ==========
setBasic("Rayan", "2006-08-21", "Duque de Caxias, Brazil", 1.84, "99", "",
  "Rayan Vitor Simplício Rocha, known as Rayan, is a Brazilian professional footballer who plays as a forward for Vasco da Gama.",
  "Rayan is a youth product of Vasco da Gama's academy."
);
wiki["Rayan"].currentClub = "Vasco da Gama";
wiki["Rayan"].clubCareer = [
  { years: "2023–", club: "Vasco da Gama", apps: 40, goals: 10 }
];
wiki["Rayan"].nationalCaps = 0;
wiki["Rayan"].nationalGoals = 0;
wiki["Rayan"].careerReview = "瓦斯科达伽马青训出品，2023年17岁完成巴甲首秀，2024赛季成为球队主力前锋——40场10球的巴甲数据已经是巴西同龄前锋中最出色的。身高1.84米、身体还在发育中的柱式中锋胚子，禁区内的拿球和射门果断程度在同龄人中很突出。他代表了多里瓦尔选人的一种策略——带一个\"未来的核心\"去见见世面，1994年巴西带17岁的罗纳尔多去美国世界杯也是一样的逻辑。";
wiki["Rayan"].wcSpotlight = "拉扬入选26人大名单本身就是一个信号——多里瓦尔在为2030世界杯做准备。18岁参加世界杯，这个年龄在巴西足球史上只有贝利和罗纳尔多做到过。他在2026年不会有太多出场时间，但在训练中对位马尔基尼奥斯和布雷默的体验对他成长的加速效果是无价的。他代表着巴西足球的未来——同时也可能在小组赛已经确定出线的情况下获得15分钟的世界杯首秀。";

// ========== SAVE ==========
fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Brazil: all 26 players fixed with clubCareer, birthDate, height, and corrected bios.');
