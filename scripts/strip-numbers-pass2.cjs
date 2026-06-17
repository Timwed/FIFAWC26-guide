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
const brazilObj = squads.find(t => t.name === 'Brazil');
if (brazilObj) for (const p of brazilObj.players) brazilNames.add(p.name);

function cleanBio2(text) {
    if (!text || text.trim() === '') return text;
    let t = text;

    // 1. Trophy counts: "X座Y" pattern
    t = t.replace(/\d+\s*座\s*[^\s，。、；]{1,8}(?:冠军|奖杯|奖|杯)/g, '');
    // "X冠" pattern like "6冠", "5冠" when it's trophy context
    t = t.replace(/\(\s*\d+\s*冠\s*\)/g, '');
    t = t.replace(/\d+\s*冠(?:军)?\s*(?:记录|的|，|。|、|$)/g, '');
    // "X座金球奖"
    t = t.replace(/\d+\s*座\s*金球奖/g, '');
    // "X座欧冠"
    t = t.replace(/\d+\s*座\s*欧冠/g, '');

    // 2. Remaining "X球" patterns in review (club stats)
    t = t.replace(/(?:打入|进|得)\s*\d+\s*球/g, (match) => {
        if (match.includes('打入')) return '打入';
        if (match.includes('进')) return '进';
        if (match.includes('得')) return '得';
        return '';
    });
    // "X球X助" remaining
    t = t.replace(/\d+\s*球\s*\d+\s*助/g, '');
    // Standalone "X助"
    t = t.replace(/(\d+)\s*助(?!攻|理|手|教|威)/g, '');

    // 3. National cap/goal mentions in bios (these are duplicated from nationalCaps/nationalGoals fields)
    // Remove them since they may be inaccurate and the fields store them separately
    t = t.replace(/\d+\s*次\s*国家[队]\s*出[场赛]/g, '');
    t = t.replace(/\d+\s*场\s*国家[队]\s*(?:出[场赛]|比赛|国际)/g, '');
    // "X场国家队X球" pattern  
    t = t.replace(/\d+\s*场\s*国家[队][^，。]{0,10}\d+\s*球/g, '');
    // "43场国家队9球" → already cleaned partially, strip remaining
    t = t.replace(/国家[队][^，。]{0,15}\d+\s*球/g, '国家队的进球效率');
    // "X场国家队出场"
    t = t.replace(/\d+\s*场\s*国家[队]\s*出[场赛]/g, '');

    // 4. Performance metrics remnants
    t = t.replace(/场均\s*跑动\s*\d+\+?\s*公里/g, '');
    t = t.replace(/场均\s*[\d.]+\s*[次个场]/g, '');
    t = t.replace(/[\d.]+\s*次\s*(铲断|拦截|争顶|射门|过人|抢断|关键传球)/g, '');
    // "X公里" in performance context
    t = t.replace(/跑动\s*\d+\+?\s*公里/g, '');
    // Broken fragments from previous clean: "争顶成功、" → "争顶成功"
    t = t.replace(/[，。、]\s*$/g, '');

    // 5. Club trophy paraphrases in bios
    t = t.replace(/拿\s*下\s*\d+\s*座\s*冠[军杯]/g, '拿下');
    t = t.replace(/夺\s*得\s*\d+\s*[个座]\s*[^\s，。、]{1,6}(?:冠军|奖杯|奖)/g, '');

    // 6. "X年X座" trophy patterns
    t = t.replace(/[一二三四五六七八九十百]+\s*年\s*\d+\s*座\s*[^\s，。、]{1,6}冠军/g, '');

    // 7. Fix broken sentences
    // "在德甲拿下4座冠军" → "在德甲拿下"
    t = t.replace(/在\s*(德甲|西甲|英超|法甲|意甲|荷甲|葡超)\s*拿下\s*\d+\s*座\s*冠[军杯]/g, '在$1');
    // "已拿2座西甲+1座欧冠" → ""
    t = t.replace(/已?拿\s*\d+\s*座\s*[^\s，。、]{2,6}\+?\s*\d*\s*座?\s*[^\s，。、]*/g, '');

    // 8. "首半赛季" → ok, keep
    // "三赛季近百球" → already partially fixed
    t = t.replace(/近\s*百\s*球/g, '');

    // 9. "X球" that might be remaining after year (like "2022世界杯3球") 
    // Match years followed by "X球" that aren't penalty saves
    t = t.replace(/(世界杯|欧洲杯|欧冠|联赛|赛季)[^，。]{0,20}?\d+\s*球/g, (match) => {
        // Keep if it's a penalty save reference like "扑出三个点球"
        if (match.includes('点球')) return match;
        // Remove the number
        return match.replace(/\d+\s*球/, '');
    });

    // 10. Clean up artifacts
    t = t.replace(/[，。]\s*[，。]/g, '。');
    t = t.replace(/^\s*[，。、]\s*/g, '');
    t = t.replace(/\s*[，。、]\s*$/g, '');
    t = t.replace(/\s{2,}/g, ' ');
    t = t.replace(/--+/g, '--');
    t = t.replace(/\(\s*\)/g, '');
    t = t.replace(/（\s*）/g, '');
    t = t.replace(/[，。]\s+[，。]/g, '。');
    // Fix "。" before "——" 
    t = t.replace(/。——/g, '——');
    // Fix sentence ending with "。" or nothing
    t = t.replace(/([。！？])\1+/g, '$1');
    // Remove trailing comma/period fragments
    t = t.replace(/[，、]\s*$/g, '');
    // Fix sentences that end with just a number or symbol
    t = t.replace(/[，、。]\s*$/g, '');

    return t.trim();
}

let cleanedCount = 0;
for (const [name, player] of Object.entries(wiki)) {
    if (!targetNames.has(name) || brazilNames.has(name)) continue;

    const oldReview = player.careerReview || '';
    const oldSpotlight = player.wcSpotlight || '';

    const newReview = cleanBio2(oldReview);
    const newSpotlight = cleanBio2(oldSpotlight);

    if (newReview !== oldReview || newSpotlight !== oldSpotlight) {
        player.careerReview = newReview;
        player.wcSpotlight = newSpotlight;
        cleanedCount++;
    }
}

console.log(`Second pass cleaned ${cleanedCount} players`);
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');
console.log('Done.');
