import { apiFetch } from './client'
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
  CreatePlayerDTO,
  UpdatePlayerDTO,
  CreateTeamDTO,
  UpdateTeamDTO,
  CreateFixtureDTO,
  UpdateFixtureDTO,
  CreateArenaDTO,
  UpdateArenaDTO,
  CreatePlayerStatsDTO,
  CreateTeamRankingDTO,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nba-backend-391303839683.europe-west1.run.app'

// Helper to build query params
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params).filter(([, value]) => value !== undefined)
  if (filtered.length === 0) return ''
  const query = new URLSearchParams(
    filtered.map(([key, value]) => [key, String(value)])
  ).toString()
  return `?${query}`
}

// ==========================================
// PLAYERS API
// ==========================================

export const playersApi = {
  /**
   * Get all players with optional pagination and filtering
   */
  getAll: async (params?: {
    page?: number
    per_page?: number
    team_id?: number
    position?: string
  }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<PlayersResponse>>(
      `${API_BASE_URL}/api/v1/players${query}`
    )
    return response
  },

  /**
   * Get a single player by ID with optional location and season filters
   */
  getById: async (id: number, params?: { location?: string; season?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<PlayerDetailResponse>>(
      `${API_BASE_URL}/api/v1/players/${id}${query}`
    )
    return response
  },

  /**
   * Search players by name
   */
  search: async (query: string) => {
    const response = await apiFetch<ApiResponse<PlayersResponse>>(
      `${API_BASE_URL}/api/v1/players/search?q=${encodeURIComponent(query)}`
    )
    return response
  },

  /**
   * Create a new player (admin only)
   */
  create: async (data: CreatePlayerDTO) => {
    const response = await apiFetch<ApiResponse<{ id: number }>>(
      `${API_BASE_URL}/api/v1/players`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Update a player (admin only)
   */
  update: async (id: number, data: UpdatePlayerDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/players/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Delete a player (admin only)
   */
  delete: async (id: number) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/players/${id}`,
      { method: 'DELETE' }
    )
    return response
  },
}

// ==========================================
// TEAMS API
// ==========================================

export const teamsApi = {
  /**
   * Get all teams with optional pagination and conference filtering
   */
  getAll: async (params?: { page?: number; per_page?: number; conference?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<TeamsResponse>>(
      `${API_BASE_URL}/api/v1/teams${query}`
    )
    return response
  },

  /**
   * Get team details including roster and stats
   */
  getById: async (id: number, params?: { season?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<TeamDetailResponse>>(
      `${API_BASE_URL}/api/v1/teams/${id}${query}`
    )
    return response
  },

  /**
   * Get team standings
   */
  getStandings: async (params?: { conference?: string; season?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<StandingsResponse>>(
      `${API_BASE_URL}/api/v1/teams/standings${query}`
    )
    return response
  },

  /**
   * Get team arena information
   */
  getArena: async (id: number) => {
    const response = await apiFetch<ApiResponse<ArenaResponse>>(
      `${API_BASE_URL}/api/v1/teams/${id}/arena`
    )
    return response
  },

  /**
   * Get team fixtures/schedule
   */
  getFixtures: async (id: number, params?: { limit?: number }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<FixturesResponse>>(
      `${API_BASE_URL}/api/v1/teams/${id}/fixtures${query}`
    )
    return response
  },

  /**
   * Create a new team (admin only)
   */
  create: async (data: CreateTeamDTO) => {
    const response = await apiFetch<ApiResponse<{ teamID: number }>>(
      `${API_BASE_URL}/api/v1/admin/teams`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Update a team (admin only)
   */
  update: async (id: number, data: UpdateTeamDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/teams/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Delete a team (admin only)
   */
  delete: async (id: number) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/teams/${id}`,
      { method: 'DELETE' }
    )
    return response
  },
}

// ==========================================
// FIXTURES API
// ==========================================

export const fixturesApi = {
  /**
   * Get all fixtures with optional filtering
   */
  getAll: async (params?: { page?: number; per_page?: number; round?: number; team?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<FixturesResponse>>(
      `${API_BASE_URL}/api/v1/fixtures${query}`
    )
    return response
  },

  /**
   * Get fixture details by ID
   */
  getById: async (id: number) => {
    const response = await apiFetch<ApiResponse<FixtureDetailResponse>>(
      `${API_BASE_URL}/api/v1/fixtures/${id}`
    )
    return response
  },

  /**
   * Create a new fixture (admin only)
   */
  create: async (data: CreateFixtureDTO) => {
    const response = await apiFetch<ApiResponse<{ matchID: number }>>(
      `${API_BASE_URL}/api/v1/admin/fixtures`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Update a fixture (admin only)
   */
  update: async (id: number, data: UpdateFixtureDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/fixtures/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Delete a fixture (admin only)
   */
  delete: async (id: number) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/fixtures/${id}`,
      { method: 'DELETE' }
    )
    return response
  },
}

// ==========================================
// ARENAS API
// ==========================================

export const arenasApi = {
  /**
   * Get all arenas
   */
  getAll: async () => {
    const response = await apiFetch<ApiResponse<ArenasResponse>>(
      `${API_BASE_URL}/api/v1/arenas`
    )
    return response
  },

  /**
   * Create a new arena (admin only)
   */
  create: async (data: CreateArenaDTO) => {
    const response = await apiFetch<ApiResponse<{ arenaDetailID: number }>>(
      `${API_BASE_URL}/api/v1/admin/arenas`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Update an arena (admin only)
   */
  update: async (id: number, data: UpdateArenaDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/arenas/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Delete an arena (admin only)
   */
  delete: async (id: number) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/arenas/${id}`,
      { method: 'DELETE' }
    )
    return response
  },
}

// ==========================================
// STATS API
// ==========================================

export const statsApi = {
  /**
   * Get league leaders for a specific category
   */
  getLeaders: async (params?: { category?: string; season?: string; limit?: number }) => {
    const query = params ? buildQueryString(params) : ''
    // Leaders endpoint returns LeadersResponse directly (with status, category, season, data)
    const response = await apiFetch<LeadersResponse>(
      `${API_BASE_URL}/api/v1/stats/leaders${query}`
    )
    return response
  },

  /**
   * Get complex stats query
   */
  getComplexStats: async () => {
    const response = await apiFetch<ApiResponse<any>>(
      `${API_BASE_URL}/api/v1/stats/complex`
    )
    return response
  },

  /**
   * Compare two teams
   */
  compareTeams: async (team1: number, team2: number, season?: string) => {
    const query = buildQueryString({ team1, team2, season })
    const response = await apiFetch<ApiResponse<ComparisonResponse>>(
      `${API_BASE_URL}/api/v1/stats/team-comparison${query}`
    )
    return response
  },
}

// ==========================================
// ADMIN API
// ==========================================

export const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  getDashboard: async () => {
    const response = await apiFetch<ApiResponse<AdminDashboardStats>>(
      `${API_BASE_URL}/api/v1/admin/dashboard`
    )
    return response
  },

  /**
   * Add/Update player statistics (admin only)
   */
  addPlayerStats: async (playerId: number, data: CreatePlayerStatsDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/players/${playerId}/stats`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },

  /**
   * Delete player statistics (admin only)
   */
  deletePlayerStats: async (playerId: number, params?: { season?: string; location?: string }) => {
    const query = params ? buildQueryString(params) : ''
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/players/${playerId}/stats${query}`,
      { method: 'DELETE' }
    )
    return response
  },

  /**
   * Add/Update team ranking (admin only)
   */
  addTeamRanking: async (teamId: number, data: CreateTeamRankingDTO) => {
    const response = await apiFetch<ApiResponse<null>>(
      `${API_BASE_URL}/api/v1/admin/teams/${teamId}/ranking`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return response
  },
}

// ==========================================
// HEALTH CHECK
// ==========================================

export const healthApi = {
  /**
   * Check API health status
   */
  check: async () => {
    const response = await apiFetch<{
      status: string
      timestamp: string
      database: string
      environment: string
    }>(`${API_BASE_URL}/api/v1/health`)
    return response
  },
}
