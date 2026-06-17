// Netherlands squad - 26 players
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

function P(name, birthDate, birthPlace, height, pos, club, clubNum, caps, goals, career, cr, ws) {
  wiki[name] = {
    number: "", fullName: name, birthDate, birthPlace, height, position: pos,
    currentClub: club, clubNumber: clubNum || "", image: "",
    extractPreview: "", introPreview: "",
    nationalCaps: caps, nationalGoals: goals,
    clubCareer: career,
    careerReview: cr || "",
    wcSpotlight: ws || ""
  };
}

P("Bart Verbruggen","2002-08-18","Breda, Netherlands",1.93,"GK","Brighton & Hove Albion","1",22,0,
  [{years:"2020-2023",club:"Anderlecht",apps:24,goals:0},{years:"2023-",club:"Brighton & Hove Albion",apps:90,goals:0}],
  "安德莱赫特→布莱顿。23岁已成为荷兰主力门将——2024欧洲杯首发。1.93米体格+出色脚下技术——理想的现代门将模型。2022世界杯有出场。",
  "韦尔布鲁根23岁——极年轻的门将已在荷兰站稳主力。在布莱顿的波斯特科格鲁式后场出球体系中成长——完全匹配科曼的出球要求。");

P("Lutsharel Geertruida","2000-07-18","Rotterdam, Netherlands",1.84,"DF","Sunderland","2",15,0,
  [{years:"2017-2024",club:"Feyenoord",apps:180,goals:17},{years:"2024-",club:"Sunderland",apps:45,goals:4}],
  "费耶诺德青训→桑德兰。斯洛特时代费耶诺德的主力右中卫/右后卫——2022-23荷甲冠军核心。2024年转会英超桑德兰。");

P("Marten de Roon","1991-03-29","Zwijndrecht, Netherlands",1.85,"MF","Atalanta","3",63,1,
  [{years:"2012-2016",club:"Heerenveen",apps:94,goals:5},{years:"2016-2017",club:"Middlesbrough",apps:36,goals:4},{years:"2017-",club:"Atalanta",apps:310,goals:17}],
  "海伦芬→米堡→亚特兰大。在亚特兰大9年见证了球队从意甲保级到欧联杯冠军的奇迹。防守覆盖和拼抢硬朗、阅读比赛高明。35岁——可能是最后一届世界杯。");

P("Virgil van Dijk","1991-07-08","Breda, Netherlands",1.95,"GK","Liverpool","4",86,7,
  [{years:"2011-2013",club:"Groningen",apps:66,goals:7},{years:"2013-2015",club:"Celtic",apps:115,goals:15},{years:"2015-2018",club:"Southampton",apps:80,goals:7},{years:"2018-",club:"Liverpool",apps:300,goals:25}],
  "格罗宁根→凯尔特人→南安普顿→利物浦。克洛普称他为 '世界最佳中卫'。1座欧冠+1座英超——以7500万镑加盟利物浦改变了欧洲足球的权力平衡。荷兰队长——86场国家队7球。",
  "范戴克34岁——绝对巅峰的尾巴。这是他的第二届世界杯——2022年八强止步。他的空中统治力、领导力和长传仍然世界级。如果荷兰想走远，范戴克必须是金球奖级别的表现。");

P("Nathan Aké","1995-02-18","The Hague, Netherlands",1.80,"DF","Manchester City","5",61,5,
  [{years:"2012-2017",club:"Chelsea/Academy→Bournemouth→Watford",apps:65,goals:3},{years:"2017-2020",club:"Bournemouth",apps:121,goals:11},{years:"2020-",club:"Manchester City",apps:150,goals:6}],
  "切尔西青训→伯恩茅斯→曼城。左脚中卫——瓜迪奥拉体系中不可替代的多面手。1.80米不算高但位置感和预判顶级。");

P("Jan Paul van Hecke","2000-06-08","Arnemuiden, Netherlands",1.90,"DF","Brighton & Hove Albion","6",6,0,
  [{years:"2018-2020",club:"NAC Breda",apps:31,goals:3},{years:"2020-2025",club:"Brighton & Hove Albion",apps:60,goals:1},{years:"2021-2022",club:"→ Blackburn Rovers (loan)",apps:31,goals:1}],
  "布雷达→布莱顿。在布莱顿体系下磨练右边中卫——逐渐成长为可靠英超后卫。2024年首次入选国家队。");

P("Justin Kluivert","1999-05-05","Zaandam, Netherlands",1.72,"FW","Bournemouth","7",8,1,
  [{years:"2016-2018",club:"Ajax",apps:56,goals:14},{years:"2018-2023",club:"Roma",apps:68,goals:9},{years:"2020-2021",club:"→ RB Leipzig (loan)",apps:27,goals:4},{years:"2021-2022",club:"→ Nice (loan)",apps:31,goals:6},{years:"2022-2023",club:"→ Valencia (loan)",apps:29,goals:8},{years:"2023-",club:"Bournemouth",apps:80,goals:22}],
  "帕特里克·克鲁伊维特的儿子。阿贾克斯→罗马→伯恩茅斯。租借生涯曲折后在伯恩茅斯找到自己——右侧的盘带和射门能力在英超终于稳定爆发。");

P("Ryan Gravenberch","2002-05-16","Amsterdam, Netherlands",1.90,"MF","Liverpool","8",24,2,
  [{years:"2018-2022",club:"Ajax",apps:103,goals:12},{years:"2022-2023",club:"Bayern Munich",apps:34,goals:1},{years:"2023-2025",club:"→ Liverpool (loan)",apps:38,goals:1},{years:"2025-",club:"Liverpool",apps:40,goals:3}],
  "阿贾克斯→拜仁→利物浦。在拜仁一年未成功，到利物浦在斯洛特手下找到感觉——1.90米B2B中场的身体素质顶配。2022世界杯有出场。");

P("Wout Weghorst","1992-08-07","Borne, Netherlands",1.97,"FW","Ajax","9",64,23,
  [{years:"2014-2016",club:"Heracles Almelo",apps:73,goals:20},{years:"2016-2018",club:"AZ Alkmaar",apps:86,goals:45},{years:"2018-2022",club:"VfL Wolfsburg",apps:144,goals:70},{years:"2022-2025",club:"Burnley",apps:22,goals:2},{years:"2022-2023",club:"→ Besiktas (loan)",apps:18,goals:9},{years:"2023-2024",club:"→ Hoffenheim (loan)",apps:30,goals:8},{years:"2025-",club:"Ajax",apps:35,goals:18}],
  "费耶诺德青年→荷甲→德甲→英超→阿贾克斯。2022世界杯替补出场2球淘汰阿根廷——世界杯历史最戏剧性时刻之一。1.97米高中锋。",
  "韦格霍斯特33岁——荷兰的超级替补大中锋。'Weghorst moment' 已成为荷兰足球的文化现象——他不需要踢80分钟，只需要15分钟在禁区制造混乱。");

P("Memphis Depay","1994-02-13","Moordrecht, Netherlands",1.76,"FW","Corinthians","10",108,50,
  [{years:"2011-2015",club:"PSV Eindhoven",apps:124,goals:50},{years:"2015-2017",club:"Manchester United",apps:53,goals:7},{years:"2017-2021",club:"Lyon",apps:178,goals:76},{years:"2021-2023",club:"Barcelona",apps:42,goals:14},{years:"2023-2025",club:"Atlético Madrid",apps:40,goals:13},{years:"2025-",club:"Corinthians",apps:30,goals:12}],
  "埃因霍温→曼联→里昂→巴萨→马竞→科林蒂安。荷兰历史射手榜第二（50球）——仅次于范佩西的纪录。2025年冒险去巴西联赛保持状态。",
  "孟菲斯31岁，在科林蒂安踢球备战世界杯。108场国家队50球——球队最好的终结者。在南美联赛的高度对抗下保持状态是明智决定。如果他健康，荷兰需要他的进球嗅觉。");

P("Cody Gakpo","1999-05-07","Eindhoven, Netherlands",1.93,"FW","Liverpool","11",42,14,
  [{years:"2016-2022",club:"PSV Eindhoven",apps:159,goals:55},{years:"2022-2023",club:"→ PSV Eindhoven (loan)",apps:5,goals:3},{years:"2023-",club:"Liverpool",apps:120,goals:35}],
  "埃因霍温→利物浦。2022世界杯每场比赛都进球——大赛型前锋。加盟利物浦后从左翼到中锋多点开花。1.93米体格搭配边锋盘带技术。",
  "加克波27岁——完全巅峰。2022世界杯证明他是大赛第一前锋。在利物浦斯洛特体系下继续进化——范戴克到加克波的连线可能是荷兰越过强队的路线。");

P("Mats Wieffer","1999-11-16","Borne, Netherlands",1.88,"MF","Brighton & Hove Albion","12",18,1,
  [{years:"2018-2020",club:"FC Twente",apps:1,goals:0},{years:"2020-2022",club:"Excelsior",apps:80,goals:11},{years:"2022-2024",club:"Feyenoord",apps:79,goals:9},{years:"2024-",club:"Brighton & Hove Albion",apps:55,goals:5}],
  "低调路径——特温特→精英→费耶诺德→布莱顿。在斯洛特的费耶诺德爆发——1.88米防守中场，拦截和反抢高效。");

P("Robin Roefs","2003-01-17","Heesch, Netherlands",1.90,"GK","Sunderland","13",0,0,
  [{years:"2020-2025",club:"NEC Nijmegen",apps:50,goals:0},{years:"2025-",club:"Sunderland",apps:10,goals:0}],
  "奈梅亨青训→桑德兰。年轻门将——在英冠积累经验，2025年首次入选国家队。");

P("Tijjani Reijnders","1998-07-29","Zwolle, Netherlands",1.85,"MF","Manchester City","14",24,3,
  [{years:"2018-2023",club:"AZ Alkmaar",apps:128,goals:14},{years:"2023-2025",club:"AC Milan",apps:80,goals:10},{years:"2025-",club:"Manchester City",apps:30,goals:3}],
  "阿尔克马尔→AC米兰→曼城。在米兰两年成长为意甲最好的B2B中场之一——远射有力、跑动无限。2025年加盟曼城——瓜迪奥拉的中场新核心。");

P("Micky van de Ven","2001-04-19","Wormer, Netherlands",1.93,"DF","Tottenham Hotspur","15",22,1,
  [{years:"2019-2021",club:"FC Volendam",apps:48,goals:2},{years:"2021-2023",club:"VfL Wolfsburg",apps:50,goals:1},{years:"2023-",club:"Tottenham Hotspur",apps:90,goals:5}],
  "福伦丹→沃尔夫斯堡→热刺。1.93米左边卫——可能是世界上最快的高个后卫（英超纪录36.6km/h）。左脚出球能力强——爆发和回追防守让进攻无法反击。");

P("Guus Til","1997-12-22","Samfya, Zambia",1.86,"MF","PSV Eindhoven","16",10,1,
  [{years:"2016-2019",club:"AZ Alkmaar",apps:96,goals:28},{years:"2019-2022",club:"Spartak Moscow",apps:24,goals:2},{years:"2020-2021",club:"→ SC Freiburg (loan)",apps:7,goals:0},{years:"2021-2022",club:"→ Feyenoord (loan)",apps:42,goals:18},{years:"2022-",club:"PSV Eindhoven",apps:110,goals:45}],
  "赞助中场——阿尔克马尔→莫斯科斯巴达→埃因霍温。在埃因霍温不断前插得分，几乎每赛季进球数如中锋。2024欧洲杯有出场。");

P("Noa Lang","1999-06-17","Capelle aan den IJssel, Netherlands",1.79,"FW","Galatasaray","17",15,2,
  [{years:"2018-2021",club:"Ajax→Club Brugge",apps:29,goals:8},{years:"2021-2023",club:"Club Brugge",apps:76,goals:25},{years:"2023-2025",club:"PSV Eindhoven",apps:65,goals:15},{years:"2025-",club:"Galatasaray",apps:25,goals:6}],
  "阿贾克斯青训→布鲁日→埃因霍温→加拉塔萨雷。左翼盘带爱好者——性格张扬外向。2025年转会土耳其，在超级联赛保持状态。");

P("Donyell Malen","1999-01-19","Wieringen, Netherlands",1.76,"FW","Roma","18",43,9,
  [{years:"2017-2021",club:"PSV Eindhoven",apps:116,goals:55},{years:"2021-2025",club:"Borussia Dortmund",apps:110,goals:35},{years:"2025-",club:"Roma",apps:35,goals:8}],
  "埃因霍温→多特蒙德→罗马。在多特蒙德四个赛季35球——速度和射门是核心武器。2025年加盟罗马在意甲进一步成长。43场国家队9球效率不错。");

P("Brian Brobbey","2002-02-01","Amsterdam, Netherlands",1.80,"FW","Sunderland","19",8,0,
  [{years:"2018-2021",club:"Ajax→RB Leipzig",apps:42,goals:12},{years:"2022-",club:"Ajax",apps:80,goals:32},{years:"2025-",club:"Sunderland",apps:30,goals:10}],
  "阿贾克斯青训——爆发力极强的前锋，但早年发展不如预期顺利。2025年转战英冠桑德兰重新出发。");

P("Teun Koopmeiners","1998-02-28","Castricum, Netherlands",1.83,"MF","Juventus","20",32,3,
  [{years:"2017-2021",club:"AZ Alkmaar",apps:154,goals:43},{years:"2021-2024",club:"Atalanta",apps:129,goals:29},{years:"2024-",club:"Juventus",apps:60,goals:12}],
  "阿尔克马尔→亚特兰大→尤文。中后卫出身改造为攻击型中场——左脚传球精准、任意球和远射是核心武器。在尤文继续稳定输出。2022世界杯有出场。");

P("Frenkie de Jong","1997-05-12","Arkel, Netherlands",1.80,"MF","Barcelona","21",65,3,
  [{years:"2015-2019",club:"Ajax",apps:89,goals:5},{years:"2016-2017",club:"→ Willem II (loan)",apps:1,goals:0},{years:"2019-",club:"Barcelona",apps:220,goals:16}],
  "阿贾克斯→巴萨。2019年以7500万欧加盟巴萨——至今仍是世界最独特的控球中场。标志性后场带球推进——无法被抢断的时代级控球能力。2022世界杯和2024欧洲杯绝对主力。",
  "弗伦基28岁——完全巅峰。他的控球推进对荷兰打破密集防守至关重要。健康问题是最大敌人——如果他能踢满7场，荷兰的控球质量几乎无法被压迫限制。");

P("Denzel Dumfries","1996-04-18","Rotterdam, Netherlands",1.89,"DF","Inter Milan","22",70,8,
  [{years:"2014-2017",club:"Sparta Rotterdam",apps:67,goals:2},{years:"2017-2018",club:"Heerenveen",apps:37,goals:4},{years:"2018-2021",club:"PSV Eindhoven",apps:124,goals:19},{years:"2021-",club:"Inter Milan",apps:190,goals:18}],
  "鹿特丹斯巴达→海伦芬→埃因霍温→国米。2022世界杯3球——进攻型右后卫的极端例子。在国米五年190场——成熟的意大利防守+荷兰的进攻本能结合。",
  "邓弗里斯29岁——巅峰期。攻击型右后卫在世界杯淘汰赛是重要的不对称武器——他对位任何左边卫都可能产生身体上的明显优势。");

P("Mark Flekken","1993-06-13","Kerkrade, Netherlands",1.95,"GK","Bayer Leverkusen","23",9,0,
  [{years:"2010-2013",club:"Alemannia Aachen/Alsdorf",apps:15,goals:0},{years:"2013-2016",club:"Greuther Fürth",apps:3,goals:0},{years:"2016-2018",club:"MSV Duisburg",apps:72,goals:0},{years:"2018-2023",club:"SC Freiburg",apps:96,goals:0},{years:"2023-2025",club:"Brentford",apps:60,goals:0},{years:"2025-",club:"Bayer Leverkusen",apps:25,goals:0}],
  "德国低级别→弗赖堡→布伦特福德→勒沃库森。永远被低估的荷兰第二门将——德甲和英超都证明稳定。");

P("Crysencio Summerville","2001-10-30","Rotterdam, Netherlands",1.74,"FW","West Ham United","24",5,1,
  [{years:"2018-2020",club:"Feyenoord→ADO Den Haag",apps:24,goals:2},{years:"2020-2023",club:"Leeds United",apps:89,goals:18},{years:"2024-2025",club:"→ Leeds United (loan)",apps:2,goals:0},{years:"2025-",club:"West Ham United",apps:35,goals:8}],
  "费耶诺德→利兹联→西汉姆。在利兹联英冠赛季爆发——右翼速度+射门。2025年转会西汉姆后首次入选国家队。");

P("Jorrel Hato","2006-03-07","Rotterdam, Netherlands",1.84,"DF","Chelsea","25",5,0,
  [{years:"2022-2025",club:"Ajax",apps:60,goals:2},{years:"2025-",club:"Chelsea",apps:25,goals:1}],
  "阿贾克斯青训的宝石——17岁一线队首秀立即成为防线领袖。全能左脚后卫——中卫和左边卫都能踢。2025年天价转会切尔西。19岁已是国家队成员。");

P("Quinten Timber","2001-06-17","Utrecht, Netherlands",1.79,"MF","Marseille","26",6,0,
  [{years:"2019-2021",club:"Jong Ajax→FC Utrecht",apps:31,goals:2},{years:"2022-2024",club:"Feyenoord",apps:79,goals:14},{years:"2024-",club:"Marseille",apps:55,goals:8}],
  "尤里恩·廷贝尔的双胞胎兄弟。阿贾克斯青训→费耶诺德→马赛。在法甲站稳中场核心——传球和跑动覆盖能力强。");

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Netherlands: 26 players added.');
