"use client"

import useSWR, { type SWRConfiguration } from "swr"
import {
  playersApi,
  teamsApi,
  fixturesApi,
  arenasApi,
  statsApi,
  adminApi,
  healthApi,
} from "./api-client"
import type {
  ApiResponse,
  PlayersResponse,
  PlayerDetailResponse,
  TeamsResponse,
  TeamDetailResponse,
  StandingsResponse,
  ArenaResponse,
  ArenasResponse,
  FixturesResponse,
  FixtureDetailResponse,
  LeadersResponse,
  ComparisonResponse,
  AdminDashboardStats,
} from "./types"

// ==========================================
// PLAYER HOOKS
// ==========================================

export function usePlayers(
  params?: { page?: number; per_page?: number; team_id?: number; position?: string },
  config?: SWRConfiguration<ApiResponse<PlayersResponse>>
) {
  const key = params ? ['players', params] : 'players'
  return useSWR<ApiResponse<PlayersResponse>>(
    key,
    () => playersApi.getAll(params),
    config
  )
}

export function usePlayer(
  id: number | null,
  params?: { location?: string; season?: string },
  config?: SWRConfiguration<ApiResponse<PlayerDetailResponse> | null>
) {
  const key = id ? (params ? ['player', id, params] : ['player', id]) : null
  return useSWR<ApiResponse<PlayerDetailResponse> | null>(
    key,
    id ? () => playersApi.getById(id, params) : null,
    config
  )
}

export function usePlayerSearch(
  query: string,
  config?: SWRConfiguration<ApiResponse<PlayersResponse>>
) {
  const key = query.length >= 2 ? ['players', 'search', query] : null
  return useSWR<ApiResponse<PlayersResponse>>(
    key,
    () => playersApi.search(query),
    config
  )
}

// ==========================================
// TEAM HOOKS
// ==========================================

export function useTeams(
  params?: { page?: number; per_page?: number; conference?: string },
  config?: SWRConfiguration<ApiResponse<TeamsResponse>>
) {
  const key = params ? ['teams', params] : 'teams'
  return useSWR<ApiResponse<TeamsResponse>>(
    key,
    () => teamsApi.getAll(params),
    config
  )
}

export function useTeam(
  id: number | null,
  params?: { season?: string },
  config?: SWRConfiguration<ApiResponse<TeamDetailResponse> | null>
) {
  const key = id ? (params ? ['team', id, params] : ['team', id]) : null
  return useSWR<ApiResponse<TeamDetailResponse> | null>(
    key,
    id ? () => teamsApi.getById(id, params) : null,
    config
  )
}

export function useStandings(
  params?: { conference?: string; season?: string },
  config?: SWRConfiguration<ApiResponse<StandingsResponse>>
) {
  const key = params ? ['standings', params] : 'standings'
  return useSWR<ApiResponse<StandingsResponse>>(
    key,
    () => teamsApi.getStandings(params),
    config
  )
}

export function useTeamArena(
  id: number | null,
  config?: SWRConfiguration<ApiResponse<ArenaResponse> | null>
) {
  const key = id ? ['team', id, 'arena'] : null
  return useSWR<ApiResponse<ArenaResponse> | null>(
    key,
    id ? () => teamsApi.getArena(id) : null,
    config
  )
}

export function useTeamFixtures(
  id: number | null,
  params?: { limit?: number },
  config?: SWRConfiguration<ApiResponse<FixturesResponse> | null>
) {
  const key = id ? (params ? ['team', id, 'fixtures', params] : ['team', id, 'fixtures']) : null
  return useSWR<ApiResponse<FixturesResponse> | null>(
    key,
    id ? () => teamsApi.getFixtures(id, params) : null,
    config
  )
}

// ==========================================
// FIXTURE HOOKS
// ==========================================

export function useFixtures(
  params?: { page?: number; per_page?: number; round?: number; team?: string },
  config?: SWRConfiguration<ApiResponse<FixturesResponse>>
) {
  const key = params ? ['fixtures', params] : 'fixtures'
  return useSWR<ApiResponse<FixturesResponse>>(
    key,
    () => fixturesApi.getAll(params),
    config
  )
}

export function useFixture(
  id: number | null,
  config?: SWRConfiguration<ApiResponse<FixtureDetailResponse> | null>
) {
  const key = id ? ['fixture', id] : null
  return useSWR<ApiResponse<FixtureDetailResponse> | null>(
    key,
    id ? () => fixturesApi.getById(id) : null,
    config
  )
}

// ==========================================
// ARENA HOOKS
// ==========================================

export function useArenas(
  config?: SWRConfiguration<ApiResponse<ArenasResponse>>
) {
  return useSWR<ApiResponse<ArenasResponse>>(
    'arenas',
    () => arenasApi.getAll(),
    config
  )
}

// ==========================================
// STATS HOOKS
// ==========================================

export function useLeaders(
  params?: { category?: string; season?: string; limit?: number },
  config?: SWRConfiguration<LeadersResponse>
) {
  const key = params ? ['leaders', params] : 'leaders'
  return useSWR<LeadersResponse>(
    key,
    () => statsApi.getLeaders(params),
    config
  )
}

export function useComplexStats(
  config?: SWRConfiguration<ApiResponse<any>>
) {
  return useSWR<ApiResponse<any>>(
    'complex-stats',
    () => statsApi.getComplexStats(),
    config
  )
}

export function useTeamComparison(
  team1: number | null,
  team2: number | null,
  season?: string,
  config?: SWRConfiguration<ApiResponse<ComparisonResponse> | null>
) {
  const key = team1 && team2 ? ['team-comparison', team1, team2, season] : null
  return useSWR<ApiResponse<ComparisonResponse> | null>(
    key,
    team1 && team2 ? () => statsApi.compareTeams(team1, team2, season) : null,
    config
  )
}

// ==========================================
// ADMIN HOOKS
// ==========================================

export function useAdminDashboard(
  config?: SWRConfiguration<ApiResponse<AdminDashboardStats>>
) {
  return useSWR<ApiResponse<AdminDashboardStats>>(
    'admin-dashboard',
    () => adminApi.getDashboard(),
    config
  )
}

// ==========================================
// HEALTH CHECK HOOK
// ==========================================

export function useHealth(
  config?: SWRConfiguration<{
    status: string
    timestamp: string
    database: string
    environment: string
  }>
) {
  return useSWR(
    'health',
    () => healthApi.check(),
    {
      refreshInterval: 30000, // Check every 30 seconds
      ...config,
    }
  )
}
