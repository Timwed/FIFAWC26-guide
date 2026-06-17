export interface WikiSummary {
  title: string;
  extract: string;
  lang: string;
}

import wikiTeamsData from '../data/wiki-teams.json';
import wikiPlayersData from '../data/wiki-players.json';

const teamWiki: Record<string, WikiSummary> = wikiTeamsData as Record<string, WikiSummary>;
const playerWiki: Record<string, WikiSummary> = wikiPlayersData as Record<string, WikiSummary>;

export function getTeamWiki(teamName: string): WikiSummary | null {
  return teamWiki[teamName] || null;
}

export function getPlayerWiki(playerName: string): WikiSummary | null {
  return playerWiki[playerName] || null;
}

export function getTeamWikiTitle(teamName: string): string | null {
  return teamWiki[teamName]?.title || null;
}
