const fs = require('fs');
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));
const md = fs.readFileSync('TEAM_INTROS.md', 'utf8');

// Helper: find player in squads by Chinese name mapping (approximate via caps)
function findPlayerByCaps(teamPlayers, caps, positionHint) {
  // Try exact caps match first
  const exact = teamPlayers.filter(p => p.caps === caps);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    // try to disambiguate by position
    const byPos = exact.filter(p => positionHint && (
      (positionHint === 'GK' && p.position === 'GK') ||
      (positionHint === 'DF' && p.position === 'DF') ||
      (positionHint === 'MF' && p.position === 'MF') ||
      (positionHint === 'FW' && p.position === 'FW')
    ));
    if (byPos.length === 1) return byPos[0];
    return exact[0]; // return first if can't disambiguate
  }
  // No exact match - maybe caps changed; return undefined
  return undefined;
}

// Extract all mentions from TEAM_INTROS.md
// Pattern: ChineseName（X场，ClubName） or ChineseName（X场）
const sections = md.split('### ').slice(1);
const results = [];

// Map of TEAM_INTROS Chinese team name -> squads.json English team name
const teamMap = {
  '捷克 (Czech Republic)': 'Czech Republic',
  '墨西哥 (Mexico)': 'Mexico',
  '南非 (South Africa)': 'South Africa',
  '韩国 (South Korea)': 'South Korea',
  '波斯尼亚和黑塞哥维那 (Bosnia and Herzegovina)': 'Bosnia and Herzegovina',
  '加拿大 (Canada)': 'Canada',
  '卡塔尔 (Qatar)': 'Qatar',
  '瑞士 (Switzerland)': 'Switzerland',
  '巴西 (Brazil)': 'Brazil',
  '海地 (Haiti)': 'Haiti',
  '摩洛哥 (Morocco)': 'Morocco',
  '苏格兰足球代表队 (Scotland)': 'Scotland',
  '澳大利亚 (Australia)': 'Australia',
  '巴拉圭 (Paraguay)': 'Paraguay',
  '土耳其 (Turkey)': 'Turkey',
  '美国 (United States)': 'United States',
  '库拉索 (Curaçao)': 'Curaçao',
  '厄瓜多尔 (Ecuador)': 'Ecuador',
  '德国 (Germany)': 'Germany',
  '科特迪瓦 (Ivory Coast)': 'Ivory Coast',
  '日本 (Japan)': 'Japan',
  '荷兰 (Netherlands)': 'Netherlands',
  '瑞典 (Sweden)': 'Sweden',
  '突尼斯 (Tunisia)': 'Tunisia',
  '比利时 (Belgium)': 'Belgium',
  '埃及 (Egypt)': 'Egypt',
  '伊朗 (Iran)': 'Iran',
  '新西兰 (New Zealand)': 'New Zealand',
  '佛得角 (Cape Verde)': 'Cape Verde',
  '沙特阿拉伯 (Saudi Arabia)': 'Saudi Arabia',
  '西班牙 (Spain)': 'Spain',
  '乌拉圭 (Uruguay)': 'Uruguay',
  '法国 (France)': 'France',
  '伊拉克 (Iraq)': 'Iraq',
  '挪威 (Norway)': 'Norway',
  '塞内加尔 (Senegal)': 'Senegal',
  '阿尔及利亚 (Algeria)': 'Algeria',
  '阿根廷 (Argentina)': 'Argentina',
  '奥地利 (Austria)': 'Austria',
  '约旦 (Jordan)': 'Jordan',
  '哥伦比亚 (Colombia)': 'Colombia',
  '刚果民主共和国 (DR Congo)': 'DR Congo',
  '葡萄牙 (Portugal)': 'Portugal',
  '乌兹别克斯坦 (Uzbekistan)': 'Uzbekistan',
  '克罗地亚 (Croatia)': 'Croatia',
  '英格兰足球代表队 (England)': 'England',
  '加纳 (Ghana)': 'Ghana',
  '巴拿马 (Panama)': 'Panama',
};

// Coach name patterns to extract from TEAM_INTROS
// TEAM_INTROS mentions coaches like "库贝克执教的捷克" or "阿吉雷第三次执教墨西哥"

// Extract coach mentions
// Pattern: name followed by 执教
const coachPatterns = {
  'Czech Republic': '库贝克',
  'Mexico': '阿吉雷',
  'South Africa': '布罗斯',
  'South Korea': '洪明甫',
  'Bosnia and Herzegovina': '巴尔巴雷兹',
  'Canada': '马什',
  'Qatar': '洛佩特吉',
  'Switzerland': '雅金',
  'Brazil': '安切洛蒂',
  'Haiti': '米涅',
  'Morocco': '奥瓦比',
  'Scotland': '克拉克',
  'Australia': '波波维奇',
  'Paraguay': '阿尔法罗',
  'Turkey': '蒙特拉',
  'United States': '波切蒂诺',
  'Curaçao': '阿德沃卡特',
  'Ecuador': '贝卡塞塞',
  'Germany': '纳格尔斯曼',
  'Ivory Coast': '法埃',
  'Japan': '森保一',
  'Netherlands': '科曼',
  'Sweden': '波特',
  'Tunisia': '拉穆奇',
  'Belgium': '加西亚',
  'Egypt': '哈桑',
  'Iran': '加莱诺埃',
  'New Zealand': '贝兹利',
  'Cape Verde': '布比斯塔',
  'Saudi Arabia': '多尼斯',
  'Spain': '德拉富恩特',
  'Uruguay': '贝尔萨',
  'France': '德尚',
  'Iraq': '阿诺德',
  'Norway': '索尔巴肯',
  'Senegal': '蒂奥',
  'Algeria': '佩特科维奇',
  'Argentina': '斯卡洛尼',
  'Austria': '朗尼克',
  'Jordan': '塞拉米',
  'Colombia': '洛伦索',
  'DR Congo': '德萨布雷',
  'Portugal': '马丁内斯',
  'Uzbekistan': '卡纳瓦罗',
  'Croatia': '达利奇',
  'England': '图赫尔',
  'Ghana': '奎罗斯',
  'Panama': '克里斯蒂安森',
};

let totalMismatches = 0;

for (const section of sections) {
  // Extract team name
  const teamLine = section.split('\n')[0].trim();
  const enName = teamMap[teamLine];
  if (!enName) {
    console.log(`WARNING: Could not map team: ${teamLine}`);
    continue;
  }

  const squad = squads.find(s => s.name === enName);
  if (!squad) {
    console.log(`WARNING: No squad found for: ${enName}`);
    continue;
  }

  // Check coach
  const coachCN = coachPatterns[enName];
  const squadCoach = squad.coach;
  if (coachCN) {
    const coachNameMap = {
      '库贝克': 'Miroslav Koubek',
      '阿吉雷': 'Javier Aguirre',
      '布罗斯': 'Hugo Broos',
      '洪明甫': 'Hong Myung-bo',
      '巴尔巴雷兹': 'Sergej Barbarez',
      '马什': 'Jesse Marsch',
      '洛佩特吉': 'Julen Lopetegui',
      '雅金': 'Murat Yakin',
      '安切洛蒂': 'Carlo Ancelotti',
      '米涅': 'Sébastien Migné',
      '奥瓦比': 'Mohamed Ouahbi',
      '克拉克': 'Steve Clarke',
      '波波维奇': 'Tony Popovic',
      '阿尔法罗': 'Gustavo Alfaro',
      '蒙特拉': 'Vincenzo Montella',
      '波切蒂诺': 'Mauricio Pochettino',
      '阿德沃卡特': 'Dick Advocaat',
      '贝卡塞塞': 'Sebastián Beccacece',
      '纳格尔斯曼': 'Julian Nagelsmann',
      '法埃': 'Emerse Faé',
      '森保一': 'Hajime Moriyasu',
      '科曼': 'Ronald Koeman',
      '波特': 'Graham Potter',
      '拉穆奇': 'Faouzi Benzarti',
      '加西亚': 'Rudi Garcia',
      '哈桑': 'Hossam Hassan',
      '加莱诺埃': 'Amir Ghalenoei',
      '贝兹利': 'Darren Bazeley',
      '布比斯塔': 'Bubista',
      '多尼斯': 'Georgios Donis',
      '德拉富恩特': 'Luis de la Fuente',
      '贝尔萨': 'Marcelo Bielsa',
      '德尚': 'Didier Deschamps',
      '阿诺德': 'Graham Arnold',
      '索尔巴肯': 'Ståle Solbakken',
      '蒂奥': 'Pape Thiaw',
      '佩特科维奇': 'Vladimir Petković',
      '斯卡洛尼': 'Lionel Scaloni',
      '朗尼克': 'Ralf Rangnick',
      '塞拉米': 'Jamal Sellami',
      '洛伦索': 'Néstor Lorenzo',
      '德萨布雷': 'Sébastien Desabre',
      '马丁内斯': 'Roberto Martínez',
      '卡纳瓦罗': 'Fabio Cannavaro',
      '达利奇': 'Zlatko Dalić',
      '图赫尔': 'Thomas Tuchel',
      '奎罗斯': 'Carlos Queiroz',
      '克里斯蒂安森': 'Thomas Christiansen',
    };
    const expectedCoach = coachNameMap[coachCN];
    if (expectedCoach && squadCoach !== expectedCoach) {
      console.log(`\nCOACH MISMATCH [${enName}]:`);
      console.log(`  TEAM_INTROS mentions: ${coachCN} (=> ${expectedCoach})`);
      console.log(`  squads.json says:     ${squadCoach}`);
      totalMismatches++;
    } else if (expectedCoach) {
      // console.log(`  COACH OK [${enName}]: ${coachCN} = ${squadCoach}`);
    }
  }

  // Now extract all player mentions with caps
  const content = section;
  // Match pattern: ChineseName（数字场，Club） or ChineseName（数字场）
  const playerRegex = /([^\（\n]+)（(\d+)场(?:[，,)])*\s*([^）]*?)）/g;
  let match;
  while ((match = playerRegex.exec(content)) !== null) {
    const cnName = match[1].trim();
    const capsFromMD = parseInt(match[2]);
    const clubFromMD = match[3] ? match[3].trim().replace(/[，,]/g, '').trim() : '';

    // Skip if Chinese name is empty or it's a false match
    if (!cnName || cnName.length === 0) continue;

    // Chinese name -> English name mapping
    const nameMap = {
      // A组
      '绍切克': { en: 'Tomáš Souček', team: 'Czech Republic' },
      '曹法尔': { en: 'Vladimír Coufal', team: 'Czech Republic' },
      '希克': { en: 'Patrik Schick', team: 'Czech Republic' },
      '奥乔亚': { en: 'Guillermo Ochoa', team: 'Mexico' },
      '希门尼斯': { en: 'Raúl Jiménez', team: 'Mexico' },
      '阿尔瓦雷斯': { en: 'Edson Álvarez', team: 'Mexico' },
      '皮内达': { en: 'Orbelín Pineda', team: 'Mexico' },
      '威廉姆斯': { en: 'Ronwen Williams', team: 'South Africa' },
      '兹瓦内': { en: 'Themba Zwane', team: 'South Africa' },
      '莫科纳': { en: 'Teboho Mokoena', team: 'South Africa' },
      '孙兴慜': { en: 'Son Heung-min', team: 'South Korea' },
      '金玟哉': { en: 'Kim Min-jae', team: 'South Korea' },
      '黄喜灿': { en: 'Hwang Hee-chan', team: 'South Korea' },
      '李在城': { en: 'Lee Jae-sung', team: 'South Korea' },
      // B组
      '哲科': { en: 'Edin Džeko', team: 'Bosnia and Herzegovina' },
      '科拉希纳茨': { en: 'Sead Kolašinac', team: 'Bosnia and Herzegovina' },
      '德米罗维奇': { en: 'Ermedin Demirović', team: 'Bosnia and Herzegovina' },
      '阿方索·戴维斯': { en: 'Alphonso Davies', team: 'Canada' },
      '戴维斯': { en: 'Alphonso Davies', team: 'Canada' },
      '乔纳森·戴维': { en: 'Jonathan David', team: 'Canada' },
      '拉林': { en: 'Cyle Larin', team: 'Canada' },
      '布坎南': { en: 'Tajon Buchanan', team: 'Canada' },
      '阿尔-海多斯': { en: 'Hassan Al-Haydos', team: 'Qatar' },
      '阿菲夫': { en: 'Akram Afif', team: 'Qatar' },
      '布迪亚夫': { en: 'Karim Boudiaf', team: 'Qatar' },
      '扎卡': { en: 'Granit Xhaka', team: 'Switzerland' },
      '阿坎吉': { en: 'Manuel Akanji', team: 'Switzerland' },
      '恩博洛': { en: 'Breel Embolo', team: 'Switzerland' },
      // C组
      '内马尔': { en: 'Neymar', team: 'Brazil' },
      '维尼修斯': { en: 'Vinícius Júnior', team: 'Brazil' },
      '拉菲尼亚': { en: 'Raphinha', team: 'Brazil' },
      '恩德里克': { en: 'Endrick', team: 'Brazil' },
      '卡塞米罗': { en: 'Casemiro', team: 'Brazil' },
      '布鲁诺·吉马良斯': { en: 'Bruno Guimarães', team: 'Brazil' },
      '吉马良斯': { en: 'Bruno Guimarães', team: 'Brazil' },
      '阿利松': { en: 'Alisson', team: 'Brazil' },
      '纳宗': { en: 'Duckens Nazon', team: 'Haiti' },
      '普拉西德': { en: 'Johny Placide', team: 'Haiti' },
      '阿什拉夫': { en: 'Achraf Hakimi', team: 'Morocco' },
      '布努': { en: 'Yassine Bounou', team: 'Morocco' },
      '阿姆拉巴特': { en: 'Sofyan Amrabat', team: 'Morocco' },
      '埃尔卡比': { en: 'Ayoub El Kaabi', team: 'Morocco' },
      '罗伯逊': { en: 'Andy Robertson', team: 'Scotland' },
      '麦金': { en: 'John McGinn', team: 'Scotland' },
      '麦克托米奈': { en: 'Scott McTominay', team: 'Scotland' },
      // D组
      '瑞安': { en: 'Mathew Ryan', team: 'Australia' },
      '欧文': { en: 'Jackson Irvine', team: 'Australia' },
      '莱基': { en: 'Mathew Leckie', team: 'Australia' },
      '古斯塔沃·戈麦斯': { en: 'Gustavo Gómez', team: 'Paraguay' },
      '阿尔米隆': { en: 'Miguel Almirón', team: 'Paraguay' },
      '恰尔汗奥卢': { en: 'Hakan Çalhanoğlu', team: 'Turkey' },
      '德米拉尔': { en: 'Merih Demiral', team: 'Turkey' },
      '瑟云居': { en: 'Çağlar Söyüncü', team: 'Turkey' },
      '普利西奇': { en: 'Christian Pulisic', team: 'United States' },
      '麦肯尼': { en: 'Weston McKennie', team: 'United States' },
      '里姆': { en: 'Tim Ream', team: 'United States' },
      // E组
      '巴库纳': { en: 'Leandro Bacuna', team: 'Curaçao' }, // ambiguous, but elder brother
      '莱安德罗': { en: 'Leandro Bacuna', team: 'Curaçao' },
      '尤尼尼奥': { en: 'Juninho Bacuna', team: 'Curaçao' },
      '罗姆': { en: 'Eloy Room', team: 'Curaçao' },
      '恩纳·瓦伦西亚': { en: 'Enner Valencia', team: 'Ecuador' },
      '瓦伦西亚': { en: 'Enner Valencia', team: 'Ecuador' },
      '凯塞多': { en: 'Moisés Caicedo', team: 'Ecuador' },
      '埃斯图皮尼安': { en: 'Pervis Estupiñán', team: 'Ecuador' },
      '诺伊尔': { en: 'Manuel Neuer', team: 'Germany' },
      '基米希': { en: 'Joshua Kimmich', team: 'Germany' },
      '吕迪格': { en: 'Antonio Rüdiger', team: 'Germany' },
      '穆西亚拉': { en: 'Jamal Musiala', team: 'Germany' },
      '维尔茨': { en: 'Florian Wirtz', team: 'Germany' },
      '萨内': { en: 'Leroy Sané', team: 'Germany' },
      '凯西': { en: 'Franck Kessié', team: 'Ivory Coast' },
      '桑加雷': { en: 'Ibrahim Sangaré', team: 'Ivory Coast' },
      '佩佩': { en: 'Nicolas Pépé', team: 'Ivory Coast' },
      // F组
      '长友佑都': { en: 'Yuto Nagatomo', team: 'Japan' },
      '久保建英': { en: 'Takefusa Kubo', team: 'Japan' },
      '镰田大地': { en: 'Daichi Kamada', team: 'Japan' },
      '伊东纯也': { en: 'Junya Ito', team: 'Japan' },
      '范戴克': { en: 'Virgil van Dijk', team: 'Netherlands' },
      '德佩': { en: 'Memphis Depay', team: 'Netherlands' },
      '弗伦基·德容': { en: 'Frenkie de Jong', team: 'Netherlands' },
      '德容': { en: 'Frenkie de Jong', team: 'Netherlands' },
      '邓弗里斯': { en: 'Denzel Dumfries', team: 'Netherlands' },
      '伊萨克': { en: 'Alexander Isak', team: 'Sweden' },
      '哲凯赖什': { en: 'Viktor Gyökeres', team: 'Sweden' },
      '林德洛夫': { en: 'Victor Lindelöf', team: 'Sweden' },
      '斯希里': { en: 'Ellyes Skhiri', team: 'Tunisia' },
      '梅杰布里': { en: 'Hannibal Mejbri', team: 'Tunisia' },
      // G组
      '德布劳内': { en: 'Kevin De Bruyne', team: 'Belgium' },
      '卢卡库': { en: 'Romelu Lukaku', team: 'Belgium' },
      '库尔图瓦': { en: 'Thibaut Courtois', team: 'Belgium' },
      '蒂莱曼斯': { en: 'Youri Tielemans', team: 'Belgium' },
      '维特塞尔': { en: 'Axel Witsel', team: 'Belgium' },
      '萨拉赫': { en: 'Mohamed Salah', team: 'Egypt' },
      '特雷泽盖': { en: 'Trézéguet', team: 'Egypt' },
      '齐佐': { en: 'Ahmed Sayed Zizo', team: 'Egypt' },
      '埃尔-舍纳维': { en: 'Mohamed El Shenawy', team: 'Egypt' },
      '哈吉萨菲': { en: 'Ehsan Hajsafi', team: 'Iran' },
      '塔雷米': { en: 'Mehdi Taremi', team: 'Iran' },
      '贾汉巴赫什': { en: 'Alireza Jahanbakhsh', team: 'Iran' },
      '贝兰万德': { en: 'Alireza Beiranvand', team: 'Iran' },
      '伍德': { en: 'Chris Wood', team: 'New Zealand' },
      '巴巴鲁斯': { en: 'Tommy Smith', team: 'New Zealand' },
      // H组
      '门德斯': { en: 'Leandro Mendes', team: 'Cape Verde' },  // Cap Verde uses Leandro Mendes
      '蒙泰罗': { en: 'Nuno Moreira', team: 'Cape Verde' }, // possible ambiguity
      '沃济尼亚': { en: 'Vozinha', team: 'Cape Verde' },
      '阿尔-多萨里': { en: 'Salem Al-Dawsari', team: 'Saudi Arabia' },
      '卡诺': { en: 'Mohamed Kanno', team: 'Saudi Arabia' },
      '阿尔-奥维斯': { en: 'Mohammed Al-Owais', team: 'Saudi Arabia' },
      '罗德里': { en: 'Rodri', team: 'Spain' },
      '亚马尔': { en: 'Lamine Yamal', team: 'Spain' },
      '奥尔莫': { en: 'Dani Olmo', team: 'Spain' },
      '奥亚萨瓦尔': { en: 'Mikel Oyarzabal', team: 'Spain' },
      '巴尔韦德': { en: 'Federico Valverde', team: 'Uruguay' },
      '本坦库尔': { en: 'Rodrigo Bentancur', team: 'Uruguay' },
      '努涅斯': { en: 'Darwin Núñez', team: 'Uruguay' },
      '希门尼斯': { en: 'José María Giménez', team: 'Uruguay' },
      '穆斯莱拉': { en: 'Fernando Muslera', team: 'Uruguay' },
      // I组
      '姆巴佩': { en: 'Kylian Mbappé', team: 'France' },
      '登贝莱': { en: 'Ousmane Dembélé', team: 'France' },
      '奥利塞': { en: 'Michael Olise', team: 'France' },
      '巴尔科拉': { en: 'Bradley Barcola', team: 'France' },
      '杜埃': { en: 'Désiré Doué', team: 'France' },
      '楚阿梅尼': { en: 'Aurélien Tchouaméni', team: 'France' },
      '坎特': { en: "N'Golo Kanté", team: 'France' },
      '扎伊尔-埃梅里': { en: 'Warren Zaïre-Emery', team: 'France' },
      '谢尔基': { en: 'Rayan Cherki', team: 'France' },
      '萨利巴': { en: 'William Saliba', team: 'France' },
      '科纳特': { en: 'Ibrahima Konaté', team: 'France' },
      '于帕梅卡诺': { en: 'Dayot Upamecano', team: 'France' },
      '迈尼昂': { en: 'Mike Maignan', team: 'France' },
      '哈桑': { en: 'Jalal Hassan', team: 'Iraq' },
      '侯赛因': { en: 'Aymen Hussein', team: 'Iraq' },
      '阿里': { en: 'Ali Al-Hamadi', team: 'Iraq' },
      '哈兰德': { en: 'Erling Haaland', team: 'Norway' },
      '厄德高': { en: 'Martin Ødegaard', team: 'Norway' },
      '瑟洛特': { en: 'Alexander Sørloth', team: 'Norway' },
      '贝格': { en: 'Patrick Berg', team: 'Norway' },
      '阿耶尔': { en: 'Kristoffer Ajer', team: 'Norway' },
      '马内': { en: 'Sadio Mané', team: 'Senegal' },
      '格耶': { en: 'Idrissa Gueye', team: 'Senegal' },
      '盖耶': { en: 'Idrissa Gueye', team: 'Senegal' },
      '库利巴利': { en: 'Kalidou Koulibaly', team: 'Senegal' },
      '萨尔': { en: 'Ismaïla Sarr', team: 'Senegal' },
      // J组
      '曼迪': { en: 'Aïssa Mandi', team: 'Algeria' },
      '马赫雷斯': { en: 'Riyad Mahrez', team: 'Algeria' },
      '本塞拜尼': { en: 'Ramy Bensebaini', team: 'Algeria' },
      '本塔莱布': { en: 'Adem Ben Taleb', team: 'Algeria' }, // approximate
      '梅西': { en: 'Lionel Messi', team: 'Argentina' },
      '劳塔罗·马丁内斯': { en: 'Lautaro Martínez', team: 'Argentina' },
      '阿尔瓦雷斯': { en: 'Julián Álvarez', team: 'Argentina' },
      '德保罗': { en: 'Rodrigo De Paul', team: 'Argentina' },
      '恩佐·费尔南德斯': { en: 'Enzo Fernández', team: 'Argentina' },
      '麦卡利斯特': { en: 'Alexis Mac Allister', team: 'Argentina' },
      '奥塔门迪': { en: 'Nicolás Otamendi', team: 'Argentina' },
      '罗梅罗': { en: 'Cristian Romero', team: 'Argentina' },
      '利桑德罗·马丁内斯': { en: 'Lisandro Martínez', team: 'Argentina' },
      '大马丁': { en: 'Emiliano Martínez', team: 'Argentina' },
      '阿瑙托维奇': { en: 'Marko Arnautović', team: 'Austria' },
      '阿拉巴': { en: 'David Alaba', team: 'Austria' },
      '萨比策': { en: 'Marcel Sabitzer', team: 'Austria' },
      '阿尔-塔马里': { en: 'Mousa Al-Tamari', team: 'Jordan' },
      '阿布拉伊拉': { en: 'Yazeed Abulaila', team: 'Jordan' },
      '阿尔-阿拉伯': { en: 'Yazan Al-Arab', team: 'Jordan' },
      // K组
      'J罗': { en: 'James Rodríguez', team: 'Colombia' },
      '哈梅斯': { en: 'James Rodríguez', team: 'Colombia' },
      '迪亚斯': { en: 'Luis Díaz', team: 'Colombia' },
      '奥斯皮纳': { en: 'David Ospina', team: 'Colombia' },
      '姆本巴': { en: 'Chancel Mbemba', team: 'DR Congo' },
      '巴坎布': { en: 'Cédric Bakambu', team: 'DR Congo' },
      '埃利亚': { en: 'Meschack Elia', team: 'DR Congo' },
      'C罗': { en: 'Cristiano Ronaldo', team: 'Portugal' },
      'B席': { en: 'Bernardo Silva', team: 'Portugal' },
      'B费': { en: 'Bruno Fernandes', team: 'Portugal' },
      '鲁本·迪亚斯': { en: 'Rúben Dias', team: 'Portugal' },
      '坎塞洛': { en: 'João Cancelo', team: 'Portugal' },
      '肖穆罗多夫': { en: 'Eldor Shomurodov', team: 'Uzbekistan' },
      '舒库罗夫': { en: 'Otabek Shukurov', team: 'Uzbekistan' },
      '谢尔盖耶夫': { en: 'Igor Sergeyev', team: 'Uzbekistan' },
      '马沙里波夫': { en: 'Jaloliddin Masharipov', team: 'Uzbekistan' },
      // L组
      '莫德里奇': { en: 'Luka Modrić', team: 'Croatia' },
      '佩里西奇': { en: 'Ivan Perišić', team: 'Croatia' },
      '科瓦契奇': { en: 'Mateo Kovačić', team: 'Croatia' },
      '格瓦迪奥尔': { en: 'Joško Gvardiol', team: 'Croatia' },
      '凯恩': { en: 'Harry Kane', team: 'England' },
      '贝林厄姆': { en: 'Jude Bellingham', team: 'England' },
      '赖斯': { en: 'Declan Rice', team: 'England' },
      '皮克福德': { en: 'Jordan Pickford', team: 'England' },
      '乔丹·阿尤': { en: 'Jordan Ayew', team: 'Ghana' },
      '帕尔特伊': { en: 'Thomas Partey', team: 'Ghana' },
      '萨梅尼奥': { en: 'Antoine Semenyo', team: 'Ghana' },
      '戈多伊': { en: 'Aníbal Godoy', team: 'Panama' },
      '金特罗': { en: 'Alberto Quintero', team: 'Panama' },
      '巴尔塞纳斯': { en: 'Yoel Bárcenas', team: 'Panama' },
      '埃斯科瓦尔': { en: 'Fidel Escobar', team: 'Panama' },
    };

    const mapped = nameMap[cnName];
    if (!mapped) {
      // Try to find by caps in the current team
      const found = findPlayerByCaps(squad.players, capsFromMD);
      if (found) {
        console.log(`  POSSIBLE MATCH [${enName}]: ${cnName} (${capsFromMD}场) -> ${found.name} caps=${found.caps} club=${found.club}`);
        continue;
      }
      console.log(`  UNMAPPED [${enName}]: ${cnName} (${capsFromMD}场) club="${clubFromMD}"`);
      continue;
    }

    // Only process if the mapping belongs to this team
    if (mapped.team !== enName) continue;

    const enPlayerName = mapped.en;
    const found = squad.players.find(p => p.name === enPlayerName);

    if (!found) {
      console.log(`  NOT IN SQUAD [${enName}]: ${cnName} -> ${enPlayerName} NOT FOUND`);
      totalMismatches++;
      continue;
    }

    // Check caps
    const capsMatch = found.caps === capsFromMD;
    const clubFromSquad = found.club;

    // Chinese club name -> English club name mapping
    const clubMap = {
      '西汉姆联': 'West Ham United',
      '勒沃库森': 'Bayer Leverkusen',
      '热刺': 'Tottenham Hotspur',
      '拜仁': 'Bayern Munich',
      '拜仁慕尼黑': 'Bayern Munich',
      '狼队': 'Wolverhampton Wanderers',
      '费内巴切': 'Fenerbahçe',
      '沙尔克04': 'Schalke 04',
      '曼城': 'Manchester City',
      '桑德兰': 'Sunderland',
      '国米': 'Inter Milan',
      '国际米兰': 'Inter Milan',
      '皇马': 'Real Madrid',
      '巴萨': 'Barcelona',
      '巴塞罗那': 'Barcelona',
      '里昂': 'Lyon',
      '曼联': 'Manchester United',
      '纽卡': 'Newcastle United',
      '利物浦': 'Liverpool',
      '巴黎': 'Paris Saint-Germain',
      '巴黎圣日耳曼': 'Paris Saint-Germain',
      '米兰': 'AC Milan',
      'AC米兰': 'AC Milan',
      '尤文': 'Juventus',
      '尤文图斯': 'Juventus',
      '切尔西': 'Chelsea',
      '布莱顿': 'Brighton & Hove Albion',
      '皇家社会': 'Real Sociedad',
      '水晶宫': 'Crystal Palace',
      '法兰克福': 'Eintracht Frankfurt',
      '诺丁汉森林': 'Nottingham Forest',
      '葡萄牙体育': 'Sporting CP',
      '阿森纳': 'Arsenal',
      '马竞': 'Atlético Madrid',
      '马德里竞技': 'Atlético Madrid',
      '阿斯顿维拉': 'Aston Villa',
      '维拉': 'Aston Villa',
      '那不勒斯': 'Napoli',
      '多特蒙德': 'Borussia Dortmund',
      '多特': 'Borussia Dortmund',
      '利雅得新月': 'Al-Hilal',
      '利雅得胜利': 'Al-Nassr',
      '迈阿密国际': 'Inter Miami CF',
      '埃弗顿': 'Everton',
      '弗拉门戈': 'Flamengo',
      '桑托斯': 'Santos',
      '明尼苏达联': 'Minnesota United FC',
      '吉达国民': 'Al-Ahli',
      '国民竞技': 'Atlético Nacional',
      '巴斯蒂亚': 'Bastia',
      '德黑兰独立': 'Esteghlal',
      '帕丘卡': 'Pachuca',
      '本菲卡': 'Benfica',
      '拉普拉塔大学生': 'Estudiantes',
      '马梅洛迪日落': 'Mamelodi Sundowns',
      '萨德': 'Al-Sadd',
      '杜海勒': 'Al-Duhail',
      '莱万特': 'Levante',
      '圣保利': 'FC St. Pauli',
      '墨尔本城': 'Melbourne City',
      '帕尔梅拉斯': 'Palmeiras',
      '亚特兰大联': 'Atlanta United FC',
      '希腊雅典AEK': 'AEK Athens',
      '雅典AEK': 'AEK Athens',
      '瓜达拉哈拉': 'Guadalajara',
      '莫斯科火车头': 'Lokomotiv Moscow',
      '热那亚': 'Genoa',
      '奥林匹亚科斯': 'Olympiacos',
      '希腊': 'Olympiacos',
      '皇家贝蒂斯': 'Real Betis',
      '比利亚雷亚尔': 'Villarreal',
      '美职联': 'Los Angeles FC',
      '洛杉矶FC': 'Los Angeles FC',
      '雷恩': 'Rennes',
      '利雅得': 'Al-Hilal', // ambiguous
      '伯恩利': 'Burnley',
      '卡尔玛': 'Karma',
      '迪巴巴': 'Dibba',
      '扎乌拉': 'Al-Zawraa',
      '法兰克': 'Eintracht Frankfurt',
      '圣迭戈FC': 'San Diego FC',
      '阿马多尔广场': 'Plaza Amador',
      '莱斯特城': 'Leicester City',
      '阿尔侯赛因': 'Al-Hussein',
      '巴萨克赛尔': 'İstanbul Başakşehir',
      '科林蒂安': 'Corinthians',
      '阿赫利': 'Al Ahly',
      '加拉塔萨雷': 'Galatasaray',
      '厄德尔': 'Iğdır FK',
      '福伦丹': 'FC Volendam',
      '迈阿密FC': 'Miami FC',
      '博洛尼亚': 'Bologna',
      'PSV埃因霍温': 'PSV Eindhoven',
      '贝尔格莱德红星': 'Red Star Belgrade',
      '色格拉布鲁日': 'Cercle Brugge',
      '霍芬海姆': 'TSG Hoffenheim',
      '比尔森胜利': 'Viktoria Plzeň',
      '亚特兰大': 'Atalanta',
      '斯图加特': 'VfB Stuttgart',
      '南安普顿': 'Southampton',
      '华沙莱吉亚': 'Legia Warsaw',
      '兹沃勒': 'PEC Zwolle',
      '马赛': 'Olympique Marseille',
      '斯巴达': 'Sparta Prague',
      '布拉格斯巴达': 'Sparta Prague',
      '斯拉维亚': 'Slavia Prague',
      '布拉格斯拉维亚': 'Slavia Prague',
      'AEL利马索尔': 'AEL Limassol',
      '富勒姆': 'Fulham',
    };

    const clubEnFromMD = clubFromMD ? clubMap[clubFromMD] : '';

    let hasIssue = false;
    let issueDesc = '';

    if (!capsMatch) {
      hasIssue = true;
      issueDesc += `CAPS MISMATCH: MD=${capsFromMD} vs squad=${found.caps}`;
    }

    if (clubFromMD && clubEnFromMD && clubEnFromMD !== clubFromSquad) {
      if (hasIssue) issueDesc += '; ';
      hasIssue = true;
      issueDesc += `CLUB MISMATCH: MD="${clubFromMD}" (=> ${clubEnFromMD}) vs squad="${clubFromSquad}"`;
    }

    if (hasIssue) {
      console.log(`\nDISCREPANCY [${enName}]:`);
      console.log(`  Player: ${cnName} (${mapped.en})`);
      console.log(`  ${issueDesc}`);
      totalMismatches++;
    }
  }

  // Check club mentions in text (not in brackets) - e.g. "哲科依然在费内巴切保持高水平"
  // These are harder to extract systematically, so I'll note them manually
}

console.log(`\n\n===== TOTAL DISCREPANCIES: ${totalMismatches} =====`);
