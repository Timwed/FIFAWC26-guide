const fs = require('fs');
const r = { A:{crMin:220,crMax:280,wsMin:160,wsMax:220}, B:{crMin:170,crMax:220,wsMin:130,wsMax:170}, C:{crMin:120,crMax:170,wsMin:120,wsMax:160} };

const teams = {
  './scripts/group_f_japan.json': {
    'Takefusa Kubo':'A','Ritsu Dōan':'A','Hiroki Itō':'A',
    'Kō Itakura':'B','Yūto Nagatomo':'B','Shuto Machino':'B','Daizen Maeda':'B','Junya Itō':'B','Daichi Kamada':'B','Ayase Ueda':'B','Takehiro Tomiyasu':'B',
    'Zion Suzuki':'C','Yukinari Sugawara':'C','Shōgo Taniguchi':'C','Ao Tanaka':'C','Keisuke Gotō':'C','Keisuke Ōsako':'C','Keito Nakamura':'C','Tsuyoshi Watanabe':'C','Yuito Suzuki':'C','Kōki Ogawa':'C','Ayumu Seko':'C','Tomoki Hayakawa':'C','Kaishū Sano':'C','Junnosuke Suzuki':'C','Kento Shiogai':'C'
  },
  './scripts/group_f_sweden.json': {
    'Victor Lindelöf':'A','Isak Hien':'A','Lucas Bergvall':'A','Alexander Isak':'A','Viktor Gyökeres':'A',
    'Gustaf Lagerbielke':'B','Gabriel Gudmundsson':'B','Daniel Svensson':'B','Benjamin Nygren':'B','Anthony Elanga':'B','Hjalmar Ekdal':'B','Carl Starfelt':'B','Jesper Karlström':'B','Yasin Ayari':'B','Gustaf Nilsson':'B',
    'Jacob Widell Zetterström':'C','Herman Johansson':'C','Viktor Johansson':'C','Ken Sema':'C','Mattias Svanberg':'C','Eric Smith':'C','Alexander Bernhardsson':'C','Besfort Zeneli':'C','Kristoffer Nordfeldt':'C','Elliot Stroud':'C','Taha Ali':'C'
  },
  './scripts/group_f_tunisia.json': {
    'Ali Abdi':'A','Khalil Ayari':'A','Ellyes Skhiri':'A',
    'Montassar Talbi':'B','Dylan Bronn':'B','Elias Achouri':'B','Elias Saad':'B','Hannibal Mejbri':'B','Rani Khedira':'B','Anis Ben Slimane':'B','Sebastian Tounekti':'B',
    'Mouhib Chamakh':'C','Omar Rekik':'C','Adem Arous':'C','Hazem Mastouri':'C','Ismaël Gharbi':'C','Mortadha Ben Ouanes':'C','Hadj Mahmoud':'C','Aymen Dahmen':'C','Rayan Elloumi':'C','Firas Chaouat':'C','Yan Valery':'C','Mohamed Amine Ben Hamida':'C','Sabri Ben Hessen':'C','Moutaz Neffati':'C','Raed Chikhaoui':'C'
  }
};

Object.entries(teams).forEach(([file, tiers]) => {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  let pass = 0, fails = [];
  Object.entries(tiers).forEach(([n, ti]) => {
    const b = d[n];
    if (!b) { fails.push(n + ' MISSING'); return; }
    const rr = r[ti];
    const cr = b.careerReview.length, ws = b.wcSpotlight.length;
    const ok = cr >= rr.crMin && cr <= rr.crMax && ws >= rr.wsMin && ws <= rr.wsMax;
    if (!ok) fails.push(n + ' [' + ti + '] CR=' + cr + ' (' + rr.crMin + '-' + rr.crMax + ') WS=' + ws + ' (' + rr.wsMin + '-' + rr.wsMax + ')');
    else pass++;
  });
  console.log(file + ': ' + pass + '/' + Object.keys(tiers).length + ' PASS');
  if (fails.length) { console.log('  FAILURES:'); fails.forEach(f => console.log('    ' + f)); }
});
