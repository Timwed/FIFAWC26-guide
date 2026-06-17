const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'src', 'data', 'players-wiki.json');
const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));

d['Yassine Bounou'] = {
  number: 1, fullName: 'Yassine Bounou', position: 'Goalkeeper', currentClub: 'Al-Hilal', nationalCaps: 90, nationalGoals: 0,
  clubCareer: [
    { years: '2012–2014', club: 'Wydad Casablanca' }, { years: '2014–2019', club: 'Atlético Madrid B' },
    { years: '2014–2016', club: 'Zaragoza (loan)' }, { years: '2016–2017', club: 'Girona (loan)' },
    { years: '2017–2019', club: 'Girona' }, { years: '2019–2024', club: 'Sevilla' }, { years: '2024–', club: 'Al-Hilal' }
  ],
  careerReview: '卡萨布兰卡出生，维达德青训起步，2014年进入马竞体系却从未在西蒙尼手下获得一线队出场——多次租借萨拉戈萨和赫罗纳后才站稳脚跟。2019年加盟塞维利亚是命运的转折：两座欧联杯冠军（2020、2023）、2022年世界杯四场零封带队打进四强、16强战对西班牙点球大战三次扑救——"博诺之夜"从此成为摩洛哥足球史上最伟大的个人表演。2024年加盟沙特利雅得新月后依然保持着非洲最佳门将的水准。',
  wcSpotlight: '35岁的布努是摩洛哥防线的定海神针，2022年打进四强的经验让他在淘汰赛高压环境下有着其他门将不具备的心理优势。小组赛将连续面对阿根廷和德国的锋线考验，只要他在球门线上，摩洛哥就有跟任何球队耗到点球大战的资本。'
};

d['Achraf Hakimi'] = {
  number: 2, fullName: 'Achraf Hakimi', position: 'Defender', currentClub: 'Paris Saint-Germain', nationalCaps: 96, nationalGoals: 11,
  clubCareer: [
    { years: '2017–2018', club: 'Real Madrid' }, { years: '2018–2020', club: 'Borussia Dortmund (loan)' },
    { years: '2020–2021', club: 'Inter Milan' }, { years: '2021–', club: 'Paris Saint-Germain' }
  ],
  careerReview: '马德里出生的摩洛哥之子，皇马青训体系最成功的出品之一。2018-2020年在多特蒙德租借期间彻底爆发——德甲两年54场7球14助攻，边后卫打出边锋数据。2020年转会国际米兰随队夺得意甲冠军，2021年被巴黎圣日耳曼以6000万欧元签下。在巴黎已拿下四座法甲冠军，是当今世界足坛公认的右后卫前二人选。96次国家队出场打入11球，2022年世界杯从小组赛到半决赛全部首发，四分之一决赛对葡萄牙的关键造点让摩洛哥历史性晋级四强。',
  wcSpotlight: '27岁的阿什拉夫处于边后卫的绝对巅峰，速度、体能和技术三不缺。他是摩洛哥攻防转换的发动机，从右路高速插上是阵地进攻和反击的双重杀招。小组赛直面阿根廷和德国边路冲击是他本届最大的防守考验。'
};

d['Sofyan Amrabat'] = {
  number: 4, fullName: 'Sofyan Amrabat', position: 'Midfielder', currentClub: 'Real Betis', nationalCaps: 75, nationalGoals: 0,
  clubCareer: [
    { years: '2013–2015', club: 'Utrecht' }, { years: '2015–2017', club: 'Feyenoord' },
    { years: '2017–2018', club: 'Club Brugge' }, { years: '2018–2020', club: 'Hellas Verona' },
    { years: '2020–2025', club: 'Fiorentina' }, { years: '2023–2024', club: 'Manchester United (loan)' },
    { years: '2025–', club: 'Real Betis' }
  ],
  careerReview: '荷兰出生、乌德勒支青训出品的防守型中场，2022年世界杯将他从意甲知名中场变成全球瞩目的"沙漠之肺"。卡塔尔七场比赛打满每一分钟，场均跑动12.3公里、22次抢断全部成功。佛罗伦萨五年后租借曼联一个赛季，英超的对抗强度进一步淬炼了他，2025年转会皇家贝蒂斯后成为西甲最稳定的防守中场之一。75次国家队出场，他是摩洛哥4231体系中那个永远不会离开防区的最后一道中场屏障。',
  wcSpotlight: '29岁的阿姆拉巴特身体和精神都在巅峰期，2022年证明了他能在连续七场高强度淘汰赛中保持稳定输出。本届他与年轻中场搭档的双后腰组合将直接面对阿根廷和德国中场群，这两个对位将决定摩洛哥能否突围。'
};

d['Brahim Díaz'] = {
  number: 10, fullName: 'Brahim Díaz', position: 'Forward', currentClub: 'Real Madrid', nationalCaps: 26, nationalGoals: 14,
  clubCareer: [
    { years: '2016–2019', club: 'Manchester City' }, { years: '2019–', club: 'Real Madrid' },
    { years: '2020–2023', club: 'AC Milan (loan)' }
  ],
  careerReview: '马拉加青训营出品的盘带鬼才，16岁被曼城签下，19岁以1700万欧元转会皇马。2020-2023年租借AC米兰的三个赛季成长为意甲最佳攻击手之一，随队夺得意甲冠军。2024年做出职业生涯最重要的决定：放弃西班牙选择代表母亲的祖国摩洛哥。26次出场打入14球，在皇马虽非常规首发但欧冠淘汰赛屡次贡献关键表现。',
  wcSpotlight: '26岁的迪亚兹是摩洛哥前场创造力的天花板，在4231体系中是那个被赋予自由度的前场自由人。他的盘带可以在禁区前沿制造犯规和任意球，是摩洛哥面对深防球队时最稀缺的能力。他和哈基米的右路配合将是本届最值得关注的边路组合之一。'
};

d['Ayoub El Kaabi'] = {
  number: 20, fullName: 'Ayoub El Kaabi', position: 'Forward', currentClub: 'Olympiacos', nationalCaps: 71, nationalGoals: 35,
  clubCareer: [
    { years: '2016–2017', club: 'RS Berkane' }, { years: '2017–2019', club: 'Wydad Casablanca' },
    { years: '2019–2021', club: 'Hatayspor' }, { years: '2021–', club: 'Olympiacos' }
  ],
  careerReview: '摩洛哥本土联赛出鞘的锋线利刃，RS贝尔卡尼出道后转会维达德，2018年夺得非洲国家锦标赛金靴。2019年加盟土耳其哈塔斯堡，2021年转会奥林匹亚科斯迎来巅峰——2023-24赛季欧协联决赛加时绝杀佛罗伦萨助球队捧杯，以11球荣膺赛事最佳射手。71次国家队出场打入35球，摩洛哥历史射手榜前列的旗帜人物。',
  wcSpotlight: '32岁的埃尔卡比是4231体系中无可替代的单箭头，头球能力和禁区抢点嗅觉在非洲排名前列。他的支点作用和背身做球能力比进球本身更重要，能为后排冲击的迪亚兹和乌纳希创造出宝贵的射门空间。'
};

d['Noussair Mazraoui'] = {
  number: 3, fullName: 'Noussair Mazraoui', position: 'Defender', currentClub: 'Manchester United', nationalCaps: 45, nationalGoals: 2,
  clubCareer: [
    { years: '2016–2022', club: 'Ajax' }, { years: '2022–2024', club: 'Bayern Munich' },
    { years: '2024–', club: 'Manchester United' }
  ],
  careerReview: '荷兰出生的全能边卫，阿贾克斯青训纯正产品——随队拿下三座荷甲冠军，2018-19赛季欧冠四强关键成员。2022年自由转会拜仁慕尼黑，两个赛季展现左右两端通吃的战术价值。2024年加盟曼联后迅速成为防线多面手。45次国家队出场，2022年世界杯七场全部首发，与哈基米构成了非洲顶级边卫组合。',
  wcSpotlight: '28岁的马兹拉维是防线万金油，左右后卫皆可客串后腰。面对阿根廷的边路冲击和德国的两翼进攻，他的全能属性让主帅在临场调整时有更多选择。'
};

d['Azzedine Ounahi'] = {
  number: 8, fullName: 'Azzedine Ounahi', position: 'Midfielder', currentClub: 'Girona', nationalCaps: 49, nationalGoals: 9,
  clubCareer: [
    { years: '2019–2021', club: 'Avranches' }, { years: '2021–2023', club: 'Angers' },
    { years: '2023–2025', club: 'Marseille' }, { years: '2025–', club: 'Girona' }
  ],
  careerReview: '2022年世界杯的最大发现——法国第三级别联赛阿夫朗什起步，卡塔尔世界杯上他场均4.3次盘带过人，对西班牙和葡萄牙的淘汰赛中以中场核心姿态驾驭了整场比赛。恩里克赛后坦言"这个8号是谁"让整个欧洲开始追逐他。2023年转会马赛，2025年加盟吉罗纳在西甲继续升级。49次国家队出场9粒进球，是摩洛哥中场双引擎中更具攻击性的那一环。',
  wcSpotlight: '26岁的乌纳希是摩洛哥创造力之源，盘带能力可以破掉对方第一层高位压迫。相比2022年的惊喜，2026年他承载着更高期望——所有人都认识他了，对手会专门布置限制，他能否在受迫环境中依然优雅控球？'
};

d['Bilal El Khannouss'] = {
  number: 23, fullName: 'Bilal El Khannouss', position: 'Midfielder', currentClub: 'VfB Stuttgart', nationalCaps: 37, nationalGoals: 3,
  clubCareer: [
    { years: '2020–2024', club: 'Genk' }, { years: '2024–', club: 'VfB Stuttgart' }
  ],
  careerReview: '比利时出生的摩洛哥"大脑"，根克青训出品，2022-23赛季荣膺比利时最佳年轻球员。2022年世界杯大名单最年轻球员之一，有限出场时间里展现了远超年龄的球场决策力。2024年转会斯图加特后迅速成为德甲最好的创造型中场之一，37次国家队出场3粒进球，是摩洛哥未来十年的中场基石。',
  wcSpotlight: '22岁的埃尔哈努斯是摩洛哥从"防守反击"走向"控球进攻"的关键人物。德甲高强度转换节奏的打磨对世界杯淘汰赛至关重要，他与乌纳希的中场组合可能成为本届最具观赏性的双核驱动之一。'
};

d['Ismael Saibari'] = {
  number: 11, fullName: 'Ismael Saibari', position: 'Midfielder', currentClub: 'PSV Eindhoven', nationalCaps: 31, nationalGoals: 9,
  clubCareer: [
    { years: '2020–', club: 'PSV Eindhoven' }
  ],
  careerReview: 'PSV青训的全能中场，从青年队一路杀进一线队。2023-24赛季荷甲冠军成员，能打8号位也能客串10号位和边锋的战术多面手。31次国家队出场打入9球，进攻端投入度和禁区后插上时机把握出色。PSV持续多年的欧战经验为摩洛哥中场增加了硬度与平衡。',
  wcSpotlight: '25岁的塞巴里是摩洛哥中场的第三选择，不是常规首发但替补登场能改变比赛节奏。当阿姆拉巴特需要休息或球队需要增强进攻火力时，他的体能和覆盖能力让摩洛哥不会在三换之后掉队。'
};

d['Soufiane Rahimi'] = {
  number: 9, fullName: 'Soufiane Rahimi', position: 'Forward', currentClub: 'Al Ain', nationalCaps: 37, nationalGoals: 12,
  clubCareer: [
    { years: '2017–2021', club: 'Raja Casablanca' }, { years: '2021–', club: 'Al Ain' }
  ],
  careerReview: '拉加竞技青训出品的速度型前锋，在摩洛哥联赛和非洲冠军联赛中屡次用爆发力和门前嗅觉撕破防线。2021年加盟阿联酋艾因，2024年亚冠联赛以13球荣膺金靴和赛事MVP。37次国家队出场12个进球，虽然2022世界杯多从板凳出发，但替补冲击力在淘汰赛阶段不可忽视。',
  wcSpotlight: '30岁的拉希米是摩洛哥锋线轮换中速度维度和单兵爆破能力最突出的选项。面对阿根廷和德国这些控球型对手，他从左路的高速身后冲击可能是反击的第一发起点。'
};

d['Chadi Riad'] = {
  number: 18, fullName: 'Chadi Riad', position: 'Defender', currentClub: 'Crystal Palace', nationalCaps: 6, nationalGoals: 1,
  clubCareer: [
    { years: '2022–2023', club: 'Barcelona B' }, { years: '2023–2024', club: 'Real Betis' },
    { years: '2024–', club: 'Crystal Palace' }
  ],
  careerReview: '巴塞罗那拉玛西亚青训出品的左脚中卫，2023年转会皇家贝蒂斯在西甲站稳脚跟。2024年转会英超水晶宫，在英格兰对抗强度和节奏中继续成长。6次国家队出场，左脚中卫属性在摩洛哥防线属于稀缺资源。',
  wcSpotlight: '22岁的里亚德是摩洛哥防线的未来，英超对抗经验和左脚出球能力让他在面对高位逼抢时可能获得出场机会。在英超禁区里活下来的中卫，世界杯上也扛得住。'
};

d['Neil El Aynaoui'] = {
  number: 24, fullName: 'Neil El Aynaoui', position: 'Midfielder', currentClub: 'Roma', nationalCaps: 16, nationalGoals: 2,
  clubCareer: [
    { years: '2021–2023', club: 'Lens' }, { years: '2023–', club: 'Roma' }
  ],
  careerReview: '法国出生、朗斯青训出品的全面型中场，2023年转会罗马后逐渐获得信任。防守覆盖范围大、攻守转换传球决策果断。16次国家队出场打入2球，被寄予"下一个阿姆拉巴特"的厚望，但在罗马的禁区外远射是常规武器，比前辈更具攻击性。',
  wcSpotlight: '24岁的埃尔亚纳维是摩洛哥后腰位置的未来和现在。如果摩洛哥选择4231将和阿姆拉巴特组成双后腰，面对阿根廷和德国中场群，他能否在高节奏下保持冷静出球将决定摩洛哥的出球效率。'
};

d['Marwane Saâdane'] = {
  number: 5, fullName: 'Marwane Saâdane', position: 'Defender', currentClub: 'Al-Fateh', nationalCaps: 8, nationalGoals: 0,
  clubCareer: [
    { years: '2014–2020', club: 'Wydad Casablanca' }, { years: '2020–', club: 'Al-Fateh' }
  ],
  careerReview: '维达德青训体系培养的老派中卫，身体对抗硬朗、空中球争顶优势著称。在沙特联赛效力多年稳坐主力，8次国家队出场虽未进球但凭借经验和大局观在防线轮换时是可靠选择。',
  wcSpotlight: '34岁的萨达内是中卫体系的第三或第四顺位，常规四后卫不太可能首发，但三中卫变阵时正面拦截能力可能派上用场。本届世界杯很可能是他的第一届也是最后一届。'
};

d['Ayyoub Bouaddi'] = {
  number: 6, fullName: 'Ayyoub Bouaddi', position: 'Midfielder', currentClub: 'Lille', nationalCaps: 3, nationalGoals: 0,
  clubCareer: [
    { years: '2022–', club: 'Lille' }
  ],
  careerReview: '里尔青训最耀眼的新星之一，18岁进入法甲一线队轮换阵容。控球细腻、面对高压时冷静不慌。法国足球界一度希望在成年国家队争取他，但他选择了父母祖国的摩洛哥。3次国家队出场，本届大名单中年龄最小的球员。',
  wcSpotlight: '18岁的布阿迪是这届世界杯最年轻的球员之一，大概率不会有太多出场时间，但入队本身是对天赋的最高认可。如果摩洛哥提前锁定出线资格，他可能在第三场获得世界杯首秀。未来在2030年，这届是预习。'
};

d['Chemsdine Talbi'] = {
  number: 7, fullName: 'Chemsdine Talbi', position: 'Midfielder', currentClub: 'Sunderland', nationalCaps: 5, nationalGoals: 0,
  clubCareer: [
    { years: '2023–', club: 'Sunderland' }
  ],
  careerReview: '比利时出生的攻击型中场，速度型边锋属性突出，盘带和边路一对一突破是核心武器。2023年加盟英冠桑德兰后在英格兰高强度联赛中逐渐适应了对抗节奏。5次国家队出场尚在积累进球，但边路纵深冲击能力是替补席上的战术变量。',
  wcSpotlight: '21岁的塔尔比是板凳席上的速度奇兵，当球队需要边路一防一突破时他是少有的能从单点撕开防线的选项。这届世界杯对他最重要的是在大赛氛围中吸收经验。'
};

d['Munir Mohamedi'] = {
  number: 12, fullName: 'Munir Mohamedi', position: 'Goalkeeper', currentClub: 'RS Berkane', nationalCaps: 53, nationalGoals: 0,
  clubCareer: [
    { years: '2010–2017', club: 'Numancia' }, { years: '2020–', club: 'RS Berkane' }
  ],
  careerReview: '西班牙努曼西亚体系培养的摩洛哥国门，53次国家队出场是摩洛哥门将史上出勤率第二高的球员。长期在摩洛哥联赛RS贝尔卡尼效力，2024年随队拿下非洲联合会杯冠军，在训练中给主力门将持续施压。',
  wcSpotlight: '37岁的穆尼尔可能是最后一届世界杯，在布努的光芒下大部分时间在替补席度过。但如果布努因黄牌等原因无法出场，53场国家队出场的经验是他的底气所在。'
};

d['Zakaria El Ouahdi'] = {
  number: 13, fullName: 'Zakaria El Ouahdi', position: 'Defender', currentClub: 'Genk', nationalCaps: 3, nationalGoals: 0,
  clubCareer: [
    { years: '2022–', club: 'Genk' }
  ],
  careerReview: '比利时出生的右后卫，根克青训体系逐步升入一线队。速度和传中质量出色，在比利时职业联赛的稳定表现让他获得了世界杯大名单的一席之地。仅3次国家队出场但正处在24岁边后卫的黄金起步阶段。',
  wcSpotlight: '24岁的埃尔瓦赫迪是阿什拉夫的替补，绝大部分时间在板凳上。但在密集的七场淘汰赛赛程中，哈基米的体能不可能打满从头到尾，一旦获得出场机会就是证明自己的舞台。'
};

d['Issa Diop'] = {
  number: 14, fullName: 'Issa Diop', position: 'Defender', currentClub: 'Fulham', nationalCaps: 4, nationalGoals: 0,
  clubCareer: [
    { years: '2015–2018', club: 'Toulouse' }, { years: '2018–2022', club: 'West Ham United' },
    { years: '2022–', club: 'Fulham' }
  ],
  careerReview: '图卢兹青训的纯正产品，2018年以2500万英镑的高价转会西汉姆联，积累了超100场英超出场经验。2022年转会同城富勒姆后依旧是防线重要轮换。虽然他代表法国各级青年队出场多年但最终选择了摩洛哥。',
  wcSpotlight: '29岁的迪奥普是防线中英超经验最多的中卫，富勒姆的英超对抗让他在节奏上保持最高水平。他不一定首发，但面对英格兰或类似风格对手时用英超中卫对位是一个潜在方案。'
};

d['Samir El Mourabet'] = {
  number: 15, fullName: 'Samir El Mourabet', position: 'Midfielder', currentClub: 'Strasbourg', nationalCaps: 4, nationalGoals: 0,
  clubCareer: [
    { years: '2023–', club: 'Strasbourg' }
  ],
  careerReview: '法国出生的年轻中场，斯特拉斯堡青训体系精心培养的新锐。20岁进入法甲一线队本身就是天赋的印证，身体素质、拦截意识和控球能力在法国青年足球界引起关注。4次国家队出场是教练组计划性培养的明确信号。',
  wcSpotlight: '20岁的埃尔穆拉贝特在26人大名单中更多是学习者和储备力量的角色。摩洛哥中场深度不算宽裕，伤病或停赛可能给他打开世界杯的出场之门。'
};

d['Gessime Yassine'] = {
  number: 16, fullName: 'Gessime Yassine', position: 'Midfielder', currentClub: 'Strasbourg', nationalCaps: 5, nationalGoals: 0,
  clubCareer: [
    { years: '2023–', club: 'Strasbourg' }
  ],
  careerReview: '与埃尔穆拉贝特一起在斯特拉斯堡成长起来的年轻中场，两人在俱乐部的并肩作战为摩洛哥中场建设提供了化学反应基础。技术型中场，擅长小范围传切配合和维持控球权，在法甲高对抗环境下逐步适应了职业比赛节奏。',
  wcSpotlight: '20岁的亚辛在世界杯舞台上是个完全的新面孔，实际出场机会可能非常有限，但法甲欧战区级别的日常训练让他保持高水准。即便这届不出场，世界杯大名单的身份也已是沉甸甸的履历。'
};

d['Amine Sbaï'] = {
  number: 17, fullName: 'Amine Sbaï', position: 'Forward', currentClub: 'Angers', nationalCaps: 2, nationalGoals: 0,
  clubCareer: [
    { years: '2023–', club: 'Angers' }
  ],
  careerReview: '法国出生的边锋，昂热青训出身的攻击手，速度和单兵突破能力是核心武器。在法甲中下游球队效力的经历让他习惯了在压力环境中发挥。左路内切远射和传中是招牌动作。',
  wcSpotlight: '25岁的斯拜是锋线板凳最深层的选项。迪亚兹、拉希米和埃尔卡比的顺位都在他之前，但如果摩洛哥提前锁定出线资格，他可能获得梦寐以求的世界杯首秀机会。'
};

d['Youssef Belammari'] = {
  number: 19, fullName: 'Youssef Belammari', position: 'Defender', currentClub: 'Al Ahly', nationalCaps: 19, nationalGoals: 0,
  clubCareer: [
    { years: '2019–2022', club: 'Ittihad Tanger' }, { years: '2022–', club: 'Al Ahly' }
  ],
  careerReview: '坦吉尔联合青训培养的左后卫，以体能储备和防守纪律性著称。2022年转会开罗国民后在非洲冠军联赛中积累了丰富的洲际比赛经验。19次国家队出场是左路防守的可靠选项，极少在前插后丢掉防守位置。',
  wcSpotlight: '27岁的贝拉马里是左后卫序列中的纯防守选项，常年征战非洲冠军联赛淘汰赛，大赛高压环境中的心理素质不成问题。本届世界杯是他的巅峰年华。'
};

d['Ayoube Amaimouni'] = {
  number: 21, fullName: 'Ayoube Amaimouni', position: 'Forward', currentClub: 'Eintracht Frankfurt', nationalCaps: 2, nationalGoals: 0,
  clubCareer: [
    { years: '2024–', club: 'Eintracht Frankfurt' }
  ],
  careerReview: '法兰克福青训挖掘的锋线新星，速度和跑位能力在同龄前锋中被高度评价，在德甲高强度转换节奏锤炼中逐渐适应了职业比赛。2次国家队出场正在积累阶段，是摩洛哥锋线未来的储备资产。',
  wcSpotlight: '21岁的阿麦穆尼是26人名单中最令人意外的入选之一，他是教练组对未来锋线的战略性投资。本届主要任务是观察和学习，真正的出场机会取决于小组赛进程。'
};

d['Ahmed Reda Tagnaouti'] = {
  number: 22, fullName: 'Ahmed Reda Tagnaouti', position: 'Goalkeeper', currentClub: 'AS FAR', nationalCaps: 3, nationalGoals: 0,
  clubCareer: [
    { years: '2020–', club: 'AS FAR' }
  ],
  careerReview: '摩洛哥皇家武装部队俱乐部的主力门将，在摩洛哥本土甲级联赛积累了丰富的比赛经验。30岁、3次国家队出场，门将位置第三顺位人选，训练态度和职业精神得到教练组认可。',
  wcSpotlight: '塔格纳乌提是大名单中的第三门将，除非极端伤病情况否则不太可能获得实际出场时间。但进入世界杯大名单本身就是职业生涯的巅峰时刻。'
};

d['Redouane Halhal'] = {
  number: 25, fullName: 'Redouane Halhal', position: 'Defender', currentClub: 'Mechelen', nationalCaps: 3, nationalGoals: 0,
  clubCareer: [
    { years: '2022–', club: 'Mechelen' }
  ],
  careerReview: '梅赫伦青训体系走出的后卫，在比利时甲级联赛中积累了稳定的出场时间。身体素质出色，高空球争顶和定位球防守中具有独特战术价值，一对一对抗成功率在比甲后卫中表现不俗。',
  wcSpotlight: '23岁的哈尔哈尔是防线板凳末端的储备选项，机会可能出现在伤病或黄牌停赛时。本届世界杯经历将加速他从比利时联赛迈向更高级别平台的步伐。'
};

d['Anass Salah-Eddine'] = {
  number: 26, fullName: 'Anass Salah-Eddine', position: 'Defender', currentClub: 'PSV Eindhoven', nationalCaps: 9, nationalGoals: 0,
  clubCareer: [
    { years: '2021–2024', club: 'Ajax' }, { years: '2024–', club: 'PSV Eindhoven' }
  ],
  careerReview: '阿贾克斯青训出品的左脚边卫，经历了荷兰足球最严格的传控训练后转投PSV埃因霍温。传中质量和左脚弧线球是标志，9次国家队出场正在逐步增加。进攻属性是特定比赛中的特殊武器。',
  wcSpotlight: '24岁的萨拉赫-埃丁是摩洛哥左路的纯进攻选项，如果比赛进入必须进球的模式，他的传中和左脚定位球是创造机会的有力手段。本届可能扮演特定换人场景下的战术棋子。'
};

fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf8');
console.log('Morocco bios written (26 players)');
