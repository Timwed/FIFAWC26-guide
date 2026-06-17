const fs = require('fs');
const buf = fs.readFileSync('src/data/players-wiki.json');
const pos = 895;
for (let i = Math.max(0, pos - 10); i < Math.min(buf.length, pos + 20); i++) {
  const b = buf[i];
  const ch = b >= 32 && b < 127 ? String.fromCharCode(b) : '.';
  console.log(`byte ${i}: ${b.toString(16).padStart(2, '0')} (${ch})`);
}
