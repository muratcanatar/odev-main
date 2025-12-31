"use client"

import { useState, useMemo } from "react"
import { useTeams, useArenas } from "@/lib/api/hooks"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Trophy, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TeamsPage() {
  const [conference, setConference] = useState<string | undefined>(undefined)
  const { data: teams, isLoading } = useTeams({ conference, per_page: 50 })
  const { data: arenasData } = useArenas()

  const allTeams = teams?.data?.teams || []
  const arenas = arenasData?.data?.arenas || []

  // Create a map of teamID to arena name
  const teamArenaMap = useMemo(() => {
    const map: Record<number, string> = {}
    arenas.forEach(arena => {
      if (arena.teamID && arena.arena) {
        map[arena.teamID] = arena.arena
      }
    })
    return map
  }, [arenas])

  const eastTeams = allTeams.filter(t => t.conference === 'East')
  const westTeams = allTeams.filter(t => t.conference === 'West')

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">NBA Teams</h1>
        <p className="text-muted-foreground">
          Browse all {teams?.results || 0} teams in the league
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setConference(v === 'all' ? undefined : v)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="East">Eastern Conference</TabsTrigger>
          <TabsTrigger value="West">Western Conference</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          {isLoading ? (
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
            <>
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                  <Trophy className="h-6 w-6 text-slate-600" />
                  Eastern Conference
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {eastTeams.map((team) => (
                    <Link key={team.teamID} href={`/team/${team.teamID}`}>
                      <Card className="group transition-colors hover:bg-muted">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center justify-center">
                            {team.logoUrl ? (
                              <div className="relative h-20 w-20">
                                <Image
                                  src={team.logoUrl}
                                  alt={team.teamName}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Shield className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold">{team.teamName}</h3>
                            <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                            {teamArenaMap[team.teamID] && (
                              <p className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {teamArenaMap[team.teamID]}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
                  <Trophy className="h-6 w-6 text-red-600" />
                  Western Conference
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {westTeams.map((team) => (
                    <Link key={team.teamID} href={`/team/${team.teamID}`}>
                      <Card className="group transition-colors hover:bg-muted">
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center justify-center">
                            {team.logoUrl ? (
                              <div className="relative h-20 w-20">
                                <Image
                                  src={team.logoUrl}
                                  alt={team.teamName}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Shield className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold">{team.teamName}</h3>
                            <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                            {teamArenaMap[team.teamID] && (
                              <p className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {teamArenaMap[team.teamID]}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="East">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {eastTeams.map((team) => (
              <Link key={team.teamID} href={`/team/${team.teamID}`}>
                <Card className="group transition-all hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                      {team.logoUrl ? (
                        <div className="relative h-20 w-20">
                          <Image
                            src={team.logoUrl}
                            alt={team.teamName}
                            fill
                            className="object-contain transition-transform group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                          <Shield className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{team.teamName}</h3>
                      <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="West">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {westTeams.map((team) => (
              <Link key={team.teamID} href={`/team/${team.teamID}`}>
                <Card className="group transition-all hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                      {team.logoUrl ? (
                        <div className="relative h-20 w-20">
                          <Image
                            src={team.logoUrl}
                            alt={team.teamName}
                            fill
                            className="object-contain transition-transform group-hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                          <Shield className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{team.teamName}</h3>
                      <p className="text-sm text-muted-foreground">{team.teamAbbreviation}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
