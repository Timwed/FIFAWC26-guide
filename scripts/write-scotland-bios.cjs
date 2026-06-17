const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

data['Angus Gunn'] = {
  number: "1",
  fullName: "Angus Gunn",
  position: "Goalkeeper",
  currentClub: "Nottingham Forest",
  nationalCaps: 22,
  nationalGoals: 0,
  clubCareer: [
    { years: "2017–2021", club: "Norwich City" },
    { years: "2021–2024", club: "Southampton" },
    { years: "2023–2024", club: "Norwich City (loan)" },
    { years: "2024–", club: "Nottingham Forest" }
  ],
  careerReview: "诺维奇青训出身，父亲布莱恩·冈恩是苏格兰前国门。2021年转会南安普顿后在英超站稳脚跟，2024年加盟诺丁汉森林成为主力门将。身材高大、制空出色，22次国家队出场贡献多次关键扑救。",
  wcSpotlight: "28岁的冈恩正处于门将黄金年龄，首次代表苏格兰征战世界杯，将是克拉克三中卫体系最后一道保险锁。面对巴西锋线时他的门线反应将经受顶级考验。"
};

data['Aaron Hickey'] = {
  number: "2",
  fullName: "Aaron Hickey",
  position: "Defender",
  currentClub: "Brentford",
  nationalCaps: 21,
  nationalGoals: 0,
  clubCareer: [
    { years: "2019–2020", club: "Heart of Midlothian" },
    { years: "2020–2022", club: "Bologna" },
    { years: "2022–", club: "Brentford" }
  ],
  careerReview: "哈茨青训出身，2020年仅18岁便大胆登陆意甲博洛尼亚，两个赛季的防守淬炼让他的技术和位置感都有了飞跃。2022年转会布伦特福德，21场国家队出场，能胜任左后两边后卫。",
  wcSpotlight: "24岁的希基因伤错过2022世界杯附加赛，本届决心弥补遗憾。左右双栖的翼卫属性让克拉克战术选择更灵活，布伦特福德的英超硬度检验也让他做好了准备。"
};

data['Andy Robertson'] = {
  number: "3",
  fullName: "Andy Robertson",
  position: "Defender",
  currentClub: "Liverpool",
  nationalCaps: 94,
  nationalGoals: 4,
  clubCareer: [
    { years: "2013–2014", club: "Queen's Park" },
    { years: "2014–2015", club: "Dundee United" },
    { years: "2015–2017", club: "Hull City" },
    { years: "2017–", club: "Liverpool" }
  ],
  careerReview: "从业余俱乐部女王公园起步，经邓迪联和赫尔城锤炼后，2017年加盟利物浦。8年间成长为欧冠和英超冠军、利物浦队长。边路冲刺和弧线传中世界顶级，94次国家队出场贡献4球，苏格兰历史和现役双料队长。",
  wcSpotlight: "32岁仍是苏格兰绝对核心和领袖，与蒂尔尼的左路组合是克拉克三中卫体系的招牌。欧冠决赛级经验对这支时隔数十年重返世界杯的球队至关重要，他在左路的每一次套上都是苏格兰进攻的生命线。"
};

data['Scott McTominay'] = {
  number: "4",
  fullName: "Scott McTominay",
  position: "Midfielder",
  currentClub: "Napoli",
  nationalCaps: 70,
  nationalGoals: 15,
  clubCareer: [
    { years: "2017–2024", club: "Manchester United" },
    { years: "2024–", club: "Napoli" }
  ],
  careerReview: "曼联青训出品，2017年进入一线队后在多位主帅手下都是重要棋子。2024年转投那不勒斯后在意甲焕发新生，成为中场得分利器。70场国家队出场打入15球，作为中场这个进球效率极为惊人。",
  wcSpotlight: "29岁的麦克托米奈是苏格兰中场的得分保障，后插上禁区抢点能力在苏格兰队内独一档。那不勒斯意甲赛季的战术素养提升让他在压迫防守中更加从容，对手防线必须重点盯防他。"
};

data['Grant Hanley'] = {
  number: "5",
  fullName: "Grant Hanley",
  position: "Defender",
  currentClub: "Hibernian",
  nationalCaps: 68,
  nationalGoals: 2,
  clubCareer: [
    { years: "2010–2016", club: "Blackburn Rovers" },
    { years: "2016–2022", club: "Newcastle United" },
    { years: "2022–2025", club: "Norwich City" },
    { years: "2025–", club: "Hibernian" }
  ],
  careerReview: "布莱克本青训出身，2016年加盟纽卡斯尔后在英超征战多个赛季，随后在诺维奇城担任防线领袖。68次国家队出场，曾多场比赛佩戴队长袖标。传统英式中卫，高空争顶和身体对抗是强项。",
  wcSpotlight: "34岁的汉利是三中卫体系的防空保障，丰富的英超出场经验是苏格兰防线需要的沉稳因子。面对巴西锋线的速度挑战时，他的预判和选位将受到严峻考验。"
};

data['Kieran Tierney'] = {
  number: "6",
  fullName: "Kieran Tierney",
  position: "Defender",
  currentClub: "Celtic",
  nationalCaps: 56,
  nationalGoals: 2,
  clubCareer: [
    { years: "2015–2019", club: "Celtic" },
    { years: "2019–2023", club: "Arsenal" },
    { years: "2023–2024", club: "Real Sociedad (loan)" },
    { years: "2024–2025", club: "Arsenal" },
    { years: "2025–", club: "Celtic" }
  ],
  careerReview: "凯尔特人青训标杆产品，20岁成为苏超最佳左后卫。2019年加盟阿森纳征战英超，2023-24赛季租借皇家社会，2025年重返凯尔特人。56场国家队出场，在克拉克体系中与罗伯逊共同镇守左路。",
  wcSpotlight: "29岁的蒂尔尼和罗伯逊的'双左后卫'配置是苏格兰本届最大战术看点。两人同时在左路提供厚度的同时，蒂尔尼的左脚精准长传也能直接找到前锋群，是攻守转换的快速通道。"
};

data['John McGinn'] = {
  number: "7",
  fullName: "John McGinn",
  position: "Midfielder",
  currentClub: "Aston Villa",
  nationalCaps: 86,
  nationalGoals: 20,
  clubCareer: [
    { years: "2012–2015", club: "St Mirren" },
    { years: "2015–2018", club: "Hibernian" },
    { years: "2018–", club: "Aston Villa" }
  ],
  careerReview: "圣米伦青训出身，经希伯尼安跳板后2018年加盟阿斯顿维拉。在维拉成长为球队队长和英超最全面的中场之一——远射、对抗、串联能力均衡。86次国家队出场20球的纪录在苏格兰中场中首屈一指。",
  wcSpotlight: "31岁的麦金是苏格兰中场的节拍器兼领袖，任务是从中场区域发动进攻并保护防线。维拉队长袖标赋予他的领导气质，在世界杯淘汰赛压力下将产生巨大价值。他的远射是破密集防守的利器。"
};

data['Tyler Fletcher'] = {
  number: "8",
  fullName: "Tyler Fletcher",
  position: "Midfielder",
  currentClub: "Manchester United",
  nationalCaps: 2,
  nationalGoals: 0,
  clubCareer: [
    { years: "2024–", club: "Manchester United" }
  ],
  careerReview: "弗莱彻足球家族的新一代——父亲达伦·弗莱彻是苏格兰传奇中场和曼联名宿。年仅19岁已在曼联青训体系中崭露头角，2次国家队出场展示出超越年龄的成熟。技术全面的8号位中场胚子。",
  wcSpotlight: "19岁的泰勒是本届苏格兰名单中最年轻的球员之一。这届世界杯对他而言更多是积累经验的旅程，但如果获得出场机会，他处理球的冷静将让人对苏格兰中场的未来充满期待。"
};

data['Lyndon Dykes'] = {
  number: "9",
  fullName: "Lyndon Dykes",
  position: "Forward",
  currentClub: "Charlton Athletic",
  nationalCaps: 51,
  nationalGoals: 10,
  clubCareer: [
    { years: "2016–2019", club: "Queen of the South" },
    { years: "2019–2020", club: "Livingston" },
    { years: "2020–2024", club: "Queens Park Rangers" },
    { years: "2024–", club: "Charlton Athletic" }
  ],
  careerReview: "澳大利亚出生的强力中锋，选择代表苏格兰出战。从女王南部和利文斯顿的低级别联赛一路打拼，2020年加盟QPR后成为英冠主力中锋。51场国家队出场10球，支点作用和禁区内的体格优势是前场立身之本。",
  wcSpotlight: "30岁的戴克斯将是苏格兰锋线支点，负责背身拿球和制造高空威胁。他的身体对抗让苏格兰的简洁长传战术有落脚点，定位球中他是对手必须双人包夹的高空杀器。"
};

data['Ché Adams'] = {
  number: "10",
  fullName: "Ché Adams",
  position: "Forward",
  currentClub: "Torino",
  nationalCaps: 47,
  nationalGoals: 13,
  clubCareer: [
    { years: "2014–2016", club: "Sheffield United" },
    { years: "2016–2019", club: "Birmingham City" },
    { years: "2019–2024", club: "Southampton" },
    { years: "2024–", club: "Torino" }
  ],
  careerReview: "谢菲联青训出身，伯明翰城成名，2019年加盟南安普顿后在英超贡献多季稳定进球，2024年转投都灵。47次国家队比赛打入13球，左右脚均衡，禁区内抢点嗅觉出色。",
  wcSpotlight: "28岁的亚当斯在都灵的意甲赛季保持了良好状态，将与戴克斯组成苏格兰双前锋。面对技术型防线时他灵活的跑位是破局关键，南安普顿和都灵的双重联赛检验让他适应各种防守风格。"
};

data['Ryan Christie'] = {
  number: "11",
  fullName: "Ryan Christie",
  position: "Midfielder",
  currentClub: "Bournemouth",
  nationalCaps: 68,
  nationalGoals: 10,
  clubCareer: [
    { years: "2013–2015", club: "Inverness CT" },
    { years: "2015–2021", club: "Celtic" },
    { years: "2021–", club: "Bournemouth" }
  ],
  careerReview: "因弗内斯CT青训出身，2015年加盟凯尔特人后随队夺得多次苏超冠军，2021年转会伯恩茅斯。68次国家队出场贡献10球，跑动量大、防守参与度高、远射威胁大，是克拉克战术体系中不可或缺的全能中场。",
  wcSpotlight: "31岁的克里斯蒂将以攻击中场身份出战，他的不懈跑动和远射冷箭是苏格兰破密集防守的重要武器。伯恩茅斯英超稳定首发的比赛状态，让他带着充分自信进入世界杯。"
};

data['Liam Kelly'] = {
  number: "12",
  fullName: "Liam Kelly",
  position: "Goalkeeper",
  currentClub: "Rangers",
  nationalCaps: 3,
  nationalGoals: 0,
  clubCareer: [
    { years: "2015–2018", club: "Rangers" },
    { years: "2018–2021", club: "Livingston" },
    { years: "2019–2020", club: "Queens Park Rangers (loan)" },
    { years: "2021–2024", club: "Motherwell" },
    { years: "2024–", club: "Rangers" }
  ],
  careerReview: "流浪者青训出身，经利文斯顿和QPR磨练后，在马瑟韦尔担任三年主力门将兼队长，2024年重返流浪者。国家队仅有3次出场，但训练中展现的职业态度获得了克拉克的信任。",
  wcSpotlight: "28岁的凯利将以替补门将身份进入世界杯，是门将保险层的重要组成部分。流浪者回归后积累的欧战经验，让他在紧急情况下有能力担当重任。"
};

data['Jack Hendry'] = {
  number: "13",
  fullName: "Jack Hendry",
  position: "Defender",
  currentClub: "Al-Ettifaq",
  nationalCaps: 38,
  nationalGoals: 3,
  clubCareer: [
    { years: "2015–2017", club: "Partick Thistle" },
    { years: "2017–2018", club: "Wigan Athletic" },
    { years: "2018", club: "Dundee" },
    { years: "2018–2021", club: "Celtic" },
    { years: "2020–2021", club: "KV Oostende (loan)" },
    { years: "2021–2023", club: "Club Brugge" },
    { years: "2023–", club: "Al-Ettifaq" }
  ],
  careerReview: "帕特里克西斯尔起步，经维冈和邓迪后加盟凯尔特人，后租借奥斯坦德恢复自信并转会比甲，加盟布鲁日后欧冠亮相。2023年转会沙特阿尔-伊蒂法克。38场国家队出场3球，现代出球型中卫。",
  wcSpotlight: "31岁的亨德利将在三中卫体系中担任关键角色，他的出球能力是苏格兰从后场发起进攻的起点。比甲和欧冠的经历让他在技术层面高于传统苏格兰中卫。沙特联赛的比赛节奏可能成为隐患。"
};

data['Ross Stewart'] = {
  number: "14",
  fullName: "Ross Stewart",
  position: "Forward",
  currentClub: "Southampton",
  nationalCaps: 3,
  nationalGoals: 0,
  clubCareer: [
    { years: "2018–2021", club: "Ross County" },
    { years: "2021–2023", club: "Sunderland" },
    { years: "2023–", club: "Southampton" }
  ],
  careerReview: "罗斯郡起步，2021年加盟桑德兰后以26球帮助球队升入英冠，2023年转会南安普顿。3次国家队出场尚未进球。身高近两米，传统英式高中锋，头球和支点能力突出。",
  wcSpotlight: "29岁的斯图尔特是苏格兰锋线的体格补充。面对巴西或防守型对手时，他的空中优势可能在定位球中制造意外。桑德兰时期的高产证明了他具备禁区终结者的本能。"
};

data['John Souttar'] = {
  number: "15",
  fullName: "John Souttar",
  position: "Defender",
  currentClub: "Rangers",
  nationalCaps: 24,
  nationalGoals: 2,
  clubCareer: [
    { years: "2013–2016", club: "Dundee United" },
    { years: "2016–2022", club: "Heart of Midlothian" },
    { years: "2022–", club: "Rangers" }
  ],
  careerReview: "邓迪联青训，2016年加盟哈茨后成为苏超最佳中卫之一，2022年转会格拉斯哥流浪者。24场国家队出场2球，兼具身体素质和右脚出球能力，是苏格兰后防线上的中坚力量。",
  wcSpotlight: "29岁的苏塔尔可能在小组赛获得轮换首发机会。流浪者欧战经验对苏格兰防守体系是宝贵补充，面对高空轰炸型对手时他是优先选择。他的出球能力让苏格兰的转换进攻更加流畅。"
};

data['Dominic Hyam'] = {
  number: "16",
  fullName: "Dominic Hyam",
  position: "Defender",
  currentClub: "Wrexham",
  nationalCaps: 4,
  nationalGoals: 0,
  clubCareer: [
    { years: "2017–2022", club: "Coventry City" },
    { years: "2022–2025", club: "Blackburn Rovers" },
    { years: "2025–", club: "Wrexham" }
  ],
  careerReview: "雷丁青训出身，在考文垂成为英冠稳定中卫，后转投布莱克本流浪者，2025年加盟雷克瑟姆。4次国家队出场，右脚中卫，防守专注度出色，是三中卫体系的轮换人选。",
  wcSpotlight: "30岁的海姆不以星味见长但防守纪律性极强。在密集防守的场景下是一个可靠的选择，他在考文垂和布莱克本的英冠经历积累了丰富的比赛经验。"
};

data['Ben Gannon-Doak'] = {
  number: "17",
  fullName: "Ben Gannon-Doak",
  position: "Forward",
  currentClub: "Bournemouth",
  nationalCaps: 14,
  nationalGoals: 1,
  clubCareer: [
    { years: "2021–2022", club: "Celtic" },
    { years: "2022–2024", club: "Liverpool" },
    { years: "2024–2025", club: "Middlesbrough (loan)" },
    { years: "2025–", club: "Bournemouth" }
  ],
  careerReview: "凯尔特人青训的爆炸边锋，2022年加盟利物浦青年队，2024-25赛季租借米德尔斯堡并在英冠大放异彩，2025年转会伯恩茅斯。14场国家队出场1球，年仅20岁已是苏格兰前场最具突破能力的球员。",
  wcSpotlight: "20岁的多克是苏格兰锋线最大的惊喜。他的速度和一对一过人能力让苏格兰的反击战术有了一个真正的爆破点。作为替补奇兵登场时，任何疲惫的防线都将难以招架他的启动加速。"
};

data['George Hirst'] = {
  number: "18",
  fullName: "George Hirst",
  position: "Forward",
  currentClub: "Ipswich Town",
  nationalCaps: 10,
  nationalGoals: 1,
  clubCareer: [
    { years: "2016–2019", club: "Sheffield Wednesday" },
    { years: "2019–2023", club: "Leicester City" },
    { years: "2023–", club: "Ipswich Town" }
  ],
  careerReview: "谢菲尔德星期三青训，2019年加盟莱斯特城，经多次租借磨练后2023年转会伊普斯维奇并在英冠站稳脚跟。10场国家队出场1球，身高体壮的传统柱式中锋。",
  wcSpotlight: "27岁的赫斯特是苏格兰锋线的替补支点。比赛末段他的登场可以让苏格兰用长传和高球战术给对手防线施加压力，是克拉克手中一张战术针对性极强的牌。"
};

data['Lewis Ferguson'] = {
  number: "19",
  fullName: "Lewis Ferguson",
  position: "Midfielder",
  currentClub: "Bologna",
  nationalCaps: 24,
  nationalGoals: 1,
  clubCareer: [
    { years: "2018–2019", club: "Hamilton Academical" },
    { years: "2019–2022", club: "Aberdeen" },
    { years: "2022–", club: "Bologna" }
  ],
  careerReview: "汉密尔顿学院出身，在阿伯丁迅速成长为核心中场，2022年加盟博洛尼亚开启意甲新征程。2024年被评为意甲年度最佳中场——这项荣誉让整个苏格兰为之骄傲。24场国家队出场1球，覆盖型8号中场。",
  wcSpotlight: "26岁的弗格森以意甲年度最佳中场的身份进入本届世界杯。他的全能属性——防守覆盖、前插得分、持球推进——是苏格兰中场的最大X因素。博洛尼亚4231体系完美适配他在国家队的角色。"
};

data['Lawrence Shankland'] = {
  number: "20",
  fullName: "Lawrence Shankland",
  position: "Forward",
  currentClub: "Heart of Midlothian",
  nationalCaps: 20,
  nationalGoals: 7,
  clubCareer: [
    { years: "2017–2019", club: "Ayr United" },
    { years: "2019–2021", club: "Dundee United" },
    { years: "2021–2022", club: "Beerschot" },
    { years: "2022–", club: "Heart of Midlothian" }
  ],
  careerReview: "阿伯丁青训，经艾尔联和邓迪联的磨练后成为苏超高产射手，2022年加盟哈茨后两个赛季均打进20球以上。20场国家队出场打入7球，禁区内的终结嗅觉是苏格兰前锋中最敏锐的。",
  wcSpotlight: "29岁的尚克兰是苏格兰的'射手本能'型前锋。如果苏格兰需要一球致胜，他在禁区内的嗅觉和冷静是最大底牌。苏超连续两季进球20+的数据让他带着满满自信进入世界杯。"
};

data['Craig Gordon'] = {
  number: "21",
  fullName: "Craig Gordon",
  position: "Goalkeeper",
  currentClub: "Heart of Midlothian",
  nationalCaps: 84,
  nationalGoals: 0,
  clubCareer: [
    { years: "2002–2007", club: "Heart of Midlothian" },
    { years: "2007–2012", club: "Sunderland" },
    { years: "2014–2020", club: "Celtic" },
    { years: "2020–", club: "Heart of Midlothian" }
  ],
  careerReview: "苏格兰足球的活化石。哈茨青训出身，2007年加盟桑德兰后成为当时英超最贵门将之一，2014年加盟凯尔特人夺得五连冠，2020年重返哈茨至今。43岁高龄仍保持极高竞技水准，84场国家队出场见证了一个时代。",
  wcSpotlight: "43岁的戈登是本届世界杯最年长的球员之一。他不一定是首发门将，但在替补席上带来的经验价值无可估量——他是更衣室的灵魂、年轻门将的导师、苏格兰足球精神的活体象征。"
};

data['Nathan Patterson'] = {
  number: "22",
  fullName: "Nathan Patterson",
  position: "Defender",
  currentClub: "Everton",
  nationalCaps: 26,
  nationalGoals: 1,
  clubCareer: [
    { years: "2019–2022", club: "Rangers" },
    { years: "2022–", club: "Everton" }
  ],
  careerReview: "格拉斯哥流浪者青训出品，2022年转会埃弗顿征战英超。26场国家队出场1球，速度快、前插意识强，是苏格兰右后卫位置的未来。伤病是限制他进一步发展的最大障碍。",
  wcSpotlight: "24岁的帕特森需要证明自己已恢复健康。如果首发出任右翼卫，他的速度和前插意识将为苏格兰右路进攻提供宝贵的纵深支持，让对手左路不敢完全投入进攻。"
};

data['Kenny McLean'] = {
  number: "23",
  fullName: "Kenny McLean",
  position: "Midfielder",
  currentClub: "Norwich City",
  nationalCaps: 58,
  nationalGoals: 3,
  clubCareer: [
    { years: "2009–2015", club: "St Mirren" },
    { years: "2015–2018", club: "Aberdeen" },
    { years: "2018–", club: "Norwich City" }
  ],
  careerReview: "圣米伦青训出身，2015年加盟阿伯丁后成为中场核心，2018年转会诺维奇城并长期担任主力。58场国家队出场3球，中场多功能型球员，能打6号、8号乃至左路。",
  wcSpotlight: "34岁的麦克莱恩提供的是中场轮换深度和经验。在世界杯密集赛程中，他的多功能属性让克拉克能自由变换中场配置，定位球中的左脚传球质量也是一项隐形武器。"
};

data['Anthony Ralston'] = {
  number: "24",
  fullName: "Anthony Ralston",
  position: "Defender",
  currentClub: "Celtic",
  nationalCaps: 27,
  nationalGoals: 1,
  clubCareer: [
    { years: "2016–", club: "Celtic" }
  ],
  careerReview: "凯尔特人纯正青训，在多位主帅手下获得稳定出场时间。27场国家队出场1球，防守基本功扎实、身体对抗能力强，典型的凯尔特人出品的硬派后卫。",
  wcSpotlight: "27岁的罗尔斯顿将在右后卫位置与帕特森竞争出场时间。他的防守优先风格在需要保平或守住领先优势时，是克拉克更倾向的选择。凯尔特人的欧冠出场经验为他增添了大赛气质。"
};

data['Findlay Curtis'] = {
  number: "25",
  fullName: "Findlay Curtis",
  position: "Forward",
  currentClub: "Kilmarnock",
  nationalCaps: 3,
  nationalGoals: 1,
  clubCareer: [
    { years: "2023–", club: "Kilmarnock" }
  ],
  careerReview: "基尔马诺克青训的产品，年仅20岁已在一线队获得稳定出场。3次国家队出场打入1球——首秀即进球的梦幻开局让苏格兰球迷对这位年轻前锋的未来充满期待。",
  wcSpotlight: "20岁的柯蒂斯是克拉克为未来储备的前锋。本届世界杯他主要是在训练中学习和感受大赛氛围，但他的速度和冲劲可能在垃圾时间制造惊喜，是苏格兰锋线未来的种子。"
};

data['Scott McKenna'] = {
  number: "26",
  fullName: "Scott McKenna",
  position: "Defender",
  currentClub: "Dinamo Zagreb",
  nationalCaps: 50,
  nationalGoals: 1,
  clubCareer: [
    { years: "2014–2020", club: "Aberdeen" },
    { years: "2020–2024", club: "Nottingham Forest" },
    { years: "2024", club: "Copenhagen (loan)" },
    { years: "2024–", club: "Dinamo Zagreb" }
  ],
  careerReview: "阿伯丁青训出品，2020年加盟诺丁汉森林后帮助球队重返英超并成功保级，2024年租借哥本哈根后转投萨格勒布迪纳摩。50场国家队出场1球，传统英式中卫，身体对抗和头球能力强。",
  wcSpotlight: "29岁的麦肯纳将被克拉克委以三中卫之一的重任。萨格勒布迪纳摩的技术环境让他的出球能力得到提升，面对巴西和同组对手的复杂锋线，他的身体素质和防守预判将受到考验。"
};

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Scotland bios written (26 players)');
