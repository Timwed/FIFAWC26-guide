const fs = require('fs');
let buf = fs.readFileSync('src/data/players-wiki.json');

const pattern = Buffer.from([0xE2, 0x80, 0x93, 0x2C]);  // em-dash + comma
const byteToInsert = 0x22;  // quote

let pos = 0;
let count = 0;
while ((pos = buf.indexOf(pattern, pos)) !== -1) {
  // Insert " before the comma (after the em-dash)
  const before = buf.slice(0, pos + 3);
  const after = buf.slice(pos + 3); // includes the comma
  buf = Buffer.concat([before, Buffer.from([byteToInsert]), after]);
  pos += 5; // skip past the inserted byte
  count++;
}

fs.writeFileSync('src/data/players-wiki.json', buf);
try {
  JSON.parse(buf.toString('utf8'));
  console.log('VALID, fixed', count, 'occurrences');
} catch(e) {
  console.log('Still invalid:', e.message);
}
