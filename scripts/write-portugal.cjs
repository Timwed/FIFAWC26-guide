// Portugal squad - 26 players
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

P("Diogo Costa","1999-09-19","Rothrist, Switzerland",1.86,"GK","Porto","1",43,0,
  [{years:"2017-",club:"Porto",apps:180,goals:0}],
  "波尔图青训——世界最被低估的顶级门将。2022世界杯葡萄牙主力，2024欧洲杯点球大战连续扑出三个点球（创欧洲杯纪录）——扑点能力堪称世界最顶尖。",
  "科斯塔26岁——门将黄金年龄。2024欧洲杯的点球英雄进入2026世界杯。如果葡萄牙在淘汰赛进入点球大战——他是他们最可靠的武器。");

P("Nélson Semedo","1993-11-16","Lisbon, Portugal",1.79,"DF","Fenerbahçe","2",50,0,
  [{years:"2017-2020",club:"Barcelona",apps:124,goals:2},{years:"2020-2025",club:"Wolverhampton Wanderers",apps:180,goals:1},{years:"2025-",club:"Fenerbahçe",apps:30,goals:0}],
  "本菲卡青训→巴萨→狼队→费内巴切。在狼队五年是英超最稳定的右后卫之一。2025年转会费内巴切为葡萄牙国家队保持出场。");

P("Rúben Dias","1997-05-14","Amadora, Portugal",1.87,"DF","Manchester City","3",76,3,
  [{years:"2017-2020",club:"Benfica",apps:91,goals:9},{years:"2020-",club:"Manchester City",apps:210,goals:6}],
  "本菲卡→曼城。2020年以6800万欧元加盟曼城立即成为世界最佳中卫之一。5座英超+1座欧冠——瓜迪奥拉防线最不可替代的球员。葡萄牙队长，侵略性+空中优势+出球=完整现代中卫。",
  "迪亚斯29岁——绝对巅峰。葡萄牙对他的依赖甚至超过俱乐部。面对姆巴佩或凯恩级别攻击手时必须拿出曼城最出色的状态。");

P("Tomás Araújo","2002-05-16","Vila Nova de Famalicão, Portugal",1.88,"DF","Benfica","4",5,0,
  [{years:"2020-",club:"Benfica",apps:60,goals:2}],
  "本菲卡青训——高大右脚中卫，在葡超逐步获得主力位置。出球好，身体对抗还在提升中。2024年首次入选国家队。");

P("Diogo Dalot","1999-03-18","Braga, Portugal",1.83,"DF","Manchester United","5",35,3,
  [{years:"2018-2020",club:"Porto",apps:13,goals:0},{years:"2018-",club:"Manchester United",apps:160,goals:10},{years:"2020-2021",club:"→ AC Milan (loan)",apps:33,goals:2}],
  "波尔图青训→曼联。租借米兰后在曼联确立主力，左右边卫皆可。2022世界杯葡萄牙主力。");

P("Matheus Nunes","1998-08-27","Rio de Janeiro, Brazil",1.83,"MF","Manchester City","6",20,2,
  [{years:"2019-2022",club:"Sporting CP",apps:101,goals:8},{years:"2022-",club:"Manchester City",apps:90,goals:5}],
  "巴西出生→葡萄牙公民。2022年以4700万英镑加盟曼城。身体强壮B2B中场——盘带直接性强，跑动覆盖大。");

P("Cristiano Ronaldo","1985-02-05","Funchal, Madeira, Portugal",1.87,"FW","Al-Nassr","7",228,143,
  [{years:"2002-2003",club:"Sporting CP",apps:31,goals:5},{years:"2003-2009",club:"Manchester United",apps:292,goals:118},{years:"2009-2018",club:"Real Madrid",apps:438,goals:450},{years:"2018-2021",club:"Juventus",apps:134,goals:101},{years:"2021-2022",club:"Manchester United",apps:54,goals:27},{years:"2023-",club:"Al-Nassr",apps:90,goals:82}],
  "GOAT候选人之一。228场国家队出场（世界纪录）、143球（国际足球历史最高）、5座金球奖、5座欧冠。41岁的他在2026年仍然在踢——体育史上最执着的竞争者。",
  "41岁参加第6届世界杯——人类极限的见证。他的身体已跟不上野心，但禁区跑位、头球和点球冷静度仍可用。大概率不是首发——贡萨洛·拉莫斯和费利克斯在他前面——但葡萄牙更衣室有他存在的意义远超战术层面。如果第80分钟仍然落后——他的15分钟替补出场可能是对手最畏惧的画面。这可能是他职业生涯最后一场国际比赛。");

P("Bruno Fernandes","1994-09-08","Maia, Portugal",1.79,"MF","Manchester United","8",89,29,
  [{years:"2017-2020",club:"Sporting CP",apps:83,goals:40},{years:"2020-",club:"Manchester United",apps:260,goals:85}],
  "意大利低起点→葡体爆发→曼联核心。2020年加盟曼联，首半赛季8球7助。传球视野和关键传球世界顶级——葡萄牙第二射手（29球）仅次于C罗。",
  "布鲁诺31岁——可能是和C罗最后一次世界杯同台。葡萄牙进攻从他的脚下发起——贝尔纳多和布鲁诺的双核对密集防守时需极大耐心和创造力。想走进四强——布鲁诺必须交出职业生涯最好的一届大赛。");

P("Gonçalo Ramos","2001-06-20","Olhão, Portugal",1.85,"FW","Paris Saint-Germain","9",25,10,
  [{years:"2020-2024",club:"Benfica",apps:90,goals:40},{years:"2024-",club:"Paris Saint-Germain",apps:60,goals:28}],
  "本菲卡→巴黎。2022世界杯对瑞士替代C罗首发即上演帽子戏法——最戏剧性的世界杯首秀之一。2024年6500万欧加盟巴黎，两赛季60场28球。");

P("Bernardo Silva","1994-08-10","Lisbon, Portugal",1.73,"MF","Manchester City","10",109,14,
  [{years:"2015-2017",club:"Monaco",apps:86,goals:24},{years:"2017-",club:"Manchester City",apps:360,goals:65}],
  "本菲卡青训→摩纳哥→曼城。瓜迪奥拉称他为最好的球员之一。9年6座英超+1座欧冠——从右翼到后腰到10号的多面性被完全发挥。1.73米控球大师。",
  "贝尔纳多31岁——巅峰可能已过但足球智商从未离开。他的多面性让马丁内斯可以在比赛中切换阵型不需要换人。和布鲁诺的搭档是进攻基石。");

P("João Félix","1999-11-10","Viseu, Portugal",1.81,"FW","Al-Nassr","11",54,12,
  [{years:"2018-2019",club:"Benfica",apps:43,goals:20},{years:"2019-2024",club:"Atlético Madrid",apps:131,goals:34},{years:"2024-2025",club:"→ Barcelona (loan)",apps:44,goals:10},{years:"2025-",club:"Al-Nassr",apps:30,goals:16}],
  "本菲卡→马竞→切尔西→巴萨→利雅得胜利。2019年金童奖——1.27亿欧加盟马竞但五年仅34球。2025年加盟沙特与C罗会合。26岁——天赋从未被质疑，投入度和稳定性始终令人担忧。",
  "费利克斯在沙特联赛备战世界杯——非常规的选择，但在利雅得胜利和C罗的搭档找到了舒适区。他最大的问题是心态，不是技术。马丁内斯给了他更多自由度——他的盘带可能成为葡萄牙超级替补。26岁可能是最后一搏。");

P("José Sá","1993-01-17","Braga, Portugal",1.92,"GK","Wolverhampton Wanderers","12",5,0,
  [{years:"2018-2021",club:"Olympiacos",apps:91,goals:0},{years:"2021-",club:"Wolverhampton Wanderers",apps:150,goals:0}],
  "马里迪莫青训→奥林匹亚科斯→狼队。英超最被低估的门将之一——葡萄牙第二门将。");

P("Renato Veiga","2003-07-29","Lisbon, Portugal",1.83,"DF","Villarreal","13",13,1,
  [{years:"2020-2024",club:"Sporting CP",apps:25,goals:1},{years:"2024-",club:"Villarreal",apps:50,goals:3}],
  "葡萄牙体育青训→比利亚雷亚尔。左脚中卫+左后卫双能——2025年成为葡萄牙国家队常规成员。");

P("Gonçalo Inácio","2001-08-25","Almada, Portugal",1.86,"DF","Sporting CP","14",22,2,
  [{years:"2019-",club:"Sporting CP",apps:150,goals:10}],
  "葡萄牙体育青训——左脚出球中卫的典范。在葡超6个赛季150场积累了丰富经验。2022世界杯和2024欧洲杯有出场纪录。");

P("João Neves","2004-09-27","Tavira, Portugal",1.74,"MF","Paris Saint-Germain","15",22,3,
  [{years:"2022-2024",club:"Benfica",apps:60,goals:4},{years:"2024-",club:"Paris Saint-Germain",apps:60,goals:5}],
  "本菲卡青训→巴黎。2022年17岁一线队首秀立即成为中场核心。2024年以6000万欧加盟巴黎——21岁已是世界最受关注中场之一。小个子控球大师");

P("Francisco Trincão","1999-12-29","Viana do Castelo, Portugal",1.84,"FW","Sporting CP","16",18,3,
  [{years:"2018-2020",club:"Braga",apps:50,goals:9},{years:"2020-2023",club:"Barcelona",apps:42,goals:3},{years:"2021-2022",club:"→ Wolverhampton (loan)",apps:30,goals:3},{years:"2022-2023",club:"→ Sporting CP (loan)",apps:52,goals:15},{years:"2023-",club:"Sporting CP",apps:110,goals:30}],
  "布拉加→巴萨→狼队→葡萄牙体育。在巴萨未成功但回归葡体后爆发——左脚技术细腻的边锋。");

P("Rafael Leão","1999-06-10","Almada, Portugal",1.88,"FW","Milan","17",44,5,
  [{years:"2017-2019",club:"Lille",apps:26,goals:8},{years:"2019-",club:"AC Milan",apps:240,goals:65}],
  "里尔→AC米兰。在米兰7年成长为意甲最可怕的左边锋之一——2021-22赛季意甲MVP。速度爆炸——第一步能把所有后卫甩开。射门和创造力俱佳。",
  "莱奥27岁——完全巅峰期。米兰2025-26赛季的欧冠将是他状态的最好检验。他在左路的个人能力是葡萄牙进攻的终极X因素——当体系被限制后，把球给莱奥单干是最简单的战术。");

P("Pedro Neto","2000-03-09","Viana do Castelo, Portugal",1.72,"FW","Chelsea","18",25,3,
  [{years:"2017-2019",club:"Lazio",apps:5,goals:0},{years:"2019-2024",club:"Wolverhampton Wanderers",apps:135,goals:14},{years:"2024-",club:"Chelsea",apps:55,goals:8}],
  "布拉加青训→拉齐奥→狼队→切尔西。英超最具爆发力的右边锋之一——小个子盘带专家。2024年加盟切尔西，在混乱中保持自己的水准。");

P("Gonçalo Guedes","1996-11-29","Benavente, Portugal",1.79,"FW","Real Sociedad","19",34,8,
  [{years:"2014-2017",club:"Benfica",apps:68,goals:12},{years:"2017-2022",club:"Valencia",apps:178,goals:36},{years:"2022-2023",club:"→ Benfica (loan)",apps:21,goals:1},{years:"2023-2025",club:"→ Benfica (loan)",apps:16,goals:2},{years:"2025-",club:"Real Sociedad",apps:30,goals:6}],
  "本菲卡→瓦伦西亚→皇家社会。在瓦伦西亚五年178场是进攻核心。2025年加盟皇家社会——西甲的战术纪律性对他有提升。");

P("João Cancelo","1994-05-27","Barreiro, Portugal",1.82,"DF","Barcelona","20",68,12,
  [{years:"2012-2015",club:"Benfica B",apps:52,goals:4},{years:"2015-2017",club:"Valencia",apps:91,goals:4},{years:"2017-2018",club:"→ Inter Milan (loan)",apps:28,goals:1},{years:"2018-2019",club:"Juventus",apps:34,goals:1},{years:"2019-2024",club:"Manchester City",apps:154,goals:9},{years:"2022-2023",club:"→ Bayern Munich (loan)",apps:21,goals:1},{years:"2024-",club:"Barcelona",apps:60,goals:5}],
  "本菲卡→瓦伦西亚→尤文→曼城→巴萨。瓜迪奥拉体系的完美边卫——能兼任左右两翼和倒置中场。在巴萨两个赛季继续高水准输出。68场国家队12球。");

P("Rúben Neves","1997-03-13","Mozelos, Portugal",1.80,"MF","Al-Hilal","21",67,1,
  [{years:"2014-2017",club:"Porto",apps:93,goals:4},{years:"2017-2023",club:"Wolverhampton Wanderers",apps:253,goals:30},{years:"2023-",club:"Al-Hilal",apps:70,goals:8}],
  "波尔图青训→狼队→利雅得新月。在狼队6年以远射能力震惊英超。2023年加盟沙特但在那里保持葡萄牙国家队中的角色——67场国家队比赛。");

P("Rui Silva","1994-02-07","Maia, Portugal",1.91,"GK","Sporting CP","22",3,0,
  [{years:"2013-2017",club:"Nacional",apps:52,goals:0},{years:"2017-2021",club:"Granada",apps:128,goals:0},{years:"2021-2025",club:"Real Betis",apps:98,goals:0},{years:"2025-",club:"Sporting CP",apps:20,goals:0}],
  "纳雄耐尔→格拉纳达→贝蒂斯→葡萄牙体育。2025年回归葡超为世界杯保持出场。葡萄牙第三门将。");

P("Vitinha","2000-02-13","Vila das Aves, Portugal",1.72,"MF","Paris Saint-Germain","23",38,0,
  [{years:"2019-2022",club:"Porto",apps:80,goals:4},{years:"2020-2021",club:"→ Wolverhampton (loan)",apps:22,goals:1},{years:"2022-",club:"Paris Saint-Germain",apps:130,goals:10}],
  "波尔图→巴黎。在巴黎一个半赛季成长为欧洲最好的控球中场之一——传球成功率和压迫下的出球能力都坐在世界顶级水平。");

P("Samú Costa","2000-11-27","Aveiro, Portugal",1.81,"DF","Mallorca","24",6,0,
  [{years:"2019-2023",club:"Almería",apps:100,goals:3},{years:"2023-",club:"Mallorca",apps:80,goals:2}],
  "布拉加青训→阿尔梅里亚→马略卡。防守型中场/中卫——在马略卡的高防线体系中磨练防守。2024年国家队首秀。");

P("Nuno Mendes","2002-06-19","Sintra, Portugal",1.80,"DF","Paris Saint-Germain","25",44,1,
  [{years:"2019-2022",club:"Sporting CP",apps:47,goals:2},{years:"2021-2022",club:"→ Paris SG (loan)",apps:37,goals:0},{years:"2022-",club:"Paris Saint-Germain",apps:100,goals:4}],
  "葡萄牙体育→巴黎。世界最佳年轻左边卫之一——速度撕裂防线、传中精准、盘带自信。在巴黎多个赛季继续成长。44场国家队出场。");

P("Francisco Conceição","2002-12-14","Coimbra, Portugal",1.70,"FW","Juventus","26",17,4,
  [{years:"2019-2022",club:"Porto B",apps:38,goals:10},{years:"2021-2024",club:"Porto",apps:68,goals:7},{years:"2024-",club:"Juventus",apps:50,goals:10}],
  "塞尔吉奥·孔塞桑的儿子——波尔图青训→尤文。1.70米小个子右边锋，盘带敏捷到让后卫头晕。在尤文两个赛季进步明显。");

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Portugal: 26 players added.');
