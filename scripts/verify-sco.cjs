const fs = require('fs');
const d = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));

const scotland = [
  'Angus Gunn','Aaron Hickey','Andy Robertson','Scott McTominay','Grant Hanley',
  'Kieran Tierney','John McGinn','Tyler Fletcher','Lyndon Dykes','Ché Adams',
  'Ryan Christie','Liam Kelly','Jack Hendry','Ross Stewart','John Souttar',
  'Dominic Hyam','Ben Gannon-Doak','George Hirst','Lewis Ferguson','Lawrence Shankland',
  'Craig Gordon','Nathan Patterson','Kenny McLean','Anthony Ralston','Findlay Curtis',
  'Scott McKenna'
];

let issues = [];
scotland.forEach(name => {
  const p = d[name];
  if (!p) { issues.push('MISSING: ' + name); return; }
  ['careerReview','wcSpotlight'].forEach(f => {
    const text = p[f] || '';
    const lastChar = text[text.length-1];
    if (!'。！？'.includes(lastChar)) {
      issues.push(name + ' ' + f + ' ends with "' + lastChar + '" ...' + text.slice(-40));
    }
  });
});

if (issues.length === 0) {
  console.log('ALL 52 FIELDS PASS — every field ends with proper punctuation.');
} else {
  console.log('ISSUES: ' + issues.length);
  issues.forEach(i => console.log('  ' + i));
}
