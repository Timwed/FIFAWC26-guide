const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

// Targeted fixes for specific patterns
const fixes = {
    // Fix orphaned "9年" in Bernardo Silva 
    'Bernardo Silva': (p) => {
        p.careerReview = p.careerReview.replace(/最好的球员之一。9年——从/, '最好的球员之一——从');
    },
    // Fix "加盟马竞但五年。" 
    'João Félix': (p) => {
        p.careerReview = p.careerReview.replace('加盟马竞但五年。', '加盟马竞但发展未达预期。');
    },
    // Fix orphaned leading "。的左边卫"
    'Álex Grimaldo': (p) => {
        p.careerReview = p.careerReview.replace('。的左边卫', '。他的左边卫');
    },
    // Fix "国家队是队最好的" 
    'Memphis Depay': (p) => {
        p.wcSpotlight = p.wcSpotlight.replace('国家队是队最好的', '国家队最好的');
    },
    // Fix "三赛季。" 
    'Harry Kane': (p) => {
        p.careerReview = p.careerReview.replace('三赛季。', '三个赛季。');
    },
    // Fix space before quote
    'Virgil van Dijk': (p) => {
        p.careerReview = p.careerReview.replace(/\s+'世界/, "'世界");
    },
    // Fix future predictive stats in Messi's spotlight
    'Lionel Messi': (p) => {
        p.wcSpotlight = p.wcSpotlight.replace('出战并贡献16次助攻', '出战并贡献大量助攻');
        p.wcSpotlight = p.wcSpotlight.replace(
            '他将成为继贝利之后历史上第二位赢得的球员',
            '他将成为继贝利之后历史上第二位赢得三座世界杯的球员'
        );
    },
    // Van Dijk - "荷兰队长，国家队" → better ending
    // Already handled above with the quote fix
};

// Also fix general patterns across all non-Brazil 7 team bios
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));
const targetTeams = ['Argentina', 'Germany', 'France', 'England', 'Spain', 'Portugal', 'Netherlands'];
const targetNames = new Set();
for (const team of targetTeams) {
    const t = squads.find(x => x.name === team);
    if (!t) continue;
    for (const p of t.players) targetNames.add(p.name);
}
const br = squads.find(t => t.name === 'Brazil');
const brazilNames = new Set();
if (br) for (const p of br.players) brazilNames.add(p.name);

// General pattern: "三赛季。" → "三个赛季。" when preceded by "拜仁，"
// Already handled individually above

let fixedCount = 0;
for (const [name, player] of Object.entries(wiki)) {
    if (!targetNames.has(name) || brazilNames.has(name)) continue;
    
    if (fixes[name]) {
        fixes[name](player);
        fixedCount++;
    }
}

console.log(`Final fixes applied to ${fixedCount} players`);
fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');
console.log('Done.');
