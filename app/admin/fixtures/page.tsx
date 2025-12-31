"use client"

import { useState } from "react"
import { useFixtures, useArenas } from "@/lib/api/hooks"
import type { Fixture } from "@/lib/api/types"
import { fixturesApi } from "@/lib/api/api-client"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function AdminFixturesPage() {
  const [page, setPage] = useState(1)
  const { data: fixturesData, mutate } = useFixtures({ page, per_page: 24 })
  const { data: arenasData } = useArenas()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingFixture, setEditingFixture] = useState<any>(null)
  const [deletingFixture, setDeletingFixture] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fixtures: Fixture[] = fixturesData?.data?.fixtures || []
  const totalResults = fixturesData?.pagination?.total_items || 0
  const totalPages = fixturesData?.pagination?.total_pages || 1
  const arenas = arenasData?.data?.arenas || []

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      arenaDetailID: parseInt(formData.get('arenaDetailID') as string),
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      matchDate: formData.get('matchDate') as string,
      matchNumber: parseInt(formData.get('matchNumber') as string) || undefined,
      roundNumber: parseInt(formData.get('roundNumber') as string) || undefined,
      result: formData.get('result') as string || undefined,
    }
    try {
      await fixturesApi.create(data)
      toast.success('Fixture created successfully')
      setIsCreateOpen(false)
      mutate()
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create fixture')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingFixture) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      arenaDetailID: parseInt(formData.get('arenaDetailID') as string),
      homeTeam: formData.get('homeTeam') as string,
      awayTeam: formData.get('awayTeam') as string,
      matchDate: formData.get('matchDate') as string,
      matchNumber: parseInt(formData.get('matchNumber') as string) || undefined,
      roundNumber: parseInt(formData.get('roundNumber') as string) || undefined,
      result: formData.get('result') as string || undefined,
    }
    try {
      await fixturesApi.update(editingFixture.matchID, data)
      toast.success('Fixture updated successfully')
      setEditingFixture(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update fixture')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingFixture) return
    setIsSubmitting(true)
    try {
      await fixturesApi.delete(deletingFixture.matchID)
      toast.success('Fixture deleted successfully')
      setDeletingFixture(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete fixture')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Fixtures</h1>
          <p className="text-muted-foreground">{totalResults} fixtures total</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Fixture
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Fixture</DialogTitle>
                <DialogDescription>Add a new game to the schedule</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="homeTeam">Home Team *</Label>
                  <Input id="homeTeam" name="homeTeam" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="awayTeam">Away Team *</Label>
                  <Input id="awayTeam" name="awayTeam" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="matchDate">Match Date *</Label>
                  <Input id="matchDate" name="matchDate" type="datetime-local" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="arenaDetailID">Arena *</Label>
                  <Select name="arenaDetailID" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select arena" />
                    </SelectTrigger>
                    <SelectContent>
                      {arenas.map((arena) => (
                        <SelectItem key={arena.arenaDetailID} value={arena.arenaDetailID.toString()}>
                          {arena.arena} - {arena.teamName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="matchNumber">Match Number</Label>
                  <Input id="matchNumber" name="matchNumber" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roundNumber">Round Number</Label>
                  <Input id="roundNumber" name="roundNumber" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="result">Result</Label>
                  <Input id="result" name="result" placeholder="e.g., 110 - 105" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Fixture'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {fixtures.map((fixture) => (
          <Card key={fixture.matchID}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(fixture.matchDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {fixture.result && <Badge variant="outline">Score: {fixture.result}</Badge>}
                    {fixture.arena && <Badge variant="outline">{fixture.arena}</Badge>}
                    {fixture.city && <Badge variant="outline">{fixture.city}</Badge>}
                    {fixture.roundNumber && <Badge>Round {fixture.roundNumber}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFixture(fixture)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setDeletingFixture(fixture)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      <Dialog open={!!editingFixture} onOpenChange={(open) => !open && setEditingFixture(null)}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Fixture</DialogTitle>
              <DialogDescription>Update fixture information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-homeTeam">Home Team *</Label>
                <Input id="edit-homeTeam" name="homeTeam" defaultValue={editingFixture?.homeTeam} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-awayTeam">Away Team *</Label>
                <Input id="edit-awayTeam" name="awayTeam" defaultValue={editingFixture?.awayTeam} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-matchDate">Match Date *</Label>
                <Input
                  id="edit-matchDate"
                  name="matchDate"
                  type="datetime-local"
                  defaultValue={editingFixture?.matchDate ? new Date(editingFixture.matchDate).toISOString().slice(0, 16) : ''}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-arenaDetailID">Arena *</Label>
                <Select
                  name="arenaDetailID"
                  defaultValue={editingFixture?.arenaDetailID?.toString()}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select arena" />
                  </SelectTrigger>
                  <SelectContent>
                    {arenas.map((arena) => (
                      <SelectItem key={arena.arenaDetailID} value={arena.arenaDetailID.toString()}>
                        {arena.arena} - {arena.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-matchNumber">Match Number</Label>
                <Input id="edit-matchNumber" name="matchNumber" type="number" defaultValue={editingFixture?.matchNumber} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-roundNumber">Round Number</Label>
                <Input id="edit-roundNumber" name="roundNumber" type="number" defaultValue={editingFixture?.roundNumber} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-result">Result</Label>
                <Input id="edit-result" name="result" defaultValue={editingFixture?.result} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Fixture'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingFixture} onOpenChange={(open) => !open && setDeletingFixture(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the fixture "{deletingFixture?.homeTeam} vs {deletingFixture?.awayTeam}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
