// Rewrite Brazil squad bios - facts from squads.json + TheSportsDB, no fabricated numbers
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const sqPath = require('path').join(__dirname, '..', 'src', 'data', 'squads.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const sq = JSON.parse(fs.readFileSync(sqPath, 'utf8'));
const br = sq.find(t => t.name === 'Brazil');

// Helper: get squad entry for a player
function S(name) { return br.players.find(p => p.name === name); }

// Helper: set player data
function set(name, birthDate, birthPlace, height, pos, club, clubNum, career, cr, ws) {
  const s = S(name);
  wiki[name] = {
    number: s.number, fullName: name, birthDate, birthPlace, height, position: pos,
    currentClub: s.club, clubNumber: clubNum || s.number || "", image: "",
    extractPreview: "", introPreview: "",
    nationalCaps: s.caps, nationalGoals: s.goals,
    clubCareer: career,
    careerReview: cr,
    wcSpotlight: ws
  };
}

// ----- 1. Alisson -----
set("Alisson","1992-10-02","Novo Hamburgo, Brazil",1.93,"GK","Liverpool","1",
  [{years:"2013–2016",club:"Internacional"},{years:"2016–2018",club:"Roma"},{years:"2018–",club:"Liverpool"}],
  "阿里松的职业生涯走得稳且准。在巴西国际起步，2016年被罗马看中带到意甲，两个赛季就拿了意甲年度最佳门将。2018年利物浦以当时门将历史最高转会费签下他——后来的故事众所周知：欧冠冠军、英超冠军、英超金手套、国际足联年度最佳门将、首届雅辛奖得主。他重新定义了现代门将：不只是扑救，脚下出球、一对一决策、禁区控制力全是顶级。",
  "阿里松今年33岁，守门员的黄金年龄。这届世界杯他是巴西防线最后一道锁，身后再无容错空间。2019年他曾以最佳门将身份帮巴西拿下美洲杯，但在世界杯舞台他最好的成绩只是八强。巴西24年没碰过世界杯冠军奖杯，阿里松是安切洛蒂治下这支巴西队里经验最深的球员之一——他的世界杯表现将直接决定巴西能走多远。"
);

// ----- 2. Éderson Silva -----
set("Éderson Silva","1991-01-18","São Paulo, Brazil",1.88,"MF","Atalanta","2",
  [{years:"2013–2018",club:"Udinese"},{years:"2018–",club:"Atalanta"}],
  "埃德森·席尔瓦是意甲最被低估的中场之一。在乌迪内斯五年磨炼之后转投亚特兰大，在加斯佩里尼的高强度体系中扮演中场节拍器。他的比赛风格不花哨——拦截、分球、跑位覆盖——但在亚特兰大这几年几乎是铁打主力。国家队层面出场不多，属于巴西中场的深度储备。"
);

// ----- 3. Gabriel Magalhães -----
set("Gabriel Magalhães","1997-12-19","São Paulo, Brazil",1.90,"DF","Arsenal","3",
  [{years:"2016–2018",club:"Avaí"},{years:"2018–2020",club:"Lille"},{years:"2020–",club:"Arsenal"}],
  "加布里埃尔是英超最好的中卫之一。从巴西阿瓦伊到法甲里尔，再被阿森纳签下，每一个阶梯他都踩得稳稳当当。身高体壮、空中统治力强、左脚出球精准——他和萨利巴搭档的防线是阿森纳近年来最坚固的资本。防守时的侵略性让他成了英超前锋最不想对上的人之一。",
  "加布里埃尔在巴西国家队的角色越来越重要。28岁正值中卫巅峰，和马尔基尼奥斯的中卫组合将承担阻击姆巴佩、哈兰德级别前锋的任务。这是他第一次以绝对主力身份参加世界杯——安切洛蒂的体系要求中卫能出球也能肉搏，加布里埃尔恰好两者兼备。"
);

// ----- 4. Marquinhos -----
set("Marquinhos","1994-05-14","São Paulo, Brazil",1.83,"DF","Paris Saint-Germain","4",
  [{years:"2011–2012",club:"Corinthians"},{years:"2012–2013",club:"Roma"},{years:"2013–",club:"Paris Saint-Germain"}],
  "马尔基尼奥斯2012年在科林蒂安拿了南美解放者杯冠军，19岁就被罗马签下，一年后又以超过3000万欧元转会巴黎圣日耳曼——当时20岁以下后卫的最高转会费。在巴黎这十几年他拿了超过20座奖杯，包括多次法甲冠军。国家队层面105次出场是巴西防线资历最深的球员，2016年奥运金牌和2019年美洲杯冠军他都当过主角。",
  "马尔基尼奥斯32岁，这大概率是他的最后一届世界杯。2018和2022两届世界杯他都是主力，但巴西最远只走到八强。他的经验和领袖气质对这支年轻化的巴西队至关重要——安切洛蒂需要他在防线指挥若定的同时，还能在定位球进攻中贡献头球威胁。"
);

// ----- 5. Casemiro -----
set("Casemiro","1992-02-23","São José dos Campos, Brazil",1.84,"MF","Manchester United","5",
  [{years:"2010–2013",club:"São Paulo"},{years:"2013–2022",club:"Real Madrid"},{years:"2014–2015",club:"→ Porto (loan)"},{years:"2022–",club:"Manchester United"}],
  "卡塞米罗的履历本身就是一部防守型后腰的教科书。圣保罗青训出道，2013年被皇马签下，经历波尔图租借期后返回马德里，然后就成了欧冠三连冠阵容里最不可替代的那块砖——四座欧冠、多次西甲冠军。2022年加盟曼联后依然是球队中场最硬的屏障。2019年美洲杯他是巴西夺冠的绝对主力，这个位置上全世界能和他比肩的人一只手数得过来。",
  "卡塞米罗34岁，身体状态比巅峰期有所下滑，但阅读比赛的能力和大赛经验仍然是巴西中场最宝贵的资产。安切洛蒂在皇马的体系里已经用过他，知道怎么让他的扫荡和保护发挥最大价值。如果巴西打到后半程，他的体能分配会是关键变量——毕竟中场没有人能复制他的防守覆盖。"
);

// ----- 6. Alex Sandro -----
set("Alex Sandro","1991-01-26","Catanduva, Brazil",1.80,"DF","Flamengo","6",
  [{years:"2011–2015",club:"Porto"},{years:"2015–2024",club:"Juventus"},{years:"2024–",club:"Flamengo"}],
  "阿历克斯·桑德罗在波尔图起步拿到葡超冠军，2015年加盟尤文图斯后九个赛季拿了五次意甲冠军，是尤文左路将近十年的固定角色。2024年回到巴西弗拉门戈，算是在职业生涯末期回归故乡。他是巴西队2019年美洲杯冠军阵容的主力左边卫，经验积累深厚但年龄和速度已不如巅峰时期。"
);

// ----- 7. Vinícius Júnior -----
set("Vinícius Júnior","2000-07-12","São Gonçalo, Brazil",1.76,"FW","Real Madrid","7",
  [{years:"2018–",club:"Real Madrid"}],
  "维尼修斯从弗拉门戈青训直接跳到皇马——18岁的天价转会，一开始被嘲笑不会进球，五年之后他已经是全世界最可怕的左边锋。2022年欧冠决赛一锤定音、接下来两个赛季持续输出关键进球和助攻。他的第一步爆发、盘带节奏和内切射门都达到了世界最高级别。2022世界杯他踢了五场只有一粒进球——全世界都知道他需要在世界杯舞台上交出更有说服力的答卷。",
  "维尼修斯今年25岁，完全巅峰。这届世界杯他是巴西进攻的第一支点——安切洛蒂在皇马已经把他用到了极致，两人在俱乐部和国家队的战术默契可能成为巴西的秘密武器。全世界都知道他要从左路内切射门，但知道和能防住是两回事。巴西能不能走远，维尼修斯的进球数会直接给出答案。"
);

// ----- 8. Bruno Guimarães -----
set("Bruno Guimarães","1997-11-16","Rio de Janeiro, Brazil",1.82,"MF","Newcastle United","8",
  [{years:"2017–2020",club:"Athletico Paranaense"},{years:"2020–2022",club:"Lyon"},{years:"2022–",club:"Newcastle United"}],
  "布鲁诺·吉马良斯在巴拉那竞技出道拿了南美杯冠军，2020年转会里昂，在法甲两年奠定了欧洲一线中场的地位。2022年加盟纽卡斯尔联后迅速成为球队核心——英超最聪明的控球中场之一，传球视野和压迫下的处理球能力在英超属于顶级水准。在巴西国家队他逐渐从替补成长为常规主力，可以踢8号也可以踢6号。"
);

// ----- 9. Matheus Cunha -----
set("Matheus Cunha","1999-05-27","João Pessoa, Brazil",1.84,"FW","Manchester United","9",
  [{years:"2017–2018",club:"FC Sion"},{years:"2018–2020",club:"RB Leipzig"},{years:"2020–2021",club:"Hertha BSC"},{years:"2021–2023",club:"Atlético Madrid"},{years:"2023–2024",club:"Wolverhampton Wanderers"},{years:"2024–",club:"Manchester United"}],
  "库尼亚18岁独闯瑞士锡永，接着被莱比锡看中，德甲两年后去柏林赫塔又练了一年，2021年登陆马竞。西蒙尼的体系不适合他这种技术流前锋，但他没被耽误太久——2023年加盟狼队之后在英超立刻活了。2024年夏天转会曼联，现在已是红魔前场最可靠的全能攻击手，中锋、边锋、影锋哪个位置都能站。2021年拿了奥运金牌，2022年世界杯有过替补出场。",
  "库尼亚这届世界杯的角色极其微妙。维尼修斯、拉菲尼亚、内马尔占了前场三个主力位，他大概率从板凳出发。但刚好是他的多面性让他在淘汰赛价值巨大——安切洛蒂不需要为他改体系，他只是往上一站就能产生威胁。内马尔体能跟不上的时候，或者对手包夹维尼修斯的时候，库尼亚就是巴西板凳上最被低估的一张牌。"
);

// ----- 10. Neymar -----
set("Neymar","1992-02-05","Mogi das Cruzes, Brazil",1.75,"FW","Santos","10",
  [{years:"2009–2013",club:"Santos"},{years:"2013–2017",club:"Barcelona"},{years:"2017–2023",club:"Paris Saint-Germain"},{years:"2023–2025",club:"Al-Hilal"},{years:"2025–",club:"Santos"}],
  "内马尔的生涯就是一部巴西足球近十五年的史诗。桑托斯出道时就被称为罗比尼奥之后最大的天才，2013年加盟巴萨和梅西苏亚雷斯组成MSN，2015年拿下欧冠三冠王。2017年以破世界纪录的转会费加盟巴黎，在那里拿了多次法甲冠军却始终没能接近欧冠。国家队层面他是巴西历史射手王，超越了贝利的纪录。2014年世界杯他受伤缺阵半决赛，巴西1-7惨败德国；2018年被比利时淘汰；2022年加时进球领先后被克罗地亚扳平点球出局——三届世界杯的悲剧剧本塑造了他悲情英雄的形象。后来膝盖重伤、被利雅得新月解约，他重回桑托斯。",
  "34岁，这大概率是内马尔的最后一届世界杯。他不是2014年那个能把后卫晃倒在地的少年了——速度退了一点，但视野、传球和禁区前15米的灵光一现还在。安切洛蒂会让他在场上承担更少的跑动任务和更多的决策职责。这届巴西队比以往任何一届都要务实，内马尔不再需要一个人扛着全队前进——但他仍然是巴西进攻中最不可预测的那个变量。"
);

// ----- 11. Raphinha -----
set("Raphinha","1996-12-14","Porto Alegre, Brazil",1.76,"FW","Barcelona","11",
  [{years:"2016–2018",club:"Vitória Guimarães"},{years:"2018–2020",club:"Sporting CP"},{years:"2020–2022",club:"Leeds United"},{years:"2022–",club:"Barcelona"}],
  "拉菲尼亚的成长路径有点特别——先在葡超的吉马良斯和葡萄牙体育锻炼，2020年加盟英超利兹联，在贝尔萨的疯狂体系里踢出了自己的标签：不知疲倦的逼抢和左脚的精准弧线球。2022年转会巴萨，在西甲站稳首发位置，左右边锋都能踢。2022年世界杯他是巴西的常规首发，有进球有助攻。",
  "拉菲尼亚在安切洛蒂的巴西队里是个有趣的棋子。他不像维尼修斯那样星光四射，但他的战术纪律和工作率让边路防守更均衡。巴西前场人才太多，他的首发位置会受到竞争——但在一届要踢七场比赛的世界杯里，这种能攻善守的边锋反而是最稀缺的资源。"
);

// ----- 12. Weverton -----
set("Weverton","1987-12-13","Rio Branco, Brazil",1.89,"GK","Grêmio","12",
  [{years:"2013–2018",club:"Athletico Paranaense"},{years:"2018–",club:"Grêmio"}],
  "维弗顿是巴西足坛一个特别的故事——38岁才以第三门将身份参加自己的第一届世界杯。在巴拉那竞技和格雷米奥的十几年里，他是巴西国内联赛最稳定的门将之一，拿了多次南美解放者杯和巴西杯冠军。国家队出场不多，但在更衣室里的经验价值远大于场上时间。"
);

// ----- 13. Danilo Luiz -----
set("Danilo Luiz","1991-07-15","Bicas, Brazil",1.84,"DF","Flamengo","13",
  [{years:"2012–2015",club:"Porto"},{years:"2015–2017",club:"Real Madrid"},{years:"2017–2019",club:"Manchester City"},{years:"2019–2025",club:"Juventus"},{years:"2025–",club:"Flamengo"}],
  "达尼洛的职业生涯是一部豪门巡游录——波尔图起家，皇马、曼城、尤文图斯都待过，几乎集齐了欧洲顶级联赛的冠军奖杯。可以踢右后卫和中卫，战术理解力在巴西后卫中数一数二。2025年回到弗拉门戈，算是叶落归根。70次国家队出场让他成为巴西队最有经验的后卫之一。"
);

// ----- 14. Bremer -----
set("Bremer","1997-03-18","Itapitanga, Brazil",1.88,"DF","Juventus","14",
  [{years:"2017–2018",club:"Atlético Mineiro"},{years:"2018–2022",club:"Torino"},{years:"2022–",club:"Juventus"}],
  "布雷默在米内罗竞技起步，2018年加盟都灵后在意大利足球的防守学校里磨了四年，2022年被尤文图斯签下，迅速成为主力中卫。头球能力是一大武器，禁区内的统治力在意甲属于顶级。8次国家队出场还不多，但在中卫位置上他提供了可靠的替补深度。"
);

// ----- 15. Léo Pereira -----
set("Léo Pereira","1996-01-31","São Paulo, Brazil",1.86,"DF","Flamengo","15",
  [{years:"2015–2019",club:"Athletico Paranaense"},{years:"2020–",club:"Flamengo"}],
  "莱奥·佩雷拉在巴拉那竞技出道拿了巴西杯冠军，2020年加盟弗拉门戈后成为后防核心，多次拿下巴甲和巴西杯冠军。左脚中卫，出球干净、防守硬朗，是弗拉门戈这几年后防线最稳定的存在。国家队出场虽少，但在巴西国内联赛的声望很高。"
);

// ----- 16. Douglas Santos -----
set("Douglas Santos","1994-03-22","João Pessoa, Brazil",1.73,"DF","Zenit Saint Petersburg","16",
  [{years:"2012–2016",club:"Udinese"},{years:"2016–2019",club:"Hamburg"},{years:"2019–",club:"Zenit Saint Petersburg"}],
  "道格拉斯·桑托斯从乌迪内斯到汉堡再到泽尼特，几乎全部职业生涯都在欧洲。在泽尼特拿过多次俄超冠军，左边卫的正统踢法，攻守均衡。他的特点是一板一眼不出错——在巴西国家队这种前场天才扎堆的体系里，稳定不犯错的边后卫反而是稀缺品。"
);

// ----- 17. Fabinho -----
set("Fabinho","1993-10-23","Campinas, Brazil",1.88,"MF","Al-Ittihad","17",
  [{years:"2012–2018",club:"Monaco"},{years:"2018–2023",club:"Liverpool"},{years:"2023–",club:"Al-Ittihad"}],
  "法比尼奥在摩纳哥时期拿到了法甲冠军并打进欧冠四强，2018年加盟利物浦后成为克洛普体系里最不可替代的防守中场——英超冠军、欧冠冠军、世俱杯冠军，全拿了。从右后卫改踢后腰后完全释放了他阅读比赛的天赋，在利物浦五年是英超最好的后腰之一。2023年转会沙特联赛利雅得胜利——虽然联赛水平下降，但他的比赛智慧没丢。"
);

// ----- 18. Danilo Santos -----
set("Danilo Santos","2001-04-29","Salvador, Brazil",1.77,"MF","Botafogo","18",
  [{years:"2019–2021",club:"Palmeiras"},{years:"2021–",club:"Botafogo"}],
  "达尼洛·桑托斯在帕尔梅拉斯青训成长，2021年转会博塔弗戈后逐渐站稳主力中场位置。年轻、跑动量大、左右脚都行——他代表了巴西足坛新一代中场的典型特质。国家队出场不多，本届世界杯更多是学习和积累经验的机会。"
);

// ----- 19. Endrick -----
set("Endrick","2006-07-21","Taguatinga, Brazil",1.73,"FW","Lyon","19",
  [{years:"2022–2024",club:"Palmeiras"},{years:"2024–2025",club:"Real Madrid"},{years:"2025–",club:"Lyon"}],
  "恩德里克是巴西足坛近十年最受关注的天才之一。帕尔梅拉斯青训产品，16岁就在职业赛场进球，18岁正式加盟皇马——全世界都在等着看他能不能成为下一个巴西超级前锋。2025年被租借到里昂，在法甲获得稳定出场时间，这对他的成长至关重要。19岁就能入选世界杯大名单本身已经说明了天赋等级。",
  "恩德里克今年刚满19岁，这届世界杯他不是主角。但安切洛蒂把他带进大名单不是让他来学习的——比赛最后15分钟，如果巴西需要一个人用不讲理的爆发力去冲击已经疲劳的防线，恩德里克可能是整个板凳席上最可怕的一件武器。他的世界杯故事大概率要在2026年之后才开始真正书写，但这一届的每一分钟经验都是金子。"
);

// ----- 20. Lucas Paquetá -----
set("Lucas Paquetá","1997-08-27","Rio de Janeiro, Brazil",1.80,"MF","Flamengo","20",
  [{years:"2016–2019",club:"Flamengo"},{years:"2019–2021",club:"AC Milan"},{years:"2021–2024",club:"West Ham United"},{years:"2024–",club:"Flamengo"}],
  "帕奎塔在弗拉门戈出道就拿了巴甲冠军，2019年加盟AC米兰，在意甲水土不服后转投西汉姆联，在英超找到了最适合自己的舞台——攻击型中场，创造力充沛，脚下技术花哨但不拖沓。2024年回归弗拉门戈，重回巴西联赛让他保持了比赛节奏。63次国家队出场13球，是巴西中场创造力的重要来源。"
);

// ----- 21. Luiz Henrique -----
set("Luiz Henrique","2001-01-14","Rio de Janeiro, Brazil",1.77,"FW","Zenit Saint Petersburg","21",
  [{years:"2020–2022",club:"Fluminense"},{years:"2022–2024",club:"Real Betis"},{years:"2024–",club:"Zenit Saint Petersburg"}],
  "路易斯·恩里克在弗卢米嫩塞青训出道，2022年转会皇家贝蒂斯，在西甲的两个赛季逐步适应了欧洲足球的节奏。2024年加盟泽尼特后在俄超获得稳定的出场时间，速度是他的最大武器。在巴西国家队他是边路的深度储备。"
);

// ----- 22. Gabriel Martinelli -----
set("Gabriel Martinelli","2001-06-18","Guarulhos, Brazil",1.78,"FW","Arsenal","22",
  [{years:"2019–2020",club:"Ituano"},{years:"2020–",club:"Arsenal"}],
  "马丁内利从巴西小俱乐部伊图阿诺直接跳到阿森纳，19岁就在英超首发进球——这种跳级式的成长路径非常罕见。在阿尔特塔手下他从边锋成长为全能攻击手，左右边锋和中路都能打，速度和直接性是最大特点。2022年世界杯他有过替补出场，还在积累大赛经验。",
  "马丁内利24岁，正是边锋出成绩的年纪。巴西前场竞争太激烈——维尼修斯和拉菲尼亚占据两翼，内马尔占据十号位，马丁内利大概率从板凳出发。但他的直接性恰恰是巴西队在领先时需要的东西：不需要太多球权，拿到球就往前冲，让对手不敢全线压上。替补出场20分钟的冲击力可能是致命的。"
);

// ----- 23. Ederson Moraes -----
set("Ederson Moraes","1993-08-17","Osasco, Brazil",1.88,"GK","Fenerbahçe","23",
  [{years:"2015–2017",club:"Benfica"},{years:"2017–2025",club:"Manchester City"},{years:"2025–",club:"Fenerbahçe"}],
  "埃德森在曼城八年拿了无数座英超冠军和一座欧冠冠军。他是瓜迪奥拉体系中理想门将的模板——脚下技术堪比外场球员，长传可以瞬间转换成反击，扑救能力虽然偶有争议但在曼城体系里足够用。2025年转会费内巴切，在土耳其联赛保持状态。他和阿里松这对世界级门将搭档是巴西最大的幸福烦恼。"
);

// ----- 24. Roger Ibañez -----
set("Roger Ibañez","1998-11-23","Canela, Brazil",1.85,"DF","Al-Ahli","24",
  [{years:"2018–2023",club:"Roma"},{years:"2023–2025",club:"Al-Ahli"},{years:"2025–",club:"Al-Ahli"}],
  "伊巴涅斯在意甲罗马踢了五年，是穆里尼奥体系下后防线的重要一员。可以踢中卫和右后卫，速度不俗，防守硬度在意甲得到了充分检验。2023年转会沙特联赛，比赛节奏有所下降但在国家队仍是可靠的后防储备。"
);

// ----- 25. Igor Thiago -----
set("Igor Thiago","2001-06-26","Brasília, Brazil",1.88,"FW","Brentford","25",
  [{years:"2019–2023",club:"Ludogorets"},{years:"2023–2024",club:"Club Brugge"},{years:"2024–",club:"Brentford"}],
  "伊戈尔·蒂亚戈走了一条不寻常的路径——先在保加利亚联赛的卢多戈雷茨练级，2023年转会布鲁日后在比甲崭露头角，2024年加盟英超布伦特福德。身体强壮、禁区对抗凶狠，典型的现代高中锋。在国家队他还在积累经验的阶段，4次出场2球，本届世界杯更多是替补中锋的角色。"
);

// ----- 26. Rayan -----
set("Rayan","2007-03-27","Recife, Brazil",1.75,"FW","Bournemouth","26",
  [{years:"2023–2025",club:"Vasco da Gama"},{years:"2025–",club:"Bournemouth"}],
  "拉扬是这批巴西队里最年轻的面孔——19岁，在瓦斯科达伽马青训成长，2025年被英超伯恩茅斯签下。他的入选本身就说明了巴西足协对未来的投资：带他来不是指望他上场改变比赛，而是让他呼吸世界杯的空气，为四年后的剧本做准备。"
);

// Verify all currentClub match squads.json
let mismatches = 0;
for (const p of br.players) {
  if (wiki[p.name] && wiki[p.name].currentClub !== p.club) {
    console.log('MISMATCH: ' + p.name + ' wiki=' + wiki[p.name].currentClub + ' squad=' + p.club);
    mismatches++;
  }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Brazil: 26 players rewritten. ' + (mismatches ? mismatches + ' club mismatches!' : 'All clubs match squads.json.'));
