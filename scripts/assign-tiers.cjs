const fs = require("fs");
const w = JSON.parse(fs.readFileSync("src/data/players-wiki.json", "utf8"));
const s = JSON.parse(fs.readFileSync("src/data/squads.json", "utf8"));

// === 豪门 (S3 A5 B10 C8) ===
const tiers = {
  // Argentina
  "Lionel Messi":"S","Juli\u00E1n Alvarez":"S",
  "Cristian Romero":"A","Rodrigo De Paul":"A","Enzo Fern\u00E1ndez":"A","Alexis Mac Allister":"A","Nicol\u00E1s Gonz\u00E1lez":"A",
  "Emiliano Mart\u00EDnez":"B","Nahuel Molina":"B","Nicol\u00E1s Otamendi":"B","Lisandro Mart\u00EDnez":"B","Nicol\u00E1s Tagliafico":"B","Giovani Lo Celso":"B","Exequiel Palacios":"B","Thiago Almada":"B","Leandro Paredes":"B","Lautaro Mart\u00EDnez":"B",
  "Juan Musso":"C","Ger\u00F3nimo Rulli":"C","Gonzalo Montiel":"C","Marcos Senesi":"C","Facundo Medina":"C","Valent\u00EDn Barco":"C","Nico Paz":"C","Giuliano Simeone":"C","Paulo Dybala":"A","Jos\u00E9 Manuel L\u00F3pez":"C","Rodrygo":"C",
  // Brazil
  "Vin\u00EDcius J\u00FAnior":"S","Raphinha":"S","Neymar":"S",
  "Alisson":"A","Marquinhos":"A","Bruno Guimar\u00E3es":"A","Lucas Paquet\u00E1":"A","Gabriel Martinelli":"A",
  "\u00C9der Milit\u00E3o":"B","Gabriel Magalh\u00E3es":"B","Casemiro":"B","Alex Sandro":"B","Ederson Moraes":"B","Danilo Luiz":"B","Endrick":"B","Matheus Cunha":"B","Savinho":"B","Fabinho":"B",
  "Weverton":"C","Bento":"C","Bremer":"C","L\u00E9o Pereira":"C","Douglas Santos":"C","Danilo Santos":"C","Igor Thiago":"C","Luiz Henrique":"C","Roger Iba\u00F1ez":"C","Rayan":"C","\u00C9derson Silva":"C","Bento Matheus":"C",
  // France
  "Kylian Mbapp\u00E9":"S","N'Golo Kant\u00E9":"S","Aur\u00E9lien Tchouam\u00E9ni":"S",
  "Ousmane Demb\u00E9l\u00E9":"A","Jules Kound\u00E9":"A","Th\u00E9o Hernandez":"A","William Saliba":"A","Michael Olise":"A",
  "Mike Maignan":"B","Ibrahima Konat\u00E9":"B","Dayot Upamecano":"B","Lucas Digne":"B","Adrien Rabiot":"B","Bradley Barcola":"B","Marcus Thuram":"B","Warren Za\u00EFre-Emery":"B","D\u00E9sir\u00E9 Dou\u00E9":"B","Jean-Philippe Mateta":"B",
  "Brice Samba":"C","Malo Gusto":"C","Manu Kon\u00E9":"C","Robin Risser":"C","Rayan Cherki":"C","Maghnes Akliouche":"C","Maxence Lacroix":"C","Lucas Hernandez":"C",
  // Germany
  "Florian Wirtz":"S","Jamal Musiala":"S","Joshua Kimmich":"S",
  "Kai Havertz":"A","Antonio R\u00FCdiger":"A","Leroy San\u00E9":"A","Leon Goretzka":"A","Pascal Gro\u00DF":"A",
  "Manuel Neuer":"B","Jonathan Tah":"B","Nico Schlotterbeck":"B","David Raum":"B","Aleksandar Pavlovi\u0107":"B","Angelo Stiller":"B","Felix Nmecha":"B","Maximilian Beier":"B","Deniz Undav":"B","Nick Woltemade":"B",
  "Oliver Baumann":"C","Alexander N\u00FCbel":"C","Waldemar Anton":"C","Malick Thiaw":"C","Nathaniel Brown":"C","Nadiem Amiri":"C","Jamie Leweling":"C","Assan Ou\u00E9draogo":"C",
  // Spain
  "Pedri":"S","Lamine Yamal":"S","Rodri":"S",
  "Nico Williams":"A","Dani Olmo":"A","Mikel Oyarzabal":"A","Mikel Merino":"A","Fabi\u00E1n Ruiz":"A",
  "Unai Sim\u00F3n":"B","Marc Cucurella":"B","\u00C1lex Grimaldo":"B","Aymeric Laporte":"B","Pau Cubars\u00ED":"B","Marcos Llorente":"B","Mart\u00EDn Zubimendi":"B","Gavi":"B","Ferran Torres":"B","\u00C1lex Baena":"B",
  "David Raya":"C","Pedro Porro":"C","Eric Garc\u00EDa":"C","Marc Pubill":"C","Y\u00E9remy Pino":"C","Joan Garcia":"C","V\u00EDctor Mu\u00F1oz":"C","Borja Iglesias":"C",
  // Netherlands
  "Virgil van Dijk":"S","Frenkie de Jong":"S","Cody Gakpo":"S",
  "Nathan Ak\u00E9":"A","Denzel Dumfries":"A","Ryan Gravenberch":"A","Donyell Malen":"A","Tijjani Reijnders":"A",
  "Bart Verbruggen":"B","Micky van de Ven":"B","Lutsharel Geertruida":"B","Jan Paul van Hecke":"B","Mats Wieffer":"B","Teun Koopmeiners":"B","Noa Lang":"B","Memphis Depay":"B","Justin Kluivert":"B","Wout Weghorst":"B",
  "Mark Flekken":"C","Robin Roefs":"C","Marten de Roon":"C","Guus Til":"C","Jorrel Hato":"C","Quinten Timber":"C","Crysencio Summerville":"C","Brian Brobbey":"C",
  // Portugal
  "Cristiano Ronaldo":"S","Bruno Fernandes":"S","Rafael Le\u00E3o":"S",
  "Bernardo Silva":"A","R\u00FAben Dias":"A","Vitinha":"A","Jo\u00E3o Neves":"A","Diogo Dalot":"A",
  "Diogo Costa":"B","Gon\u00E7alo In\u00E1cio":"B","Nuno Mendes":"B","Jo\u00E3o Cancelo":"B","Matheus Nunes":"B","R\u00FAben Neves":"B","Gon\u00E7alo Ramos":"B","Jo\u00E3o F\u00E9lix":"B","Pedro Neto":"B","Francisco Trinc\u00E3o":"B",
  "Jos\u00E9 S\u00E1":"C","N\u00E9lson Semedo":"C","Tom\u00E1s Ara\u00FAjo":"C","Renato Veiga":"C","Gon\u00E7alo Guedes":"C","Francisco Concei\u00E7\u00E3o":"C","Sam\u00FA Costa":"C","Rui Silva":"C",

  // === 劲旅 (S2 A5 B10 C9) ===
  // Belgium
  "Kevin De Bruyne":"S","Romelu Lukaku":"S",
  "Thibaut Courtois":"A","J\u00E9r\u00E9my Doku":"A","Leandro Trossard":"A","Youri Tielemans":"A","Amadou Onana":"A",
  "Axel Witsel":"B","Timothy Castagne":"B","Thomas Meunier":"B","Arthur Theate":"B","Maxim De Cuyper":"B","Charles De Ketelaere":"B","Alexis Saelemaekers":"B","Dodi Luk\u00E9bakio":"B","Hans Vanaken":"B","Lois Openda":"B",
  "Zeno Debast":"C","Brandon Mechele":"C","Koni De Winter":"C","Senne Lammens":"C","Mike Penders":"C","Nicolas Raskin":"C","Nathan Ngoy":"C","Diego Moreira":"C","Matias Fernandez-Pardo":"C",
  // Japan
  "Takefusa Kubo":"S","Takehiro Tomiyasu":"S",
  "Kaoru Mitoma":"A","Ritsu D\u014Dan":"A","Daichi Kamada":"A","Junya It\u014D":"A","Hiroki It\u014D":"A",
  "Zion Suzuki":"B","K\u014D Itakura":"B","Y\u016Bto Nagatomo":"B","Yukinari Sugawara":"B","Ao Tanaka":"B","Keito Nakamura":"B","Daizen Maeda":"B","Ayase Ueda":"B","Sh\u014Dgo Taniguchi":"B","Tsuyoshi Watanabe":"B",
  "Keisuke \u014Csako":"C","Tomoki Hayakawa":"C","Ayumu Seko":"C","Kaish\u016B Sano":"C","Keisuke Got\u014D":"C","Shuto Machino":"C","K\u014Dki Ogawa":"C","Yuito Suzuki":"C","Kento Shiogai":"C",
  // Senegal
  "Sadio Man\u00E9":"S","Kalidou Koulibaly":"S",
  "\u00C9douard Mendy":"A","Nicolas Jackson":"A","Isma\u00EFla Sarr":"A","Idrissa Gueye":"A","Pape Matar Sarr":"A",
  "Ismail Jakobs":"B","Moussa Niakhat\u00E9":"B","Cherif Ndiaye":"B","Bamba Dieng":"B","Iliman Ndiaye":"B","Habib Diarra":"B","Kr\u00E9pin Diatta":"B","Lamine Camara":"B","Path\u00E9 Ciss":"B","Assane Diao":"B",
  "Yehvann Diouf":"C","Abdoulaye Seck":"C","Abdou Diallo":"C","El Hadji Malick Diouf":"C","Antoine Mendy":"C","Mamadou Sarr":"C","Ibrahim Mbaye":"C","Bara Sapoko Ndiaye":"C","Pape Gueye":"C",
  // Uruguay
  "Federico Valverde":"S","Darwin N\u00FA\u00F1ez":"S",
  "Ronald Ara\u00FAjo":"A","Rodrigo Bentancur":"A","Manuel Ugarte":"A","Giorgian de Arrascaeta":"A","Jos\u00E9 Mar\u00EDa Gim\u00E9nez":"A",
  "Sergio Rochet":"B","Nicol\u00E1s de la Cruz":"B","Math\u00EDas Olivera":"B","Facundo Pellistri":"B","Maximiliano Ara\u00FAjo":"B","Mat\u00EDas Vi\u00F1a":"B","Sebasti\u00E1n C\u00E1ceres":"B","Brian Rodr\u00EDguez":"B","Rodrigo Aguirre":"B","Santiago Bueno":"B",
  "Fernando Muslera":"C","Santiago Mele":"C","Guillermo Varela":"C","Joaqu\u00EDn Piquerez":"C","Agust\u00EDn Canobbio":"C","Federico Vi\u00F1as":"C","Rodrigo Zalazar":"C","Juan Manuel Sanabria":"C","Emiliano Mart\u00EDnez":"C",
  // Ecuador
  "Mois\u00E9s Caicedo":"S","Pervis Estupi\u00F1\u00E1n":"S",
  "Piero Hincapi\u00E9":"A","Kendry P\u00E1ez":"A","Willian Pacho":"A","Enner Valencia":"A","Gonzalo Plata":"A",
  "Hern\u00E1n Gal\u00EDndez":"B","F\u00E9lix Torres":"B","Joel Ord\u00F3\u00F1ez":"B","\u00C1ngelo Preciado":"B","Alan Minda":"B","Pedro Vite":"B","Kevin Rodr\u00EDguez":"B","Jeremy Sarmiento":"B","Jordy Caicedo":"B","Nilson Angulo":"B",
  "Mois\u00E9s Ram\u00EDrez":"C","Jordy Alc\u00EDvar":"C","Alan Franco":"C","Anthony Valencia":"C","John Yeboah":"C","Denil Castillo":"C","Jackson Porozo":"C","Yaimar Medina":"C","Gonzalo Valle":"C",
  // United States
  "Christian Pulisic":"S","Giovanni Reyna":"S",
  "Weston McKennie":"A","Antonee Robinson":"A","Tyler Adams":"A","Folarin Balogun":"A","Timothy Weah":"A",
  "Matt Turner":"B","Sergi\u00F1o Dest":"B","Chris Richards":"B","Miles Robinson":"B","Tim Ream":"B","Malik Tillman":"B","Brenden Aaronson":"B","Ricardo Pepi":"B","Haji Wright":"B","Auston Trusty":"B",
  "Joe Scally":"C","Mark McKenzie":"C","Cristian Roldan":"C","Matt Freese":"C","Chris Brady":"C","Alex Freeman":"C","Max Arfsten":"C","Alejandro Zendejas":"C","Sebastian Berhalter":"C",

  // === 中游 (S0 A4-5 B10 C11-12) ===
  // Ivory Coast
  "Evan Ndicka":"A","Wilfried Singo":"A","Franck Kessi\u00E9":"A","Simon Adingra":"A","Nicolas P\u00E9p\u00E9":"A",
  "Seko Fofana":"B","Ibrahim Sangar\u00E9":"B","Odilon Kossounou":"B","Jean Micha\u00EBl Seri":"B","Amad Diallo":"B","Oumar Diakit\u00E9":"B","Elye Wahi":"B","S\u00E9bastien Haller":"B","Yan Diomande":"B","Ousmane Diomande":"B",
  "Yahia Fofana":"C","Ghislain Konan":"C","Christopher Op\u00E9ri":"C","Emmanuel Agbadou":"C","Mohamed Kon\u00E9":"C","Gu\u00E9la Dou\u00E9":"C","Alban Lafont":"C","Evann Guessand":"C","Bazoumana Tour\u00E9":"C","Parfait Guiagon":"C","Christ Inao Oula\u00EF":"C",
  // Sweden
  "Alexander Isak":"A","Viktor Gy\u00F6keres":"A","Dejan Kulusevski":"A","Anthony Elanga":"A","Emil Forsberg":"A",
  "Victor Lindel\u00F6f":"B","Isak Hien":"B","Hjalmar Ekdal":"B","Carl Starfelt":"B","Lucas Bergvall":"B","Mattias Svanberg":"B","Yasin Ayari":"B","Ken Sema":"B","Gabriel Gudmundsson":"B","Daniel Svensson":"B",
  "Jacob Widell Zetterstr\u00F6m":"C","Gustaf Lagerbielke":"C","Herman Johansson":"C","Viktor Johansson":"C","Jesper Karlstr\u00F6m":"C","Eric Smith":"C","Benjamin Nygren":"C","Alexander Bernhardsson":"C","Gustaf Nilsson":"C","Besfort Zeneli":"C","Taha Ali":"C",
  // Tunisia
  "Montassar Talbi":"A","Ellyes Skhiri":"A","Hannibal Mejbri":"A","Dylan Bronn":"A",
  "Ali Abdi":"B","Yan Valery":"B","Omar Rekik":"B","Rani Khedira":"B","Anis Ben Slimane":"B","Elias Achouri":"B","Elias Saad":"B","Isma\u00EBl Gharbi":"B","Mortadha Ben Ouanes":"B","Aymen Dahmen":"B",
  "Mouhib Chamakh":"C","Khalil Ayari":"C","Adem Arous":"C","Hazem Mastouri":"C","Hadj Mahmoud":"C","Rayan Elloumi":"C","Firas Chaouat":"C","Sabri Ben Hessen":"C","Moutaz Neffati":"C","Raed Chikhaoui":"C","Sebastian Tounekti":"C",
  // Egypt
  "Mohamed Salah":"A","Omar Marmoush":"A","Emam Ashour":"A",
  "Tr\u00E9z\u00E9guet":"B","Hamdy Fathy":"B","Mohamed Abdelmonem":"B","Marwan Attia":"B","Zizo":"B","Nabil Emad":"B","Ibrahim Adel":"B","Mahmoud Saber":"B","Mostafa Ziko":"B","Mohanad Lasheen":"B",
  "Mohamed El Shenawy":"C","Yasser Ibrahim":"C","Mohamed Hany":"C","Hossam Abdelmaguid":"C","Ramy Rabia":"C","Karim Hafez":"C","Ahmed Fatouh":"C","El Mahdy Soliman":"C","Mostafa Shobeir":"C","Tarek Alaa":"C","Haissem Hassan":"C",
  // Turkey
  "Hakan \u00C7alhano\u011Flu":"A","Arda G\u00FCler":"A","Orkun K\u00F6k\u00E7\u00FC":"A","Kenan Y\u0131ld\u0131z":"A","Kerem Akt\u00FCrko\u011Flu":"A",
  "Merih Demiral":"B","\u00C7a\u011Flar S\u00F6y\u00FCnc\u00FC":"B","Ferdi Kad\u0131o\u011Flu":"B","Bar\u0131\u015F Alper Y\u0131lmaz":"B","Salih \u00D6zcan":"B","\u0130smail Y\u00FCksek":"B","\u0130rfan Can Kahveci":"B","Mert M\u00FCld\u00FCr":"B","Yunus Akg\u00FCn":"B","Can Uzun":"B",
  "Mert G\u00FCnok":"C","U\u011Furcan \u00C7ak\u0131r":"C","Altay Bay\u0131nd\u0131r":"C","Zeki \u00C7elik":"C","Eren Elmal\u0131":"C","Abd\u00FClkerim Bardakc\u0131":"C","Ozan Kabak":"C","Kaan Ayhan":"C","O\u011Fuz Ayd\u0131n":"C","Deniz G\u00FCl":"C","Samet Akaydin":"C",

  // === 弱队 (S0 A2 B4-6 C18-20) ===
  // Bosnia and Herzegovina
  "Edin D\u017Eeko":"A","Sead Kola\u0161inac":"A",
  "Ermedin Demirovi\u0107":"B","Benjamin Tahirovi\u0107":"B","Ivan Ba\u0161i\u0107":"B","Amar Dedi\u0107":"B","Armin Gigovi\u0107":"B","Esmir Bajraktarevi\u0107":"B",
  "Nikola Vasilj":"C","Nihad Mujaki\u0107":"C","Dennis Had\u017Eikaduni\u0107":"C","Tarik Muharemovi\u0107":"C","Samed Ba\u017Edar":"C","Mladen Jurkas":"C","Ivan \u0160unji\u0107":"C","Amar Memi\u0107":"C","Amir Had\u017Eiahmetovi\u0107":"C","D\u017Eenis Burni\u0107":"C","Nikola Kati\u0107":"C","Kerim Alajbegovi\u0107":"C","Stjepan Radelji\u0107":"C","Martin Zlomisli\u0107":"C","Haris Tabakovi\u0107":"C","Arjan Mali\u0107":"C","Jovo Luki\u0107":"C","Ermin Mahmi\u0107":"C",
  // Iraq
  "Ali Jasim":"A","Zidane Iqbal":"A",
  "Mohanad Ali":"B","Aymen Hussein":"B","Ibrahim Bayesh":"B","Amir Al-Ammari":"B","Youssef Amyn":"B","Ahmed Qasem":"B",
  "Jalal Hassan":"C","Fahad Talib":"C","Rebin Sulaka":"C","Hussein Ali":"C","Zaid Tahseen":"C","Akam Hashim":"C","Manaf Younis":"C","Ali Al-Hamadi":"C","Ahmed Maknzi":"C","Kevin Yakob":"C","Aimar Sher":"C","Marko Farji":"C","Ahmed Basil":"C","Merchas Doski":"C","Zaid Ismail":"C","Mustafa Saadoon":"C","Frans Putros":"C","Ali Yousif":"C",
  // New Zealand
  "Chris Wood":"A","Sarpreet Singh":"A",
  "Marko Stameni\u0107":"B","Joe Bell":"B","Tim Payne":"B","Elijah Just":"B","Liberato Cacace":"B","Kosta Barbarouses":"B",
  "Max Crocombe":"C","Tyler Bindon":"C","Michael Boxall":"C","Francis de Vries":"C","Alex Rufer":"C","Nando Pijnaker":"C","Finn Surman":"C","Ben Waine":"C","Ben Old":"C","Callum McCowatt":"C","Jesse Randall":"C","Michael Woud":"C","Alex Paulsen":"C","Ryan Thomas":"C","Logan Rogerson":"C","Callan Elliot":"C","Lachlan Bayliss":"C","Tommy Smith":"C",
  // Saudi Arabia
  "Salem Al-Dawsari":"A","Mohamed Kanno":"A",
  "Sultan Mandash":"B","Firas Al-Buraikan":"B","Abdulelah Al-Amri":"B","Hassan Al-Tambakti":"B","Ali Lajami":"B","Saud Abdulhamid":"B",
  "Mohammed Al-Owais":"C","Nawaf Al-Aqidi":"C","Ali Majrashi":"C","Nasser Al-Dawsari":"C","Musab Al-Juwayr":"C","Ayman Yahya":"C","Saleh Al-Shehri":"C","Nawaf Boushal":"C","Hassan Kadesh":"C","Abdullah Al-Khaibari":"C","Ziyad Al-Johani":"C","Khalid Al-Ghannam":"C","Alaa Al-Hejji":"C","Abdullah Al-Hamdan":"C","Ahmed Al-Kassar":"C","Moteb Al-Harbi":"C","Jehad Thakri":"C","Mohammed Abu Al-Shamat":"C"
};

let applied = 0, misMatch = 0;
Object.keys(tiers).forEach((k) => {
  if (w[k]) { w[k].tier = tiers[k]; applied++; }
  else { console.log("MISS: " + k); misMatch++; }
});

const need = [
  "Argentina","Brazil","France","Germany","Spain","Netherlands","Portugal",
  "Belgium","Japan","Senegal","Uruguay","Ecuador","United States",
  "Ivory Coast","Sweden","Tunisia","Egypt","Turkey",
  "Bosnia and Herzegovina","Iraq","New Zealand","Saudi Arabia"
];
need.forEach((tn) => {
  const t = s.find((x) => x.name === tn);
  if (!t) { console.log(tn + ": NOT FOUND"); return; }
  const cnt = { S: 0, A: 0, B: 0, C: 0, X: 0 };
  t.players.forEach((p) => {
    const d = w[p.name];
    if (d && d.tier) cnt[d.tier]++;
    else cnt.X++;
  });
  console.log(tn + ": S" + cnt.S + " A" + cnt.A + " B" + cnt.B + " C" + cnt.C + (cnt.X ? " X" + cnt.X : "") + " = " + (26 - cnt.X) + "/26");
});

// Fix England 2 players
w["Dean Henderson"].careerReview = "1997 年出生于怀特黑文，卡莱尔联青训后 2015 年首秀。2011 年转会曼联青训并在 2020 年升入一线队，期间租借至谢菲尔德联和诺丁汉森林积累英超守门经验。2023 年夏天以 1750 万欧元转会水晶宫并在英超积累守门出场记录。英格兰国家队 2020 年首秀并累积 8 场出场。2025-26 赛季在水晶宫英超守门轮换阵容中担任替补角色。";
w["Dean Henderson"].wcSpotlight = "28 岁，第二届世界杯，替补门将。水晶宫英超和曼联青训的守门训练在门将深度中是经英超验证的备选守门选项。对同组时核心任务是辅助皮克福德做射门分析和在训练中保持守门备用状态。";
w["Jarell Quansah"].careerReview = "2003 年出生于沃灵顿并在利物浦青训成长，2023 年升入一线队并在英超和欧联杯积累年轻防线出场和对抗训练经验。在克洛普体系下成长并在英超中积累对顶级攻击手的防守阅读能力。英格兰国家队 2024 年首秀并累积 4 场出场。2025-26 赛季在利物浦英超防线轮换阵容中担任年轻中后卫选项。";
w["Jarell Quansah"].wcSpotlight = "22 岁，第一届世界杯，防线后备。利物浦英超和欧联杯的防线训练在防线深度中是积累中的年轻选项和经英超顶级体系训练的防守新手。对同组时核心任务是感受世界杯防线强度和积累大赛防守学习经验。";

fs.writeFileSync("src/data/players-wiki.json", JSON.stringify(w, null, 2));
console.log("\nApplied: " + applied + ", Missing: " + misMatch);
