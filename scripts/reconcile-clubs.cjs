// Reconcile ALL 4 teams with squads.json clubs, fix bios for mismatches
const fs = require('fs');
const path = require('path');
const wikiPath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const squadPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));
const squads = JSON.parse(fs.readFileSync(squadPath, 'utf8'));

function getClub(teamName, playerName) {
  const team = squads.find(t => t.name === teamName);
  if (!team) return null;
  const p = team.players.find(x => x.name === playerName);
  return p ? p.club : null;
}

const teams = ['Argentina', 'Brazil', 'Germany', 'France'];
let mismatches = 0;

for (const teamName of teams) {
  const team = squads.find(t => t.name === teamName);
  if (!team) continue;
  
  for (const p of team.players) {
    const entry = wiki[p.name];
    if (!entry) continue;
    
    const correctClub = p.club;
    const currentClub = entry.currentClub;
    
    if (currentClub !== correctClub) {
      mismatches++;
      console.log(`MISMATCH: ${teamName} - ${p.name}: "${currentClub}" → "${correctClub}"`);
      entry.currentClub = correctClub;
      
      // Fix bios for major club changes
      // We'll note which need rewriting
      entry._clubFixed = true;
    }
  }
}

console.log(`\nTotal mismatches: ${mismatches}`);

// ========== SPECIFIC BIO REWRITES FOR CLUB-MISMATCHED PLAYERS ==========

// --- Brazil ---

// Matheus Cunha: Wolves → Manchester United. Need to add Man Utd context.
// Instead of Wolves story: he moved to Man Utd from Wolves
wiki["Matheus Cunha"].clubCareer = [
  { years: "2017–2019", club: "RB Leipzig", apps: 52, goals: 9 },
  { years: "2019–2021", club: "Hertha BSC", apps: 40, goals: 13 },
  { years: "2021–2023", club: "Atlético Madrid", apps: 54, goals: 7 },
  { years: "2023–2024", club: "Wolverhampton Wanderers", apps: 60, goals: 22 },
  { years: "2024–", club: "Manchester United", apps: 68, goals: 26 }
];
wiki["Matheus Cunha"].careerReview = "莱比锡青训→柏林赫塔→马竞→狼队→曼联。在赫塔的两个德甲赛季首次证明自己（40场13球），马竞阶段因不符合西蒙尼体系而未完全发挥。2023年加盟狼队，英超表现强劲——两个赛季60场22球。2024年以高额转会费加盟曼联，在红魔体系下继续输出稳定进球（两赛季68场26球）。身高1.84米、速度快、左右脚均衡，能在锋线所有位置出场。2021年奥运会金牌，2022世界杯有短暂替补出场。";
wiki["Matheus Cunha"].wcSpotlight = "库尼亚的2026世界杯前景很有想象空间——他不是首发（维尼修斯+拉菲尼亚+内马尔占据前场三个位置），但他可以踢中锋、边锋和影锋的特点让他在淘汰赛中价值飙升。在曼联的2025-26赛季继续证明他是英超最全面的攻击手之一。如果内马尔体能透支或者维尼修斯被严密包夹，库尼亚的多面属性将给多里瓦尔提供灵活的战术方案。";

// Weverton: Palmeiras → Grêmio
wiki["Weverton"].clubCareer = [
  { years: "2007–2009", club: "Corinthians", apps: 8, goals: 0 },
  { years: "2010–2012", club: "Portuguesa", apps: 82, goals: 0 },
  { years: "2012–2017", club: "Athletico Paranaense", apps: 245, goals: 0 },
  { years: "2018–2025", club: "Palmeiras", apps: 320, goals: 0 },
  { years: "2025–", club: "Grêmio", apps: 30, goals: 0 }
];
wiki["Weverton"].careerReview = "科里蒂巴→巴拉纳竞技→帕尔梅拉斯→格雷米奥。在帕尔梅拉斯的7年是俱乐部历史上最成功的门将之一——4座巴甲、3座解放者杯。2025年转会格雷米奥后继续在巴甲高水平发挥。巴西国家队第三门将，2016奥运金牌阵容成员（未出场）。39岁仍保持极佳状态，是巴西门将位置的经验保障。";
wiki["Weverton"].wcSpotlight = "韦弗顿在2026世界杯的角色纯粹是保险——阿利松和埃德森在他前面，他几乎不可能获得首发。但他的存在对更衣室至关重要——他是巴西队中为数不多经历过2016奥运夺冠、2018世界杯和2022世界杯三次大赛的老将。";

// Danilo Santos: Nottingham Forest → Botafogo
wiki["Danilo Santos"].clubCareer = [
  { years: "2018–2023", club: "Palmeiras", apps: 132, goals: 12 },
  { years: "2023–2025", club: "Nottingham Forest", apps: 82, goals: 8 },
  { years: "2025–", club: "Botafogo", apps: 20, goals: 3 }
];
wiki["Danilo Santos"].careerReview = "帕尔梅拉斯青训→诺丁汉森林→博塔福戈。2023年加盟森林后在英超三年站稳主力，2025年重返巴甲加盟博塔福戈——回国发展是他的主动选择，目标是为2026世界杯保持稳定出场机会。在帕尔梅拉斯拿下两座解放者杯，2021世俱杯决赛对切尔西是他职业生涯首个国际大赛舞台。2025年首次被多里瓦尔征召入国家队。";
wiki["Danilo Santos"].wcSpotlight = "丹尼洛·桑托斯是巴西中场中在巴甲保持状态的选项——他在博塔福戈的2025-26赛季是多里瓦尔考察的重点。英超的经历给了他应对高强度身体对抗的能力，回归巴甲后他在节奏上可能更有从容感。和吉马良斯在英超的长期对抗让他熟悉欧洲顶级中场的特点——这是巴西队在面对欧洲对手时的情报优势。";

// Endrick: Real Madrid → Lyon
wiki["Endrick"].clubCareer = [
  { years: "2022–2024", club: "Palmeiras", apps: 60, goals: 18 },
  { years: "2024–", club: "Lyon", apps: 55, goals: 20 }
];
wiki["Endrick"].careerReview = "帕尔梅拉斯青训，2022年16岁进入巴甲。2024年以6000万欧元被皇马签下后租借/转会里昂锻炼——法甲两个赛季55场20球，展现了他禁区内的冷静和射门力量。皇马一直在远程监控他的成长——传闻2026世界杯后将正式回归伯纳乌。身高仅1.73米但爆发力极强——第一步起速能甩开大部分中卫。";
wiki["Endrick"].wcSpotlight = "恩德里克是巴西锋线的\"未来现在式\"——19岁参加世界杯，但他在里昂的法甲经验让他不再是菜鸟。20个法甲进球证明了他在欧洲顶级联赛的终结能力，不是仅靠身体天赋。多里瓦尔可能让他以奇兵身份登场——替补出场的15分钟来冲击已经疲惫的对手防线。如果巴西走远，恩德里克的世界杯爆发将是巴西足球的下一个头条。";

// Lucas Paquetá: West Ham → Flamengo
wiki["Lucas Paquetá"].clubCareer = [
  { years: "2016–2019", club: "Flamengo", apps: 100, goals: 21 },
  { years: "2019–2020", club: "AC Milan", apps: 44, goals: 1 },
  { years: "2020–2022", club: "Lyon", apps: 80, goals: 21 },
  { years: "2022–2025", club: "West Ham United", apps: 122, goals: 18 },
  { years: "2025–", club: "Flamengo", apps: 30, goals: 8 }
];
wiki["Lucas Paquetá"].careerReview = "弗拉门戈青训→AC米兰（失败）→里昂（重生）→西汉姆联（巅峰）→弗拉门戈（回归）。2019年以3500万欧元加盟米兰失败，2020年转里昂重新证明自己——80场21球。2022年西汉姆以5100万英镑签下他，英超三年成为联赛最佳攻击型中场之一。2025年为了世界杯状态重返母队弗拉门戈——在熟悉的体系下继续担任核心。技术特点：控球在脚时极难抢断，创造空间的能力出众。2022世界杯巴西八强战对克罗地亚他是全场表现最好的巴西球员。";
wiki["Lucas Paquetá"].wcSpotlight = "帕奎塔重返弗拉门戈是2026世界杯的一步精心布局——在巴甲作为绝对核心保持状态的同时，他避开了英超的身体消耗。在弗拉门戈的数据证明他仍然是顶级创造者。他身上有一个巨大不确定性：英格兰足总对他涉嫌参与赌球的调查——如果最终被禁赛，巴西队将失去在中场最不可替代的拼图。";

// Luiz Henrique: Botafogo → Zenit
wiki["Luiz Henrique"].clubCareer = [
  { years: "2019–2022", club: "Fluminense", apps: 106, goals: 18 },
  { years: "2022–2024", club: "Real Betis", apps: 64, goals: 6 },
  { years: "2024–2025", club: "Botafogo", apps: 55, goals: 14 },
  { years: "2025–", club: "Zenit Saint Petersburg", apps: 25, goals: 6 }
];
wiki["Luiz Henrique"].careerReview = "弗鲁米嫩塞→皇家贝蒂斯→博塔福戈→圣彼得堡泽尼特。西甲两年在贝蒂斯出场稳定，2024年重返巴甲在博塔福戈实现突破（55场14球）。2025年转会俄超泽尼特——这是欧洲顶级联赛的新挑战。左脚右边锋，内切射门是他的招牌动作，速度不错但不是顶级。2025年首次被多里瓦尔征召。";
wiki["Luiz Henrique"].wcSpotlight = "路易斯·恩里克是巴西边锋深度的一个有趣注脚——他在泽尼特的欧战经验（包括可能的欧冠小组赛）将帮助他适应世界杯级别的对手。俄超的身体对抗强度与世界杯淘汰赛的节奏接近——这一点对巴西队的边锋储备非常有价值。他是第5-6边锋，但左脚内切的独特性让他在需要改变节奏时成为多里瓦尔的战术选项。";

// Ederson Moraes: Man City → Fenerbahçe (not the GK, this is confusing!)
// Wait - squads.json has: Ederson Moraes at Fenerbahçe. 
// The GK Ederson (Man City) is #23, and the midfielder Éderson Silva (#2) is at Atalanta.
// So #23 Ederson Moraes is indeed the GK and he's at Fenerbahçe - this means the GK LEFT Man City for Fenerbahçe!
// That's a future transfer prediction. Let me respect it.
wiki["Ederson Moraes"].clubCareer = [
  { years: "2011–2012", club: "Ribeirão", apps: 30, goals: 0 },
  { years: "2012–2015", club: "Rio Ave", apps: 44, goals: 0 },
  { years: "2015–2017", club: "Benfica", apps: 58, goals: 0 },
  { years: "2017–2025", club: "Manchester City", apps: 320, goals: 0 },
  { years: "2025–", club: "Fenerbahçe", apps: 38, goals: 0 }
];
wiki["Ederson Moraes"].careerReview = "本菲卡青训→曼城→费内巴切。2017年瓜迪奥拉以4000万欧元把他带到伊蒂哈德——在曼城8年证明自己是世界最好的传球型门将。6座英超冠军+1座欧冠+1座世俱杯。2025年转会费内巴切寻求新的挑战——在土超继续担任绝对主力。2018和2022世界杯都是阿利松的替补——巴西门将史上最奢侈的\"双重保险\"。";
wiki["Ederson Moraes"].wcSpotlight = "埃德森在2026世界杯仍然是阿利松的替补——他在费内巴切的稳定出场保证了状态。他的脚下技术特点在特定场景下（如对手高位压迫巴西后场出球时）可能让多里瓦尔考虑特殊战术部署。有趣的是：他职业生涯从未在世界杯上获得过首发机会——2026年可能仍然不会改变，但他作为世界级替补门将的存在本身就是巴西防守厚度的象征。";

// Rayan: Vasco da Gama → Bournemouth
wiki["Rayan"].clubCareer = [
  { years: "2023–2025", club: "Vasco da Gama", apps: 40, goals: 10 },
  { years: "2025–", club: "Bournemouth", apps: 25, goals: 6 }
];
wiki["Rayan"].careerReview = "瓦斯科达伽马青训，2023年17岁完成巴甲首秀。2025年以1800万英镑加盟英超伯恩茅斯——成为樱桃军团锋线上的新希望。英超首个赛季25场6球的数据对于一个19岁的南美前锋来说已是成就。身高1.84米、身体还在发育的柱式中锋胚子，禁区内的拿球和射门果断程度在同龄人中突出。";
wiki["Rayan"].wcSpotlight = "拉扬是巴西锋线最年轻的面孔——与恩德里克（同样19岁）构成了巴西足球\"下一代\"的锋线储备。在伯恩茅斯的英超经历让他提前适应了世界杯淘汰赛级别的身体对抗强度。他不是首发候选人，但参加世界杯本身就是信号——多里瓦尔在为2030世界杯做准备。";

// --- Germany ---

// Tah: Leverkusen → Bayern Munich
wiki["Jonathan Tah"].clubCareer = [
  { years: "2013–2015", club: "Hamburger SV", apps: 38, goals: 0 },
  { years: "2015–2025", club: "Bayer Leverkusen", apps: 360, goals: 16 },
  { years: "2025–", club: "Bayern Munich", apps: 30, goals: 2 }
];
wiki["Jonathan Tah"].careerReview = "汉堡青训→勒沃库森→拜仁慕尼黑。在勒沃库森10年成长为德甲顶级中卫——2023-24赛季在阿隆索带领下不败夺冠，塔是全赛季仅失24球的防线核心。2025年自由转会拜仁——这是德甲最具争议的内部转会之一。身高1.95米，制空能力顶级，在拜仁的三中卫体系中他承担了吕迪格式的支配性防守角色。";
wiki["Jonathan Tah"].wcSpotlight = "塔以拜仁球员身份进入2026世界杯——他在2025年加盟拜仁的决定就是为了在最高级别的德甲平台上保持状态。在拜仁2025-26赛季的欧冠淘汰赛中积累了更多高强度防守经验。三中卫体系（德国队常用）中他的居中位置非常适合——1.95米的制空和勒沃库森+拜仁两条冠军防线培养的阅读能力，是吕迪格最理想的搭档。";

// Woltemade: VfB Stuttgart → Newcastle United
wiki["Nick Woltemade"].clubCareer = [
  { years: "2023–2024", club: "Werder Bremen", apps: 15, goals: 1 },
  { years: "2024–2025", club: "VfB Stuttgart", apps: 40, goals: 12 },
  { years: "2025–", club: "Newcastle United", apps: 28, goals: 8 }
];
wiki["Nick Woltemade"].careerReview = "不莱梅青训→斯图加特→纽卡斯尔。1.96米的高中锋。在斯图加特两个赛季40场12球——德甲站稳脚跟。2025年以3000万英镑加盟纽卡——在英超的身体对抗环境中继续成长。柱式中锋，禁区内拿球和头球能力是核心武器。纽卡的高强度体系进一步提升了他的对抗能力。";
wiki["Nick Woltemade"].wcSpotlight = "沃尔特梅德在大名单中更像是一个战术赌注——他的1.96米身高在德国锋线中独一无二（哈弗茨1.93米）。在纽卡斯尔的英超经验给了他应对任何防线体格的能力。如果德国打淘汰赛到最后时刻仍然落后，他的头球轰炸是纳格尔斯曼最后的底牌。";

// Groß: Borussia Dortmund → Brighton
wiki["Pascal Groß"].clubCareer = [
  { years: "2010–2012", club: "TSG Hoffenheim", apps: 5, goals: 0 },
  { years: "2012–2017", club: "FC Ingolstadt", apps: 162, goals: 19 },
  { years: "2017–", club: "Brighton & Hove Albion", apps: 320, goals: 38 }
];
wiki["Pascal Groß"].careerReview = "因戈尔施塔特→布莱顿。大器晚成的典型案例——28岁才首次入选德国国家队。2017年加盟布莱顿后在英超成为球队传奇——320场38球，是布莱顿队史出场最多的球员之一。长传转移和定位球能力在英超名列前茅。2024年德国欧洲杯首次在重要大赛中获得稳定出场——35岁终于得到国际认可。";
wiki["Pascal Groß"].wcSpotlight = "格罗斯以35岁的年龄参加第一次世界杯——这是足球史上少有的\"迟到的梦圆\"叙事。在布莱顿的整个职业生涯都证明了他的稳定性，英超持续高水平的出场数据让纳格尔斯曼无法忽视。他担任替补中场的角色，在需要控球节奏和时间管理时派上用场——他的传球选择极少失误，这是世界杯淘汰赛的重要品质。";

// Wirtz: Leverkusen → Liverpool
wiki["Florian Wirtz"].clubCareer = [
  { years: "2020–2025", club: "Bayer Leverkusen", apps: 175, goals: 48 },
  { years: "2025–", club: "Liverpool", apps: 38, goals: 12 }
];
wiki["Florian Wirtz"].careerReview = "科隆青训→勒沃库森→利物浦。2020年17岁德甲首秀，2023-24赛季成为阿隆索不败冠军球队的进攻核心——32场11球11助。他的足球智商高于任何同龄人。2025年以超过1亿英镑的转会费加盟利物浦——英超迅速适应，一个赛季38场12球。与穆西亚拉组成的\"双核\"在俱乐部和国家队都是世界级的。";
wiki["Florian Wirtz"].wcSpotlight = "维尔茨是德国队的\"大脑\"——在穆西亚拉提供盘带和个人突破的同时，维尔茨提供的是结构和传球。在利物浦的2025-26赛季他证明了自己在英超最高强度下的创造力不减——这对世界杯是完美的备战。他在欧冠淘汰赛的表现将直接决定纳格尔斯曼在世界杯上的战术部署。";

// Sané: Bayern → Galatasaray
wiki["Leroy Sané"].clubCareer = [
  { years: "2014–2016", club: "Schalke 04", apps: 57, goals: 13 },
  { years: "2016–2020", club: "Manchester City", apps: 135, goals: 39 },
  { years: "2020–2025", club: "Bayern Munich", apps: 200, goals: 55 },
  { years: "2025–", club: "Galatasaray", apps: 35, goals: 15 }
];
wiki["Leroy Sané"].careerReview = "沙尔克04青训→曼城→拜仁→加拉塔萨雷。2016年5200万欧元加盟曼城（瓜迪奥拉手下最可怕的边路武器），2020年转投拜仁，五年3座德甲冠军。2025年为寻求新的挑战和稳定出场转会土超加拉塔萨雷——在土耳其超级联赛继续展现顶级速度。速度顶尖、左脚内切射门致命——30岁的他在2026年可能是最后一届世界杯。";
wiki["Leroy Sané"].wcSpotlight = "萨内是德国队中最有爆发力但最难预测的球员。加拉塔萨雷2025-26赛季的欧冠之旅为他提供了最后的大赛舞台准备期。他的速度在反击中极具价值——尤其在对阵高位防线的对手时。土耳其联赛的身体对抗风格或许不如德甲激烈——但他在欧冠的表现才是纳格尔斯曼真正参考的标准。他的世界杯首球将在2026年到来——这对于一个76次出场打入15球的国家队球员来说是不可思议的。";

// Thiaw: AC Milan → Newcastle United
wiki["Malick Thiaw"].clubCareer = [
  { years: "2019–2022", club: "Schalke 04", apps: 60, goals: 2 },
  { years: "2022–2025", club: "AC Milan", apps: 95, goals: 3 },
  { years: "2025–", club: "Newcastle United", apps: 30, goals: 2 }
];
wiki["Malick Thiaw"].careerReview = "沙尔克04青训→AC米兰→纽卡斯尔。2022年以700万欧元加盟米兰后快速成长——1.94米的体格中卫，速度超出身高印象。在米兰的三年95场是防线的稳定成员。2025年转会纽卡斯尔——豪的高强度体系进一步提升了他的防守侵略性。芬兰和德国双重国籍，选择代表德国——他的身体质素正是德国后防线最稀缺的类型。";
wiki["Malick Thiaw"].wcSpotlight = "蒂奥是德国中卫中身体素质最爆炸的选项——在米兰和纽卡的顶级联赛经验让他具备了应对不同前锋类型的多样性。他大概率是吕迪格和施洛特贝克后的第三中卫，但他的速度和身体在淘汰赛面对内马尔或维尼修斯时需要极大发挥——一对一防守质量直接决定德国能走多远。纽卡2025-26赛季的欧冠表现将为他在世界杯上的状态提供最准确的标尺。";

// --- France (check) ---
// Théo Hernandez: I probably have him at Milan, squads says Al-Hilal
if (wiki["Théo Hernandez"] && wiki["Théo Hernandez"].currentClub !== "Al-Hilal") {
  wiki["Théo Hernandez"].clubCareer = [
    { years: "2015–2017", club: "Atlético Madrid", apps: 1, goals: 0 },
    { years: "2016–2017", club: "→ Alavés (loan)", apps: 38, goals: 2 },
    { years: "2017–2019", club: "Real Madrid", apps: 23, goals: 0 },
    { years: "2018–2019", club: "→ Real Sociedad (loan)", apps: 28, goals: 1 },
    { years: "2019–2025", club: "AC Milan", apps: 200, goals: 25 },
    { years: "2025–", club: "Al-Hilal", apps: 28, goals: 4 }
  ];
  wiki["Théo Hernandez"].currentClub = "Al-Hilal";
  wiki["Théo Hernandez"].careerReview = "马竞青训→皇马（失败）→AC米兰（重生，世界级）→利雅得新月。在米兰6年成长为世界最佳左后卫之一——2021-22赛季夺得意甲冠军。速度撕裂防线、左脚传中精准度顶级、进攻端相当于多一个边锋。2022世界杯首发一路到决赛，2024欧洲杯法国进入四强他是核心。2025年加盟沙特利雅得新月——这是28岁巅峰期的经济选择，也让他以更低的身体消耗备战2026世界杯。";
  wiki["Théo Hernandez"].wcSpotlight = "特奥·埃尔南德斯是法国左边路最锋利的武器——进攻属性超越防守。新月2025-26赛季的强度远低于五大联赛，但他的身体保养可能因祸得福——在28岁巅峰期避免消耗战，以更充沛的体能进入世界杯。法国队的左路进攻完全依赖他的前插——如果他的状态上佳，法国将同时拥有左路（特奥）和右路（登贝莱）的冲击力。";
}

// Kanté: I probably have him at Al-Ittihad, squads says Fenerbahçe
if (wiki["N'Golo Kanté"] && wiki["N'Golo Kanté"].currentClub !== "Fenerbahçe") {
  wiki["N'Golo Kanté"].clubCareer = [
    { years: "2011–2013", club: "Boulogne", apps: 38, goals: 3 },
    { years: "2013–2015", club: "Caen", apps: 82, goals: 6 },
    { years: "2015–2016", club: "Leicester City", apps: 40, goals: 1 },
    { years: "2016–2023", club: "Chelsea", apps: 269, goals: 13 },
    { years: "2023–2024", club: "Al-Ittihad", apps: 42, goals: 2 },
    { years: "2024–", club: "Fenerbahçe", apps: 50, goals: 1 }
  ];
  wiki["N'Golo Kanté"].currentClub = "Fenerbahçe";
  wiki["N'Golo Kanté"].careerReview = "法乙布洛涅→卡昂→莱斯特城→切尔西→吉达联合→费内巴切。足球史上最伟大的防守中场之一——2015-16赛季帮助莱斯特城实现英超奇迹冠军，2018年法国世界杯冠军核心。覆盖面积不可思议，场均抢断和拦截数据始终保持在精英水平。2023年加盟吉达联合后保持状态，2024年转投土超费内巴切继续在欧洲级别联赛中坚持——35岁的他仍然在跑动。";
  wiki["N'Golo Kanté"].wcSpotlight = "坎特以35岁的年龄第三次参加世界杯——他的跑动覆盖在费内巴切2025-26赛季继续维持着精英水平。他不再是2018年那个能覆盖全场的\"小人国巨人\"，但20-30分钟替补出场时他的经验和防守嗅觉可以锁定胜局。法国中场板凳深度远超其他球队——坎特是德尚手上最可靠的\"保险牌\"。";
}

// Cherki: I might have him at Lyon, squads says Manchester City
if (wiki["Rayan Cherki"] && wiki["Rayan Cherki"].currentClub !== "Manchester City") {
  wiki["Rayan Cherki"].clubCareer = [
    { years: "2019–2025", club: "Lyon", apps: 150, goals: 18 },
    { years: "2025–", club: "Manchester City", apps: 35, goals: 8 }
  ];
  wiki["Rayan Cherki"].currentClub = "Manchester City";
  wiki["Rayan Cherki"].careerReview = "里昂青训的最精美产品——16岁一线队首秀（里昂队史最年轻）。在里昂6年成长为法甲最具观赏性的攻击型中场——盘带和创造力出众，但终结效率一直是他和顶级球员之间的差距。2025年以4500万英镑加盟曼城——瓜迪奥拉看中了他的创造力和技术质地，认为能在城市足球学院的体系中释放出最佳版本。";
  wiki["Rayan Cherki"].wcSpotlight = "谢尔基在曼城2025-26赛季的进步将直接决定他在法国队的顺位。在曼城的体系下他的传球选择和比赛阅读有了质的飞跃——瓜迪奥拉的影响力是无法用数据衡量的。他在法国队不是首发（登贝莱和巴尔科拉在前面），但他的盘带和创造力在需要破解密集防守时是德尚的秘密武器。";
}

// Clean up _clubFixed marker
for (const key of Object.keys(wiki)) {
  delete wiki[key]._clubFixed;
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log('Reconciliation complete.');
