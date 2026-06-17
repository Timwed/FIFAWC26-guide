/**
 * assign-tiers.js
 * Assign S/A/B/C tiers to all 1248 players based on:
 * 1. Club quality (league tier + elite club bonus)
 * 2. International caps/goals
 * 3. Team-strength–based tier budget
 *
 * Writes tier field directly into squads.json players.
 */

const fs = require('fs');
const path = require('path');

const squadsPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');
const squads = JSON.parse(fs.readFileSync(squadsPath, 'utf8'));

// ─── LEAGUE TIERS (base scores) ───────────────────────────
// Score 10: Elite clubs in top leagues
// Score 9-7: Top 5 league regulars
// Score 6-5: Good European leagues + top non-European
// Score 4-3: Decent leagues
// Score 2-1: Lower leagues

function getClubScore(club) {
  const c = club.trim();
  const elite = [
    'Real Madrid', 'Barcelona', 'Atlético Madrid',
    'Manchester City', 'Manchester United', 'Arsenal', 'Liverpool', 'Chelsea', 'Tottenham Hotspur',
    'Bayern Munich', 'Borussia Dortmund',
    'Paris Saint-Germain',
    'Inter Milan', 'Juventus', 'Milan', 'AC Milan', 'Napoli', 'Atalanta',
  ];
  if (elite.includes(c)) return 10;

  const tier2 = [
    'Aston Villa', 'Newcastle United', 'Bayer Leverkusen', 'RB Leipzig',
    'Monaco', 'Lille', 'Marseille', 'Lyon',
    'Benfica', 'Porto', 'Sporting CP',
    'Ajax', 'PSV Eindhoven', 'Feyenoord',
    'Galatasaray', 'Fenerbahçe',
    'Brighton & Hove Albion', 'West Ham United',
    'Borussia Mönchengladbach', 'Wolfsburg', 'Eintracht Frankfurt', 'VfB Stuttgart',
    'Roma', 'Lazio', 'Fiorentina', 'Bologna',
    'Villarreal', 'Real Sociedad', 'Real Betis', 'Sevilla', 'Athletic Club', 'Valencia',
    'Shakhtar Donetsk',
    'Celtic', 'Rangers',
    'Club Brugge', 'Anderlecht',
    'Red Bull Salzburg',
    'Olympiacos', 'Panathinaikos',
    'Besiktas',
    'Zenit Saint Petersburg', 'CSKA Moscow',
    'Flamengo', 'Palmeiras', 'São Paulo', 'Santos',
    'River Plate', 'Boca Juniors',
    'Al-Hilal', 'Al-Nassr', 'Al-Ittihad',
    'Cruz Azul', 'América', 'Monterrey',
  ];
  if (tier2.includes(c)) return 8;

  // English Championship / top second-tier European
  const tier3 = [
    'Sunderland', 'Burnley', 'Leeds United', 'Sheffield United', 'Watford', 'Norwich City',
    'Hoffenheim', 'Werder Bremen', 'SC Freiburg', 'Union Berlin', 'Mainz 05', 'Augsburg',
    'Torino', 'Genoa',
    'Celta Vigo', 'Mallorca', 'Osasuna', 'Alavés',
    'Strasbourg', 'Nice', 'Rennes',
    'Braga', 'Vitória Guimarães',
    'AZ Alkmaar', 'Twente', 'Utrecht',
    'Olympique Marsella',
  ];
  if (tier3.includes(c)) return 6;

  // Belgian, Swiss, Austrian, Croatian, Czech, Turkish top clubs + good non-UEFA
  const tier4 = [
    'Genk', 'KAA Gent', 'Royal Antwerp',
    'FC Basel', 'Young Boys',
    'LASK', 'Sturm Graz',
    'Dinamo Zagreb', 'Hajduk Split',
    'Slavia Prague', 'Viktoria Plzeň', 'Sparta Prague',
    'Trabzonspor', 'Istanbul Başakşehir',
    'Maribor', 'FK Partizan', 'Crvena zvezda',
    'PAOK',
    'Copenhagen', 'Midtjylland', 'Brøndby',
    'Malmö FF', 'Djurgårdens IF',
    'Bodø/Glimt', 'Rosenborg', 'Molde',
    'Legia Warsaw', 'Lech Poznań',
    'Ferencváros',
    'Slovan Bratislava',
    'LA Galaxy', 'Inter Miami', 'LAFC', 'Columbus Crew',
    'Al-Qadsiah', 'Al-Ahli',
    'Al Ahly', 'Pyramids FC', 'Zamalek',
    'Mamelodi Sundowns', 'Orlando Pirates', 'Kaizer Chiefs',
    'Urawa Red Diamonds', 'Kashima Antlers', 'Yokohama F. Marinos',
    'Jeonbuk Hyundai Motors', 'Ulsan HD',
    'Shanghai Port', 'Beijing Guoan',
    'Al-Duhail', 'Al-Sadd',
    'Sepahan', 'Esteghlal', 'Persepolis',
  ];
  if (tier4.includes(c)) return 5;

  // Other European professional / top Asian/African/LATAM
  const tier5 = [
    'Hull City', 'Preston North End', 'Coventry City', 'Middlesbrough', 'Bristol City',
    'Heidenheim', 'Holstein Kiel',
    'Venezia', 'Como 1907',
    'Leganés', 'Las Palmas',
    'Angers', 'Le Havre', 'Nantes',
    'NAC Breda', 'PEC Zwolle',
    'Austria Wien', 'Rapid Wien',
    'Spartak Trnava',
    'Zürich',
    'Ludogorets Razgrad',
    'CFR Cluj',
    'AEL Limassol', 'APOEL',
    'HJK Helsinki',
    'Raków Częstochowa', 'Jagiellonia',
    'Vålerenga',
    'Riga FC',
    'Al-Wakrah', 'Al-Shamal',
    'Tondela', 'Estoril', 'Rio Ave', 'Gil Vicente',
    'VfL Bochum',
    'AEK Athens',
    'Chicago Fire FC', 'Philadelphia Union', 'FC Dallas',
    'Botafogo', 'Grêmio', 'Internacional', 'Atlético Mineiro',
    'Racing Club', 'Independiente',
    'Al-Faisaly', 'Al-Hussein',
    'Al-Wahda', 'Al-Jazira',
    'FC Seoul', 'Pohang Steelers', 'Suwon Samsung',
    'Kawasaki Frontale', 'Nagoya Grampus',
    'Sydney FC', 'Melbourne City',
  ];
  if (tier5.includes(c)) return 4;

  // Known professional clubs (not in lists above)
  // Detect by league keyword patterns
  if (/^(Manchester|Arsenal|Chelsea|Liverpool|Tottenham|Newcastle|Aston|Brighton|West Ham|Crystal|Wolves|Fulham|Brentford|Bournemouth|Everton|Nottingham|Leicester|Southampton|Leeds|Burnley|Sheffield|Sunderland|Norwich|Watford|Middlesbrough|Coventry|Bristol|Preston|Hull|Cardiff|Blackburn|Swansea|Stoke|QPR|Reading|Birmingham|Huddersfield|Luton|Millwall|Plymouth|Portsmouth|Oxford|Derby)/.test(c)) return 5;
  if (/^(Bayer|Bayern|Borussia|RB|Eintracht|Werder|Hoffenheim|Stuttgart|Mainz|Augsburg|Wolfsburg|Gladbach|Freiburg|Union|Bochum|Heidenheim|Köln|Hamburg|Hertha|Schalke|Düsseldorf|Hannover|Nürnberg|Darmstadt|Kiel)/.test(c)) return 5;
  if (/^(AC |Inter |Juventus|Napoli|Roma|Lazio|Atalanta|Fiorentina|Bologna|Torino|Genoa|Udinese|Sassuolo|Venezia|Como|Parma|Cagliari|Empoli|Lecce|Verona|Monza|Salernitana|Spezia|Brescia|Palermo|Bari|Sampdoria)/.test(c)) return 5;
  if (/^(Real |Barcelona|Atlético|Atletico|Villarreal|Real Sociedad|Real Betis|Sevilla|Athletic|Valencia|Celta|Mallorca|Osasuna|Alavés|Espanyol|Getafe|Rayo|Girona|Leganés|Las Palmas|Granada)/.test(c)) return 5;
  if (/^(Paris|Marseille|Lyon|Monaco|Lille|Strasbourg|Nice|Rennes|Lens|Nantes|Angers|Le Havre|Reims|Montpellier|Toulouse|Brest|Lorient|Auxerre|Saint-Étienne|Metz|Clermont|Ajaccio)/.test(c)) return 5;

  // Dutch Eredivisie
  if (/^(Ajax|PSV|Feyenoord|AZ |Twente|Utrecht|Sparta|Heerenveen|Groningen|Willem|NEC|PEC|Vitesse|GAE|Excelsior|Fortuna|Heracles|RKC|FC Emmen|Cambuur)/.test(c)) return 5;
  // Portuguese
  if (/^(Benfica|Porto|Sporting|Braga|Vitória|Boavista|Estoril|Rio Ave|Casa Pia|Chaves|Portimonense|Gil Vicente|Famalicão|Arouca)/.test(c)) return 5;
  // Belgian
  if (/^(Club Brugge|Anderlecht|Genk|Gent|Antwerp|Standard|Mechelen|OHL|Cercle|Charleroi|Westerlo|Sint-Truiden|Union|Oostende|Kortrijk|Eupen)/.test(c)) return 4;
  // Turkish
  if (/^(Galatasaray|Fenerbahçe|Beşiktaş|Trabzonspor|Başakşehir|Adana|Konyaspor|Sivasspor|Antalyaspor|Kayserispor|Gaziantep|Alanyaspor|Pendikspor|Eyüpspor)/.test(c)) return 4;
  // Swiss
  if (/^(Young Boys|FC Basel|Zürich|Lugano|Luzern|Servette|St. Gallen|Grasshopper|Winterthur|Lausanne|Yverdon)/.test(c)) return 3;

  // Saudi Pro
  if (/^(Al-Hilal|Al-Nassr|Al-Ittihad|Al-Ahli|Al-Qadsiah|Al-Khaleej|Al-Fayha|Al-Taawoun|Al-Ettifaq|Al-Shabab|Al-Raed|Al-Fateh|Al-Wehda|Al-Orobah|Al-Riyadh|Damac|Al-Okhdood)/.test(c)) return 5;

  // Mixed professional clubs from various leagues
  if (/(FC|CF|SC|AC|RC|CA|CD|AS|SS|CS|FK|NK|SK|RCD|PSV|AFC|TSG|RB)/.test(c)) return 3;

  return 2; // default low score
}

// ─── PLAYER QUALITY SCORE ─────────────────────────────────
function playerRawScore(player) {
  const clubScore = getClubScore(player.club);
  const capBonus = Math.min(Math.floor(player.caps / 15), 6); // 0-6
  const goalBonus = player.position === 'FW' ? Math.min(Math.floor(player.goals / 20), 4) :
                    player.position === 'MF' ? Math.min(Math.floor(player.goals / 10), 3) : 0;
  return clubScore + capBonus + goalBonus;
}

// ─── MANUAL REPUTATION OVERRIDES ───────────────────────────
// Players whose global status exceeds their raw score
// Key: player name, Value: forced tier (S/A/B)
const manualOverrides = {
  // ——— Global superstars / national legends —————————
  'Neymar': 'S',
  'Mohamed Salah': 'S',
  'Kylian Mbappé': 'S',
  'Erling Haaland': 'S',
  'Luka Modrić': 'S',
  'Kevin De Bruyne': 'S',
  'Harry Kane': 'S',
  'Son Heung-min': 'S',
  'Vinícius Júnior': 'S',
  'Jude Bellingham': 'S',
  'Florian Wirtz': 'S',
  'Jamal Musiala': 'S',
  'Pedri': 'S',
  'Lamine Yamal': 'S',
  'Rodri': 'S',
  'Federico Valverde': 'S',
  'Lautaro Martínez': 'S',
  'Granit Xhaka': 'S',
  'Cristiano Ronaldo': 'S',
  'Lionel Messi': 'S',
  'Virgil van Dijk': 'S',

  // ——— Promotions: deserve A despite lower club score ———
  'Emiliano Martínez': 'A',
  'Rodrigo De Paul': 'A',
  'Nicolás Tagliafico': 'A',
  'Gavi': 'A',
  'Frenkie de Jong': 'A',
  'Nico Williams': 'A',

  // ——— Demotions: not S-tier despite high club score ———
  'Christian Pulisic': 'A',
  'Bukayo Saka': 'A',
  'Rafael Leão': 'A',
  'Julián Alvarez': 'A',
  'Alexander Isak': 'A',
  'Yassine Bounou': 'A',
  'Marquinhos': 'A',
  'Romelu Lukaku': 'A',
  'James Rodríguez': 'A',
  'Mateo Kovačić': 'A',
  'Moisés Caicedo': 'A',
  'Jules Koundé': 'A',
  'Ousmane Dembélé': 'S',
  'Cody Gakpo': 'A',
  'Denzel Dumfries': 'A',
  'José María Giménez': 'A',
  'Luis Díaz': 'A',
  'Hakan Çalhanoğlu': 'A',
  'Sadio Mané': 'A',
  'John Stones': 'A',
  'Mario Pašalić': 'A',
  'Rodrigo Bentancur': 'A',
  'Weston McKennie': 'A',
  // Previous batch
  'Davinson Sánchez': 'A',
  'Odilon Kossounou': 'B',
  'Mehdi Taremi': 'A',
  'Ritsu Dōan': 'A',
  'Edson Álvarez': 'A',
  'Ramy Bensebaini': 'A',
  'Marcel Sabitzer': 'A',
};

// Normalize to ASCII for loose matching (Müller → Muller, João → Joao)
function normalize(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

const overrideMap = {};
for (const [key, tier] of Object.entries(manualOverrides)) {
  overrideMap[normalize(key)] = { key, tier };
}

// ─── TEAM TIER BUDGETS ────────────────────────────────────
// Categories: ELITE, STRONG, GOOD, MID, DEV
const teamBudgets = {
  ELITE: { S: 3, A: 10, B: 10, C: 3 },
  STRONG: { S: 2, A: 7, B: 11, C: 6 },
  GOOD: { S: 1, A: 5, B: 10, C: 10 },
  MID: { S: 0, A: 3, B: 8, C: 15 },
  DEV: { S: 0, A: 1, B: 5, C: 20 },
};

const teamTiers = {
  'Argentina': 'ELITE', 'Brazil': 'ELITE', 'France': 'ELITE', 'Germany': 'ELITE',
  'England': 'ELITE', 'Spain': 'ELITE', 'Portugal': 'ELITE', 'Netherlands': 'ELITE',
  'Uruguay': 'STRONG', 'Croatia': 'STRONG', 'Belgium': 'STRONG', 'Colombia': 'STRONG',
  'Morocco': 'STRONG',
  'Austria': 'MID', 'Norway': 'GOOD', 'Sweden': 'GOOD', 'Japan': 'MID',
  'South Korea': 'GOOD', 'United States': 'GOOD', 'Mexico': 'MID', 'Switzerland': 'GOOD',
  'Turkey': 'GOOD', 'Senegal': 'GOOD', 'Egypt': 'GOOD', 'Algeria': 'MID',
  'Ecuador': 'GOOD', 'Iran': 'MID', 'Ivory Coast': 'MID',
  'Paraguay': 'MID', 'Canada': 'MID', 'Czech Republic': 'MID', 'Scotland': 'MID',
  'Australia': 'MID', 'Ghana': 'MID', 'Tunisia': 'MID', 'Saudi Arabia': 'MID',
  'Qatar': 'MID', 'South Africa': 'MID', 'DR Congo': 'MID', 'Haiti': 'MID',
  'Bosnia and Herzegovina': 'MID',
  'Curaçao': 'DEV', 'Jordan': 'DEV', 'Uzbekistan': 'DEV', 'Panama': 'DEV',
  'Iraq': 'DEV', 'Cape Verde': 'DEV', 'New Zealand': 'DEV',
};

// ─── ASSIGN TIERS PER TEAM ────────────────────────────────
const stats = [];
squads.forEach((team) => {
  const budgetCategory = teamTiers[team.name] || 'DEV';
  const budget = { ...teamBudgets[budgetCategory] };
  const players = team.players;

  // Score players
  players.forEach((p) => {
    p._score = playerRawScore(p);
  });

  // Apply manual overrides first — reserve their slots
  const assigned = { S: 0, A: 0, B: 0, C: 0 };
  players.forEach((p) => {
    const match = overrideMap[normalize(p.name)];
    if (match) {
      const forced = match.tier;
      // Only apply if budget allows (honor team strength cap)
      if (forced === 'S' && assigned.S < budget.S) { p.tier = 'S'; assigned.S++; p._overridden = true; }
      else if (forced === 'A' && assigned.A < budget.A) { p.tier = 'A'; assigned.A++; p._overridden = true; }
      else if (forced === 'B' && assigned.B < budget.B) { p.tier = 'B'; assigned.B++; p._overridden = true; }
    }
  });

  // Sort remaining (non-overridden) players by score
  const remaining = players.filter((p) => !p._overridden).sort((a, b) => b._score - a._score);

  // S-tier quality floor: without manual override, score must be >= 16
  const S_FLOOR = 16;

  // Assign remaining slots
  remaining.forEach((p) => {
    if (assigned.S < budget.S && p._score >= S_FLOOR) {
      p.tier = 'S';
      assigned.S++;
    } else if (assigned.A < budget.A) {
      p.tier = 'A';
      assigned.A++;
    } else if (assigned.B < budget.B) {
      p.tier = 'B';
      assigned.B++;
    } else {
      p.tier = 'C';
      assigned.C++;
    }
  });

  // Cleanup: remove internal fields
  players.forEach((p) => { delete p._score; delete p._overridden; });

  const totalBudget = budget.S + budget.A + budget.B + budget.C;
  stats.push({
    name: team.name,
    cat: budgetCategory,
    budget,
    assigned: { ...assigned },
    clubScores: players.map(p => getClubScore(p.club)),
  });

  console.log(
    `${team.name.padEnd(26)} [${budgetCategory.padEnd(7)}] ` +
    `S:${assigned.S}/${budget.S} A:${assigned.A}/${budget.A} B:${assigned.B}/${budget.B} C:${assigned.C}/${budget.C}`
  );
});

fs.writeFileSync(squadsPath, JSON.stringify(squads, null, 2));
console.log(`\nDone - tiers written to squads.json (${squads.reduce((s, t) => s + t.players.length, 0)} players)`);

// Quick validation
const totalAssigned = stats.reduce((acc, t) => {
  acc.S += t.assigned.S; acc.A += t.assigned.A; acc.B += t.assigned.B; acc.C += t.assigned.C;
  return acc;
}, { S: 0, A: 0, B: 0, C: 0 });
console.log(`Global: S:${totalAssigned.S} A:${totalAssigned.A} B:${totalAssigned.B} C:${totalAssigned.C}`);

// Check for override entries that never matched any player
const allNames = new Set();
squads.forEach(t => t.players.forEach(p => allNames.add(normalize(p.name))));
const unmatched = Object.entries(overrideMap).filter(([n]) => !allNames.has(n));
if (unmatched.length > 0) {
  console.log(`\n⚠ ${unmatched.length} override(s) not matched to any player:`);
  unmatched.forEach(([n, v]) => console.log(`  "${v.key}" → no player found in squads`));
} else {
  console.log('✓ All overrides matched');
}
