import { opponentStats } from "@/data/opponent-stats"
import { playerPlayoffStats } from "@/data/player-playoff-stats"
import { playerRegularStats } from "@/data/player-regular-stats"
import { players } from "@/data/players"
import { teamStats } from "@/data/team-stats"
import { teams } from "@/data/teams"
import { PlayerStats, PlayerWithStats, TeamWithStats } from "@/lib/types"

const regularStatsMap = new Map(playerRegularStats.map((stat) => [stat.playerid, stat]))
const playoffStatsMap = new Map(playerPlayoffStats.map((stat) => [stat.playerid, stat]))
const teamStatsMap = new Map(teamStats.map((stat) => [stat.teamid, stat]))
const opponentStatsMap = new Map(opponentStats.map((stat) => [stat.teamid, stat]))

function buildPlayerWithStats(playerId: number): PlayerWithStats | undefined {
  const player = players.find((item) => item.playerid === playerId)

  if (!player) {
    return undefined
  }

  const team = teams.find((item) => item.teamid === player.teamid)

  return {
    ...player,
    team,
    regularSeason: regularStatsMap.get(player.playerid),
    playoffs: playoffStatsMap.get(player.playerid),
  }
}

export function getPlayersWithStats(): PlayerWithStats[] {
  return players.map((player) => buildPlayerWithStats(player.playerid)!).filter(Boolean)
}

export function getPlayerById(playerId: number): PlayerWithStats | undefined {
  return buildPlayerWithStats(playerId)
}

function assignConferenceRanks(teamList: TeamWithStats[]): TeamWithStats[] {
  const grouped = teamList.reduce<Record<string, TeamWithStats[]>>((acc, team) => {
    const key = team.conferencename
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(team)
    return acc
  }, {})

  Object.values(grouped).forEach((conferenceTeams) => {
    conferenceTeams
      .sort((a, b) => (b.stats?.w_pct ?? 0) - (a.stats?.w_pct ?? 0))
      .forEach((team, index) => {
        team.rank = index + 1
      })
  })

  return teamList
}

export function getTeamsWithStats(): TeamWithStats[] {
  const playersWithStats = getPlayersWithStats()

  const hydratedTeams: TeamWithStats[] = teams.map((team) => ({
    ...team,
    stats: teamStatsMap.get(team.teamid),
    opponentStats: opponentStatsMap.get(team.teamid),
    players: playersWithStats.filter((player) => player.teamid === team.teamid),
  }))

  return assignConferenceRanks(hydratedTeams)
}

export function getTeamById(teamId: number): TeamWithStats | undefined {
  const teamsWithStats = getTeamsWithStats()
  return teamsWithStats.find((team) => team.teamid === teamId)
}

export function getPlayerStatsBySeason(seasonType: PlayerStats["seasontype"]): PlayerStats[] {
  if (seasonType === "Playoffs") {
    return playerPlayoffStats
  }

  return playerRegularStats
}
