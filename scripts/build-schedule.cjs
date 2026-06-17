const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const venueMap = {
  'MetLife Stadium': 'metlife',
  'AT&T Stadium': 'att',
  'SoFi Stadium': 'sofi',
  'Mercedes-Benz Stadium': 'mercedesbenz',
  'Gillette Stadium': 'gillette',
  "Levi's Stadium": 'levis',
  'Hard Rock Stadium': 'hardrock',
  'Lumen Field': 'lumen',
  'BC Place': 'bcplace',
  'BMO Field': 'bmofield',
  'Lincoln Financial Field': 'lincoln',
  'GEHA Field at Arrowhead Stadium': 'arrowhead',
  'Estadio Azteca': 'azteca',
  'Estadio BBVA': 'bbva',
  'Estadio Akron': 'akron',
  'NRG Stadium': 'nrg',
  'Reliant Stadium': 'nrg',
};

async function main() {
  const all = [];
  for (let r = 1; r <= 10; r++) {
    try {
      const d = await fetch(`https://www.thesportsdb.com/api/v1/json/123/eventsround.php?id=4429&r=${r}&s=2026`);
      if (d.events && d.events.length) {
        all.push(...d.events);
        console.log(`Round ${r}: ${d.events.length} matches`);
      } else {
        break;
      }
    } catch (e) {
      console.log(`Round ${r}: fail - ${e.message}`);
      break;
    }
  }
  console.log(`Total: ${all.length} matches`);

  const matches = all.map(e => ({
    idEvent: e.idEvent,
    strHomeTeam: e.strHomeTeam,
    strAwayTeam: e.strAwayTeam,
    intHomeScore: e.intHomeScore,
    intAwayScore: e.intAwayScore,
    strStatus: e.strStatus,
    strVenue: e.strVenue,
    strGroup: e.strGroup,
    dateEvent: e.dateEvent,
    strTime: e.strTime,
    strTimeLocal: e.strTimeLocal,
  }));

  matches.sort((a, b) => (a.dateEvent + a.strTime).localeCompare(b.dateEvent + b.strTime));

  const out = {};
  for (const m of matches) {
    const vid = venueMap[m.strVenue];
    if (vid) {
      if (!out[vid]) out[vid] = [];
      out[vid].push(m);
    } else {
      console.log('UNMAPPED:', m.strVenue);
    }
  }

  console.log('\nVenue breakdown:');
  for (const [vid, list] of Object.entries(out)) {
    console.log(`  ${vid}: ${list.length} matches`);
  }

  fs.writeFileSync('src/data/venue-schedule.json', JSON.stringify(out, null, 2), 'utf8');
  console.log(`\nSaved to src/data/venue-schedule.json`);
}

main().catch(console.error);
