"use client"

import { use } from "react"
import { useTeam } from "@/lib/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const teamId = parseInt(id)
  const { data: teamData, isLoading } = useTeam(teamId, { season: 'REGULAR' })

  const team = teamData?.data?.team

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Team not found</h1>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-6 rounded-lg border bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        {team.logoUrl ? (
          <div className="relative h-32 w-32 flex-shrink-0">
            <Image src={team.logoUrl} alt={team.teamName} fill className="object-contain" />
          </div>
        ) : (
          <Shield className="h-32 w-32 text-white" />
        )}
        <div className="flex-1">
          <h1 className="mb-2 text-4xl font-bold text-white">{team.teamName}</h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-base border-white text-white hover:bg-white/20">{team.teamAbbreviation}</Badge>
            <Badge className="text-base bg-white text-blue-700 hover:bg-white/90">{team.conference} Conference</Badge>
          </div>
        </div>
      </div>

      {team.stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{team.stats.winRank || 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Def Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{team.stats.defRatingRank || 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Steals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{team.stats.stealRank || 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{team.stats.blockRank || 'N/A'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Roster
          </CardTitle>
          <CardDescription>Current players and season averages</CardDescription>
        </CardHeader>
        <CardContent>
          {team.roster && team.roster.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.roster.map((player) => (
                <Link key={player.playerID} href={`/player/${player.playerID}`}>
                  <Card className="group transition-colors hover:bg-muted">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-3">
                        {player.headshotUrl ? (
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={player.headshotUrl}
                              alt={player.playerName}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold group-hover:text-blue-600">{player.playerName}</h4>
                          <p className="text-sm text-muted-foreground">{player.position}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">PPG</p>
                          <p className="font-semibold">{player.avg_pts?.toFixed(1) || '0.0'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">RPG</p>
                          <p className="font-semibold">{player.avg_reb?.toFixed(1) || '0.0'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">APG</p>
                          <p className="font-semibold">{player.avg_ast?.toFixed(1) || '0.0'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No roster data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
