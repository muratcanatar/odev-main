export type SeasonType = "Regular Season" | "Playoffs"

export interface Player {
  playerid: number
  teamid: number
  playername: string
  position: string
  headshoturl: string
}

export interface PlayerStats {
  playerid: number
  seasontype: SeasonType
  gp: number
  pts: number
  reb: number
  ast: number
  stl?: number
  blk?: number
  tov?: number
  fg_pct?: number
  fg3_pct?: number
  ft_pct?: number
}

export interface PlayerWithStats extends Player {
  regularSeason?: PlayerStats
  playoffs?: PlayerStats
  team?: Team
}

export interface Team {
  teamid: number
  teamname: string
  teamabbreviation: string
  logourl: string
  conferenceid: number
  conferencename: string
}

export interface TeamStats {
  teamid: number
  gp: number
  w: number
  l: number
  w_pct: number
  def_rating_rank: number
  dreb_rank: number
  stl_rank: number
  blk_rank: number
}

export interface OpponentStats {
  teamid: number
  opp_pts_off_tov: number
  opp_pts_2nd_chance: number
  opp_pts_paint: number
}

export interface TeamWithStats extends Team {
  stats?: TeamStats
  opponentStats?: OpponentStats
  rank?: number
  players?: PlayerWithStats[]
}
