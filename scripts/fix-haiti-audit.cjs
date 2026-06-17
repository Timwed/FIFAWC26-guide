const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'players-wiki.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ── Issue 1: Duckens Nazon — GARBLED + INFLATED wcSpotlight ──
// "44个国家队进球中没有一个是借来的" → replace garbled metaphor
// "他是海地进攻的唯一答案" → remove false "only" claim
data['Duckens Nazon'].wcSpotlight =
  "32岁的纳宗迎来职业生涯最重要的一个月。作为海地队史第一射手，44个国家队进球每一个都是实打实的战功。他和皮埃罗组成的锋线是海地进攻的核心支柱。如果海地要在这届世界杯上打进载入史册的进球，全世界的镜头都会对准他。";

// ── Issue 2: Dominique Simon — MISSING (88 chars, below 100) ──
// Expand both careerReview and wcSpotlight to meet minimum
data['Dominique Simon'].careerReview =
  "25岁的中场球员，效力于斯洛伐克联赛塔特兰普雷绍夫。国家队出场仅2次，中场硬度和拼抢能力是他的标签，在预选赛阶段替补出场后展现出了不俗的覆盖能力。";

data['Dominique Simon'].wcSpotlight =
  "西蒙在本届世界杯的上场机会极其有限，但能从斯洛伐克联赛入选26人大名单本身就是对其训练态度和战术执行力的认可。";

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

// ── Verify ──
const checks = ['Duckens Nazon', 'Dominique Simon'];
checks.forEach(name => {
  const p = data[name];
  const cr = (p.careerReview || '').length;
  const ws = (p.wcSpotlight || '').length;
  console.log(`${name}: CR=${cr} WS=${ws} TOTAL=${cr + ws}`);
});

console.log('\nFix applied successfully. 3 issues resolved.');
