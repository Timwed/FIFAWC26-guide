const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));

const targetTeams = ['Argentina', 'Germany', 'France', 'England', 'Spain', 'Portugal', 'Netherlands'];
const numberRegex = /\d+/g;

let total = 0;
let totalWithNumbers = 0;

for (const teamName of targetTeams) {
    const teamObj = squads.find(t => t.name === teamName);
    if (!teamObj) { console.log(teamName + ': NOT FOUND'); continue; }
    const players = teamObj.players;
    total += players.length;
    let teamEntries = [];
    for (const p of players) {
        const bio = wiki[p.name];
        if (!bio) continue;
        const review = (bio.careerReview || '').replace(/\u2014/g, '-');
        const spotlight = (bio.wcSpotlight || '').replace(/\u2014/g, '-');
        const allText = review + ' ' + spotlight;
        const matches = allText.match(numberRegex);
        if (matches && matches.length > 0) {
            totalWithNumbers++;
            teamEntries.push({
                name: p.name,
                review: review.substring(0, 200),
                spotlight: spotlight.substring(0, 200),
                numbers: matches
            });
        }
    }
    if (teamEntries.length > 0) {
        console.log('\n=== ' + teamName + ' (' + teamEntries.length + ' players with numbers) ===');
        for (const e of teamEntries) {
            console.log('  [' + e.name + '] nums: ' + e.numbers.join(', '));
            if (e.review) console.log('    review: ' + e.review);
            if (e.spotlight) console.log('    spotlight: ' + e.spotlight);
        }
    }
}

console.log('\nTotal: ' + totalWithNumbers + '/' + total + ' players have numbers in bios');
