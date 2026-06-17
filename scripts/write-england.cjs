// England squad - 26 players with full data
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

P("Jordan Pickford","1994-03-07","Washington, England",1.85,"GK","Everton","1",84,0,
  [{years:"2011-2017",club:"Sunderland",apps:35,goals:0},{years:"2017-",club:"Everton",apps:340,goals:0}],
  "桑德兰青训→埃弗顿。2017年加盟埃弗顿，成长为英超最稳定的门将之一。2018世界杯英格兰四强——对哥伦比亚点球大战的扑救是英格兰现代足球史上最伟大的门将时刻。2022世界杯继续首发。2024欧洲杯英格兰进入决赛他是核心。长传精准度在英超门将中排名前列。",
  "皮克福德在2026年32岁，第三届世界杯。埃弗顿的稳定出场保证了他的状态。如果英格兰进入点球大战——他是索斯盖特最信赖的人。2018年的点球英雄在2026年能否再现？");

P("Ezri Konsa","1997-10-23","London, England",1.83,"DF","Aston Villa","4",20,1,
  [{years:"2015-2016",club:"Charlton Athletic",apps:24,goals:0},{years:"2016-2019",club:"Brentford",apps:48,goals:2},{years:"2019-",club:"Aston Villa",apps:200,goals:8}],
  "查尔顿→布伦特福德→阿斯顿维拉。维拉防线常青树，2023-24赛季维拉打入欧冠他是关键成员。中卫出身能踢右后卫——多面属性在26人名单中价值极高。2024欧洲杯开始进入国家队常规轮换。");

P("Nico O'Reilly","2005-03-21","Manchester, England",1.85,"DF","Manchester City","67",5,0,
  [{years:"2023-",club:"Manchester City",apps:30,goals:2}],
  "曼城青训——2023-24赛季开始进入一线队。高大左脚中卫，也能踢左后卫。在瓜迪奥拉体系培养的多功能后卫——高位防线和出球是他的天然环境。",
  "奥赖利21岁——英格兰大名单最年轻的后卫。曼城背景意味着他熟悉高位防线，对他的潜力的信任让他入选。大概率不是首发，但入选本身就是认可。");

P("Declan Rice","1999-01-14","London, England",1.88,"MF","Arsenal","41",73,7,
  [{years:"2015-2023",club:"West Ham United",apps:245,goals:15},{years:"2023-",club:"Arsenal",apps:120,goals:12}],
  "西汉姆青训→阿森纳。2023年以1.05亿英镑创英国转会纪录加盟阿森纳。在枪手三个赛季从破坏者进化为完整中场。2024欧洲杯决赛英格兰表现最稳定的球员之一。体能怪兽——场均跑动11+公里。",
  "赖斯27岁——完全巅峰。他是英格兰不可动摇的6号——没有他的覆盖和拦截，中场将毫无安全感。他和贝林厄姆的搭档面对西班牙或法国时可能需要第三中场的加入，索斯盖特的战术选择将围绕此展开。");

P("John Stones","1994-05-28","Barnsley, England",1.88,"DF","Manchester City","5",89,3,
  [{years:"2011-2013",club:"Barnsley",apps:24,goals:0},{years:"2013-2016",club:"Everton",apps:95,goals:0},{years:"2016-",club:"Manchester City",apps:280,goals:15}],
  "巴恩斯利→埃弗顿→曼城。瓜迪奥拉体系最优雅的中卫，6座英超+1座欧冠。2018世界杯四强、2020欧洲杯亚军、2024欧洲杯亚军——英格兰\"总是差一点\"的主角之一。",
  "斯通斯32岁——可能是最后一届世界杯。他和格希的搭档是索斯盖特最信任的组合。但32岁的身体能否撑过7场密集赛程是最大疑虑。");

P("Marc Guéhi","2000-07-13","Abidjan, Ivory Coast",1.82,"DF","Manchester City","6",29,1,
  [{years:"2019-2021",club:"Chelsea",apps:2,goals:0},{years:"2020-2021",club:"→ Swansea City (loan)",apps:45,goals:0},{years:"2021-2025",club:"Crystal Palace",apps:120,goals:5},{years:"2025-",club:"Manchester City",apps:35,goals:2}],
  "切尔西青训→斯旺西→水晶宫→曼城。在水晶宫四年成长为英超最佳年轻中卫，2025年转会曼城。科特迪瓦出生，选择代表英格兰。出球果断、心态稳定——从未暴露重大短板。");

P("Bukayo Saka","2001-09-05","London, England",1.78,"FW","Arsenal","7",49,14,
  [{years:"2018-",club:"Arsenal",apps:260,goals:58}],
  "阿森纳青训的骄傲。2021欧洲杯决赛点球失手后的反弹是英格兰足球史上最感人的人物弧线。2022世界杯3球，2024欧洲杯4球。左脚内切+传中+盘带全能——世界最佳右边锋之一。",
  "萨卡24岁——不再是希望之星，而应该主导世界杯。2021年的创伤已完全修复。如果英格兰打到决赛，萨卡将是决定性的那个球员。");

P("Elliot Anderson","2002-11-06","Whitley Bay, England",1.79,"MF","Nottingham Forest","18",9,0,
  [{years:"2021-2024",club:"Newcastle United",apps:45,goals:2},{years:"2024-",club:"Nottingham Forest",apps:55,goals:6}],
  "纽卡斯尔青训→诺丁汉森林。在森林获得更多出场机会，连续两个英超赛季稳定发挥。左脚中场，盘带和传球有创造力。");

P("Harry Kane","1993-07-28","London, England",1.88,"FW","Bayern Munich","9",114,79,
  [{years:"2009-2023",club:"Tottenham Hotspur",apps:435,goals:280},{years:"2023-",club:"Bayern Munich",apps:120,goals:98}],
  "热刺青训→拜仁。英格兰历史最佳射手（79球），英超历史第二射手（213球）。2023年加盟拜仁，三赛季近百球。2021欧洲杯亚军、2022世界杯八强、2024欧洲杯亚军——荣誉簿上独缺冠军。",
  "凯恩33岁——极大概率最后一届世界杯。英超和德甲的进球机器需要一座世界杯来完成他的传奇。他和贝林厄姆的配合是英格兰进攻的核心命题——如果贝林厄姆能在他身边提供足够的第二次进攻威胁，凯恩的终结效率将发挥到极致。");

P("Jude Bellingham","2003-06-29","Stourbridge, England",1.86,"MF","Real Madrid","10",48,6,
  [{years:"2019-2020",club:"Birmingham City",apps:44,goals:4},{years:"2020-2023",club:"Borussia Dortmund",apps:132,goals:24},{years:"2023-",club:"Real Madrid",apps:130,goals:38}],
  "伯明翰→多特蒙德→皇马。2023年1.03亿欧元加盟皇马，处子赛季39场23球。2023年金童奖。在皇马三赛季已拿2座西甲+1座欧冠。22岁已经是世界级中场，能以一己之力改变比赛。",
  "贝林厄姆22岁——已经是英格兰绝对核心。他在皇马习惯了大舞台，问题在于：索斯盖特能给他多少10号自由度？如果贝林厄姆被完全激活，英格兰可以击败任何球队。");

P("Marcus Rashford","1997-10-31","Manchester, England",1.80,"FW","Barcelona","11",72,18,
  [{years:"2014-2025",club:"Manchester United",apps:390,goals:128},{years:"2025-",club:"Barcelona",apps:38,goals:16}],
  "曼联青训→巴萨。在曼联11年128球成为俱乐部传奇，2025年令人意外地转会巴萨。西甲首个赛季38场16球证明了他仍有顶级速度。2022世界杯3球是英格兰队内最佳射手之一。",
  "拉什福德在巴萨重生后带着自信进入2026世界杯。他的速度是萨卡之外英格兰最重要的边路补充。和凯恩这对老搭档的化学反应在训练中已有良好体现。");

P("Tino Livramento","2002-11-12","London, England",1.78,"DF","Newcastle United","12",6,0,
  [{years:"2021-2023",club:"Southampton",apps:35,goals:1},{years:"2023-",club:"Newcastle United",apps:80,goals:2}],
  "切尔西青训→南安普顿→纽卡斯尔。十字韧带重伤后恢复并重新站稳主力。速度型右后卫，豪的高强度体系让他的体能有质的飞跃。");

P("Dean Henderson","1997-03-12","Whitehaven, England",1.88,"GK","Crystal Palace","13",5,0,
  [{years:"2015-2023",club:"Manchester United",apps:29,goals:0},{years:"2023-",club:"Crystal Palace",apps:100,goals:0}],
  "曼联青训→水晶宫。在曼联活在德赫亚阴影下，2023年加盟水晶宫后终于成为英超稳定首发。英格兰第二门将。");

P("Jordan Henderson","1990-06-17","Sunderland, England",1.82,"MF","Brentford","14",90,3,
  [{years:"2011-2023",club:"Liverpool",apps:492,goals:33},{years:"2023-2024",club:"Al-Ettifaq",apps:30,goals:1},{years:"2024-",club:"Brentford",apps:50,goals:3}],
  "利物浦传奇队长——1座欧冠+1座英超。2023-24短暂沙特后重返英超加盟布伦特福德——明智的选择。35岁，身体下滑但经验不值取代。",
  "亨德森35岁——他的身体已经无法承受90分钟高强度淘汰赛。他的价值在于更衣室领导力——作为利物浦十年队长的气场在年轻英格兰球员中是稀缺的。");

P("Dan Burn","1992-05-09","Blyth, England",2.01,"DF","Newcastle United","15",8,0,
  [{years:"2016-2018",club:"Wigan Athletic",apps:87,goals:6},{years:"2018-2022",club:"Brighton & Hove Albion",apps:85,goals:2},{years:"2022-",club:"Newcastle United",apps:120,goals:6}],
  "维根→布莱顿→纽卡斯尔。2.01米——英超最高后卫。30岁才首次踢上欧冠的大器晚成传奇。制空能力顶级，定位球进攻威胁大。",
  "伯恩34岁第一次参加世界杯。2.01米的身高在定位球攻防中是绝对优势。面对高空轰炸型球队时他是索斯盖特的特殊战术武器。");

P("Kobbie Mainoo","2005-04-19","Stockport, England",1.75,"MF","Manchester United","37",14,0,
  [{years:"2022-",club:"Manchester United",apps:80,goals:5}],
  "曼联青训的最耀眼明珠——2023-24赛季18岁即成为曼联中场主力。2024欧洲杯决赛19岁首发——创历史最年轻纪录之一。控球优雅、压迫穿越能力出色、比赛智商远超同龄人。",
  "迈努21岁第一届世界杯——但他已经是欧洲杯决赛首发了。和贝林厄姆的中场搭档代表英格兰未来十年的核心。面对西班牙或法国控球型中场时，他的压迫下的传球选择是最重要的对抗武器。");

P("Morgan Rogers","2002-07-26","Halesowen, England",1.89,"MF","Aston Villa","16",15,1,
  [{years:"2023-2024",club:"Middlesbrough",apps:33,goals:7},{years:"2024-",club:"Aston Villa",apps:55,goals:12}],
  "曼城青训→米德尔斯堡→阿斯顿维拉。在维拉找到家——1.89米攻击型中场，盘带直接性强。埃梅里的体系培养了他的战术多样性。");

P("Anthony Gordon","2001-02-24","Liverpool, England",1.82,"FW","Newcastle United","18",19,3,
  [{years:"2017-2023",club:"Everton",apps:78,goals:7},{years:"2023-",club:"Newcastle United",apps:90,goals:22}],
  "埃弗顿青训→纽卡斯尔。在埃弗顿饱受质疑，2023年加盟纽卡后彻底爆发——90场22球。反击速度撕裂防线。2024年首次代表英格兰出场。");

P("Ollie Watkins","1995-12-30","Torquay, England",1.80,"FW","Aston Villa","19",22,7,
  [{years:"2013-2017",club:"Exeter City",apps:78,goals:26},{years:"2017-2020",club:"Brentford",apps:143,goals:49},{years:"2020-",club:"Aston Villa",apps:215,goals:85}],
  "英乙→英冠→英超的励志传奇。2023-24赛季维拉打入欧冠他打入20球。2024欧洲杯绝杀荷兰的制胜球是他国家队最高光时刻。");

P("Noni Madueke","2002-03-10","London, England",1.82,"FW","Arsenal","20",11,1,
  [{years:"2020-2023",club:"PSV Eindhoven",apps:80,goals:20},{years:"2023-2025",club:"Chelsea",apps:45,goals:9},{years:"2025-",club:"Arsenal",apps:30,goals:8}],
  "热刺青训→埃因霍温→切尔西→阿森纳。左脚右边锋——内切射门是标志性动作。切尔西阶段未完全发挥，转会阿森纳获更清晰角色定位。");

P("Eberechi Eze","1998-06-29","London, England",1.78,"MF","Arsenal","21",17,3,
  [{years:"2016-2020",club:"Queens Park Rangers",apps:112,goals:20},{years:"2020-2025",club:"Crystal Palace",apps:140,goals:28},{years:"2025-",club:"Arsenal",apps:35,goals:10}],
  "QPR→水晶宫→阿森纳。英超最具观赏性的攻击型中场之一——盘带流畅，任意球顶级。2025年加盟阿森纳——阿尔特塔体系对他的战术纪律性提出更高要求。");

P("Ivan Toney","1996-03-16","Northampton, England",1.88,"FW","Al-Ahli","22",8,1,
  [{years:"2018-2020",club:"Peterborough United",apps:94,goals:49},{years:"2020-2025",club:"Brentford",apps:140,goals:72},{years:"2025-",club:"Al-Ahli",apps:28,goals:18}],
  "低级别联赛→英超顶级射手的励志故事。布伦特福德140场72球——2022-23赛季英超20球。2025年加盟沙特，为世界杯保持状态。",
  "托尼不是首发（凯恩在前面），但他的点球能力和禁区身体对抗让他成为索斯盖特终结比赛的选择。如果打到点球大战——他是最可靠的点球手之一。");

P("James Trafford","2002-10-10","Carlisle, England",1.97,"GK","Manchester City","23",2,0,
  [{years:"2022-2023",club:"→ Bolton Wanderers (loan)",apps:50,goals:0},{years:"2023-",club:"→ Burnley (loan)",apps:46,goals:0}],
  "曼城青训天才——2023年U21欧洲杯冠军关键人物（决赛补时扑点）。1.97米，未来英格兰一号。2026入选更多是作为未来投资。");

P("Reece James","1999-12-08","London, England",1.77,"DF","Chelsea","24",24,1,
  [{years:"2018-",club:"Chelsea",apps:160,goals:10}],
  "切尔西青训——2021年欧冠冠军核心。右脚传中世界顶级——但伤病反复打断了他的巅峰。健康时他是世界最佳右后卫之一。",
  "詹姆斯的2026世界杯完全取决于伤病。如果他健康——他是右后卫首发。但没人能保证他会健康打完七场比赛。");

P("Djed Spence","2000-08-09","London, England",1.84,"DF","Tottenham Hotspur","25",6,0,
  [{years:"2019-2023",club:"Middlesbrough",apps:63,goals:2},{years:"2021-2022",club:"→ Nottingham Forest (loan)",apps:43,goals:2},{years:"2023-",club:"Tottenham Hotspur",apps:55,goals:1}],
  "米德尔斯堡→热刺。在森林租借期首次被认识——升超奇迹核心之一。在热刺逐渐站稳主力。速度型边卫，盘带突出。");

P("Jarell Quansah","2003-01-29","Warrington, England",1.90,"DF","Bayer Leverkusen","26",3,0,
  [{years:"2021-2025",club:"Liverpool",apps:40,goals:3},{years:"2025-",club:"Bayer Leverkusen",apps:30,goals:2}],
  "利物浦青训→勒沃库森。2023-24赛季因伤病危机在利物浦获得机会并表现出色。2025年转会勒沃库森在阿隆索体系下继续打磨。高大中卫，制空好。");

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('England: 26 players added.');
