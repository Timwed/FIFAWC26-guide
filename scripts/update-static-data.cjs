const https = require('https');
const fs = require('fs');

// ── HTTP helper ──────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// ── Team lookup (replicates src/utils/teamLookup.ts) ───────────────────
const teams = require('../src/data/teams.json');

const enNameMap = new Map();
for (const t of teams) {
  enNameMap.set(t.enName.toLowerCase(), t);
}

const TSDB_ALIASES = {
  'ivory coast': 'Ivory Coast',
  "côte d'ivoire": 'Ivory Coast',
  'korea republic': 'South Korea',
  'south korea': 'South Korea',
  'usa': 'United States',
  'united states of america': 'United States',
  'bosnia': 'Bosnia and Herzegovina',
  'bosnia-herzegovina': 'Bosnia and Herzegovina',
  'czechia': 'Czech Republic',
  'czech republic': 'Czech Republic',
};

function lookupTeam(tsdbName) {
  if (!tsdbName) return null;
  const key = tsdbName.trim().toLowerCase();
  let entry = enNameMap.get(key);
  if (!entry) {
    const canonical = TSDB_ALIASES[key];
    if (canonical) entry = enNameMap.get(canonical.toLowerCase());
  }
  return entry || null;
}

// ── OpenLigaDB matching (replicates findOpenLigaMatch in Schedule.tsx) ─
function findOpenLigaMatch(event, olMatches) {
  const home = lookupTeam(event.strHomeTeam);
  const away = lookupTeam(event.strAwayTeam);
  const homeSC = home?.shortName;
  const awaySC = away?.shortName;

  // Strategy 1: team shortName match (bidirectional)
  if (homeSC && awaySC) {
    const byTeam = olMatches.find(
      (m) =>
        (m.team1.shortName === homeSC && m.team2.shortName === awaySC) ||
        (m.team1.shortName === awaySC && m.team2.shortName === homeSC)
    );
    if (byTeam) return byTeam;
  }

  // Strategy 2: timestamp proximity within 1 hour
  const eventTs = new Date(`${event.dateEvent}T${event.strTime}Z`).getTime();
  return olMatches.find((m) => {
    const olmTs = new Date(m.matchDateTimeUTC).getTime();
    return Math.abs(eventTs - olmTs) < 3600000;
  });
}

// ── TheSportsDB fetch ──────────────────────────────────────────────────
async function fetchTSDBAllEvents() {
  const all = [];
  for (let r = 1; r <= 10; r++) {
    try {
      const d = await fetchJSON(
        `https://www.thesportsdb.com/api/v1/json/123/eventsround.php?id=4429&r=${r}&s=2026`
      );
      if (d.events?.length) {
        all.push(...d.events);
        console.log(`  TSDB round ${r}: ${d.events.length} matches`);
      } else {
        break;
      }
    } catch (e) {
      console.log(`  TSDB round ${r}: fail — ${e.message}`);
      break;
    }
  }
  return all;
}

// ── OpenLigaDB fetch ───────────────────────────────────────────────────
async function fetchOpenLigaAllMatches() {
  try {
    const raw = await fetchJSON('https://api.openligadb.de/getmatchdata/wm26/2026');
    console.log(`  OpenLigaDB bulk: ${raw.length} matches`);
    return raw;
  } catch (e) {
    console.log(`  OpenLigaDB bulk: fail — ${e.message}`);
    return [];
  }
}

async function fetchOpenLigaMatchGoals(matchId) {
  try {
    return await fetchJSON(`https://api.openligadb.de/getmatchdata/${matchId}`);
  } catch (e) {
    console.log(`  OpenLigaDB match ${matchId}: fail — ${e.message}`);
    return null;
  }
}

// ── Merge into venue-schedule.json ─────────────────────────────────────
async function main() {
  const schedulePath = 'src/data/venue-schedule.json';
  const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf8'));

  console.log('\n=== Fetching TheSportsDB scores ===');
  const tsdbEvents = await fetchTSDBAllEvents();
  const tsdbMap = new Map(tsdbEvents.map((e) => [e.idEvent, e]));
  console.log(`  Total: ${tsdbEvents.length} events`);

  console.log('\n=== Fetching OpenLigaDB matches ===');
  const olMatches = await fetchOpenLigaAllMatches();

  // Build a map of OpenLigaDB matchId → full detail (for refetching)
  // We'll refetch individual matches where goals exist but are incomplete
  const needsRefetch = [];
  for (const olm of olMatches) {
    if (!olm.matchIsFinished) continue;
    if (olm.goals.length > 0 && olm.goals.some((g) => !g.goalGetterName)) {
      needsRefetch.push(olm.matchID);
    }
  }

  if (needsRefetch.length > 0) {
    console.log(`\n=== Fetching ${needsRefetch.length} individual match details ===`);
    const details = await Promise.all(needsRefetch.map((id) => fetchOpenLigaMatchGoals(id)));
    for (let i = 0; i < needsRefetch.length; i++) {
      const detail = details[i];
      if (detail) {
        const idx = olMatches.findIndex((m) => m.matchID === needsRefetch[i]);
        if (idx >= 0) {
          console.log(`  Updated match ${needsRefetch[i]}: ${detail.goals.length} goals`);
          olMatches[idx] = detail;
        }
      }
    }
  }

  console.log('\n=== Merging data ===');
  let totalEvents = 0;
  let updatedScores = 0;
  let writtenGoals = 0;
  let incompleteWarning = 0;

  for (const [venue, events] of Object.entries(schedule)) {
    for (const event of events) {
      totalEvents++;

      // 1. Update scores from TSDB
      const live = tsdbMap.get(event.idEvent);
      if (live) {
        const hadChange =
          event.intHomeScore !== live.intHomeScore ||
          event.intAwayScore !== live.intAwayScore ||
          event.strStatus !== live.strStatus;
        if (hadChange) {
          updatedScores++;
          console.log(`  Score update: ${event.strHomeTeam} ${live.intHomeScore}-${live.intAwayScore} ${event.strAwayTeam} (was ${event.intHomeScore}-${event.intAwayScore}, ${event.strStatus}→${live.strStatus})`);
        }
        event.intHomeScore = live.intHomeScore;
        event.intAwayScore = live.intAwayScore;
        event.strStatus = live.strStatus;
      }

      // 2. Add goals for finished matches
      if (event.strStatus === 'FT' && !event.goals) {
        const olm = findOpenLigaMatch(event, olMatches);
        if (!olm) {
          console.log(`  No OL match found: ${event.strHomeTeam} vs ${event.strAwayTeam}`);
          continue;
        }
        if (olm.goals.length === 0) {
          console.log(`  No goals in OL data: ${event.strHomeTeam} vs ${event.strAwayTeam}`);
          continue;
        }

        const home = lookupTeam(event.strHomeTeam);
        const team1IsHome = home ? olm.team1.shortName === home.shortName : true;
        let lastH = 0;
        let lastA = 0;
        const allGoals = [];

        for (const g of olm.goals) {
          const hScore = team1IsHome ? g.scoreTeam1 : g.scoreTeam2;
          const aScore = team1IsHome ? g.scoreTeam2 : g.scoreTeam1;
          const team = hScore > lastH ? 'home' : 'away';

          allGoals.push({
            team,
            name: g.goalGetterName || '',
            minute: g.matchMinute,
            homeScore: hScore,
            awayScore: aScore,
            isPenalty: !!(g.isPenalty),
            isOwnGoal: !!(g.isOwnGoal),
          });

          lastH = hScore;
          lastA = aScore;
        }

        // Sort by minute
        allGoals.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

        // Check completeness
        const scoreComplete =
          lastH === Number(event.intHomeScore) &&
          lastA === Number(event.intAwayScore);

        if (!scoreComplete) {
          incompleteWarning++;
          console.log(`  Goal data incomplete: ${event.strHomeTeam} ${event.intHomeScore}-${event.intAwayScore} ${event.strAwayTeam} (goals sum to ${lastH}-${lastA})`);
        }

        event.goals = allGoals;
        writtenGoals++;
        console.log(`  Goals written: ${event.strHomeTeam} vs ${event.strAwayTeam} (${allGoals.filter(g => g.team === 'home').length}+${allGoals.filter(g => g.team === 'away').length} goals)${!scoreComplete ? ' ⚠ incomplete' : ''}`);
      }
    }
  }

  console.log(`\n=== Stats ===`);
  console.log(`  Total matches: ${totalEvents}`);
  console.log(`  Score updates: ${updatedScores}`);
  console.log(`  Goals written: ${writtenGoals}`);
  console.log(`  Incomplete warnings: ${incompleteWarning}`);

  fs.writeFileSync(schedulePath, JSON.stringify(schedule, null, 2), 'utf8');
  console.log(`\nSaved to ${schedulePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
