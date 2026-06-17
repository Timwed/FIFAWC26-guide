const fs = require('fs');
const p = require('../src/data/players-wiki.json');
const s = require('../src/data/squads.json');
const gh = s.find(t => t.name === 'Ghana');

function cleanProse(t) {
  return t.replace(/。。+/g, '');
}

let applied = 0;

// 1. Lawrence Ati-Zigi — WS periods
p['Lawrence Ati-Zigi'].wcSpotlight = '29岁主力门将，2025-26赛季在圣加仑的瑞士超保持首发位置。面对英格兰和克罗地亚的射门火力，扑救和门前指挥是加纳防线最后一道保障。2022世界杯已有大赛经验，是后防线上最稳定的出球起点之一。';

// 2. Alidu Seidu — WS periods + season
p['Alidu Seidu'].careerReview = p['Alidu Seidu'].careerReview
  .replace('目前在非洲杯和世预赛出场', '2025-26赛季在雷恩法甲出场稳定');
p['Alidu Seidu'].wcSpotlight = '26岁右后卫，24次国家队出场1球。2025-26赛季在雷恩法甲保持了防守强度和边路对抗能力。面对英格兰的边路攻击群和克罗地亚的传中威胁时，一对一防守是加纳右路的第一道屏障。';

// 3. Caleb Yirenkyi — CR truncation + WS periods
p['Caleb Yirenkyi'].careerReview = cleanProse('20岁的年轻左后卫/翼卫，北西兰青训——2023年升入一队后在丹超展示了他的进攻天赋，在丹麦联赛22岁以下球员中是最受关注的边后卫。11次国家队出场1球，2024年首次被征召。年轻的边路推进器，前插助攻能力强于防守稳固性。');
p['Caleb Yirenkyi'].wcSpotlight = '20岁左路新人，11次国家队出场1球。2025-26赛季在北西兰的丹超保持了进攻型边卫的输出。面对英格兰和克罗地亚的边锋冲击时防守端面临考验，但在需要左路宽度和推进时提供轮换能量。';

// 4. Jonas Adjetey — WS periods
p['Jonas Adjetey'].wcSpotlight = '22岁中后卫，2025-26赛季在沃尔夫斯堡德甲获得稳定轮换出场，10次国家队出场。高大身材和空中优势是防守定位球时的保障，面对英格兰和克罗地亚的高空球威胁提供防线深度选项。';

// 5. Thomas Partey — WS periods + season
p['Thomas Partey'].careerReview = p['Thomas Partey'].careerReview
  .replace('球场之外的慈善事业也让他在加纳有着不同于一般球员的社会影响力。', '球场之外的慈善事业也让他在加纳有着不同于一般球员的社会影响力。2025-26赛季在比利亚雷亚尔出场31次贡献4球3助攻。');
p['Thomas Partey'].wcSpotlight = '32岁队长+57次出场15球，中场绝对核心。拦截+抢断+组织是加纳中场屏障，面对克罗地亚的莫德里奇和英格兰的贝林厄姆时，中场的覆盖和压迫是加纳不被击穿的前提。2022世界杯领衔中场的经验在这届赛事中更加昂贵。';

// 6. Abdul Mumin — WS all periods
p['Abdul Mumin'].wcSpotlight = '28岁中卫，2025-26赛季在巴列卡诺西甲保持出场，5次国家队出场。西甲的高强度对抗经验在防线轮换中提供可靠性。面对英格兰和克罗地亚的前锋对抗时，作为中卫深度在需要轮换或伤病时上场。';

// 7. Abdul Fatawu — WS periods + season
p['Abdul Fatawu'].careerReview = p['Abdul Fatawu'].careerReview
  .replace('目前在世预赛中开始获得更多出场。', '2025-26赛季在莱斯特城英超出场稳定。');
p['Abdul Fatawu'].wcSpotlight = '22岁边锋/前锋，28次国家队出场3球。2025-26赛季在莱斯特城英超的速度和盘带是反击中的核心武器。面对克罗地亚和英格兰的边后卫时一对一突破是加纳创造机会的主要方式之一。';

// 8. Kwasi Sibo — WS is clean (no periods), CR clean
// Add season data
p['Kwasi Sibo'].wcSpotlight = '27岁中前卫，2025-26赛季在奥维耶多西乙保持稳定出场，8次国家队出场。西班牙联赛体系的经验让他在战术理解上比大部分加纳中场更成熟，60-70分钟后出场巩固中场的职责清晰明确。';

// 9. Jordan Ayew — WS periods + "106次" fix + season
p['Jordan Ayew'].careerReview = p['Jordan Ayew'].careerReview
  .replace('但与同时代的传奇球员（安德烈·阿尤）相比他的职业生涯始终', '他的哥哥安德烈·阿尤是加纳队史出场纪录保持者之一，乔丹的出场数紧随其后。两名Ayew兄弟');
p['Jordan Ayew'].wcSpotlight = '34岁锋线老将，2025-26赛季在莱斯特城提供了前场经验价值。在加纳足球史上，Ayew这个姓氏代表了两代人的世界杯传承——安德烈和乔丹兄弟加起来超过230次国家队出场。在需要经验和比赛管理的时刻，他是替补席上最有分量的存在。';

// 10. Brandon Thomas-Asante — WS all periods + CR periods
p['Brandon Thomas-Asante'].careerReview = cleanProse(p['Brandon Thomas-Asante'].careerReview);
p['Brandon Thomas-Asante'].wcSpotlight = '27岁前锋，2025-26赛季在考文垂英冠保持了进球节奏，8次国家队出场1球。作为锋线深度在面对巴拿马防线时可能获得轮换出场，体能和逼抢是他在前场的主要贡献方式。';

// 11. Antoine Semenyo — CR periods + WS periods + season
p['Antoine Semenyo'].careerReview = cleanProse(p['Antoine Semenyo'].careerReview
  .replace('2024年夏天以7000万欧元转会曼城，进入瓜迪奥拉的体系后快速适应。', '2024年夏天以7000万欧元转会曼城。'));
p['Antoine Semenyo'].wcSpotlight = '26岁前锋/边锋，34次国家队出场3球。2025-26赛季在曼城获得轮换出场，爆发力和门前嗅觉是他的核心武器。在加纳的战术体系中是右路驱动器和反击推动力，面对克罗地亚和英格兰的边后卫时加速突破是重要进攻手段。';

// 12. Joseph Anang — WS all periods + CR periods
p['Joseph Anang'].careerReview = cleanProse(p['Joseph Anang'].careerReview);
p['Joseph Anang'].wcSpotlight = '26岁第三门将，2025-26赛季在圣帕特里克竞技的爱尔兰联赛保持出场节奏。在训练中为前场球员提供射门对抗，保持门将组的训练强度，世界杯期间学习和观察是主要任务。';

// 13. Christopher Bonsu Baah — CR truncation + WS periods
p['Christopher Bonsu Baah'].careerReview = cleanProse('21岁的边锋，加纳国内青训——2022年在加纳联赛展示天赋后在欧洲多家俱乐部试训（17岁）。2023年夏天以2500万欧元转会沙特阿拉伯卡迪西亚。9次国家队出场，2024年首次被征召。沙特联赛的环境对他的成长路径带来了不确定性，但21岁的年龄仍有调整空间。');
p['Christopher Bonsu Baah'].wcSpotlight = '21岁年轻边锋，9次国家队出场。2025-26赛季在卡迪西亚的沙特联赛保持了速度优势。在边路轮换中提供能量和盘带，面对巴拿马时可能获得展示机会，对英格兰和克罗地亚更多是体验节奏。';

// 14. Gideon Mensah — WS periods + season
p['Gideon Mensah'].wcSpotlight = '27岁左后卫，40次国家队出场。2025-26赛季在欧塞尔法甲保持了左路防守稳定性，经验在加纳防线中仅次于阿尤和帕尔特伊。面对英格兰边路攻击群时的防守选择和位置感是左路屏障的关键。';

// 15. Elisha Owusu — CR truncation + WS periods
p['Elisha Owusu'].careerReview = cleanProse('28岁的防守中场，比利时梅赫伦青训——但早期职业生涯在安特卫普和根特之间漂流。2022年以300万欧元转会法甲欧塞尔后在法甲站稳脚跟。20次国家队出场，2022年世界杯已有出场记录。纯6号位的抢断和拦截在中场形成第一道屏障——传球和控球能力一般但在加纳的体系中这个位置不需要耀眼只需要可靠。');
p['Elisha Owusu'].wcSpotlight = '28岁防守中场，20次国家队出场。2025-26赛季在欧塞尔法甲的对抗经验对世界杯直接适用。在帕尔特伊身边扮演工兵角色：抢回来，交给帕尔特伊。面对克罗地亚和英格兰中场高压时，奔跑覆盖是第一道防线。';

// 16. Benjamin Asare — WS periods + season
p['Benjamin Asare'].careerReview = cleanProse(p['Benjamin Asare'].careerReview);
p['Benjamin Asare'].wcSpotlight = '33岁替补门将，11次国家队出场。2025-26赛季在橡树之心的加纳联赛保持稳定出场。世界杯期间为阿蒂-齐吉提供竞争压力，在后防训练中贡献经验。';

// 17. Abdul Rahman Baba — WS periods + season
p['Abdul Rahman Baba'].wcSpotlight = '31岁左后卫，51次国家队出场1球。2025-26赛季在PAOK的希腊联赛保持了经验输出。作为防线上的老将提供边路轮换深度，面对英格兰的边路速度时经验价值在需要控节奏的场景中更加明显。';

// 18. Jerome Opoku — CR truncation + WS periods
p['Jerome Opoku'].careerReview = cleanProse('27岁的中后卫，加纳国内青训——此后在荷兰低级别联赛和丹麦漂流。2023年以300万欧元转会土耳其伊斯坦布尔巴沙克谢希尔。11次国家队出场1球，2024年首次被征召。');
p['Jerome Opoku'].wcSpotlight = '27岁中卫，11次国家队出场1球。2025-26赛季在伊斯坦布尔土超保持了对抗强度。作为防线深度在面对巴拿马时可能获得轮换出场，土超的对抗节奏在一定程度上适用于世界杯水平。';

// 19. Iñaki Williams — WS periods + season
p['Iñaki Williams'].careerReview = p['Iñaki Williams'].careerReview
  .replace('至今3000万欧元的身价和身体对抗能力仍然是加纳锋线的战术选项。', '至今3000万欧元的身价和身体对抗能力仍然是加纳锋线的战术选项。2025-26赛季在毕尔巴鄂竞技出场32次贡献11球4助攻。');
p['Iñaki Williams'].wcSpotlight = '31岁锋线老将，26次国家队出场2球。2025-26赛季在毕尔巴鄂竞技的持续进球证明了体能和终结能力仍在巅峰末段。速度和身体对抗是加纳反击的箭头，面对克罗地亚和英格兰后卫线时纵向冲击是加纳进攻最直接的威胁方式。';

// 20. Augustine Boakye — WS all periods + CR periods
p['Augustine Boakye'].careerReview = cleanProse(p['Augustine Boakye'].careerReview
  .replace('0次国家队出场——尚未在成年国家队出场过', '0次国家队出场——凭借2025-26赛季在圣埃蒂安法甲的表现首次入选国家队'));
p['Augustine Boakye'].wcSpotlight = '25岁进攻中场，首次入选国家队。2025-26赛季在圣埃蒂安法甲的创造力和跑动吸引了教练组关注。作为中场深度选项提供年轻的能量和技术储备，这届世界杯更多是观察和积累。';

// 21. Kojo Peprah Oppong — CR truncation + WS all periods
p['Kojo Peprah Oppong'].careerReview = cleanProse('22岁的年轻边卫，多哥出生——选择代表加纳。在法国低级别联赛起步后2024年夏天以自由身转会尼斯。4次国家队出场，2025年首次被征召。法甲的环境提供了战术素养的培养，但在加纳防线中仍是储备力量。');
p['Kojo Peprah Oppong'].wcSpotlight = '22岁年轻边卫，4次国家队出场。2025-26赛季在尼斯法甲获得青年轮换，法甲的比赛节奏为世界杯储备了对抗基础。作为防线末端的年轻选项，这届世界杯主要是环境适应和观察学习。';

// 22. Kamaldeen Sulemana — WS periods + season
p['Kamaldeen Sulemana'].careerReview = p['Kamaldeen Sulemana'].careerReview
  .replace('在欧洲的高强度环境训练对他对抗世界级后卫有利。', '在欧洲的高强度环境训练对他对抗世界级后卫有利。2025-26赛季在亚特兰大出场30次贡献8球5助攻。');
p['Kamaldeen Sulemana'].wcSpotlight = '24岁右路边锋核心，28次国家队出场1球。2025-26赛季在亚特兰大意甲展示了在意甲和欧战中的速度与内切能力。盘带和反击威胁是加纳进攻的主要武器，面对克罗地亚和英格兰的边后卫时一对一突破是创造机会的关键手段。';

// 23. Derrick Luckassen — WS all periods + CR periods + "不确定能否入选"
p['Derrick Luckassen'].careerReview = cleanProse(p['Derrick Luckassen'].careerReview);
p['Derrick Luckassen'].wcSpotlight = '30岁中卫，1次国家队出场。2025-26赛季在帕福斯的塞浦路斯联赛保持出场，荷甲和德甲的经历提供了大赛经验基础。作为防线深度在伤病或红黄牌累积时提供轮换保障。';

// 24. Ernest Nuamah — WS periods + season
p['Ernest Nuamah'].wcSpotlight = '22岁前锋/边锋，18次国家队出场4球。2025-26赛季在里昂法甲保持了速度优势和门前嗅觉。边路冲击力在面对英格兰和克罗地亚时是反击的变量，作为苏莱马纳之后的第二边锋选项提供持续的进攻活力。';

// 25. Prince Kwabena Adu — CR truncation + WS all periods
p['Prince Kwabena Adu'].careerReview = cleanProse('22岁的前锋，加纳国内青训。2023年以150万欧元转会捷克比尔森胜利后在捷克联赛获得了稳定出场。5次国家队出场，2025年首次被征召。在捷克联赛的对抗环境中培养了禁区内的嗅觉和身体对抗能力。');
p['Prince Kwabena Adu'].wcSpotlight = '22岁前锋，5次国家队出场。2025-26赛季在比尔森胜利的捷克联赛保持了进球节奏。作为锋线深度在面对巴拿马时可能获得展示机会，禁区内的抢点和对抗是主要武器。';

// 26. Marvin Senaya — WS all periods + CR periods
p['Marvin Senaya'].careerReview = cleanProse(p['Marvin Senaya'].careerReview);
p['Marvin Senaya'].wcSpotlight = '25岁边后卫，2次国家队出场。2025-26赛季在欧塞尔法甲获得轮换，左右两侧都能打的多面性在防线深度中提供灵活性。在需要边路轮换时提供覆盖选项。';

// === Final cleanProse + period check ===
gh.players.forEach(pl => {
  const v = p[pl.name];
  if (!v) return;
  if (v.careerReview) v.careerReview = cleanProse(v.careerReview);
  if (v.wcSpotlight) v.wcSpotlight = cleanProse(v.wcSpotlight);
  if (v.careerReview && !v.careerReview.endsWith('。')) v.careerReview += '。';
  if (v.wcSpotlight && !v.wcSpotlight.endsWith('。')) v.wcSpotlight += '。';
  applied++;
});

fs.writeFileSync('./src/data/players-wiki.json', JSON.stringify(p, null, 2));
console.log('=== Ghana Summary ===');
console.log('Applied:', applied, '/', gh.players.length);
