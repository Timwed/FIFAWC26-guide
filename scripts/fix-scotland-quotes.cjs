var fs = require('fs');
var s = fs.readFileSync('scripts/rewrite-scotland-bios.cjs', 'utf8');

// Find "X" patterns where:
// Opening " is followed immediately by Chinese text
// Closing " is followed immediately by a Chinese char
// This ensures we only match inner Chinese quotes, not JS string delimiters
s = s.replace(/"([\u4e00-\u9fff][^"]{1,60}[\u4e00-\u9fff])"([\u4e00-\u9fff])/g, '「$1」$2');

fs.writeFileSync('scripts/rewrite-scotland-bios.cjs', s, 'utf8');
console.log('Fixed inner Chinese quotes');

// Verify no syntax errors by trying to require the script's syntax
try {
  new Function(s);
  console.log('Syntax: OK');
} catch(e) {
  console.log('Syntax Error remains:', e.message.substring(0, 100));
}
