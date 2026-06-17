// Spain squad - 26 players
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

P("David Raya","1995-09-15","Barcelona, Spain",1.83,"GK","Arsenal","1",13,0,
  [{years:"2012-2019",club:"Blackburn Rovers",apps:108,goals:0},{years:"2019-2023",club:"Brentford",apps:161,goals:0},{years:"2023-",club:"Arsenal",apps:110,goals:0}],
  "布莱克本→布伦特福德→阿森纳。在阿尔特塔手下成长为英超顶级出球门将——2023-24赛季英超金手套。与他竞争的是乌奈·西蒙——西班牙门将位置深度冠绝欧洲。",
  "拉亚30岁，门将黄金年龄。他的脚下技术比西蒙更符合德拉富恩特的出球门将要求。阿森纳欧冠之旅将为他提供更丰富的大赛经验。");

P("Marc Pubill","2003-06-20","Terrassa, Spain",1.83,"DF","Atlético Madrid","2",2,0,
  [{years:"2020-2024",club:"Levante",apps:80,goals:1},{years:"2024-",club:"Atlético Madrid",apps:45,goals:1}],
  "莱万特青训→马竞。右后卫——西蒙尼体系给了他极强的防守纪律。在马竞两个赛季证明防守强度。");

P("Álex Grimaldo","1995-09-20","Valencia, Spain",1.71,"DF","Bayer Leverkusen","3",14,0,
  [{years:"2016-2023",club:"Benfica",apps:303,goals:26},{years:"2023-",club:"Bayer Leverkusen",apps:100,goals:18}],
  "巴萨青训→本菲卡→勒沃库森。在本菲卡7年3座葡超，2023年自由身加盟勒沃库森——成为阿隆索不败冠军的绝对核心。2023-24赛季12球10助的左边卫数据在世界足坛罕见。",
  "格里马尔多以30岁参加个人第一届世界杯。他的传中和任意球在德拉富恩特的体系中承担极重的进攻职责。如果西班牙走远，他的定位球可能是隐藏武器。");

P("Eric García","2001-01-09","Martorell, Spain",1.82,"DF","Barcelona","4",21,0,
  [{years:"2018-2021",club:"Manchester City",apps:35,goals:0},{years:"2021-",club:"Barcelona",apps:90,goals:0}],
  "巴萨青训→曼城→巴萨。瓜迪奥拉提拔的传控型中卫——传球能力顶级。2021年自由转会回到巴萨。2022世界杯有出场经验。");

P("Marcos Llorente","1995-01-30","Madrid, Spain",1.80,"DF","Atlético Madrid","5",24,0,
  [{years:"2015-2019",club:"Real Madrid",apps:39,goals:2},{years:"2019-",club:"Atlético Madrid",apps:220,goals:24}],
  "皇马青训→马竞。罕见地跨越派系——西蒙尼将他从后腰改造为右后卫后爆发。2020-21赛季夺冠赛季打入12球——全能中场/边卫");

P("Mikel Merino","1996-06-22","Pamplona, Spain",1.89,"MF","Arsenal","6",43,10,
  [{years:"2014-2016",club:"Osasuna",apps:67,goals:8},{years:"2016-2017",club:"Borussia Dortmund",apps:9,goals:0},{years:"2018-2024",club:"Real Sociedad",apps:242,goals:27},{years:"2024-",club:"Arsenal",apps:55,goals:8}],
  "奥萨苏纳→多特蒙德→皇家社会→阿森纳。在皇家社会6年成长为西甲最佳全能中场。2024欧洲杯决赛击败英格兰——加时绝杀球来自他的头球。");

P("Ferran Torres","2000-02-29","Foios, Spain",1.84,"FW","Barcelona","7",57,24,
  [{years:"2017-2020",club:"Valencia",apps:97,goals:9},{years:"2020-2022",club:"Manchester City",apps:43,goals:16},{years:"2022-",club:"Barcelona",apps:140,goals:38}],
  "瓦伦西亚→曼城→巴萨。在曼城两年效率极高（43场16球），转会巴萨后四个赛季38球。2022世界杯对德国的关键进球让他成为西班牙英雄。");

P("Fabián Ruiz","1996-04-03","Los Palacios, Spain",1.89,"MF","Paris Saint-Germain","8",42,6,
  [{years:"2014-2018",club:"Real Betis",apps:75,goals:4},{years:"2018-2022",club:"Napoli",apps:166,goals:22},{years:"2022-",club:"Paris Saint-Germain",apps:110,goals:10}],
  "贝蒂斯青训→那不勒斯→巴黎。在那不勒斯四年左脚技术打磨到极致。左脚长传精准、远射力量足——西班牙中场的节奏控制者。2024欧洲杯冠军中场核心。");

P("Gavi","2004-08-05","Los Palacios, Spain",1.73,"MF","Barcelona","9",30,5,
  [{years:"2021-",club:"Barcelona",apps:120,goals:8}],
  "巴萨青训——17岁一线队首秀。2022世界杯18岁成为最年轻的西班牙进球者。攻击性超出1.73米身高预期——大心脏小个子。",
  "加维21岁——但世界杯经验已丰富。佩德里+加维+罗德里——这个三人组理论上能同时控制比赛和施压，是西班牙最大的中场资本。");

P("Dani Olmo","1998-05-07","Terrassa, Spain",1.79,"FW","Barcelona","10",50,12,
  [{years:"2015-2019",club:"Dinamo Zagreb",apps:59,goals:21},{years:"2019-2024",club:"RB Leipzig",apps:150,goals:30},{years:"2024-",club:"Barcelona",apps:60,goals:18}],
  "巴萨青训→萨格勒布迪纳摩→莱比锡→巴萨。不同寻常的成长路径——先克罗地亚积累，再莱比锡登陆顶级。2024年回归巴萨，两赛季60场18球。2024欧洲杯最佳射手之一。",
  "奥尔莫28岁——完全巅峰。能踢前锋、边锋和攻击中场，德拉富恩特手上最灵活的进攻球员。2024欧洲杯已证明大赛进球能力，2026是他在世界舞台的第二次机会。");

P("Yéremy Pino","2002-10-20","Las Palmas, Spain",1.72,"FW","Crystal Palace","11",23,4,
  [{years:"2020-2025",club:"Villarreal",apps:150,goals:22},{years:"2025-",club:"Crystal Palace",apps:35,goals:10}],
  "比利亚雷亚尔→水晶宫。在黄潜五年成长为西甲最攻击性的右边锋——1.72米小个子边锋，速度和变向是核心武器。2025年转会英超接受身体对抗考验。");

P("Pedro Porro","1999-09-13","Don Benito, Spain",1.76,"DF","Tottenham Hotspur","12",18,0,
  [{years:"2020-2022",club:"→ Sporting CP (loan)",apps:95,goals:12},{years:"2023-",club:"Tottenham Hotspur",apps:100,goals:10}],
  "在葡超征服葡萄牙足坛，2023年加盟热刺成为英超最令人兴奋的攻击型右后卫。传中和射门均可——西班牙右后卫第一选择。");

P("Joan Garcia","2001-05-04","Sallent, Spain",1.88,"GK","Barcelona","13",2,0,
  [{years:"2020-2025",club:"Espanyol",apps:45,goals:0},{years:"2025-",club:"Barcelona",apps:15,goals:0}],
  "西班牙人青训→巴萨。罕见地跨越巴塞罗那派系加盟巴萨。反应极快——2024年首次入选国家队。");

P("Aymeric Laporte","1994-05-27","Agen, France",1.91,"DF","Athletic Bilbao","14",46,2,
  [{years:"2012-2018",club:"Athletic Bilbao",apps:222,goals:10},{years:"2018-2023",club:"Manchester City",apps:180,goals:12},{years:"2023-2025",club:"Al-Nassr",apps:45,goals:2},{years:"2025-",club:"Athletic Bilbao",apps:30,goals:1}],
  "毕尔巴鄂→曼城→利雅得胜利→毕尔巴鄂。法国出生，选择西班牙。左脚出球中卫的理想模板——5座英超+1座欧冠。2025年回归毕尔巴鄂为世界杯备战。",
  "拉波尔特32岁——西班牙防线的经验基石。左脚中卫在西班牙是稀缺货——他同时能提供前场长传的第一脚启动。");

P("Álex Baena","2001-07-20","Roquetas de Mar, Spain",1.74,"MF","Atlético Madrid","15",17,2,
  [{years:"2019-2025",club:"Villarreal",apps:110,goals:18},{years:"2025-",club:"Atlético Madrid",apps:35,goals:8}],
  "比利亚雷亚尔→马竞。2024欧洲杯冠军阵容成员——23岁已有奥运会金牌+欧洲杯冠军。左脚攻击型中场，加盟马竞后将接受西蒙尼防守要求。");

P("Rodri","1996-06-22","Madrid, Spain",1.91,"MF","Manchester City","16",62,4,
  [{years:"2015-2018",club:"Villarreal",apps:84,goals:2},{years:"2018-2019",club:"Atlético Madrid",apps:47,goals:1},{years:"2019-",club:"Manchester City",apps:260,goals:28}],
  "比利亚雷亚尔青训→马竞→曼城。世界最佳后腰——2024年金球奖得主。在曼城定义了现代6号——防守+控球+后插上得分三重属性。ACL重伤复出后维持世界级水平。",
  "罗德里29岁——完全巅峰。2024金球奖之后他的责任更重。西班牙的一切从中场开始，而中场从罗德里开始。如果罗德里健康打满七场——西班牙是冠军最热门之一。");

P("Nico Williams","2002-07-12","Pamplona, Spain",1.81,"FW","Athletic Bilbao","17",30,6,
  [{years:"2020-",club:"Athletic Bilbao",apps:180,goals:28}],
  "毕尔巴鄂青训的宝石。2024欧洲杯决赛对英格兰打入制胜球——西班牙的绝对英雄。速度爆炸、左脚传中精准——世界最有爆发力的左边锋之一。",
  "尼科·威廉姆斯23岁——完全成熟的威胁。和亚马尔在两翼的配置可能是本届世界杯最快的双翼组合。对位防守他的右后卫将在90分钟内被撕扯得体无完肤。");

P("Martín Zubimendi","1999-02-02","San Sebastián, Spain",1.81,"MF","Arsenal","18",26,3,
  [{years:"2016-2025",club:"Real Sociedad",apps:210,goals:8},{years:"2025-",club:"Arsenal",apps:35,goals:2}],
  "皇家社会→阿森纳。在皇家社会9年成长为西甲最聪明的防守中场——布斯克茨继承人。传球选择极其精确，控球从容面对压迫。2025年加盟阿森纳，在英超检验最高强度。");

P("Lamine Yamal","2007-07-13","Esplugues de Llobregat, Spain",1.80,"FW","Barcelona","19",25,6,
  [{years:"2023-",club:"Barcelona",apps:90,goals:18}],
  "巴萨青训——2023年15岁一线队首秀。2024欧洲杯16岁已是西班牙不可动摇的首发，打入2球夺冠。盘带天才——左脚内切弧线球已是招牌。",
  "亚马尔18岁——本届世界杯最年轻的巨星。2024欧洲杯已证明他不惧怕最大舞台。他能不能复制贝利1958年的奇迹？18岁在世界杯上的所有不可能性将在这个夏天被考验。");

P("Pedri","2002-11-25","Tegueste, Spain",1.74,"MF","Barcelona","20",41,6,
  [{years:"2019-2020",club:"Las Palmas",apps:37,goals:4},{years:"2020-",club:"Barcelona",apps:180,goals:22}],
  "拉斯帕尔马斯→巴萨。2020年17岁加盟巴萨——2021欧洲杯18岁最佳年轻球员。在巴萨6年41次国家队出场。比赛阅读和传球视野最高级别。伤病是最大敌人。",
  "佩德里23岁——已经不再年轻了。健康状态将是关键。佩德里+加维+罗德里——如果三人都健康，西班牙将控制每一场比赛的节奏。");

P("Mikel Oyarzabal","1997-04-21","Eibar, Spain",1.81,"FW","Real Sociedad","21",53,25,
  [{years:"2014-",club:"Real Sociedad",apps:350,goals:98}],
  "皇家社会青训产品——全部奉献给了母队。2024欧洲杯决赛绝杀英格兰的制胜球——西班牙的绝对英雄。53次国家队出场25球——进球效率高于很多世界级中锋。",
  "奥亚尔萨瓦尔29岁——俱乐部生涯低调但国家队生涯已闪耀。他是德拉富恩特手上最可信赖的终结武器——如果西班牙打到半决赛后，他的经验是最重要的资产之一。");

P("Pau Cubarsí","2007-01-22","Estanyol, Spain",1.84,"DF","Barcelona","22",12,0,
  [{years:"2023-",club:"Barcelona",apps:60,goals:2}],
  "巴萨青训——2023-24赛季16岁一线队首秀立即成为防线固定成员。出球能力远超年龄。19岁已有12次国家队出场——传奇级的成长速度。",
  "库巴尔西19岁第一届世界杯——但他已有丰富的巴萨和西班牙经验。和拉波尔特的中卫搭档在左侧提供顶级出球。年轻的他可能有失误——但天赋将被全世界见证。");

P("Unai Simón","1997-06-11","Vitoria-Gasteiz, Spain",1.90,"GK","Athletic Bilbao","23",58,0,
  [{years:"2018-2019",club:"→ Elche (loan)",apps:40,goals:0},{years:"2019-",club:"Athletic Bilbao",apps:180,goals:0}],
  "毕尔巴鄂青训——2021和2024欧洲杯西班牙主力门将。58场国家队出场——经验丰富。与拉亚的门将竞争是西班牙最幸福的烦恼。");

P("Marc Cucurella","1998-07-22","Alella, Spain",1.72,"DF","Chelsea","24",24,1,
  [{years:"2016-2018",club:"Barcelona B",apps:54,goals:1},{years:"2018-2020",club:"Eibar→Getafe",apps:70,goals:2},{years:"2021-2022",club:"Brighton & Hove Albion",apps:38,goals:1},{years:"2022-",club:"Chelsea",apps:100,goals:3}],
  "标志性的卷发+进攻型左边卫。2024欧洲杯意外成为西班牙主力左边卫——决赛对英格兰被广泛赞誉。1.72米防守端偶有短板但盘带和传中弥补。");

P("Víctor Muñoz","2003-08-15","Zaragoza, Spain",1.77,"FW","Osasuna","25",2,1,
  [{years:"2021-",club:"Osasuna",apps:80,goals:12}],
  "奥萨苏纳青训——在潘普洛纳五个赛季逐步成长为可靠西甲前锋。脚下技术扎实，2024年首次入选国家队。");

P("Borja Iglesias","1993-01-17","Santiago de Compostela, Spain",1.87,"FW","Celta Vigo","26",8,0,
  [{years:"2018-2019",club:"Espanyol",apps:43,goals:20},{years:"2019-2024",club:"Real Betis",apps:170,goals:52},{years:"2024-2025",club:"→ Bayer Leverkusen (loan)",apps:12,goals:1},{years:"2025-",club:"Celta Vigo",apps:30,goals:10}],
  "西班牙的大熊猫——加利西亚高中锋。在贝蒂斯五年52球，包括欧联杯关键进球。2025年重返塞尔塔——回家的情感加成。1.87米体格中锋，禁区对抗和头球有威胁。");

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Spain: 26 players added.');
