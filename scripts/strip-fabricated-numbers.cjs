const fs = require('fs');

const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));

const targetTeams = ['Argentina', 'Germany', 'France', 'England', 'Spain', 'Portugal', 'Netherlands'];

// Collect all target player names
const targetNames = new Set();
for (const team of targetTeams) {
    const teamObj = squads.find(t => t.name === team);
    if (!teamObj) continue;
    for (const p of teamObj.players) targetNames.add(p.name);
}

// We also need to identify Brazil players to NOT touch them
const brazilNames = new Set();
const brazilObj = squads.find(t => t.name === 'Brazil');
if (brazilObj) for (const p of brazilObj.players) brazilNames.add(p.name);

function cleanBio(text) {
    if (!text || text.trim() === '') return text;
    let t = text;

    // 1. Remove transfer fee mentions: "以XXXX万欧元/euro/英镑加盟" or "XXXX万欧"
    t = t.replace(/以\s*\d[\d,.]*\s*万?\s*(欧元|欧|镑|英镑|美元|美金)(\+\s*浮动条款)?\s*(加盟|签下|转会|的)?/g, (match) => {
        // Remove the "以X万欧" part but keep "加盟" if present
        const keep = match.includes('加盟') ? '加盟' : (match.includes('转会') ? '转会' : '');
        return keep || '';
    });
    // Also handle patterns like "2024年6500万欧加盟"
    t = t.replace(/\d[\d,.]*\s*万?\s*(欧元|欧|镑|英镑|美元|美金)(\+\s*浮动条款)?\s*(加盟|转会|签下)/g, '$3');
    // "1.27亿欧加盟" etc with decimals
    t = t.replace(/\d[\d,.]*\s*亿\s*(欧元|欧|镑|英镑|美元|美金)(\+\s*浮动条款)?\s*(加盟|转会|签下)/g, '$3');
    // Standalone fee mentions: "1.05亿欧元+浮动条款"
    t = t.replace(/\d[\d,.]*\s*[亿万]\s*(欧元|欧|镑|英镑|美元|美金)(\+\s*浮动条款)?/g, '');
    // "转会费纪录" mentions with fee
    t = t.replace(/以\s*\d[\d,.]*\s*万\s*(欧元|欧)\s*加盟/g, '加盟');

    // 2. Remove club match counts: "178场", "190场" (but not competition years)
    t = t.replace(/\d+\s*场(?=\s*国家|[^\d])/g, (match) => {
        // Only remove if it's a match count (standalone or followed by non-date text)
        return '';
    });

    // 3. Remove club goal counts when clearly stats: "34球", "52球", "35球", "38球"
    // But be careful with "X球" that might be part of "X座欧冠X球" — need context
    t = t.replace(/(\d+)\s*(球|助|进球|助攻)/g, (match, num, unit) => {
        // Remove standalone stat mentions
        return '';
    });

    // 4. Remove trophy counts in bios: "X座英超", "X座欧冠", "X座金球奖", "X座西甲", etc.
    t = t.replace(/\d+\s*座\s*[^\s，。、；]{1,6}(冠军|奖|杯|赛)/g, '');
    // Also "X次国家队" — this is tricky, we have nationalCaps data
    // Actually don't remove these — nationalCaps are stored separately and likely accurate

    // 5. Remove per-game performance stats: "场均X次", "场均X球", etc.
    t = t.replace(/场均\s*\d[\d.]*\s*[次个场球助公里截断射]/g, '');

    // 6. Remove performance percentages: "成功率X%", "超过X%"
    t = t.replace(/(成功率达到?|稳定在|超过|领跑)\s*\d[\d.]*\s*%/g, '');
    t = t.replace(/\d[\d.]*\s*%\s*(以上|的|左右)?/g, '');

    // 7. Remove specific match counts embedded in career: "五年178场", "6个赛季150场"
    t = t.replace(/\d+\s*场(?=[^，。]*?是|为|的)/g, (match) => {
        return '';
    });

    // 8. Remove trophy counts: "6座法甲冠军" in Mbappe bio, "5座法国杯"
    t = t.replace(/\d+\s*座\s*[^\s，。、；]{2,6}(冠军|奖杯|奖|杯)/g, '');

    // 9. Remove speed records: "英超纪录36.6km/h"
    t = t.replace(/纪录\s*\d[\d.]*\s*km\/h/g, '纪录');

    // 10. Clean up resulting artifacts
    // Double punctuation
    t = t.replace(/，\s*，/g, '，');
    t = t.replace(/。。/g, '。');
    t = t.replace(/。\s*，/g, '。');
    t = t.replace(/，\s*。/g, '。');
    // Empty parentheses
    t = t.replace(/\（\s*\）/g, '');
    t = t.replace(/\(\s*\)/g, '');
    // Multiple spaces
    t = t.replace(/\s{2,}/g, '');
    // Double dashes
    t = t.replace(/--+/g, '--');
    // Trailing commas before period
    t = t.replace(/，\s*。/g, '。');
    // "在俱乐部X年" — remove X when it's a fabricated years-at-club count (but keep the club reference)
    t = t.replace(/在\s*[^\s，。]{2,6}\s*\d+\s*年/g, (match) => {
        // Just remove the number: "在米兰7年" → "在米兰"  
        return match.replace(/\d+\s*年/, '');
    });
    // Similarly: "在贝蒂斯五年52球" → "在贝蒂斯"
    t = t.replace(/在\s*[^\s，。]{2,6}\s*[三四五六七八九十]+\s*年/g, (match) => {
        return match.replace(/[三四五六七八九十]+\s*年/, '');
    });
    // "X个赛季" in bios
    t = t.replace(/\d+\s*个\s*赛季/g, '');

    // 11. Remove "英超前三中卫" style rankings
    // (leave these — they're qualitative opinions, not fabricated stats)

    // 12. Remove club-specific goal runs: "三赛季近百球"
    t = t.replace(/[一二三四五六七八九十百]+赛季\s*近?\s*\d+\s*球/g, '');
    // "每赛季进球数如中锋" → leave, it's qualitative

    // 13. Remove "赛季X球X助" style mentions
    t = t.replace(/\d+\s*球\s*\d+\s*助/g, '');
    // "首半赛季8球7助"
    t = t.replace(/赛季\s*\d+\s*球\s*\d+\s*助/g, '赛季');

    // Clean up common fragments
    t = t.replace(/[，。]\s*[，。]/g, '。');
    t = t.replace(/^\s*[，。、]\s*/g, '');
    t = t.replace(/\s*[，。、]\s*$/g, '');

    // Remove "X球" that remains after cleanup when preceded by clearly stat context
    // Already handled above

    // Fix "—" at start of line
    t = t.replace(/^\s*—\s*/g, '');

    // Fix sentences that became empty
    t = t.replace(/[^。，]+(?:。|，|$)/g, (sentence) => {
        const cleaned = sentence.replace(/^[，。、\s]+/, '').replace(/[，。、\s]+$/, '');
        if (!cleaned || cleaned.length < 2) return '';
        return sentence;
    });

    return t.trim();
}

let cleanedCount = 0;
for (const [name, player] of Object.entries(wiki)) {
    if (!targetNames.has(name) || brazilNames.has(name)) continue;

    const oldReview = player.careerReview || '';
    const oldSpotlight = player.wcSpotlight || '';

    const newReview = cleanBio(oldReview);
    const newSpotlight = cleanBio(oldSpotlight);

    if (newReview !== oldReview || newSpotlight !== oldSpotlight) {
        player.careerReview = newReview;
        player.wcSpotlight = newSpotlight;
        cleanedCount++;
    }
}

console.log(`Cleaned ${cleanedCount} players`);
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');
console.log('Done. Written back to src/data/players-wiki.json');
