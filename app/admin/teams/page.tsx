"use client"

import React, { useState } from "react"
import { useTeams } from "@/lib/api/hooks"
import { teamsApi, adminApi } from "@/lib/api/api-client"
import { mutate as globalMutate } from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Shield, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface TeamRankingType {
  winRank: number
  defRatingRank: number
  defRebRank: number
  stealRank: number
  blockRank: number
}

const emptyRanking: TeamRankingType = {
  winRank: 0,
  defRatingRank: 0,
  defRebRank: 0,
  stealRank: 0,
  blockRank: 0,
}

export default function AdminTeamsPage() {
  const { data: teamsData, mutate } = useTeams({ per_page: 100 })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [deletingTeam, setDeletingTeam] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [currentSeason, setCurrentSeason] = useState<'REGULAR' | 'PLAYOFF'>('REGULAR')

  // Team Rankings
  const [regularRanking, setRegularRanking] = useState<TeamRankingType>(emptyRanking)
  const [playoffRanking, setPlayoffRanking] = useState<TeamRankingType>(emptyRanking)

  const teams = teamsData?.data?.teams || []

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      teamID: parseInt(formData.get('teamID') as string),
      teamName: formData.get('teamName') as string,
      teamAbbreviation: formData.get('teamAbbreviation') as string,
      conference: formData.get('conference') as string,
      logoUrl: formData.get('logoUrl') as string,
    }

    try {
      await teamsApi.create(data)
      toast.success('Team created successfully')
      setIsCreateOpen(false)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTeam) return
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      teamName: formData.get('teamName') as string,
      teamAbbreviation: formData.get('teamAbbreviation') as string,
      conference: formData.get('conference') as string,
      logoUrl: formData.get('logoUrl') as string,
    }

    try {
      await teamsApi.update(editingTeam.teamID, data)
      toast.success('Team updated successfully')
      setEditingTeam(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTeam) return
    setIsSubmitting(true)

    try {
      await teamsApi.delete(deletingTeam.teamID)
      toast.success('Team deleted successfully')
      setDeletingTeam(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadTeamRanking = async (teamId: number, season: 'REGULAR' | 'PLAYOFF') => {
    try {
      const teamData = await teamsApi.getById(teamId, { season })

      console.log(`${season} Ranking Response:`, teamData)

      if (teamData?.data?.team?.stats) {
        const stats = teamData.data.team.stats
        const ranking: TeamRankingType = {
          winRank: stats.winRank || 0,
          defRatingRank: stats.defRatingRank || 0,
          defRebRank: stats.defRebRank || 0,
          stealRank: stats.stealRank || 0,
          blockRank: stats.blockRank || 0,
        }

        if (season === 'REGULAR') {
          setRegularRanking(ranking)
        } else {
          setPlayoffRanking(ranking)
        }
      } else {
        if (season === 'REGULAR') {
          setRegularRanking(emptyRanking)
        } else {
          setPlayoffRanking(emptyRanking)
        }
      }
    } catch (error) {
      console.error('Failed to load team ranking:', error)
    }
  }

  const handleSaveRanking = async () => {
    if (!editingTeam) return
    setIsSubmitting(true)
    try {
      const rankingData = currentSeason === 'REGULAR' ? regularRanking : playoffRanking

      const payload = {
        ...rankingData,
        season: currentSeason as 'REGULAR' | 'PLAYOFF'
      }

      console.log(`Saving ${currentSeason} ranking:`, payload)

      await adminApi.addTeamRanking(editingTeam.teamID, payload)

      toast.success(`${currentSeason} rankings saved successfully`)

      // Reload the rankings to show updated values
      await loadTeamRanking(editingTeam.teamID, currentSeason)

      // Invalidate all team-related caches
      mutate()
      globalMutate((key) => {
        if (Array.isArray(key) && key.includes('team')) return true
        if (Array.isArray(key) && key[0] === 'team') return true
        return false
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to save rankings')
    } finally {
      setIsSubmitting(false)
    }
  }

  const RankingInput = React.memo(({ label, id, value, onChange }: any) => {
    return (
      <div className="grid gap-1">
        <Label htmlFor={id} className="text-xs">{label}</Label>
        <Input
          id={id}
          type="number"
          step="1"
          value={value}
          onChange={onChange}
          className="h-8"
          autoComplete="off"
        />
      </div>
    )
  })

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Manage Teams</h1>
          <p className="text-muted-foreground">
            Create, edit, and delete NBA teams
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Add a new NBA team to the database
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="teamID">Team ID</Label>
                  <Input id="teamID" name="teamID" type="number" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" name="teamName" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="teamAbbreviation">Abbreviation</Label>
                  <Input id="teamAbbreviation" name="teamAbbreviation" maxLength={3} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="conference">Conference</Label>
                  <Select name="conference" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select conference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="East">Eastern</SelectItem>
                      <SelectItem value="West">Western</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input id="logoUrl" name="logoUrl" type="url" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Team'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.teamID}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {team.logoUrl ? (
                    <div className="relative h-12 w-12">
                      <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
                    </div>
                  ) : (
                    <Shield className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{team.teamName}</CardTitle>
                    <CardDescription>{team.teamAbbreviation}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingTeam(team)
                      setCurrentSeason('REGULAR')
                      setActiveTab("basic")
                      loadTeamRanking(team.teamID, 'REGULAR')
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingTeam(team)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge>{team.conference} Conference</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          setEditingTeam(null)
          setActiveTab("basic")
          setCurrentSeason('REGULAR')
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team information and rankings</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <form onSubmit={handleUpdate}>
                {editingTeam && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-teamName">Team Name</Label>
                      <Input
                        id="edit-teamName"
                        name="teamName"
                        defaultValue={editingTeam.teamName}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-teamAbbreviation">Abbreviation</Label>
                      <Input
                        id="edit-teamAbbreviation"
                        name="teamAbbreviation"
                        defaultValue={editingTeam.teamAbbreviation}
                        maxLength={3}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-conference">Conference</Label>
                      <Select name="conference" defaultValue={editingTeam.conference}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="East">Eastern</SelectItem>
                          <SelectItem value="West">Western</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-logoUrl">Logo URL</Label>
                      <Input
                        id="edit-logoUrl"
                        name="logoUrl"
                        type="url"
                        defaultValue={editingTeam.logoUrl}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingTeam(null)
                      setActiveTab("basic")
                      setCurrentSeason('REGULAR')
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Team'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
              <div className="grid gap-4 py-4">
                {/* Season Selection */}
                <div className="grid gap-2">
                  <Label>Season *</Label>
                  <Select
                    value={currentSeason}
                    onValueChange={(value: 'REGULAR' | 'PLAYOFF') => {
                      setCurrentSeason(value)
                      if (editingTeam) loadTeamRanking(editingTeam.teamID, value)
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

                {/* Rankings Form */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="font-semibold text-lg border-b pb-2 mb-4">
                    {currentSeason === 'REGULAR' ? 'Regular Season Rankings' : 'Playoff Rankings'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <RankingInput
                      label="Win Rank"
                      id={`${currentSeason}-winRank`}
                      value={currentSeason === 'REGULAR' ? regularRanking.winRank : playoffRanking.winRank}
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value) || 0
                        if (currentSeason === 'REGULAR') {
                          setRegularRanking({ ...regularRanking, winRank: value })
                        } else {
                          setPlayoffRanking({ ...playoffRanking, winRank: value })
                        }
                      }}
                    />
                    <RankingInput
                      label="Defensive Rating Rank"
                      id={`${currentSeason}-defRatingRank`}
                      value={currentSeason === 'REGULAR' ? regularRanking.defRatingRank : playoffRanking.defRatingRank}
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value) || 0
                        if (currentSeason === 'REGULAR') {
                          setRegularRanking({ ...regularRanking, defRatingRank: value })
                        } else {
                          setPlayoffRanking({ ...playoffRanking, defRatingRank: value })
                        }
                      }}
                    />
                    <RankingInput
                      label="Defensive Rebound Rank"
                      id={`${currentSeason}-defRebRank`}
                      value={currentSeason === 'REGULAR' ? regularRanking.defRebRank : playoffRanking.defRebRank}
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value) || 0
                        if (currentSeason === 'REGULAR') {
                          setRegularRanking({ ...regularRanking, defRebRank: value })
                        } else {
                          setPlayoffRanking({ ...playoffRanking, defRebRank: value })
                        }
                      }}
                    />
                    <RankingInput
                      label="Steal Rank"
                      id={`${currentSeason}-stealRank`}
                      value={currentSeason === 'REGULAR' ? regularRanking.stealRank : playoffRanking.stealRank}
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value) || 0
                        if (currentSeason === 'REGULAR') {
                          setRegularRanking({ ...regularRanking, stealRank: value })
                        } else {
                          setPlayoffRanking({ ...playoffRanking, stealRank: value })
                        }
                      }}
                    />
                    <RankingInput
                      label="Block Rank"
                      id={`${currentSeason}-blockRank`}
                      value={currentSeason === 'REGULAR' ? regularRanking.blockRank : playoffRanking.blockRank}
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value) || 0
                        if (currentSeason === 'REGULAR') {
                          setRegularRanking({ ...regularRanking, blockRank: value })
                        } else {
                          setPlayoffRanking({ ...playoffRanking, blockRank: value })
                        }
                      }}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingTeam(null)
                      setActiveTab("basic")
                      setCurrentSeason('REGULAR')
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRanking} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Rankings'}
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingTeam} onOpenChange={() => setDeletingTeam(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingTeam?.teamName} and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
