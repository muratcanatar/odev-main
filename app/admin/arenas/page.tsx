"use client"

import { useState } from "react"
import { useArenas, useTeams } from "@/lib/api/hooks"
import type { Arena } from "@/lib/api/types"
import { arenasApi } from "@/lib/api/api-client"
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
import { MapPin, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function AdminArenasPage() {
  const [page, setPage] = useState(1)
  const { data: arenasData, mutate } = useArenas()
  const { data: teamsData } = useTeams({ per_page: 100 })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingArena, setEditingArena] = useState<any>(null)
  const [deletingArena, setDeletingArena] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allArenas = (arenasData?.data?.arenas || []) as (Arena & { teamName?: string })[]
  const itemsPerPage = 24
  const totalResults = allArenas.length
  const totalPages = Math.ceil(totalResults / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const arenas = allArenas.slice(startIndex, startIndex + itemsPerPage)
  const teams = teamsData?.data?.teams || []

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      teamID: parseInt(formData.get('teamID') as string),
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      arena: formData.get('arena') as string || undefined,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
      latitude: parseFloat(formData.get('latitude') as string) || undefined,
      longitude: parseFloat(formData.get('longitude') as string) || undefined,
      us_time_zone: formData.get('us_time_zone') as string || undefined,
      division: formData.get('division') as string || undefined,
      elevation_m: parseFloat(formData.get('elevation_m') as string) || undefined,
    }
    try {
      await arenasApi.create(data)
      toast.success('Arena created successfully')
      setIsCreateOpen(false)
      mutate()
      e.currentTarget.reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create arena')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingArena) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      teamID: parseInt(formData.get('teamID') as string),
      city: formData.get('city') as string || undefined,
      state: formData.get('state') as string || undefined,
      arena: formData.get('arena') as string || undefined,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
      latitude: parseFloat(formData.get('latitude') as string) || undefined,
      longitude: parseFloat(formData.get('longitude') as string) || undefined,
      us_time_zone: formData.get('us_time_zone') as string || undefined,
      division: formData.get('division') as string || undefined,
      elevation_m: parseFloat(formData.get('elevation_m') as string) || undefined,
    }
    try {
      await arenasApi.update(editingArena.arenaDetailID, data)
      toast.success('Arena updated successfully')
      setEditingArena(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update arena')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingArena) return
    setIsSubmitting(true)
    try {
      await arenasApi.delete(deletingArena.arenaDetailID)
      toast.success('Arena deleted successfully')
      setDeletingArena(null)
      mutate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete arena')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Arenas</h1>
          <p className="text-muted-foreground">{totalResults} arenas total</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Arena
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Arena</DialogTitle>
                <DialogDescription>Add a new arena to the database</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="arena">Arena Name</Label>
                  <Input id="arena" name="arena" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" placeholder="e.g., CA" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" name="capacity" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" name="latitude" type="number" step="any" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" name="longitude" type="number" step="any" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="us_time_zone">Timezone</Label>
                  <Input id="us_time_zone" name="us_time_zone" placeholder="e.g., Eastern" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="division">Division</Label>
                  <Input id="division" name="division" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="elevation_m">Elevation (m)</Label>
                  <Input id="elevation_m" name="elevation_m" type="number" step="any" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Arena'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {arenas.map((arena) => (
          <Card key={arena.arenaDetailID}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{arena.arena || 'Unnamed Arena'}</h3>
                    <p className="text-sm text-muted-foreground">{arena.teamName}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {arena.city && arena.state && (
                  <p className="text-muted-foreground">
                    {arena.city}, {arena.state}
                  </p>
                )}
                {arena.capacity && (
                  <Badge variant="outline">Capacity: {arena.capacity.toLocaleString()}</Badge>
                )}
                {arena.division && (
                  <Badge variant="outline">{arena.division}</Badge>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingArena(arena)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setDeletingArena(arena)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
      <Dialog open={!!editingArena} onOpenChange={(open) => !open && setEditingArena(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Arena</DialogTitle>
              <DialogDescription>Update arena information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-teamID">Team *</Label>
                <Select name="teamID" defaultValue={editingArena?.teamID?.toString()} required>
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
                <Label htmlFor="edit-arena">Arena Name</Label>
                <Input id="edit-arena" name="arena" defaultValue={editingArena?.arena} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" name="city" defaultValue={editingArena?.city} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State</Label>
                <Input id="edit-state" name="state" defaultValue={editingArena?.state} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input id="edit-capacity" name="capacity" type="number" defaultValue={editingArena?.capacity} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input id="edit-latitude" name="latitude" type="number" step="any" defaultValue={editingArena?.latitude} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input id="edit-longitude" name="longitude" type="number" step="any" defaultValue={editingArena?.longitude} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-us_time_zone">Timezone</Label>
                <Input id="edit-us_time_zone" name="us_time_zone" defaultValue={editingArena?.us_time_zone} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-division">Division</Label>
                <Input id="edit-division" name="division" defaultValue={editingArena?.division} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-elevation_m">Elevation (m)</Label>
                <Input id="edit-elevation_m" name="elevation_m" type="number" step="any" defaultValue={editingArena?.elevation_m} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Arena'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingArena} onOpenChange={(open) => !open && setDeletingArena(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the arena "{deletingArena?.arena}". This action cannot be undone.
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
