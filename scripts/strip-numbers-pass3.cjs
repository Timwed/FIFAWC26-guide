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

    // Fix trophy count fragments
    t = t.replace(/(\d+)\s*座\s*(英超|西甲|德甲|法甲|意甲|欧冠|葡超|荷甲|金球)\+?/g, '');
    t = t.replace(/[，。]\s*\d+\s*年\s*\d+\s*座\s*\S*\s*\+?\s*/g, '。');
    // Fix "9年6座英超+" 
    t = t.replace(/\d+\s*年\s*\d+\s*座\s*\S*\s*\+?/g, '');

    // Fix orphaned parenthetical content
    t = t.replace(/[（\(]仅\s*失\s*[，、]*\s*[）\)]/g, '');
    t = t.replace(/[（\(]\s*[，、。]*\s*[）\)]/g, '');

    // Fix "在将年满" → "今年将年满" 
    t = t.replace(/在\s*将\s*年\s*满/g, '今年将年满');

    // Fix "拿下、" → "拿下"
    t = t.replace(/拿下\s*[，、。]*/g, '拿下');

    // Fix "加盟、" → remove
    t = t.replace(/加盟\s*[，、。]*\s*$/g, '加盟');

    // Fix "、。" → "。"
    t = t.replace(/[，、。]+\s*[。]/g, '。');

    // Fix trailing orphaned punctuation
    t = t.replace(/[，。、]+\s*$/g, '');

    // Fix "（国际足球历史最高）、、" style 
    t = t.replace(/[，。，、]{2,}/g, '，');

    // Fix "5座英超+" remnants
    t = t.replace(/\+\s*—/g, '—');
    t = t.replace(/^\+/g, '');
    t = t.replace(/[，、]\s*\+[，、]/g, '，');
    t = t.replace(/\+\s*[，、。]/g, '。');

    // Fix empty "、" "，"
    t = t.replace(/^\s*[、，。\s]*$/g, '');

    // Fix "——" at end
    t = t.replace(/——\s*$/g, '');
    t = t.replace(/[，、]——/g, '——');

    // Fix "现有" → ""
    t = t.replace(/现有\s*[，、。]*/g, '');

    // Fix "仅。" → ""
    t = t.replace(/仅\s*[，、。]/g, '');

    // Fix "3座葡超，" → ""
    t = t.replace(/\d+\s*座\s*\S{1,6}\s*[，、。]/g, '');

    // Fix "10座西甲、、、" → remove entire trophy list
    t = t.replace(/[，。、]\s*\d+\s*座\s*\S+\s*[，、]+\s*\S+\s*[，、]*/g, '。');

    // Fix "2023-的" → "的"
    t = t.replace(/\d{4}[—\-]\s*的/g, '的');

    // Fix "五年仅。" → "五年"  
    t = t.replace(/[一二三四五六七八九十百]+\s*[年赛季]\s*仅\s*[，、。]/g, (m) => m.replace('仅', ''));

    // Fix "三赛季。" → "三个赛季"
    t = t.replace(/[一二三四五六七八九十百]+\s*赛季\s*[，、。]/g, (m) => m.replace(/[，、。]/, ''));

    // Fix two consecutive "。"  
    t = t.replace(/[。]{2,}/g, '。');

    // Fix "），"， → "），"
    t = t.replace(/[），）][，。]/g, (m) => m[0]);

    // Fix trailing empty parens/brackets
    t = t.replace(/[（(]\s*[，、。\s]*[)）]/g, '');
    t = t.replace(/[（(]\s*[)）]/g, '');

    // Fix broken "...世界纪录）、（国际足球历史最高）、、"  
    t = t.replace(/[（(][^)）]*[)）]\s*[，、]+\s*[（(][^)）]*[)）]/g, '');
    t = t.replace(/[，、]\s*[，、]+/g, '，');

    // Fix "——" between commas
    t = t.replace(/，\s*——\s*$/g, '');
    t = t.replace(/\s*——\s*[，、。]$/g, '');

    // Fix sequences of punctuation plus empty
    t = t.replace(/[，、]\s*[，、]/g, '，');
    t = t.replace(/，\s*。\s*，/g, '。');

    return t.trim();
}

// Manual rewrites for the most damaged bios
const manualFixes = {
    'Cristiano Ronaldo': {
        careerReview: '从葡萄牙体育到曼联、皇马、尤文、再到利雅得胜利——足球史上最伟大的射手之一。拥有国际足坛最高出场次数和进球纪录，五座金球奖获得者。41岁的他仍然在踢，体育史上最执着的竞争者。',
    },
    'Manuel Neuer': {
        careerReview: '沙尔克04青训→拜仁慕尼黑。足球史上最伟大的门将之一——"清道夫门将"定义者，将门将的活动范围从禁区扩展到了整个半场。2014世界杯冠军（金手套奖），在拜仁拿下无数德甲冠军和欧冠冠军。2022年12月滑雪骨折导致赛季报销，40岁高龄从骨折中复出并重返拜仁首发，展现了近乎变态的职业态度。2022世界杯德国小组出局，这是他职业生涯的最大耻辱，他需要用一届有尊严的世界杯来告别。',
        wcSpotlight: '诺伊尔今年将年满40岁——这将是他的第5届世界杯（2010-2026），追平了马特乌斯和布冯的纪录。膝盖和腿伤的后遗症让他失去了早期巅峰时期的爆发力，但他的阅读比赛能力和大赛经验仍然让他在德国门将位置上不可替代。这不是在追求个人荣誉，是在为小组出局的耻辱做一个体面的收尾。只要他健康，他就是德国队的长期队长和一号门将，但如果德国再次小组出局，他的世界杯告别将带着永远无法抹去的污点。',
    },
    'Lionel Messi': {
        careerReview: '足球史上最无争议的GOAT候选，从罗萨里奥的街头少年到八届金球奖得主，梅西的职业生涯是一部无法复制的神话。巴塞罗那17年——无数座西甲、国王杯和欧冠冠军，改写西甲历史进球纪录。2021年含泪离开巴萨加盟巴黎，两年后转投迈阿密国际——这一步被认为是半退役信号，但随后的国家队表现彻底推翻了所有质疑：2021年终于为阿根廷赢得美洲杯，2022年世界杯决赛战胜法国夺冠，2024年再夺美洲杯，完成了国家队荣誉的全面收割。',
    },
    'Jude Bellingham': {
        careerReview: '伯明翰→多特蒙德→皇马。2023年加盟皇马，处子赛季即惊艳欧洲足坛，同年获得金童奖。在皇马已收获西甲和欧冠冠军。22岁已经是世界级中场，能以一己之力改变比赛。',
    },
};

let fixedCount = 0;
for (const [name, player] of Object.entries(wiki)) {
    if (!targetNames.has(name) || brazilNames.has(name)) continue;

    // Apply manual fixes first
    if (manualFixes[name]) {
        if (manualFixes[name].careerReview !== undefined)
            player.careerReview = manualFixes[name].careerReview;
        if (manualFixes[name].wcSpotlight !== undefined)
            player.wcSpotlight = manualFixes[name].wcSpotlight;
        fixedCount++;
        continue;
    }

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

console.log(`Pass 3 fixed ${fixedCount} players`);
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');
console.log('Done.');
