const fs = require('fs');
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));

// Direct manual cross-reference of every player mentioned with (caps, club) in TEAM_INTROS.md
// Format: [team_en, chinese_name, english_name, caps_from_md, club_chinese, club_expected_english]
// Leave club_chinese empty if no club mentioned in brackets

const checks = [
  // === A组 ===
  // 捷克
  ['Czech Republic', '绍切克', 'Tomáš Souček', 90, '西汉姆联', 'West Ham United'],
  ['Czech Republic', '曹法尔', 'Vladimír Coufal', 62, '西汉姆联', 'West Ham United'],
  ['Czech Republic', '希克', 'Patrik Schick', 53, '勒沃库森', 'Bayer Leverkusen'],
  // 墨西哥
  ['Mexico', '奥乔亚', 'Guillermo Ochoa', 152, '', ''],
  ['Mexico', '希门尼斯', 'Raúl Jiménez', 124, '', ''],
  ['Mexico', '阿尔瓦雷斯', 'Edson Álvarez', 98, '西汉姆联', 'West Ham United'],
  ['Mexico', '皮内达', 'Orbelín Pineda', 92, '', ''],
  // 南非
  ['South Africa', '威廉姆斯', 'Ronwen Williams', 62, '', ''],
  ['South Africa', '兹瓦内', 'Themba Zwane', 54, '', ''],
  ['South Africa', '莫科纳', 'Teboho Mokoena', 51, '', ''],
  // 韩国
  ['South Korea', '孙兴慜', 'Son Heung-min', 144, '热刺', 'Tottenham Hotspur'],
  ['South Korea', '金玟哉', 'Kim Min-jae', 79, '拜仁', 'Bayern Munich'],
  ['South Korea', '黄喜灿', 'Hwang Hee-chan', 79, '狼队', 'Wolverhampton Wanderers'],
  ['South Korea', '李在城', 'Lee Jae-sung', 105, '', ''],

  // === B组 ===
  // 波黑
  ['Bosnia and Herzegovina', '哲科', 'Edin Džeko', 148, '', ''], // text says 费内巴切
  ['Bosnia and Herzegovina', '科拉希纳茨', 'Sead Kolašinac', 65, '', ''],
  ['Bosnia and Herzegovina', '德米罗维奇', 'Ermedin Demirović', 40, '', ''],
  // 加拿大
  ['Canada', '阿方索·戴维斯', 'Alphonso Davies', 58, '拜仁', 'Bayern Munich'],
  ['Canada', '乔纳森·戴维', 'Jonathan David', 77, '', ''],
  ['Canada', '拉林', 'Cyle Larin', 90, '', ''],
  ['Canada', '布坎南', 'Tajon Buchanan', 60, '', ''],
  // 卡塔尔
  ['Qatar', '阿尔-海多斯', 'Hassan Al-Haydos', 186, '', ''],
  ['Qatar', '阿菲夫', 'Akram Afif', 125, '', ''],
  ['Qatar', '布迪亚夫', 'Karim Boudiaf', 118, '', ''],
  // 瑞士
  ['Switzerland', '扎卡', 'Granit Xhaka', 146, '勒沃库森', 'Bayer Leverkusen'],
  ['Switzerland', '阿坎吉', 'Manuel Akanji', 81, '曼城', 'Manchester City'],
  ['Switzerland', '恩博洛', 'Breel Embolo', 86, '', ''],

  // === C组 ===
  // 巴西
  ['Brazil', '内马尔', 'Neymar', 128, '', ''],
  ['Brazil', '维尼修斯', 'Vinícius Júnior', 49, '皇马', 'Real Madrid'],
  ['Brazil', '拉菲尼亚', 'Raphinha', 39, '巴萨', 'Barcelona'],
  ['Brazil', '恩德里克', 'Endrick', 17, '里昂', 'Lyon'],
  ['Brazil', '卡塞米罗', 'Casemiro', 86, '曼联', 'Manchester United'],
  ['Brazil', '布鲁诺·吉马良斯', 'Bruno Guimarães', 43, '纽卡', 'Newcastle United'],
  ['Brazil', '阿利松', 'Alisson', 78, '利物浦', 'Liverpool'],
  // 海地
  ['Haiti', '纳宗', 'Duckens Nazon', 82, '', ''],
  ['Haiti', '普拉西德', 'Johny Placide', 82, '', ''],
  // 摩洛哥
  ['Morocco', '阿什拉夫', 'Achraf Hakimi', 96, '巴黎', 'Paris Saint-Germain'],
  ['Morocco', '布努', 'Yassine Bounou', 90, '', ''],
  ['Morocco', '阿姆拉巴特', 'Sofyan Amrabat', 75, '', ''],
  ['Morocco', '埃尔卡比', 'Ayoub El Kaabi', 71, '', ''],
  // 苏格兰
  ['Scotland', '罗伯逊', 'Andy Robertson', 94, '利物浦', 'Liverpool'],
  ['Scotland', '麦金', 'John McGinn', 86, '维拉', 'Aston Villa'],
  ['Scotland', '麦克托米奈', 'Scott McTominay', 70, '那不勒斯', 'Napoli'],

  // === D组 ===
  // 澳大利亚
  ['Australia', '瑞安', 'Mathew Ryan', 104, '', ''],
  ['Australia', '欧文', 'Jackson Irvine', 82, '', ''],
  ['Australia', '莱基', 'Mathew Leckie', 80, '', ''],
  // 巴拉圭
  ['Paraguay', '古斯塔沃·戈麦斯', 'Gustavo Gómez', 89, '', ''],
  ['Paraguay', '阿尔米隆', 'Miguel Almirón', 76, '纽卡', 'Newcastle United'],
  // 土耳其
  ['Turkey', '恰尔汗奥卢', 'Hakan Çalhanoğlu', 105, '国米', 'Inter Milan'],
  ['Turkey', '德米拉尔', 'Merih Demiral', 62, '', ''],
  ['Turkey', '瑟云居', 'Çağlar Söyüncü', 60, '', ''],
  // 美国
  ['United States', '普利西奇', 'Christian Pulisic', 86, '米兰', 'Milan'],
  ['United States', '麦肯尼', 'Weston McKennie', 66, '尤文', 'Juventus'],
  ['United States', '里姆', 'Tim Ream', 82, '', ''],

  // === E组 ===
  // 库拉索 - Bacuna brothers mentioned in text as (莱安德罗72场、尤尼尼奥49场)
  ['Curaçao', '莱安德罗', 'Leandro Bacuna', 72, '', ''],
  ['Curaçao', '尤尼尼奥', 'Juninho Bacuna', 49, '', ''],
  ['Curaçao', '罗姆', 'Eloy Room', 71, '', ''],
  // 厄瓜多尔
  ['Ecuador', '恩纳·瓦伦西亚', 'Enner Valencia', 105, '', ''],
  ['Ecuador', '凯塞多', 'Moisés Caicedo', 61, '切尔西', 'Chelsea'],
  ['Ecuador', '埃斯图皮尼安', 'Pervis Estupiñán', 54, '布莱顿', 'Brighton & Hove Albion'],
  // 德国
  ['Germany', '诺伊尔', 'Manuel Neuer', 124, '', ''],
  ['Germany', '基米希', 'Joshua Kimmich', 110, '拜仁', 'Bayern Munich'],
  ['Germany', '吕迪格', 'Antonio Rüdiger', 82, '皇马', 'Real Madrid'],
  ['Germany', '穆西亚拉', 'Jamal Musiala', 42, '拜仁', 'Bayern Munich'],
  ['Germany', '维尔茨', 'Florian Wirtz', 41, '利物浦', 'Liverpool'],
  ['Germany', '萨内', 'Leroy Sané', 76, '', ''],
  // 科特迪瓦
  ['Ivory Coast', '凯西', 'Franck Kessié', 103, '', ''],
  ['Ivory Coast', '桑加雷', 'Ibrahim Sangaré', 58, '', ''],
  ['Ivory Coast', '佩佩', 'Nicolas Pépé', 55, '', ''],

  // === F组 ===
  // 日本
  ['Japan', '长友佑都', 'Yūto Nagatomo', 145, '', ''],
  ['Japan', '久保建英', 'Takefusa Kubo', 49, '皇家社会', 'Real Sociedad'],
  ['Japan', '镰田大地', 'Daichi Kamada', 49, '水晶宫', 'Crystal Palace'],
  ['Japan', '伊东纯也', 'Junya Itō', 69, '', ''],
  // 荷兰
  ['Netherlands', '范戴克', 'Virgil van Dijk', 92, '利物浦', 'Liverpool'],
  ['Netherlands', '德佩', 'Memphis Depay', 109, '', ''],
  ['Netherlands', '弗伦基·德容', 'Frenkie de Jong', 66, '巴萨', 'Barcelona'],
  ['Netherlands', '邓弗里斯', 'Denzel Dumfries', 72, '国米', 'Inter Milan'],
  // 瑞典
  ['Sweden', '伊萨克', 'Alexander Isak', 58, '纽卡', 'Newcastle United'],
  ['Sweden', '哲凯赖什', 'Viktor Gyökeres', 33, '葡萄牙体育', 'Sporting CP'],
  ['Sweden', '林德洛夫', 'Victor Lindelöf', 76, '曼联', 'Manchester United'],
  // 突尼斯
  ['Tunisia', '斯希里', 'Ellyes Skhiri', 83, '法兰克福', 'Eintracht Frankfurt'],
  ['Tunisia', '梅杰布里', 'Hannibal Mejbri', 45, '曼联', 'Manchester United'],

  // === G组 ===
  // 比利时
  ['Belgium', '德布劳内', 'Kevin De Bruyne', 119, '那不勒斯', 'Napoli'],
  ['Belgium', '卢卡库', 'Romelu Lukaku', 126, '', ''],
  ['Belgium', '库尔图瓦', 'Thibaut Courtois', 109, '皇马', 'Real Madrid'],
  ['Belgium', '蒂莱曼斯', 'Youri Tielemans', 85, '维拉', 'Aston Villa'],
  ['Belgium', '维特塞尔', 'Axel Witsel', 138, '', ''],
  // 埃及
  ['Egypt', '萨拉赫', 'Mohamed Salah', 116, '利物浦', 'Liverpool'],
  ['Egypt', '特雷泽盖', 'Trézéguet', 96, '', ''],
  ['Egypt', '齐佐', 'Ahmed Sayed Zizo', 63, '', ''],
  ['Egypt', '埃尔-舍纳维', 'Mohamed El Shenawy', 76, '', ''],
  // 伊朗
  ['Iran', '哈吉萨菲', 'Ehsan Hajsafi', 146, '', ''],
  ['Iran', '塔雷米', 'Mehdi Taremi', 105, '国米', 'Inter Milan'],
  ['Iran', '贾汉巴赫什', 'Alireza Jahanbakhsh', 98, '', ''],
  ['Iran', '贝兰万德', 'Alireza Beiranvand', 86, '', ''],
  // 新西兰
  ['New Zealand', '伍德', 'Chris Wood', 90, '诺丁汉森林', 'Nottingham Forest'],
  ['New Zealand', '巴巴鲁斯', 'Kosta Barbarouses', 76, '', ''],

  // === H组 ===
  // 佛得角
  ['Cape Verde', '门德斯', 'Ryan Mendes', 98, '', ''],
  ['Cape Verde', '蒙泰罗', 'Jamiro Monteiro', 55, '', ''],
  ['Cape Verde', '沃济尼亚', 'Vozinha', 90, '', ''],
  // 沙特
  ['Saudi Arabia', '阿尔-多萨里', 'Salem Al-Dawsari', 111, '', ''],
  ['Saudi Arabia', '卡诺', 'Mohamed Kanno', 79, '', ''],
  ['Saudi Arabia', '阿尔-奥维斯', 'Mohammed Al-Owais', 65, '', ''],
  // 西班牙
  ['Spain', '罗德里', 'Rodri', 62, '曼城', 'Manchester City'],
  ['Spain', '亚马尔', 'Lamine Yamal', 25, '巴萨', 'Barcelona'],
  ['Spain', '奥尔莫', 'Dani Olmo', 50, '巴萨', 'Barcelona'],
  ['Spain', '奥亚萨瓦尔', 'Mikel Oyarzabal', 53, '皇家社会', 'Real Sociedad'],
  // 乌拉圭
  ['Uruguay', '巴尔韦德', 'Federico Valverde', 73, '皇马', 'Real Madrid'],
  ['Uruguay', '本坦库尔', 'Rodrigo Bentancur', 74, '热刺', 'Tottenham Hotspur'],
  ['Uruguay', '努涅斯', 'Darwin Núñez', 38, '利雅得新月', 'Al-Hilal'],
  ['Uruguay', '希门尼斯', 'José María Giménez', 99, '马竞', 'Atlético Madrid'],
  ['Uruguay', '穆斯莱拉', 'Fernando Muslera', 134, '', ''],

  // === I组 ===
  // 法国
  ['France', '姆巴佩', 'Kylian Mbappé', 98, '皇马', 'Real Madrid'],
  ['France', '登贝莱', 'Ousmane Dembélé', 59, '巴黎', 'Paris Saint-Germain'],
  ['France', '奥利塞', 'Michael Olise', 17, '拜仁', 'Bayern Munich'],
  ['France', '巴尔科拉', 'Bradley Barcola', 20, '巴黎', 'Paris Saint-Germain'],
  ['France', '杜埃', 'Désiré Doué', 7, '巴黎', 'Paris Saint-Germain'],
  ['France', '楚阿梅尼', 'Aurélien Tchouaméni', 46, '皇马', 'Real Madrid'],
  ['France', '坎特', "N'Golo Kanté", 69, '费内巴切', 'Fenerbahçe'],
  ['France', '扎伊尔-埃梅里', 'Warren Zaïre-Emery', 11, '巴黎', 'Paris Saint-Germain'],
  ['France', '谢尔基', 'Rayan Cherki', 7, '曼城', 'Manchester City'],
  ['France', '萨利巴', 'William Saliba', 32, '阿森纳', 'Arsenal'],
  ['France', '科纳特', 'Ibrahima Konaté', 28, '利物浦', 'Liverpool'],
  ['France', '于帕梅卡诺', 'Dayot Upamecano', 38, '拜仁', 'Bayern Munich'],
  ['France', '迈尼昂', 'Mike Maignan', 40, '米兰', 'Milan'],
  // 伊拉克
  ['Iraq', '哈桑', 'Jalal Hassan', 102, '', ''],
  ['Iraq', '侯赛因', 'Aymen Hussein', 95, '', ''],
  ['Iraq', '阿里', 'Mohanad Ali', 72, '', ''],
  // 挪威
  ['Norway', '哈兰德', 'Erling Haaland', 50, '曼城', 'Manchester City'],
  ['Norway', '厄德高', 'Martin Ødegaard', 68, '阿森纳', 'Arsenal'],
  ['Norway', '瑟洛特', 'Alexander Sørloth', 72, '', ''],
  ['Norway', '贝格', 'Sander Berge', 66, '', ''],
  ['Norway', '阿耶尔', 'Kristoffer Ajer', 52, '', ''],
  // 塞内加尔
  ['Senegal', '马内', 'Sadio Mané', 128, '利雅得胜利', 'Al-Nassr'],
  ['Senegal', '格耶', 'Idrissa Gueye', 131, '', ''],
  ['Senegal', '库利巴利', 'Kalidou Koulibaly', 103, '', ''],
  ['Senegal', '萨尔', 'Ismaïla Sarr', 83, '', ''],

  // === J组 ===
  // 阿尔及利亚
  ['Algeria', '曼迪', 'Aïssa Mandi', 117, '', ''],
  ['Algeria', '马赫雷斯', 'Riyad Mahrez', 114, '', ''],
  ['Algeria', '本塞拜尼', 'Ramy Bensebaini', 81, '', ''],
  ['Algeria', '本塔莱布', 'Nabil Bentaleb', 59, '', ''],
  // 阿根廷 - complex, many players mentioned with clubs in text but no caps format
  ['Argentina', '梅西', 'Lionel Messi', 199, '', ''],
  ['Argentina', '劳塔罗·马丁内斯', 'Lautaro Martínez', 40, '国米', 'Inter Milan'], // caps not specified in brackets for many
  ['Argentina', '阿尔瓦雷斯', 'Julián Álvarez', 50, '马竞', 'Atlético Madrid'],
  ['Argentina', '德保罗', 'Rodrigo De Paul', 75, '迈阿密国际', 'Inter Miami CF'],
  ['Argentina', '恩佐·费尔南德斯', 'Enzo Fernández', 29, '切尔西', 'Chelsea'],
  ['Argentina', '麦卡利斯特', 'Alexis Mac Allister', 47, '利物浦', 'Liverpool'],
  ['Argentina', '奥塔门迪', 'Nicolás Otamendi', 132, '', ''],
  ['Argentina', '罗梅罗', 'Cristian Romero', 43, '热刺', 'Tottenham Hotspur'],
  ['Argentina', '利桑德罗·马丁内斯', 'Lisandro Martínez', 22, '曼联', 'Manchester United'],
  ['Argentina', '大马丁', 'Emiliano Martínez', 37, '阿斯顿维拉', 'Aston Villa'],
  // 奥地利
  ['Austria', '阿瑙托维奇', 'Marko Arnautović', 133, '', ''],
  ['Austria', '阿拉巴', 'David Alaba', 113, '皇马', 'Real Madrid'],
  ['Austria', '萨比策', 'Marcel Sabitzer', 98, '多特蒙德', 'Borussia Dortmund'],
  // 约旦
  ['Jordan', '阿尔-塔马里', 'Musa Al-Taamari', 92, '', ''],
  ['Jordan', '阿布拉伊拉', 'Yazeed Abulaila', 76, '', ''],
  ['Jordan', '阿尔-阿拉伯', 'Yazan Al-Arab', 80, '', ''],

  // === K组 ===
  // 哥伦比亚
  ['Colombia', 'J罗', 'James Rodríguez', 126, '', ''],
  ['Colombia', '迪亚斯', 'Luis Díaz', 74, '利物浦', 'Liverpool'],
  ['Colombia', '奥斯皮纳', 'David Ospina', 130, '', ''],
  // 刚果民主共和国
  ['DR Congo', '姆本巴', 'Chancel Mbemba', 109, '', ''],
  ['DR Congo', '巴坎布', 'Cédric Bakambu', 70, '', ''],
  ['DR Congo', '埃利亚', 'Meschak Elia', 69, '', ''],
  // 葡萄牙
  ['Portugal', 'C罗', 'Cristiano Ronaldo', 228, '', ''],
  ['Portugal', 'B席', 'Bernardo Silva', 109, '曼城', 'Manchester City'],
  ['Portugal', 'B费', 'Bruno Fernandes', 89, '曼联', 'Manchester United'],
  ['Portugal', '鲁本·迪亚斯', 'Rúben Dias', 76, '曼城', 'Manchester City'],
  ['Portugal', '坎塞洛', 'João Cancelo', 68, '巴萨', 'Barcelona'],
  // 乌兹别克斯坦
  ['Uzbekistan', '肖穆罗多夫', 'Eldor Shomurodov', 92, '', ''],
  ['Uzbekistan', '舒库罗夫', 'Otabek Shukurov', 84, '', ''],
  ['Uzbekistan', '谢尔盖耶夫', 'Igor Sergeev', 83, '', ''],
  ['Uzbekistan', '马沙里波夫', 'Jaloliddin Masharipov', 74, '', ''],

  // === L组 ===
  // 克罗地亚
  ['Croatia', '莫德里奇', 'Luka Modrić', 198, '米兰', 'Milan'],
  ['Croatia', '佩里西奇', 'Ivan Perišić', 154, '', ''],
  ['Croatia', '科瓦契奇', 'Mateo Kovačić', 113, '曼城', 'Manchester City'],
  ['Croatia', '格瓦迪奥尔', 'Joško Gvardiol', 48, '曼城', 'Manchester City'],
  // 英格兰
  ['England', '凯恩', 'Harry Kane', 114, '拜仁', 'Bayern Munich'],
  ['England', '贝林厄姆', 'Jude Bellingham', 48, '皇马', 'Real Madrid'],
  ['England', '赖斯', 'Declan Rice', 73, '阿森纳', 'Arsenal'],
  ['England', '皮克福德', 'Jordan Pickford', 84, '埃弗顿', 'Everton'],
  // 加纳
  ['Ghana', '乔丹·阿尤', 'Jordan Ayew', 120, '', ''],
  ['Ghana', '帕尔特伊', 'Thomas Partey', 57, '阿森纳', 'Arsenal'],
  ['Ghana', '萨梅尼奥', 'Antoine Semenyo', 34, '', ''],
  // 巴拿马
  ['Panama', '戈多伊', 'Aníbal Godoy', 159, '', ''],
  ['Panama', '金特罗', 'Alberto Quintero', 141, '', ''],
  ['Panama', '巴尔塞纳斯', 'Yoel Bárcenas', 104, '', ''],
  ['Panama', '埃斯科瓦尔', 'Fidel Escobar', 99, '', ''],
];

// Additional text-based club mentions (not in brackets)
// "38岁的哲科依然在费内巴切保持高水平" -> 哲科 mentioned at 费内巴切, squad says Schalke 04

const mismatches = [];
const capsMismatches = [];
const allOk = [];
const notFound = [];

for (const [team, cnName, enName, capsMD, clubCN, clubEN] of checks) {
  const squad = squads.find(s => s.name === team);
  if (!squad) { notFound.push(`SQUAD NOT FOUND: ${team}`); continue; }

  const player = squad.players.find(p => p.name === enName);
  if (!player) {
    notFound.push(`${team} / ${cnName} (${enName}): NOT FOUND in squad`);
    continue;
  }

  let issues = [];
  if (player.caps !== capsMD) {
    issues.push(`CAPS: MD=${capsMD}, squad=${player.caps}`);
  }
  if (clubCN && clubEN && player.club !== clubEN) {
    issues.push(`CLUB: MD="${clubCN}"→${clubEN}, squad="${player.club}"`);
  }

  if (issues.length > 0) {
    mismatches.push(`${team} / ${cnName} (${enName}): ${issues.join(' | ')}`);
  } else {
    allOk.push(`${team} / ${cnName}: caps=${capsMD}, club=${player.club} ✓`);
  }
}

// Also check text-based club mentions
const textClubMentions = [
  ['Bosnia and Herzegovina', '哲科', 'Edin Džeko', '费内巴切', 'Fenerbahçe', 'Schalke 04'],
];

for (const [team, cnName, enName, clubCN, clubExpected, clubActual] of textClubMentions) {
  const squad = squads.find(s => s.name === team);
  const player = squad.players.find(p => p.name === enName);
  if (player && player.club !== clubExpected) {
    mismatches.push(`${team} / ${cnName} (${enName}): TEXT CLUB: MD mentions "${clubCN}"(=Fenerbahçe), squad says "${player.club}"`);
  }
}

// Coach mismatches
const coachChecks = [
  ['Czech Republic', '库贝克', 'Miroslav Koubek'],
  ['Mexico', '阿吉雷', 'Javier Aguirre'],
  ['South Africa', '布罗斯', 'Hugo Broos'],
  ['South Korea', '洪明甫', 'Hong Myung-bo'],
  ['Bosnia and Herzegovina', '巴尔巴雷兹', 'Sergej Barbarez'],
  ['Canada', '马什', 'Jesse Marsch'],
  ['Qatar', '洛佩特吉', 'Julen Lopetegui'],
  ['Switzerland', '雅金', 'Murat Yakin'],
  ['Brazil', '安切洛蒂', 'Carlo Ancelotti'],
  ['Haiti', '米涅', 'Sébastien Migné'],
  ['Morocco', '奥瓦比', 'Mohamed Ouahbi'],
  ['Scotland', '克拉克', 'Steve Clarke'],
  ['Australia', '波波维奇', 'Tony Popovic'],
  ['Paraguay', '阿尔法罗', 'Gustavo Alfaro'],
  ['Turkey', '蒙特拉', 'Vincenzo Montella'],
  ['United States', '波切蒂诺', 'Mauricio Pochettino'],
  ['Curaçao', '阿德沃卡特', 'Dick Advocaat'],
  ['Ecuador', '贝卡塞塞', 'Sebastián Beccacece'],
  ['Germany', '纳格尔斯曼', 'Julian Nagelsmann'],
  ['Ivory Coast', '法埃', 'Emerse Faé'],
  ['Japan', '森保一', 'Hajime Moriyasu'],
  ['Netherlands', '科曼', 'Ronald Koeman'],
  ['Sweden', '波特', 'Graham Potter'],
  ['Tunisia', '拉穆奇', 'Sabri Lamouchi'],
  ['Belgium', '加西亚', 'Rudi Garcia'],
  ['Egypt', '哈桑', 'Hossam Hassan'],
  ['Iran', '加莱诺埃', 'Amir Ghalenoei'],
  ['New Zealand', '贝兹利', 'Darren Bazeley'],
  ['Cape Verde', '布比斯塔', 'Bubista'],
  ['Saudi Arabia', '多尼斯', 'Georgios Donis'],
  ['Spain', '德拉富恩特', 'Luis de la Fuente'],
  ['Uruguay', '贝尔萨', 'Marcelo Bielsa'],
  ['France', '德尚', 'Didier Deschamps'],
  ['Iraq', '阿诺德', 'Graham Arnold'],
  ['Norway', '索尔巴肯', 'Ståle Solbakken'],
  ['Senegal', '蒂奥', 'Pape Thiaw'],
  ['Algeria', '佩特科维奇', 'Vladimir Petković'],
  ['Argentina', '斯卡洛尼', 'Lionel Scaloni'],
  ['Austria', '朗尼克', 'Ralf Rangnick'],
  ['Jordan', '塞拉米', 'Jamal Sellami'],
  ['Colombia', '洛伦索', 'Néstor Lorenzo'],
  ['DR Congo', '德萨布雷', 'Sébastien Desabre'],
  ['Portugal', '马丁内斯', 'Roberto Martínez'],
  ['Uzbekistan', '卡纳瓦罗', 'Fabio Cannavaro'],
  ['Croatia', '达利奇', 'Zlatko Dalić'],
  ['England', '图赫尔', 'Thomas Tuchel'],
  ['Ghana', '奎罗斯', 'Carlos Queiroz'],
  ['Panama', '克里斯蒂安森', 'Thomas Christiansen'],
];

for (const [team, cnCoach, enCoach] of coachChecks) {
  const squad = squads.find(s => s.name === team);
  if (!squad) { notFound.push(`SQUAD NOT FOUND for coach: ${team}`); continue; }
  const actual = squad.coach;
  // Morocco has HTML comment embedded, Spain has disambiguation
  let cleanActual = actual.replace(/<!--.*?-->/g, '').trim();
  // Spain: "Luis de la Fuente (footballer, born 1961)|Luis de la Fuente" -> "Luis de la Fuente"
  if (cleanActual.includes('|')) cleanActual = cleanActual.split('|')[1] || cleanActual.split('|')[0];
  if (cleanActual !== enCoach) {
    mismatches.push(`COACH ${team}: MD="${cnCoach}"→${enCoach}, squad="${cleanActual}"`);
  }
}

console.log('========== MISMATCHES ==========');
mismatches.forEach(m => console.log(`  ❌ ${m}`));
console.log(`\nTotal mismatches: ${mismatches.length}`);

console.log('\n========== ALL OK (sample) ==========');
allOk.slice(0, 20).forEach(m => console.log(`  ✓ ${m}`));
console.log(`...and ${allOk.length - 20} more OK entries`);

if (notFound.length > 0) {
  console.log('\n========== NOT FOUND ==========');
  notFound.forEach(m => console.log(`  ⚠ ${m}`));
}
