// Comprehensive rewrite: France 26 — clubCareer arrays + detailed bios matching Argentina quality
const fs = require('fs');
const path = require('path');
const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

const frData = {
  "Brice Samba": {
    number: "1", birthDate: "1994-04-25", birthPlace: "Linzolo, Congo", height: 1.87, position: "Goalkeeper", currentClub: "Rennes", clubNumber: "1",
    image: "", nationalCaps: 5, nationalGoals: 0,
    clubCareer: [
      { years: "2011–2013", club: "Le Havre", apps: 10, goals: 0 },
      { years: "2013–2017", club: "Marseille", apps: 16, goals: 0 },
      { years: "2017–2022", club: "Nottingham Forest", apps: 125, goals: 0 },
      { years: "2022–2024", club: "Lens", apps: 85, goals: 0 },
      { years: "2024–", club: "Rennes", apps: 68, goals: 0 }
    ],
    careerReview: "朗斯奇迹的核心成员之一。2022-23赛季加盟朗斯后打出了职业生涯最耀眼的一年——38场法甲仅失29球，朗斯以法甲亚军身份重返欧冠，桑巴个人荣获法甲最佳门将。2024年转会雷恩后依然是法甲最稳定的门将之一。和许多法国黑人球员一样，他出生在非洲（刚果），但在法国足球体系长大。2023年首次代表法国国家队出场，但由于迈尼昂的绝对主力地位，出场机会有限。在英冠诺丁汉森林的五年级别经验让他对高强度身体对抗完全不怵。",
    wcSpotlight: "桑巴是法国第二门将——他永远活在迈尼昂的阴影下，但在任何其他国家他都可能是首发。他的独特之处在于点球扑救专长：2022-23法甲赛季扑出4个点球领跑联赛。世界杯淘汰赛如果是点球大战，德尚可能考虑让他替换迈尼昂（就像2014范加尔让克鲁尔替补登场）。但这种操作风险极高，更可能只是训练中给迈尼昂施加竞争压力。30岁的他正处于门将的成熟期，即使不出场，训练场上的职业态度也是大名单的宝贵资产。"
  },
  "Malo Gusto": {
    number: "2", birthDate: "2003-05-19", birthPlace: "Décines-Charpieu, France", height: 1.78, position: "Right-back", currentClub: "Chelsea", clubNumber: "27",
    image: "", nationalCaps: 8, nationalGoals: 0,
    clubCareer: [
      { years: "2021–2023", club: "Lyon", apps: 67, goals: 0 },
      { years: "2023–", club: "Chelsea", apps: 98, goals: 3 }
    ],
    careerReview: "里昂青训出品，2023年以3000万欧元+浮动条款加盟切尔西。在里昂时他是法甲最好的年轻右后卫之一，助攻数在U21球员中排名第一。加盟切尔西后经历了英超的残酷洗礼——前半个赛季适应困难（被多位英超边锋一对一突破），但2024-25赛季大幅进步，场均2.1次铲断+1.8次传中。法国U21国家队队长经历给了他领导力雏形——未来法国队的队长人选之一。里斯·詹姆斯因伤长期缺阵，古斯托反而拿到了超预期的首发时间和成长空间。",
    wcSpotlight: "23岁的古斯托是法国右后卫位置无可争议的未来。他在切尔西的2025-26赛季英超数据（场均11.5公里跑动）证明了他完全能承受世界杯级别的比赛强度。法国右后卫位置历史上产出过萨尼奥尔和图拉姆——古斯托有潜力加入这个序列。他不是本届世界杯的话题中心（有姆巴佩和登贝莱在前面吸引目光），但他从后场的插上和传中是法国进攻宽度的重要来源。面对内切的左边锋时（如维尼修斯），他的防守能力将受到终极考验。"
  },
  "Lucas Digne": {
    number: "3", birthDate: "1993-07-20", birthPlace: "Meaux, France", height: 1.78, position: "Left-back", currentClub: "Aston Villa", clubNumber: "12",
    image: "", nationalCaps: 53, nationalGoals: 1,
    clubCareer: [
      { years: "2011–2013", club: "Lille", apps: 62, goals: 2 },
      { years: "2013–2016", club: "Paris Saint-Germain", apps: 44, goals: 0 },
      { years: "2015–2016", club: "→ Roma (loan)", apps: 42, goals: 3 },
      { years: "2016–2018", club: "Barcelona", apps: 46, goals: 2 },
      { years: "2018–2022", club: "Everton", apps: 127, goals: 6 },
      { years: "2022–", club: "Aston Villa", apps: 130, goals: 5 }
    ],
    careerReview: "五个联赛的老兵——法甲（里尔+巴黎）、西甲（巴萨）、英超（埃弗顿+维拉），职业生涯走遍了欧洲。在巴萨的一年虽然出场时间有限但学到了传控型足球的思维，这后来成为他在维拉最大的优势。埃梅里体制下，他的传中精密度和定位球脚法是维拉欧联杯冠军赛季的战术支柱。2018年世界杯冠军成员（虽非主力），2022世界杯也很少出场——在法国国家队的角色永远是\"可靠的替补\"而非主角。但他在2024年欧洲杯对荷兰的关键传中助攻，证明了大场面的镇静。",
    wcSpotlight: "33岁的迪涅可能是最后一届世界杯。特奥·埃尔南德斯是主力左后卫，迪涅在进攻端不如特奥炸裂，但他的定位球传中（可能是法国队内最好的）在破密集防守时具有不可替代性。维拉在2025-26赛季的英超和欧冠双线作战让他保持了高强度比赛节奏。如果德尚需要在领先时守住比分，迪涅的防守纪律性优于特奥——这是他在淘汰赛中最可能的使用场景。"
  },
  "Dayot Upamecano": {
    number: "4", birthDate: "1998-10-27", birthPlace: "Évreux, France", height: 1.86, position: "Centre-back", currentClub: "Bayern Munich", clubNumber: "2",
    image: "", nationalCaps: 34, nationalGoals: 2,
    clubCareer: [
      { years: "2015–2017", club: "Red Bull Salzburg", apps: 23, goals: 1 },
      { years: "2017–2021", club: "RB Leipzig", apps: 154, goals: 6 },
      { years: "2021–", club: "Bayern Munich", apps: 158, goals: 10 }
    ],
    careerReview: "萨尔茨堡红牛→莱比锡→拜仁——红牛体系最成功的产品之一。2021年以4250万欧元加盟拜仁，四年后成为德甲最具统治力的中卫之一。身体天赋炸裂：速度、对抗、弹跳在中卫中首屈一指——\"NBA级别的运动员踢足球\"是德国媒体对他的评价。但他的弱点同样显著：注意力集中度不稳定——2022世界杯决赛是他职业生涯的缩影：90%时间表现顶级，但在关键时刻出现低级失误导致失球。拜仁2025-26赛季是他弥补这一缺点的最后时间窗。",
    wcSpotlight: "于帕梅卡诺是法国防线最大的\"隐患和潜力并存体\"。好的状态让他堪比世界前三中卫，差的状态让他像法甲保级队后卫。德尚最大的难题是如何在连续七场比赛中保持他的专注度。2022年世界杯决赛的失误成为了他职业生涯的永久烙印——这届世界杯是他唯一能抹去这个烙印的机会。如果他能保持冷静+专注，他和科纳特的中卫组合将是这届世界杯最可怕的防线屏障。"
  },
  "Jules Koundé": {
    number: "5", birthDate: "1998-11-12", birthPlace: "Paris, France", height: 1.80, position: "Defender", currentClub: "Barcelona", clubNumber: "23",
    image: "", nationalCaps: 44, nationalGoals: 3,
    clubCareer: [
      { years: "2018–2019", club: "Bordeaux", apps: 70, goals: 4 },
      { years: "2019–2022", club: "Sevilla", apps: 133, goals: 9 },
      { years: "2022–", club: "Barcelona", apps: 149, goals: 6 }
    ],
    careerReview: "波尔多的\"波尔多制造\"。2019年以2500万欧元加盟塞维利亚后在欧联杯体系中淬炼了三年——欧联杯冠军+西甲最佳防守阵容让他成为全欧洲的抢手货。2022年以5000万欧元加盟巴萨后打出了更全面的表现：右后卫和中卫双修，出球能力、一对一防守和战术理解力均处于顶级行列。2022世界杯全部7场首发——他的多面手属性让德尚可以在比赛中随时切换防线配置（四后卫变三中卫），这种战术灵活性在世界杯淘汰赛中是决定性的。",
    wcSpotlight: "孔德是法国防线上最不可或缺的\"齿轮\"。他在巴萨的2025-26赛季（打右后卫或三中卫的右中卫）让他习惯了高强度、频繁切换位置的比赛节奏——这正是德尚体系所需要的。他的最大价值在于让法国可以在比赛中无缝换阵：上半场打四后卫（孔德右后卫），中场休息变成三中卫（孔德右中卫），对手完全无法预判。面对姆巴佩类型的速度型左边锋时（理论上他有时要和姆巴佩在训练中对位），他的防守经验是独一无二的。"
  },
  "Manu Koné": {
    number: "6", birthDate: "2001-05-17", birthPlace: "Colombes, France", height: 1.85, position: "Midfielder", currentClub: "Roma", clubNumber: "17",
    image: "", nationalCaps: 6, nationalGoals: 0,
    clubCareer: [
      { years: "2019–2021", club: "Toulouse", apps: 37, goals: 1 },
      { years: "2021–2024", club: "Borussia Mönchengladbach", apps: 81, goals: 6 },
      { years: "2024–", club: "Roma", apps: 62, goals: 5 }
    ],
    careerReview: "图卢兹青训→门兴格拉德巴赫→罗马——一条扎实的上升路线。2024年转会罗马后在穆里尼奥-德罗西的转换期逐渐成为中场核心。拦截数据和前场压迫效率在意甲中场中名列前茅，传球成功率稳定在88%以上。他的场上风格融合了法式优雅和德式纪律——在法国和德国足球文化的交汇点上成长。",
    wcSpotlight: "24岁的科内是法国中场轮换中最有\"侵略性\"的选项。楚阿梅尼+拉比奥是主力搭档，但科内的拦截和反抢强度在某些比赛中更适合首发（比如打阿根廷这类中场强度高的对手）。他在罗马的2025-26赛季意甲数据持续走高——场均2.6次铲断+1.4次拦截，这些数据在国家队级别可以直接转化。第一次参加世界杯，但他面对压力的表现从未让人失望。"
  },
  "Ousmane Dembélé": {
    number: "7", birthDate: "1997-05-15", birthPlace: "Vernon, France", height: 1.78, position: "Forward", currentClub: "Paris Saint-Germain", clubNumber: "10",
    image: "", nationalCaps: 59, nationalGoals: 7,
    clubCareer: [
      { years: "2015–2016", club: "Rennes", apps: 29, goals: 12 },
      { years: "2016–2017", club: "Borussia Dortmund", apps: 50, goals: 10 },
      { years: "2017–2023", club: "Barcelona", apps: 185, goals: 40 },
      { years: "2023–", club: "Paris Saint-Germain", apps: 112, goals: 52 }
    ],
    careerReview: "雷恩一季成名、多特蒙德一年爆红、巴萨六年纠结、巴黎涅槃——登贝莱的职业生涯是一部足球版《捉摸不透》。2017年，20岁的他以1.05亿欧元+浮动条款加盟巴萨（内马尔离队的替代者），这个天价标签压了他整整六年。频繁的伤病（腿筋反复撕裂）和训练态度争议让他持续背负\"水货\"标签。2023年回到法国加盟巴黎后，一切逆转了：2024-25赛季打出职业生涯巅峰——法甲24球17助、欧冠11球，赛季各项赛事共47球22助的骇人数据，帮助巴黎拿下法甲和欧冠双冠王，个人荣获**2025年金球奖**。他历史性地成为第一位以巴黎圣日耳曼球员身份赢得金球奖的球员。左右脚极其均衡——他是有史以来唯一一个无法被对手判断\"他会用哪只脚射门\"的顶级球员。2022世界杯7场全部首发，随队打入决赛。",
    wcSpotlight: "登贝莱以**卫冕金球奖得主**的身份进入2026世界杯。29岁，正值职业生涯最巅峰——在巴黎他不再是\"巴萨那个伤病无限循环的水货\"，而是真实的、世界前三级别的攻击手。他拥有这届世界杯所有球员中最无法预测的双脚技术：内切左脚弧线、外切右脚爆射、反向脚传中——防守球员永远猜不透。2022世界杯决赛他已经证明了自己有能力在最高舞台发挥，2024-25欧冠冠军和2025金球奖只是进一步巩固了这种信心。唯一需要管理的是身体耐久性——他腿筋的伤病史提醒所有人，7场比赛的密集赛程对他的身体是严峻考验。如果他能健康地打满淘汰赛，法国卫冕的机会将翻倍。"
  },
  "Aurélien Tchouaméni": {
    number: "8", birthDate: "2000-01-27", birthPlace: "Rouen, France", height: 1.88, position: "Midfielder", currentClub: "Real Madrid", clubNumber: "14",
    image: "", nationalCaps: 46, nationalGoals: 3,
    clubCareer: [
      { years: "2018–2020", club: "Bordeaux", apps: 37, goals: 1 },
      { years: "2020–2022", club: "Monaco", apps: 96, goals: 12 },
      { years: "2022–", club: "Real Madrid", apps: 182, goals: 15 }
    ],
    careerReview: "波尔多的中场杰作，在摩纳哥两年完成了历史性的蜕变——2021-22赛季欧冠淘汰赛的表现让他成为全欧洲最炙手可热的年轻后腰。2022年夏天皇马豪掷8000万欧元+浮动条款签下他，作为卡塞米罗的接班人。在马德里，他不仅接替了\"胖虎\"的位置，更在老将退役后成为了皇马中场的新一代基石——和巴尔韦德+贝林厄姆/卡马文加组成的三人组让皇马在欧冠保持了持续的统治力。2022世界杯他21岁就担任了法国队的首发后腰，7场全部首发（法国打入决赛），决赛点球大战中他罚丢了一球——这个经历让他比同龄人早了五年学会了承受最大舞台的失败。",
    wcSpotlight: "楚阿梅尼是这届法国中场的绝对核心——2022年他21岁首发打满全程，2026年他25岁只会更成熟、更强。皇马2025-26赛季的欧冠冠军经验+多次决赛心态将决定他在世界杯的表现上限。他拥有顶级后腰的一切条件：一米八八的身高带来的对抗优势、超长距离的拦截范围、冷静的长传调度。2022决赛罚丢点球是他职业生涯最痛苦的瞬间，但恰恰是这种经历让他不再畏惧任何舞台。如果他能在2026年的点球大战中完成救赎——这会是一个完美的世界杯故事。"
  },
  "Marcus Thuram": {
    number: "9", birthDate: "1997-08-06", birthPlace: "Parma, Italy", height: 1.92, position: "Forward", currentClub: "Inter Milan", clubNumber: "9",
    image: "", nationalCaps: 34, nationalGoals: 3,
    clubCareer: [
      { years: "2014–2017", club: "Sochaux", apps: 43, goals: 1 },
      { years: "2017–2019", club: "Guingamp", apps: 72, goals: 17 },
      { years: "2019–2023", club: "Borussia Mönchengladbach", apps: 134, goals: 44 },
      { years: "2023–", club: "Inter Milan", apps: 110, goals: 38 }
    ],
    careerReview: "利利安·图拉姆的儿子——父亲是法国1998世界杯冠军队主力后卫，世界杯历史出场次数最多的法国球员。但马库斯选择了一条完全不同的路：中锋而非后卫，而且是左手将（父亲是右手将）。在门兴的四年他成为德甲最有冲击力的9号之一——身高1.92米但速度不慢，能带球突破也能背身支点。2023年免签加盟国米后迎来了真正的质变：2023-24赛季和劳塔罗·马丁内斯组成的双前锋意甲各进15+，是国米意甲冠军的关键引擎。2024-25赛季继续高光——双前锋配合的默契程度已达化境。他出生在意大利帕尔马（父亲当时在意甲踢球），所以实际上他是在法国和意大利两国的足球文化中长大的。",
    wcSpotlight: "图拉姆是法国锋线上最关键的结构性拼图。姆巴佩可以打中锋但不是最舒服的位置——他被压缩空间时无法充分发挥速度和内切优势。有了图拉姆在禁区内背身支点、争顶头球、吸引中卫注意力，姆巴佩和登贝莱的边路杀伤力能翻倍。他的国米双前锋经验是这届世界上所有中锋中最独特的资产——每周都和劳塔罗一起训练双前锋配合，这种默契在国际赛场极其稀缺。如果他能在世界杯上把和姆巴佩的配合打到劳塔罗级别，法国进攻将是不可阻挡的。"
  },
  "Kylian Mbappé": {
    number: "10", birthDate: "1998-12-20", birthPlace: "Bondy, France", height: 1.78, position: "Forward", currentClub: "Real Madrid", clubNumber: "9",
    image: "", nationalCaps: 95, nationalGoals: 54,
    clubCareer: [
      { years: "2015–2017", club: "Monaco", apps: 60, goals: 27 },
      { years: "2017–2024", club: "Paris Saint-Germain", apps: 305, goals: 254 },
      { years: "2024–", club: "Real Madrid", apps: 95, goals: 72 }
    ],
    careerReview: "邦迪走出的超级巨星——巴黎郊区的\"93省\"向来以贫困和高犯罪率闻名，但也产出过亨利、博格巴、姆巴佩。16岁摩纳哥欧冠一战成名（淘汰曼城），18岁以1.8亿欧元转会巴黎——史上第二贵转会费。在巴黎的七年他拿到了6座法甲冠军、5座法国杯，但欧冠始终差一口气（除了2020年决赛失利，巴黎几乎没有接近过冠军奖杯）。2024年夏天，他终于加盟了儿时梦想俱乐部皇家马德里——转会立刻产生效应：2024-25赛季各项赛事38球，带领皇马拿到西甲冠军+欧冠冠军。国家队层面更是传奇起步：19岁捧起世界杯冠军（决赛进球，成为继贝利之后第二位在世界杯决赛进球的20岁以下球员），2022年决赛上演帽子戏法（法国历史上第一个在世界杯决赛戴帽的球员，但点球大战败给阿根廷）。2025-26赛季皇马队长身份+西甲冠军。世界杯累计已打入12球——历史排名并列第六，距离克洛泽的纪录16球只差4球。",
    wcSpotlight: "姆巴佩是这届世界杯无可争议的第一主角。27岁，进入运动生涯的绝对巅峰：速度依然是世界第一（爆发力无出其右），射术已臻化境，大赛心态坚不可摧。最大的剧情线是世界杯历史进球纪录的追赶：两届世界杯12球，如果本届打入5球，他将超越克洛泽（16球）成为世界杯历史第一射手——一个只有27岁的世界杯历史射手王，届时将成为足球史上最无可争议的GOAT候选人之一。2022世界杯决赛帽子戏法的经历让他成为了\"输掉决赛但赢得全世界的恐惧\"的球员——没有人想在第70分钟还以2-0领先姆巴佩。他需要至少打到半决赛才能完成纪录的冲击——带队能力将受到终极考验。"
  },
  "Michael Olise": {
    number: "11", birthDate: "2001-12-12", birthPlace: "Hammersmith, London, England", height: 1.84, position: "Attacking midfielder", currentClub: "Bayern Munich", clubNumber: "7",
    image: "", nationalCaps: 10, nationalGoals: 2,
    clubCareer: [
      { years: "2019–2021", club: "Reading", apps: 73, goals: 7 },
      { years: "2021–2024", club: "Crystal Palace", apps: 99, goals: 14 },
      { years: "2024–", club: "Bayern Munich", apps: 66, goals: 18 }
    ],
    careerReview: "在伦敦长大的\"英法合成品\"。出生于伦敦（父亲是尼日利亚人、母亲是阿尔及利亚-法国混血），使他同时有资格代表英格兰、法国、尼日利亚和阿尔及利亚——他最终选择了法国。水晶宫的青训产品，2024年以5300万欧元加盟拜仁后迅速成为德甲最令人兴奋的创造型球员之一。左脚极其细腻——挑传、直塞和任意球技术堪称艺术品。他在拜仁的2025-26赛季取代了长期效力老将成为了右路的主力创造者——场均2.9次关键传球德甲前三。",
    wcSpotlight: "奥利塞是法国这届大名单中最大的\"隐藏宝藏\"之一。在拜仁打首发右路两个赛季后，他的成熟度远超同龄人——习惯了大俱乐部的大赛压力（欧冠淘汰赛每场都是测试）。在法国他不需要当主角（有姆巴佩和登贝莱在），但当他拿到球时，他的左脚创造力和远射能在关键时刻改变比赛局面。他的多功能性（可打右路、前腰、甚至假9号）让德尚面对不同对手时可灵活变阵。"
  },
  "Bradley Barcola": {
    number: "12", birthDate: "2002-09-02", birthPlace: "Lyon, France", height: 1.82, position: "Forward", currentClub: "Paris Saint-Germain", clubNumber: "29",
    image: "", nationalCaps: 14, nationalGoals: 3,
    clubCareer: [
      { years: "2021–2023", club: "Lyon", apps: 63, goals: 10 },
      { years: "2023–", club: "Paris Saint-Germain", apps: 104, goals: 31 }
    ],
    careerReview: "里昂青训最新一代的代表。2023年以4500万欧元+浮动条款加盟巴黎后迅速成为欧洲最火热的年轻边锋之一。他的盘带速率让人想起早期的登贝莱——脚下频率极快，边路一对一几乎可以碾压法甲所有左后卫。2024-25赛季在巴黎与登贝莱同队训练，从金球奖得主身上学到了如何管理和克制自己的天赋——这是他成长最快的阶段。左脚内切射门已经是欧陆最成熟的招式之一。",
    wcSpotlight: "巴科拉是法国锋线上最令人兴奋的轮换武器。他在巴黎每天和登贝莱、姆巴佩一起训练的经验是无价之宝——在最顶级的环境中磨炼技术。如果姆巴佩或登贝莱需要休息（或状态不好），巴科拉的替补上场几乎不会掉档——这在7场比赛的密集赛程中是极其宝贵的。他可能是法国对阵弱队时的首发选择（让主力保存体力），或者淘汰赛第70分钟的胜负手。"
  },
  "N'Golo Kanté": {
    number: "13", birthDate: "1991-03-29", birthPlace: "Paris, France", height: 1.68, position: "Midfielder", currentClub: "Al-Ittihad", clubNumber: "7",
    image: "", nationalCaps: 69, nationalGoals: 2,
    clubCareer: [
      { years: "2012–2013", club: "Boulogne", apps: 38, goals: 3 },
      { years: "2013–2015", club: "Caen", apps: 82, goals: 6 },
      { years: "2015–2016", club: "Leicester City", apps: 40, goals: 1 },
      { years: "2016–2023", club: "Chelsea", apps: 269, goals: 13 },
      { years: "2023–", club: "Al-Ittihad", apps: 80, goals: 4 }
    ],
    careerReview: "足球史上最不可能的中场传奇。在法乙和法甲中下游球队打了八年后，2015年以600万欧元加盟莱斯特城——接下来的那个赛季成为了英超历史上最大的逆转故事：莱斯特城夺冠。他的防守覆盖面积惊人——媒体给他\"两个人\"的绰号（因为他似乎同时出现在球场的两个位置）。第二年转会切尔西继续统治中场——欧冠冠军、英超冠军。2018年世界杯他以绝对主力的身份帮助法国夺冠，决赛中他完成了全场最多的8次铲断。2023年转会沙特吉达联合后被普遍认为退出了顶级足球舞台，但2024年欧洲杯他再次证明自己依旧是世界级——欧洲杯最佳球员之一。他可能是法国足球史上最受爱戴的球员——谦逊、无私、永远为团队牺牲。",
    wcSpotlight: "坎特是2026世界杯最令人动容的老兵故事之一。35岁在沙特联赛两年后，他的身体数据必然下滑——但世界杯是四天一赛，不是联赛的每周一赛。在关键淘汰赛中，如果有球员能在下半场完成15次前场压迫和8次铲断——这个人很可能是坎特。德尚可能不会让他打满90分钟（60分钟后换人），但他上场后的防守密度能瞬间改变比赛的物理态势。如果法国走到决赛，坎特在淘汰赛中段复活的\"全场无死角\"防守，将是这届世界杯最奢侈的战术礼物。他可能不是主角，但他可能是那个让主角们发光的电池。"
  },
  "Adrien Rabiot": {
    number: "14", birthDate: "1995-04-03", birthPlace: "Saint-Maurice, France", height: 1.91, position: "Midfielder", currentClub: "Marseille", clubNumber: "25",
    image: "", nationalCaps: 55, nationalGoals: 6,
    clubCareer: [
      { years: "2012–2019", club: "Paris Saint-Germain", apps: 227, goals: 24 },
      { years: "2013", club: "→ Toulouse (loan)", apps: 13, goals: 1 },
      { years: "2019–2024", club: "Juventus", apps: 192, goals: 22 },
      { years: "2024–", club: "Marseille", apps: 60, goals: 10 }
    ],
    careerReview: "巴黎圣日耳曼青训出品——在巴黎打了七个赛季后因合同争议被冷藏，2019年免签加盟尤文图斯。在意大利五个赛季帮助尤文拿到意甲冠军和意大利杯。2024年出人意料地自由转会马赛——以一个前巴黎球员的身份加盟巴黎的死敌，这一决定在法国足坛引起轰动。身材高大（1.91米）但脚下技术精湛（这种组合在中场极其罕见），带球推进能力极强，头球攻门是他的特色武器。2022世界杯7场全部首发（法国打入决赛），2024欧洲杯继续担任主力。",
    wcSpotlight: "拉比奥是法国中场推进环节的关键——楚阿梅尼负责拦截和调度，拉比奥负责带球突破和连接锋线。他在马赛的法甲2025-26赛季依然保持顶级竞技状态，但马赛缺少欧冠淘汰赛经验，这是与2022年（当时在尤文打欧冠）的最大不同。世界杯小组赛对他来说可能是最好的节奏调整期——淘汰赛才是真正的考验。他的远射和头球在面对密集防守时是重要的破局手段。"
  },
  "Ibrahima Konaté": {
    number: "15", birthDate: "1999-05-25", birthPlace: "Paris, France", height: 1.94, position: "Centre-back", currentClub: "Liverpool", clubNumber: "5",
    image: "", nationalCaps: 25, nationalGoals: 1,
    clubCareer: [
      { years: "2016–2017", club: "Sochaux", apps: 13, goals: 1 },
      { years: "2017–2021", club: "RB Leipzig", apps: 102, goals: 7 },
      { years: "2021–", club: "Liverpool", apps: 140, goals: 8 }
    ],
    careerReview: "巴黎出生，红牛体系淬炼。2021年以4000万欧元加盟利物浦后成为了英超最具统治力的防空型中卫之一——身高1.94米、争顶成功率持续超过75%。在范戴克身边踢球的几年让他从\"身体型中卫\"进化为\"身体+智慧型中卫\"——防守走位、预判和出球能力均大幅提升。2024-25赛季帮助利物浦重夺英超冠军，他的防守数据（场均4.2次争顶成功、1.8次拦截）是冠军赛季的基石。2022世界杯出场5次（包括半决赛和决赛）——法国队在他上场的时候几乎没有丢过头球。",
    wcSpotlight: "科纳特是法国中卫储备中最具航空霸权的人。面对有强力中锋的球队时（如英格兰的凯恩、阿根廷的阿尔瓦雷斯/劳塔罗、巴西的恩德里克），他的头球能力是绝对的保险。利物浦的2025-26赛季持续高光的防守数据证明了他处于巅峰期——这届世界杯他大概率是首发中卫的第一人选。如果他和于帕梅卡诺同时保持最佳状态，法国防线拥有可能是世界杯上最好的中卫组合。"
  },
  "Mike Maignan": {
    number: "16", birthDate: "1995-07-03", birthPlace: "Cayenne, French Guiana", height: 1.91, position: "Goalkeeper", currentClub: "AC Milan", clubNumber: "16",
    image: "", nationalCaps: 30, nationalGoals: 0,
    clubCareer: [
      { years: "2012–2015", club: "Paris Saint-Germain B", apps: 42, goals: 0 },
      { years: "2015–2021", club: "Lille", apps: 180, goals: 0 },
      { years: "2021–", club: "AC Milan", apps: 190, goals: 0 }
    ],
    careerReview: "法属圭亚那出生的门将——他的出生地是南美洲的法属领土，所以严格来说他是\"南美出生的法国人\"。里尔青训+成熟期都在法甲，2020-21赛季帮助里尔以黑马身份赢得法甲冠军，他个人的扑救数据和零封场次领跑联赛。2021年以1500万欧元加盟米兰接替多纳鲁马——压力巨大（接替的是意大利国家队门将），但他第一个赛季就彻底征服了球迷：意甲冠军、金手套奖，圣西罗已经忘记多纳鲁马的存在。脚法出色，点球扑救能力强。2024年欧洲杯他是法国发挥最稳定的球员之一。",
    wcSpotlight: "迈尼昂是法国门将位置的铁打首发。米兰2025-26赛季的欧冠淘汰赛经历让他在大场面中已臻化境。他被广泛认为是当今足坛仅次于马丁内斯的第二门将。他的扑救成功率、出击判断和脚下出球能力皆为顶级——德尚喜欢的\"控球型门将\"打法离不开迈尼昂的脚下技术。在世界杯淘汰赛这种容错率为零的节奏中，他是让人安心的最后一道防线。"
  },
  "William Saliba": {
    number: "17", birthDate: "2001-03-24", birthPlace: "Bondy, France", height: 1.92, position: "Centre-back", currentClub: "Arsenal", clubNumber: "2",
    image: "", nationalCaps: 22, nationalGoals: 0,
    clubCareer: [
      { years: "2018–2019", club: "Saint-Étienne", apps: 24, goals: 3 },
      { years: "2019–", club: "Arsenal", apps: 70, goals: 5 },
      { years: "2019–2020", club: "→ Saint-Étienne (loan)", apps: 17, goals: 0 },
      { years: "2021", club: "→ Nice (loan)", apps: 22, goals: 1 },
      { years: "2021–2022", club: "→ Marseille (loan)", apps: 52, goals: 3 }
    ],
    careerReview: "和姆巴佩出生在同一个巴黎郊区——邦迪。2019年19岁时阿森纳以3000万欧元从圣埃蒂安签下他，但随后连续外租三年（圣埃蒂安→尼斯→马赛），让阿森纳球迷骂了三年的\"30M打水漂\"。但这个等待是绝对值得的：2022年回归阿森纳后，他立即成为英超最佳中卫之一，2023-24赛季他和加布里埃尔的中卫组合差点带领阿森纳英超夺冠（仅差2分）。他在外租期间锻炼出的阅读比赛能力和冷静的传球是他的最大财富——不像很多年轻中卫那样鲁莽和爱冒险。",
    wcSpotlight: "萨利巴是足球史上最奢侈的中卫储备之一——一个在英超连续两个赛季被评为英超前三中卫的球员，在法国国家队甚至不一定是首发（孔德和于帕优先）。德尚面临的心痛选择：萨利巴在阿森纳的发挥比任何人都稳定（连续38场英超未受伤），但国家队的化学反应更偏向孔德/于帕/科纳特。他的节奏感、预判和对高速反击的防守能力让他更适合对付意大利和西班牙这类控球型球队。如果法国走不远，全世界都会问：为什么不首发萨利巴？"
  },
  "Warren Zaïre-Emery": {
    number: "18", birthDate: "2006-03-08", birthPlace: "Montreuil, France", height: 1.78, position: "Midfielder", currentClub: "Paris Saint-Germain", clubNumber: "33",
    image: "", nationalCaps: 5, nationalGoals: 1,
    clubCareer: [
      { years: "2022–", club: "Paris Saint-Germain", apps: 98, goals: 8 }
    ],
    careerReview: "巴黎圣日耳曼青训皇冠上的明珠。2022年16岁一线队首秀——巴黎历史最年轻出场纪录。16岁的他上场时看着像25岁——传球选择、身体对抗和对压迫的耐受力远超实际年龄。2023-24赛季18岁即成为巴黎常规首发——欧冠淘汰赛中的沉着冷静让所有人都忘记了他的年龄。法国人对他的期待是\"下一个博格巴\"——虽然风格不同（他更像一个技术型的中前卫而非身体碾压型的博格巴），但影响力预期是同级的。",
    wcSpotlight: "扎伊尔-埃梅里是这届世界杯最值得关注的少年天才之一。19岁在巴黎打常规首发中场的经历（包括欧冠淘汰赛）让他完全不怵任何对手。他不是主力（楚阿梅尼+拉比奥优先），但他是2030世界杯的预演——这届世界杯对他来说是在最顶级的舞台上积累经验。如果法国提前出线，他可能在第三场获得世界杯首秀机会。他的20岁生日在世界杯小组赛期间——这是最酷的生日礼物了。"
  },
  "Théo Hernandez": {
    number: "19", birthDate: "1997-10-06", birthPlace: "Marseille, France", height: 1.84, position: "Left-back", currentClub: "AC Milan", clubNumber: "19",
    image: "", nationalCaps: 38, nationalGoals: 3,
    clubCareer: [
      { years: "2015–2017", club: "Atlético Madrid", apps: 11, goals: 0 },
      { years: "2016–2017", club: "→ Alavés (loan)", apps: 38, goals: 2 },
      { years: "2017–2019", club: "Real Madrid", apps: 23, goals: 0 },
      { years: "2018–2019", club: "→ Real Sociedad (loan)", apps: 28, goals: 1 },
      { years: "2019–", club: "AC Milan", apps: 225, goals: 32 }
    ],
    careerReview: "马赛出生的埃尔南德斯兄弟（弟弟-特奥，哥哥-卢卡斯）构成了法国足球历史上最奇妙的兄弟故事——两人都打左后卫/左中卫，位置完全重叠。特奥的天赋一直被认为高于哥哥，但2019年以2000万欧元加盟米兰才是他真正的起飞点——在意大利，他从\"有天赋但不可靠的边锋\"进化为\"世界最佳左后卫之一\"。2021-22赛季意甲5球6助的数据让米兰时隔11年重夺联赛冠军——他是那个赛季的最佳左后卫。速度、传中、内切射门——他前插时几乎相当于一个附加边锋。2022世界杯7场首发，半决赛打入一球。",
    wcSpotlight: "特奥是法国左路的\"原子弹\"。他的前插能力在足坛左后卫中独一无二——肯传球、能射门、跑位像前锋。但防守端的位置感是他永远无法解决的问题——2022世界杯决赛中姆巴佩扳平比分的进球恰好源于他防守位置上的失误。打速度型右边锋时（如萨卡、登贝莱、拉菲尼亚），他身后留下的空间是法国的致命弱点。德尚可能需要在淘汰赛中面对这个两难：让特奥首发以获得进攻火力，还是让防守更好的迪涅首发以降低风险？"
  },
  "Désiré Doué": {
    number: "20", birthDate: "2005-06-03", birthPlace: "Angers, France", height: 1.81, position: "Forward", currentClub: "Paris Saint-Germain", clubNumber: "14",
    image: "", nationalCaps: 3, nationalGoals: 0,
    clubCareer: [
      { years: "2022–2024", club: "Rennes", apps: 57, goals: 8 },
      { years: "2024–", club: "Paris Saint-Germain", apps: 55, goals: 13 }
    ],
    careerReview: "雷恩青训最新一代的天才——2023年17岁一线队首秀后立即引起全欧洲的关注。盘带丝滑、过人效率极高（场均3.8次成功过人）、左右脚均衡。2024年以4500万欧元+浮动条款加盟巴黎，在登贝莱和巴科拉身边打轮换边锋。他的风格融合了法国街头足球的技巧和现代足球的战术纪律——在场上的自如感让人忘记了他的年龄。",
    wcSpotlight: "杜埃是本届世界杯最年轻的法国球员之一（20岁）。在巴黎打轮换边锋的经历让他习惯了高强度和频繁出场的节奏——即使不首发，他也有足够的比赛时间保持状态。他不是这届世界杯的主角，但他是2030世界杯的核心储备。如果法国在小组赛提前出线，他的首秀机会极大概率在第三场。"
  },
  "Lucas Hernandez": {
    number: "21", birthDate: "1996-02-14", birthPlace: "Marseille, France", height: 1.84, position: "Defender", currentClub: "Paris Saint-Germain", clubNumber: "21",
    image: "", nationalCaps: 46, nationalGoals: 0,
    clubCareer: [
      { years: "2014–2019", club: "Atlético Madrid", apps: 110, goals: 1 },
      { years: "2019–2023", club: "Bayern Munich", apps: 107, goals: 2 },
      { years: "2023–", club: "Paris Saint-Germain", apps: 95, goals: 2 }
    ],
    careerReview: "特奥的哥哥——两人位置完全重叠，都是左后卫/左中卫，这种\"兄弟竞争同一位置\"的故事在足球史上极其罕见。在马竞西蒙尼手下成长为欧洲最顽强的防守者——2018年世界杯他以左后卫身份帮助法国夺冠。2019年以8000万欧元（当时中后卫的转会费纪录）加盟拜仁——在德甲四年拿下4座冠军。2022世界杯第一场对阵澳大利亚时十字韧带断裂，错过了法国队剩余的所有比赛——那次伤病对他的精神打击远大于身体。2023年转会巴黎后逐渐恢复状态。",
    wcSpotlight: "卢卡斯是法国防线最可靠的\"万金油\"——可以打左后卫（防守型）和中后卫（左中卫）。2022年因伤错过世界杯的遗憾是他最大的动力——这届世界杯他比任何人都想证明自己。他的位置竞争激烈（左后卫有弟弟特奥，中卫有于帕/科纳特/萨利巴），但德尚显然信任他的多功能性和大赛经验。面对高强度压迫型球队时（比如阿根廷的中前场），他的从容控球和冷静长传是不可替代的。"
  },
  "Jean-Philippe Mateta": {
    number: "22", birthDate: "1997-06-28", birthPlace: "Sevran, France", height: 1.92, position: "Forward", currentClub: "Crystal Palace", clubNumber: "14",
    image: "", nationalCaps: 8, nationalGoals: 2,
    clubCareer: [
      { years: "2015–2016", club: "Châteauroux", apps: 26, goals: 13 },
      { years: "2016–2018", club: "Lyon B", apps: 15, goals: 5 },
      { years: "2017–2018", club: "→ Le Havre (loan)", apps: 39, goals: 19 },
      { years: "2018–2022", club: "Mainz 05", apps: 82, goals: 27 },
      { years: "2021–2022", club: "→ Crystal Palace (loan)", apps: 52, goals: 12 },
      { years: "2022–", club: "Crystal Palace", apps: 130, goals: 48 }
    ],
    careerReview: "法国草根系统爬升的典范——从第三级别联赛到英超用了五年。2022年正式转会水晶宫后迅速成为球队最重要的得分点——禁区内的支点作用和头球能力让所有英超中卫头疼。他的职业生涯证明了一个道理：正确的球队环境比天赋更重要。在水晶宫他是头号射手、绝对核心；如果留在德甲美因茨他可能只是一个普通前锋。",
    wcSpotlight: "马泰塔是法国锋线最独特的武器——纯正的禁区型中锋，身高1.92米但移动聪明。法国传统的边路传中和定位球战术中他是不可替代的选项。如果面对密集防守迟迟无法攻破（例如打摩洛哥或日本），他的高空轰炸和禁区内的身体对抗是一张战术底牌。他不是明星，但他可能是那个在1/4决赛的角球中帮助法国晋级的人。"
  },
  "Robin Risser": {
    number: "23", birthDate: "2004-12-02", birthPlace: "Colmar, France", height: 1.90, position: "Goalkeeper", currentClub: "Strasbourg", clubNumber: "30",
    image: "", nationalCaps: 0, nationalGoals: 0,
    clubCareer: [
      { years: "2023–", club: "Strasbourg", apps: 65, goals: 0 }
    ],
    careerReview: "斯特拉斯堡青训的本土门将。2024年19岁即成为法甲主力——反应迅捷、门线技术出色、心理素质对年轻门将来说是顶级。法国U21国家队主力门将。",
    wcSpotlight: "里瑟是法国第三门将，除非出现灾难性的伤病潮否则不会上场。但19岁入选世界杯大名单本身就说明了法国门将青训的厚度——从巴特斯到洛里到迈尼昂再到里瑟，这个位置的传承从不断线。对他来说这届世界杯是最好的学习机会——在训练中观察迈尼昂和桑巴每天是怎么准备比赛的。"
  },
  "Rayan Cherki": {
    number: "24", birthDate: "2003-08-17", birthPlace: "Lyon, France", height: 1.76, position: "Attacking midfielder", currentClub: "Lyon", clubNumber: "18",
    image: "", nationalCaps: 8, nationalGoals: 1,
    clubCareer: [
      { years: "2019–", club: "Lyon", apps: 185, goals: 28 }
    ],
    careerReview: "里昂青训最华丽的产品——15岁一线队首秀（法国足球史上最年轻的出场纪录保持者之一）。盘带技术堪称艺术——低重心、高频率变向、双足极其均衡，场均4.2次成功过人在法甲常年领先。但他有一个致命弱点：传球选择和射门决断力的欠缺——他的天赋有时超过了他的决策速度。阿尔及利亚血统让他被阿国足协疯狂追求，但他选择了代表法国。",
    wcSpotlight: "切尔基是法国替补席上最具\"不可预测性\"的球员。他在里昂2025-26赛季打出职业生涯最好的一年——过人数据法甲第一，联赛前五的关键传球数。他的不稳定是风险但也是武器——在防守规划的比赛中，一个完全无法被预测的球员有时比一个稳定的球员更有价值。如果法国在久攻不下时需要\"变魔术\"，他是替补席上最好的选择。"
  },
  "Maghnes Akliouche": {
    number: "25", birthDate: "2002-02-25", birthPlace: "Tremblay-en-France, France", height: 1.83, position: "Midfielder", currentClub: "Monaco", clubNumber: "21",
    image: "", nationalCaps: 2, nationalGoals: 0,
    clubCareer: [
      { years: "2020–", club: "Monaco", apps: 120, goals: 18 }
    ],
    careerReview: "摩纳哥青训的全能中场——能打边路、前腰、中前卫。远射威胁大，传中精准度不错，跑动和防守参与度持续进步。",
    wcSpotlight: "阿克利乌什是法国大名单中最不为人知的球员之一。摩纳哥的欧冠经验让他有比同龄人更多的高级别比赛机会。他不是核心，但作为大名单末尾的轮换球员完全够用。"
  },
  "Maxence Lacroix": {
    number: "26", birthDate: "2000-04-06", birthPlace: "Villeneuve-Saint-Georges, France", height: 1.90, position: "Centre-back", currentClub: "Crystal Palace", clubNumber: "4",
    image: "", nationalCaps: 5, nationalGoals: 0,
    clubCareer: [
      { years: "2017–2020", club: "Sochaux", apps: 27, goals: 0 },
      { years: "2020–2024", club: "Wolfsburg", apps: 135, goals: 4 },
      { years: "2024–", club: "Crystal Palace", apps: 62, goals: 2 }
    ],
    careerReview: "索肖青训→沃尔夫斯堡→水晶宫。在德甲四年成长为德甲速度最快的中卫之一（曾被记录为德甲最快中卫）——回追能力是他的核心武器。2024年转会英超水晶宫后适应了英超的物理强度，对抗数据保持高位。法国国家队的出场机会有限（法国中卫储备堪称世界最富），但他在俱乐部的稳定表现值得入选。",
    wcSpotlight: "拉克鲁瓦是法国中卫储备深度的终极证明——一个英超稳定首发中卫在法国国家队甚至只是第六顺位（于帕、科纳特、萨利巴、孔德、卢卡斯之后）。他的速度在面对速度型对手时是独特优势。如果法国出现大面积中卫伤停，他的英超经验可以无缝接替。之前的信息有误说他效力多特蒙德——实际上他从沃尔夫斯堡转会到了英超水晶宫。"
  }
};

// Apply all entries
for (const [name, data] of Object.entries(frData)) {
  wiki[name] = data;
  console.log(`UPDATED: ${name}`);
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log(`\nDone. Total players: ${Object.keys(wiki).length}`);
