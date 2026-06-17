const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json','utf8'));
const names = [
  'Silvan Widmer','Nico Elvedi','Manuel Akanji','Denis Zakaria','Breel Embolo','Johan Manzambi',
  'Yvon Mvogo','Ricardo Rodriguez','Ardon Jashari','Christian Fassnacht','Rub\u00e9n Vargas',
  'Michel Aebischer','Fabian Rieder','Aur\u00e8le Amenda','Luca Jaquez','Cedric Itten',
  'Mahmud Abunada','Pedro Miguel','Lucas Mendes','Jassem Gaber','Ahmed Alaaeldin','Ayoub Al-Oui',
  'Yusuf Abdurisag','Boualem Khoukhi','Almoez Ali','Meshaal Barsham','Tahsin Jamshid','Mohamed Manai',
  'Amar Memi\u0107','Kerim Alajbegovi\u0107'
];
var failures = [];
names.forEach(function(n) {
  var p = d[n];
  if (!p) { failures.push('MISSING: '+n); return; }
  ['careerReview','wcSpotlight'].forEach(function(f) {
    var val = p[f];
    if (!val) { failures.push(n+' '+f+' is empty'); return; }
    var lastChar = val.slice(-1);
    if (!/[。！？]/.test(lastChar)) {
      failures.push(n+' '+f+' ends with ['+lastChar+'] | tail: '+val.slice(-30));
    }
  });
});
if (failures.length === 0) {
  console.log('ALL 30 players: 60 fields OK, all end with proper punctuation.');
} else {
  console.log('FAILURES ('+failures.length+'):');
  failures.forEach(function(f){console.log('  '+f)});
}
