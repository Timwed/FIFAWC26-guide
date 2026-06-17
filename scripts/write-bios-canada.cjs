var p = require(__dirname + '/../src/data/players-wiki.json');
var entries = {};

// === CANADA ===

entries['Dayne St. Clair'] = {
    number:'1', fullName:'Dayne St. Clair', position:'Goalkeeper', currentClub:'Inter Miami CF', image:'',
    clubCareer:[{years:'2019–2024',club:'Minnesota United'},{years:'2025–',club:'Inter Miami CF'}],
    nationalCaps:20, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'出生于加拿大并在美职联的生态系统中成长，明尼苏达联是他职业生涯的起点——在这里他从一名有潜力的青年门将成长为MLS中最可靠的门将之一。他的门线反应速度是美职联门将中最被低估的特质，尤其是在点球和一对一的处理上有超乎常人的冷静。2025年转会迈阿密国际后，他获得了在更高曝光度和更激烈竞争中证明自己的机会，与梅西的日常训练本身就是一种无形的升级。20次国家队出场，加美大战中的多次关键扑救让他逐渐取代老将成为国家队门将的第一选项。',
    wcSpotlight:'圣克莱尔即将迎来他的第一届世界杯——对于一名加拿大门将来说，这本身就是一种荣誉。在迈阿密国际的一年让他适应了聚光灯下的压力，面对欧洲南美顶级前锋的日常训练让他在心理上已不惧怕任何级别的进攻火力。加拿大被分在包含瑞士和卡塔尔的小组，这意味着圣克莱尔面对的将不再是北美预选赛级别的射门——他将直面瑞士的恩博洛和卡塔尔的阿菲夫。他的大赛表现将直接决定加拿大能否从小组突围。'
};

entries['Alistair Johnston'] = {
    number:'2', fullName:'Alistair Johnston', position:'Defender', currentClub:'Celtic', image:'',
    clubCareer:[{years:'2020–2021',club:'Nashville SC'},{years:'2021–2023',club:'CF Montréal'},{years:'2023–',club:'Celtic'}],
    nationalCaps:58, nationalGoals:1, extractPreview:'', introPreview:'',
    careerReview:'加拿大右后卫位置上的绝对霸主——约翰斯顿从纳什维尔到蒙特利尔的MLS历练之后在2023年才跨越大西洋来到苏格兰，但仅用不到半年就在凯尔特人站稳了首发位置。在格拉斯哥德比中的强硬表现证明了他的战斗精神远超外界预期：苏格兰足球是暴力美学的高地，而约翰斯顿在那里如鱼得水。他在进攻端的前插和传中能力在凯尔特人的体系中得到了进一步的释放。58次国家队出场1个进球的数据不足以反映他的战术价值——他在2022世界杯上的表现已经证明，加拿大右路只要把他放上去就是满油的状态。',
    wcSpotlight:'约翰斯顿是加拿大队在2022世界杯上的少数几位打出"欧战级别"表现的外场球员之一——在卡塔尔的三个对手面前，他是为数不多没有被压制的加拿大人。两年的凯尔特人生涯让他的身体和战术理解力又提升了一个档次，尤其是在欧冠级别的对抗中积累了大量的回追和一对一防守经验。他将面对瑞士的传控体系和波黑的边路快马——老道的苏格兰联赛经验在这里将直接兑现为竞争优势。'
};

entries['Alfie Jones'] = {
    number:'3', fullName:'Alfie Jones', position:'Defender', currentClub:'Middlesbrough', image:'',
    clubCareer:[{years:'2018–2020',club:'Southampton'},{years:'2020–2025',club:'Hull City'},{years:'2025–',club:'Middlesbrough'}],
    nationalCaps:2, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'出生于英格兰但选择为加拿大出战的中卫——在南安普顿青训体系中接受了英超级别的后卫教育，虽然在圣徒一线队出场不多，但随后在赫尔城的四年中证明了自己是一名可靠的英冠级别中卫。他的比赛风格偏重防守直觉和位置感而非身体对抗——这在英冠的环境中是不寻常的。2025年转会米德尔斯堡后继续在英冠联赛中沉淀自己的中卫技能。国家队仅有2次出场记录，但新教练组显然在他的英冠表现中看到了某种适合加拿大战术体系的特质。',
    wcSpotlight:'琼斯在世界杯上的出场机会取决于加拿大后防线的伤病情况——作为深度储备，他在英冠联赛的日常比赛强度足以让他随时承接突然降临的出场任务。对手通常会低估一名来自英冠的中卫，但琼斯的比赛中蕴含着某种英国中卫特有的"预判智慧"——不靠身体莽撞，靠的是预判对手的动作。如果加拿大在对阵卡塔尔或波黑的比赛中需要增加一名冷静的头球防守者，他将是选项之一。'
};

entries['Luc de Fougerolles'] = {
    number:'4', fullName:'Luc de Fougerolles', position:'Defender', currentClub:'Dender', image:'',
    clubCareer:[{years:'2022–2024',club:'Fulham'},{years:'2024–',club:'Dender'}],
    nationalCaps:13, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'富勒姆青训出品——德富热罗勒在克拉文农庄成长为一名极具现代感的年轻中卫，虽然尚未在富勒姆一线队获得稳固出场时间，但他在U23梯队的表现足以让加拿大国家队教练组提前将他锁定在世界杯阵容中。2024年转会比利时登德尔让他获得了更多的一线队经验——比利时联赛的技术性环境正在帮助他完善传球和出球的细节。13次国家队出场对于一名年仅20岁的后卫来说已经是超前进度，他的海拔和左脚属性给加拿大后防线带来了难得的战术多样性。',
    wcSpotlight:'德富热罗勒是加拿大后防线的"2030投资"，但2026他就已经准备好要交出作业了——在比利时的赛季让他获得了稳定的首发时间（这对20岁的后卫至关重要），而在富勒姆的青训背景给了他一个对英超前锋的身体记忆。他的平静球风有种不符合年龄的成熟感——这在世界杯这种可能随时失控的比赛场景中是让人安心的品质。如果小组赛中有面对高压逼迫的比赛，他的左脚出球会是加拿大后场从防守过渡到反击的安全通道。'
};

entries['Joel Waterman'] = {
    number:'5', fullName:'Joel Waterman', position:'Defender', currentClub:'Chicago Fire FC', image:'',
    clubCareer:[{years:'2019',club:'Calgary Foothills'},{years:'2020–2024',club:'CF Montréal'},{years:'2025–',club:'Chicago Fire FC'}],
    nationalCaps:17, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'从加拿大本土的半职业联赛到MLS的飞跃——沃特曼的故事是足球世界的典型励志剧本。在蒙特利尔的五年间他从一名"令人意外"的签约成长为球队后防线的可靠成员，加拿大足球在欧洲和北美之间的混合风格在他身上得到了生动体现：既有北美中卫的身体对抗意愿，又有欧洲体系要求的位置感。2025年转会芝加哥火焰后在新的环境中继续着自己的中卫生涯。17次国家队出场对一名30岁才踏上世界杯舞台的后卫来说，是一种"此生仅有一次"的成全。',
    wcSpotlight:'沃特曼的故事会让所有30岁还在坚持的半职业球员看到希望——但他的故事在世界杯上还将有新的篇章。作为加拿大后防线上的轮换中卫，他的价值在于：不犯大错误。这个描述在足球世界中可能听起来不够刺激，但在世界杯上"不犯大错误"恰恰是最稀缺的品质。他的MLS经验让他对本组的中北美洲对手（如果有的话）有着天然的理解优势，而在面对欧洲球队时，他的身体对抗能力也不会被轻易碾压。这是属于他的"最后的礼物"。'
};

entries['Mathieu Choinière'] = {
    number:'6', fullName:'Mathieu Choinière', position:'Midfielder', currentClub:'Los Angeles FC', image:'',
    clubCareer:[{years:'2018–2025',club:'CF Montréal'},{years:'2025–',club:'Los Angeles FC'}],
    nationalCaps:23, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'蒙特利尔足球的青训之子——在CF蒙特利尔度过七个赛季后转会至洛杉矶FC的舒瓦尼埃是一名典型的"组织能手"。他的场上角色偏向衔接者而非终结者：大量的跑动覆盖、简洁的两脚出球、以及在中场三人组中给更有创造力的队友提供掩护。23次国家队出场且数据空白从表面上看似乎缺乏高光，但这也是他"绿叶属性"的直观反映：他的工作是让身边的人变得更好，而不是让自己成为主角。',
    wcSpotlight:'舒瓦尼埃将和尤斯塔基奥一起构成加拿大中场的脊梁——他负责在加拿大的防反体系中完成最重要的一环：快速传球过渡。在洛杉矶FC的一年让他逐渐适应了进攻体系中频繁拉扯的中场角色，这种适应能力在世界杯中将转化为"识别场上局势并做出最安全传球"的本能。当大卫和拉林在锋线上做准备时，舒瓦尼埃大概率是那个把球踏踏实实送到前场的人——这项看似平凡的工作在世界杯的强度下考验的恰恰是抗压能力。'
};

entries['Stephen Eustáquio'] = {
    number:'7', fullName:'Stephen Eustáquio', position:'Midfielder', currentClub:'Los Angeles FC', image:'',
    clubCareer:[{years:'2017–2019',club:'Chaves'},{years:'2019–2022',club:'Paços de Ferreira'},{years:'2022–2024',club:'Porto'},{years:'2024–',club:'Los Angeles FC'}],
    nationalCaps:56, nationalGoals:4, extractPreview:'', introPreview:'',
    careerReview:'加拿大足球的中场大脑——出生于葡萄牙、在葡萄牙联赛体系中成长，尤斯塔基奥在沙维斯和帕索斯费雷拉的中场环境中练就了典型的伊比利亚技术风格：良好的球感、精准的传球视野和在中场创造时间与空间的能力。转会波尔图是他职业生涯的标志性升格，穿上蓝白间条衫为葡萄牙豪门出战意味着他已经踏入欧洲二线俱乐部的顶流梯队。2024年加盟洛杉矶FC后迅速成为MLS最具观赏性的中场之一。56次国家队出场4个进球的数据背后是他对加拿大中场体系的全面掌控——每场触球次数和传球完成率都是队内最高。',
    wcSpotlight:'作为加拿大队中最被欧洲足坛认可的中场球员，尤斯塔基奥在2026世界杯上的表现将直接决定加拿大的小组赛命运。他在波尔图时期积累的欧冠经验是一个巨大的无形资产——他已经习惯了在火龙球场被五万人的呐喊声包围而仍然能把球控制住。加拿大的战术体系中他是唯一的"绝对不可替代"选项：没有其他人能够同时完成防守拦截、拿球摆脱和纵向传球这三个任务。小组赛的对阵中有两场由他主导的节奏控制将是加拿大晋级之路的命脉。'
};

entries['Ismaël Koné'] = {
    number:'8', fullName:'Ismaël Koné', position:'Midfielder', currentClub:'Sassuolo', image:'',
    clubCareer:[{years:'2021–2022',club:'CF Montréal'},{years:'2022–2025',club:'Watford'},{years:'2025–',club:'Sassuolo'}],
    nationalCaps:40, nationalGoals:4, extractPreview:'', introPreview:'',
    careerReview:'科内的故事是一部高速电梯——2021年还在蒙特利尔踢球，2022年已经出现在世界杯赛场上，速度之快在加拿大足球史上罕见。他在2022世界杯上的表现是他迄今为止的最高光时刻：在对阵比利时的比赛中踢出了远超年龄的成熟度，中场的持球推进和对抗性毫不畏惧面对德布劳内级别的球员。在沃特福德的英冠生涯中他被给予了中场核心的号码和战术自由度，但球队的不稳定限制了他的发展上限。转会意甲萨索洛是一次精准的职业规划——在更技术性的联赛环境中完善自己的控球和节奏控制技能。40次国家队出场让他在23岁的年龄已经是加拿大更衣室的"老将"。',
    wcSpotlight:'科内是本届世界杯上最被期待成为"大场面球员"的加拿大人——他在2022年卡塔尔已经证明了这一点：在最大舞台上，天赋是不会说谎的。意甲萨索洛的环境给他提供了一个全新的战术调色板，他的身体素质和向前带球的欲望在世界杯的淘汰赛场景中将化为锋线上的直接威胁。加拿大的进攻体系中科内的纵向推进是破坏对手防线结构的关键武器——当一个后腰可以带球突破对方的第一道防线时，整个进攻战术就活起来了。23岁的年龄意味着这远不是他的终点站。'
};

entries['Cyle Larin'] = {
    number:'9', fullName:'Cyle Larin', position:'Forward', currentClub:'Southampton', image:'',
    clubCareer:[{years:'2015–2017',club:'Orlando City SC'},{years:'2018–2022',club:'Beşiktaş'},{years:'2022',club:'Club Brugge'},{years:'2022–2023',club:'Real Valladolid'},{years:'2023–2024',club:'Mallorca'},{years:'2025–',club:'Southampton'}],
    nationalCaps:90, nationalGoals:30, extractPreview:'', introPreview:'',
    careerReview:'加拿大国家队历史射手王的头衔属于赛尔·拉林——从奥兰多城到贝西克塔斯，从布鲁日到巴拉多利德再到马洛卡，最终落脚南安普顿，这位前锋的职业旅程几乎铺满了半张欧洲地图。他在土超贝西克塔斯的四年是最精彩的篇章：在伊斯坦布尔的喧嚣中拉林学会了如何在极端情绪化的比赛中保持射门本能，多次在关键场次打入制胜球。90次国家队出场30球的数据已经让他和加拿大足球历史紧密绑定，但他的问题始终是稳定性——在对阵强队时容易"隐身"，在弱队身上又能爆发进球潮。在多国联赛的历练给了他适应不同战术体系的武器库，但至今缺少一个能让所有武器同时上膛的赛季。',
    wcSpotlight:'拉林将以加拿大历史射手王的身份第二次站在世界杯的舞台上——2022年在卡塔尔他打入了加拿大在世界杯上的历史性首球（对阵克罗地亚），这个进球将永远铭刻在加拿大足球史上。四年后他在南安普顿的英超环境中继续保持着进球节奏，32岁的年龄对于一名依赖位置感和射门直觉的前锋来说并不算老。加拿大在小组赛中面对的对手让拉林成为最值得关注的秘密武器——他在西甲的经验和英超的对抗都将在对阵不同风格防线时转化为直接价值。'
};

entries['Jonathan David'] = {
    number:'10', fullName:'Jonathan David', position:'Forward', currentClub:'Juventus', image:'',
    clubCareer:[{years:'2018–2020',club:'KAA Gent'},{years:'2020–2024',club:'Lille'},{years:'2024–',club:'Juventus'}],
    nationalCaps:77, nationalGoals:39, extractPreview:'', introPreview:'',
    careerReview:'加拿大足球史上最贵的球员和最被欧洲认可的射手——从比利时根特起步，在里尔四年间成长为法甲金靴级别的杀器，大卫的足球智商和射门精度在同代前锋中属于顶级梯队。在里尔夺得法甲冠军的赛季中他是绝对的核心火力点，而他身上最被低估的特质是"不需要球权也能进球"的能力——他是那种在80分钟里只碰了3次球但其中两次转化为进球的人。2024年转会意甲豪门尤文图斯标志着他正式踏入欧洲一线锋霸的行列，在都灵的舞台上对阵意甲顶级中卫的日常消耗正在进一步打磨他的比赛韧性。77次国家队出场39球的效率让他距离拉林的历史纪录仅有一步之遥——而他才26岁。',
    wcSpotlight:'大卫是加拿大在本届世界杯上最大的王牌——没有之一。在尤文图斯的赛季让他习惯了在最苛刻的战术体系中担任箭头，意甲顶级后卫的贴身防守已经帮他建立了一种"在压力下保持射门品质"的肌肉记忆。加拿大的全部战术设计都将围绕一个核心问题：如何让大卫在禁区最危险的区域接到球？他在里尔和尤文都展示了一个顶级射手最基本的素质——不需要太多触球就能决定比赛。小组赛中对阵瑞士的防守体系将是他和尤文队友之间的另一种奇妙交锋：如果他能在那个夜晚爆发，加拿大将有资格去畅想淘汰赛。'
};

entries['Liam Millar'] = {
    number:'11', fullName:'Liam Millar', position:'Midfielder', currentClub:'Hull City', image:'',
    clubCareer:[{years:'2019–2021',club:'Kilmarnock'},{years:'2021–2023',club:'Basel'},{years:'2023–2024',club:'Preston North End'},{years:'2024–',club:'Hull City'}],
    nationalCaps:41, nationalGoals:1, extractPreview:'', introPreview:'',
    careerReview:'拥有加拿大和英格兰双重背景的边锋——米拉尔在利物浦青训营中完成了足球教育的启蒙阶段，尽管未能在红军一线队立足，但在苏超基尔马诺克和瑞士巴塞尔的历练中逐渐找到了自己的比赛节奏。在巴塞尔的两年是他职业生涯的转折点：瑞士超的技术性环境让他的盘带和传中得到了系统性的升级。然而在普雷斯顿和赫尔城的英冠生涯中，他的状态出现了明显的起伏——英冠的粗暴和高强度节奏对于技术型边锋来说从来不是理想环境。41次国家队出场但仅有1球入账的数据说明他的终结能力始终是他的短板。',
    wcSpotlight:'米拉尔在世界杯上最突出的价值可能是——当加拿大的首发边锋在65分钟后耗尽体能时，一个腿脚新鲜、盘带技术仍在、且对瑞士足球文化有所了解的替补边锋可以改变比赛。他在巴塞尔的瑞士足球经历是一种额外的战术情报：他知道瑞士球员在防守端的思维习惯和弱点。但他的状态波动是需要严肃对待的风险——如果他在世界杯前没有在赫尔城找到一个稳定的节奏，他可能会在加拿大的轮换中被其他人反超。'
};

entries['Tani Oluwaseyi'] = {
    number:'12', fullName:'Tani Oluwaseyi', position:'Forward', currentClub:'Villarreal', image:'',
    clubCareer:[{years:'2022–2025',club:'Minnesota United'},{years:'2025–',club:'Villarreal'}],
    nationalCaps:24, nationalGoals:2, extractPreview:'', introPreview:'',
    careerReview:'出生于尼日利亚、在加拿大成长、在美职联爆炸式崛起——奥卢瓦塞伊的职业生涯剧本充满了跨文化叙事。在明尼苏达联的三年间他从一名无名之辈成长为MLS最具爆发力的前锋之一，擅长用自己的速度和身体对抗创造射门机会。2025年转会西甲比利亚雷亚尔是所有人都没预料到的跳级——从MLS直接跃入西甲是一个巨大的挑战，但黄色潜水艇的球探显然在他身上看到了"MLS最好的前锋之一"的潜力。24次国家队出场2个进球的数据尚在积累中，但他的上升曲线已经让所有人都注意到了。',
    wcSpotlight:'奥卢瓦塞伊在世界杯上的使用方式可能会非常有趣——他不是一名传统的支点式中锋，而是更喜欢在对手防线之间的缝隙中穿梭，这种类型的前锋在面对疲劳的防线时往往能制造混乱。在比利亚雷亚尔的西甲环境中，他将面对与世界杯相似的足球文化（尤其是对阵西班牙或拉美风格的球队），这种日常对抗将转化为直接的大赛适应力。作为拉林和大卫之后的锋线第三选择，他将是加拿大在下半场发动冲击波时最出其不意的武器。'
};

entries['Derek Cornelius'] = {
    number:'13', fullName:'Derek Cornelius', position:'Defender', currentClub:'Rangers', image:'',
    clubCareer:[{years:'2019–2021',club:'Vancouver Whitecaps'},{years:'2021',club:'→ Panetolikos'},{years:'2022–2025',club:'Malmö FF'},{years:'2025–',club:'Rangers'}],
    nationalCaps:44, nationalGoals:1, extractPreview:'', introPreview:'',
    careerReview:'温哥华白帽青训出品——从MLS到希腊联赛再到瑞典马尔默，科尼利厄斯的职业生涯可以用"马赛克"来形容：每一块碎片都不同，但拼在一起后却构成了一个完整的优秀中卫。在马尔默FF的三年间他赢得了瑞典超冠军并积累了大量的欧战经验（欧冠和欧联预选赛的稳定出场），在这个级别的欧洲赛事中立足对于一名加拿大后卫来说是极其难得的成就。2025年转会格拉斯哥流浪者让他和队友约翰斯顿在苏格兰汇聚——苏格兰足球的暴力环境正在进一步锤炼他的防守硬度。44次国家队出场1个进球的数据表明他已经成为加拿大中卫位置上的固定成员。',
    wcSpotlight:'科尼利厄斯的独特价值在于"经验密度"——他踢过的不同联赛文化（北美、希腊、北欧、苏格兰）让他面对任何类型的对手都不会感到陌生。在流浪者的格拉斯哥德比和欧战经验为他的世界杯做好了精神和身体的双重准备，苏格兰足球那种永不放弃的后卫精神已经内化为他的本能。如果加拿大的目标是在小组赛中保持至少一场零封，科尼利厄斯将是那个在更衣室中确保所有人都记住"防守第一"的领唱者。他和约翰斯顿的俱乐部层面的默契也是加拿大后防线的一个隐藏加成。'
};

entries['Jacob Shaffelburg'] = {
    number:'14', fullName:'Jacob Shaffelburg', position:'Midfielder', currentClub:'Los Angeles FC', image:'',
    clubCareer:[{years:'2019–2022',club:'Toronto FC'},{years:'2022–2024',club:'Nashville SC'},{years:'2025–',club:'Los Angeles FC'}],
    nationalCaps:31, nationalGoals:6, extractPreview:'', introPreview:'',
    careerReview:'加拿大本土培养的边路攻击手——沙费尔伯格在多伦多FC和纳什维尔的MLS经历中逐渐找到了自己最擅长的角色：在左边路利用速度撕开防线，内切后的射门精度在同位置球员中相当出色。转会洛杉矶FC后他加入了MLS最具竞争力的俱乐部之一，在更高曝光度的环境中继续提升着自己的进攻产出。31次国家队出场6个进球的效率对于一名边锋来说已经是过关的水平——在加拿大边路攻击手中，他的射门效率是最突出的。',
    wcSpotlight:'沙费尔伯格的左脚内切射门是加拿大在边路的最直接的进球威胁——他在纳斯维尔的赛季中曾多次在左路内切后用一记精准的远角推射让对手门将绝望。在洛杉矶FC的环境中他的防守端责任感也在随之提升——这对世界杯至关重要，因为加拿大在面对强队时绝不能让边锋变成只进攻不防守的特权球员。他的速度将是对手边后卫在整个比赛中最头疼的问题：他不需要太多球权就能在边路制造恐慌，这种低成本高回报的特质在淘汰赛场景中会格外珍贵。'
};

entries['Moïse Bombito'] = {
    number:'15', fullName:'Moïse Bombito', position:'Defender', currentClub:'Nice', image:'',
    clubCareer:[{years:'2023–2024',club:'Colorado Rapids'},{years:'2024–2025',club:'RB Salzburg'},{years:'2025–',club:'Nice'}],
    nationalCaps:20, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'加拿大最快崛起的新星中卫——2023年从大学联赛直接进入MLS科罗拉多急流的一线阵容，速度之快让人瞠目。在急流队第一时间就展示了他的核心特质：惊人的身体速度——放在中后卫位置上属于不正常的快，在面对速度型前锋时拥有天然的回追优势。随后转会萨尔茨堡红牛让他在欧洲最高水平的青训体系中接受了系统性升级，高强度压迫和出球的训练让他从"快"进化到了"又快又聪明"。2025年转投法甲尼斯标志着他在五大联赛站稳了脚跟。20次国家队出场且数据整洁，波姆比托的上升轨迹在加拿大足球史上没有先例可循。',
    wcSpotlight:'波姆比托是本届世界杯上加拿大最大的"隐藏王牌"——他拥有顶级中卫的配置：速度、身高、出球意愿，还拥有红牛体系赋予的高位压迫本能。在尼斯的法甲和国际赛事环境中，他正在学习如何与欧洲顶级前锋对抗——这种学习将直接在世界杯赛场上被检验。最重要的一点是他在追回球权后的冷静处理能力：他不会像很多年轻中卫那样断到球后立刻大脚解围，而是有意识地寻找传球对象。这种有建设性的防守思维将直接提升加拿大的反击质量。'
};

entries['Maxime Crépeau'] = {
    number:'16', fullName:'Maxime Crépeau', position:'Goalkeeper', currentClub:'Orlando City SC', image:'',
    clubCareer:[{years:'2017–2021',club:'Vancouver Whitecaps'},{years:'2022–2024',club:'Los Angeles FC'},{years:'2024–2025',club:'Portland Timbers'},{years:'2025–',club:'Orlando City SC'}],
    nationalCaps:32, nationalGoals:0, extractPreview:'', introPreview:'',
    careerReview:'加拿大国家队的长期门将人选——克雷波在MLS的门将序列中始终处于稳定的"顶级行列"。在温哥华白帽和洛杉矶FC的多年经历为他积累了大量的MLS比赛时间和关键扑救经验，尤其是他在洛杉矶FC夺得MLS杯的关键赛季中在联盟巅峰级别的比赛中证明了自己。转会奥兰多城后继续担任主力门将。32次国家队出场意味着他已经在加拿大国家队门将位置上深耕多年，对球队的战术默契和更衣室文化的理解超越了任何数据统计。',
    wcSpotlight:'克雷波和圣克莱尔之间的门将竞争将是加拿大在世界杯前的最大看点之一。在体能上两人处于同一层级，在MLS中的表现也难分伯仲——真正决定谁站在球门前的可能是热身赛中的状态和与后防线的沟通质量。克雷波的优势在于经验层——32次国家队的比赛记忆和MLS杯决赛的经历让他对"大场面"有更多的肌肉记忆。如果他在热身赛中表现稳定，第二门将的角色对他而言将是再次在大赛舞台上证明自己的最好机会。'
};

Object.assign(p, entries);
require('fs').writeFileSync(__dirname + '/../src/data/players-wiki.json', JSON.stringify(p,null,2),'utf8');
console.log('Canada batch 1 (16 players) written. Total keys:', Object.keys(p).length);
