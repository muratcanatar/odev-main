"use client"

import React, { useState } from "react"
import { usePlayers, usePlayerSearch, useTeams } from "@/lib/api/hooks"
import type { Player } from "@/lib/api/types"
import { playersApi, adminApi } from "@/lib/api/api-client"
import { mutate as globalMutate } from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { User, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

type StatsType = {
  GP_X: number
  MIN_X: number
  PTS: number
  REB: number
  AST: number
  steal: number
  TOV: number
  FGM: number
  FGA: number
  FG_PCT: number
  FG3M: number
  FG3A: number
  FG3_PCT: number
  FTM: number
  FTA: number
  FT_PCT: number
  offensiveREB: number
  defensiveREB: number
  PF: number
  PLUS_MINUS: number
  efficiency: number
  // Additional fields for backend compatibility
  FG3M_total?: number
  FG3A_total?: number
}

const emptyStats: StatsType = {
  GP_X: 0, MIN_X: 0, PTS: 0, REB: 0, AST: 0, steal: 0, TOV: 0,
  FGM: 0, FGA: 0, FG_PCT: 0, FG3M: 0, FG3A: 0, FG3_PCT: 0,
  FTM: 0, FTA: 0, FT_PCT: 0, offensiveREB: 0, defensiveREB: 0,
  PF: 0, PLUS_MINUS: 0, efficiency: 0,
}

export default function AdminPlayersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const { data: playersData, mutate } = usePlayers({ page, per_page: 24 })
  const { data: searchData, isLoading: searchLoading } = usePlayerSearch(search, { revalidateOnFocus: false })
  const { data: teamsData } = useTeams({ per_page: 100 })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)
  const [deletingPlayer, setDeletingPlayer] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [currentSeason, setCurrentSeason] = useState<'REGULAR' | 'PLAYOFF'>('REGULAR')

  // Regular Season: HOME, AWAY, and OVERALL
  const [homeStats, setHomeStats] = useState<StatsType>(emptyStats)
  const [awayStats, setAwayStats] = useState<StatsType>(emptyStats)
  const [regularOverallStats, setRegularOverallStats] = useState<StatsType>(emptyStats)

  // Playoff: OVERALL only
  const [playoffStats, setPlayoffStats] = useState<StatsType>(emptyStats)

  const isSearching = search.length >= 2
  const players: Player[] = isSearching
    ? (Array.isArray(searchData?.data) ? searchData.data : [])
    : (playersData?.data?.players || [])
  const totalResults = isSearching ? (searchData?.results || 0) : (playersData?.pagination?.total_items || 0)
  const totalPages = isSearching ? 1 : (playersData?.pagination?.total_pages || 1)
  const teams = teamsData?.data?.teams || []

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      playerName: formData.get('playerName') as string,
      teamID: parseInt(formData.get('teamID') as string),
      position: formData.get('position') as string,
      headshotUrl: formData.get('headshotUrl') as string || undefined,
    }
    try {
      await playersApi.create(data)
      toast.success('Player created successfully')
      setIsCreateOpen(false)
      mutate()
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create player')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPlayer) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      playerName: formData.get('playerName') as string,
      teamID: parseInt(formData.get('teamID') as string),
      position: formData.get('position') as string,
      headshotUrl: formData.get('headshotUrl') as string || undefined,
    }
    try {
      await playersApi.update(editingPlayer.playerID, data)
      toast.success('Player updated successfully')
      setEditingPlayer(null)
      setActiveTab("basic")
      mutate()
      globalMutate((key) => Array.isArray(key) && key[0] === 'player' && key[1] === editingPlayer.playerID)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update player')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveStats = async () => {
    if (!editingPlayer) return
    setIsSubmitting(true)
    try {
      if (currentSeason === 'REGULAR') {
        // Save only HOME and AWAY for Regular Season
        // OVERALL is calculated automatically by backend (HOME + AWAY)
        const { FG3M_total, FG3A_total, ...cleanHomeStats } = homeStats
        const { FG3M_total: away_FG3M, FG3A_total: away_FG3A, ...cleanAwayStats } = awayStats

        const homePayload = {
          ...cleanHomeStats,
          teamID: editingPlayer.teamID,
          location: 'HOME',
          season: 'REGULAR' as 'REGULAR' | 'PLAYOFF'
        }
        const awayPayload = {
          ...cleanAwayStats,
          teamID: editingPlayer.teamID,
          location: 'AWAY',
          season: 'REGULAR' as 'REGULAR' | 'PLAYOFF'
        }

        console.log('Saving HOME stats:', homePayload)
        console.log('Saving AWAY stats:', awayPayload)

        await Promise.all([
          adminApi.addPlayerStats(editingPlayer.playerID, homePayload),
          adminApi.addPlayerStats(editingPlayer.playerID, awayPayload)
        ])
      } else {
        // Save OVERALL for Playoffs (no location for playoffs)
        const { FG3M_total, FG3A_total, ...cleanPlayoffStats } = playoffStats
        const playoffPayload = {
          ...cleanPlayoffStats,
          teamID: editingPlayer.teamID,
          location: 'OVERALL',
          season: 'PLAYOFF' as 'REGULAR' | 'PLAYOFF'
        }
        console.log('Saving PLAYOFF stats:', playoffPayload)
        await adminApi.addPlayerStats(editingPlayer.playerID, playoffPayload)
      }

      toast.success(`${currentSeason} statistics saved successfully`)

      // Reload the stats to show updated values
      await loadPlayerStats(editingPlayer.playerID, currentSeason)

      // Invalidate all player-related caches (both admin list and user detail pages)
      mutate() // Refresh admin players list
      globalMutate((key) => {
        // Invalidate all cache keys that include this player
        if (Array.isArray(key) && key.includes('player')) return true
        if (Array.isArray(key) && key[0] === 'player') return true
        return false
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to save statistics')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadPlayerStats = async (playerId: number, season: 'REGULAR' | 'PLAYOFF') => {
    try {
      if (season === 'REGULAR') {
        // Load HOME, AWAY, and OVERALL stats for Regular Season
        const [homeData, awayData, overallData] = await Promise.all([
          playersApi.getById(playerId, { location: 'HOME', season: 'REGULAR' }),
          playersApi.getById(playerId, { location: 'AWAY', season: 'REGULAR' }),
          playersApi.getById(playerId, { location: 'OVERALL', season: 'REGULAR' })
        ])

        console.log('HOME Stats Response:', homeData)
        console.log('AWAY Stats Response:', awayData)
        console.log('OVERALL Regular Stats Response:', overallData)

        if (homeData?.data?.player?.stats) {
          const stats = homeData.data.player.stats
          setHomeStats({
            GP_X: stats.GP_X || 0,
            MIN_X: stats.MIN_X || 0,
            PTS: stats.PTS || 0,
            REB: stats.REB || 0,
            AST: stats.AST || 0,
            steal: stats.steal || 0,
            TOV: stats.TOV || 0,
            FGM: stats.FGM || 0,
            FGA: stats.FGA || 0,
            FG_PCT: stats.FG_PCT || 0,
            FG3M: stats.FG3M || 0,
            FG3A: stats.FG3A || 0,
            FG3_PCT: stats.FG3_PCT || 0,
            FTM: stats.FTM || 0,
            FTA: stats.FTA || 0,
            FT_PCT: stats.FT_PCT || 0,
            offensiveREB: stats.offensiveREB || 0,
            defensiveREB: stats.defensiveREB || 0,
            PF: stats.PF || 0,
            PLUS_MINUS: stats.PLUS_MINUS || 0,
            efficiency: stats.efficiency || 0,
          })
        } else {
          setHomeStats(emptyStats)
        }

        if (awayData?.data?.player?.stats) {
          const stats = awayData.data.player.stats
          setAwayStats({
            GP_X: stats.GP_X || 0,
            MIN_X: stats.MIN_X || 0,
            PTS: stats.PTS || 0,
            REB: stats.REB || 0,
            AST: stats.AST || 0,
            steal: stats.steal || 0,
            TOV: stats.TOV || 0,
            FGM: stats.FGM || 0,
            FGA: stats.FGA || 0,
            FG_PCT: stats.FG_PCT || 0,
            FG3M: stats.FG3M || 0,
            FG3A: stats.FG3A || 0,
            FG3_PCT: stats.FG3_PCT || 0,
            FTM: stats.FTM || 0,
            FTA: stats.FTA || 0,
            FT_PCT: stats.FT_PCT || 0,
            offensiveREB: stats.offensiveREB || 0,
            defensiveREB: stats.defensiveREB || 0,
            PF: stats.PF || 0,
            PLUS_MINUS: stats.PLUS_MINUS || 0,
            efficiency: stats.efficiency || 0,
          })
        } else {
          setAwayStats(emptyStats)
        }

        if (overallData?.data?.player?.stats) {
          const stats = overallData.data.player.stats
          setRegularOverallStats({
            GP_X: stats.GP_X || 0,
            MIN_X: stats.MIN_X || 0,
            PTS: stats.PTS || 0,
            REB: stats.REB || 0,
            AST: stats.AST || 0,
            steal: stats.steal || 0,
            TOV: stats.TOV || 0,
            FGM: stats.FGM || 0,
            FGA: stats.FGA || 0,
            FG_PCT: stats.FG_PCT || 0,
            FG3M: stats.FG3M || 0,
            FG3A: stats.FG3A || 0,
            FG3_PCT: stats.FG3_PCT || 0,
            FTM: stats.FTM || 0,
            FTA: stats.FTA || 0,
            FT_PCT: stats.FT_PCT || 0,
            offensiveREB: stats.offensiveREB || 0,
            defensiveREB: stats.defensiveREB || 0,
            PF: stats.PF || 0,
            PLUS_MINUS: stats.PLUS_MINUS || 0,
            efficiency: stats.efficiency || 0,
          })
        } else {
          setRegularOverallStats(emptyStats)
        }
      } else {
        // Load OVERALL stats for Playoffs
        const playoffData = await playersApi.getById(playerId, { season: 'PLAYOFF' })

        console.log('PLAYOFF Stats Response:', playoffData)

        if (playoffData?.data?.player?.stats) {
          const stats = playoffData.data.player.stats
          setPlayoffStats({
            GP_X: stats.GP_X || 0,
            MIN_X: stats.MIN_X || 0,
            PTS: stats.PTS || 0,
            REB: stats.REB || 0,
            AST: stats.AST || 0,
            steal: stats.steal || 0,
            TOV: stats.TOV || 0,
            FGM: stats.FGM || 0,
            FGA: stats.FGA || 0,
            FG_PCT: stats.FG_PCT || 0,
            FG3M: stats.FG3M || 0,
            FG3A: stats.FG3A || 0,
            FG3_PCT: stats.FG3_PCT || 0,
            FTM: stats.FTM || 0,
            FTA: stats.FTA || 0,
            FT_PCT: stats.FT_PCT || 0,
            offensiveREB: stats.offensiveREB || 0,
            defensiveREB: stats.defensiveREB || 0,
            PF: stats.PF || 0,
            PLUS_MINUS: stats.PLUS_MINUS || 0,
            efficiency: stats.efficiency || 0,
          })
        } else {
          setPlayoffStats(emptyStats)
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingPlayer) return
    setIsSubmitting(true)
    try {
      await playersApi.delete(deletingPlayer.playerID)
      toast.success('Player deleted successfully')
      setDeletingPlayer(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete player')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StatsInput = React.memo(({ label, id, value, onChange, step = "0.1", disabled = false }: any) => {
    return (
      <div className="grid gap-1">
        <Label htmlFor={id} className="text-xs">{label}</Label>
        <Input
          id={id}
          type="number"
          step={step}
          value={value}
          onChange={onChange}
          className="h-8"
          autoComplete="off"
          disabled={disabled}
        />
      </div>
    )
  })

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Players</h1>
          <p className="text-muted-foreground">
            {totalResults} players total
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Player</DialogTitle>
                <DialogDescription>Add a new player to the database</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="playerName">Player Name *</Label>
                  <Input id="playerName" name="playerName" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamID">Team *</Label>
                  <Select name="teamID" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.teamID} value={team.teamID.toString()}>
                          {team.teamName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select name="position" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guard">Guard</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                      <SelectItem value="Center">Center</SelectItem>
                      <SelectItem value="Guard-Forward">Guard-Forward</SelectItem>
                      <SelectItem value="Forward-Guard">Forward-Guard</SelectItem>
                      <SelectItem value="Forward-Center">Forward-Center</SelectItem>
                      <SelectItem value="Center-Forward">Center-Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="headshotUrl">Headshot URL</Label>
                  <Input id="headshotUrl" name="headshotUrl" type="url" placeholder="https://..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Player'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players by name (min 2 characters)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-muted-foreground">
            {searchLoading ? "Searching..." : `Found ${players.length} player${players.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Card key={player.playerID}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {player.headshotUrl ? (
                    <div className="relative h-12 w-12">
                      <Image src={player.headshotUrl} alt={player.playerName} fill className="rounded-full object-cover" />
                    </div>
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="font-semibold">{player.playerName}</h3>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingPlayer(player)
                    setCurrentSeason('REGULAR')
                    loadPlayerStats(player.playerID, 'REGULAR')
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setDeletingPlayer(player)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {!isSearching && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <Button
                  key={i}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="min-w-[2.5rem]"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPlayer} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setEditingPlayer(null)
          setActiveTab("basic")
          setCurrentSeason('REGULAR')
        }
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information and statistics</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <form onSubmit={handleUpdate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-playerName">Player Name *</Label>
                    <Input id="edit-playerName" name="playerName" defaultValue={editingPlayer?.playerName} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-teamID">Team *</Label>
                    <Select name="teamID" defaultValue={editingPlayer?.teamID?.toString()} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.teamID} value={team.teamID.toString()}>
                            {team.teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-position">Position *</Label>
                    <Select name="position" defaultValue={editingPlayer?.position} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Guard">Guard</SelectItem>
                        <SelectItem value="Forward">Forward</SelectItem>
                        <SelectItem value="Center">Center</SelectItem>
                        <SelectItem value="Guard-Forward">Guard-Forward</SelectItem>
                        <SelectItem value="Forward-Guard">Forward-Guard</SelectItem>
                        <SelectItem value="Forward-Center">Forward-Center</SelectItem>
                        <SelectItem value="Center-Forward">Center-Forward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-headshotUrl">Headshot URL</Label>
                    <Input id="edit-headshotUrl" name="headshotUrl" type="url" defaultValue={editingPlayer?.headshotUrl} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPlayer(null)
                      setActiveTab("basic")
                      setCurrentSeason('REGULAR')
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Player'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <div className="grid gap-4 py-4">
                {/* Season Selection */}
                <div className="grid gap-2">
                  <Label>Season *</Label>
                  <Select
                    value={currentSeason}
                    onValueChange={(value: 'REGULAR' | 'PLAYOFF') => {
                      setCurrentSeason(value)
                      if (editingPlayer) loadPlayerStats(editingPlayer.playerID, value)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="REGULAR">Regular Season</SelectItem>
                      <SelectItem value="PLAYOFF">Playoffs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Regular Season: HOME, AWAY, and OVERALL in 3 columns */}
                {currentSeason === 'REGULAR' && (
                  <div className="grid grid-cols-3 gap-4">
                    {/* HOME Stats */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">HOME</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <StatsInput label="GP" id="home-gp" value={homeStats.GP_X} step="1" onChange={(e: any) => setHomeStats({ ...homeStats, GP_X: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="MIN" id="home-min" value={homeStats.MIN_X} onChange={(e: any) => setHomeStats({ ...homeStats, MIN_X: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="PTS" id="home-pts" value={homeStats.PTS} onChange={(e: any) => setHomeStats({ ...homeStats, PTS: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="REB" id="home-reb" value={homeStats.REB} onChange={(e: any) => setHomeStats({ ...homeStats, REB: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="AST" id="home-ast" value={homeStats.AST} onChange={(e: any) => setHomeStats({ ...homeStats, AST: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="STL" id="home-stl" value={homeStats.steal} onChange={(e: any) => setHomeStats({ ...homeStats, steal: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="TOV" id="home-tov" value={homeStats.TOV} onChange={(e: any) => setHomeStats({ ...homeStats, TOV: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="FG%" id="home-fg" value={homeStats.FG_PCT} step="0.001" onChange={(e: any) => setHomeStats({ ...homeStats, FG_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="3P%" id="home-3p" value={homeStats.FG3_PCT} step="0.001" onChange={(e: any) => setHomeStats({ ...homeStats, FG3_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="FT%" id="home-ft" value={homeStats.FT_PCT} step="0.001" onChange={(e: any) => setHomeStats({ ...homeStats, FT_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="EFF" id="home-eff" value={homeStats.efficiency} onChange={(e: any) => setHomeStats({ ...homeStats, efficiency: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>

                    {/* AWAY Stats */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">AWAY</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <StatsInput label="GP" id="away-gp" value={awayStats.GP_X} step="1" onChange={(e: any) => setAwayStats({ ...awayStats, GP_X: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="MIN" id="away-min" value={awayStats.MIN_X} onChange={(e: any) => setAwayStats({ ...awayStats, MIN_X: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="PTS" id="away-pts" value={awayStats.PTS} onChange={(e: any) => setAwayStats({ ...awayStats, PTS: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="REB" id="away-reb" value={awayStats.REB} onChange={(e: any) => setAwayStats({ ...awayStats, REB: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="AST" id="away-ast" value={awayStats.AST} onChange={(e: any) => setAwayStats({ ...awayStats, AST: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="STL" id="away-stl" value={awayStats.steal} onChange={(e: any) => setAwayStats({ ...awayStats, steal: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="TOV" id="away-tov" value={awayStats.TOV} onChange={(e: any) => setAwayStats({ ...awayStats, TOV: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="FG%" id="away-fg" value={awayStats.FG_PCT} step="0.001" onChange={(e: any) => setAwayStats({ ...awayStats, FG_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="3P%" id="away-3p" value={awayStats.FG3_PCT} step="0.001" onChange={(e: any) => setAwayStats({ ...awayStats, FG3_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="FT%" id="away-ft" value={awayStats.FT_PCT} step="0.001" onChange={(e: any) => setAwayStats({ ...awayStats, FT_PCT: parseFloat(e.target.value) || 0 })} />
                        <StatsInput label="EFF" id="away-eff" value={awayStats.efficiency} onChange={(e: any) => setAwayStats({ ...awayStats, efficiency: parseFloat(e.target.value) || 0 })} />
                      </div>
                    </div>

                    {/* OVERALL Stats (Read-only - calculated by backend) */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">OVERALL (Read-only)</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <StatsInput label="GP" id="overall-gp" value={regularOverallStats.GP_X} step="1" onChange={() => {}} disabled={true} />
                        <StatsInput label="MIN" id="overall-min" value={regularOverallStats.MIN_X} onChange={() => {}} disabled={true} />
                        <StatsInput label="PTS" id="overall-pts" value={regularOverallStats.PTS} onChange={() => {}} disabled={true} />
                        <StatsInput label="REB" id="overall-reb" value={regularOverallStats.REB} onChange={() => {}} disabled={true} />
                        <StatsInput label="AST" id="overall-ast" value={regularOverallStats.AST} onChange={() => {}} disabled={true} />
                        <StatsInput label="STL" id="overall-stl" value={regularOverallStats.steal} onChange={() => {}} disabled={true} />
                        <StatsInput label="TOV" id="overall-tov" value={regularOverallStats.TOV} onChange={() => {}} disabled={true} />
                        <StatsInput label="FG%" id="overall-fg" value={regularOverallStats.FG_PCT} step="0.001" onChange={() => {}} disabled={true} />
                        <StatsInput label="3P%" id="overall-3p" value={regularOverallStats.FG3_PCT} step="0.001" onChange={() => {}} disabled={true} />
                        <StatsInput label="FT%" id="overall-ft" value={regularOverallStats.FT_PCT} step="0.001" onChange={() => {}} disabled={true} />
                        <StatsInput label="EFF" id="overall-eff" value={regularOverallStats.efficiency} onChange={() => {}} disabled={true} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Playoff: OVERALL Stats (Single Column) */}
                {currentSeason === 'PLAYOFF' && (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="font-semibold text-lg border-b pb-2 mb-4">PLAYOFF STATS</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <StatsInput label="GP" id="playoff-gp" value={playoffStats.GP_X} step="1" onChange={(e: any) => setPlayoffStats({ ...playoffStats, GP_X: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="MIN" id="playoff-min" value={playoffStats.MIN_X} onChange={(e: any) => setPlayoffStats({ ...playoffStats, MIN_X: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="PTS" id="playoff-pts" value={playoffStats.PTS} onChange={(e: any) => setPlayoffStats({ ...playoffStats, PTS: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="REB" id="playoff-reb" value={playoffStats.REB} onChange={(e: any) => setPlayoffStats({ ...playoffStats, REB: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="AST" id="playoff-ast" value={playoffStats.AST} onChange={(e: any) => setPlayoffStats({ ...playoffStats, AST: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="STL" id="playoff-stl" value={playoffStats.steal} onChange={(e: any) => setPlayoffStats({ ...playoffStats, steal: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="TOV" id="playoff-tov" value={playoffStats.TOV} onChange={(e: any) => setPlayoffStats({ ...playoffStats, TOV: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="FG%" id="playoff-fg" value={playoffStats.FG_PCT} step="0.001" onChange={(e: any) => setPlayoffStats({ ...playoffStats, FG_PCT: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="3P%" id="playoff-3p" value={playoffStats.FG3_PCT} step="0.001" onChange={(e: any) => setPlayoffStats({ ...playoffStats, FG3_PCT: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="FT%" id="playoff-ft" value={playoffStats.FT_PCT} step="0.001" onChange={(e: any) => setPlayoffStats({ ...playoffStats, FT_PCT: parseFloat(e.target.value) || 0 })} />
                      <StatsInput label="EFF" id="playoff-eff" value={playoffStats.efficiency} onChange={(e: any) => setPlayoffStats({ ...playoffStats, efficiency: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button onClick={handleSaveStats} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : `Save ${currentSeason} Stats`}
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPlayer} onOpenChange={(open) => !open && setDeletingPlayer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingPlayer?.playerName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
