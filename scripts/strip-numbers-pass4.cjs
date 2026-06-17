const fs = require('fs');

const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));

const targetTeams = ['Argentina', 'Germany', 'France', 'England', 'Spain', 'Portugal', 'Netherlands'];
const targetNames = new Set();
for (const team of targetTeams) {
    const teamObj = squads.find(t => t.name === team);
    if (!teamObj) continue;
    for (const p of teamObj.players) targetNames.add(p.name);
}
const brazilNames = new Set();
const br = squads.find(t => t.name === 'Brazil');
if (br) for (const p of br.players) brazilNames.add(p.name);

function fixBio(text) {
    if (!text || text.trim() === '') return text;
    let t = text;

    // Fix "。——" → "——" 
    t = t.replace(/[。——]+[。——]/g, (m) => m.includes('——') ? '——' : '。');

    // Fix "。——" → "——" (period before dash)
    t = t.replace(/。——/g, '——');

    // Fix "——。" at end
    t = t.replace(/——。$/g, '。');

    // Fix "...之一。——主教练" → "...之一——主教练"  
    t = t.replace(/[。——]\s*[——]/g, '——');

    // Fix "五年2025年" → "五年。2025年" or "五年，2025年"
    t = t.replace(/([一二三四五六七八九十]+\s*[年赛季])\s*(\d{4})/g, '$1。$2');

    // Fix "三赛季2021" → "三赛季。2021"
    t = t.replace(/赛季\s*(\d{4})/g, '赛季。$1');

    // Fix "历史。——加盟" → "历史——加盟"
    t = t.replace(/[。]\s*——\s*[加转签]/g, (m) => m.replace('。', ''));

    // Fix orphaned trailing numbers, periods
    t = t.replace(/——\s*[，、。]\s*——/g, '——');
    t = t.replace(/——\s*[，、。]/g, '——');
    t = t.replace(/[，。]\s*——[，。]/g, '——');
    t = t.replace(/[。]\s*——/g, '——');

    // Fix "国家队——球队" → "国家队。球队"
    t = t.replace(/国家[队]\s*——\s*[球]/g, '国家队是');

    // Fix "已有，传奇级" → "已有国家队经验，传奇级"
    t = t.replace(/已有\s*[，、。]\s*传/g, '已有国家队经验，传');

    // Fix "三赛季2021" but not "2023-24赛季" — careful
    t = t.replace(/(?<!\d)[一二三四五六七八九十]+\s*赛季\s*(\d{4})/g, '赛季。$1');

    // Fix "今年将年满40岁——这将是他的第5届世界杯（2010-2026）" - check for proper formatting
    // This is already good

    // Fix "作为世界最佳中卫之一。——曼城" 
    t = t.replace(/之一\s*[。]\s*[——]/g, '之一——');

    // Fix orphaned "+" signs
    t = t.replace(/[，、。]\s*\+\s*[，、。]/g, '。');

    // Fix "、。" → "。"
    t = t.replace(/[、，]\s*。/g, '。');

    // Multiple periods/spaces cleanup
    t = t.replace(/[。]{2,}/g, '。');
    t = t.replace(/\s{2,}/g, ' ');
    t = t.replace(/[，、]+\s*$/g, '');
    t = t.replace(/^\s*[，、。]\s*/g, '');

    // Fix "打入并贡献X次助攻" patterns  
    t = t.replace(/出战\s*打入\s*并\s*贡献/g, '出战并贡献');

    return t.trim();
}

let fixedCount = 0;
for (const [name, player] of Object.entries(wiki)) {
    if (!targetNames.has(name) || brazilNames.has(name)) continue;

    const oldReview = player.careerReview || '';
    const oldSpotlight = player.wcSpotlight || '';

    const newReview = fixBio(oldReview);
    const newSpotlight = fixBio(oldSpotlight);

    if (newReview !== oldReview || newSpotlight !== oldSpotlight) {
        player.careerReview = newReview;
        player.wcSpotlight = newSpotlight;
        fixedCount++;
    }
}

console.log(`Pass 4 fixed ${fixedCount} players`);
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');
console.log('Done.');
