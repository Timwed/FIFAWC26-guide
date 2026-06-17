var p = require(__dirname + '/../src/data/players-wiki.json');
var entries = {};

// === SWITZERLAND BATCH 2 ===

entries['Ricardo Rodriguez'] = {
    number:'13', fullName:'Ricardo Rodriguez', position:'Defender', currentClub:'Real Betis', image:'',
    clubCareer:[{years:'2010–2012',club:'FC Zürich'},{years:'2012–2017',club:'VfL Wolfsburg'},{years:'2017–2020',club:'AC Milan'},{years:'2020–2021',club:'→ PSV Eindhoven'},{years:'2021–2024',club:'Torino'},{years:'2024–',club:'Real Betis'}],
    nationalCaps:138, nationalGoals:9, extractPreview:'', introPreview:'',
    careerReview:'瑞士左路防守的不朽传奇——罗德里格斯在2012年从苏黎世转会沃尔夫斯堡后立即成为了德甲最令人恐惧的左脚定位球专家，在狼堡的五年间他的左脚传中和任意球精准度享誉全欧洲。转会AC米兰后虽未完全兑现圣西罗的期待，但在租借PSV和转会都灵的意大利联赛历程中他积累了足以装下一辆卡车的防守经验。在都灵他接受了意大利最严苛的防线教育——学会了一个左后卫在有球和无球状态下的每一毫米位置调整——虽然速度从来不是他的长项，但足球智商和阅读比赛的能力在他这个年龄段的球员中是顶级的。2024年转会皇家贝蒂斯给了他最后一次在伊比利亚技术足球中体验晚年生涯的机会。138次国家队出场是瑞士队史第二多的记录，9个进球——包括多记任意球——是瑞士足球最闪亮的档案。',
    wcSpotlight:'罗德里格斯将以队史出场第二多球员的身份最后一战世界杯。33岁的他不再有回追边锋的顶级速度，但他左脚的传中和定位球精度仍然是瑞士在破密集防守时最可靠的进攻方案之一。在皇家贝蒂斯的西甲赛季中他在伊比利亚风格的防守体系中找到了新的"慢速生存法"——用位置感和预判替代速度。世界杯是一个残酷的测试场——如果他面对的是加拿大的布坎南或波黑的快马后卫，速度差距将是一道不容回避的考题。但138次国家队出场的经验从不惧怕任何考试。'
};

entries['Ardon Jashari'] = {
    number:'14', fullName:'Ardon Jashari', position:'Midfielder', currentClub:'Milan', image:'',
    clubCareer:[{years:'2019–2024',club:'FC Luzern'},{years:'2024–2025',club:'Club Brugge'},{years:'2025–',club:'Milan'}],
    nationalCaps:8, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'卢塞恩青训培养的下一代瑞士中场核心——贾沙里在瑞士超的启蒙教育中展示出的比赛智商和技术基本功让所有人都提前预见了他的"更大前途"。转会布鲁日后他在比利时联赛的竞争环境中进一步打磨了自己的控球和出球能力，随后的AC米兰转会则是瑞士足球出口市场的一个标志性时刻——一名在瑞士超成长的年轻中场直接被意甲豪门签下。8次国家队出场的数据尚在积累中，但23岁的他和曼赞比一同构成了瑞士未来的中场双核。',
    wcSpotlight:'贾沙里的世界杯将是他的"在最高舞台上沉浸式体验课"。在AC米兰的环境中他每天都在和意甲最顶级的中场进行对抗和训练——这些经历将在世界杯上隐形地转化为他面对压力时的"心理基准感"。小组赛中他可能会在对阵卡塔尔时获得出场机会——教练组将在这个相对低压的比赛中测试他的成熟度。他的2026世界杯是一场未来投资，但瑞士足球已经为这个投资等待了太久。'
};

entries['Djibril Sow'] = {
    number:'15', fullName:'Djibril Sow', position:'Midfielder', currentClub:'Sevilla', image:'',
    clubCareer:[{years:'2015–2017',club:'Borussia Mönchengladbach II'},{years:'2017–2019',club:'Young Boys'},{years:'2019–2023',club:'Eintracht Frankfurt'},{years:'2023–2025',club:'Sevilla'},{years:'2025–',club:'Sevilla'}],
    nationalCaps:52, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'瑞士中场肌群中最可靠的一块肌肉——索乌在年轻人俱乐部和法兰克福的四年间完成了从年轻天才到欧洲中场的阶级跃迁。在法兰克福的四年中他成了全欧洲中场中最不合理的跑动机器——覆盖、拦截、两脚出球、然后立刻再次跑向下一个位置——他的比赛看起来更像是一台在球场上不断移动的雷达系统而不是一个人。2022年随法兰克福夺得欧联杯冠军是他职业生涯的巅峰荣誉。转会塞维利亚后在西甲的技术性环境中他继续着对"不进球但不可替代"角色的完美阐释。52次国家队出场0个进球——这个数字看起来残酷，但瑞士教练组清楚地知道他放在场上不是为了进球，他是为了"绝对不会被对手穿透"而存在的。',
    wcSpotlight:'索乌在2026世界杯上的使命如此简洁：他是瑞士中场的"防火墙"。当扎卡负责创造、弗鲁勒负责衔接时，索乌的任务是把那些在中场试图突破瑞士阵线的所有球全部截停——不管是来自加拿大快速的中场推进还是波黑的纵向插入，索乌都会是那个让这些企图在被酝酿的第一秒就被拦截的人。他在欧联杯决赛级别的高压环境中有过直接经验，在世界杯的中场缠斗中这比他0个进球的统计数据有用一百倍。'
};

entries['Christian Fassnacht'] = {
    number:'16', fullName:'Christian Fassnacht', position:'Forward', currentClub:'Young Boys', image:'',
    clubCareer:[{years:'2014–2016',club:'FC Thun'},{years:'2016–2023',club:'Young Boys'},{years:'2023–2024',club:'Norwich City'},{years:'2024–',club:'Young Boys'}],
    nationalCaps:23, nationalGoals:5, extractPreview:'', introPreview:'',
    careerReview:'伯尔尼年轻人的"自家英雄"——法斯纳赫特在年轻人俱乐部两次效力之间短暂尝试了英冠诺维奇城的生活，但最终回到了他在瑞士足球最辉煌时期效力的俱乐部。他的比赛风格是典型的瑞士式边路：不追求花哨的个人数据，而是专注于为中路创造空间，以及在对方边后卫身后的空档中寻找传中机会。23次国家队出场5个进球的效率对于一个轮换边锋来说已经完全是进入状态的成绩单。',
    wcSpotlight:'法斯纳赫特在瑞士边路轮换中的角色定位非常清晰——当主力边锋在前60分钟跑得气喘吁吁时，他就从替补席上站起来。他在年轻人在瑞士超中的稳定出场意味着他的比赛节奏不会丢失——对于一个32岁却在等待自己十五分钟世界杯的人来说，保持比赛节奏就是一切。在短暂时刻他的传中质量和在禁区内的位置把握也许会是瑞士在僵局时打进的意外进球。'
};

entries['Rubén Vargas'] = {
    number:'17', fullName:'Rubén Vargas', position:'Forward', currentClub:'Sevilla', image:'',
    clubCareer:[{years:'2017–2019',club:'FC Luzern'},{years:'2019–2025',club:'FC Augsburg'},{years:'2025–',club:'Sevilla'}],
    nationalCaps:61, nationalGoals:11, extractPreview:'', introPreview:'',
    careerReview:'瑞士攻击线上最具"德甲烙印"的攻击手——巴尔加斯在卢塞恩的早期生涯被奥格斯堡发掘后转会德甲，在那里他成长为德甲最具威胁性的左脚内切边锋之一。在奥格斯堡六年间的持续贡献让他在瑞士国家队中成为了边路的第一攻击选择，他的射门精度和在大禁区内切后的远角推射在攻击手中的成功率属于顶级。2025年加盟塞维利亚后他在西甲的技术环境中进一步提升了自己面对西方式防守体系的进攻智慧。61次国家队出场11个进球的数据已属优秀（对于边锋来说），他在2024欧洲杯上打入关键进球的表现也证明了他的大赛适应力。',
    wcSpotlight:'巴尔加斯在2026世界杯上将是瑞士左侧攻击的首选武器——他在奥格斯堡练就的"内切→射门"流程在德甲已经经过了数百次的测试和改进，而这种精确度在面对世界杯小组赛级别的防线时依然是一种高概率的进球手段。当加拿大和波黑的边后卫试图封锁恩博洛的中路时，经常会在注意力缝隙中让巴尔加斯从左路内切——那时整个瑞士的进球希望就集中在那一秒钟的射门精度上。'
};

entries['Eray Cömert'] = {
    number:'18', fullName:'Eray Cömert', position:'Defender', currentClub:'Valencia', image:'',
    clubCareer:[{years:'2016–2022',club:'FC Basel'},{years:'2022–2025',club:'Valencia'},{years:'2024',club:'→ Nantes'},{years:'2025–',club:'Valencia'}],
    nationalCaps:22, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'巴塞尔青训体系的坚实产品——乔梅尔特在瑞士足球的大本营中接受了完整的后卫教育后在2022年转会西甲瓦伦西亚，在西班牙最具激情的足球城市中接受截然不同的防守文化训练。短暂租借法甲南特为他增添了另一层欧洲足球体验。他是一名偏传统的瑞士中卫：身体对抗项目达标、空中球争夺能力较强、但在面对速度型前锋时略显笨重。22次国家队出场没有失球的场次占多数——这个统计至少证明了他出场时瑞士的防守不会因为他的存在而突然崩塌。',
    wcSpotlight:'乔梅尔特作为瑞士中卫轮换的第三或第四选择进入世界杯。他在西甲瓦伦西亚的赛季中每周都在面对西甲速度型前锋的冲击——虽然大多数时候处于下风，但被反复训练出来的心理韧性在世界杯上将转化为"不怵任何人"的态度。如果阿坎吉或埃尔维迪出现停赛或伤病，他将是紧急时刻被叫上首发的那个人——对于轮换中卫来说，世界杯生涯可能只是45分钟的紧急替换，但那45分钟的质量就定义了你的全部。'
};

entries['Noah Okafor'] = {
    number:'19', fullName:'Noah Okafor', position:'Forward', currentClub:'Leeds United', image:'',
    clubCareer:[{years:'2018–2020',club:'FC Basel'},{years:'2020–2023',club:'Red Bull Salzburg'},{years:'2023–2025',club:'AC Milan'},{years:'2025–',club:'Leeds United'}],
    nationalCaps:25, nationalGoals:2, extractPreview:'', introPreview:'',
    careerReview:'巴塞尔红牛生产线+AC米兰的混合产品——奥卡福尔在巴塞尔出道后被萨尔茨堡红牛挖掘并在红牛的高压进攻体系中被塑造为一名极具爆发力的前锋。在红牛期间他的欧冠进球（尤其是远射和快速反击终结）让全欧洲都注意到了一名"从无到有创造进球"的攻击手。转会AC米兰后虽然未能拿下绝对主力位置，但在圣西罗的两年让他吸收了意甲关于"一个前锋不能被定义为速度快就够了"的深刻教育。2025年转会利兹联加入英冠/英超的激烈竞争环境为他的职业生涯提供了新的起点。25次国家队出场仅有2个进球的效率令人遗憾——他在俱乐部的天才从未完全在国家队数据中爆裂出来。',
    wcSpotlight:'奥卡福尔将是瑞士在世界杯上"能制造差异"的替补攻击手——他的标签就是不可预测。在萨尔茨堡红牛时期的欧冠进球展示了一名前锋在完全没有预兆时突然用一记远射打破比赛的能力，在利兹联的英式足球环境中他正在学习如何在更激烈的对抗中保持这种突然性。他的数据不漂亮，但世界杯有时候不看数据——它在看，当比赛在70分钟后进入僵持、体能开始透支时，"谁能突然做一件没有人预料到的事情"。奥卡福尔欠自己的差、欠自己的数据，本届世界杯就是他兑现的最后一班列车。'
};

entries['Michel Aebischer'] = {
    number:'20', fullName:'Michel Aebischer', position:'Midfielder', currentClub:'Pisa', image:'',
    clubCareer:[{years:'2016–2019',club:'Young Boys'},{years:'2019–2023',club:'Bologna'},{years:'2023–2024',club:'→ Atalanta'},{years:'2024–',club:'Pisa'}],
    nationalCaps:40, nationalGoals:2, extractPreview:'', introPreview:'',
    careerReview:'伯尔尼年轻人的本土中场精英——埃比舍尔在年轻人时期的系统教育加上在博洛尼亚的四年意甲实战经历塑造了他作为现代中场的完整轮廓。在博洛尼亚他的场上角色从"控球箱"发展到了"全场衔接器"——他学会了在意甲这种极度讲求战术纪律的环境中如何同时完成防守补位和进攻前插。短暂租借亚特兰大给了他接触更极端的进攻型战术体系的机会。转会比萨后他在意乙的高强度竞争环境中继续着中场生涯。40次国家队出场2个进球的数据更接近一个"组织者"而非"终结者"——而这正是他被教练组最欣赏的素质。',
    wcSpotlight:'埃比舍尔在瑞士中场的角色通常被视为"扎卡的替补"——这是一个极难承担的角色，因为扎卡不仅是瑞士中场的组织核心，更是更衣室的绝对领导者。但埃比舍尔在博洛尼亚和比萨的多年意甲经历给了他足够的战术成熟度——当扎卡需要在高强度比赛中获得休息时，埃比舍尔的任务不是"成为扎卡"，而是"成为一支瑞士中场依然可以流畅运转的保障"。这届世界杯他有信心让教练组在考虑轮换时不再将他的位置标记为"危险区"。'
};

entries['Marvin Keller'] = {
    number:'21', fullName:'Marvin Keller', position:'Goalkeeper', currentClub:'Young Boys', image:'',
    clubCareer:[{years:'2022–2024',club:'FC Wil'},{years:'2024–',club:'Young Boys'}],
    nationalCaps:1, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'瑞士青年门将培养体系的新晋产品——凯勒在维尔俱乐部和年轻人的青训通道中成长后进入了瑞士超的竞争环境。1次国家队出场表明他目前仍处于国家队门将梯队的最边缘位置，但他24岁的年龄和年轻人的瑞士超平台给了他继续打磨门将技术的空间和时间。入选2026年世界杯大名单是教练组对他训练态度和潜在能力最大的认可。',
    wcSpotlight:'凯勒几乎可以确定不会在世界杯上获得出场时间——作为瑞士的第三门将，他的价值更多体现在训练场上的投入和替补席上的敏捷。但他需要让自己准备好应对所有可能性——尤其是当科贝尔或姆沃戈在比赛中出现突发情况时。在门将这个位置上运气有时候就是突然降临的，而凯勒需要让"我一直在准备"成为他唯一的内心旁白。'
};

entries['Fabian Rieder'] = {
    number:'22', fullName:'Fabian Rieder', position:'Midfielder', currentClub:'FC Augsburg', image:'',
    clubCareer:[{years:'2020–2023',club:'Young Boys'},{years:'2023–2024',club:'→ Rennes'},{years:'2024–2025',club:'Rennes'},{years:'2025–',club:'FC Augsburg'}],
    nationalCaps:28, nationalGoals:1, extractPreview:'', introPreview:'',
    careerReview:'伯尔尼年轻人的又一核心输出品——里德在年轻人俱乐部以极具创造力的进攻中场身份崭露头角，他在禁区前沿的传球视野和远射能力是瑞士新一代中场中最具观赏性的例证。租借和转会法甲雷恩让他在另一套技术型传控体系中检验了自己的创造力，随后加盟奥格斯堡回到熟悉的德甲节奏。28次国家队出场1个进球的记录对于一个进攻型中场来说偏保守——他的机会创造数据可能比他自己的射门数据更能反映他的真实贡献。',
    wcSpotlight:'里德在世界杯上将是瑞士中前场创造力的X因素——当扎卡的纵向传球被密集防守所限制时，里德的远射能力和在狭小空间内的突破想象力会变成瑞士打破僵局的另一种方法。在奥格斯堡的德甲环境给他提供了一份高压对抗下的比赛经验——德甲是世界上节奏最混乱的顶级联赛之一，这意味着他不怕乱，甚至享受乱。如果瑞士在僵局中将里德从替补席上放出，请注意弧顶区域——他正在扫描一次起脚的可能。'
};

entries['Zeki Amdouni'] = {
    number:'23', fullName:'Zeki Amdouni', position:'Forward', currentClub:'Burnley', image:'',
    clubCareer:[{years:'2021–2022',club:'FC Stade Lausanne Ouchy'},{years:'2022–2023',club:'→ Basel'},{years:'2023–2025',club:'Burnley'},{years:'2025',club:'→ Benfica'},{years:'2025–',club:'Burnley'}],
    nationalCaps:29, nationalGoals:11, extractPreview:'', introPreview:'',
    careerReview:'瑞士进攻线上最高效的射手之一——阿姆杜尼在洛桑乌希和巴塞尔期间爆发后立即被英超伯恩利以高价签走，标志着他在短时间内完成了从瑞士挑超到英超的四级跳。他在国家队的进球效率令人侧目——29次出场11个进球，这个数字在许多名将前锋之上——其奥秘在于他的射门选择和禁区内的冷静度：在关键时刻他不会因压力而浪费机会。在伯恩利的英超/英冠生涯中他虽然经历了球队的整体波动，但他个人的终结能力从未被联赛的变化所完全侵蚀。',
    wcSpotlight:'阿姆杜尼在瑞士前场角色中是一种极其特殊的"纯射手"——他不占据太多球权，但他占据进球机会。当恩博洛和边锋们在禁区内制造混乱后反弹出来的球往往会在阿姆杜尼的脚下被他送进球门，这就是29场11球效率背后的简单公式。在伯恩利的英冠和英超经历给了他面对英国式防守的实战记忆——这在对阵加拿大和波黑时是独特的竞争优势。他的双脚射门精度是瑞士在禁区前沿的第二层攻击线。'
};

entries['Aurèle Amenda'] = {
    number:'24', fullName:'Aurèle Amenda', position:'Defender', currentClub:'Eintracht Frankfurt', image:'',
    clubCareer:[{years:'2021–2023',club:'Young Boys'},{years:'2023–',club:'Eintracht Frankfurt'}],
    nationalCaps:7, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'年轻人青训体系的又一高端输出——阿曼达在伯尔尼接受后卫基础教育后于2023年转会德甲法兰克福，在德国足球最严苛的防守要求中继续自己的中卫成长。他具有典型的年轻人青训风格的标志：技术性中卫、乐于从后场出球、但在需要时也能做出果断的球权清理。7次国家队出场记录说明他目前是瑞士中卫阵容中的新生代候选人。22岁的年龄让他在未来十年都有时间打磨中卫技能的完整轮廓。',
    wcSpotlight:'阿曼达的世界杯更多是一次"实习期"体验——面对加拿大和波黑的前锋教育，将在法兰克福的训练和比赛中持续发酵为未来的首发能力。他在本届世界杯最可能的价值是训练场上的对抗和学习——如果出现大面积伤病或停赛，他将是后防线上的紧急后备选择。22岁的世界杯经历是最好的职业投资——瑞士足球的眼光永远放在两届世界杯之后。'
};

entries['Luca Jaquez'] = {
    number:'25', fullName:'Luca Jaquez', position:'Defender', currentClub:'VfB Stuttgart', image:'',
    clubCareer:[{years:'2020–2023',club:'FC Luzern'},{years:'2023–',club:'VfB Stuttgart'}],
    nationalCaps:3, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'卢塞恩制造的另一名瑞士中卫——贾凯兹在瑞士超的早期职业生涯让他在转会斯图加特时已经具备了在德甲中卫环境中生存的基础条件。他的中卫风格偏重身体对抗和空中球的争夺，出球和战术理解还在斯图加特的体系中被进一步塑形。3次国家队出场记录意味着他对于世界杯主力阵容而言更像是一名"长线投资"，但他的入选证明教练组在林林总总的中卫储备中选择了他的身体属性作为特定比赛场景的备用方案。',
    wcSpotlight:'贾凯兹将作为后防第五或第六选择随瑞士队出征世界杯——他几乎不可能在正常态势中获得出场机会，但像对阵波黑这样身体素质强硬、定位球进攻强大的球队时，他的身高和对抗优势可能在特定的"末段防空"需求中被激活。斯图加特的德甲对抗经验至少保证了他不会在面对加拿大或波黑的中锋时在身体上被直接碾压。'
};

entries['Cedric Itten'] = {
    number:'26', fullName:'Cedric Itten', position:'Forward', currentClub:'Fortuna Düsseldorf', image:'',
    clubCareer:[{years:'2018–2020',club:'St. Gallen'},{years:'2020–2022',club:'Rangers'},{years:'2022–2024',club:'Young Boys'},{years:'2024–2025',club:'→ Greuther Fürth'},{years:'2025–',club:'Fortuna Düsseldorf'}],
    nationalCaps:15, nationalGoals:5, extractPreview:'', introPreview:'',
    careerReview:'圣加仑的血统产品——曾在瑞士超打进33球的射手，伊滕在格拉斯哥流浪者和伯尔尼年轻人的苏格兰与瑞士双线经历中积累了两种截然不同的比赛记忆。在流浪者他赢得了苏超冠军并在欧洲赛事中作为轮换前锋获得了丰富的欧战经验——在伊布罗克斯面对欧洲豪门防线被球迷怒骂的感觉是任何前锋最好的"心理秤重"训练。回归年轻人后他回到瑞士超的熟悉环境并保持了进球的效率。现在在杜塞尔多夫他继续着德乙的锋线生涯。15次国家队出场5个进球的效率相当体面——每三场比赛一球的节奏对于一个不被视为首选的轮换前锋来说已经是极高的职业素养。',
    wcSpotlight:'伊滕——名字就是"近在咫尺"的意思——在世界杯上将以瑞士替补席上的"终结选项"身份出现。他在流浪者的经历教会了他一件事：在苏格兰足球的那种持续高空轰炸的战术中，一个前锋如果不能在三次触球内完成射门就会被换下。这种高强度的要求在大赛的替补时间中是最宝贵的经验——没有时间适应，上场的每一分钟都在赌博。当瑞士在比赛末段需要一次精准的头球摆渡或禁区内抓第二落点的补射时，伊滕就是教练组脑中跳出的人。'
};

Object.assign(p, entries);
require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Switzerland batch 2 (14 players) written. Total keys:', Object.keys(p).length);
