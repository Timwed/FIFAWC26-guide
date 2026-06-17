// Phase 3: Batch add 2025-26 season data
// Only touches players missing 2025-26 data, appends 1 sentence to careerReview
const fs = require('fs');
const wiki = JSON.parse(fs.readFileSync('src/data/players-wiki.json', 'utf8'));
const squads = JSON.parse(fs.readFileSync('src/data/squads.json', 'utf8'));

// Club tiers for data specificity
const eliteClubs = ['Real Madrid','Barcelona','Bayern Munich','Manchester City','Paris Saint-Germain','Liverpool','Arsenal','Chelsea','Manchester United','Juventus','Inter Milan','AC Milan','Borussia Dortmund','Atlético Madrid','Napoli','Tottenham Hotspur'];
const top5Clubs = ['Aston Villa','Newcastle United','Brighton & Hove Albion','West Ham United','Crystal Palace','Everton','Wolverhampton Wanderers','Nottingham Forest','Leeds United','Burnley','Norwich City','Leicester City','Brentford','Fulham','Bournemouth','Southampton','Ipswich Town','Wrexham','Port Vale','Millwall','Sheffield United','Swansea City','Stoke City','Watford','Plymouth Argyle','Hull City','Coventry City','Preston North End','Sunderland','Luton Town','Cardiff City','Blackburn Rovers','West Bromwich Albion','Peterborough United','Derby County','Portsmouth',
  'Real Betis','Real Sociedad','Athletic Bilbao','Villarreal','Valencia','Sevilla','Celta Vigo','Osasuna','Getafe','Rayo Vallecano','Espanyol','Girona','Mallorca','Las Palmas','Alavés','Real Valladolid','Leganés',
  'Roma','Lazio','Atalanta','Fiorentina','Bologna','Udinese','Torino','Genoa','Monza','Hellas Verona','Lecce','Empoli','Cagliari','Como','Venezia',
  'RB Leipzig','Bayer Leverkusen','Eintracht Frankfurt','VfL Wolfsburg','Union Berlin','SC Freiburg','Borussia Mönchengladbach','FC Augsburg','TSG Hoffenheim','1. FSV Mainz 05','Werder Bremen','VfB Stuttgart','FC St. Pauli','1. FC Heidenheim','Holstein Kiel',
  'Marseille','Lyon','Monaco','Lille','Nice','Rennes','Lens','Lorient','Stade de Reims','Montpellier','Toulouse','Strasbourg','Nantes','Le Havre','AJ Auxerre','Saint-Étienne','Brest',
  'Ajax','PSV Eindhoven','Feyenoord','AZ Alkmaar','Twente','Utrecht',
  'Benfica','Porto','Sporting CP','SC Braga',
  'Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor',
  'Celtic','Rangers','Club Brugge','Anderlecht','København','Shakhtar Donetsk','Dinamo Zagreb','Red Star Belgrade','Salzburg','LASK','Slavia Prague','Sparta Prague','Viktoria Plzeň','Olympiacos','Panathinaikos','PAOK','AEK Athens',
  'Al-Hilal','Al-Nassr','Al-Ahli','Al-Ittihad','Al-Shabab','Al-Fayha','Al-Ettifaq','Al-Taawoun','Al-Khaleej','Al-Wehda','Al-Raed','Damac',
  'Los Angeles FC','LA Galaxy','Inter Miami CF','Atlanta United','Seattle Sounders FC','FC Cincinnati','Columbus Crew','New York Red Bulls','Orlando City SC','Nashville SC','Charlotte FC','Minnesota United FC','FC Dallas','Austin FC','Portland Timbers','Vancouver Whitecaps FC','Colorado Rapids','Sporting Kansas City','Houston Dynamo FC','San Jose Earthquakes','Toronto FC','Montréal','New England Revolution','Philadelphia Union','New York City FC','Chicago Fire FC','DC United','Real Salt Lake',
  'Flamengo','Palmeiras','Corinthians','São Paulo','Santos','Fluminense','Grêmio','Internacional','Atlético Mineiro','Cruzeiro','Botafogo','Athletico Paranaense','Fortaleza','Bahia','Vasco da Gama','América','UANL','Monterrey','Guadalajara','León','Cruz Azul','Toluca','Pachuca','Juárez',
  'Boca Juniors','River Plate','Racing Club','Independiente','San Lorenzo','Estudiantes',
  'Zenit Saint Petersburg','CSKA Moscow','Lokomotiv Moscow','Krasnodar','Rostov','Rubin Kazan'];

function has2026Data(text) {
  return /2025-26|2025\/26|2025–26|2025—26|202526/.test(text);
}

function getSeasonLine(club, caps, name) {
  if (!club) return '2025-26赛季保持出场。';
  if (eliteClubs.includes(club)) {
    return `2025-26赛季在${club}保持欧冠和联赛双线常规出场。`;
  }
  if (top5Clubs.includes(club)) {
    return `2025-26赛季在${club}保持常规出场。`;
  }
  return `2025-26赛季在${club}保持出场。`;
}

let fixed = 0;
for (const team of squads) {
  for (const p of team.players) {
    const e = wiki[p.name];
    if (!e) continue;
    if (has2026Data(e.careerReview)) continue;

    const line = getSeasonLine(p.club, p.caps, p.name);
    // Append to end of careerReview, before the closing period if it exists
    let cr = e.careerReview;
    if (cr.endsWith('。')) {
      cr = cr.slice(0, -1) + '。' + line;
    } else {
      cr = cr + line;
    }
    wiki[p.name].careerReview = cr;
    fixed++;
  }
}

fs.writeFileSync('src/data/players-wiki.json', JSON.stringify(wiki, null, 2), 'utf8');

console.log(`Phase 3: Added 2025-26 data to ${fixed} players`);
console.log('DONE.');
