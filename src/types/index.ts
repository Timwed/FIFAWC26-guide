export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamAlternate?: string;
  strTeamShort: string;
  intFormedYear: string;
  strSport: string;
  strLeague: string;
  idLeague: string;
  strStadium: string;
  strLocation: string;
  intStadiumCapacity: string;
  strWebsite: string;
  strDescriptionEN: string;
  strCountry: string;
  strBadge: string;
  strLogo: string;
  strFanart1: string;
  strBanner: string;
  strEquipment: string;
  strColour1: string;
  strColour2: string;
  strColour3: string;
  strKeywords: string;
  idVenue: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  idTeam: string;
  strNationality: string;
  strPosition: string;
  strHeight: string;
  strWeight: string;
  intLoved: string;
  strThumb: string;
  strCut: string;
  strRender: string;
  strSign: string;
  strBirthLocation: string;
  dateBorn: string;
  strNumber: string;
  strStatus: string;
  strDescriptionEN: string;
}

export interface MatchEvent {
  idEvent: string;
  strEvent: string;
  strEventAlternate: string;
  strSeason: string;
  idLeague: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  intRound: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strTimestamp: string;
  dateEvent: string;
  dateEventLocal: string;
  strTime: string;
  strTimeLocal: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strVenue: string;
  strCountry: string;
  strThumb: string;
  strPoster: string;
  strStatus: string;
  strPostponed: string;
  strGroup?: string;
  strFilename: string;
}

export interface StaticGoal {
  team: 'home' | 'away';
  name: string;
  minute: number | null;
  homeScore: number;
  awayScore: number;
  isPenalty: boolean;
  isOwnGoal: boolean;
}

export interface Venue {
  idVenue: string;
  strVenue: string;
  strLocation: string;
  strCountry: string;
  intCapacity: string;
  strSport: string;
  strThumb: string;
  strDescriptionEN: string;
}
