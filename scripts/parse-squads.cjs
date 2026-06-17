const fs = require('fs');
const path = require('path');

const wikitext = fs.readFileSync(path.join(__dirname, 'squads-wikitext.txt'), 'utf-8');

let currentGroup = '';
let currentTeam = '';
let currentCoach = '';
let inSquad = false;
let players = [];
const teams = [];

const lines = wikitext.split(/\r?\n/);

for (const line of lines) {
  // Group header
  let m = line.match(/^==Group (\S+)==/);
  if (m) {
    currentGroup = m[1];
    continue;
  }
  
  // Team header
  m = line.match(/^===([^=]+)====?$/);
  if (m) {
    currentTeam = m[1].trim();
    currentCoach = '';
    players = [];
    inSquad = false;
    continue;
  }
  
  // Coach
  m = line.match(/^Coach:\s*(.+)$/);
  if (m) {
    let coach = m[1].trim();
    coach = coach.replace(/\{\{[^}]+\}\}/g, '');
    coach = coach.replace(/\[\[|\]\]/g, '');
    currentCoach = coach.trim();
    continue;
  }
  
  // Squad start
  if (line.includes('{{nat fs g start}}')) {
    inSquad = true;
    continue;
  }
  
  // Squad end
  if (line.includes('{{nat fs end}}')) {
    if (currentTeam && players.length > 0) {
      teams.push({
        name: currentTeam,
        group: currentGroup,
        coach: currentCoach,
        players,
      });
    }
    inSquad = false;
    players = [];
    continue;
  }
  
  // Player
  if (inSquad && line.includes('{{nat fs g player')) {
    const no = (line.match(/\|no=([^|]+)/) || [])[1] || '';
    const pos = (line.match(/\|pos=([^|]+)/) || [])[1] || '';
    const caps = parseInt((line.match(/\|caps=(\d+)/) || [])[1] || '0');
    const goals = parseInt((line.match(/\|goals=(\d+)/) || [])[1] || '0');
    
    // Name
    let name = '';
    const nameMatch = line.match(/\|name=\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (nameMatch) {
      name = nameMatch[2] || nameMatch[1];
    }
    
    // Club
    let club = '';
    const clubMatch = line.match(/\|club=\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (clubMatch) {
      club = clubMatch[2] || clubMatch[1];
    }
    
    // Age
    let age = 0;
    const ageMatch = line.match(/\|age=\{\{birth date and age2\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\}\}/);
    if (ageMatch) {
      const refYear = parseInt(ageMatch[1]);
      const refMonth = parseInt(ageMatch[2]);
      const refDay = parseInt(ageMatch[3]);
      const birthYear = parseInt(ageMatch[4]);
      const birthMonth = parseInt(ageMatch[5]);
      const birthDay = parseInt(ageMatch[6]);
      age = refYear - birthYear;
      if (birthMonth > refMonth || (birthMonth === refMonth && birthDay > refDay)) {
        age--;
      }
    }
    
    players.push({
      number: no,
      position: pos,
      name,
      age,
      caps,
      goals,
      club,
    });
  }
}

const outPath = path.join(__dirname, '..', 'src', 'data', 'squads.json');
fs.writeFileSync(outPath, JSON.stringify(teams, null, 2), 'utf-8');

console.log(`Teams: ${teams.length}`);
const totalPlayers = teams.reduce((sum, t) => sum + t.players.length, 0);
console.log(`Total players: ${totalPlayers}`);
console.log(`First: ${teams[0].players[0].name}, Age: ${teams[0].players[0].age}`);
