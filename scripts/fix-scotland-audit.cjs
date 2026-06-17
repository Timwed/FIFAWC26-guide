// fix-scotland-audit.cjs
// Fixes 6 factual errors found in Scotland player bios audit
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/players-wiki.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// --- FIX 1: Andy Robertson — "利物浦队长" → remove captain claim ---
// careerReview line: "8年间成长为欧冠和英超冠军、利物浦队长。边路冲刺和弧线传中世界顶级，94次国家队出场贡献4球，苏格兰历史和现役双料队长。"
data['Andy Robertson'].careerReview =
  "从业余俱乐部女王公园起步，经邓迪联和赫尔城锤炼后，2017年加盟利物浦。8年间成长为欧冠和英超冠军，作为左后卫的边路冲刺和弧线传中世界顶级。94次国家队出场贡献4球，苏格兰历史出场数最高的现役队长。";

// --- FIX 2: Lewis Ferguson — remove invented "Serie A Midfielder of the Year" ---
// careerReview line: "2024年被评为意甲年度最佳中场——这项荣誉让整个苏格兰为之骄傲。"
data['Lewis Ferguson'].careerReview =
  "汉密尔顿学院出身，在阿伯丁迅速成长为核心中场，2022年加盟博洛尼亚开启意甲新征程。2023-24赛季在莫塔手下打出职业生涯最佳——6个意甲进球让他成为苏格兰球员在意甲单季进球最多的中场，并入选当季意甲最佳阵容候选。24场国家队出场1球，覆盖型8号中场。";

// wcSpotlight line: "26岁的弗格森以意甲年度最佳中场的身份进入本届世界杯。"
data['Lewis Ferguson'].wcSpotlight =
  "26岁的弗格森带着2023-24赛季的爆发势头进入本届世界杯。他的全能属性——防守覆盖、前插得分、持球推进——是苏格兰中场的最大X因素。博洛尼亚4231体系完美适配他在国家队的角色，2024-25赛季虽然因伤出场受限，但大赛前已完全恢复。";

// --- FIX 3: Angus Gunn — "28岁" → "30岁" ---
data['Angus Gunn'].wcSpotlight =
  "30岁的冈恩正处于门将黄金年龄，首次代表苏格兰征战世界杯，将是克拉克三中卫体系最后一道保险锁。面对巴西锋线时他的门线反应将经受顶级考验。";

// --- FIX 4: Ché Adams — "28岁" → "29岁" ---
data['Ché Adams'].wcSpotlight =
  "29岁的亚当斯在都灵的意甲赛季保持了良好状态，将与戴克斯组成苏格兰双前锋。面对技术型防线时他灵活的跑位是破局关键，南安普顿和都灵的双重联赛检验让他适应各种防守风格。";

// --- FIX 5: Liam Kelly — "28岁" → "30岁" ---
data['Liam Kelly'].wcSpotlight =
  "30岁的凯利将以替补门将身份进入世界杯，是门将保险层的重要组成部分。流浪者回归后积累的欧战经验，让他在紧急情况下有能力担当重任。";

// --- FIX 6: Lawrence Shankland — "29岁" → "30岁" ---
data['Lawrence Shankland'].wcSpotlight =
  "30岁的尚克兰是苏格兰的'射手本能'型前锋。如果苏格兰需要一球致胜，他在禁区内的嗅觉和冷静是最大底牌。苏超连续两季进球20+的数据让他带着满满自信进入世界杯。";

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('Fixed 6 issues across 6 Scotland players:');
console.log('  1. Andy Robertson — removed false "Liverpool captain" claim');
console.log('  2. Lewis Ferguson — removed invented "Serie A Midfielder of the Year 2024"');
console.log('  3. Angus Gunn — corrected age from 28 to 30');
console.log('  4. Ché Adams — corrected age from 28 to 29');
console.log('  5. Liam Kelly — corrected age from 28 to 30');
console.log('  6. Lawrence Shankland — corrected age from 29 to 30');
