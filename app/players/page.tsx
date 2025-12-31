"use client"

import { useState, useMemo } from "react"
import { usePlayers, usePlayerSearch, useTeams } from "@/lib/api/hooks"
import type { Player } from "@/lib/api/types"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PlayersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 24

  const { data: playersData, isLoading } = usePlayers({ page, per_page: perPage })
  const { data: searchData, isLoading: searchLoading } = usePlayerSearch(search)
  const { data: teamsData, isLoading: teamsLoading } = useTeams({ per_page: 100 })

  // Create a map of teamID to teamName for quick lookup
  const teamMap = useMemo(() => {
    const map = new Map<number, string>()
    teamsData?.data?.teams?.forEach((team) => {
      map.set(team.teamID, team.teamName)
    })
    return map
  }, [teamsData])

  const isSearching = search.length >= 2
  // Search API returns data as array directly, normal API returns data.players
  const players: Player[] = isSearching
    ? (Array.isArray(searchData?.data) ? searchData.data : [])
    : (playersData?.data?.players || [])
  const totalResults = isSearching ? (searchData?.results || 0) : (playersData?.pagination?.total_items || 0)
  const totalPages = isSearching ? 1 : (playersData?.pagination?.total_pages || 1)
  const currentLoading = isSearching ? searchLoading : isLoading

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">NBA Players</h1>
        <p className="text-muted-foreground">
          Browse all {totalResults} players in the league
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players by name (min 2 characters)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1) // Reset to page 1 when searching
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

      {currentLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {players?.map((player) => (
            <Link key={player.playerID} href={`/player/${player.playerID}`}>
              <Card className="transition-colors hover:bg-muted">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-center">
                    {player.headshotUrl ? (
                      <div className="relative h-20 w-20">
                        <Image
                          src={player.headshotUrl}
                          alt={player.playerName}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Users className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">{player.playerName}</h3>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                    <div className="mt-2">
                      {teamsLoading ? (
                        <div className="h-4 w-24 bg-muted rounded mx-auto animate-pulse" />
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {teamMap.get(player.teamID) || `Team #${player.teamID}`}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination - only show when not searching */}
      {!isSearching && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || currentLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
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
                  disabled={currentLoading}
                  className={page === pageNum ? "bg-slate-800" : ""}
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
            disabled={page === totalPages || currentLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Results info */}
      {!isSearching && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Showing {((page - 1) * perPage) + 1} - {Math.min(page * perPage, totalResults)} of {totalResults} players
        </p>
      )}
    </div>
  )
}
