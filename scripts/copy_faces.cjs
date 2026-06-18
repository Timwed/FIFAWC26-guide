const fs = require('fs');
const path = require('path');

const FACE_DIR = 'C:/baidunetdiskdownload/SI_cutout_megapack_2026.00/SI_cutout_megapack_2026.00/sortitoutsi/faces';
const OUT_DIR = path.join(__dirname, '../public/players');
const MATCHES_PATH = path.join(__dirname, 'fm-face-matches.json');

const matches = JSON.parse(fs.readFileSync(MATCHES_PATH, 'utf8'));
const withFace = matches.filter(m => m.hasFace);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let copied = 0;
let missing = 0;
for (const m of withFace) {
  const src = path.join(FACE_DIR, `${m.uid}.png`);
  const dst = path.join(OUT_DIR, `${m.uid}.png`);
  if (fs.existsSync(dst)) {
    copied++;
    continue;
  }
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    copied++;
  } else {
    missing++;
  }
}

console.log(`Copied: ${copied}, Source missing: ${missing}, Total matched with face: ${withFace.length}`);
