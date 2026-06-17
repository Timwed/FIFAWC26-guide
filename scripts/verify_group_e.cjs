const r = { A:{crMin:220,crMax:280,wsMin:160,wsMax:220}, B:{crMin:170,crMax:220,wsMin:130,wsMax:170}, C:{crMin:120,crMax:170,wsMin:120,wsMax:160} };

function verify(file, pt) {
  const d = require(file);
  let fails=[],pass=0,total=0;
  Object.entries(d).forEach(([n,b])=>{
    const t=pt[n]; total++;
    if(!t){fails.push(n+' MISSING');return}
    const {crMin,crMax,wsMin,wsMax}=r[t];
    const cr=b.careerReview.length, ws=b.wcSpotlight.length;
    const ok=cr>=crMin&&cr<=crMax&&ws>=wsMin&&ws<=wsMax;
    if(!ok)fails.push(n+' ['+t+'] CR='+cr+' ('+crMin+'-'+crMax+') WS='+ws+' ('+wsMin+'-'+wsMax+')');
    else pass++;
  });
  console.log(file+': '+pass+'/'+total+' PASS');
  if(fails.length){console.log('FAILURES:');fails.forEach(f=>console.log('  '+f));}
  return {pass,total,fails};
}

const cC = {
  'Eloy Room':'B','Juriën Gaari':'B','Roshon van Eijma':'B','Godfried Roemeratoe':'B','Leandro Bacuna':'B','Armando Obispo':'A',
  'Shurandy Sambo':'C','Sherel Floranus':'C','Juninho Bacuna':'C','Livano Comenencia':'C','Jürgen Locadia':'C','Jeremy Antonisse':'C','Sontje Hansen':'C','Tyrese Noslin':'C','Kenji Gorré':'C',"Ar'jany Martha":'C','Jearl Margaritha':'C','Brandley Kuwas':'C','Gervane Kastaneer':'C','Joshua Brenet':'C','Tahith Chong':'C','Kevin Felida':'C','Riechedly Bazoer':'C','Deveron Fonville':'C','Tyrick Bodak':'C','Trevor Doornbusch':'C'
};
verify('./group_e_curacao.json', cC);

const cE = {
  'Piero Hincapié':'A','Willian Pacho':'A','Pervis Estupiñán':'A','Gonzalo Plata':'A','Moisés Caicedo':'A',
  'Félix Torres':'B','Joel Ordóñez':'B','John Yeboah':'B','Kendry Páez':'B','Kevin Rodríguez':'B','Enner Valencia':'B','Ángelo Preciado':'B','Nilson Angulo':'B','Alan Franco':'B','Jeremy Arévalo':'B',
  'Hernán Galíndez':'C','Jordy Alcívar':'C','Anthony Valencia':'C','Moisés Ramírez':'C','Alan Minda':'C','Pedro Vite':'C','Jordy Caicedo':'C','Denil Castillo':'C','Gonzalo Valle':'C','Jackson Porozo':'C','Yaimar Medina':'C'
};
verify('./group_e_ecuador.json', cE);

const cCI = {
  'Franck Kessié':'A','Amad Diallo':'A','Nicolas Pépé':'A',
  'Ousmane Diomande':'B','Jean Michaël Seri':'B','Wilfried Singo':'B','Seko Fofana':'B','Odilon Kossounou':'B','Ange-Yoan Bonny':'B','Simon Adingra':'B','Ibrahim Sangaré':'B',
  'Yahia Fofana':'C','Ghislain Konan':'C','Yan Diomande':'C','Elye Wahi':'C','Christopher Opéri':'C','Oumar Diakité':'C','Mohamed Koné':'C','Guéla Doué':'C','Emmanuel Agbadou':'C','Evan Ndicka':'C','Evann Guessand':'C','Alban Lafont':'C','Bazoumana Touré':'C','Parfait Guiagon':'C','Christ Inao Oulaï':'C'
};
verify('./group_e_ivorycoast.json', cCI);
