const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));
const teams = JSON.parse(fs.readFileSync('src/data/teams.json'));

// Build player -> {club, caps, goals, age, position, tier, team, group}
const playerIndex = new Map();
for (const sq of squads) {
  const teamEntry = teams.find(t => t.enName === sq.name);
  for (const p of sq.players) {
    playerIndex.set(p.name, {
      ...p,
      teamEn: sq.name,
      teamShort: teamEntry?.shortName,
      group: teamEntry?.group,
    });
  }
}

// Build set of all valid club names
const validClubs = new Set();
for (const sq of squads) for (const p of sq.players) validClubs.add(p.club);

const CRITICAL = [];
const WARNING = [];
const INFO = [];

const hasBadEnding = t => t && !/[。！？.!?""）)]$/.test(t.trim());

for (const [name, bio] of Object.entries(wiki)) {
  const pInfo = playerIndex.get(name);
  if (!pInfo) {
    CRITICAL.push({ name, type: 'NOT_IN_SQUADS', msg: '球员不在 squads.json 中' });
    continue;
  }

  // === L1: Field completeness ===
  if (!bio.careerReview) CRITICAL.push({ name, team: pInfo.teamEn, type: 'MISSING_CR', msg: '缺 careerReview' });
  if (!bio.wcSpotlight) CRITICAL.push({ name, team: pInfo.teamEn, type: 'MISSING_WS', msg: '缺 wcSpotlight' });
  if (bio.wsSpotlight) CRITICAL.push({ name, team: pInfo.teamEn, type: 'WRONG_FIELD_WS', msg: '存在 wsSpotlight（应为 wcSpotlight）' });

  const cr = bio.careerReview || '';
  const ws = bio.wcSpotlight || '';

  // === L1: Format issues ===
  if (cr.includes('→') || ws.includes('→')) CRITICAL.push({ name, team: pInfo.teamEn, type: 'ARROW', msg: '含箭头记法 →' });
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(cr + ws)) CRITICAL.push({ name, team: pInfo.teamEn, type: 'GARBLED', msg: '含控制字符' });
  if (hasBadEnding(cr)) WARNING.push({ name, team: pInfo.teamEn, type: 'CR_BAD_ENDING', msg: 'CR 句末无标点', tail: cr.slice(-40) });
  if (hasBadEnding(ws)) WARNING.push({ name, team: pInfo.teamEn, type: 'WS_BAD_ENDING', msg: 'WS 句末无标点', tail: ws.slice(-40) });

  // === L1: Club name consistency ===
  for (const text of [cr, ws]) {
    // Find English club names mentioned (capitalized words that look like clubs)
    const words = text.match(/[A-Z][A-Za-zéíóúñüöä]+(?:\s+[A-Z][A-Za-zéíóúñüöä]+)*/g) || [];
    const clubCandidates = words.filter(w => w.length > 3 && !['World','Cup','FIFA','UEFA','Champions','League','Europa','MLS','NWSL','Premier','Bundesliga','Serie','Liga','Ligue','Eredivisie','Saudi','Pro','League','Club','World','Cup','FC','AC','United','City','Real','Bayern','Barcelona','This','The','A','An','He','His','In','At','On','For','With','After','Before','During','Since','When','While','Although','However','But','And','Or','Not','No','Yes','Most','More','Less','Very','World','Cup','Africa','Asia','Europe','America','North','South','Central','East','West','Gulf','Arab','Persian','Iranian','Saudi','Turkish','Egyptian','Moroccan','Algerian','Tunisian','Japanese','Korean','Chinese','Australian','Mexican','Brazilian','Argentine','Colombian','Uruguayan','Ecuadorian','Paraguayan','Peruvian','Chilean','Bolivian','Venezuelan','Canadian','American','Croatian','Serbian','Bosnian','Slovenian','Slovak','Czech','Polish','Hungarian','Romanian','Bulgarian','Greek','Turkish','Russian','Ukrainian','Swedish','Norwegian','Danish','Finnish','Icelandic','Irish','Scottish','Welsh','English','Spanish','Portuguese','French','Italian','German','Dutch','Belgian','Swiss','Austrian'].includes(w));
    for (const candidate of clubCandidates) {
      if (!validClubs.has(candidate) && candidate.length > 5) {
        // Only flag if it looks like a club (has typical patterns) - but this is noisy, keep as INFO
        // Skip for now to avoid false positives
      }
    }
  }

  // === L2: Length checks ===
  const crLen = cr.length;
  const wsLen = ws.length;
  const total = crLen + wsLen;
  const tier = pInfo.tier || 'C';

  const tierRanges = {
    'S': { crMin: 280, crMax: 340, wsMin: 220, wsMax: 280, totalMin: 500, totalMax: 600 },
    'A': { crMin: 220, crMax: 280, wsMin: 160, wsMax: 220, totalMin: 380, totalMax: 480 },
    'B': { crMin: 170, crMax: 220, wsMin: 130, wsMax: 170, totalMin: 300, totalMax: 380 },
    'C': { crMin: 120, crMax: 170, wsMin: 120, wsMax: 160, totalMin: 250, totalMax: 320 },
  };
  const range = tierRanges[tier];
  if (range) {
    if (total > range.totalMax + 50) WARNING.push({ name, team: pInfo.teamEn, type: 'TOO_LONG', tier, msg: `${tier}档总长${total}超出上限${range.totalMax}`, crLen, wsLen });
    if (total < range.totalMin - 30) WARNING.push({ name, team: pInfo.teamEn, type: 'TOO_SHORT', tier, msg: `${tier}档总长${total}低于下限${range.totalMin}`, crLen, wsLen });
  }

  // === L2: Suspicious phrases (AI contamination) ===
  const suspiciousPatterns = [
    /重要里程碑和/,
    /和。/,
    /持续。/,
    /基础和技术底子/,
    /信仰和国民期待/,
    /成长印迹/,
    /和[^。！？.!?]{0,15}和[^。！？.!?]{0,15}和[^。！？.!?]{0,15}和/,
    /无可替代[^。！？]{0,10}不可替代/,
    /是.{0,8}的.{0,8}是.{0,8}的.{0,8}是/,
  ];
  for (const text of [cr, ws]) {
    for (const pat of suspiciousPatterns) {
      if (pat.test(text)) {
        WARNING.push({ name, team: pInfo.teamEn, type: 'SUSPICIOUS', msg: '疑似AI注水', pattern: pat.source, sample: text.slice(0, 80) });
      }
    }
  }

  // === L2: Fluff word frequency ===
  const fluffWords = ['出色', '顶级', '无可替代', '不可替代', '重要一员', '核心力量', '坚实可靠', '充分证明'];
  let fluffCount = 0;
  for (const text of [cr, ws]) {
    for (const w of fluffWords) {
      const matches = text.match(new RegExp(w, 'g'));
      if (matches) fluffCount += matches.length;
    }
  }
  if (fluffCount >= 3) INFO.push({ name, team: pInfo.teamEn, type: 'FLUFF', msg: `空泛词${fluffCount}次`, count: fluffCount });

  // === L2: "2025-26赛季" presence ===
  if (!cr.includes('2025-26') && !ws.includes('2025-26')) {
    INFO.push({ name, team: pInfo.teamEn, type: 'NO_2025_26', msg: '未提及2025-26赛季' });
  }
}

// === L2: Tier budget per team ===
const teamTiers = {};
for (const sq of squads) {
  const counts = { S: 0, A: 0, B: 0, C: 0 };
  for (const p of sq.players) {
    const t = p.tier || 'C';
    counts[t] = (counts[t] || 0) + 1;
  }
  teamTiers[sq.name] = counts;
}

// === Summary ===
const summary = {
  CRITICAL: CRITICAL.length,
  WARNING: WARNING.length,
  INFO: INFO.length,
};

console.log('===== 审计摘要 =====');
console.log(JSON.stringify(summary, null, 2));
console.log('\n===== CRITICAL (' + CRITICAL.length + ') =====');
for (const c of CRITICAL.slice(0, 50)) console.log(`[${c.type}] ${c.name} (${c.team || '?'}) - ${c.msg}`);
if (CRITICAL.length > 50) console.log(`... 还有 ${CRITICAL.length - 50} 条`);
console.log('\n===== WARNING (' + WARNING.length + ') =====');
for (const w of WARNING.slice(0, 80)) console.log(`[${w.type}] ${w.name} (${w.team}) - ${w.msg}${w.sample ? ' | ' + w.sample : ''}`);
if (WARNING.length > 80) console.log(`... 还有 ${WARNING.length - 80} 条`);
console.log('\n===== INFO 摘要 =====');
const infoByType = {};
for (const i of INFO) infoByType[i.type] = (infoByType[i.type] || 0) + 1;
console.log(JSON.stringify(infoByType, null, 2));

// Write full report
const report = { summary, CRITICAL, WARNING, INFO, teamTiers };
fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2), 'utf8');
console.log('\n完整报告已写入 audit-report.json');
