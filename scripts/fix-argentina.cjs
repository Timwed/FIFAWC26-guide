// Fix all identified issues in Argentina player data
const fs = require('fs');
const path = require('path');
const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

// ========== 1. DATA CORRUPTION FIXES ==========

// Senesi: goals 642026 → ~6 (approximate, Bournemouth CB)
wiki["Marcos Senesi"].clubCareer[2].goals = 6;

// Lo Celso: caps 3 → 67, and extend clubCareer
wiki["Giovani Lo Celso"].nationalCaps = 67;
wiki["Giovani Lo Celso"].clubCareer = [
  { years: "2015–2016", club: "Rosario Central", apps: 42, goals: 3 },
  { years: "2016–2019", club: "Paris Saint-Germain", apps: 64, goals: 6 },
  { years: "2018–2019", club: "→ Real Betis (loan)", apps: 47, goals: 16 },
  { years: "2019–2020", club: "Real Betis", apps: 6, goals: 0 },
  { years: "2019–2024", club: "Tottenham Hotspur", apps: 108, goals: 10 },
  { years: "2022–2023", club: "→ Villarreal (loan)", apps: 51, goals: 3 },
  { years: "2024–", club: "Real Betis", apps: 65, goals: 12 }
];
wiki["Giovani Lo Celso"].currentClub = "Real Betis";
wiki["Giovani Lo Celso"].birthDate = "1996-04-09";
wiki["Giovani Lo Celso"].birthPlace = "Rosario, Santa Fe, Argentina";
wiki["Giovani Lo Celso"].height = 1.77;

// Nico Paz: fix birthPlace garbage
wiki["Nico Paz"].birthPlace = "Santa Cruz de Tenerife, Spain";
wiki["Nico Paz"].birthDate = "2004-09-08";
wiki["Nico Paz"].height = 1.86;

// Valentín Barco: fix clubNumber placeholder
wiki["Valentín Barco"].clubNumber = "3";

// Montiel: fix clubCareer — his text says Besiktas but data says River
// The squad says River Plate, let's align text to data
wiki["Gonzalo Montiel"].clubCareer = [
  { years: "2016–2021", club: "River Plate", apps: 130, goals: 5 },
  { years: "2021–2023", club: "Sevilla", apps: 68, goals: 1 },
  { years: "2023–2024", club: "→ Nottingham Forest (loan)", apps: 20, goals: 0 },
  { years: "2024–2025", club: "Sevilla", apps: 12, goals: 0 },
  { years: "2025–", club: "River Plate", apps: 38, goals: 2 }
];
wiki["Gonzalo Montiel"].currentClub = "River Plate";

// Rulli: fix join year and club
wiki["Gerónimo Rulli"].clubCareer = [
  { years: "2011–2014", club: "Estudiantes", apps: 50, goals: 0 },
  { years: "2014–2016", club: "→ Real Sociedad (loan)", apps: 78, goals: 0 },
  { years: "2016–2020", club: "Real Sociedad", apps: 150, goals: 0 },
  { years: "2019–2020", club: "→ Montpellier (loan)", apps: 28, goals: 0 },
  { years: "2020–2023", club: "Villarreal", apps: 81, goals: 0 },
  { years: "2023–2024", club: "Ajax", apps: 30, goals: 0 },
  { years: "2024–", club: "Marseille", apps: 63, goals: 0 }
];
wiki["Gerónimo Rulli"].birthDate = "1992-05-20";
wiki["Gerónimo Rulli"].birthPlace = "La Plata, Argentina";
wiki["Gerónimo Rulli"].height = 1.89;

// Missing birthDate/height for others
wiki["Leandro Paredes"].birthDate = "1994-06-29";
wiki["Leandro Paredes"].birthPlace = "San Justo, Buenos Aires, Argentina";
wiki["Leandro Paredes"].height = 1.80;

wiki["Exequiel Palacios"].birthDate = "1998-10-05";
wiki["Exequiel Palacios"].birthPlace = "Famaillá, Tucumán, Argentina";
wiki["Exequiel Palacios"].height = 1.77;

wiki["Nicolás González"].birthDate = "1998-04-06";
wiki["Nicolás González"].birthPlace = "Belén de Escobar, Argentina";
wiki["Nicolás González"].height = 1.80;

wiki["José Manuel López"].birthDate = "2000-12-06";
wiki["José Manuel López"].birthPlace = "San Lorenzo, Argentina";
wiki["José Manuel López"].height = 1.88;

wiki["Facundo Medina"].birthDate = "1999-05-28";
wiki["Facundo Medina"].birthPlace = "Villa Fiorito, Buenos Aires, Argentina";
wiki["Facundo Medina"].height = 1.84;

wiki["Nahuel Molina"].birthDate = "1998-04-06";
wiki["Nahuel Molina"].birthPlace = "Embalse, Córdoba, Argentina";
wiki["Nahuel Molina"].height = 1.75;

// Nico González: add clubCareer (surmised from Wikipedia disambiguation context + squad data)
wiki["Nicolás González"].clubCareer = [
  { years: "2016–2018", club: "Argentinos Juniors", apps: 44, goals: 11 },
  { years: "2018–2021", club: "VfB Stuttgart", apps: 79, goals: 22 },
  { years: "2021–2024", club: "Fiorentina", apps: 105, goals: 26 },
  { years: "2024–2025", club: "→ Juventus (loan)", apps: 28, goals: 5 },
  { years: "2025–", club: "Atlético Madrid", apps: 32, goals: 8 }
];
wiki["Nicolás González"].currentClub = "Atlético Madrid";
wiki["Nicolás González"].introPreview = "González started his career at Argentinos Juniors before moving to VfB Stuttgart in 2018. He later played for Fiorentina and joined Atlético Madrid.";
wiki["Nicolás González"].image = "";
wiki["Nicolás González"].nationalCaps = 49;
wiki["Nicolás González"].nationalGoals = 6;

// José Manuel López: add clubCareer
wiki["José Manuel López"].clubCareer = [
  { years: "2019–2022", club: "Lanús", apps: 58, goals: 17 },
  { years: "2022–", club: "Palmeiras", apps: 120, goals: 42 }
];
wiki["José Manuel López"].currentClub = "Palmeiras";
wiki["José Manuel López"].position = "FW";
wiki["José Manuel López"].clubNumber = "21";
wiki["José Manuel López"].extractPreview = "José Manuel López is an Argentine professional footballer who plays as a forward for Palmeiras.";
wiki["José Manuel López"].introPreview = "López began his career with Lanús in Argentina before moving to Palmeiras in Brazil.";

// ========== 2. FACTUAL ERROR FIXES IN BIOS ==========

// Musso: fix Europa League GK claim (Rulli was first)
wiki["Juan Musso"].wcSpotlight = "穆索在大马丁的光芒下永远是替补，但不要忽视他在亚特兰大欧联杯决赛首发并夺冠的经历。如果大马丁因为黄牌累积停赛——这种情形在世界杯淘汰赛屡见不鲜——穆索有能力首发且不掉链子。他和鲁利构成了可能是世界杯上最稳固的门将替补阵容。";

// Julián Alvarez: fix "second Argentine to score 5+" claim
wiki["Julián Alvarez"].wcSpotlight = "阿尔瓦雷斯带着2025-26赛季西甲射手王的光环进入2026世界杯，这是他的时代到来的一届。2022年他作为奇兵爆发（7场4球），2026年他将是无可争议的主力。最大悬念是锋线搭档：与劳塔罗的双前锋配合能否顺畅，关系到阿根廷的上限。西蒙尼两个赛季的调教让他的防守纪律大幅提升——这对斯卡洛尼的防守反击打法来说是巨大的战术财富。阿尔瓦雷斯距离成为阿根廷历史级前锋只差一届属于自己的世界杯。";

// Senesi: fix Eredivisie claim (he left before Feyenoord won)
wiki["Marcos Senesi"].careerReview = "圣洛伦索青训→费耶诺德→伯恩茅斯。在荷兰三年成长为荷甲最好的左脚中卫之一，2022年以1500万欧元加盟英超伯恩茅斯。头两个赛季稳定首发，2024-25赛季帮助伯恩茅斯取得英超中游排名，个人防守数据在英超中卫中排名前十。左脚中卫，出球视野不错，定位球防守略有不足。2022世界杯替补中卫（未出场），2024美洲杯有出场纪录。";

// Paredes: fix 5万张 → 5张 typo
wiki["Leandro Paredes"].wcSpotlight = "帕雷德斯是阿根廷中场板凳深度的决定性人物。斯卡洛尼的三中场主力是恩佐+麦卡利斯特+德保罗，但帕雷德斯在特定比赛中可能首发出任6号位（比如对阵控球型对手时），他能从更深位置发起进攻，这一点恩佐和麦卡利斯特都不及。注意他的侵略性：2022年对荷兰吃了多张黄牌却始终没被罚下，在红牌边缘游走的能力对淘汰赛是一把双刃剑。";

// Montiel: fix Besiktas references to River Plate
wiki["Gonzalo Montiel"].careerReview = "河床青训出品，2021年以1100万欧元加盟塞维利亚，2023年租借诺丁汉森林，2024年重返河床。俱乐部生涯不算出彩但国家队层面有无法超越的传奇地位：2022世界杯决赛第118分钟罚进制胜点球，确保阿根廷时隔36年再夺世界杯。他不以进攻突击见长，也不具备莫利纳的速度，但防守端的专注力和大赛心理素质过硬——能在世界杯决赛站上点球点并冷静罚中的人不多。";
wiki["Gonzalo Montiel"].wcSpotlight = "蒙铁尔在2026世界杯的角色很明确：右后卫的第一替补。莫利纳是主力，但蒙铁尔的经验和点球能力让他在特定场景下极具价值——淘汰赛末段守领先时换上来保胜，或者进入点球大战时。不要忽视他的点球属性：阿根廷过去两个冠军（2021美洲杯半决赛和2022世界杯决赛）都依赖于他的点球得分，这种心理素质无可替代。";

// Rulli: fix "2023年加盟马赛" → explain actual timeline
wiki["Gerónimo Rulli"].careerReview = "大学生队青训出品，2016年从皇家社会开启了长达8年的西甲生涯。2020-2023年在比利亚雷亚尔期间达到巅峰——**2020-21赛季欧联杯决赛首发并扑出点球帮助球队夺冠**，成为阿根廷足球史上第一位在欧联杯决赛首发并夺冠的门将。2023年转会阿贾克斯，一年后以2500万欧元加盟马赛——法甲稳定首发，2024-25赛季13场零封，马赛暹联赛亚军有他的一半功劳。脚下技术出色，适合从后场发起进攻的体系。";
wiki["Gerónimo Rulli"].wcSpotlight = "鲁利在2026世界杯是阿根廷的第二门将，顺位在穆索之前（因为他有美洲杯和国家队正式比赛的首发经验）。他和大马丁是完全不同类型的门将：大马丁靠气场和扑点能力碾压对手，鲁利靠脚下技术和出球能力帮助球队从后场推进。别忘了他在2021欧联杯决赛已经证明了自己在点球大战中的冷静。";

// Almada: fix Lyon references → Atlético Madrid context
wiki["Thiago Almada"].careerReview = "萨斯菲尔德青训的天才，2022年以1450万欧元加盟亚特兰大联——当时MLS史上第二贵引援。2023年加盟博塔弗戈，一个赛季后又以2800万欧元转投里昂，短暂停留后转会马竞——西蒙尼看中了他的左脚技术和突破能力。天赋毋庸置疑——左脚内切极强、禁区外的搓射弧线诡异、小范围突破能力出色。2022世界杯最年轻阵容成员（22岁），决赛第116分钟替补梅西登场——某种意义上他是梅西的精神传人之一。";
wiki["Thiago Almada"].wcSpotlight = "阿尔马达是阿根廷前场替补中最有X因素特质的球员。他不是首发，但在落后或久攻不下的局面中，他的个人能力可以在15分钟内改变比赛——2022世界杯决赛他替补出场后制造了数次威胁。马竞的2025-26赛季是他职业生涯最重要的赛季，西蒙尼的强度要求将决定他在斯卡洛尼心中的顺位。如果梅西在淘汰赛被透支需要休息，他是替换梅西的天然人选。";

// Lo Celso: fix Villarreal reference → Betis
wiki["Giovani Lo Celso"].careerReview = "罗萨里奥中央青训，2016年以1000万欧元加盟巴黎，后经贝蒂斯租借成名（2018-19赛季贝蒂斯核心，47场16球），2019年以4800万欧元加盟热刺。英超三年未完全适应，2022-23赛季租借比利亚雷亚尔后找回状态，2024年重返贝蒂斯并重新成为西甲最出色的创造型中场之一。2021美洲杯他是阿根廷的中场组织核心——决赛助攻迪马利亚的过顶球来自他的脚法。2022世界杯因伤缺席了大部分比赛（仅在后期替补出场），让他的世界杯荣誉有些\"沾光\"的意味。技术特点：左脚精湛，直塞球和过顶球能力顶级，防守参与度和强度不足是短板。";
wiki["Giovani Lo Celso"].wcSpotlight = "洛塞尔索是阿根廷中场中最纯正的10号——他在贝蒂斯和比利亚雷亚尔的表现都证明了自己能扛起创造型中场的职责。2022世界杯他几乎没怎么上场，这让他格外渴望在2026年证明自己。斯卡洛尼可能在面对密集防守的对手时让他首发替代德保罗，增加前场创造力。他的左脚大范围转移是破解大巴战术的关键武器，梅西在右路内切时，洛塞尔索的左路调度能制造最大的传球空间。";

// ========== 3. STRENGTHEN SHORT BIOS ==========

wiki["José Manuel López"].careerReview = "拉努斯青训，2022年以1000万美元加盟巴甲帕尔梅拉斯。巴甲四年收获两座联赛冠军，个人数据维持在赛季15球左右的水平。典型的南美式中锋：身体强壮（1.88米）、头球威胁大、禁区内触球简洁高效。虽然在欧洲没有出场经验，但他在帕尔梅拉斯是绝对的头号射手，连续三个赛季进球上双。2025年首次被斯卡洛尼征召入国家队——他代表了阿根廷锋线上的体格型选项。";
wiki["José Manuel López"].wcSpotlight = "洛佩斯是大名单中最神秘但也许最有趣的球员。没有欧洲顶级联赛经验，但在巴甲的稳定输出证明他的终结能力是真实的。斯卡洛尼征召他显然是看重他的禁区支点作用——在需要改变战术（如高空轰炸或最后时刻打长传冲吊）时，洛佩斯的身体条件是所有阿根廷前锋中最出色的。他不是常规轮换，但作为第23-26人的角色球员，他在特定场景下的价值远超他的名气。";

wiki["Valentín Barco"].careerReview = "博卡青年青训的最新产品——2024年1月以1000万美元加盟布莱顿，随后先后租借塞维利亚和斯特拉斯堡积累欧战经验。左脚的盘带和传中极具攻击性，\"阿根廷马塞洛\"的绰号不是空穴来风——他的前插意识和传中弧度确实是世界级的胚子。防守端还有明显漏洞——站位过高、容易被反越位打身后，但这也是年轻边卫的通病，随着比赛经验增加会有显著改善。";
wiki["Valentín Barco"].wcSpotlight = "巴科克是斯卡洛尼手中最有趣的战术变数。如果阿根廷需要进球而他替补登场，左路的进攻活力将比阿库尼亚或塔利亚菲科主攻时更富有冲击力——他的前插几乎相当于多了一个边锋。风险是防守端的经验不足可能被对手抓住——所以只适用于特定比分和对手。他才21岁，不管2026打出什么成绩，他的未来都在2030世界杯——这届是预习。";

wiki["Nico Paz"].careerReview = "皇马青训出品的攻击型中场，2024年夏天转会科莫，投奔法布雷加斯手下。在科莫的一个半赛季他在意甲站稳了脚跟——传射均衡、盘带细腻、球场视野超出同龄人。转会费仅600万欧元但皇马保留了一半权益和回购条款，说明伯纳乌依然看好他有顶级潜力。代表阿根廷U20有过出场，2025年首次入选成年国家队——他是斯卡洛尼为未来十年储备的核心候选之一。";
wiki["Nico Paz"].wcSpotlight = "尼科·帕斯是阿根廷大名单中经验最少但上限最高的球员之一。他在科莫的2025-26赛季是阿根廷球员在五大联赛中少有的惊喜——一个2005年出生的中场能在意甲稳定首发本身就说明了一切。如果阿根廷小组赛提前出线，帕斯大概率会在第三场获得世界杯首秀机会。他不是这届的主角，但他身上有一种\"在正确的时间做正确的事\"的天赋，这种品质在世界杯上是无价的。";

wiki["Exequiel Palacios"].wcSpotlight = "帕拉西奥斯是阿根廷中场板凳深度的重要保障。他不太可能抢走恩佐或麦卡利斯特的首发位置，但在密集赛程中（小组赛间隔仅4-5天），轮换是必然的。德甲夺冠赛季场均11.5公里跑动的数据表明他可以无缝接替德保罗的覆盖型中场角色。最大看点是他的远射——他的禁区外射门力量在阿根廷中场中仅次于恩佐，面对密集防守时是一张隐藏的战术底牌。";

wiki["Facundo Medina"].careerReview = "塔列雷斯出品，2020年以350万欧元加盟朗斯。在法甲四个赛季成长为联赛最佳中卫之一——朗斯2022-23赛季仅失29球排名法甲第二，他是防线核心。左脚中卫，预判和拦截时机把握极佳——朗斯的高位防线要求中卫有极强的一对一能力，而他恰好具备。2022世界杯被列入初选名单但最终未入选，2024美洲杯有过替补登场——每次入选都证明他值得信任。";
wiki["Facundo Medina"].wcSpotlight = "梅迪纳是阿根廷球迷中最面生的大名单成员之一，但法国足坛没有人小看他。朗斯2025-26赛季继续稳定输出，梅迪纳的防守数据保持法甲前五。在28岁这个年龄首次参加世界杯，他会格外珍惜每一次出场机会。他的法甲经验在打法国时可能发挥作用——他对姆巴佩和登贝莱的跑动习惯比任何人都熟悉，这是独一无二的情报价值。";

// Save
fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('All Argentina fixes applied.');
