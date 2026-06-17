const w = require('../src/data/players-wiki.json');
let d=0,f=0,t_r=0,u=0;
const dero = /灾难|击穿|幼儿|粉碎.*防线|噪声.*数据|遥不可及.*世界杯|跑道上/;
const fluff = /最伟大|封神|价值连城|大学课程|人生里程碑|人生资产|至高嘉奖|载入史册|史诗.*对决|全世界都相信|决定性的球员|终极舞台|最顶级.*实现/;
const pts = /\.{3,}|…/;
// Allow ？ ！ as valid Chinese sentence endings
const trunc = /[^。\n）)""''？！]/;
for (const k in w) {
  const a = (w[k].careerReview||'') + (w[k].wcSpotlight||'');
  if (dero.test(a)) { d++; console.log('DERO:',k,'->',a.match(dero)); }
  if (fluff.test(a)) { f++; console.log('FLUFF:',k,'->',a.match(fluff)); }
  if (pts.test(a)) { t_r++; console.log('DOTFILL:',k); }
  if ((w[k].wcSpotlight||'').length > 5 && trunc.test(w[k].wcSpotlight.slice(-1))) { u++; console.log('TRUNC:',k,'ends:',JSON.stringify(w[k].wcSpotlight.slice(-5))); }
}
let m26=0, short=0;
for (const k in w) {
  const a = (w[k].careerReview||'') + (w[k].wcSpotlight||'');
  if (!/2025-26|2025\/26|2025–26|2025—26|202526/.test(a)) m26++;
  if (a.length < 180) short++;
}
console.log('\n=== SUMMARY ===');
console.log('Derogatory:', d);
console.log('Fluff:', f);
console.log('Dot-fills:', t_r);
console.log('Truncated:', u);
console.log('Missing 25-26:', m26);
console.log('Under 180 chars:', short);
