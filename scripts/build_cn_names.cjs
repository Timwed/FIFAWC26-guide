const fs = require('fs');

// ─── Diacritic cleanup (MUST run before syllable split) ───
function cleanDiacritics(str) {
  const map = {
    'á':'a','à':'a','â':'a','ã':'a','ä':'a','å':'a','ā':'a','ą':'a','ă':'a',
    'ć':'ch','ĉ':'ch','ċ':'c','č':'ch','ç':'c',
    'ď':'d','đ':'dj','ð':'d',
    'é':'e','è':'e','ê':'e','ë':'e','ē':'e','ę':'e','ě':'e','ė':'e',
    'ğ':'g','ģ':'g',
    'ħ':'h',
    'ı':'i','í':'i','ì':'i','î':'i','ï':'i','ī':'i','į':'i',
    'ĵ':'j',
    'ķ':'k',
    'ĺ':'l','ł':'l','ľ':'l','ļ':'l','ŀ':'l',
    'ń':'n','ň':'n','ņ':'n','ñ':'ny','ǹ':'n','ǵ':'g',
    'ó':'o','ò':'o','ô':'o','õ':'o','ö':'oe','ő':'oe','ø':'oe','ō':'o',
    'ŕ':'r','ř':'r','ȑ':'r',
    'ś':'sh','ŝ':'s','ş':'sh','š':'sh','ș':'sh',
    'ţ':'ts','ť':'t','ț':'ts','þ':'th',
    'ú':'u','ù':'u','û':'u','ü':'ue','ű':'ue','ū':'u','ų':'u','ů':'u',
    'ý':'y','ÿ':'y','ỳ':'y',
    'ź':'z','ż':'z','ž':'zh',
    'œ':'oe','æ':'ae','ß':'ss'
  };
  return str.toLowerCase().split('').map(c => map[c] || c).join('');
}

// ─── Vowel-first syllable split (maximize onset) ───
function syllabify(word) {
  if (!word) return [word];
  const V = new Set(['a','e','i','o','u','y']);
  const vPos = [];
  for (let i = 0; i < word.length; i++) if (V.has(word[i])) vPos.push(i);
  if (vPos.length === 0) return [word];
  
  const syllables = [];
  let start = 0;
  for (let vi = 0; vi < vPos.length; vi++) {
    const curV = vPos[vi];
    const isLast = vi === vPos.length - 1;
    if (isLast) {
      syllables.push(word.substring(start));
    } else {
      const nextV = vPos[vi + 1];
      // ALL consonants between curV and nextV go to next syllable (maximize onset)
      // curV position counts from start of word, end at curV+1 (right after vowel)
      syllables.push(word.substring(start, curV + 1));
      start = curV + 1;
    }
  }
  return syllables;
}

// ─── Syllable mapping ───
const syl = {
  // Vowel-only
  a:'阿', e:'埃', i:'伊', o:'奥', u:'乌', y:'伊',
  // BA series
  ba:'巴', bai:'拜', ban:'班', bang:'邦', bao:'鲍', bar:'巴', bau:'鲍', bay:'贝',
  be:'贝', bei:'贝', ben:'本', ber:'伯', bel:'贝尔', beck:'贝克', berg:'贝格',
  bi:'比', bian:'比安', bin:'宾', bir:'比尔', bit:'比特',
  bla:'布拉', ble:'布勒', bli:'布利', blo:'布洛', blu:'布卢',
  bo:'博', bon:'邦', bor:'博尔', bos:'博斯', bou:'布', boy:'博伊', bol:'博尔',
  bra:'布拉', bre:'布雷', bri:'布里', bro:'布罗', bru:'布鲁',
  bu:'布', bul:'布尔', bur:'伯', bus:'布斯', but:'巴特',
  // CA series
  ca:'卡', cai:'凯', cal:'卡尔', cam:'卡姆', can:'坎', cap:'卡普', car:'卡尔', cas:'卡斯',
  ce:'塞', cel:'塞尔', cen:'森', cer:'塞尔', ces:'塞斯', cea:'塞',
  cha:'查', chai:'柴', chal:'沙尔', cham:'查姆', chan:'钱', char:'查尔', chat:'查特', chau:'乔',
  che:'切', chen:'琴', cher:'谢', ches:'切斯',
  chi:'基', chil:'奇尔', chin:'钦', chir:'基尔',
  cho:'乔', chol:'乔尔', chon:'琼', chor:'乔尔',
  chu:'丘', chun:'琼',
  ci:'西', cir:'西尔',
  cla:'克拉', cle:'克莱', cli:'克利', clo:'克洛', clu:'克卢',
  co:'科', col:'科尔', com:'科姆', con:'孔', cor:'科尔', cos:'科斯', cou:'库',
  cra:'克拉', cre:'克雷', cri:'克里', cro:'克罗', cru:'克鲁',
  cu:'库', cul:'库尔', cur:'库尔',
  cy:'西',
  // DA series
  da:'达', dai:'戴', dal:'达尔', dam:'达姆', dan:'丹', dar:'达尔', das:'达斯', dau:'道',
  de:'德', del:'德尔', dem:'德姆', den:'登', der:'德尔', des:'德斯',
  di:'迪', dia:'迪亚', din:'丁', dir:'迪尔', die:'迪耶', dio:'迪奥',
  do:'多', dol:'多尔', dom:'多姆', don:'唐', dor:'多尔', dos:'多斯', dou:'杜',
  dra:'德拉', dre:'德雷', dri:'德里', dro:'德罗', dru:'德鲁',
  du:'杜', dul:'杜尔', dun:'邓', dur:'杜尔',
  // E series
  ea:'埃', eb:'埃布', ec:'埃克', ed:'埃德', ef:'埃夫', eg:'埃格', ek:'埃克',
  el:'埃尔', em:'埃姆', en:'恩', ep:'埃普', er:'尔', es:'埃斯',
  et:'埃特', ev:'埃夫', ew:'尤', ex:'埃克斯', ey:'埃',
  // FA series
  fa:'法', fan:'凡', far:'法尔', fas:'法斯', fau:'福',
  fe:'费', fel:'费尔', fen:'芬', fer:'费尔',
  fi:'菲', fin:'芬', fir:'菲尔',
  fla:'弗拉', fle:'弗莱', fli:'弗利', flo:'弗洛', flu:'弗卢',
  fo:'福', fol:'福尔', fon:'丰', for:'福尔', fou:'富',
  fra:'弗拉', fre:'弗雷', fri:'弗里', fro:'弗罗', fru:'弗鲁',
  fu:'富', ful:'富尔', fur:'富尔',
  // GA series
  ga:'加', gal:'加尔', gam:'加姆', gan:'甘', gar:'加尔', gas:'加斯',
  ge:'赫', gel:'赫尔', gen:'亨', geo:'乔', ger:'赫尔',
  gi:'吉', gia:'贾', gil:'吉尔', gio:'吉奥', gir:'吉尔',
  gla:'格拉', gle:'格莱', gli:'格利', glo:'格洛', glu:'格卢',
  go:'戈', gol:'戈尔', gon:'贡', gor:'戈尔', gos:'戈斯', gou:'古',
  gra:'格拉', gre:'格雷', gri:'格里', gro:'格罗', gru:'格鲁',
  gu:'古', gue:'格', gui:'吉', gul:'古尔', gus:'古斯', gut:'古特',
  // HA series
  ha:'哈', hai:'海', hal:'哈尔', ham:'哈姆', han:'汉', har:'哈尔', has:'哈斯', hat:'哈特', hau:'豪',
  he:'赫', hei:'黑', hel:'赫尔', hen:'亨', her:'赫尔', hes:'赫斯',
  hi:'希', hil:'希尔', hin:'欣', hir:'希尔',
  ho:'霍', hol:'霍尔', hon:'洪', hor:'霍尔', hos:'霍斯', hou:'胡',
  hu:'胡', hui:'惠', hun:'洪', hur:'赫尔',
  hy:'希',
  // I series
  ib:'伊布', ic:'伊克', ich:'伊奇', id:'伊德', ig:'伊格', ik:'伊克', il:'伊尔',
  im:'伊姆', in:'因', io:'约', ir:'伊尔', is:'伊斯', it:'伊特', iv:'伊夫', iz:'伊兹',
  // JA series
  ja:'雅', jac:'雅克', jai:'雅伊', jal:'亚尔', jam:'贾姆', jan:'扬', jar:'亚尔', jas:'亚斯',
  je:'杰', jea:'热', jel:'耶尔', jen:'延', jer:'耶尔',
  ji:'伊', jia:'贾',
  jo:'乔', joh:'约翰', jol:'乔尔', jon:'琼', jor:'若尔', jos:'若斯', jou:'茹',
  ju:'朱', jua:'胡', jul:'朱尔', jun:'容', jur:'尤尔', jus:'尤斯',
  // KA series
  ka:'卡', kai:'凯', kal:'卡尔', kam:'卡姆', kan:'坎', kar:'卡尔', kas:'卡斯', kat:'卡特', kau:'考',
  ke:'凯', kel:'凯尔', kem:'凯姆', ken:'肯', ker:'克', ket:'凯特',
  ki:'基', kil:'基尔', kim:'金', kin:'金', kir:'基尔', kit:'基特',
  kla:'克拉', kle:'克莱', kli:'克利', klo:'克洛', klu:'克卢',
  ko:'科', kol:'科尔', kom:'科姆', kon:'孔', kor:'科尔', kos:'科斯', kot:'科特', kou:'库', kov:'科夫',
  kra:'克拉', kre:'克雷', kri:'克里', kro:'克罗', kru:'克鲁',
  ku:'库', kul:'库尔', kun:'昆', kur:'库尔', kus:'库斯', kut:'库特',
  ky:'基',
  // LA series
  la:'拉', lac:'拉克', lad:'拉德', laf:'拉夫', lai:'莱', lal:'拉尔', lam:'兰', lan:'兰',
  lao:'劳', lar:'拉尔', las:'拉斯', lat:'拉特', lau:'劳', lav:'拉夫',
  le:'莱', leb:'莱布', lec:'莱克', led:'莱德', leg:'莱格', leh:'莱', lei:'莱',
  lek:'莱克', lem:'莱姆', len:'伦', leo:'莱奥', ler:'勒', les:'莱斯', let:'莱特',
  lev:'列夫', lew:'卢', ley:'利',
  li:'利', lia:'利亚', lib:'利布', lic:'利奇', lid:'利德', lie:'利耶', lik:'利克',
  lim:'利姆', lin:'林', lio:'利奥', lis:'利斯', lit:'利特', liv:'利夫',
  lla:'利亚', lle:'耶', lli:'利', llo:'略', llu:'柳',
  lo:'洛', loc:'洛克', lod:'洛德', lof:'洛夫', lok:'洛克', lol:'洛尔', lom:'洛姆',
  lon:'隆', lop:'洛普', lor:'洛尔', los:'洛斯', lot:'洛特', lou:'卢', lov:'洛夫', loz:'洛兹',
  lu:'卢', luc:'卢克', lud:'卢德', luis:'路易斯', luk:'卢克', lum:'卢姆',
  lun:'伦', lur:'卢尔', lus:'卢斯', lut:'卢特',
  ly:'利', lyn:'林',
  // MA series
  ma:'马', mac:'马克', mad:'马德', mag:'马格', mah:'马赫', mai:'迈', mak:'马克',
  mal:'马尔', mam:'马姆', man:'曼', mar:'马尔', mas:'马斯', mat:'马特', mau:'莫', may:'梅',
  mba:'姆巴', mbe:'姆贝', mbo:'姆博', mbu:'姆布',
  me:'梅', med:'梅德', meg:'梅格', mei:'梅', mek:'梅克', mel:'梅尔', men:'门',
  mer:'梅尔', mes:'梅斯', met:'梅特',
  mi:'米', mia:'米亚', mic:'米奇', mie:'米耶', mig:'米格', mik:'米克',
  mil:'米尔', min:'明', mio:'米奥', mir:'米尔', mis:'米斯', mit:'米特',
  mo:'莫', mod:'莫德', mog:'莫格', moh:'莫赫', moi:'穆瓦', mok:'莫克',
  mol:'莫尔', mom:'莫姆', mon:'蒙', mor:'莫尔', mos:'莫斯', mot:'莫特', mou:'穆',
  mu:'穆', muh:'穆赫', muk:'穆克', mul:'穆尔', mun:'蒙', mur:'穆尔',
  mus:'穆斯', mut:'穆特', muz:'穆兹',
  my:'米',
  // NA series
  na:'纳', nad:'纳德', nai:'奈', nal:'纳尔', nam:'南', nan:'南',
  nar:'纳尔', nas:'纳斯', nat:'纳特', nau:'瑙',
  nda:'恩达', nde:'恩德', ndi:'恩迪', ndo:'恩多', ndu:'恩杜',
  ne:'内', nec:'内克', ned:'内德', nei:'内', nel:'内尔', nem:'内姆',
  ner:'内尔', nes:'内斯', net:'内特', neu:'诺伊', nev:'内夫', new:'纽', ney:'内',
  nga:'恩加', nge:'恩格', ngi:'恩吉', ngo:'恩戈', ngu:'恩古',
  ni:'尼', nia:'尼亚', nic:'尼奇', nie:'涅', nik:'尼克', nil:'尼尔',
  nim:'尼姆', nin:'宁', nio:'尼奥', nir:'尼尔', nis:'尼斯', nit:'尼特',
  no:'诺', noc:'诺克', nod:'诺德', noe:'诺埃', nog:'诺格', nol:'诺尔',
  nom:'诺姆', non:'农', nor:'诺尔', nos:'诺斯', not:'诺特', nou:'努', nov:'诺夫',
  nte:'恩特',
  nu:'努', nun:'农', nur:'努尔',
  ny:'尼',
  // O series
  oa:'奥', ob:'奥布', oc:'奥克', od:'奥德', oe:'厄', of:'奥夫', og:'奥格',
  oi:'瓦', oir:'瓦尔', ois:'瓦',
  oj:'奥伊', ok:'奥克', ol:'奥尔', om:'奥姆', on:'翁', oo:'乌',
  op:'奥普', or:'奥尔', os:'奥斯', ot:'奥特', ou:'乌', ov:'奥夫', ow:'奥', oy:'奥伊', oz:'奥兹',
  // PA series
  pa:'帕', pac:'帕克', pad:'帕德', pag:'帕格', pai:'派', pak:'帕克', pal:'帕尔',
  pam:'帕姆', pan:'潘', par:'帕尔', pas:'帕斯', pat:'帕特', pau:'保', pav:'帕夫',
  pe:'佩', ped:'佩德', pek:'佩克', pel:'佩尔', pen:'彭', per:'佩尔',
  pes:'佩斯', pet:'佩特',
  phi:'菲', pho:'福',
  pi:'皮', pic:'皮奇', pie:'皮耶', pik:'皮克', pil:'皮尔', pin:'平',
  pir:'皮尔', pis:'皮斯', pit:'皮特',
  pla:'普拉', ple:'普莱', pli:'普利', plo:'普洛', plu:'普卢',
  po:'波', pod:'波德', pol:'波尔', pon:'蓬', por:'波尔', pos:'波斯', pot:'波特', pou:'普',
  pra:'普拉', pre:'普雷', pri:'普里', pro:'普罗', pru:'普鲁',
  pu:'普', pul:'普尔', pur:'普尔', pus:'普斯', put:'普特',
  // QU series
  qua:'夸', que:'克', qui:'基', quo:'科',
  // RA series
  ra:'拉', rab:'拉布', rac:'拉克', rad:'拉德', rag:'拉格', rah:'拉赫', rai:'雷',
  raj:'拉伊', rak:'拉克', ral:'拉尔', ram:'拉姆', ran:'兰', rao:'劳',
  rap:'拉普', rar:'拉尔', ras:'拉斯', rat:'拉特', rau:'劳', rav:'拉夫', ray:'雷',
  re:'雷', reb:'雷布', rec:'雷克', red:'雷德', ree:'里', reg:'雷格', rei:'雷',
  rek:'雷克', rel:'雷尔', rem:'雷姆', ren:'伦', rep:'雷普', rer:'雷尔',
  res:'雷斯', ret:'雷特', reu:'罗伊', rev:'雷夫', rey:'雷',
  ri:'里', ria:'里亚', ric:'里克', rid:'里德', rie:'里', rig:'里格', rik:'里克',
  ril:'里尔', rim:'里姆', rin:'林', rio:'里奥', rip:'里普', rir:'里尔',
  ris:'里斯', rit:'里特', riv:'里夫', riz:'里兹',
  ro:'罗', rob:'罗布', roc:'罗奇', rod:'罗德', rog:'罗格', rol:'罗尔',
  rom:'罗姆', ron:'龙', rop:'罗普', ror:'罗尔', ros:'罗斯', rot:'罗特',
  rou:'鲁', rov:'罗夫', row:'罗', roy:'鲁瓦', roz:'罗兹',
  ru:'鲁', rub:'鲁布', rud:'鲁德', rue:'鲁埃', rui:'鲁伊', ruk:'鲁克',
  rul:'鲁尔', rum:'鲁姆', run:'伦', rup:'鲁普', rus:'鲁斯', rut:'鲁特',
  ry:'里', rya:'里亚', ryu:'柳',
  // SA series
  sa:'萨', sac:'萨克', sad:'萨德', saf:'萨夫', sag:'萨格', sah:'萨赫', sai:'塞',
  sak:'萨克', sal:'萨尔', sam:'萨姆', san:'桑', sar:'萨尔', sas:'萨斯',
  sat:'萨特', sau:'索', sav:'萨夫', say:'塞',
  sca:'斯卡', sce:'谢', sch:'施', sco:'斯科', scu:'斯库',
  se:'塞', sec:'塞克', sed:'塞德', seg:'塞格', sei:'塞', sek:'塞克',
  sel:'塞尔', sem:'塞姆', sen:'森', sep:'塞普', ser:'塞尔',
  ses:'塞斯', set:'塞特', seu:'瑟', sev:'塞夫',
  sha:'沙', shak:'沙克', shal:'沙尔', sham:'沙姆', shan:'尚', shar:'沙尔',
  shaw:'肖', she:'谢', shen:'申', sher:'谢尔',
  shi:'希', shil:'希尔', shin:'欣', shir:'希尔',
  sho:'肖', shor:'肖尔', shou:'舒', shu:'舒',
  si:'西', sic:'西奇', sid:'西德', sie:'西', sig:'西格', sik:'西克',
  sil:'西尔', sim:'西姆', sin:'辛', sio:'西奥', sir:'瑟',
  sis:'西斯', sit:'西特',
  ska:'斯卡', ske:'斯克', ski:'斯基', sko:'斯科', sku:'斯库',
  sla:'斯拉', sle:'斯莱', sli:'斯利', slo:'斯洛', slu:'斯卢',
  sma:'斯马', sme:'斯梅', smi:'斯米', smo:'斯莫', smu:'斯穆',
  sna:'斯纳', sne:'斯内', sni:'斯尼', sno:'斯诺', snu:'斯努',
  so:'索', sob:'索布', sod:'索德', sof:'索夫', sol:'索尔', som:'索姆',
  son:'松', sor:'索尔', sos:'索斯', sot:'索特', sou:'苏', sov:'索夫',
  spa:'斯帕', spe:'斯佩', spi:'斯皮', spo:'斯波', spu:'斯普',
  sta:'斯塔', ste:'斯特', sti:'斯蒂', sto:'斯托', stu:'斯图',
  su:'苏', sub:'苏布', suc:'苏克', sud:'苏德', sui:'隋', suk:'苏克',
  sul:'苏尔', sum:'苏姆', sun:'孙', sup:'苏普', sur:'苏尔',
  sus:'苏斯', sut:'苏特',
  swe:'斯威', swi:'斯威',
  sy:'西',
  // TA series
  ta:'塔', tab:'塔布', tac:'塔克', tad:'塔德', taf:'塔夫', tah:'塔赫',
  tai:'泰', tak:'塔克', tal:'塔尔', tam:'塔姆', tan:'坦', tao:'陶',
  tar:'塔尔', tas:'塔斯', tat:'塔特', tau:'陶', tay:'泰',
  te:'特', tec:'特克', ted:'特德', tek:'特克', tel:'特尔', tem:'特姆',
  ten:'滕', ter:'特尔', tes:'特斯', tet:'泰特',
  tha:'塔', the:'特', thi:'蒂', tho:'托', thu:'图', thä:'塔',
  ti:'蒂', tia:'蒂亚', tic:'蒂克', tid:'蒂德', tie:'蒂耶', tik:'蒂克',
  til:'蒂尔', tim:'蒂姆', tin:'廷', tio:'蒂奥', tir:'蒂尔', tis:'蒂斯', tit:'蒂特',
  to:'托', tob:'托布', tod:'托德', toe:'托埃', tok:'托克', tol:'托尔',
  tom:'托姆', ton:'顿', top:'托普', tor:'托尔', tos:'托斯', tot:'托特',
  tou:'图', tov:'托夫', tow:'托',
  tra:'特拉', tre:'特雷', tri:'特里', tro:'特罗', tru:'特鲁',
  tsa:'察', tse:'采', tsi:'齐', tso:'措', tsu:'楚',
  tu:'图', tuc:'图克', tug:'图格', tul:'图尔', tum:'图姆',
  tun:'通', tur:'图尔', tus:'图斯', tut:'图特',
  ty:'蒂',
  // U series
  ua:'瓦', ub:'乌布', uc:'乌克', ud:'乌德', ue:'乌埃', ug:'乌格', uk:'乌克',
  ul:'乌尔', um:'乌姆', un:'温', ur:'乌尔', us:'乌斯', ut:'乌特', uz:'乌兹',
  // VA series
  va:'瓦', vac:'瓦克', vad:'瓦德', vag:'瓦格', vah:'瓦赫', vai:'瓦伊',
  val:'瓦尔', van:'范', var:'瓦尔', vas:'瓦斯', vat:'瓦特', vau:'沃',
  ve:'韦', vec:'韦克', ved:'韦德', veg:'韦格', vei:'韦', vel:'韦尔',
  ven:'文', ver:'韦尔', ves:'韦斯', vet:'韦特',
  vi:'维', via:'维亚', vic:'维奇', vid:'维德', vie:'维耶', vig:'维格',
  vik:'维克', vil:'维尔', vin:'文', vir:'维尔', vis:'维斯', vit:'维特',
  vla:'弗拉', vli:'弗利', vlo:'弗洛',
  vo:'沃', vod:'沃德', voi:'沃伊', vol:'沃尔', von:'冯', vor:'沃尔',
  vos:'沃斯', vot:'沃特', vou:'武', vov:'沃夫',
  vra:'弗拉', vre:'弗雷', vri:'弗里', vro:'弗罗',
  vu:'武', vuk:'武克', vul:'武尔', vus:'武斯',
  vy:'维',
  // WA series
  wa:'瓦', wac:'瓦克', wad:'瓦德', wak:'瓦克', wal:'瓦尔', wan:'万',
  war:'瓦尔', was:'瓦斯', wat:'瓦特', way:'韦',
  we:'韦', web:'韦布', weg:'韦格', wei:'韦', wel:'韦尔', wen:'文',
  wer:'韦尔', wes:'韦斯', wey:'韦',
  whi:'惠',
  wi:'维', wic:'威克', wid:'维德', wik:'维克', wil:'威尔', win:'温',
  wir:'维尔', wis:'维斯', wit:'威特',
  wo:'沃', wol:'沃尔', won:'翁', woo:'伍', wor:'沃尔',
  wri:'赖',
  wu:'武',
  wy:'怀',
  // X series
  xa:'萨', xe:'塞', xi:'西',
  // YA series
  ya:'亚', yac:'亚克', yad:'亚德', yah:'亚赫', yak:'雅克', yal:'亚尔',
  yam:'亚姆', yan:'扬', yar:'亚尔', yas:'亚斯', yat:'亚特',
  ye:'耶', yec:'耶克', yed:'耶德', yeh:'耶', yel:'耶尔', yen:'延',
  yer:'耶尔', yes:'耶斯', yet:'耶特',
  yi:'伊', yig:'伊格', yil:'伊尔', yin:'因', yir:'伊尔', yis:'伊斯',
  yo:'约', yok:'约克', yol:'约尔', yon:'永', yor:'约尔', yos:'约斯', you:'尤', yov:'约夫',
  yu:'尤', yuk:'尤克', yul:'尤尔', yun:'云', yur:'尤尔', yus:'尤斯',
  // ZA series
  za:'扎', zai:'扎伊', zak:'扎克', zal:'扎尔', zam:'扎姆', zan:'赞',
  zar:'扎尔', zas:'扎斯', zat:'扎特',
  ze:'泽', zec:'泽克', zed:'泽德', zek:'泽克', zel:'泽尔', zen:'曾',
  zer:'泽尔', zes:'泽斯', zet:'泽特',
  zi:'齐', zig:'齐格', zik:'齐克', zim:'齐姆', zin:'津', zir:'齐尔',
  zo:'佐', zol:'佐尔', zon:'宗', zor:'佐尔', zou:'祖',
  zu:'祖', zuk:'祖克', zul:'祖尔', zum:'祖姆', zur:'祖尔', zus:'祖斯',
  // Special endings
  son:'松', sen:'森', ton:'顿', ten:'滕', den:'登',
  berg:'贝里', burg:'堡',
  man:'曼', mann:'曼',
  aert:'阿尔特', aard:'阿尔德',
  stein:'斯坦', stine:'斯坦',
  land:'兰',
  wood:'伍德', field:'菲尔德',
  ford:'福德', more:'莫尔',
  well:'韦尔', wick:'威克',
  worth:'沃思',
  ville:'维尔',
  ham:'姆', shire:'希尔',
  gaard:'高', guard:'加德',
  // Common ending clusters
  rich:'里奇', lich:'利奇', vich:'维奇', nich:'尼奇', mich:'米奇', dich:'迪奇',
  sson:'松', ssen:'森', ston:'斯顿', stin:'斯廷',
  wski:'夫斯基', wska:'夫斯卡', wicz:'维奇', witz:'维茨',
  iard:'亚德', ier:'耶', iere:'耶尔',
  ieux:'厄',
  nham:'纳姆', dham:'德姆',
  bury:'伯里', ford:'福德', well:'韦尔', wood:'伍德',
  shire:'希尔', ville:'维尔', worth:'沃思', stead:'斯特德',
  gaard:'高', guard:'加德',
  land:'兰', lund:'隆德', ström:'斯特伦',
  cius:'修斯', tius:'修斯', dius:'迪乌斯',
  sham:'沙姆', cham:'查姆', tham:'瑟姆',
  burn:'本', thorn:'索恩',
  // Whole names (common players)
  ivan:'伊万', john:'约翰', peter:'彼得', michael:'迈克尔', david:'戴维', daniel:'丹尼尔', james:'詹姆斯', robert:'罗伯特', william:'威廉', thomas:'托马斯', joseph:'约瑟夫', matthew:'马修', anthony:'安东尼', andrew:'安德鲁', steven:'史蒂文', brian:'布赖恩', kevin:'凯文', patrick:'帕特里克', alexander:'亚历山大', benjamin:'本杰明', christopher:'克里斯托弗', jonathan:'乔纳森', nicholas:'尼古拉斯', samuel:'塞缪尔', timothy:'蒂莫西', joshua:'乔舒亚', mohamed:'穆罕默德', achraf:'阿什拉夫', hakim:'哈基姆', victor:'维克托', manuel:'曼努埃尔', gabriel:'加布里埃尔',
  luis:'路易斯', carlos:'卡洛斯', jorge:'豪尔赫', miguel:'米格尔', diego:'迭戈', francisco:'弗朗西斯科', javier:'哈维尔', alejandro:'亚历杭德罗', fernando:'费尔南多', ricardo:'里卡多',
  henrique:'恩里克', eduardo:'爱德华多', pedro:'佩德罗', thiago:'蒂亚戈', filipe:'菲利佩', lucas:'卢卡斯', marcos:'马科斯', rafael:'拉斐尔', bruno:'布鲁诺', felipe:'费利佩',
  jean:'让', pierre:'皮埃尔', charles:'夏尔', hugo:'于戈', nicolas:'尼古拉',
  sebastian:'塞巴斯蒂安', adrian:'阿德里安', felix:'费利克斯', patrik:'帕特里克', max:'马克斯', marco:'马尔科', matteo:'马泰奥', lorenzo:'洛伦佐',
  // Common Arabic prefixes
  al:'阿尔', el:'埃尔',
  // Single consonants (unlikely but fallback)
  b:'布', c:'克', d:'德', f:'夫', g:'格', h:'赫', j:'日',
  k:'克', l:'尔', m:'姆', n:'恩', p:'普', q:'克', r:'尔',
  s:'斯', t:'特', v:'夫', w:'夫', x:'克斯', z:'兹', sh:'什', ch:'奇', th:'斯', zh:'日',
  // Multi-vowel patterns
  ia:'亚', ie:'耶', io:'约', iu:'尤',
  ae:'埃', ai:'艾', ao:'奥', au:'奥', ay:'艾',
  ea:'埃', ee:'伊', ei:'埃', eu:'厄', ey:'埃',
  oa:'奥', oe:'厄', oi:'瓦', oo:'乌', ou:'乌', ow:'奥', oy:'奥伊',
  ua:'瓦', ue:'韦', ui:'维', uo:'沃', uy:'维',
  // Whole-word entries (checked before syllabification)
  ivan:'伊万', ante:'安特', antoine:'安东尼', andrej:'安德雷',
  jordan:'乔丹', josip:'约西普',   joshko:'约什科', yoel:'约埃尔',
  anibal:'阿尼瓦尔', jose:'何塞', erling:'埃尔林',
  mohamed:'穆罕默德', virgil:'菲尔吉尔', victor:'维克托',
  osimhen:'奥西门', toni:'托尼', dries:'德里斯',
  hirving:'伊尔文', achraf:'阿什拉夫', riyad:'里亚德',
  gideon:'吉迪恩', luis:'路易斯', edinson:'埃丁森',
  sergio:'塞尔吉奥', kevin:'凯文', robert:'罗伯特',
  escobar:'埃斯科瓦尔', cordoba:'科尔多瓦', busquets:'布斯克茨',
  lewandowski:'莱万多夫斯基', semenyo:'塞梅尼奥',
  barcenas:'巴塞纳斯', godoy:'戈多伊', williams:'威廉姆斯',
  salah:'萨拉赫', suarez:'苏亚雷斯', cavani:'卡瓦尼',
  haaland:'哈兰德', bruyne:'布劳内', kylian:'基利安', kroos:'克罗斯',
  harry:'哈里', kane:'凯恩', sadio:'萨迪奥', mane:'马内',
  mertens:'梅尔滕斯', lozano:'洛萨诺', hakimi:'哈基米',
  murillo:'穆里略', amir:'阿米尔', fidel:'菲德尔',
  mahrez:'马赫雷兹', dijk:'迪克', van:'范', de:'德',
  mensah:'门萨', abdul:'阿卜杜勒',   inyaki:'伊尼亚基', cristiano:'克里斯蒂亚诺',
  perisic:'佩里希奇', heung:'兴', min:'慜', son:'孙',
  modric:'莫德里奇', gvardiol:'格瓦尔迪奥尔', livakovic:'利瓦科维奇',
  pasalic:'帕沙利奇', sutalo:'舒塔洛', budimir:'布迪米尔',
  kramaric:'克拉马里奇', partey:'帕尔特伊', ayew:'阿尤', fatawu:'法塔武',
  mbappe:'姆巴佩', ronaldo:'罗纳尔多',
  heungmin:'兴慜', songmin:'松旻',
  // Multi-word entries
  'son heung-min':'孙兴慜', 'kevin de bruyne':'凯文·德布劳内',
  'virgil van dijk':'菲尔吉尔·范迪克', 'de bruyne':'德布劳内',
  // End-of-word sh clusters (tiebreaker prefers s+h over sh, so add explicit)
  ash:'阿什', esh:'埃什', ish:'伊什', osh:'奥什', ush:'乌什',
  lesh:'莱什', mesh:'梅什', nesh:'内什', resh:'雷什',
};

// ─── Transliterate a syllable using optimal table lookups ───
function mapSyllable(s) {
  // Memoize
  if (mapSyllable.cache[s] !== undefined) return mapSyllable.cache[s];
  
  // Try all possible splits (from table) and pick the one that covers most chars
  function bestSplit(remaining, depth) {
    if (remaining.length === 0) return { parts: [], covered: 0 };
    if (depth > 10) return { parts: [remaining], covered: 0 };
    
    let best = { parts: [remaining], covered: 0 };
    
    for (let len = Math.min(7, remaining.length); len >= 1; len--) {
      const prefix = remaining.substring(0, len);
      if (syl[prefix] !== undefined) {
        const rest = remaining.substring(len);
        if (rest.length === 0) {
          const cand = { parts: [syl[prefix]], covered: remaining.length };
          if (cand.covered > best.covered) best = cand;
          if (cand.covered === remaining.length) continue; // still try shorter
        }
        const sub = bestSplit(rest, depth + 1);
        const cov = sub.covered + len;
        if (cov > best.covered) {
          best = { parts: [syl[prefix], ...sub.parts], covered: cov };
        } else if (cov === best.covered && sub.parts.length + 1 < best.parts.length) {
          // Prefer fewer parts (more compact Chinese output)
          best = { parts: [syl[prefix], ...sub.parts], covered: cov };
        }
      }
    }
    return best;
  }
  
  const result = bestSplit(s, 0);
  const mapped = result.parts.join('');
  mapSyllable.cache[s] = mapped || s;
  return mapped || s;
}
mapSyllable.cache = {};

// ─── Transliterate ───
function transliterate(name) {
  const cleaned = cleanDiacritics(name);
  // Try full-name match first (for multi-word convention names like 'son heung-min')
  if (syl[cleaned] !== undefined) return syl[cleaned];
  const parts = cleaned.split(/\s+/);
  const result = parts.map(p => {
    // Try whole-word match on each part
    if (syl[p] !== undefined) return syl[p];
    const syllables = syllabify(p);
    return syllables.map(s => mapSyllable(s)).join('');
  });
  return result.join('·');
}

// ─── Run ───
const squads = JSON.parse(fs.readFileSync('./src/data/squads.json', 'utf8'));
const existing = JSON.parse(fs.readFileSync('./src/data/player-names.json', 'utf8'));

let added = 0, skipped = 0;
squads.forEach(t => {
  t.players.forEach(p => {
    if (existing[p.name]) { skipped++; return; }
    existing[p.name] = transliterate(p.name);
    added++;
  });
});

console.log(`Existing: ${skipped}  New: ${added}`);

const tests = [
  ['Luka Modrić', '卢卡·莫德里奇'],
  ['Ivan Perišić', '伊万·佩里希奇'],
  ['Joško Gvardiol', '约什科·格瓦尔迪奥尔'],
  ['Dominik Livaković', '多米尼克·利瓦科维奇'],
  ['Mario Pašalić', '马里奥·帕沙利奇'],
  ['Josip Šutalo', '约西普·舒塔洛'],
  ['Ante Budimir', '安特·布迪米尔'],
  ['Andrej Kramarić', '安德雷·克拉马里奇'],
  ['Thomas Partey', '托马斯·帕尔特伊'],
  ['Jordan Ayew', '乔丹·阿尤'],
  ['Antoine Semenyo', '安东尼·塞梅尼奥'],
  ['Iñaki Williams', '伊尼亚基·威廉姆斯'],
  ['Abdul Fatawu', '阿卜杜勒·法塔武'],
  ['Yoel Bárcenas', '约埃尔·巴塞纳斯'],
  ['Aníbal Godoy', '阿尼瓦尔·戈多伊'],
  ['Michael Amir Murillo', '迈克尔·阿米尔·穆里略'],
  ['Fidel Escobar', '菲德尔·埃斯科瓦尔'],
  ['José Córdoba', '何塞·科尔多瓦'],
  ['Kylian Mbappé', '基利安·姆巴佩'],
  ['Erling Haaland', '埃尔林·哈兰德'],
  ['Mohamed Salah', '穆罕默德·萨拉赫'],
  ['Virgil van Dijk', '菲尔吉尔·范迪克'],
  ['Victor Osimhen', '维克托·奥西门'],
  ['Cristiano Ronaldo', '克里斯蒂亚诺·罗纳尔多'],
  ['Son Heung-min', '孙兴慜'],
  ['Kevin De Bruyne', '凯文·德布劳内'],
  ['Robert Lewandowski', '罗伯特·莱万多夫斯基'],
  ['Sergio Busquets', '塞尔吉奥·布斯克茨'],
  ['Luis Suárez', '路易斯·苏亚雷斯'],
  ['Edinson Cavani', '埃丁森·卡瓦尼'],
  ['Harry Kane', '哈里·凯恩'],
  ['Hirving Lozano', '伊尔文·洛萨诺'],
  ['Achraf Hakimi', '阿什拉夫·哈基米'],
  ['Sadio Mané', '萨迪奥·马内'],
  ['Riyad Mahrez', '里亚德·马赫雷兹'],
  ['Dries Mertens', '德里斯·梅尔滕斯'],
  ['Toni Kroos', '托尼·克罗斯'],
  ['Luka Vušković', '卢卡·武什科维奇'],
  ['Gideon Mensah', '吉迪恩·门萨'],
];

console.log('\nAccuracy:');
let ok = 0;
tests.forEach(([en, want]) => {
  const got = existing[en] || transliterate(en);
  const pass = got === want;
  if (pass) ok++;
  console.log(`  ${pass?'✓':'✗'} ${en} → ${got}${!pass?' | '+want:''}`);
});
console.log(`\n${ok}/${tests.length} correct`);

fs.writeFileSync('./src/data/player-names.json', JSON.stringify(existing, null, 2), 'utf8');
