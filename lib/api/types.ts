// ==========================================
// BACKEND API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
  status: 'success' | 'fail'
  message?: string
  data?: T
  results?: number
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  per_page: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// ==========================================
// PLAYER TYPES
// ==========================================

export interface Player {
  playerID: number
  playerName: string
  teamID: number
  position: string
  headshotUrl: string
}

export interface PlayerStats {
  location?: string
  season_type?: string
  teamName?: string
  GP_X?: number
  MIN_X?: number
  PTS?: number
  REB?: number
  AST?: number
  steal?: number
  TOV?: number
  FG_PCT?: number
  FG3_PCT?: number
  FT_PCT?: number
  efficiency?: number
  FGM?: number
  FGA?: number
  FG3M?: number
  FG3A?: number
  FTM?: number
  FTA?: number
  offensiveREB?: number
  defensiveREB?: number
  PF?: number
  PLUS_MINUS?: number
}

export interface PlayerWithStats extends Player {
  stats?: PlayerStats
}

export interface PlayersResponse {
  players: Player[]
}

export interface PlayerDetailResponse {
  player: PlayerWithStats
}

// ==========================================
// TEAM TYPES
// ==========================================

export interface Team {
  teamID: number
  teamName: string
  teamAbbreviation: string
  logoUrl: string
  conference: string
}

export interface TeamRanking {
  winRank?: number
  defRatingRank?: number
  defRebRank?: number
  stealRank?: number
  blockRank?: number
}

export interface TeamRoster {
  playerID: number
  playerName: string
  position: string
  headshotUrl: string
  avg_pts: number
  avg_ast: number
  avg_reb: number
  avg_stl: number
  avg_eff: number
}

export interface TeamWithStats extends Team {
  stats?: TeamRanking
  roster?: TeamRoster[]
  season_type?: string
}

export interface TeamsResponse {
  teams: Team[]
}

export interface TeamDetailResponse {
  team: TeamWithStats
}

export interface TeamStanding extends Team {
  winRank?: number
  defRatingRank?: number
  defRebRank?: number
  stealRank?: number
  blockRank?: number
}

export interface StandingsResponse {
  standings: TeamStanding[]
  season: string
}

// ==========================================
// ARENA TYPES
// ==========================================

export interface Arena {
  arenaDetailID: number
  teamID: number
  city: string
  state: string
  arena: string
  capacity: number
  latitude: number
  longitude: number
  us_time_zone: string
  division: string
  elevation_m: number
}

export interface TeamArena extends Team {
  arena?: Arena
}

export interface ArenaResponse {
  team: TeamArena
}

export interface ArenasResponse {
  arenas: (Arena & { teamName?: string; teamAbbreviation?: string; logoUrl?: string })[]
}

// ==========================================
// FIXTURE TYPES
// ==========================================

export interface Fixture {
  matchID: number
  matchNumber: number
  roundNumber: number
  matchDate: string
  homeTeam: string
  awayTeam: string
  result: string
  arena?: string
  city?: string
  state?: string
  capacity?: number
  teamID?: number
}

export interface FixturesResponse {
  fixtures: Fixture[]
  team?: string
}

export interface FixtureDetailResponse {
  fixture: Fixture
}

// ==========================================
// STATS & LEADERS TYPES
// ==========================================

export interface Leader {
  playerID: number
  playerName: string
  headshotUrl: string
  position: string
  teamName: string
  teamAbbreviation: string
  value: number
  avg_pts: number
  avg_ast: number
  avg_reb: number
}

export interface LeadersResponse {
  status: 'success' | 'fail'
  category: string
  season: string
  data: Leader[]
}

export interface TeamComparison {
  team1: TeamWithStats
  team2: TeamWithStats
}

export interface ComparisonResponse {
  season: string
  data: TeamComparison
}

// ==========================================
// ADMIN TYPES
// ==========================================

export interface AdminDashboardStats {
  total_teams: number
  total_players: number
  total_fixtures: number
  total_arenas: number
  total_regular_stats: number
  total_playoff_stats: number
}

export interface AdminDashboardResponse {
  data: AdminDashboardStats
}

// Admin Create/Update DTOs
export interface CreatePlayerDTO {
  playerName: string
  teamID: number
  position?: string
  headshotUrl?: string
}

export interface UpdatePlayerDTO {
  playerName?: string
  teamID?: number
  position?: string
  headshotUrl?: string
}

export interface CreateTeamDTO {
  teamID: number
  teamName: string
  teamAbbreviation: string
  conference: string
  logoUrl?: string
}

export interface UpdateTeamDTO {
  teamName?: string
  teamAbbreviation?: string
  conference?: string
  logoUrl?: string
}

export interface CreateFixtureDTO {
  arenaDetailID: number
  homeTeam: string
  awayTeam: string
  matchDate: string
  matchNumber?: number
  roundNumber?: number
  result?: string
}

export interface UpdateFixtureDTO {
  arenaDetailID?: number
  homeTeam?: string
  awayTeam?: string
  matchDate?: string
  matchNumber?: number
  roundNumber?: number
  result?: string
}

export interface CreateArenaDTO {
  teamID: number
  city?: string
  state?: string
  arena?: string
  capacity?: number
  latitude?: number
  longitude?: number
  us_time_zone?: string
  division?: string
  elevation_m?: number
}

export interface UpdateArenaDTO {
  teamID?: number
  city?: string
  state?: string
  arena?: string
  capacity?: number
  latitude?: number
  longitude?: number
  us_time_zone?: string
  division?: string
  elevation_m?: number
}

export interface CreatePlayerStatsDTO {
  teamID: number
  location: string
  season?: 'REGULAR' | 'PLAYOFF'
  GP_X?: number
  MIN_X?: number
  FGM?: number
  FGA?: number
  FG_PCT?: number
  FG3M?: number
  FG3A?: number
  FG3_PCT?: number
  FTM?: number
  FTA?: number
  FT_PCT?: number
  offensiveREB?: number
  defensiveREB?: number
  REB?: number
  AST?: number
  TOV?: number
  steal?: number
  PF?: number
  PTS?: number
  PLUS_MINUS?: number
  efficiency?: number
}

export interface CreateTeamRankingDTO {
  season?: 'REGULAR' | 'PLAYOFF'
  winRank?: number
  defRatingRank?: number
  defRebRank?: number
  stealRank?: number
  blockRank?: number
}
