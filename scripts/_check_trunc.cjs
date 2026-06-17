var fs = require('fs');
var d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
var s = require('../src/data/squads.json');

// Check all A+B+C group players for garbled/truncated endings
var groups = ['A','B','C'];
var issues = [];

groups.forEach(function(g) {
  s.filter(function(t) { return t.group === g; }).forEach(function(t) {
    t.players.forEach(function(p) {
      var w = d[p.name];
      if (!w) { issues.push(t.name+'/'+p.name+' MISSING'); return; }
      var cr = w.careerReview, ws = w.wcSpotlight;
      
      // Check: does CR end with a proper sentence-ending punctuation?
      var crEnd = cr.slice(-1);
      var properEnd = ['。','！','？','”','」',')','）','…'];
      if (!properEnd.includes(crEnd)) {
        issues.push(t.name+'|'+p.name+'|CR ends with "'+cr.slice(-6)+'" [cut]');
      }
      
      // Check: does WS end properly?
      var wsEnd = ws.slice(-1);
      if (!properEnd.includes(wsEnd)) {
        issues.push(t.name+'|'+p.name+'|WS ends with "'+ws.slice(-6)+'" [cut]');
      }
      
      // Also check: any obvious mid-sentence issues (starts mid-word)
    });
  });
});

console.log('Total truncation issues: ' + issues.length);
if (issues.length > 0) {
  // Group by team
  var byTeam = {};
  issues.forEach(function(i) {
    var parts = i.split('|');
    var team = parts[0];
    if (!byTeam[team]) byTeam[team] = [];
    byTeam[team].push(parts[1] + ': ' + parts[2]);
  });
  
  Object.keys(byTeam).sort().forEach(function(t) {
    console.log('--- ' + t + ' (' + byTeam[t].length + ') ---');
    byTeam[t].forEach(function(v) { console.log('  ' + v); });
  });
}
