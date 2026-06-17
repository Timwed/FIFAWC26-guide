/**
 * 更新 Wikipedia 本地数据脚本
 * 
 * 使用方法（需要能访问 Wikipedia 的网络环境）:
 *   node scripts/fetch-wiki-data.mjs
 * 
 * 数据会保存到 src/data/ 目录:
 *   - wiki-teams.json   球队简介
 *   - wiki-players.json 球员简介
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const TEAM_NAMES_ZH = {
  Argentina: '阿根廷国家足球队',
  Brazil: '巴西国家足球队',
  Germany: '德国国家足球队',
  France: '法国国家足球队',
  Spain: '西班牙国家足球队',
  England: '英格兰足球代表队',
  Netherlands: '荷兰国家足球队',
  Belgium: '比利时国家足球队',
  Portugal: '葡萄牙国家足球队',
  Uruguay: '乌拉圭国家足球队',
  Italy: '意大利国家足球队',
  Mexico: '墨西哥国家足球队',
  USA: '美国国家足球队',
  Canada: '加拿大国家足球队',
  Japan: '日本国家足球队',
  'South Korea': '韩国国家足球队',
  Australia: '澳大利亚国家足球队',
  Colombia: '哥伦比亚国家足球队',
  Ecuador: '厄瓜多尔国家足球队',
  Sweden: '瑞典国家足球队',
  Switzerland: '瑞士国家足球队',
  Austria: '奥地利国家足球队',
  Turkey: '土耳其国家足球队',
  Morocco: '摩洛哥国家足球队',
  Egypt: '埃及国家足球队',
  'Saudi Arabia': '沙特阿拉伯国家足球队',
  Iran: '伊朗国家足球队',
  'Ivory Coast': '科特迪瓦国家足球队',
  Senegal: '塞内加尔国家足球队',
  Scotland: '苏格兰足球代表队',
  Algeria: '阿尔及利亚国家足球队',
  Tunisia: '突尼斯国家足球队',
  Qatar: '卡塔尔国家足球队',
  Paraguay: '巴拉圭国家足球队',
  Chile: '智利国家足球队',
  Peru: '秘鲁国家足球队',
  Nigeria: '尼日利亚国家足球队',
  Ghana: '加纳国家足球队',
  Cameroon: '喀麦隆国家足球队',
  'Czech Republic': '捷克国家足球队',
  Poland: '波兰国家足球队',
  Croatia: '克罗地亚国家足球队',
  Serbia: '塞尔维亚国家足球队',
  Denmark: '丹麦国家足球队',
  Norway: '挪威国家足球队',
  Iraq: '伊拉克国家足球队',
  'Bosnia-Herzegovina': '波斯尼亚和黑塞哥维那国家足球队',
  'Cape Verde': '佛得角国家足球队',
  Haiti: '海地国家足球队',
  'New Zealand': '新西兰国家足球队',
  Uzbekistan: '乌兹别克斯坦国家足球队',
  Jordan: '约旦国家足球队',
  'DR Congo': '刚果民主共和国国家足球队',
  'Curaçao': '库拉索国家足球队',
  Panama: '巴拿马国家足球队',
};

const MIRRORS_ZH = ['https://zh.m.wikipedia.org', 'https://zh.wikipedia.org'];
const MIRRORS_EN = ['https://en.m.wikipedia.org', 'https://en.wikipedia.org'];
const DELAY_MS = 800;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWiki(title, mirrors) {
  for (const base of mirrors) {
    try {
      const url = `${base}/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&exintro=true&exsentences=5&explaintext=true&format=json`;
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) continue;
      const page = Object.values(pages)[0];
      if (!page || page.missing !== undefined) continue;
      if (!page.extract) continue;
      if (page.extract.includes('重定向') || page.extract.includes('redirect')) continue;
      return { title: page.title, extract: page.extract, lang: base.includes('zh') ? 'zh' : 'en' };
    } catch { continue; }
  }
  return null;
}

async function fetchTeams() {
  const existing = existsSync(join(DATA_DIR, 'wiki-teams.json'))
    ? JSON.parse(readFileSync(join(DATA_DIR, 'wiki-teams.json'), 'utf8'))
    : {};
  let updated = 0;

  for (const [enName, zhName] of Object.entries(TEAM_NAMES_ZH)) {
    if (existing[enName]?.extract?.length > 50) {
      console.log(`  [skip] ${enName} (已有数据)`);
      continue;
    }
    process.stdout.write(`  [fetch] ${enName} ... `);
    let result = await fetchWiki(enName + ' national football team', MIRRORS_EN);
    if (!result) {
      result = await fetchWiki(zhName, MIRRORS_ZH);
    }
    if (result) {
      existing[enName] = result;
      updated++;
      console.log(`OK (${result.lang}, ${result.extract.length}字)`);
    } else {
      console.log('FAILED');
    }
    await sleep(DELAY_MS);
  }

  writeFileSync(join(DATA_DIR, 'wiki-teams.json'), JSON.stringify(existing, null, 2), 'utf8');
  console.log(`\n球队数据已保存，更新 ${updated} 条`);
}

async function fetchPlayers() {
  const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123';

  const teamsRes = await fetch(`${THESPORTSDB_BASE}/search_all_teams.php?l=FIFA_World_Cup`);
  const teamsData = await teamsRes.json();
  const teams = teamsData.teams || [];

  const existing = existsSync(join(DATA_DIR, 'wiki-players.json'))
    ? JSON.parse(readFileSync(join(DATA_DIR, 'wiki-players.json'), 'utf8'))
    : {};
  let updated = 0;

  for (const team of teams) {
    console.log(`\n--- ${team.strTeam} ---`);
    const playersRes = await fetch(`${THESPORTSDB_BASE}/lookup_all_players.php?id=${team.idTeam}`);
    const playersData = await playersRes.json();
    const players = playersData.player || playersData.players || [];
    await sleep(300);

    for (const player of players.slice(0, 15)) {
      if (existing[player.strPlayer]?.extract?.length > 50) {
        console.log(`  [skip] ${player.strPlayer}`);
        continue;
      }
      process.stdout.write(`  [fetch] ${player.strPlayer} ... `);
      let result = await fetchWiki(player.strPlayer, MIRRORS_EN);
      if (!result) {
        result = await fetchWiki(player.strPlayer, MIRRORS_ZH);
      }
      if (result) {
        existing[player.strPlayer] = result;
        updated++;
        console.log(`OK (${result.lang})`);
      } else {
        console.log('FAILED');
      }
      await sleep(DELAY_MS);
    }
  }

  writeFileSync(join(DATA_DIR, 'wiki-players.json'), JSON.stringify(existing, null, 2), 'utf8');
  console.log(`\n球员数据已保存，更新 ${updated} 条`);
}

console.log('=== FIFA World Cup 2026 Wikipedia 数据更新工具 ===\n');
console.log('1. 更新球队简介');
await fetchTeams();
console.log('\n2. 更新球员简介 (可能耗时较长)');
await fetchPlayers();
console.log('\n全部完成!');
