const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const TEAMS = require('../src/data/teams.json');

const FLAGS_DIR = path.join(__dirname, '..', 'public', 'flags');
fs.mkdirSync(FLAGS_DIR, { recursive: true });

const CODE_MAP = {
  CZE: 'cz', MEX: 'mx', RSA: 'za', KOR: 'kr', BIH: 'ba', CAN: 'ca',
  QAT: 'qa', CHE: 'ch', BRA: 'br', HTI: 'ht', MAR: 'ma', SCT: 'gb-sct',
  AUS: 'au', PAR: 'py', TUR: 'tr', USA: 'us', CUW: 'cw', ECU: 'ec',
  DEU: 'de', CIV: 'ci', JPN: 'jp', NLD: 'nl', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz', CPV: 'cv', SAU: 'sa',
  ESP: 'es', URY: 'uy', FRA: 'fr', IRQ: 'iq', NOR: 'no', SEN: 'sn',
  DZA: 'dz', ARG: 'ar', AUT: 'at', JOR: 'jo', COL: 'co', COD: 'cd',
  PRT: 'pt', UZB: 'uz', HRV: 'hr', ENG: 'gb-eng', GHA: 'gh', PAN: 'pa'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        console.log(`  FAIL HTTP ${res.statusCode} for ${url}`);
        return resolve(false);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
      file.on('error', reject);
    }).on('error', (e) => {
      console.log(`  FAIL ${e.message}`);
      resolve(false);
    });
  });
}

(async () => {
  let success = 0;
  for (const team of TEAMS) {
    const code = CODE_MAP[team.shortName];
    if (!code) {
      console.log(`${team.shortName}: NO CODE MAPPING`);
      continue;
    }
    const url = `https://flagcdn.com/w320/${code}.png`;
    const dest = path.join(FLAGS_DIR, `${team.shortName}.png`);
    console.log(`${team.shortName} -> ${code} ...`);
    const ok = await download(url, dest);
    if (ok) success++;
    await new Promise(r => setTimeout(r, 50));
  }
  console.log(`\nDone: ${success}/${TEAMS.length} flags downloaded`);
})();
