// Remove fabricated stats from bios
const fs = require('fs');
const wikiPath = require('path').join(__dirname, '..', 'src', 'data', 'players-wiki.json');
let wiki = JSON.parse(fs.readFileSync(wikiPath, 'utf8'));

let fixes = 0;
for (const [name, player] of Object.entries(wiki)) {
  for (const field of ['careerReview', 'wcSpotlight']) {
    let text = player[field];
    if (!text) continue;
    const original = text;
    
    // Remove parenthesized club stats: (40场13球), (474球), (12球10助)
    text = text.replace(/（\d+场\d+球(，?\d+助)?）/g, '');
    text = text.replace(/\(\d+场\d+球(,\s?\d+助)?\)/g, '');
    // Remove transfer fees in sentence: "以2000万加盟", "以7500万镑转会"
    text = text.replace(/以\d+万(欧|镑|美元)(加盟|转会|转投)/g, '加盟');
    // Remove "X场Y球" pattern (club career summary)
    text = text.replace(/(\d+)场(\d+)球/g, '');
    // Remove "X赛季Y球" 
    text = text.replace(/\d+赛季\d+球/g, '');
    
    // Clean double punctuation
    text = text.replace(/，，/g, '，');
    text = text.replace(/。。/g, '。');
    text = text.replace(/——+/g, '——');
    
    if (text !== original) {
      player[field] = text;
      fixes++;
    }
  }
}

fs.writeFileSync(wikiPath, JSON.stringify(wiki, null, 2) + '\n', 'utf8');
console.log(`Fixed ${fixes} bio fields.`);
